# Sol

Sol is a second brain system for learning business analysis skills. It helps founders, product managers, business analysts, and tech entrepreneurs transform scattered business knowledge into structured learning paths, reusable frameworks, and actionable insights.

## Stack

- Next.js App Router
- React
- Tailwind CSS
- Framer Motion
- GSAP
- Lucide React
- Supabase PostgreSQL/Auth-ready data layer

## Local Setup

Install dependencies:

```bash
pnpm install
```

Sol requires Node.js 20 or newer and pnpm 9 or newer. Copy `.env.example` to
`.env.local` when configuring external services. Never commit real credentials.

Run the preview server on the requested port:

```bash
pnpm dev -- --port 4510
```

Open:

```text
http://localhost:4510
```

## Environment Variables

The app works immediately with mock data. Add Supabase credentials when you want real persistence:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
GOOGLE_GENERATIVE_AI_API_KEY=
JIRA_BASE_URL=
JIRA_EMAIL=
JIRA_API_TOKEN=
JIRA_PROJECT_KEY=
```

`SUPABASE_SERVICE_ROLE_KEY` is only used by `app/api/email-capture/route.ts` on the server. Do not expose it to the browser.

## Supabase Schema

Run the SQL in `supabase/schema.sql`, then apply migrations in `supabase/migrations/` in filename order.
The base schema creates learning content; the canonical workspace migration adds secure operational data for:

- `users`
- `learning_paths`
- `modules`
- `user_progress`
- `frameworks`
- `testimonials`
- `email_signups`
- workspaces and workspace membership
- source records and requirements
- decisions and artifacts
- traceability links and audit events

Operational tables use row-level security. Requests must use a signed-in user's access token; the service-role
client is reserved for narrowly scoped server operations and must never be sent to the browser.

## Routes

- `/` - cinematic Sol landing page
- `/paths` - BA learning tracks
- `/frameworks` - interactive framework library
- `/dashboard` - auth-ready learning progress shell
- `/api/email-capture` - newsletter/email capture endpoint

## Notes

The app currently falls back to mock data from `lib/mock-data.ts` when Supabase is not configured or tables are empty. This keeps preview and development fast while preserving a production-ready integration path.
