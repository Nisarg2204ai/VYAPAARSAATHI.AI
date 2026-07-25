import { z } from 'zod';

const paise = z.coerce.number().int().positive().max(100_000_000_00);

export const invoiceLineSchema = z.object({
  description: z.string().trim().min(1).max(240),
  quantity: z.coerce.number().positive().max(100_000),
  unitPricePaise: paise
}).strict();

export const createInvoiceSchema = z.object({
  customerName: z.string().trim().min(1).max(160),
  customerGstin: z.string().trim().toUpperCase().regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/).optional(),
  invoiceDate: z.coerce.date().optional(),
  dueDate: z.coerce.date().optional(),
  lineItems: z.array(invoiceLineSchema).min(1).max(100),
  notes: z.string().trim().max(2_000).optional()
}).strict().superRefine((value, context) => {
  if (value.invoiceDate && value.dueDate && value.dueDate.getTime() < value.invoiceDate.getTime()) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ['dueDate'], message: 'Due date cannot be before invoice date' });
  }
});

export type CreateInvoiceInput = z.infer<typeof createInvoiceSchema>;
