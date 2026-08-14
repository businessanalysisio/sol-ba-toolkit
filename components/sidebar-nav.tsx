"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  Brain,
  Target,
  BookOpen,
  Briefcase,
  Settings,
  Calendar,
  FileText,
  MessageSquare,
  BarChart3,
} from "lucide-react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function SidebarNav() {
  const pathname = usePathname()

  const mainNavItems = [
    {
      label: "Home Dashboard",
      href: "/dashboard",
      icon: Home,
      description: "Quick access to key data and personalized actions",
    },
    {
      label: "AI Workspace",
      href: "/dashboard/ai-workspace",
      icon: Brain,
      description: "AI copilot and intelligent analysis tools",
    },
    {
      label: "Requirements Hub",
      href: "/dashboard/requirements",
      icon: Target,
      description: "End-to-end requirements lifecycle management",
    },
    {
      label: "Knowledge Center",
      href: "/knowledge-base",
      icon: BookOpen,
      description: "Best practices, templates, and learning resources",
    },
    {
      label: "Collaboration Hub",
      href: "/dashboard/collaboration",
      icon: MessageSquare,
      description: "Stakeholder management and team collaboration",
    },
    {
      label: "Projects & Initiatives",
      href: "/dashboard/projects",
      icon: Briefcase,
      description: "Track BA involvement across all initiatives",
    },
  ]

  const toolsNavItems = [
    {
      label: "Calendar & Meetings",
      href: "/dashboard/calendar",
      icon: Calendar,
      description: "Schedule and manage stakeholder meetings",
    },
    {
      label: "Documentation",
      href: "/dashboard/documentation",
      icon: FileText,
      description: "Create and manage BA deliverables",
    },
    {
      label: "Analytics",
      href: "/dashboard/analytics",
      icon: BarChart3,
      description: "Performance metrics and insights",
    },
  ]

  const settingsNavItems = [
    {
      label: "Settings & Preferences",
      href: "/dashboard/settings",
      icon: Settings,
      description: "Customize your workspace and preferences",
    },
  ]

  return (
    <div className="space-y-4">
      <SidebarGroup>
        <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Main Workspace
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {mainNavItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={isActive} className="h-auto py-3">
                    <Link href={item.href}>
                      <div className="flex items-start gap-3">
                        <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm">{item.label}</div>
                          <div className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{item.description}</div>
                        </div>
                      </div>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarGroup>
        <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Tools & Utilities
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {toolsNavItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={isActive} className="h-auto py-3">
                    <Link href={item.href}>
                      <div className="flex items-start gap-3">
                        <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm">{item.label}</div>
                          <div className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{item.description}</div>
                        </div>
                      </div>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarGroup>
        <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Configuration
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {settingsNavItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={isActive} className="h-auto py-3">
                    <Link href={item.href}>
                      <div className="flex items-start gap-3">
                        <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm">{item.label}</div>
                          <div className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{item.description}</div>
                        </div>
                      </div>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </div>
  )
}
