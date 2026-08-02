-- Migration: Unified Postgres Schema for Supabase & Neon Database Sync
-- Description: Sets up invoices, items, reconciliations, and GST ledger tables with zero-friction RLS access policies.

CREATE TABLE IF NOT EXISTS public.invoices (
    id TEXT PRIMARY KEY,
    customer_name TEXT NOT NULL,
    customer_phone TEXT,
    upi_vpa TEXT,
    total_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    amount_paid NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    balance_due NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    status TEXT NOT NULL DEFAULT 'OPEN',
    date TIMESTAMPTZ DEFAULT NOW(),
    due_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.invoice_items (
    id BIGSERIAL PRIMARY KEY,
    invoice_id TEXT REFERENCES public.invoices(id) ON DELETE CASCADE,
    item TEXT NOT NULL,
    qty NUMERIC(10,3) NOT NULL,
    unit TEXT,
    price NUMERIC(12,2) NOT NULL,
    total NUMERIC(12,2) NOT NULL,
    requires_manual_entry BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS public.reconciliations (
    id TEXT PRIMARY KEY,
    bank_format TEXT NOT NULL,
    raw_text TEXT NOT NULL,
    payer_name TEXT,
    amount NUMERIC(12,2),
    matched_invoice_id TEXT REFERENCES public.invoices(id) ON DELETE SET NULL,
    score NUMERIC(5,4),
    status TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.gst_ledger (
    id BIGSERIAL PRIMARY KEY,
    invoice_id TEXT REFERENCES public.invoices(id) ON DELETE CASCADE,
    cgst NUMERIC(12,2) DEFAULT 0.00,
    sgst NUMERIC(12,2) DEFAULT 0.00,
    igst NUMERIC(12,2) DEFAULT 0.00,
    hsn_code TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) with open public policy for zero-login Kirana operation
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reconciliations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gst_ledger ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on invoices" ON public.invoices FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on invoices" ON public.invoices FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on invoices" ON public.invoices FOR UPDATE USING (true);

CREATE POLICY "Allow public read access on invoice_items" ON public.invoice_items FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on invoice_items" ON public.invoice_items FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access on reconciliations" ON public.reconciliations FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on reconciliations" ON public.reconciliations FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access on gst_ledger" ON public.gst_ledger FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on gst_ledger" ON public.gst_ledger FOR INSERT WITH CHECK (true);
