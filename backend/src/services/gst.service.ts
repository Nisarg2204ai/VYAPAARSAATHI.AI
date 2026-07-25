import { AppError } from '../lib/errors.js';
import { logger } from '../lib/logger.js';
import { supabaseAdmin } from '../lib/supabase.js';
import { env } from '../config/env.js';

type ReminderChannel = 'in_app' | 'email' | 'sms' | 'whatsapp';

function reminderSchedule(dueDate: Date): Date {
  // 09:00 IST, three calendar days before the filing deadline.
  return new Date(Date.UTC(dueDate.getUTCFullYear(), dueDate.getUTCMonth(), dueDate.getUTCDate() - 3, 3, 30));
}

export async function scheduleGstReminder(userId: string, filingDueDate: Date, channel: ReminderChannel) {
  const due = filingDueDate.toISOString().slice(0, 10);
  const month = due.slice(0, 7);
  const { data, error } = await supabaseAdmin.from('reminders').upsert({
    user_id: userId, reminder_type: 'gst_filing', reference_date: due,
    scheduled_for: reminderSchedule(filingDueDate).toISOString(), channel,
    idempotency_key: `gst_filing:${month}`,
    message: `GST filing is due on ${due}. Please file it within three days.`,
    payload: { filingDueDate: due }
  }, { onConflict: 'user_id,idempotency_key' }).select('id, scheduled_for, status').single();
  if (error) throw new AppError(502, 'Unable to schedule GST reminder', 'DATABASE_ERROR');
  return data;
}

async function dispatch(channel: string, reminder: Record<string, unknown>) {
  if (channel === 'in_app') return;
  if (!env.NOTIFICATION_WEBHOOK_URL) throw new Error('NOTIFICATION_WEBHOOK_URL is required for external alerts');
  const response = await fetch(env.NOTIFICATION_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ channel, reminder }),
    signal: AbortSignal.timeout(8_000)
  });
  if (!response.ok) throw new Error(`Notification provider returned ${response.status}`);
}

export async function runDueReminderJob() {
  const { data: due, error } = await supabaseAdmin.from('reminders')
    .select('id, user_id, channel, message, payload, attempts')
    .eq('status', 'pending').lte('scheduled_for', new Date().toISOString()).order('scheduled_for').limit(100);
  if (error) throw new AppError(502, 'Unable to load reminder queue', 'DATABASE_ERROR');

  let sent = 0; let failed = 0; let skipped = 0;
  for (const reminder of due ?? []) {
    const { data: claimed, error: claimError } = await supabaseAdmin.from('reminders')
      .update({ status: 'processing', last_attempt_at: new Date().toISOString(), attempts: reminder.attempts + 1 })
      .eq('id', reminder.id).eq('status', 'pending').select('id').maybeSingle();
    if (claimError || !claimed) { skipped += 1; continue; }
    try {
      await dispatch(reminder.channel, reminder);
      const { error: sentError } = await supabaseAdmin.from('reminders').update({ status: 'sent', sent_at: new Date().toISOString() }).eq('id', reminder.id);
      if (sentError) throw sentError;
      sent += 1;
    } catch (error) {
      const terminal = reminder.attempts + 1 >= 3;
      await supabaseAdmin.from('reminders').update({ status: terminal ? 'failed' : 'pending' }).eq('id', reminder.id);
      logger.warn({ err: error, reminderId: reminder.id }, 'reminder delivery failed');
      failed += 1;
    }
  }
  return { examined: due?.length ?? 0, sent, failed, skipped };
}
