import path from 'node:path';
import { Router } from 'express';
import multer from 'multer';
import { parse } from 'csv-parse/sync';
import { requireUser } from '../middleware/auth.js';
import { AppError } from '../lib/errors.js';
import { importedTransactionSchema, type ImportedTransaction } from '../schemas/transaction.js';
import { importTransactions, reconcileOpenTransactions } from '../services/reconciliation.service.js';
import { supabaseAdmin } from '../lib/supabase.js';

const upload = multer({
  storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, callback) => callback(null, file.mimetype === 'text/csv' || file.originalname.toLowerCase().endsWith('.csv'))
});

const pick = (row: Record<string, string>, keys: string[]) => keys.map((key) => row[key]).find((value) => value?.trim());

function normalizeDirection(value: string | undefined): 'credit' | 'debit' | undefined {
  switch (value?.trim().toLowerCase()) {
    case 'credit': case 'cr': case 'c': return 'credit';
    case 'debit': case 'dr': case 'd': return 'debit';
    default: return undefined;
  }
}

function parseCsv(buffer: Buffer): { records: ImportedTransaction[]; rejected: Array<{ row: number; reason: string }> } {
  let rows: Record<string, string>[];
  try {
    rows = parse(buffer.toString('utf8'), { columns: true, bom: true, skip_empty_lines: true, trim: true, relax_column_count: false, max_record_size: 20_000 });
  } catch {
    throw new AppError(400, 'CSV is malformed or has inconsistent columns', 'INVALID_CSV');
  }
  if (rows.length > 500) throw new AppError(400, 'CSV may contain at most 500 data rows', 'CSV_TOO_LARGE');
  const records: ImportedTransaction[] = []; const rejected: Array<{ row: number; reason: string }> = [];
  rows.forEach((row, index) => {
    const normalized = Object.fromEntries(Object.entries(row).map(([key, value]) => [key.toLowerCase().replace(/[^a-z0-9]/g, ''), value]));
    const credit = pick(normalized, ['credit', 'creditamount']); const debit = pick(normalized, ['debit', 'debitamount']);
    const value = {
      transactionId: pick(normalized, ['transactionid', 'txnid', 'utr', 'referenceid']),
      amountPaise: pick(normalized, ['amount', 'transactionamount']) ?? credit ?? debit,
      direction: normalizeDirection(pick(normalized, ['direction', 'type', 'drcr']) ?? (credit ? 'credit' : debit ? 'debit' : undefined)),
      transactionAt: pick(normalized, ['transactiondate', 'date', 'datetime', 'timestamp']),
      payerName: pick(normalized, ['payername', 'sendername', 'name']),
      payerUpiId: pick(normalized, ['payerupiid', 'upiid', 'vpa']),
      merchantName: pick(normalized, ['merchantname', 'payee', 'receivername'])
    };
    const parsed = importedTransactionSchema.safeParse(value);
    if (parsed.success) records.push(parsed.data); else rejected.push({ row: index + 2, reason: parsed.error.issues[0]?.message ?? 'Invalid row' });
  });
  if (!records.length) throw new AppError(400, 'CSV has no valid transaction rows', 'INVALID_CSV');
  return { records, rejected };
}

export const upiRouter = Router();
upiRouter.use(requireUser);

upiRouter.post('/import', upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) throw new AppError(400, 'Attach one UTF-8 .csv file under 5 MB', 'CSV_REQUIRED');
    const fileName = path.basename(req.file.originalname).replace(/[^a-zA-Z0-9._-]/g, '_');
    const parsed = parseCsv(req.file.buffer);
    const result = await importTransactions(req.userId!, parsed.records, fileName);
    res.status(201).json({ data: { ...result, rejected: [...parsed.rejected, ...result.rejected] } });
  } catch (error) { next(error); }
});

upiRouter.post('/reconcile', async (req, res, next) => {
  try { res.json({ data: await reconcileOpenTransactions(req.userId!) }); } catch (error) { next(error); }
});

upiRouter.get('/transactions', async (req, res, next) => {
  try {
    const { data, error } = await supabaseAdmin.from('transactions').select('id, external_transaction_id, amount_paise, direction, transaction_at, payer_name, reconciliation_status, match_confidence, anomaly_flags').eq('user_id', req.userId!).order('transaction_at', { ascending: false }).limit(100);
    if (error) throw new AppError(502, 'Unable to load transactions', 'DATABASE_ERROR');
    res.json({ data });
  } catch (error) { next(error); }
});
