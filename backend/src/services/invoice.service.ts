import PDFDocument from 'pdfkit';
import { randomUUID } from 'node:crypto';
import { AppError } from '../lib/errors.js';
import { supabaseAdmin } from '../lib/supabase.js';
import { env } from '../config/env.js';
import type { CreateInvoiceInput } from '../schemas/invoice.js';

const GST_RATE = 18;

function toIsoDate(value: Date | undefined): string | undefined {
  return value?.toISOString().slice(0, 10);
}

export function calculateSubtotalPaise(input: CreateInvoiceInput): number {
  return input.lineItems.reduce((total, item) => {
    const lineTotal = Math.round(item.quantity * item.unitPricePaise);
    if (!Number.isSafeInteger(lineTotal) || total > Number.MAX_SAFE_INTEGER - lineTotal) {
      throw new AppError(400, 'Invoice total is too large', 'INVALID_AMOUNT');
    }
    return total + lineTotal;
  }, 0);
}

export function createInvoiceNumber(): string {
  const date = new Date().toISOString().slice(0, 10).replaceAll('-', '');
  return `VS-${date}-${randomUUID().replaceAll('-', '').slice(0, 8).toUpperCase()}`;
}

function rupees(paise: number): string {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(paise / 100);
}

export async function renderInvoicePdf(invoice: {
  invoiceNumber: string; customerName: string; invoiceDate: string; dueDate?: string | null;
  lineItems: CreateInvoiceInput['lineItems']; subtotalPaise: number; gstAmountPaise: number; totalPaise: number; notes?: string | null;
}): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const document = new PDFDocument({ margin: 48, size: 'A4', info: { Title: invoice.invoiceNumber, Author: 'VyapaarSathi AI' } });
    const chunks: Buffer[] = [];
    document.on('data', (chunk: Buffer) => chunks.push(chunk));
    document.on('error', reject);
    document.on('end', () => resolve(Buffer.concat(chunks)));

    document.fillColor('#0F766E').fontSize(24).text('VyapaarSathi AI');
    document.fillColor('#111827').fontSize(11).text(`Invoice: ${invoice.invoiceNumber}`, { align: 'right' });
    document.text(`Invoice date: ${invoice.invoiceDate}`, { align: 'right' });
    if (invoice.dueDate) document.text(`Due date: ${invoice.dueDate}`, { align: 'right' });
    document.moveDown().fontSize(14).text(`Bill to: ${invoice.customerName}`);
    document.moveDown().fontSize(10);
    document.text('Description', 48).text('Qty', 320, document.y - 12).text('Amount', 430, document.y - 12);
    document.moveTo(48, document.y + 6).lineTo(548, document.y + 6).strokeColor('#D1D5DB').stroke();
    for (const item of invoice.lineItems) {
      document.moveDown(0.7).fillColor('#111827').text(item.description, 48, document.y, { width: 250 });
      document.text(String(item.quantity), 320, document.y - 12, { width: 80, align: 'right' });
      document.text(rupees(Math.round(item.quantity * item.unitPricePaise)), 430, document.y - 12, { width: 118, align: 'right' });
    }
    document.moveDown(1.5);
    const totalsX = 360;
    document.text('Subtotal', totalsX).text(rupees(invoice.subtotalPaise), 450, document.y - 12, { width: 98, align: 'right' });
    document.text(`GST (${GST_RATE}%)`, totalsX).text(rupees(invoice.gstAmountPaise), 450, document.y - 12, { width: 98, align: 'right' });
    document.font('Helvetica-Bold').text('Total', totalsX).text(rupees(invoice.totalPaise), 450, document.y - 12, { width: 98, align: 'right' });
    if (invoice.notes) document.moveDown(2).font('Helvetica').text(`Notes: ${invoice.notes}`);
    document.moveDown(3).fillColor('#6B7280').fontSize(9).text('Generated securely by VyapaarSathi AI. GST is calculated at 18%.', { align: 'center' });
    document.end();
  });
}

export async function createInvoice(userId: string, input: CreateInvoiceInput) {
  const subtotalPaise = calculateSubtotalPaise(input);
  const invoiceDate = toIsoDate(input.invoiceDate ?? new Date())!;
  const dueDate = toIsoDate(input.dueDate);
  let invoice: Record<string, unknown> | null = null;

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const { data, error } = await supabaseAdmin.from('invoices').insert({
      user_id: userId, invoice_number: createInvoiceNumber(), customer_name: input.customerName,
      customer_gstin: input.customerGstin, invoice_date: invoiceDate, due_date: dueDate,
      subtotal_paise: subtotalPaise, gst_rate: GST_RATE, line_items: input.lineItems, notes: input.notes, status: 'sent'
    }).select('id, invoice_number, customer_name, invoice_date, due_date, line_items, subtotal_paise, gst_amount_paise, total_paise, notes').single();
    if (!error) { invoice = data; break; }
    if (error.code !== '23505') throw new AppError(502, 'Unable to save invoice', 'DATABASE_ERROR');
  }
  if (!invoice) throw new AppError(503, 'Could not allocate a unique invoice number', 'INVOICE_ID_RETRY_EXHAUSTED');

  const typed = invoice as unknown as { id: string; invoice_number: string; customer_name: string; invoice_date: string; due_date: string | null; line_items: CreateInvoiceInput['lineItems']; subtotal_paise: number; gst_amount_paise: number; total_paise: number; notes: string | null };
  const pdf = await renderInvoicePdf({ invoiceNumber: typed.invoice_number, customerName: typed.customer_name, invoiceDate: typed.invoice_date, dueDate: typed.due_date, lineItems: typed.line_items, subtotalPaise: typed.subtotal_paise, gstAmountPaise: typed.gst_amount_paise, totalPaise: typed.total_paise, notes: typed.notes });
  const storagePath = `${userId}/${typed.id}.pdf`;
  const { error: uploadError } = await supabaseAdmin.storage.from(env.SUPABASE_INVOICE_BUCKET)
    .upload(storagePath, pdf, { contentType: 'application/pdf', upsert: false });
  if (uploadError) {
    await supabaseAdmin.from('invoices').delete().eq('id', typed.id).eq('user_id', userId);
    throw new AppError(502, 'Invoice PDF storage failed', 'STORAGE_ERROR');
  }
  const { error: updateError } = await supabaseAdmin.from('invoices').update({ pdf_storage_path: storagePath }).eq('id', typed.id).eq('user_id', userId);
  if (updateError) throw new AppError(502, 'Invoice PDF was created but its storage path could not be saved', 'DATABASE_ERROR');
  return { id: typed.id, invoiceNumber: typed.invoice_number, totalPaise: typed.total_paise, gstAmountPaise: typed.gst_amount_paise };
}

export async function createInvoicePdfUrl(userId: string, invoiceId: string) {
  const { data: invoice, error } = await supabaseAdmin.from('invoices').select('pdf_storage_path').eq('id', invoiceId).eq('user_id', userId).single();
  if (error || !invoice?.pdf_storage_path) throw new AppError(404, 'Invoice PDF not found', 'NOT_FOUND');
  const { data, error: signedUrlError } = await supabaseAdmin.storage.from(env.SUPABASE_INVOICE_BUCKET).createSignedUrl(invoice.pdf_storage_path, 600);
  if (signedUrlError || !data) throw new AppError(502, 'Unable to sign PDF URL', 'STORAGE_ERROR');
  return data.signedUrl;
}
