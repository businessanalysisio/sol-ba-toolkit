# Sol database setup

1. Create a Supabase project and configure the variables documented in `.env.example`.
2. Apply `schema.sql` to a new database.
3. Apply files in `migrations/` in filename order.
4. Create two test users and verify that each user can only read workspaces where they have a row in `workspace_members`.

The canonical migration stops with an explicit error if it detects the incompatible legacy `requirements` table from
`scripts/001-create-supabase-schema.sql`. Rename or migrate that legacy table before continuing; do not weaken the new
row-level-security policies to make both models coexist.

Application requests use the user's bearer token and therefore remain subject to RLS. The service-role client bypasses
RLS and is reserved for narrow server-only operations such as email capture.
