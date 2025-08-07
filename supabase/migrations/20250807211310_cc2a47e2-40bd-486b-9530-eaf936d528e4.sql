-- Emotional Check-ins MVP

-- 1) Table for check-ins
create table if not exists public.ei_checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  mood text not null,
  energy integer not null,
  focus integer not null,
  note text,
  created_at timestamptz not null default now()
);

-- Useful index for queries
create index if not exists ei_checkins_user_created_idx on public.ei_checkins (user_id, created_at);

-- One check-in per user per day
create unique index if not exists ei_checkins_user_day_unique on public.ei_checkins (user_id, ((created_at at time zone 'utc')::date));

-- Enable RLS and policies
alter table public.ei_checkins enable row level security;
create policy if not exists "Users can view their own ei_checkins"
  on public.ei_checkins for select
  using (auth.uid() = user_id);
create policy if not exists "Users can insert their own ei_checkins"
  on public.ei_checkins for insert
  with check (auth.uid() = user_id);

-- 2) Add streak fields to progresso
alter table public.progresso
  add column if not exists ei_checkin_streak integer not null default 0,
  add column if not exists ei_last_checkin_date date;

-- 3) Trigger to update streak on new check-in
create or replace function public.update_ei_streak_on_checkin()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  last_date date;
  new_date date := (NEW.created_at at time zone 'utc')::date;
  current_streak int;
begin
  -- Lock user's progress row if it exists
  select ei_last_checkin_date, ei_checkin_streak into last_date, current_streak
  from public.progresso
  where user_id = NEW.user_id
  for update;

  if not found then
    insert into public.progresso(user_id, ei_checkin_streak, ei_last_checkin_date)
    values (NEW.user_id, 1, new_date);
    return NEW;
  end if;

  if last_date is null then
    update public.progresso
      set ei_checkin_streak = 1,
          ei_last_checkin_date = new_date,
          updated_at = now()
      where user_id = NEW.user_id;
  elsif new_date = last_date then
    update public.progresso
      set ei_last_checkin_date = new_date,
          updated_at = now()
      where user_id = NEW.user_id;
  elsif new_date = last_date + interval '1 day' then
    update public.progresso
      set ei_checkin_streak = coalesce(current_streak, 0) + 1,
          ei_last_checkin_date = new_date,
          updated_at = now()
      where user_id = NEW.user_id;
  else
    update public.progresso
      set ei_checkin_streak = 1,
          ei_last_checkin_date = new_date,
          updated_at = now()
      where user_id = NEW.user_id;
  end if;

  return NEW;
end;
$$;

-- Attach trigger
drop trigger if exists on_ei_checkins_after_insert on public.ei_checkins;
create trigger on_ei_checkins_after_insert
after insert on public.ei_checkins
for each row execute function public.update_ei_streak_on_checkin();