-- Create table to persist user reading preferences
create table if not exists public.user_books (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  book_id text not null,
  is_favorite boolean not null default false,
  has_read boolean not null default false,
  notes text,
  progress integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Ensure one row per user/book
create unique index if not exists user_books_user_book_unique on public.user_books (user_id, book_id);

-- Enable Row Level Security
alter table public.user_books enable row level security;

-- Policies
create policy "Users can view their own books"
  on public.user_books for select
  using (auth.uid() = user_id);

create policy "Users can insert their own books"
  on public.user_books for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own books"
  on public.user_books for update
  using (auth.uid() = user_id);

-- Trigger to maintain updated_at
create trigger if not exists user_books_set_updated_at
before update on public.user_books
for each row execute function public.update_updated_at_column();