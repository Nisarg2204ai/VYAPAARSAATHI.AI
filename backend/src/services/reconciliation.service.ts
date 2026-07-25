import { AppError } from '../lib/errors.js';
import { supabaseAdmin } from '../lib/supabase.js';
import type { ImportedTransaction } from '../schemas/transaction.js';
import { randomUUID } from 'node:crypto';

const normalize = (value: string | null | undefined) => (value ?? '').toLowerCase().replace(/[^a-z0-9]/g, '');

function similarity(left: string, right: string): number {
  if (!left || !right) return 0;
  const a = normalize(left); const b = normalize(right);
  if (a === b) return 1;
  const previous = Array.from({ length: b.length + 1 }, (_, index) => index);
  for (let i = 1; i <= a.length; i += 1) {
    let diagonal = previous[0]; previous[0] = i;
    for (let j = 1; j <= b.length; j += 1) {
      const saved = previous[j];
      previous[j] = Math.min(previous[j] + 1, previous[j - 1] + 1, diagonal + (a[i - 1] === b[j - 1] ? 0 : 1));
      diagonal = saved;
    }
  }
  return 1 - previous[b.length] / Math.max(a.length, b.length);
}

export async function importTransactions(userId: string, records: ImportedTransaction[], fileName: string) {
  const batchId = randomUUID();
  const accepted: string[] = []; const duplicates: number[] = []; const rejected: Array<{ row: number; reason: string }> = [];
  for (const [index, record] of records.entries()) {
    const anomalies: string[] = [];
    if (record.transactionAt.getTime() > Date.now() + 5 * 60_000) anomalies.push('future_timestamp');
    const { data, error } = await supabaseAdmin.from('transactions').insert({
      user_id: userId, source: 'csv', external_transaction_id: record.transactionId || null,
      amount_paise: record.amountPaise, direction: record.direction, transaction_at: record.transactionAt.toISOString(),
      payer_name: record.payerName, payer_upi_id: record.payerUpiId, merchant_name: record.merchantName,
      anomaly_flags: anomalies, raw_payload: record, import_batch_id: batchId, import_file_name: fileName, source_row_number: index + 2
    }).select('id').single();
    if (data) { accepted.push(data.id); continue; }
    if (error?.code === '23505') { duplicates.push(index + 2); continue; }
    rejected.push({ row: index + 2, reason: 'Database rejected this row' });
  }
  return { batchId, imported: accepted.length, duplicates, rejected, transactionIds: accepted };
}

type TransactionCandidate = { id: string; amount_paise: number; payer_name: string | null; merchant_name: string | null; external_transaction_id: string | null };
type InvoiceCandidate = { id: string; invoice_number: string; customer_name: string; total_paise: number };

function score(transaction: TransactionCandidate, invoice: InvoiceCandidate): number {
  const amountScore = transaction.amount_paise === invoice.total_paise ? 0.72 : 0;
  const nameScore = Math.max(similarity(transaction.payer_name ?? '', invoice.customer_name), similarity(transaction.merchant_name ?? '', invoice.customer_name)) * 0.23;
  const referenceScore = similarity(transaction.external_transaction_id ?? '', invoice.invoice_number) * 0.05;
  return amountScore + nameScore + referenceScore;
}

export async function reconcileOpenTransactions(userId: string) {
  const [{ data: transactions, error: transactionError }, { data: invoices, error: invoiceError }] = await Promise.all([
    supabaseAdmin.from('transactions').select('id, amount_paise, payer_name, merchant_name, external_transaction_id').eq('user_id', userId).in('reconciliation_status', ['unmatched', 'review']).order('transaction_at', { ascending: false }).limit(250),
    supabaseAdmin.from('invoices').select('id, invoice_number, customer_name, total_paise').eq('user_id', userId).in('status', ['sent', 'partial', 'overdue']).limit(1_000)
  ]);
  if (transactionError || invoiceError) throw new AppError(502, 'Unable to load reconciliation candidates', 'DATABASE_ERROR');
  let matched = 0; let review = 0;
  for (const transaction of (transactions ?? []) as TransactionCandidate[]) {
    const ranked = ((invoices ?? []) as InvoiceCandidate[]).map((invoice) => ({ invoice, score: score(transaction, invoice) })).sort((a, b) => b.score - a.score);
    const best = ranked[0]; const ambiguous = best && ranked[1] && best.score - ranked[1].score < 0.1;
    if (best && best.score >= 0.85 && !ambiguous) {
      await supabaseAdmin.from('transactions').update({ reconciliation_status: 'matched', matched_invoice_id: best.invoice.id, match_confidence: best.score }).eq('id', transaction.id).eq('user_id', userId);
      matched += 1;
    } else if (best && best.score >= 0.55) {
      await supabaseAdmin.from('transactions').update({ reconciliation_status: 'review', match_confidence: best.score }).eq('id', transaction.id).eq('user_id', userId);
      review += 1;
    }
  }
  return { processed: transactions?.length ?? 0, matched, review };
}
