-- Traceability fields on requirements.
--
-- goal  : the business goal the requirement serves. Null = orphan — a requirement
--         with no business justification, which is the thing an audit asks about.
-- tests : references to the tests covering it. Empty = gap — no way to show the
--         requirement is met.
--
-- Both are nullable/defaulted so existing rows stay valid; an existing register
-- reads as "all orphans, all gaps" until the fields are filled in, which is the
-- honest starting position rather than a fabricated one.

alter table public.requirements
  add column if not exists goal text,
  add column if not exists tests jsonb not null default '[]'::jsonb;

create index if not exists requirements_goal_idx on public.requirements (goal);
