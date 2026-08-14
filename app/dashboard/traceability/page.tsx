"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { ArrowRight, Loader2 } from "lucide-react"
import { Eyebrow } from "@/components/sol/status"
import { isSupabaseConfigured, supabase } from "@/lib/supabase"
import { STATE_LABEL, STATE_TONE, summarise, traceRow, type TraceRow, type TraceState } from "@/lib/traceability"
import type { Requirement, Workspace } from "@/types/domain"

const DEMO_WORKSPACES_KEY = "sol-demo-workspaces"
const DEMO_REQUIREMENTS_KEY = "sol-demo-requirements"

function readLocal<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}

async function accessToken() {
  if (!supabase) return null
  const { data } = await supabase.auth.getSession()
  return data.session?.access_token ?? null
}

type Filter = "all" | "gaps" | "orphans" | "covered"

const FILTERS: { id: Filter; label: string; match: (state: TraceState) => boolean }[] = [
  { id: "all", label: "All", match: () => true },
  { id: "gaps", label: "Gaps", match: (s) => s === "gap" || s === "partial" },
  { id: "orphans", label: "Orphans", match: (s) => s === "orphan" },
  { id: "covered", label: "Covered", match: (s) => s === "covered" },
]

export default function TraceabilityPage() {
  const [requirements, setRequirements] = useState<Requirement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [filter, setFilter] = useState<Filter>("all")

  useEffect(() => {
    async function load() {
      try {
        if (isSupabaseConfigured) {
          const token = await accessToken()
          if (!token) throw new Error("Your session has expired. Sign in again.")
          const wsRes = await fetch("/api/workspaces", { headers: { Authorization: `Bearer ${token}` } })
          const { workspaces } = (await wsRes.json()) as { workspaces: Workspace[] }
          const all: Requirement[] = []
          for (const workspace of workspaces ?? []) {
            const res = await fetch(`/api/workspaces/${workspace.id}/requirements`, {
              headers: { Authorization: `Bearer ${token}` },
            })
            const body = (await res.json()) as { requirements?: Requirement[] }
            all.push(...(body.requirements ?? []))
          }
          setRequirements(all)
        } else {
          setRequirements(readLocal<Requirement[]>(DEMO_REQUIREMENTS_KEY, []))
        }
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : "Unable to load the register.")
      } finally {
        setLoading(false)
      }
    }
    void load()
  }, [])

  const rows = useMemo(() => requirements.map(traceRow), [requirements])
  const summary = useMemo(() => summarise(rows), [rows])
  const visible = useMemo(() => {
    const active = FILTERS.find((f) => f.id === filter)!
    return rows.filter((row) => active.match(row.state))
  }, [rows, filter])

  const stats = [
    { value: summary.total, label: "requirements", tone: "text-sol-gold" },
    { value: summary.covered, label: "fully covered", tone: "text-sol-mint" },
    { value: summary.gaps, label: "gaps · no test", tone: "text-sol-warn" },
    { value: summary.orphans, label: "orphans · no goal", tone: "text-sol-coral" },
  ]

  return (
    <div className="mx-auto max-w-[1380px] space-y-7 p-5 md:p-9 lg:p-12">
      <header>
        <Eyebrow>Traceability matrix</Eyebrow>
        <h1 className="mt-3 max-w-3xl text-balance text-3xl font-semibold tracking-[-0.03em] text-white md:text-4xl">
          Backward to the goal, forward to the test.
        </h1>
        <p className="mt-3 max-w-2xl text-base text-muted-foreground">
          Orphans have no business justification. Gaps have no test. Both are answerable in two
          minutes at audit.
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => setFilter(option.id)}
            aria-pressed={filter === option.id}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sol-gold ${
              filter === option.id
                ? "border-sol-gold/50 bg-sol-gold/10 text-sol-gold"
                : "border-white/[0.14] text-muted-foreground hover:border-white/[0.25] hover:text-white"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex items-center gap-4 rounded-2xl border border-white/[0.09] bg-white/[0.02] px-5 py-4"
          >
            <span className={`font-display text-[38px] font-extrabold leading-none ${stat.tone}`}>
              {stat.value}
            </span>
            <span className="text-sm leading-5 text-muted-foreground">{stat.label}</span>
          </div>
        ))}
      </section>

      {error && (
        <div role="alert" className="rounded-2xl border border-sol-coral/45 bg-sol-coral/[0.06] p-5">
          <p className="font-semibold text-sol-coral">Could not load the register</p>
          <p className="mt-2 text-sm text-muted-foreground">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex items-center gap-2 py-10 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Reading the requirement register…
        </div>
      ) : rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/[0.12] p-10 text-center">
          <p className="font-medium text-white">No requirements to trace yet</p>
          <p className="mx-auto mt-1.5 max-w-md text-sm leading-6 text-muted-foreground">
            The matrix is built from the requirement register. Capture a requirement, give it a
            business goal and a test, and it appears here.
          </p>
          <Link
            href="/dashboard/requirements"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-sol-gold px-5 py-2.5 text-sm font-semibold text-sol-night transition hover:bg-sol-400"
          >
            Open the register <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-white/[0.09] bg-white/[0.02]">
          <table className="w-full min-w-[820px] border-collapse">
            <thead>
              <tr>
                {["Business goal", "Requirement", "Coverage", "State"].map((heading) => (
                  <th
                    key={heading}
                    scope="col"
                    className="whitespace-nowrap border-b border-white/[0.09] px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-[0.11em] text-muted-foreground"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map((row) => (
                <MatrixRow key={row.requirement.id} row={row} />
              ))}
            </tbody>
          </table>
          {visible.length === 0 && (
            <p className="px-5 py-8 text-center text-sm text-muted-foreground">
              Nothing matches this filter — which is the good outcome.
            </p>
          )}
        </div>
      )}
    </div>
  )
}

function MatrixRow({ row }: { row: TraceRow }) {
  const tone = STATE_TONE[row.state]
  return (
    <tr className="border-b border-white/[0.06] last:border-b-0">
      <td className="px-5 py-4 align-top text-sm text-muted-foreground">
        {row.goal ?? <span className="text-sol-coral">— none —</span>}
      </td>
      <td className="px-5 py-4 align-top">
        <p className="font-medium text-white">{row.requirement.title}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          {row.criteria} criteria · {row.tests} tests
        </p>
      </td>
      <td className="w-40 px-5 py-4 align-top">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.08]">
          <div className={`h-full rounded-full ${tone.bar}`} style={{ width: `${row.coverage}%` }} />
        </div>
        <p className="mt-1.5 text-xs tabular-nums text-muted-foreground">{row.coverage}%</p>
      </td>
      <td className="px-5 py-4 align-top">
        <span className={`text-sm font-semibold ${tone.text}`}>{STATE_LABEL[row.state]}</span>
      </td>
    </tr>
  )
}
