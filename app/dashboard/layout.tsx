import type React from "react"
import { DashboardClient } from "./DashboardClient"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardClient>{children}</DashboardClient>
}
