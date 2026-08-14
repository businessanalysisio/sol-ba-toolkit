"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eyebrow, StatusText } from "@/components/sol/status"
import { isSupabaseConfigured, supabase } from "@/lib/supabase"
import {
  LIFECYCLE_STATES,
  STATUS_LABEL,
  STATUS_TONE,
  describeEvent,
  transitionsFrom,
} from "@/lib/requirement-lifecycle"
import { STATE_LABEL, STATE_TONE, traceRow } from "@/lib/traceability"
import type { AuditEvent, Priority, Requirement, RequirementStatus } from "@/types/domain"

const DEMO_REQUIREMENTS_KEY = "sol-demo-requirements"
const DEMO_EVENTS_KEY = "sol-demo-audit"

function readLocal<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}

function writeLocal<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value))
}

async function accessToken() {
  if (!supabase) return null
  const { data } = await supabase.auth.getSession()
  return data.session?.access_token ?? null
}

export default function RequirementLifecyclePage() {
  const params = useParams<{ id: string }>()
  const requirementId = params.id

  const [requirement, setRequirement] = useState<Requirement | null>(null)
  const [events, setEvents] = useState<AuditEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [savedAt, setSavedAt] = useState<number | null>(null)

  // Draft copies of the editable fields.
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState<Priority>("medium")
  const [goal, setGoal] = useState("")
  const [criteria, setCriteria] = useState("")
  const [tests, setTests] = useState("")

  const hydrate = useCallback((next: Requirement) => {
    setRequirement(next)
    setTitle(next.title)
    setDescription(next.description ?? "")
    setPriority(next.priority)
    setGoal(next.goal ?? "")
    setCriteria((next.acceptance_criteria ?? []).join("\n"))
    setTests((next.tests ?? []).join("\n"))
  }, [])

  useEffect(() => {
    async function load() {
      try {
        if (isSupabaseConfigured) {
          const token = await accessToken()
          if (!token) throw new Error("Your session has expired. Sign in again.")
          const list = readLocal<Requirement[]>(DEMO_REQUIREMENTS_KEY, [])
          const known = list.find((item) => item.id === requirementId)
          if (!known) throw new Error("Open this requirement from the register.")
          const res = await fetch(`/api/workspaces/${known.workspace_id}/requirements/${requirementId}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          if (!res.ok) throw new Error((await res.json()).error ?? "Unable to load the requirement.")
          const body = await res.json()
          hydrate(body.requirement)
          setEvents(body.events ?? [])
        } else {
          const list = readLocal<Requirement[]>(DEMO_REQUIREMENTS_KEY, [])
          const found = list.find((item) => item.id === requirementId)
          if (!found) throw new Error("That requirement is not in this browser's register.")
          hydrate(found)
          setEvents(
            readLocal<AuditEvent[]>(DEMO_EVENTS_KEY, []).filter((event) => event.entity_id === requirementId),
          )
        }
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : "Unable to load the requirement.")
      } finally {
        setLoading(false)
      }
    }
    void load()
  }, [requirementId, hydrate])

  const persist = useCallback(
    async (patch: Partial<Requirement>, action: string, changes: Record<string, unknown>) => {
      if (!requirement) return
      setSaving(true)
      setError("")
      try {
        if (isSupabaseConfigured) {
          const token = await accessToken()
          const res = await fetch(
            `/api/workspaces/${requirement.workspace_id}/requirements/${requirement.id}`,
            {
              method: "PATCH",
              headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
              body: JSON.stringify(patch),
            },
          )
          if (!res.ok) throw new Error((await res.json()).error ?? "Unable to save.")
          const body = await res.json()
          hydrate(body.requirement)
        } else {
          const now = new Date().toISOString()
          const next: Requirement = { ...requirement, ...patch, version: requirement.version + 1, updated_at: now }
          const list = readLocal<Requirement[]>(DEMO_REQUIREMENTS_KEY, [])
          writeLocal(DEMO_REQUIREMENTS_KEY, list.map((item) => (item.id === next.id ? next : item)))
          const event: AuditEvent = {
            id: crypto.randomUUID(),
            workspace_id: next.workspace_id,
            actor_id: "demo-user",
            entity_type: "requirement",
            entity_id: next.id,
            action,
            changes,
            created_at: now,
          }
          const allEvents = readLocal<AuditEvent[]>(DEMO_EVENTS_KEY, [])
          writeLocal(DEMO_EVENTS_KEY, [event, ...allEvents])
          hydrate(next)
          setEvents((current) => [event, ...current])
        }
        setSavedAt(Date.now())
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : "Unable to save.")
      } finally {
        setSaving(false)
      }
    },
    [requirement, hydrate],
  )

  const moveTo = useCallback(
    (status: RequirementStatus) => {
      if (!requirement) return
      void persist({ status }, "status_changed", { from: requirement.status, to: status })
    },
    [persist, requirement],
  )

  const saveEdits = useCallback(() => {
    if (!requirement) return
    const nextCriteria = criteria.split("\n").map((item) => item.trim()).filter(Boolean)
    const nextTests = tests.split("\n").map((item) => item.trim()).filter(Boolean)
    const patch = {
      title: title.trim(),
      description: description.trim(),
      priority,
      goal: goal.trim() || null,
      acceptance_criteria: nextCriteria,
      tests: nextTests,
    }
    const changes: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(patch)) {
      const before = (requirement as unknown as Record<string, unknown>)[key]
      if (JSON.stringify(before) !== JSON.stringify(value)) changes[key] = value
    }
    if (Object.keys(changes).length === 0) return
    void persist(patch, "edited", changes)
  }, [criteria, description, goal, persist, priority, requirement, tests, title])

  const trace = useMemo(() => (requirement ? traceRow(requirement) : null), [requirement])

  if (loading) {
    return (
      <div className="mx-auto max-w-[1100px] p-5 md:p-9 lg:p-12">
        <div className="flex items-center gap-2 py-10 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading the requirement…
        </div>
      </div>
    )
  }

  if (!requirement) {
    return (
      <div className="mx-auto max-w-[1100px] p-5 md:p-9 lg:p-12">
        <div className="rounded-2xl border border-sol-coral/45 bg-sol-coral/[0.06] p-6">
          <p className="font-semibold text-sol-coral">Requirement not available</p>
          <p className="mt-2 text-sm text-muted-foreground">{error}</p>
          <Link
            href="/dashboard/requirements"
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-sol-gold hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> Back to the register
          </Link>
        </div>
      </div>
    )
  }

  const moves = transitionsFrom(requirement.status)

  return (
    <div className="mx-auto max-w-[1100px] space-y-6 p-5 md:p-9 lg:p-12">
      <Link
        href="/dashboard/requirements"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> Register
      </Link>

      <header>
        <Eyebrow>
          {requirement.kind.replace("_", " ")} · {requirement.priority} · v{requirement.version}
        </Eyebrow>
        <h1 className="mt-3 max-w-3xl text-balance text-3xl font-semibold tracking-[-0.03em] text-white md:text-[2.5rem]">
          {requirement.title}
        </h1>
        {trace && (
          <p className="mt-3 text-sm text-muted-foreground">
            {trace.goal ? <>Serves <span className="text-white">{trace.goal}</span></> : "No linked goal"}
            {" · "}
            <span className={STATE_TONE[trace.state].text}>{STATE_LABEL[trace.state]}</span>
            {" · "}
            {trace.criteria} criteria · {trace.tests} tests
          </p>
        )}
      </header>

      {error && (
        <div role="alert" className="rounded-2xl border border-sol-coral/45 bg-sol-coral/[0.06] p-5">
          <p className="font-semibold text-sol-coral">Could not save</p>
          <p className="mt-2 text-sm text-muted-foreground">{error}</p>
        </div>
      )}

      <section className="rounded-2xl border border-white/[0.09] bg-white/[0.02] p-6">
        <Eyebrow>Lifecycle · {STATUS_LABEL[requirement.status]}</Eyebrow>
        <div className="mt-4 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
          {LIFECYCLE_STATES.map((state) => {
            const isCurrent = state === requirement.status
            return (
              <div
                key={state}
                aria-current={isCurrent ? "step" : undefined}
                className={`rounded-xl border px-4 py-3 text-sm font-semibold ${
                  isCurrent
                    ? "border-sol-gold/45 bg-sol-gold/[0.08] text-sol-gold"
                    : "border-white/[0.09] text-sol-dim"
                }`}
              >
                {STATUS_LABEL[state]}
              </div>
            )
          })}
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-2">
          {moves.map((move) => (
            <Button
              key={move.to}
              size="sm"
              variant={move.intent === "primary" ? "default" : move.intent === "secondary" ? "outline" : "ghost"}
              disabled={saving}
              onClick={() => moveTo(move.to)}
            >
              {move.label}
            </Button>
          ))}
          <StatusText tone={STATUS_TONE[requirement.status]} className="ml-1">
            {STATUS_LABEL[requirement.status]}
          </StatusText>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-start">
        <section className="rounded-2xl border border-white/[0.09] bg-white/[0.02] p-6">
          <Eyebrow>Edit</Eyebrow>
          <div className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Requirement</Label>
              <Textarea id="edit-title" value={title} onChange={(e) => setTitle(e.target.value)} rows={2} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="edit-priority">Priority</Label>
                <Select value={priority} onValueChange={(value) => setPriority(value as Priority)}>
                  <SelectTrigger id="edit-priority"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["low", "medium", "high", "critical"].map((value) => (
                      <SelectItem key={value} value={value}>
                        {value[0].toUpperCase() + value.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-goal">Linked goal</Label>
                <Input id="edit-goal" value={goal} onChange={(e) => setGoal(e.target.value)} maxLength={240} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea id="edit-description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-criteria">Acceptance criteria</Label>
              <Textarea id="edit-criteria" value={criteria} onChange={(e) => setCriteria(e.target.value)} rows={4} placeholder="One criterion per line" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-tests">Tests</Label>
              <Textarea id="edit-tests" value={tests} onChange={(e) => setTests(e.target.value)} rows={3} placeholder="One test reference per line" />
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={saveEdits} disabled={saving}>
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Save changes
              </Button>
              {savedAt && !saving && (
                <span className="inline-flex items-center gap-1.5 text-sm text-sol-mint">
                  <Check className="h-4 w-4" /> Saved as v{requirement.version}
                </span>
              )}
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-white/[0.09] bg-white/[0.02] p-6">
          <Eyebrow>Change history</Eyebrow>
          {events.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">
              No changes recorded yet. Edits and state moves are written here as they happen.
            </p>
          ) : (
            <ol className="mt-4 space-y-4 border-l border-white/[0.09] pl-5">
              {events.map((event) => (
                <li key={event.id} className="relative">
                  <span aria-hidden className="absolute -left-[23px] top-1.5 h-1.5 w-1.5 rounded-full bg-sol-gold" />
                  <p className="text-sm font-medium text-white">
                    {describeEvent(event.action, event.changes ?? {})}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {new Date(event.created_at).toLocaleString()}
                  </p>
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>
    </div>
  )
}
