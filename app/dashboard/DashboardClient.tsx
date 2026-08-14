"use client"

import type React from "react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  BarChart3,
  BookOpen,
  Bot,
  BrainCircuit,
  CalendarDays,
  ChevronDown,
  ClipboardList,
  FileText,
  Home,
  Library,
  LogOut,
  Plus,
} from "lucide-react"
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

const navigationItems = [
  { title: "Home", href: "/dashboard", icon: Home, description: "Learn, work, and improve" },
  {
    title: "AI analysis",
    href: "/dashboard/ai-workspace",
    icon: Bot,
    description: "Requirements and BA copilot",
    badge: "New",
  },
  { title: "Requirements", href: "/dashboard/requirements", icon: ClipboardList, description: "Capture and review requirements" },
  { title: "Decision briefs", href: "/brief-builder", icon: FileText, description: "Structure a recommendation" },
  { title: "Daily workflow", href: "/dashboard/daily-workflow", icon: CalendarDays, description: "Priorities and meetings" },
  { title: "Learning paths", href: "/paths", icon: BookOpen, description: "Build BA capability" },
  { title: "Frameworks", href: "/frameworks", icon: Library, description: "Apply proven methods" },
  { title: "Evidence analysis", href: "/dashboard/data-analysis", icon: BarChart3, description: "Explore data and findings" },
]

function AppSidebar({ user, onSignOut }: { user: any; onSignOut: () => void }) {
  const pathname = usePathname()
  const name = user?.user_metadata?.name ?? user?.name ?? "Sol user"
  const email = user?.email ?? "Business Analyst"

  return (
    <Sidebar className="border-r border-white/[0.06]">
      <SidebarHeader className="border-b border-white/[0.06] p-5">
        <Link href="/dashboard" className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sol-gold to-amber-500 text-slate-950 shadow-[0_8px_28px_-8px_rgba(246,199,107,0.8)]">
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
            const Icon = item.icon
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(`${item.href}/`))
            return (
              <SidebarMenuItem key={item.href}>
                {/* h-auto overrides the primitive's fixed h-8: these items are two
                    lines, and a 32px box clipped the description into the row below. */}
                <SidebarMenuButton asChild isActive={isActive} tooltip={item.title} className="h-auto">
                  <Link href={item.href} className="flex items-center gap-3 rounded-xl px-3 py-2.5">
                    <Icon className="h-4 w-4" />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium">{item.title}</span>
                        {item.badge && <Badge variant="secondary" className="text-[10px]">{item.badge}</Badge>}
                      </span>
                      <span className="mt-0.5 block truncate text-xs text-muted-foreground">{item.description}</span>
                    </span>
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
            <header className="flex h-16 shrink-0 items-center gap-2 border-b border-white/[0.06] bg-background/65 px-5 backdrop-blur-xl">
              <SidebarTrigger className="-ml-1" />
              <div className="flex-1" />
              <Button size="sm" className="rounded-full px-4 shadow-[0_8px_28px_-12px_rgba(246,199,107,0.8)]" asChild>
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
