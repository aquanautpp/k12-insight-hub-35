-- Study cycles (plan + reflection)
create table if not exists public.study_cycles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  week_start date not null,
  goals jsonb not null default '[]'::jsonb,
  tasks jsonb not null default '[]'::jsonb,
  reflection text,
  self_rating integer check (self_rating >= 1 and self_rating <= 5),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, week_start)
);

alter table public.study_cycles enable row level security;

create policy "Users can view their own study_cycles"
  on public.study_cycles for select
  using (auth.uid() = user_id);

create policy "Users can insert their own study_cycles"
  on public.study_cycles for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own study_cycles"
  on public.study_cycles for update
  using (auth.uid() = user_id);

-- Review items (spaced practice)
create table if not exists public.review_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  item_id text not null,
  title text,
  last_reviewed timestamptz,
  next_review_at timestamptz,
  interval_days integer not null default 0,
  ease numeric not null default 2.5,
  repetitions integer not null default 0,
  successes integer not null default 0,
  failures integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, item_id)
);

create index if not exists idx_review_items_next_review on public.review_items (next_review_at);

alter table public.review_items enable row level security;

create policy "Users can view their own review_items"
  on public.review_items for select
  using (auth.uid() = user_id);

create policy "Users can insert their own review_items"
  on public.review_items for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own review_items"
  on public.review_items for update
  using (auth.uid() = user_id);

-- Reuse timestamp trigger
create trigger if not exists update_study_cycles_updated_at
  before update on public.study_cycles
  for each row execute function public.update_updated_at_column();

create trigger if not exists update_review_items_updated_at
  before update on public.review_items
  for each row execute function public.update_updated_at_column();