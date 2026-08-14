"use client"

import { useEffect, useMemo, useState } from "react"
import { AlertCircle, CheckCircle2, FileText, Loader2, Plus, ShieldCheck } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { isSupabaseConfigured, supabase } from "@/lib/supabase"
import type { Priority, Requirement, RequirementKind, Workspace } from "@/types/domain"

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

function writeLocal<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value))
}

async function accessToken() {
  if (!supabase) return null
  const { data } = await supabase.auth.getSession()
  return data.session?.access_token ?? null
}

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const token = await accessToken()
  if (!token) throw new Error("Your session has expired. Sign in again.")
  const response = await fetch(path, {
    ...init,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, ...init?.headers },
  })
  const body = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(body.error ?? "Request failed")
  return body as T
}

const kindLabels: Record<RequirementKind, string> = {
  business: "Business",
  stakeholder: "Stakeholder",
  functional: "Functional",
  non_functional: "Non-functional",
  transition: "Transition",
}

export default function RequirementsPage() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [workspaceId, setWorkspaceId] = useState("")
  const [requirements, setRequirements] = useState<Requirement[]>([])
  const [workspaceName, setWorkspaceName] = useState("")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [kind, setKind] = useState<RequirementKind>("business")
  const [priority, setPriority] = useState<Priority>("medium")
  const [criteria, setCriteria] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const selectedWorkspace = useMemo(
    () => workspaces.find((workspace) => workspace.id === workspaceId),
    [workspaceId, workspaces],
  )

  useEffect(() => {
    async function load() {
      setError("")
      try {
        let items: Workspace[]
        if (isSupabaseConfigured) {
          items = (await api<{ workspaces: Workspace[] }>("/api/workspaces")).workspaces
        } else {
          items = readLocal<Workspace[]>(DEMO_WORKSPACES_KEY, [])
        }
        setWorkspaces(items)
        if (items[0]) setWorkspaceId(items[0].id)
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : "Unable to load workspaces.")
      } finally {
        setLoading(false)
      }
    }
    void load()
  }, [])

  useEffect(() => {
    if (!workspaceId) {
      setRequirements([])
      return
    }
    async function loadRequirements() {
      setLoading(true)
      setError("")
      try {
        if (isSupabaseConfigured) {
          const body = await api<{ requirements: Requirement[] }>(`/api/workspaces/${workspaceId}/requirements`)
          setRequirements(body.requirements)
        } else {
          const all = readLocal<Requirement[]>(DEMO_REQUIREMENTS_KEY, [])
          setRequirements(all.filter((item) => item.workspace_id === workspaceId))
        }
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : "Unable to load requirements.")
      } finally {
        setLoading(false)
      }
    }
    void loadRequirements()
  }, [workspaceId])

  async function createWorkspace() {
    const name = workspaceName.trim()
    if (!name) return
    setSaving(true)
    setError("")
    try {
      let workspace: Workspace
      if (isSupabaseConfigured) {
        workspace = (await api<{ workspace: Workspace }>("/api/workspaces", {
          method: "POST",
          body: JSON.stringify({ name }),
        })).workspace
      } else {
        const now = new Date().toISOString()
        workspace = { id: crypto.randomUUID(), name, description: null, owner_id: "demo-user", created_at: now, updated_at: now }
        writeLocal(DEMO_WORKSPACES_KEY, [workspace, ...workspaces])
      }
      setWorkspaces((current) => [workspace, ...current])
      setWorkspaceId(workspace.id)
      setWorkspaceName("")
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to create workspace.")
    } finally {
      setSaving(false)
    }
  }

  async function createRequirement(event: React.FormEvent) {
    event.preventDefault()
    if (!workspaceId || !title.trim()) return
    setSaving(true)
    setError("")
    const acceptanceCriteria = criteria.split("\n").map((item) => item.trim()).filter(Boolean)
    try {
      let requirement: Requirement
      const payload = { title: title.trim(), description: description.trim(), kind, priority, acceptance_criteria: acceptanceCriteria }
      if (isSupabaseConfigured) {
        requirement = (await api<{ requirement: Requirement }>(`/api/workspaces/${workspaceId}/requirements`, {
          method: "POST",
          body: JSON.stringify(payload),
        })).requirement
      } else {
        const now = new Date().toISOString()
        requirement = {
          id: crypto.randomUUID(), workspace_id: workspaceId, source_id: null, created_by: "demo-user",
          assigned_to: null, status: "draft", version: 1, created_at: now, updated_at: now, ...payload,
        }
        const all = readLocal<Requirement[]>(DEMO_REQUIREMENTS_KEY, [])
        writeLocal(DEMO_REQUIREMENTS_KEY, [requirement, ...all])
      }
      setRequirements((current) => [requirement, ...current])
      setTitle("")
      setDescription("")
      setCriteria("")
      setKind("business")
      setPriority("medium")
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to create requirement.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-[1380px] space-y-7 p-5 md:p-9 lg:p-12">
      <div className="relative overflow-hidden rounded-[28px] border border-white/[0.07] bg-gradient-to-br from-white/[0.055] to-white/[0.02] p-7 md:p-9">
        <div aria-hidden className="absolute -right-12 -top-20 h-64 w-64 rounded-full bg-sol-gold/10 blur-3xl" />
        <div className="relative flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="sol-app-kicker">Work · Requirements</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.025em] text-white md:text-4xl">Give every requirement a reason to exist.</h1>
          <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">Capture the need, make acceptance explicit, and preserve enough context for the next person to trust it.</p>
        </div>
        {!isSupabaseConfigured && <Badge variant="secondary" className="w-fit rounded-full border border-sol-gold/15 bg-sol-gold/10 px-3 py-1 text-sol-gold">Demo · local browser</Badge>}
        </div>
      </div>

      {!isSupabaseConfigured && (
        <Alert>
          <ShieldCheck className="h-4 w-4" />
          <AlertTitle>Local demo persistence</AlertTitle>
          <AlertDescription>These records are stored only in localStorage. Configure Supabase to enable secured team persistence.</AlertDescription>
        </Alert>
      )}
      {error && <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertDescription>{error}</AlertDescription></Alert>}

      <Card className="sol-app-panel rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg text-white">Choose the context</CardTitle>
          <CardDescription>Select an existing workspace or create one for this initiative.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
          <div className="space-y-2">
            <Label>Current workspace</Label>
            <Select value={workspaceId} onValueChange={setWorkspaceId} disabled={!workspaces.length}>
              <SelectTrigger><SelectValue placeholder="No workspace yet" /></SelectTrigger>
              <SelectContent>{workspaces.map((workspace) => <SelectItem key={workspace.id} value={workspace.id}>{workspace.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="workspace-name">New workspace name</Label>
            <Input id="workspace-name" value={workspaceName} onChange={(event) => setWorkspaceName(event.target.value)} maxLength={120} placeholder="Customer portal redesign" />
          </div>
          <Button onClick={createWorkspace} disabled={saving || !workspaceName.trim()}><Plus className="mr-2 h-4 w-4" /> Create</Button>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <Card className="sol-app-panel h-fit rounded-2xl xl:sticky xl:top-6">
          <CardHeader>
            <CardTitle className="text-lg text-white">Capture requirement</CardTitle>
            <CardDescription>{selectedWorkspace ? `Add a draft to ${selectedWorkspace.name}.` : "Create a workspace first."}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={createRequirement} className="space-y-4">
              <div className="space-y-2"><Label htmlFor="requirement-title">Title</Label><Input id="requirement-title" value={title} onChange={(event) => setTitle(event.target.value)} maxLength={240} required disabled={!workspaceId} /></div>
              <div className="space-y-2"><Label htmlFor="requirement-description">Description</Label><Textarea id="requirement-description" value={description} onChange={(event) => setDescription(event.target.value)} maxLength={20000} rows={5} disabled={!workspaceId} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2"><Label>Kind</Label><Select value={kind} onValueChange={(value) => setKind(value as RequirementKind)} disabled={!workspaceId}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{Object.entries(kindLabels).map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}</SelectContent></Select></div>
                <div className="space-y-2"><Label>Priority</Label><Select value={priority} onValueChange={(value) => setPriority(value as Priority)} disabled={!workspaceId}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{["low", "medium", "high", "critical"].map((value) => <SelectItem key={value} value={value}>{value[0].toUpperCase() + value.slice(1)}</SelectItem>)}</SelectContent></Select></div>
              </div>
              <div className="space-y-2"><Label htmlFor="criteria">Acceptance criteria</Label><Textarea id="criteria" value={criteria} onChange={(event) => setCriteria(event.target.value)} rows={4} placeholder="One criterion per line" disabled={!workspaceId} /></div>
              <Button className="h-11 w-full rounded-full font-semibold shadow-[0_10px_32px_-14px_rgba(239, 125, 69,0.85)]" type="submit" disabled={saving || !workspaceId || !title.trim()}>{saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />} Add draft</Button>
            </form>
          </CardContent>
        </Card>

        <Card className="sol-app-panel rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg text-white">Requirement register</CardTitle>
            <CardDescription>{requirements.length} requirement{requirements.length === 1 ? "" : "s"} in this workspace.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? <div className="flex items-center gap-2 py-8 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading requirements…</div> : requirements.length ? (
              <div className="space-y-3">{requirements.map((requirement) => (
                <article key={requirement.id} className="rounded-xl border border-white/[0.07] bg-black/10 p-5 transition hover:border-white/15 hover:bg-white/[0.025]">
                  <div className="flex flex-wrap items-start justify-between gap-3"><div><div className="flex flex-wrap gap-2"><Badge variant="outline">{kindLabels[requirement.kind]}</Badge><Badge variant="secondary">{requirement.priority}</Badge></div><h2 className="mt-3 font-semibold">{requirement.title}</h2></div><span className="flex items-center gap-1 text-xs text-muted-foreground"><CheckCircle2 className="h-3.5 w-3.5" /> {requirement.status}</span></div>
                  {requirement.description && <p className="mt-3 text-sm leading-6 text-muted-foreground">{requirement.description}</p>}
                  {requirement.acceptance_criteria.length > 0 && <ul className="mt-3 space-y-1 text-sm">{requirement.acceptance_criteria.map((item, index) => <li key={index} className="flex gap-2"><span className="text-emerald-600">✓</span>{item}</li>)}</ul>}
                </article>
              ))}</div>
            ) : <div className="grid place-items-center rounded-lg border border-dashed py-12 text-center"><FileText className="h-8 w-8 text-muted-foreground" /><p className="mt-3 font-medium">No requirements yet</p><p className="mt-1 text-sm text-muted-foreground">Capture the first draft to begin the traceable workflow.</p></div>}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
