import { z } from 'zod';

const parseAmountToPaise = (value: unknown): unknown => {
  if (typeof value === 'number') return Math.round(value * 100);
  if (typeof value !== 'string') return value;
  const normalized = value.replace(/[₹,\s]/g, '').replace(/\((.*)\)/, '-$1');
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? Math.round(parsed * 100) : value;
};

export const importedTransactionSchema = z.object({
  transactionId: z.string().trim().max(255).optional(),
  amountPaise: z.preprocess(parseAmountToPaise, z.number().int().positive().max(100_000_000_00)),
  direction: z.enum(['credit', 'debit']),
  transactionAt: z.coerce.date(),
  payerName: z.string().trim().max(160).optional(),
  payerUpiId: z.string().trim().max(255).optional(),
  merchantName: z.string().trim().max(160).optional()
}).strict();

export type ImportedTransaction = z.infer<typeof importedTransactionSchema>;
