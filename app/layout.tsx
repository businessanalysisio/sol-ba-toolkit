import type { Metadata } from "next"
import type React from "react"
import { Be_Vietnam_Pro, Noto_Sans } from "next/font/google"
import "./globals.css"

// Be Vietnam Pro (display) + Noto Sans (body). Both serve the vietnamese
// U+1E00–1EFF subset, which is the reason the design system picks them over
// the usual geometric sans faces — Vietnamese diacritics must not fall back.
const display = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
})

const body = Noto_Sans({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
})

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
    <html lang="en" className={`dark scroll-smooth ${display.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  )
}
