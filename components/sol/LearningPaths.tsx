"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowUpRight, CheckCircle2 } from "lucide-react"
import type { LearningPath } from "@/lib/types"
import { ScrollReveal } from "./ScrollReveal"

export function LearningPaths({ paths }: { paths: LearningPath[] }) {
  return (
    <section id="paths" className="px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-sol-gold">Learning paths</p>
            <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-5xl">
              Pick a track, build reusable BA judgment.
            </h2>
          </div>
          <Link href="/paths" className="inline-flex items-center gap-2 text-sm font-medium text-sol-mint">
            View all paths
            <ArrowUpRight className="size-4" />
          </Link>
        </ScrollReveal>
        <div className="mt-12 grid gap-4 lg:grid-cols-2">
          {paths.map((path, index) => (
            <motion.article
              key={path.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06 }}
              whileHover={{ y: -5 }}
              className="group rounded-lg border border-white/10 bg-sol-panel/75 p-6 backdrop-blur-md transition hover:border-sol-gold/40"
            >
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <span className="rounded-full bg-sol-gold/10 px-3 py-1 text-sol-gold">{path.level}</span>
                <span className="text-sol-muted">{path.duration}</span>
                <span className="text-sol-muted">{path.audience}</span>
              </div>
              <h3 className="mt-6 text-2xl font-semibold text-white">{path.title}</h3>
              <p className="mt-3 leading-7 text-sol-muted">{path.description}</p>
              <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-sol-mint" style={{ width: `${path.progress}%` }} />
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {path.modules.map((module) => (
                  <div key={module} className="flex items-center gap-2 text-sm text-sol-muted">
                    <CheckCircle2 className="size-4 text-sol-mint" />
                    {module}
                  </div>
                ))}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
