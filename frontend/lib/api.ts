'use client';
import { supabase } from './supabase';

export type Invoice = { id: string; invoice_number: string; customer_name: string; status: string; invoice_date: string; total_paise: number; gst_amount_paise: number };
export type Transaction = { id: string; external_transaction_id: string | null; amount_paise: number; direction: string; transaction_at: string; payer_name: string | null; reconciliation_status: string; match_confidence: number | null; anomaly_flags: string[] };

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  if (!supabase) throw new Error('Supabase browser configuration is missing');
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error('AUTH_REQUIRED');
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? '';
  const response = await fetch(`${baseUrl}${path}`, {
    ...init, headers: { authorization: `Bearer ${token}`, ...(init.body instanceof FormData ? {} : { 'content-type': 'application/json' }), ...init.headers }
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error?.message ?? 'Request failed');
  return body.data as T;
}

export const api = {
  invoices: () => request<Invoice[]>('/api/invoices'),
  transactions: () => request<Transaction[]>('/api/upi/transactions'),
  createInvoice: (input: unknown) => request<{ id: string; invoiceNumber: string; totalPaise: number }>('/api/invoices', { method: 'POST', body: JSON.stringify(input) }),
  uploadCsv: (file: File) => { const data = new FormData(); data.set('file', file); return request<{ imported: number; duplicates: number[]; rejected: Array<{ row: number; reason: string }> }>('/api/upi/import', { method: 'POST', body: data }); },
  reconcile: () => request<{ processed: number; matched: number; review: number }>('/api/upi/reconcile', { method: 'POST' })
};
