-- Requirement lifecycle.
--
-- Adds 'change_requested' to the status set. The reference's lifecycle strip is
-- Draft → In review → Approved, with Change requested as the way back — that
-- last state has no equivalent in the original enum ('rejected' is a stronger,
-- terminal claim and should not be reused for "needs another pass").

alter table public.requirements drop constraint if exists requirements_status_check;

alter table public.requirements
  add constraint requirements_status_check
  check (status in ('draft', 'review', 'approved', 'change_requested', 'rejected', 'implemented', 'archived'));

-- Change history reads from the existing audit_events table; this index makes
-- the per-requirement lookup cheap.
create index if not exists audit_events_entity_idx
  on public.audit_events (workspace_id, entity_type, entity_id, created_at desc);
