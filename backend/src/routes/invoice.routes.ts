import { Router } from 'express';
import { z } from 'zod';
import { requireUser } from '../middleware/auth.js';
import { createInvoice, createInvoicePdfUrl } from '../services/invoice.service.js';
import { createInvoiceSchema } from '../schemas/invoice.js';
import { supabaseAdmin } from '../lib/supabase.js';
import { AppError } from '../lib/errors.js';

export const invoiceRouter = Router();
invoiceRouter.use(requireUser);

invoiceRouter.get('/', async (req, res, next) => {
  try {
    const { data, error } = await supabaseAdmin.from('invoices').select('id, invoice_number, customer_name, status, invoice_date, due_date, total_paise, gst_amount_paise, created_at').eq('user_id', req.userId!).order('created_at', { ascending: false }).limit(100);
    if (error) throw new AppError(502, 'Unable to load invoices', 'DATABASE_ERROR');
    res.json({ data });
  } catch (error) { next(error); }
});

invoiceRouter.post('/', async (req, res, next) => {
  try {
    const input = createInvoiceSchema.parse(req.body);
    const invoice = await createInvoice(req.userId!, input);
    res.status(201).json({ data: invoice });
  } catch (error) { next(error); }
});

invoiceRouter.get('/:id/pdf', async (req, res, next) => {
  try {
    const id = z.string().uuid().parse(req.params.id);
    const signedUrl = await createInvoicePdfUrl(req.userId!, id);
    res.json({ data: { signedUrl, expiresInSeconds: 600 } });
  } catch (error) { next(error); }
});
