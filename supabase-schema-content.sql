-- Content tables: replace localStorage so everyone sees the same data

create table public.articles (
  id text primary key,
  title text not null,
  category text not null,
  excerpt text,
  author text,
  date text,
  created_at timestamptz not null default now()
);

create table public.events (
  id text primary key,
  title text not null,
  date text not null,
  location text,
  description text,
  upcoming boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.professors (
  id text primary key,
  name text not null,
  title text,
  field text not null,
  bio text,
  image text,
  created_at timestamptz not null default now()
);

create table public.quizzes (
  id text primary key,
  title text not null,
  category text not null,
  passage text,
  questions jsonb not null default '[]',
  created_at timestamptz not null default now()
);

alter table public.articles enable row level security;
alter table public.events enable row level security;
alter table public.professors enable row level security;
alter table public.quizzes enable row level security;

-- Everyone can read. Writes are allowed at the DB level; the app UI
-- restricts write access to admin accounts only.
create policy "articles_read" on public.articles for select using (true);
create policy "articles_write" on public.articles for insert with check (true);
create policy "articles_update" on public.articles for update using (true);
create policy "articles_delete" on public.articles for delete using (true);

create policy "events_read" on public.events for select using (true);
create policy "events_write" on public.events for insert with check (true);
create policy "events_update" on public.events for update using (true);
create policy "events_delete" on public.events for delete using (true);

create policy "professors_read" on public.professors for select using (true);
create policy "professors_write" on public.professors for insert with check (true);
create policy "professors_update" on public.professors for update using (true);
create policy "professors_delete" on public.professors for delete using (true);

create policy "quizzes_read" on public.quizzes for select using (true);
create policy "quizzes_write" on public.quizzes for insert with check (true);
create policy "quizzes_update" on public.quizzes for update using (true);
create policy "quizzes_delete" on public.quizzes for delete using (true);
