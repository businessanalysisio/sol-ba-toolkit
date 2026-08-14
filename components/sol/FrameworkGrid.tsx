"use client"

import { useState } from "react"
import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowUpRight, Layers3, X } from "lucide-react"
import type { Framework } from "@/lib/types"
import { ScrollReveal } from "./ScrollReveal"

export function FrameworkGrid({ frameworks, showHeader = true }: { frameworks: Framework[]; showHeader?: boolean }) {
  const [selected, setSelected] = useState<Framework>(frameworks[0])

  return (
    <section id="frameworks" className="px-4 py-24">
      <div className="mx-auto max-w-6xl">
        {showHeader ? (
          <ScrollReveal className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-sol-gold">Framework library</p>
              <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-5xl">
                The right mental model, one click away.
              </h2>
            </div>
            <Link href="/frameworks" className="inline-flex items-center gap-2 text-sm font-medium text-sol-mint">
              Open library
              <ArrowUpRight className="size-4" />
            </Link>
          </ScrollReveal>
        ) : null}
        <div className="mt-12 grid gap-5 lg:grid-cols-[1fr_380px]">
          <div className="grid gap-3 sm:grid-cols-2">
            {frameworks.map((framework) => (
              <button
                key={framework.id}
                onClick={() => setSelected(framework)}
                className={`rounded-lg border p-5 text-left transition ${
                  selected.id === framework.id
                    ? "border-sol-gold/60 bg-sol-gold/10"
                    : "border-white/10 bg-white/[0.04] hover:border-sol-mint/40 hover:bg-white/[0.07]"
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-sol-muted">{framework.category}</span>
                  <Layers3 className="size-4 text-sol-mint" />
                </div>
                <h3 className="mt-5 text-xl font-semibold text-white">{framework.name}</h3>
                <p className="mt-3 line-clamp-2 text-sm leading-6 text-sol-muted">{framework.description}</p>
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.aside
              key={selected.id}
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -18 }}
              className="sticky top-28 h-fit rounded-lg border border-white/10 bg-sol-panel p-6 shadow-sol-glow"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-sol-gold">{selected.category}</p>
                  <h3 className="mt-2 text-2xl font-semibold text-white">{selected.name}</h3>
                </div>
                <button
                  onClick={() => setSelected(frameworks[0])}
                  className="grid size-8 place-items-center rounded-full border border-white/10 text-sol-muted transition hover:text-white"
                  aria-label="Reset framework selection"
                >
                  <X className="size-4" />
                </button>
              </div>
              <p className="mt-5 leading-7 text-sol-muted">{selected.description}</p>
              <div className="mt-6 border-t border-white/10 pt-6">
                <p className="text-sm font-medium text-white">When to use it</p>
                <p className="mt-2 text-sm leading-6 text-sol-muted">{selected.signal}</p>
              </div>
              <div className="mt-6">
                <p className="text-sm font-medium text-white">Use cases</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {selected.use_cases.map((item) => (
                    <span key={item} className="rounded-full bg-white/8 px-3 py-1 text-xs text-sol-muted">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-6 rounded-md border border-sol-mint/20 bg-sol-mint/10 p-4">
                <p className="text-sm text-sol-muted">Output artifact</p>
                <p className="mt-1 font-medium text-white">{selected.artifact}</p>
              </div>
            </motion.aside>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
