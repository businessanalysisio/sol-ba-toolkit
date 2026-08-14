"use client"

import type React from "react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { BrainCircuit, ChevronDown, LogOut, Plus } from "lucide-react"
import { frameworks, learningPaths } from "@/lib/mock-data"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { isSupabaseConfigured, supabase } from "@/lib/supabase"

// Same routes and labels as before — only the treatment changes. Each section
// carries a hue, shown as a dot instead of an icon, per the SOL screens.
// `count` is only set where a real number exists; nothing is invented.
const navigationItems = [
  { title: "Home", href: "/dashboard", description: "Learn, work, and improve", dot: "bg-sol-gold" },
  {
    title: "AI analysis",
    href: "/dashboard/ai-workspace",
    description: "Requirements and BA copilot",
    dot: "bg-sol-violet",
    badge: "New",
  },
  { title: "Requirements", href: "/dashboard/requirements", description: "Capture and review requirements", dot: "bg-sol-warn" },
  { title: "Traceability", href: "/dashboard/traceability", description: "Goals, coverage, and gaps", dot: "bg-sol-mint" },
  { title: "Decision briefs", href: "/brief-builder", description: "Structure a recommendation", dot: "bg-sol-gold" },
  { title: "Daily workflow", href: "/dashboard/daily-workflow", description: "Priorities and meetings", dot: "bg-sol-info" },
  { title: "Learning paths", href: "/paths", description: "Build BA capability", dot: "bg-sol-mint", count: learningPaths.length },
  { title: "Frameworks", href: "/frameworks", description: "Apply proven methods", dot: "bg-sol-violet", count: frameworks.length },
  { title: "Evidence analysis", href: "/dashboard/data-analysis", description: "Explore data and findings", dot: "bg-sol-mint" },
]

function matchesRoute(pathname: string, href: string) {
  return pathname === href || (href !== "/dashboard" && pathname.startsWith(`${href}/`))
}

function AppSidebar({ user, onSignOut }: { user: any; onSignOut: () => void }) {
  const pathname = usePathname()
  const name = user?.user_metadata?.name ?? user?.name ?? "Sol user"
  const email = user?.email ?? "Business Analyst"

  return (
    <Sidebar className="border-r border-white/[0.06]">
      <SidebarHeader className="border-b border-white/[0.06] p-5">
        <Link href="/dashboard" className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sol-gold to-sol-600 text-slate-950 shadow-[0_8px_28px_-8px_rgba(239, 125, 69,0.8)]">
            <BrainCircuit className="h-4 w-4" />
          </span>
          <span className="flex flex-col">
            <span className="text-base font-semibold tracking-tight">Sol</span>
            <span className="text-[11px] text-muted-foreground">Clarity for complex work</span>
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-3 py-5">
        <SidebarMenu>
          {navigationItems.map((item) => {
            const isActive = matchesRoute(pathname, item.href)
            return (
              <SidebarMenuItem key={item.href}>
                {/* Single line now, so the primitive's h-8 no longer clips —
                    h-auto is kept because the row is taller than 32px. The
                    description moves to the tooltip rather than being dropped. */}
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  tooltip={item.description}
                  className="h-auto"
                >
                  <Link href={item.href} className="flex items-center gap-3 rounded-xl px-3 py-2.5">
                    <span
                      aria-hidden
                      className={`h-1.5 w-1.5 shrink-0 rounded-full ${item.dot} ${isActive ? "ring-4 ring-white/[0.06]" : "opacity-70"}`}
                    />
                    <span className={`flex-1 truncate text-sm ${isActive ? "font-semibold text-white" : "font-medium text-sol-text"}`}>
                      {item.title}
                    </span>
                    {item.badge && (
                      <Badge variant="secondary" className="h-5 rounded-md px-1.5 text-[10px] font-semibold">
                        {item.badge}
                      </Badge>
                    )}
                    {/* Counts come from the bundled demo dataset. With Supabase
                        connected the real figure can differ, so don't assert one. */}
                    {item.count !== undefined && !isSupabaseConfigured && (
                      <span className="text-xs tabular-nums text-sol-dim">{item.count}</span>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t border-white/[0.06] p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start gap-2 px-2">
              <Avatar className="h-7 w-7">
                <AvatarImage src="/placeholder-user.jpg" alt="" />
                <AvatarFallback>{name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className="min-w-0 flex-1 text-left">
                <span className="block truncate text-sm font-medium">{name}</span>
                <span className="block truncate text-xs text-muted-foreground">{email}</span>
              </span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={onSignOut}>
              <LogOut className="mr-2 h-4 w-4" /> Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

export function DashboardClient({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const pathname = usePathname()
  const pageTitle = navigationItems.find((item) => matchesRoute(pathname, item.href))?.title

  useEffect(() => {
    async function loadUser() {
      if (isSupabaseConfigured && supabase) {
        const { data } = await supabase.auth.getUser()
        if (data.user) {
          setUser(data.user)
          return
        }
      } else {
        const stored = localStorage.getItem("user")
        if (stored) {
          try {
            setUser(JSON.parse(stored))
            return
          } catch {
            localStorage.removeItem("user")
          }
        }
      }
      router.replace("/login")
    }
    void loadUser()
  }, [router])

  async function handleSignOut() {
    if (isSupabaseConfigured && supabase) await supabase.auth.signOut()
    localStorage.removeItem("user")
    router.replace("/login")
  }

  // `children` is always rendered, even before auth resolves. Returning early
  // here would stop the server from ever evaluating the page beneath this
  // layout, so a page calling notFound() could never produce a 404 — it would
  // answer 200 with an empty shell. The gate is drawn as an overlay instead.
  return (
    <SidebarProvider>
      <div className="sol-app-shell flex h-screen w-full text-foreground">
        {user ? <AppSidebar user={user} onSignOut={handleSignOut} /> : null}
        <SidebarInset className="flex-1">
          {user ? (
            <header className="flex h-16 shrink-0 items-center gap-3 border-b border-white/[0.06] bg-background/65 px-5 backdrop-blur-xl">
              <SidebarTrigger className="-ml-1" />
              {pageTitle && (
                <h1 className="truncate text-lg font-semibold tracking-tight text-white">{pageTitle}</h1>
              )}
              {!isSupabaseConfigured && (
                <span className="hidden shrink-0 rounded-lg border border-white/[0.14] px-2.5 py-1 text-xs font-medium text-sol-dim sm:inline">
                  Demo data
                </span>
              )}
              <div className="flex-1" />
              <Button size="sm" className="rounded-xl px-4 shadow-[0_8px_28px_-12px_rgba(239,125,69,0.8)]" asChild>
                <Link href="/brief-builder"><Plus className="mr-2 h-4 w-4" /> New brief</Link>
              </Button>
            </header>
          ) : null}
          <main className="sol-app-canvas flex-1 overflow-auto" aria-busy={!user}>
            {children}
          </main>
        </SidebarInset>
      </div>

      {user ? null : (
        <div className="fixed inset-0 z-50 grid place-items-center bg-background text-sm text-muted-foreground">
          Loading Sol…
        </div>
      )}
    </SidebarProvider>
  )
}
