import { Router } from 'express';
import { createGstReminderSchema } from '../schemas/gst.js';
import { requireCronSecret, requireUser } from '../middleware/auth.js';
import { runDueReminderJob, scheduleGstReminder } from '../services/gst.service.js';

export const gstRouter = Router();

gstRouter.post('/reminders', requireUser, async (req, res, next) => {
  try {
    const input = createGstReminderSchema.parse(req.body);
    const reminder = await scheduleGstReminder(req.userId!, input.filingDueDate, input.channel);
    res.status(201).json({ data: reminder });
  } catch (error) { next(error); }
});

gstRouter.post('/cron', requireCronSecret, async (_req, res, next) => {
  try {
    const result = await runDueReminderJob();
    res.json({ data: result });
  } catch (error) { next(error); }
});
