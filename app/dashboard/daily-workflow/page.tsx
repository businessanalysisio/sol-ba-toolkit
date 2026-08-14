"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Bell,
  BookOpen,
  Calendar,
  CheckCircle2,
  ClipboardList,
  Clock,
  Coffee,
  FileText,
  Info,
  Moon,
  Plus,
  Sparkles,
  Sun,
  Sunrise,
  Target,
  Timer,
  TrendingUp,
  Users,
} from "lucide-react"

interface DailyTask {
  id: string
  title: string
  project: string
  priority: "high" | "medium" | "low"
  status: "pending" | "in-progress" | "scheduled"
  dueTime: string
  estimatedDuration: string
  type: "meeting" | "review" | "documentation" | "analysis"
  stakeholders: string[]
}

interface Notification {
  id: string
  title: string
  message: string
  type: "urgent" | "info" | "success" | "warning"
  time: string
  actionable: boolean
}

interface Meeting {
  id: string
  title: string
  time: string
  duration: string
  attendees: number
  type: "standup" | "review" | "interview" | "planning"
  project: string
}

interface Metric {
  label: string
  value: string
  change: string
  trend: "up" | "down" | "stable"
  /** Which direction is good, so the delta is coloured by meaning rather than sign. */
  goodDirection: "up" | "down"
  /** 0-100 where the metric has a real ceiling. Omitted metrics render without a meter. */
  pct?: number
}

/** "2:00 PM" -> minutes since midnight, so the schedule can be laid out against the clock. */
function parseTime(label: string) {
  const match = label.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
  if (!match) return 0
  const [, rawHour, minutes, meridiem] = match
  const hour = Number(rawHour) % 12 + (meridiem.toUpperCase() === "PM" ? 12 : 0)
  return hour * 60 + Number(minutes)
}

const DAY_START = 9 * 60
const DAY_END = 18 * 60

/** Meter fill and track are steps of one hue, chosen by how healthy the level is. */
function meterTone(pct: number) {
  if (pct >= 80) return { fill: "bg-sol-mint", track: "bg-sol-mint/15" }
  if (pct >= 60) return { fill: "bg-sol-gold", track: "bg-sol-gold/15" }
  return { fill: "bg-sol-coral", track: "bg-sol-coral/15" }
}

