create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  name text not null,
  created_at timestamptz not null default now(),
  subscription_tier text not null default 'free' check (subscription_tier in ('free', 'pro'))
);

create table if not exists public.learning_paths (
  id text primary key,
  title text not null,
  description text not null,
  "order" integer not null,
  modules jsonb not null default '[]'::jsonb,
  audience text,
  duration text,
  level text,
  progress integer not null default 0
);

create table if not exists public.modules (
  id text primary key,
  path_id text not null references public.learning_paths(id) on delete cascade,
  title text not null,
  content text not null,
  "order" integer not null
);

create table if not exists public.user_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  module_id text not null references public.modules(id) on delete cascade,
  completed_at timestamptz,
  score integer not null default 0,
  unique(user_id, module_id)
);

create table if not exists public.frameworks (
  id text primary key,
  name text not null,
  category text not null,
  description text not null,
  use_cases jsonb not null default '[]'::jsonb,
  signal text,
  artifact text
);

create table if not exists public.testimonials (
  id text primary key,
  name text not null,
  role text not null,
  company text not null,
  quote text not null,
  avatar_url text
);

create table if not exists public.email_signups (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  source text not null default 'website',
  created_at timestamptz not null default now()
);
