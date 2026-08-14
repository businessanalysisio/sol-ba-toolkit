"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, BrainCircuit, GitBranch, Lightbulb, PlayCircle, Target } from "lucide-react";
import { EASE } from "@/lib/animations";
import { stats } from "@/lib/data";

const rotatingWords = ["insights", "decisions", "strategy", "clarity"];

const orbitNodes = [
  { icon: Target, label: "SWOT", ring: 0, angle: 0 },
  { icon: Lightbulb, label: "JTBD", ring: 0, angle: 180 },
  { icon: GitBranch, label: "Five Forces", ring: 1, angle: 90 },
  { icon: BrainCircuit, label: "AI Insights", ring: 1, angle: 270 },
];

export default function Hero() {
  const [wordIndex, setWordIndex] = useState(0);
  const { scrollY } = useScroll();
  const orbY = useTransform(scrollY, [0, 600], [0, 120]);
  const fade = useTransform(scrollY, [0, 500], [1, 0.15]);

  useEffect(() => {
    const id = setInterval(
      () => setWordIndex((i) => (i + 1) % rotatingWords.length),
      2600
    );
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-5 pb-16 pt-32 sm:px-8">
      {/* Backdrop */}
      <div className="bg-grid mask-fade-y absolute inset-0" aria-hidden />
      <motion.div
        style={{ y: orbY, opacity: fade }}
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[720px] w-[720px] -translate-x-1/2 -translate-y-1/2"
      >
        <div className="absolute inset-0 animate-pulse-glow rounded-full bg-[radial-gradient(circle,rgba(251,191,36,0.16)_0%,rgba(251,113,133,0.07)_38%,transparent_68%)]" />
      </motion.div>

      <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-14 lg:grid-cols-[1.15fr_1fr]">
        {/* Copy */}
        <div className="text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <span className="eyebrow">
              <span className="h-1.5 w-1.5 rounded-full bg-sol-400" />
              The second brain for business analysis
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
            className="text-balance text-4xl font-bold leading-[1.06] tracking-tight text-white sm:text-6xl lg:text-7xl"
          >
            Turn scattered knowledge into{" "}
            <span className="relative inline-block h-[1.15em] overflow-hidden align-bottom">
              <AnimatePresence mode="wait">
                <motion.span
                  key={rotatingWords[wordIndex]}
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: "-100%", opacity: 0 }}
                  transition={{ duration: 0.45, ease: EASE }}
                  className="text-gradient inline-block"
                >
                  {rotatingWords[wordIndex]}
                </motion.span>
              </AnimatePresence>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.22, ease: EASE }}
            className="mx-auto mt-6 max-w-xl text-pretty text-base leading-relaxed text-zinc-400 sm:text-lg lg:mx-0"
          >
            Sol helps founders, product managers, and analysts master business
            analysis through structured learning paths, an interactive framework
            library, and AI that organizes what you learn — so every decision
            gets sharper.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.34, ease: EASE }}
            className="mt-9 flex flex-col items-center gap-3 sm:flex-row lg:justify-start sm:justify-center"
          >
            <Link href="/login?mode=signup" className="btn-primary w-full sm:w-auto">
              Start building your second brain
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/#frameworks" className="btn-ghost w-full sm:w-auto">
              <PlayCircle className="h-4 w-4" />
              Explore frameworks
            </Link>
          </motion.div>

          <motion.dl
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-14 grid grid-cols-2 gap-6 border-t border-white/10 pt-8 sm:grid-cols-4 lg:max-w-xl"
          >
            {stats.map((s) => (
              <div key={s.label} className="text-center lg:text-left">
                <dt className="sr-only">{s.label}</dt>
                <dd className="text-2xl font-bold text-white">{s.value}</dd>
                <dd className="mt-1 text-xs leading-snug text-zinc-500">{s.label}</dd>
              </div>
            ))}
          </motion.dl>
        </div>

        {/* Animated orbit illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: EASE }}
          className="relative mx-auto hidden aspect-square w-full max-w-[420px] sm:block"
          aria-hidden
        >
          {/* Core sun */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="animate-float">
              <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-sol-200 via-sol-400 to-orange-600 shadow-[0_0_80px_-8px_rgba(251,191,36,0.75)]">
                <BrainCircuit className="h-12 w-12 text-night-950" strokeWidth={1.6} />
                <div className="absolute inset-0 rounded-full ring-1 ring-white/40" />
              </div>
            </div>
          </div>

          {/* Orbit rings */}
          <div className="absolute inset-[10%] animate-spin-slow rounded-full border border-dashed border-white/12">
            {orbitNodes
              .filter((n) => n.ring === 1)
              .map((n) => (
                <OrbitNode key={n.label} {...n} counter="animate-spin-slow-rev" />
              ))}
          </div>
          <div className="absolute inset-[26%] animate-spin-slower rounded-full border border-dashed border-white/15">
            {orbitNodes
              .filter((n) => n.ring === 0)
              .map((n) => (
                <OrbitNode key={n.label} {...n} counter="animate-spin-slower-rev" />
              ))}
          </div>
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 md:block"
        aria-hidden
      >
        <div className="flex h-9 w-5 items-start justify-center rounded-full border border-white/20 p-1.5">
          <motion.div
            animate={{ y: [0, 10, 0], opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="h-1.5 w-1.5 rounded-full bg-sol-400"
          />
        </div>
      </motion.div>
    </section>
  );
}

function OrbitNode({
  icon: Icon,
  label,
  angle,
  counter,
}: {
  icon: typeof Target;
  label: string;
  angle: number;
  counter: string;
}) {
  const rad = (angle * Math.PI) / 180;
  const x = 50 + 50 * Math.cos(rad);
  const y = 50 + 50 * Math.sin(rad);
  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      <div className={counter}>
        <div className="glass flex items-center gap-2 rounded-full py-1.5 pl-1.5 pr-3.5 shadow-lg shadow-black/40">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-sol-400/15">
            <Icon className="h-3.5 w-3.5 text-sol-300" />
          </span>
          <span className="whitespace-nowrap text-xs font-medium text-zinc-200">
            {label}
          </span>
        </div>
      </div>
    </div>
  );
}
