"use client";

import { motion } from "framer-motion";
import { BrainCircuit, LineChart, Network, Sparkles } from "lucide-react";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/animations";

const features = [
  {
    icon: Network,
    title: "Knowledge capture",
    description:
      "Clip articles, import documents, and jot workshop notes. Everything is auto-linked to the frameworks and projects it relates to — no manual filing.",
    detail: "Markdown, Notion, Word & PDF import",
  },
  {
    icon: BrainCircuit,
    title: "Analysis frameworks",
    description:
      "40+ battle-tested frameworks modeled as interactive templates — SWOT to Five Forces — with steps, examples, and when-to-use guidance built in.",
    detail: "Interactive, not just documented",
  },
  {
    icon: Sparkles,
    title: "AI insights",
    description:
      "Sol reads across your knowledge base to surface conflicts, gaps, and patterns — then recommends the right framework for the decision in front of you.",
    detail: "Powered by your own notes",
  },
  {
    icon: LineChart,
    title: "Progress tracking",
    description:
      "Structured paths with spaced-repetition reviews and skill scores, so you can see your BA capability compound week over week.",
    detail: "Streaks, scores & skill maps",
  },
];

export default function Features() {
  return (
    <section id="features" className="section-pad relative">
      <div className="mx-auto max-w-6xl">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mx-auto max-w-2xl text-center"
        >
          <motion.span variants={fadeUp} className="eyebrow">
            Capabilities
          </motion.span>
          <motion.h2
            variants={fadeUp}
            className="text-balance text-3xl font-bold tracking-tight text-white sm:text-5xl"
          >
            Everything a sharper analyst needs,{" "}
            <span className="text-gradient">in one system</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-5 text-zinc-400 sm:text-lg">
            Four capabilities that turn reading about business analysis into
            actually practicing it.
          </motion.p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mt-16 grid gap-5 sm:grid-cols-2"
        >
          {features.map((f, i) => (
            <motion.article
              key={f.title}
              variants={fadeUp}
              custom={i}
              className="glass glass-hover group relative overflow-hidden rounded-3xl p-7 sm:p-9"
            >
              {/* Hover glow */}
              <div
                aria-hidden
                className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-sol-400/10 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
              />
              <div className="relative">
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-sol-400/25 bg-sol-400/10 transition-transform duration-300 group-hover:scale-110">
                  <f.icon className="h-5.5 w-5.5 h-[22px] w-[22px] text-sol-300" strokeWidth={1.8} />
                </div>
                <h3 className="text-xl font-semibold text-white">{f.title}</h3>
                <p className="mt-3 leading-relaxed text-zinc-400">{f.description}</p>
                <p className="mt-5 text-xs font-medium uppercase tracking-widest text-sol-300/70">
                  {f.detail}
                </p>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
