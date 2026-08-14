"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import gsap from "gsap"
import { ArrowRight, DatabaseZap, Sparkles } from "lucide-react"

const phrases = ["Capture the signal.", "Structure the thinking.", "Ship clearer decisions."]

function KnowledgeGraph() {
  const graphRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!graphRef.current) return
    const ctx = gsap.context(() => {
      gsap.to(".sol-node", {
        y: "random(-18, 18)",
        x: "random(-10, 10)",
        duration: 2.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.12,
      })
      gsap.to(".sol-line", {
        opacity: 0.85,
        duration: 1.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.08,
      })
    }, graphRef)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={graphRef} className="relative mx-auto aspect-square w-full max-w-[520px]">
      <div className="absolute inset-8 rounded-full border border-white/10 bg-[radial-gradient(circle_at_center,rgba(246,199,107,0.12),transparent_58%)]" />
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 500 500" aria-hidden="true">
        {[
          ["250", "100", "112", "238"],
          ["250", "100", "356", "218"],
          ["112", "238", "225", "370"],
          ["356", "218", "225", "370"],
          ["112", "238", "356", "218"],
          ["250", "100", "225", "370"],
        ].map(([x1, y1, x2, y2], index) => (
          <line
            key={`${x1}-${y1}-${index}`}
            className="sol-line"
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="rgba(246,199,107,.34)"
            strokeWidth="1"
          />
        ))}
      </svg>
      {[
        ["left-[45%] top-[14%]", "Briefs"],
        ["left-[14%] top-[45%]", "JTBD"],
        ["right-[14%] top-[41%]", "SWOT"],
        ["left-[38%] bottom-[16%]", "RTM"],
      ].map(([position, label]) => (
        <div
          key={label}
          className={`sol-node absolute ${position} flex size-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/12 bg-white/[0.06] text-sm font-medium text-white shadow-2xl backdrop-blur-md`}
        >
          {label}
        </div>
      ))}
      <div className="absolute left-1/2 top-1/2 grid size-32 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-sol-gold/30 bg-sol-gold/15 text-center text-sm font-semibold text-sol-gold shadow-sol-glow backdrop-blur-xl">
        Sol
      </div>
    </div>
  )
}

export function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden px-4 pt-28">
      <div className="absolute inset-0 sol-grid opacity-50" />
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 py-16 lg:grid-cols-[1.05fr_.95fr]">
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-sol-muted backdrop-blur"
          >
            <Sparkles className="size-4 text-sol-mint" />
            AI-powered second brain for business analysis
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="max-w-4xl text-balance text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl"
          >
            Transform scattered business knowledge into actionable insight.
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16 }}
            className="mt-7 h-8 overflow-hidden text-lg text-sol-muted sm:text-xl"
          >
            <motion.div animate={{ y: ["0%", "-33.33%", "-66.66%", "0%"] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}>
              {phrases.map((phrase) => (
                <p key={phrase} className="h-8">
                  {phrase}
                </p>
              ))}
            </motion.div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24 }}
            className="mt-9 flex flex-col gap-3 sm:flex-row"
          >
            <Link className="inline-flex items-center justify-center gap-2 rounded-full bg-sol-gold px-6 py-3 font-medium text-sol-night transition hover:bg-white" href="/paths">
              Start a learning path
              <ArrowRight className="size-4" />
            </Link>
            <Link className="inline-flex items-center justify-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-6 py-3 font-medium text-white backdrop-blur transition hover:border-sol-mint/50 hover:bg-sol-mint/10" href="/frameworks">
              <DatabaseZap className="size-4" />
              Explore frameworks
            </Link>
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.22, duration: 0.8 }}>
          <KnowledgeGraph />
        </motion.div>
      </div>
    </section>
  )
}
