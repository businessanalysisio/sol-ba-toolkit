import Link from "next/link"
import {
  ArrowRight,
  BarChart3,
  BookOpenCheck,
  BrainCircuit,
  CheckCircle2,
  FileText,
  ClipboardList,
  Library,
  Sparkles,
} from "lucide-react"
import { learningPaths, userProgress } from "@/lib/mock-data"

const workActions = [
  {
    title: "Capture requirements",
    description: "Create a workspace and build a structured, reviewable requirement register.",
    href: "/dashboard/requirements",
    icon: ClipboardList,
    tone: "text-sol-gold bg-sol-gold/10 border-sol-gold/15",
  },
  {
    title: "Draft a decision brief",
    description: "Turn an ambiguous business problem into a structured recommendation.",
    href: "/brief-builder",
    icon: FileText,
    tone: "text-sol-mint bg-sol-mint/10 border-sol-mint/15",
  },
  {
    title: "Open AI workspace",
    description: "Generate requirements, analyze a problem, or consult the BA copilot.",
    href: "/dashboard/ai-workspace",
    icon: Sparkles,
    tone: "text-sol-violet bg-sol-violet/10 border-sol-violet/15",
  },
]

export default function DashboardPage() {
  const completed = userProgress.filter((item) => item.completed_at).length
  const scored = userProgress.filter((item) => item.score > 0)
  const averageScore = scored.length
    ? Math.round(scored.reduce((total, item) => total + item.score, 0) / scored.length)
    : 0

  return (
    <div className="mx-auto max-w-[1380px] space-y-10 p-5 md:p-9 lg:p-12">
      <section className="sol-app-panel relative overflow-hidden rounded-[28px] p-7 md:p-10 lg:p-12">
        <div aria-hidden className="absolute -right-20 -top-24 h-80 w-80 rounded-full bg-sol-mint/10 blur-3xl" />
        <div aria-hidden className="absolute bottom-0 left-1/3 h-48 w-72 rounded-full bg-sol-gold/10 blur-3xl" />
        <div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <p className="sol-app-kicker"><span className="h-1.5 w-1.5 rounded-full bg-sol-mint shadow-[0_0_12px_rgba(120,230,198,0.9)]" /> Workspace pulse · Demo data</p>
            <h1 className="mt-5 max-w-3xl text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.035em] text-white md:text-5xl lg:text-[3.5rem]">
              Move from ambiguity to a decision you can defend.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
              Capture the signal, structure the requirement, and preserve the reasoning behind every recommendation.
            </p>
          </div>
          <Link
            href="/brief-builder"
            className="inline-flex h-12 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-sol-gold px-6 text-sm font-semibold text-sol-night shadow-[0_12px_40px_-16px_rgba(239,125,69,0.9)] transition hover:-translate-y-0.5 hover:bg-sol-400"
          >
            Start a decision brief <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section>
        <div className="mb-5 flex items-end justify-between">
          <div>
            <p className="sol-app-kicker">01 · Work</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">What needs clarity today?</h2>
          </div>
          <BrainCircuit className="hidden h-6 w-6 text-sol-gold/60 sm:block" />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {workActions.map((action, index) => {
            const Icon = action.icon
            return (
              <Link key={action.href} href={action.href} className="sol-app-panel group relative rounded-2xl p-6 transition duration-300 hover:-translate-y-1 hover:border-white/15 hover:bg-white/[0.055]">
                <span className="absolute right-5 top-4 font-mono text-xs text-white/20">0{index + 1}</span>
                <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border ${action.tone}`}><Icon className="h-5 w-5" /></span>
                <h3 className="mt-6 text-lg font-semibold text-white">{action.title}</h3>
                <p className="mt-2 min-h-12 text-sm leading-6 text-muted-foreground">{action.description}</p>
                <span className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-sol-gold">
                  Open <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </Link>
            )
          })}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="sol-app-panel rounded-2xl p-6 md:p-7">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <BookOpenCheck className="h-5 w-5 text-sol-mint" />
              <h2 className="text-xl font-semibold text-white">Learn</h2>
            </div>
            <Link href="/paths" className="text-sm font-medium text-sol-mint hover:text-white">View all paths</Link>
          </div>
          <div className="mt-5 space-y-4">
            {learningPaths.map((path) => (
              <article key={path.id} className="rounded-xl border border-white/[0.06] bg-black/10 p-4 transition hover:bg-white/[0.025]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-sol-mint">{path.audience}</p>
                    <h3 className="mt-1.5 font-medium text-white">{path.title}</h3>
                  </div>
                  <span className="text-sm text-muted-foreground">{path.progress}%</span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-gradient-to-r from-sol-mint to-cyan-300" style={{ width: `${path.progress}%` }} />
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="sol-app-panel rounded-2xl p-6 md:p-7">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-sol-violet" />
            <h2 className="text-xl font-semibold text-white">Improve</h2>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-white/[0.06] bg-sol-violet/5 p-4">
              <p className="text-3xl font-semibold tracking-tight text-white">{completed}</p>
              <p className="mt-1 text-xs text-muted-foreground">Modules complete</p>
            </div>
            <div className="rounded-xl border border-white/[0.06] bg-sol-gold/5 p-4">
              <p className="text-3xl font-semibold tracking-tight text-white">{averageScore}%</p>
              <p className="mt-1 text-xs text-muted-foreground">Average score</p>
            </div>
          </div>
          <div className="mt-5 space-y-3">
            <Link href="/dashboard/data-analysis" className="flex items-center justify-between rounded-xl border border-white/[0.06] p-3.5 text-sm font-medium text-white transition hover:bg-white/[0.04]">
              Analyze evidence <BarChart3 className="h-4 w-4" />
            </Link>
            <Link href="/frameworks" className="flex items-center justify-between rounded-xl border border-white/[0.06] p-3.5 text-sm font-medium text-white transition hover:bg-white/[0.04]">
              Apply a framework <Library className="h-4 w-4" />
            </Link>
            <Link href="/skills" className="flex items-center justify-between rounded-xl border border-white/[0.06] p-3.5 text-sm font-medium text-white transition hover:bg-white/[0.04]">
              Explore BA skills <CheckCircle2 className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
