import type { Metadata } from "next"
import type React from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "Sol | Second Brain for Business Analysis",
  description:
    "Sol helps founders, product managers, business analysts, and tech entrepreneurs transform scattered business knowledge into actionable insight.",
  generator: "Next.js",
  metadataBase: new URL("https://sol.local"),
  openGraph: {
    title: "Sol | Second Brain for Business Analysis",
    description: "Structured learning paths, interactive frameworks, and AI-powered knowledge organization.",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body>{children}</body>
    </html>
  )
}
