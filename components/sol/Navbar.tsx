"use client"

import Link from "next/link"
import { motion, useScroll, useSpring } from "framer-motion"
import { ArrowRight, BrainCircuit } from "lucide-react"

const links = [
  { href: "/#features", label: "Features" },
  { href: "/paths", label: "Paths" },
  { href: "/frameworks", label: "Frameworks" },
  { href: "/skills", label: "Skills" },
  { href: "/brief-builder", label: "Tool" },
  { href: "/#pricing", label: "Pricing" },
]

export function Navbar() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24, restDelta: 0.001 })

  return (
    <header className="fixed left-0 right-0 top-4 z-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-6xl overflow-hidden rounded-full border border-white/10 bg-sol-ink/75 shadow-sol-glow backdrop-blur-xl"
      >
        <motion.div className="h-px origin-left bg-sol-gold" style={{ scaleX }} />
        <div className="flex h-14 items-center justify-between px-4 sm:px-5">
          <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight text-white">
            <span className="grid size-8 place-items-center rounded-full border border-sol-gold/30 bg-sol-gold/10">
              <BrainCircuit className="size-4 text-sol-gold" />
            </span>
            Sol
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-sol-muted md:flex">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="transition hover:text-white">
                {link.label}
              </Link>
            ))}
          </nav>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-sol-night transition hover:bg-sol-gold"
          >
            Open app
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </motion.div>
    </header>
  )
}
