"use client"

import type * as React from "react"
import {
  BarChart3,
  BookOpen,
  Brain,
  Calendar,
  Database,
  FileText,
  Home,
  MessageSquare,
  Settings,
  Users,
  Workflow,
  Zap,
  Target,
  TrendingUp,
  Clock,
  CheckSquare,
  GitBranch,
  Search,
  Bell,
  HelpCircle,
  Shield,
  Palette,
  Globe,
  Archive,
  Building2,
  UserCheck,
  Activity,
  TableIcon,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Menu items organized by category
const menuItems = {
  main: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
      description: "Overview and daily workflow",
    },
    {
      title: "Daily Workflow",
      url: "/dashboard/daily-workflow",
      icon: Clock,
      description: "Start your day with priorities",
    },
    {
      title: "AI Workspace",
      url: "/dashboard/ai-workspace",
      icon: Brain,
      description: "AI-powered analysis and insights",
    },
    {
      title: "AI Assistant",
      url: "/dashboard/ai-assistant",
      icon: MessageSquare,
      description: "Chat with your AI assistant",
    },
  ],
  requirements: [
    {
      title: "Requirements Hub",
      url: "/dashboard/requirements",
      icon: FileText,
      description: "Manage all requirements",
    },
    {
      title: "User Stories",
      url: "/dashboard/user-stories",
      icon: CheckSquare,
      description: "Create and manage user stories",
    },
    {
      title: "Backlog Refinement",
      url: "/dashboard/backlog",
      icon: Target,
      description: "Prioritize and refine backlog",
    },
    {
      title: "Traceability Matrix",
      url: "/dashboard/traceability",
      icon: GitBranch,
      description: "Track requirement relationships",
    },
  ],
  analysis: [
    {
      title: "Process Analysis",
      url: "/dashboard/process-analysis",
      icon: Workflow,
      description: "Analyze business processes",
    },
    {
      title: "Data Analysis",
      url: "/dashboard/data-analysis",
      icon: Database,
      description: "Database schema and analytics",
    },
    {
      title: "Performance Metrics",
      url: "/dashboard/metrics",
      icon: TrendingUp,
      description: "Track project performance",
    },
    {
      title: "Reports & Analytics",
      url: "/dashboard/reports",
      icon: BarChart3,
      description: "Generate insights and reports",
    },
  ],
  collaboration: [
    {
      title: "Stakeholder Management",
      url: "/dashboard/stakeholders",
      icon: Users,
      description: "Manage stakeholder relationships",
    },
    {
      title: "Meeting Management",
      url: "/dashboard/meetings",
      icon: Calendar,
      description: "Schedule and track meetings",
    },
    {
      title: "Partners Directory",
      url: "/dashboard/partners",
      icon: Building2,
      description: "Manage business partners",
    },
    {
      title: "Team Collaboration",
      url: "/dashboard/collaboration",
      icon: UserCheck,
      description: "Team coordination tools",
    },
  ],
  knowledge: [
    {
      title: "Knowledge Base",
      url: "/knowledge-base",
      icon: BookOpen,
      description: "BA best practices and guides",
    },
    {
      title: "Templates Library",
      url: "/dashboard/templates",
      icon: Archive,
      description: "Document templates and forms",
    },
    {
      title: "Learning Center",
      url: "/dashboard/learning",
      icon: Zap,
      description: "Training and development",
    },
    {
      title: "Community Hub",
      url: "/dashboard/community",
      icon: Globe,
      description: "Connect with other BAs",
    },
  ],
  tools: [
    {
      title: "Search & Discovery",
      url: "/dashboard/search",
      icon: Search,
      description: "Find information quickly",
    },
    {
      title: "Notifications",
      url: "/dashboard/notifications",
      icon: Bell,
      description: "Manage alerts and updates",
    },
    {
      title: "Activity Monitor",
      url: "/dashboard/activity",
      icon: Activity,
      description: "Track system activity",
    },
    {
      title: "Inventory Dashboard",
      url: "/dashboard/inventory",
      icon: TableIcon,
      description: "Manage inventory and orders",
    },
  ],
  configuration: [
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings,
      description: "System preferences",
    },
    {
      title: "User Management",
      url: "/dashboard/users",
      icon: Shield,
      description: "Manage users and permissions",
    },
    {
      title: "Customization",
      url: "/dashboard/customization",
      icon: Palette,
      description: "Customize your workspace",
    },
    {
      title: "Help & Support",
      url: "/dashboard/help",
      icon: HelpCircle,
      description: "Get help and support",
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Brain className="size-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">BA Toolkit</span>
            <span className="truncate text-xs text-muted-foreground">Business Analysis Platform</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.main.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.description}>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Requirements Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.requirements.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.description}>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Analysis & Insights</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.analysis.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.description}>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Collaboration</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.collaboration.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.description}>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Knowledge & Learning</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.knowledge.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.description}>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Tools & Utilities</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.tools.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.description}>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Configuration</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.configuration.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.description}>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            {/* Identity chip, not a link — there is no profile route yet. */}
            <div className="flex items-center gap-2 rounded-md p-2 text-sm">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src="/placeholder-user.jpg" alt="" />
                <AvatarFallback className="rounded-lg">SJ</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left leading-tight">
                <span className="truncate font-semibold">Sarah Johnson</span>
                <span className="truncate text-xs text-muted-foreground">Senior BA</span>
              </div>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
