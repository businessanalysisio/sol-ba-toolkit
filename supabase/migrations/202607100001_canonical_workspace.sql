-- Sol canonical workspace model
-- Apply after supabase/schema.sql. This migration is intentionally additive.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 120),
  description text,
  owner_id uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.workspace_members (
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member' check (role in ('owner', 'admin', 'member', 'viewer')),
  joined_at timestamptz not null default now(),
  primary key (workspace_id, user_id)
);

create table if not exists public.source_records (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  created_by uuid not null references auth.users(id),
  kind text not null check (kind in ('note', 'document', 'meeting', 'email', 'ticket', 'interview', 'other')),
  title text not null,
  content text,
  external_url text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

do $$
begin
  if to_regclass('public.requirements') is not null
     and not exists (
       select 1 from information_schema.columns
       where table_schema = 'public' and table_name = 'requirements' and column_name = 'workspace_id'
     ) then
    raise exception 'Legacy public.requirements detected. Migrate or rename it before applying the canonical Sol workspace migration.';
  end if;
end $$;

create table if not exists public.requirements (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  source_id uuid references public.source_records(id) on delete set null,
  created_by uuid not null references auth.users(id),
  assigned_to uuid references auth.users(id),
  title text not null,
  description text not null default '',
  kind text not null default 'business' check (kind in ('business', 'stakeholder', 'functional', 'non_functional', 'transition')),
  status text not null default 'draft' check (status in ('draft', 'review', 'approved', 'rejected', 'implemented', 'archived')),
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high', 'critical')),
  acceptance_criteria jsonb not null default '[]'::jsonb,
  version integer not null default 1 check (version > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.decisions (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  created_by uuid not null references auth.users(id),
  title text not null,
  context text not null default '',
  decision text not null default '',
  rationale text not null default '',
  status text not null default 'draft' check (status in ('draft', 'proposed', 'approved', 'superseded', 'rejected')),
  decided_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.artifacts (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  created_by uuid not null references auth.users(id),
  title text not null,
  kind text not null check (kind in ('brief', 'user_story', 'process', 'analysis', 'report', 'export')),
  status text not null default 'draft' check (status in ('draft', 'review', 'approved', 'archived')),
  content jsonb not null default '{}'::jsonb,
  version integer not null default 1 check (version > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.traceability_links (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  created_by uuid not null references auth.users(id),
  from_type text not null check (from_type in ('source', 'requirement', 'decision', 'artifact', 'external_issue')),
  from_id text not null,
  to_type text not null check (to_type in ('source', 'requirement', 'decision', 'artifact', 'external_issue')),
  to_id text not null,
  relationship text not null check (relationship in ('derived_from', 'supports', 'satisfies', 'conflicts_with', 'supersedes', 'exports_to')),
  created_at timestamptz not null default now(),
  unique (workspace_id, from_type, from_id, to_type, to_id, relationship),
  check (not (from_type = to_type and from_id = to_id))
);

create table if not exists public.audit_events (
  id bigint generated always as identity primary key,
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  actor_id uuid references auth.users(id) on delete set null,
  entity_type text not null,
  entity_id text not null,
  action text not null,
  changes jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists workspace_members_user_idx on public.workspace_members(user_id);
create index if not exists source_records_workspace_created_idx on public.source_records(workspace_id, created_at desc);
create index if not exists requirements_workspace_status_idx on public.requirements(workspace_id, status);
create index if not exists requirements_source_idx on public.requirements(source_id);
create index if not exists decisions_workspace_status_idx on public.decisions(workspace_id, status);
create index if not exists artifacts_workspace_kind_idx on public.artifacts(workspace_id, kind);
create index if not exists traceability_from_idx on public.traceability_links(workspace_id, from_type, from_id);
create index if not exists traceability_to_idx on public.traceability_links(workspace_id, to_type, to_id);
create index if not exists audit_events_workspace_created_idx on public.audit_events(workspace_id, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.is_workspace_member(target_workspace_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.workspace_members
    where workspace_id = target_workspace_id and user_id = auth.uid()
  );
$$;

create or replace function public.has_workspace_role(target_workspace_id uuid, allowed_roles text[])
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.workspace_members
    where workspace_id = target_workspace_id
      and user_id = auth.uid()
      and role = any(allowed_roles)
  );
$$;

create or replace function public.is_workspace_owner(target_workspace_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.workspaces
    where id = target_workspace_id and owner_id = auth.uid()
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute function public.handle_new_user();

do $$
declare table_name text;
begin
  foreach table_name in array array['profiles', 'workspaces', 'source_records', 'requirements', 'decisions', 'artifacts']
  loop
    execute format('drop trigger if exists set_%I_updated_at on public.%I', table_name, table_name);
    execute format('create trigger set_%I_updated_at before update on public.%I for each row execute function public.set_updated_at()', table_name, table_name);
  end loop;
end $$;

alter table public.profiles enable row level security;
alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;
alter table public.source_records enable row level security;
alter table public.requirements enable row level security;
alter table public.decisions enable row level security;
alter table public.artifacts enable row level security;
alter table public.traceability_links enable row level security;
alter table public.audit_events enable row level security;

create policy "profiles_read_own" on public.profiles for select using (id = auth.uid());
create policy "profiles_update_own" on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());

create policy "workspaces_read_member" on public.workspaces for select using (public.is_workspace_member(id));
create policy "workspaces_create_owner" on public.workspaces for insert with check (owner_id = auth.uid());
create policy "workspaces_update_admin" on public.workspaces for update
  using (public.has_workspace_role(id, array['owner', 'admin']))
  with check (public.has_workspace_role(id, array['owner', 'admin']));
create policy "workspaces_delete_owner" on public.workspaces for delete
  using (public.has_workspace_role(id, array['owner']));

create policy "members_read_member" on public.workspace_members for select using (public.is_workspace_member(workspace_id));
create policy "members_bootstrap_owner" on public.workspace_members for insert
  with check (user_id = auth.uid() and public.is_workspace_owner(workspace_id));
create policy "members_manage_admin" on public.workspace_members for all
  using (public.has_workspace_role(workspace_id, array['owner', 'admin']))
  with check (public.has_workspace_role(workspace_id, array['owner', 'admin']));

do $$
declare table_name text;
begin
  foreach table_name in array array['source_records', 'requirements', 'decisions', 'artifacts', 'traceability_links']
  loop
    execute format('create policy %I on public.%I for select using (public.is_workspace_member(workspace_id))', table_name || '_read_member', table_name);
    execute format('create policy %I on public.%I for insert with check (public.has_workspace_role(workspace_id, array[''owner'', ''admin'', ''member'']) and created_by = auth.uid())', table_name || '_create_contributor', table_name);
    execute format('create policy %I on public.%I for update using (public.has_workspace_role(workspace_id, array[''owner'', ''admin'', ''member''])) with check (public.has_workspace_role(workspace_id, array[''owner'', ''admin'', ''member'']))', table_name || '_update_contributor', table_name);
    execute format('create policy %I on public.%I for delete using (public.has_workspace_role(workspace_id, array[''owner'', ''admin'']) or created_by = auth.uid())', table_name || '_delete_owner', table_name);
  end loop;
end $$;

create policy "audit_read_member" on public.audit_events for select using (public.is_workspace_member(workspace_id));
create policy "audit_create_contributor" on public.audit_events for insert
  with check (public.has_workspace_role(workspace_id, array['owner', 'admin', 'member']) and actor_id = auth.uid());

-- The owner must add themselves as the first member in the same transaction as workspace creation.
-- Use the create_workspace RPC below so RLS cannot leave a workspace without membership.
create or replace function public.create_workspace(workspace_name text, workspace_description text default null)
returns public.workspaces
language plpgsql
security invoker
set search_path = ''
as $$
declare created_workspace public.workspaces;
begin
  insert into public.workspaces (name, description, owner_id)
  values (workspace_name, workspace_description, auth.uid())
  returning * into created_workspace;

  insert into public.workspace_members (workspace_id, user_id, role)
  values (created_workspace.id, auth.uid(), 'owner');

  return created_workspace;
end;
$$;