export default function DailyWorkflowPage() {
  // Rendered on the server too, so the clock starts null and fills in after
  // mount — otherwise server and client disagree and hydration warns.
  const [now, setNow] = useState<Date | null>(null)
  const [showQuickStart, setShowQuickStart] = useState(false)

  useEffect(() => {
    setNow(new Date())
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const minutesNow = now ? now.getHours() * 60 + now.getMinutes() : DAY_START

  const getGreeting = () => {
    const hour = now?.getHours() ?? 9
    if (hour < 12) return { text: "Good morning", icon: Sunrise }
    if (hour < 17) return { text: "Good afternoon", icon: Sun }
    return { text: "Good evening", icon: Moon }
  }

  const greeting = getGreeting()
  const GreetingIcon = greeting.icon

  const todaysTasks: DailyTask[] = [
    {
      id: "1",
      title: "Stakeholder Interview — Customer Portal",
      project: "Customer Portal Redesign",
      priority: "high",
      status: "scheduled",
      dueTime: "10:00 AM",
      estimatedDuration: "1h",
      type: "meeting",
      stakeholders: ["Sarah Johnson", "Mike Chen"],
    },
    {
      id: "2",
      title: "Review Requirements Document v2.1",
      project: "Supply Chain Optimization",
      priority: "high",
      status: "pending",
      dueTime: "2:00 PM",
      estimatedDuration: "45m",
      type: "review",
      stakeholders: ["Emily Davis"],
    },
    {
      id: "3",
      title: "Update User Story Acceptance Criteria",
      project: "Digital Marketing Platform",
      priority: "medium",
      status: "in-progress",
      dueTime: "3:30 PM",
      estimatedDuration: "30m",
      type: "documentation",
      stakeholders: ["John Smith", "Lisa Rodriguez"],
    },
    {
      id: "4",
      title: "Process Flow Analysis — Payment System",
      project: "Payment Gateway Integration",
      priority: "medium",
      status: "pending",
      dueTime: "4:15 PM",
      estimatedDuration: "1h 15m",
      type: "analysis",
      stakeholders: ["David Wilson"],
    },
  ]

  const notifications: Notification[] = [
    {
      id: "1",
      title: "Requirements approval needed",
      message: "Customer Portal requirements need your approval before 3 PM today.",
      type: "urgent",
      time: "5 minutes ago",
      actionable: true,
    },
    {
      id: "2",
      title: "Meeting reminder",
      message: "Stakeholder interview starts in 15 minutes.",
      type: "info",
      time: "10 minutes ago",
      actionable: true,
    },
    {
      id: "3",
      title: "AI analysis complete",
      message: "Process analysis for Supply Chain is ready for review.",
      type: "success",
      time: "1 hour ago",
      actionable: true,
    },
    {
      id: "4",
      title: "Requirements updated",
      message: "New requirements added to Digital Marketing Platform.",
      type: "info",
      time: "2 hours ago",
      actionable: false,
    },
  ]

  const todaysMeetings: Meeting[] = [
    { id: "1", title: "Daily Standup — Portal Team", time: "9:00 AM", duration: "15m", attendees: 6, type: "standup", project: "Customer Portal" },
    { id: "2", title: "Stakeholder Interview", time: "10:00 AM", duration: "60m", attendees: 3, type: "interview", project: "Customer Portal" },
    { id: "3", title: "Requirements Review", time: "2:00 PM", duration: "45m", attendees: 4, type: "review", project: "Supply Chain" },
    { id: "4", title: "Sprint Planning", time: "4:00 PM", duration: "90m", attendees: 8, type: "planning", project: "Digital Marketing" },
  ]

  const metrics: Metric[] = [
    { label: "Requirements velocity", value: "12/week", change: "+15%", trend: "up", goodDirection: "up" },
    { label: "Stakeholder satisfaction", value: "4.7/5", change: "+0.2", trend: "up", goodDirection: "up", pct: 94 },
    { label: "Project health score", value: "87%", change: "+3%", trend: "up", goodDirection: "up", pct: 87 },
    { label: "Completion rate", value: "94%", change: "-2%", trend: "down", goodDirection: "up", pct: 94 },
  ]

  const quickActions = [
    { label: "AI workspace", href: "/dashboard/ai-workspace", icon: Sparkles, tone: "text-sol-violet" },
    { label: "New requirement", href: "/dashboard/requirements", icon: ClipboardList, tone: "text-sol-gold" },
    { label: "Decision brief", href: "/brief-builder", icon: FileText, tone: "text-sol-mint" },
    { label: "Knowledge base", href: "/knowledge-base", icon: BookOpen, tone: "text-sol-violet" },
  ]

  const activity = [
    { initials: "SJ", name: "Sarah Johnson", action: "updated requirements for", target: "Customer Portal", time: "2 minutes ago" },
    { initials: "MC", name: "Mike Chen", action: "completed analysis for", target: "Supply Chain", time: "15 minutes ago" },
    { initials: "ED", name: "Emily Davis", action: "scheduled a review meeting for", target: "Digital Marketing", time: "1 hour ago" },
  ]

  // Priority and status are carried by an icon or a shaped mark as well as hue,
  // so nothing depends on colour alone.
  const priorityTone: Record<DailyTask["priority"], { rail: string; text: string; label: string }> = {
    high: { rail: "bg-sol-coral", text: "text-sol-coral", label: "High" },
    medium: { rail: "bg-sol-gold", text: "text-sol-gold", label: "Medium" },
    low: { rail: "bg-sol-mint", text: "text-sol-mint", label: "Low" },
  }

  const statusTone: Record<DailyTask["status"], string> = {
    pending: "border-white/10 text-muted-foreground",
    "in-progress": "border-sol-mint/25 bg-sol-mint/10 text-sol-mint",
    scheduled: "border-sol-violet/25 bg-sol-violet/10 text-sol-violet",
  }

  const notificationTone: Record<Notification["type"], { rail: string; icon: typeof Info; text: string }> = {
    urgent: { rail: "border-l-sol-coral bg-sol-coral/[0.07]", icon: AlertTriangle, text: "text-sol-coral" },
    warning: { rail: "border-l-sol-gold bg-sol-gold/[0.07]", icon: AlertTriangle, text: "text-sol-gold" },
    success: { rail: "border-l-sol-mint bg-sol-mint/[0.07]", icon: CheckCircle2, text: "text-sol-mint" },
    info: { rail: "border-l-sol-violet bg-sol-violet/[0.06]", icon: Info, text: "text-sol-violet" },
  }

  const meetingTone: Record<Meeting["type"], string> = {
    standup: "text-sol-violet",
    review: "text-sol-mint",
    interview: "text-sol-gold",
    planning: "text-sol-coral",
  }

  const urgentCount = notifications.filter((n) => n.type === "urgent").length
  const nextMeeting = todaysMeetings.find((m) => parseTime(m.time) >= minutesNow)
  const dayProgress = Math.min(100, Math.max(0, ((minutesNow - DAY_START) / (DAY_END - DAY_START)) * 100))
  const minutesLeft = Math.max(0, DAY_END - minutesNow)

  return (
    <div className="mx-auto max-w-[1380px] space-y-8 p-5 md:p-9 lg:p-12">
      {/* Hero — the day at a glance */}
      <section className="sol-app-panel relative overflow-hidden rounded-[28px] p-7 md:p-9">
        <div aria-hidden className="absolute -right-24 -top-28 h-80 w-80 rounded-full bg-sol-gold/10 blur-3xl" />
        <div aria-hidden className="absolute -bottom-24 left-1/4 h-56 w-72 rounded-full bg-sol-mint/[0.07] blur-3xl" />

        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="sol-app-kicker">
              <span className="h-1.5 w-1.5 rounded-full bg-sol-mint shadow-[0_0_12px_rgba(120,230,198,0.9)]" />
              Daily workflow · Demo data
            </p>
            <h1 className="mt-5 flex items-center gap-3 text-3xl font-semibold tracking-[-0.03em] text-white md:text-4xl">
              <GreetingIcon className="h-7 w-7 text-sol-gold" aria-hidden />
              {greeting.text}, Sarah
            </h1>
            <p className="mt-3 text-base text-muted-foreground">
              {now
                ? now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })
                : " "}
              {nextMeeting && (
                <>
                  {" · "}
                  <span className="text-white">
                    Next up: {nextMeeting.title} at {nextMeeting.time}
                  </span>
                </>
              )}
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Dialog open={showQuickStart} onOpenChange={setShowQuickStart}>
                <DialogTrigger asChild>
                  <button className="inline-flex h-11 items-center gap-2 rounded-full bg-sol-gold px-5 text-sm font-semibold text-sol-night shadow-[0_12px_40px_-14px_rgba(246,199,107,0.9)] transition hover:-translate-y-0.5 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sol-gold focus-visible:ring-offset-2 focus-visible:ring-offset-sol-night">
                    <Coffee className="h-4 w-4" />
                    Quick start
                  </button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>How would you like to start your day?</DialogTitle>
                    <DialogDescription>Pick a way in — each opens the tool you need.</DialogDescription>
                  </DialogHeader>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {quickActions.map((action) => {
                      const Icon = action.icon
                      return (
                        <Link
                          key={action.href}
                          href={action.href}
                          onClick={() => setShowQuickStart(false)}
                          className="flex h-24 flex-col items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.02] text-sm font-medium text-white transition hover:border-white/20 hover:bg-white/[0.06]"
                        >
                          <Icon className={`h-5 w-5 ${action.tone}`} aria-hidden />
                          {action.label}
                        </Link>
                      )
                    })}
                  </div>
                </DialogContent>
              </Dialog>

              <button className="inline-flex h-11 items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-5 text-sm font-semibold text-white transition hover:border-sol-mint/50 hover:bg-sol-mint/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sol-mint">
                <Plus className="h-4 w-4" />
                New task
              </button>
            </div>
          </div>

          {/* Hero figure — the clock, with the working day as a meter beneath it */}
          <div className="w-full lg:w-72">
            <div className="rounded-2xl border border-white/[0.07] bg-black/20 p-5">
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">Local time</p>
              <p className="mt-2 text-5xl font-semibold tabular-nums tracking-tight text-white">
                {now
                  ? now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })
                  : "--:--"}
              </p>

              <div className="mt-5 flex items-center justify-between text-xs text-muted-foreground">
                <span>Working day</span>
                <span className="tabular-nums">
                  {minutesLeft > 0
                    ? `${Math.floor(minutesLeft / 60)}h ${minutesLeft % 60}m left`
                    : "Day complete"}
                </span>
              </div>
              {/* Meter: fill and track are steps of one hue, so state reads across the bar. */}
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-sol-gold/15">
                <div
                  className="h-full rounded-full bg-sol-gold transition-[width] duration-1000 ease-linear"
                  style={{ width: `${dayProgress}%` }}
                  role="progressbar"
                  aria-valuenow={Math.round(dayProgress)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Progress through the working day"
                />
              </div>

              <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-white/[0.07] pt-4">
                <div>
                  <dt className="text-xs text-muted-foreground">Tasks</dt>
                  <dd className="text-xl font-semibold text-white">{todaysTasks.length}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Meetings</dt>
                  <dd className="text-xl font-semibold text-white">{todaysMeetings.length}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-6">
          {/* Priority tasks */}
          <section className="sol-app-panel rounded-2xl p-6 md:p-7">
            <header className="flex items-end justify-between gap-4">
              <div>
                <p className="sol-app-kicker">01 · Focus</p>
                <h2 className="mt-2 flex items-center gap-2 text-xl font-semibold text-white">
                  <Target className="h-5 w-5 text-sol-gold" aria-hidden />
                  Priority tasks
                </h2>
              </div>
              <p className="text-sm text-muted-foreground">
                {todaysTasks.filter((t) => t.status === "pending").length} pending of {todaysTasks.length}
              </p>
            </header>

            <ul className="mt-5 space-y-3">
              {todaysTasks.map((task) => {
                const tone = priorityTone[task.priority]
                const isPast = parseTime(task.dueTime) < minutesNow && task.status !== "in-progress"
                return (
                  <li
                    key={task.id}
                    className="group relative overflow-hidden rounded-xl border border-white/[0.06] bg-black/10 p-4 pl-5 transition hover:border-white/15 hover:bg-white/[0.035]"
                  >
                    {/* Priority rail — hue plus position, echoed by the text label below. */}
                    <span aria-hidden className={`absolute inset-y-0 left-0 w-[3px] ${tone.rail}`} />

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`text-[11px] font-semibold uppercase tracking-[0.14em] ${tone.text}`}>
                            {tone.label}
                          </span>
                          <span
                            className={`rounded-full border px-2 py-0.5 text-[11px] font-medium capitalize ${statusTone[task.status]}`}
                          >
                            {task.status.replace("-", " ")}
                          </span>
                          {isPast && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-sol-coral">
                              <AlertTriangle className="h-3 w-3" aria-hidden />
                              Overdue
                            </span>
                          )}
                        </div>

                        <h3 className="mt-2 truncate font-medium text-white">{task.title}</h3>
                        <p className="mt-0.5 text-sm text-muted-foreground">
                          {task.project} · <span className="capitalize">{task.type}</span>
                        </p>

                        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                          <span className="inline-flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5" aria-hidden />
                            <span className="tabular-nums">{task.dueTime}</span>
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <Timer className="h-3.5 w-3.5" aria-hidden />
                            {task.estimatedDuration}
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <Users className="h-3.5 w-3.5" aria-hidden />
                            {task.stakeholders.join(", ")}
                          </span>
                        </div>
                      </div>

                      <div className="flex shrink-0 gap-2">
                        <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-white">
                          View
                        </Button>
                        <Button
                          size="sm"
                          className="bg-white/10 text-white hover:bg-sol-gold hover:text-sol-night"
                        >
                          Start
                        </Button>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          </section>

          {/* Schedule as a timeline, so the day reads spatially */}
          <section className="sol-app-panel rounded-2xl p-6 md:p-7">
            <header className="flex items-end justify-between gap-4">
              <div>
                <p className="sol-app-kicker">02 · Schedule</p>
                <h2 className="mt-2 flex items-center gap-2 text-xl font-semibold text-white">
                  <Calendar className="h-5 w-5 text-sol-mint" aria-hidden />
                  Today's timeline
                </h2>
              </div>
              <p className="text-sm text-muted-foreground">{todaysMeetings.length} meetings</p>
            </header>

            <ol className="relative mt-6 space-y-1 border-l border-white/[0.08] pl-6">
              {todaysMeetings.map((meeting) => {
                const start = parseTime(meeting.time)
                const isPast = start < minutesNow
                const isNext = nextMeeting?.id === meeting.id
                return (
                  <li key={meeting.id} className="relative">
                    <span
                      aria-hidden
                      className={`absolute -left-[27px] top-5 h-2.5 w-2.5 rounded-full border-2 ${
                        isNext
                          ? "border-sol-gold bg-sol-gold shadow-[0_0_14px_rgba(246,199,107,0.8)]"
                          : isPast
                            ? "border-white/25 bg-sol-night"
                            : "border-white/40 bg-sol-night"
                      }`}
                    />
                    <div
                      className={`flex items-center justify-between gap-4 rounded-xl border p-3.5 transition ${
                        isNext
                          ? "border-sol-gold/30 bg-sol-gold/[0.06]"
                          : "border-transparent hover:border-white/10 hover:bg-white/[0.03]"
                      } ${isPast ? "opacity-50" : ""}`}
                    >
                      <div className="flex min-w-0 items-center gap-4">
                        <div className="w-[76px] shrink-0 text-right">
                          <div className="whitespace-nowrap text-sm tabular-nums text-white">{meeting.time}</div>
                          <div className="text-xs text-muted-foreground">{meeting.duration}</div>
                        </div>
                        <div className="min-w-0">
                          <h3 className="truncate font-medium text-white">
                            {meeting.title}
                            {isNext && (
                              <span className="ml-2 rounded-full bg-sol-gold/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-sol-gold">
                                Next
                              </span>
                            )}
                          </h3>
                          <p className="mt-0.5 text-sm text-muted-foreground">
                            <span className={`capitalize ${meetingTone[meeting.type]}`}>{meeting.type}</span>
                            {" · "}
                            {meeting.project}
                          </p>
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-3">
                        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Users className="h-3.5 w-3.5" aria-hidden />
                          {meeting.attendees}
                        </span>
                        <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-white">
                          Join
                        </Button>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ol>
          </section>
        </div>

        {/* Right rail */}
        <div className="space-y-6">
          <section className="sol-app-panel rounded-2xl p-6">
            <header className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
                <Bell className="h-5 w-5 text-sol-gold" aria-hidden />
                Notifications
              </h2>
              {urgentCount > 0 && (
                <span className="rounded-full border border-sol-coral/30 bg-sol-coral/10 px-2.5 py-0.5 text-xs font-semibold text-sol-coral">
                  {urgentCount} urgent
                </span>
              )}
            </header>

            <ul className="mt-4 space-y-2.5">
              {notifications.map((notification) => {
                const tone = notificationTone[notification.type]
                const Icon = tone.icon
                return (
                  <li
                    key={notification.id}
                    className={`rounded-r-lg border-l-2 p-3 ${tone.rail}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="flex items-center gap-1.5 text-sm font-medium text-white">
                          <Icon className={`h-3.5 w-3.5 shrink-0 ${tone.text}`} aria-hidden />
                          {notification.title}
                        </h3>
                        <p className="mt-1 text-sm leading-5 text-muted-foreground">{notification.message}</p>
                        <p className="mt-1.5 text-xs text-muted-foreground/70">{notification.time}</p>
                      </div>
                      {notification.actionable && (
                        <button
                          aria-label={`Open: ${notification.title}`}
                          className="shrink-0 rounded-md p-1.5 text-muted-foreground transition hover:bg-white/10 hover:text-white"
                        >
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </li>
                )
              })}
            </ul>
          </section>

          {/* KPI tiles: label · value · delta vs a named period · meter where there's a ceiling */}
          <section className="sol-app-panel rounded-2xl p-6">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
              <TrendingUp className="h-5 w-5 text-sol-mint" aria-hidden />
              Performance
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">Your metrics vs last week</p>

            <ul className="mt-5 space-y-4">
              {metrics.map((metric) => {
                const isGood = metric.trend === "stable" || metric.trend === metric.goodDirection
                return (
                  <li key={metric.label}>
                    <div className="flex items-end justify-between gap-3">
                      <div>
                        <p className="text-sm text-muted-foreground">{metric.label}</p>
                        <p className="mt-0.5 text-2xl font-semibold tracking-tight text-white">{metric.value}</p>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                          isGood ? "bg-sol-mint/10 text-sol-mint" : "bg-sol-coral/10 text-sol-coral"
                        }`}
                      >
                        <TrendingUp
                          className={`h-3 w-3 ${metric.trend === "down" ? "rotate-180" : ""}`}
                          aria-hidden
                        />
                        {metric.change}
                      </span>
                    </div>
                    {metric.pct !== undefined && (() => {
                      // The meter shows the level, so its fill carries the severity of
                      // the value. The direction of the change is the delta chip's job —
                      // 94% completion is a good level even when it slipped 2 points.
                      const meter = meterTone(metric.pct)
                      return (
                        <div className={`mt-2 h-1 overflow-hidden rounded-full ${meter.track}`}>
                          <div className={`h-full rounded-full ${meter.fill}`} style={{ width: `${metric.pct}%` }} />
                        </div>
                      )
                    })()}
                  </li>
                )
              })}
            </ul>
          </section>

          <section className="sol-app-panel rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white">Quick actions</h2>
            <div className="mt-4 grid grid-cols-2 gap-2.5">
              {quickActions.map((action) => {
                const Icon = action.icon
                return (
                  <Link
                    key={action.href}
                    href={action.href}
                    className="flex h-20 flex-col items-center justify-center gap-1.5 rounded-xl border border-white/[0.06] bg-black/10 text-center text-xs font-medium text-white transition hover:border-white/15 hover:bg-white/[0.05]"
                  >
                    <Icon className={`h-5 w-5 ${action.tone}`} aria-hidden />
                    {action.label}
                  </Link>
                )
              })}
            </div>
            <Link
              href="/dashboard/data-analysis"
              className="mt-2.5 flex items-center justify-between rounded-xl border border-white/[0.06] p-3.5 text-sm font-medium text-white transition hover:bg-white/[0.04]"
            >
              Analyze evidence
              <BarChart3 className="h-4 w-4 text-muted-foreground" aria-hidden />
            </Link>
          </section>

          <section className="sol-app-panel rounded-2xl p-6">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
              <Activity className="h-5 w-5 text-sol-violet" aria-hidden />
              Recent activity
            </h2>
            <ul className="mt-4 space-y-4">
              {activity.map((item) => (
                <li key={item.name} className="flex items-start gap-3">
                  <Avatar className="h-8 w-8 shrink-0 border border-white/10">
                    <AvatarImage src="/placeholder-user.jpg" alt="" />
                    <AvatarFallback className="bg-white/[0.06] text-xs text-white">{item.initials}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="text-sm leading-5 text-muted-foreground">
                      <span className="font-medium text-white">{item.name}</span> {item.action}{" "}
                      <span className="text-sol-gold">{item.target}</span>
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground/70">{item.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}
