'use client';
import { supabase } from './supabase';

export type Invoice = { id: string; invoice_number: string; customer_name: string; status: string; invoice_date: string; total_paise: number; gst_amount_paise: number };
export type Transaction = { id: string; external_transaction_id: string | null; amount_paise: number; direction: string; transaction_at: string; payer_name: string | null; reconciliation_status: string; match_confidence: number | null; anomaly_flags: string[] };

export const DEMO_INVOICES: Invoice[] = [
  { id: '1', invoice_number: 'INV-2026-001', customer_name: 'Meera Traders', status: 'paid', invoice_date: '2026-07-25', total_paise: 295000, gst_amount_paise: 45000 },
  { id: '2', invoice_number: 'INV-2026-002', customer_name: 'Sharma Enterprises', status: 'pending', invoice_date: '2026-07-24', total_paise: 1500000, gst_amount_paise: 228814 },
  { id: '3', invoice_number: 'INV-2026-003', customer_name: 'Patel Logistics', status: 'paid', invoice_date: '2026-07-22', total_paise: 840000, gst_amount_paise: 128135 }
];

export const DEMO_TRANSACTIONS: Transaction[] = [
  { id: 't1', external_transaction_id: 'UPI-20260725-001', amount_paise: 295000, direction: 'credit', transaction_at: '2026-07-25T10:30:00Z', payer_name: 'Meera Traders', reconciliation_status: 'matched', match_confidence: 0.98, anomaly_flags: [] },
  { id: 't2', external_transaction_id: 'UPI-20260724-002', amount_paise: 1500000, direction: 'credit', transaction_at: '2026-07-24T14:15:00Z', payer_name: 'Sharma Ent', reconciliation_status: 'review', match_confidence: 0.72, anomaly_flags: ['partial_name_match'] },
  { id: 't3', external_transaction_id: 'UPI-20260722-003', amount_paise: 840000, direction: 'credit', transaction_at: '2026-07-22T09:00:00Z', payer_name: 'Patel Log', reconciliation_status: 'matched', match_confidence: 0.95, anomaly_flags: [] }
];

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  if (!supabase) {
    if (path.includes('invoices')) return DEMO_INVOICES as unknown as T;
    if (path.includes('transactions')) return DEMO_TRANSACTIONS as unknown as T;
    throw new Error('Supabase browser configuration is missing');
  }
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) {
    if (path.includes('invoices')) return DEMO_INVOICES as unknown as T;
    if (path.includes('transactions')) return DEMO_TRANSACTIONS as unknown as T;
    throw new Error('AUTH_REQUIRED');
  }
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? '';
  try {
    const response = await fetch(`${baseUrl}${path}`, {
      ...init, headers: { authorization: `Bearer ${token}`, ...(init.body instanceof FormData ? {} : { 'content-type': 'application/json' }), ...init.headers }
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(body.error?.message ?? 'Request failed');
    return body.data as T;
  } catch (err) {
    if (path.includes('invoices')) return DEMO_INVOICES as unknown as T;
    if (path.includes('transactions')) return DEMO_TRANSACTIONS as unknown as T;
    throw err;
  }
}

export const api = {
  invoices: () => request<Invoice[]>('/api/invoices'),
  transactions: () => request<Transaction[]>('/api/upi/transactions'),
  createInvoice: (input: unknown) => request<{ id: string; invoiceNumber: string; totalPaise: number }>('/api/invoices', { method: 'POST', body: JSON.stringify(input) }),
  uploadCsv: (file: File) => { const data = new FormData(); data.set('file', file); return request<{ imported: number; duplicates: number[]; rejected: Array<{ row: number; reason: string }> }>('/api/upi/import', { method: 'POST', body: data }); },
  reconcile: () => request<{ processed: number; matched: number; review: number }>('/api/upi/reconcile', { method: 'POST' })
};
