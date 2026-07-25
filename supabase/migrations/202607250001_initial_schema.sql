-- VyapaarSathi AI: Phase 1 / Supabase schema
-- Apply with: supabase db push (or paste into the Supabase SQL editor).
-- Amounts are stored in paise to avoid floating-point accounting errors.

begin;

create extension if not exists pg_trgm with schema extensions;

create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text check (display_name is null or char_length(btrim(display_name)) between 1 and 120),
  business_name text check (business_name is null or char_length(btrim(business_name)) between 1 and 160),
  phone text check (phone is null or char_length(btrim(phone)) between 7 and 20),
  gstin text check (
    gstin is null
    or gstin ~ '^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$'
  ),
  locale text not null default 'en' check (locale in ('en', 'hi')),
  timezone text not null default 'Asia/Kolkata' check (char_length(timezone) between 1 and 64),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.invoices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  invoice_number text not null check (invoice_number ~ '^[A-Z0-9][A-Z0-9/_-]{2,63}$'),
  status text not null default 'draft' check (status in ('draft', 'sent', 'partial', 'paid', 'overdue', 'void')),
  customer_name text not null check (char_length(btrim(customer_name)) between 1 and 160),
  customer_gstin text check (
    customer_gstin is null
    or customer_gstin ~ '^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$'
  ),
  invoice_date date not null default current_date,
  due_date date check (due_date is null or due_date >= invoice_date),
  currency char(3) not null default 'INR' check (currency = 'INR'),
  subtotal_paise bigint not null check (subtotal_paise >= 0),
  gst_rate numeric(5,2) not null default 18.00 check (gst_rate between 0 and 100),
  gst_amount_paise bigint generated always as (
    round((subtotal_paise::numeric * gst_rate) / 100)::bigint
  ) stored,
  total_paise bigint generated always as (
    subtotal_paise + round((subtotal_paise::numeric * gst_rate) / 100)::bigint
  ) stored,
  line_items jsonb not null default '[]'::jsonb check (jsonb_typeof(line_items) = 'array'),
  notes text check (notes is null or char_length(notes) <= 2_000),
  pdf_storage_path text,
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata) = 'object'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint invoices_user_invoice_number_key unique (user_id, invoice_number)
);

create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  source text not null default 'csv' check (source in ('csv', 'manual', 'api', 'webhook')),
  external_transaction_id text,
  normalized_transaction_id text generated always as (
    regexp_replace(lower(coalesce(external_transaction_id, '')), '[^a-z0-9]+', '', 'g')
  ) stored,
  amount_paise bigint not null check (amount_paise > 0),
  direction text not null check (direction in ('credit', 'debit')),
  transaction_at timestamptz not null,
  payer_name text check (payer_name is null or char_length(payer_name) <= 160),
  payer_upi_id text check (payer_upi_id is null or char_length(payer_upi_id) <= 255),
  merchant_name text check (merchant_name is null or char_length(merchant_name) <= 160),
  reconciliation_status text not null default 'unmatched'
    check (reconciliation_status in ('unmatched', 'matched', 'review', 'ignored')),
  matched_invoice_id uuid references public.invoices(id) on delete set null,
  match_confidence numeric(5,4) check (match_confidence is null or match_confidence between 0 and 1),
  anomaly_flags jsonb not null default '[]'::jsonb check (jsonb_typeof(anomaly_flags) = 'array'),
  raw_payload jsonb not null default '{}'::jsonb check (jsonb_typeof(raw_payload) = 'object'),
  import_batch_id uuid not null default gen_random_uuid(),
  import_file_name text check (import_file_name is null or char_length(import_file_name) <= 255),
  source_row_number integer check (source_row_number is null or source_row_number > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint matched_transaction_requires_invoice check (
    reconciliation_status <> 'matched' or matched_invoice_id is not null
  )
);

create table public.reminders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  invoice_id uuid references public.invoices(id) on delete set null,
  reminder_type text not null check (reminder_type in ('gst_filing', 'invoice_due', 'payment_follow_up')),
  reference_date date not null,
  scheduled_for timestamptz not null,
  status text not null default 'pending' check (status in ('pending', 'processing', 'sent', 'failed', 'cancelled')),
  channel text not null default 'in_app' check (channel in ('in_app', 'email', 'sms', 'whatsapp')),
  idempotency_key text not null check (char_length(btrim(idempotency_key)) between 1 and 128),
  message text check (message is null or char_length(message) <= 1_000),
  payload jsonb not null default '{}'::jsonb check (jsonb_typeof(payload) = 'object'),
  attempts smallint not null default 0 check (attempts between 0 and 20),
  last_attempt_at timestamptz,
  sent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint reminders_user_idempotency_key_key unique (user_id, idempotency_key),
  constraint sent_reminder_has_timestamp check (status <> 'sent' or sent_at is not null)
);

