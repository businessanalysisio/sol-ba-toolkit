"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, BookOpen, Clock } from "lucide-react";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/animations";
import type { LearningPath } from "@/lib/types";

const levelStyles: Record<string, string> = {
  Foundation: "border-emerald-400/25 bg-emerald-400/10 text-emerald-300",
  Intermediate: "border-sol-400/25 bg-sol-400/10 text-sol-300",
  Advanced: "border-rose-400/25 bg-rose-400/10 text-rose-300",
};

export default function LearningPaths({ paths }: { paths: LearningPath[] }) {
  return (
    <section id="paths" className="section-pad relative">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[480px] w-[820px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(251,191,36,0.07),transparent)]"
      />
      <div className="relative mx-auto max-w-6xl">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end"
        >
          <div className="max-w-xl">
            <motion.span variants={fadeUp} className="eyebrow">
              Learning paths
            </motion.span>
            <motion.h2
              variants={fadeUp}
              className="text-balance text-3xl font-bold tracking-tight text-white sm:text-5xl"
            >
              Structured tracks, <span className="text-gradient">not scattered tutorials</span>
            </motion.h2>
          </div>
          <motion.div variants={fadeUp}>
            <Link
              href="/paths"
              className="group inline-flex items-center gap-1.5 text-sm font-medium text-sol-300 transition-colors hover:text-sol-200"
            >
              View all paths
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mt-14 grid gap-5 md:grid-cols-2"
        >
          {paths.map((path, i) => (
            <motion.div key={path.id} variants={fadeUp} custom={i}>
              <Link
                href="/paths"
                className="glass glass-hover group relative block overflow-hidden rounded-3xl p-7 transition-transform duration-300 hover:-translate-y-1 sm:p-8"
              >
                <div
                  aria-hidden
                  className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${path.accent} opacity-70 transition-opacity group-hover:opacity-100`}
                />
                <div className="flex items-center justify-between gap-4">
                  <span
                    className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${levelStyles[path.level]}`}
                  >
                    {path.level}
                  </span>
                  <ArrowUpRight className="h-5 w-5 text-zinc-600 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-sol-300" />
                </div>
                <h3 className="mt-5 text-2xl font-semibold text-white">{path.title}</h3>
                <p className="mt-3 leading-relaxed text-zinc-400">{path.description}</p>
                <div className="mt-6 flex items-center gap-5 text-sm text-zinc-500">
                  <span className="inline-flex items-center gap-1.5">
                    <BookOpen className="h-4 w-4" />
                    {path.modules.length} modules
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    {path.duration}
                  </span>
                </div>
                {/* Module preview ticks */}
                <div className="mt-5 flex gap-1.5">
                  {path.modules.map((m, idx) => (
                    <div
                      key={m.id}
                      className={`h-1.5 flex-1 rounded-full bg-gradient-to-r ${path.accent} transition-opacity duration-300`}
                      style={{ opacity: 0.25 + idx * 0.02 }}
                    />
                  ))}
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
