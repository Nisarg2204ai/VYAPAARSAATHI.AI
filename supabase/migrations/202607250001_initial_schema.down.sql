-- Roll back Phase 1 only in a disposable/dev database.
-- Production rollback should be a forward migration to preserve accounting records.

begin;

drop trigger if exists auth_user_profile_created on auth.users;
drop trigger if exists reminders_validate_invoice_owner on public.reminders;
drop trigger if exists transactions_validate_invoice_owner on public.transactions;
drop trigger if exists reminders_set_updated_at on public.reminders;
drop trigger if exists transactions_set_updated_at on public.transactions;
drop trigger if exists invoices_set_updated_at on public.invoices;
drop trigger if exists users_set_updated_at on public.users;

drop function if exists public.handle_new_user();
drop function if exists public.assert_reminder_invoice_owner();
drop function if exists public.assert_transaction_invoice_owner();
drop function if exists public.set_updated_at();

drop table if exists public.reminders;
drop table if exists public.transactions;
drop table if exists public.invoices;
drop table if exists public.users;

commit;
