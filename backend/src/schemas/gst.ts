import { z } from 'zod';

export const createGstReminderSchema = z.object({
  filingDueDate: z.coerce.date(),
  channel: z.enum(['in_app', 'email', 'sms', 'whatsapp']).default('in_app')
}).strict().superRefine((value, context) => {
  if (value.filingDueDate.getTime() <= Date.now()) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ['filingDueDate'], message: 'Filing due date must be in the future' });
  }
});
