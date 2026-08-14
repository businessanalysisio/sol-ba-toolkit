# Sol — Your second brain for business analysis

A cinematic, dark-mode marketing site for **Sol**: structured learning paths, an
interactive framework library, and AI-powered knowledge organization for
founders, PMs, and business analysts.

Built with **Next.js 14 (App Router) · React 18 · Tailwind CSS · Framer Motion ·
Lucide icons · Supabase**.

## Quick start

```bash
cd sol-website
npm install
npm run dev
```

Open **http://localhost:4510**. That's it — the site runs in **demo mode** with
bundled mock data (learning paths, frameworks, testimonials) and a simulated
auth flow, so no environment setup is required to browse everything.

## Pages

| Route         | What it is                                                        |
| ------------- | ----------------------------------------------------------------- |
| `/`           | Landing page: hero, features, paths, framework explorer, testimonials, pricing, FAQ, email capture |
| `/paths`      | Full learning-path catalog with module breakdowns                 |
| `/frameworks` | Framework library with category filter + expandable detail modals |
| `/skills`     | Skills Library — 651 BA skills from 9 books, searchable & filterable |
| `/skills/[slug]` | Individual skill pages with rendered content, related-skill links, prev/next |
| `/brief-builder` | Interactive Decision Brief Builder for turning messy business problems into structured BA briefs |
| `/dashboard`  | Sample learner dashboard (progress bars, streaks, skill score)    |
| `/login`      | Sign up / log in (Supabase Auth, or demo mode without it)         |
| `POST /api/subscribe` | Email capture endpoint (Supabase `subscribers` table, or logged in demo mode) |

## Connecting Supabase (optional)

1. Create a project at [supabase.com](https://supabase.com).
2. In the SQL editor, run [`supabase/schema.sql`](supabase/schema.sql) — it creates
   `users`, `learning_paths`, `modules`, `user_progress`, `frameworks`,
   `testimonials`, and `subscribers`, with RLS policies and an auth trigger
   that mirrors new signups into `public.users`.
3. Copy `.env.example` to `.env.local` and fill in:

   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
   ```

4. Restart the dev server. Data fetching (`lib/supabase.ts`) automatically
   switches from mock data to your tables, the login page uses real Supabase
   Auth, and `/api/subscribe` writes to the `subscribers` table.

Seed content: the mock data in [`lib/data.ts`](lib/data.ts) matches the schema
1:1, so you can copy it into your tables as seed rows.

## Skills Library pipeline

The 651-skill knowledge base lives in `content/skills/` — a **clone** of the
repo's top-level `skills/` directory (originals untouched). To refresh it:

```bash
rsync -a --exclude='.DS_Store' ../skills/ content/skills/   # re-clone
npm run build:skills                                        # improve + index
```

`scripts/build-skills.mjs` improves every cloned skill file (fills empty
categories, adds slug / reading time / summary frontmatter, resolves
"Related Techniques" names into real cross-links) and generates:

- `public/skills-index.json` — compact index the `/skills` browser searches client-side
- `lib/generated/skills-db.json` — full metadata used to statically build all 651 detail pages
- `content/skills/catalog.json` — regenerated, enriched catalog

## Architecture notes

- **Mock-data fallback** — every fetch helper in `lib/supabase.ts` returns
  bundled data when env vars are missing, so the site never renders empty.
- **Animations** — Framer Motion handles all scroll-reveal, layout (framework
  modal `layoutId` expansion), and micro-interactions. Marquee/orbit loops are
  pure CSS keyframes (compositor-friendly, no JS per frame). GSAP was omitted
  intentionally: nothing here needs a second animation runtime, and dropping it
  keeps the bundle lean for Core Web Vitals.
- **Core Web Vitals** — server components for all data-bearing pages, `next/font`
  with `display: swap`, no layout-shifting images, CSS-only infinite loops,
  `prefers-reduced-motion` respected globally.
- **Responsive** — mobile-first; floating nav collapses to an animated sheet,
  hero orbit hides below `sm`, framework modal becomes a bottom sheet.

## Project structure

```
sol-website/
├── app/
│   ├── api/subscribe/route.ts   # Email capture endpoint
│   ├── dashboard/page.tsx       # Learner progress (demo data)
│   ├── brief-builder/page.tsx   # Decision Brief Builder tool
│   ├── frameworks/page.tsx      # Framework library page
│   ├── paths/page.tsx           # Learning path catalog
│   ├── login/page.tsx           # Auth (Supabase or demo mode)
│   ├── layout.tsx               # Fonts, metadata, dark theme
│   ├── page.tsx                 # Landing page (server component)
│   └── globals.css              # Design tokens, glass/btn utilities
├── components/
│   ├── Navbar.tsx               # Floating glass nav + scroll progress bar
│   ├── Hero.tsx                 # Rotating headline + orbiting framework nodes
│   ├── Features.tsx             # 4 capability cards
│   ├── LearningPaths.tsx        # Interactive path cards
│   ├── FrameworkGrid.tsx        # Filterable grid + layout-animated modal
│   ├── DecisionBriefBuilder.tsx # Interactive BA decision-brief tool
│   ├── Testimonials.tsx         # CSS marquee, pauses on hover
│   ├── Pricing.tsx              # Free vs Pro with gradient highlight
│   ├── FAQ.tsx                  # Animated accordion
│   ├── Footer.tsx               # Email capture + link columns
│   └── AuthForm.tsx             # Sign up / log in form
├── lib/
│   ├── supabase.ts              # Client + fetch helpers with mock fallback
│   ├── data.ts                  # Mock data (matches DB schema)
│   ├── types.ts                 # Shared TypeScript types
│   ├── animations.ts            # Framer Motion variants
│   └── utils.ts                 # cn() class merger
├── supabase/schema.sql          # Full database schema + RLS
└── tailwind.config.ts           # Custom palette, keyframes, animations
```

## Scripts

| Command         | Action                              |
| --------------- | ----------------------------------- |
| `npm run dev`   | Dev server on http://localhost:4510 |
| `npm run build` | Production build                    |
| `npm start`     | Serve production build on :4510     |