-- Dashboard, invoice lookup, worker-queue, and reconciliation query paths.
create index invoices_user_created_at_idx on public.invoices (user_id, created_at desc);
create index invoices_open_due_date_idx on public.invoices (user_id, due_date)
  where status in ('sent', 'partial', 'overdue');

create index transactions_user_transaction_at_idx on public.transactions (user_id, transaction_at desc);
create index transactions_unmatched_queue_idx on public.transactions (user_id, transaction_at desc)
  where reconciliation_status in ('unmatched', 'review');
create index transactions_matched_invoice_idx on public.transactions (matched_invoice_id)
  where matched_invoice_id is not null;
create unique index transactions_user_normalized_external_id_key
  on public.transactions (user_id, normalized_transaction_id)
  where normalized_transaction_id <> '';
create index transactions_normalized_external_id_trgm_idx on public.transactions
  using gin (normalized_transaction_id extensions.gin_trgm_ops)
  where normalized_transaction_id <> '';

create index reminders_dispatch_queue_idx on public.reminders (scheduled_for, id)
  where status = 'pending';
create index reminders_user_scheduled_for_idx on public.reminders (user_id, scheduled_for desc);

-- Keep timestamps server-owned; clients never need to submit them.
create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger users_set_updated_at
  before update on public.users
  for each row execute function public.set_updated_at();
create trigger invoices_set_updated_at
  before update on public.invoices
  for each row execute function public.set_updated_at();
create trigger transactions_set_updated_at
  before update on public.transactions
  for each row execute function public.set_updated_at();
create trigger reminders_set_updated_at
  before update on public.reminders
  for each row execute function public.set_updated_at();

-- A foreign key alone cannot ensure that an invoice belongs to the same tenant.
create function public.assert_transaction_invoice_owner()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.matched_invoice_id is not null and not exists (
    select 1
    from public.invoices invoice
    where invoice.id = new.matched_invoice_id
      and invoice.user_id = new.user_id
  ) then
    raise exception 'matched_invoice_id must belong to the transaction owner'
      using errcode = '23514';
  end if;
  return new;
end;
$$;

create function public.assert_reminder_invoice_owner()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.invoice_id is not null and not exists (
    select 1
    from public.invoices invoice
    where invoice.id = new.invoice_id
      and invoice.user_id = new.user_id
  ) then
    raise exception 'invoice_id must belong to the reminder owner'
      using errcode = '23514';
  end if;
  return new;
end;
$$;

create trigger transactions_validate_invoice_owner
  before insert or update of user_id, matched_invoice_id on public.transactions
  for each row execute function public.assert_transaction_invoice_owner();
create trigger reminders_validate_invoice_owner
  before insert or update of user_id, invoice_id on public.reminders
  for each row execute function public.assert_reminder_invoice_owner();

-- Profiles are provisioned when Supabase Auth creates the identity.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.users (id)
  values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger auth_user_profile_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

alter table public.users enable row level security;
alter table public.invoices enable row level security;
alter table public.transactions enable row level security;
alter table public.reminders enable row level security;

-- The browser client can only access rows it owns. The backend service role bypasses
-- RLS for privileged jobs such as PDF creation, CSV imports, and reminder dispatch.
create policy "users_select_own" on public.users for select to authenticated
  using ((select auth.uid()) = id);
create policy "users_insert_own" on public.users for insert to authenticated
  with check ((select auth.uid()) = id);
create policy "users_update_own" on public.users for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create policy "invoices_select_own" on public.invoices for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "invoices_insert_own" on public.invoices for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy "invoices_update_own" on public.invoices for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "invoices_delete_own" on public.invoices for delete to authenticated
  using ((select auth.uid()) = user_id);

create policy "transactions_select_own" on public.transactions for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "transactions_insert_own" on public.transactions for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy "transactions_update_own" on public.transactions for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "transactions_delete_own" on public.transactions for delete to authenticated
  using ((select auth.uid()) = user_id);

create policy "reminders_select_own" on public.reminders for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "reminders_insert_own" on public.reminders for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy "reminders_update_own" on public.reminders for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "reminders_delete_own" on public.reminders for delete to authenticated
  using ((select auth.uid()) = user_id);

grant usage on schema public to authenticated;
grant select, insert, update, delete on public.users, public.invoices, public.transactions, public.reminders to authenticated;
revoke all on public.users, public.invoices, public.transactions, public.reminders from anon;
revoke execute on function public.handle_new_user() from public;
revoke execute on function public.set_updated_at() from public;
revoke execute on function public.assert_transaction_invoice_owner() from public;
revoke execute on function public.assert_reminder_invoice_owner() from public;

commit;
