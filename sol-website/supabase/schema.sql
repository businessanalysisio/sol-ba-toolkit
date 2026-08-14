-- Sol — Supabase schema
-- Run in the Supabase SQL editor (or via `supabase db push`).

-- Users (mirrors auth.users; populated by trigger on signup)
create table if not exists public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  name text,
  created_at timestamptz not null default now(),
  subscription_tier text not null default 'free' check (subscription_tier in ('free', 'pro'))
);

create table if not exists public.learning_paths (
  id text primary key,
  title text not null,
  description text,
  "order" integer not null default 0,
  level text check (level in ('Foundation', 'Intermediate', 'Advanced')),
  duration text,
  accent text
);

create table if not exists public.modules (
  id text primary key,
  path_id text not null references public.learning_paths (id) on delete cascade,
  title text not null,
  content text default '',
  "order" integer not null default 0
);

create table if not exists public.user_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  module_id text not null references public.modules (id) on delete cascade,
  completed_at timestamptz,
  score integer check (score between 0 and 100),
  unique (user_id, module_id)
);

create table if not exists public.frameworks (
  id text primary key,
  name text not null,
  category text check (category in ('Strategy', 'Requirements', 'Customer', 'Process')),
  description text,
  use_cases text[] default '{}',
  best_for text,
  steps text[] default '{}'
);

create table if not exists public.testimonials (
  id text primary key,
  name text not null,
  role text,
  company text,
  quote text not null,
  avatar_url text
);

create table if not exists public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

-- Mirror new auth users into public.users
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, email, name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data ->> 'name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Row Level Security
alter table public.users enable row level security;
alter table public.user_progress enable row level security;
alter table public.learning_paths enable row level security;
alter table public.modules enable row level security;
alter table public.frameworks enable row level security;
alter table public.testimonials enable row level security;
alter table public.subscribers enable row level security;

create policy "Users can read own profile" on public.users
  for select using (auth.uid() = id);

create policy "Users manage own progress" on public.user_progress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Public read: learning_paths" on public.learning_paths for select using (true);
create policy "Public read: modules" on public.modules for select using (true);
create policy "Public read: frameworks" on public.frameworks for select using (true);
create policy "Public read: testimonials" on public.testimonials for select using (true);

create policy "Anyone can subscribe" on public.subscribers
  for insert with check (true);
