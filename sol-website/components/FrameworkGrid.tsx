"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, ListChecks, Target, X } from "lucide-react";
import { fadeUp, staggerContainer, viewportOnce, EASE } from "@/lib/animations";
import type { Framework } from "@/lib/types";
import { cn } from "@/lib/utils";

const categories = ["All", "Strategy", "Requirements", "Customer", "Process"] as const;

const categoryColors: Record<string, string> = {
  Strategy: "text-sol-300 border-sol-400/25 bg-sol-400/10",
  Requirements: "text-sky-300 border-sky-400/25 bg-sky-400/10",
  Customer: "text-rose-300 border-rose-400/25 bg-rose-400/10",
  Process: "text-emerald-300 border-emerald-400/25 bg-emerald-400/10",
};

export default function FrameworkGrid({ frameworks }: { frameworks: Framework[] }) {
  const [filter, setFilter] = useState<(typeof categories)[number]>("All");
  const [selected, setSelected] = useState<Framework | null>(null);

  const visible =
    filter === "All" ? frameworks : frameworks.filter((f) => f.category === filter);

  // Close on Escape, lock scroll while modal open
  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSelected(null);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [selected]);

  return (
    <section id="frameworks" className="section-pad relative">
      <div className="mx-auto max-w-6xl">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mx-auto max-w-2xl text-center"
        >
          <motion.span variants={fadeUp} className="eyebrow">
            Framework library
          </motion.span>
          <motion.h2
            variants={fadeUp}
            className="text-balance text-3xl font-bold tracking-tight text-white sm:text-5xl"
          >
            The right tool for <span className="text-gradient">every decision</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-5 text-zinc-400 sm:text-lg">
            Tap any framework to see how it works, when to reach for it, and the
            steps to run it well.
          </motion.p>
        </motion.div>

        {/* Category filter */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mt-10 flex flex-wrap justify-center gap-2"
        >
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300",
                filter === c
                  ? "border-sol-400/50 bg-sol-400/15 text-sol-200"
                  : "border-white/10 bg-white/[0.03] text-zinc-400 hover:border-white/25 hover:text-zinc-200"
              )}
            >
              {c}
            </button>
          ))}
        </motion.div>

        {/* Grid */}
        <motion.div layout className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visible.map((f) => (
              <motion.button
                layout
                key={f.id}
                layoutId={`card-${f.id}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, ease: EASE }}
                onClick={() => setSelected(f)}
                className="glass glass-hover group rounded-2xl p-6 text-left"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-base font-semibold text-white transition-colors group-hover:text-sol-200">
                    {f.name}
                  </h3>
                  <span
                    className={cn(
                      "shrink-0 rounded-full border px-2.5 py-0.5 text-[11px] font-medium",
                      categoryColors[f.category]
                    )}
                  >
                    {f.category}
                  </span>
                </div>
                <p className="mt-2.5 line-clamp-2 text-sm leading-relaxed text-zinc-400">
                  {f.description}
                </p>
                <span className="mt-4 inline-block text-xs font-medium text-sol-300/0 transition-colors duration-300 group-hover:text-sol-300">
                  Explore framework →
                </span>
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Expanded detail modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            className="fixed inset-0 z-[60] flex items-end justify-center bg-night-950/80 p-0 backdrop-blur-sm sm:items-center sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-label={`${selected.name} details`}
          >
            <motion.div
              layoutId={`card-${selected.id}`}
              onClick={(e) => e.stopPropagation()}
              transition={{ duration: 0.4, ease: EASE }}
              className="glass max-h-[86vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-night-900/95 p-7 shadow-2xl shadow-black/60 sm:rounded-3xl sm:p-10"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span
                    className={cn(
                      "mb-3 inline-block rounded-full border px-3 py-1 text-xs font-medium",
                      categoryColors[selected.category]
                    )}
                  >
                    {selected.category}
                  </span>
                  <h3 className="text-2xl font-bold text-white sm:text-3xl">
                    {selected.name}
                  </h3>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="rounded-full border border-white/10 bg-white/5 p-2 text-zinc-400 transition-colors hover:border-white/25 hover:text-white"
                  aria-label="Close details"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <p className="mt-4 leading-relaxed text-zinc-300">{selected.description}</p>

              <div className="mt-7 rounded-2xl border border-sol-400/20 bg-sol-400/[0.06] p-5">
                <div className="flex items-center gap-2 text-sm font-semibold text-sol-300">
                  <Target className="h-4 w-4" />
                  Best for
                </div>
                <p className="mt-2 text-sm text-zinc-300">{selected.best_for}</p>
              </div>

              <div className="mt-7 grid gap-7 sm:grid-cols-2">
                <div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-white">
                    <CheckCircle2 className="h-4 w-4 text-sol-300" />
                    Use cases
                  </div>
                  <ul className="mt-3 space-y-2.5">
                    {selected.use_cases.map((u) => (
                      <li key={u} className="flex gap-2.5 text-sm text-zinc-400">
                        <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-sol-400" />
                        {u}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-white">
                    <ListChecks className="h-4 w-4 text-sol-300" />
                    How to run it
                  </div>
                  <ol className="mt-3 space-y-2.5">
                    {selected.steps.map((s, i) => (
                      <li key={s} className="flex gap-3 text-sm text-zinc-400">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-sol-400/30 bg-sol-400/10 text-[11px] font-semibold text-sol-300">
                          {i + 1}
                        </span>
                        {s}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
