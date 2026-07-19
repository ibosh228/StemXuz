-- Add image support to articles
alter table public.articles add column if not exists image text;

-- Team members table for the About Us page
create table public.team_members (
  id text primary key,
  name text not null,
  title text,
  bio text,
  image text,
  linkedin text,
  instagram text,
  telegram text,
  website text,
  created_at timestamptz not null default now()
);

alter table public.team_members enable row level security;

create policy "team_members_read" on public.team_members for select using (true);
create policy "team_members_write" on public.team_members for insert with check (true);
create policy "team_members_update" on public.team_members for update using (true);
create policy "team_members_delete" on public.team_members for delete using (true);
