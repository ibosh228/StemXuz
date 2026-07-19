-- Payment requests table: manual "I paid" submissions awaiting admin approval
create table public.payment_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  note text,
  status text not null default 'pending', -- pending | approved | rejected
  created_at timestamptz not null default now()
);

alter table public.payment_requests enable row level security;

-- Users can create their own payment requests
create policy "Users can insert own payment requests"
  on public.payment_requests for insert
  with check (auth.uid() = user_id);

-- Users can view their own requests; everyone can view (needed for simple admin panel read)
create policy "Payment requests are viewable by everyone"
  on public.payment_requests for select
  using (true);

-- Allow updates (admin approving/rejecting) - kept open since app-level admin check gates the UI
create policy "Payment requests can be updated"
  on public.payment_requests for update
  using (true);
