"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/animations";
import { cn } from "@/lib/utils";

const tiers = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Everything you need to start building your second brain.",
    cta: "Start free",
    href: "/login?mode=signup",
    highlighted: false,
    features: [
      "1 learning path at a time",
      "Full framework library (read-only)",
      "100 knowledge captures",
      "Basic progress tracking",
      "Markdown export",
    ],
  },
  {
    name: "Pro",
    price: "$12",
    period: "per month, billed yearly",
    description: "For professionals who want their analysis to compound.",
    cta: "Upgrade to Pro",
    href: "/login?mode=signup&plan=pro",
    highlighted: true,
    features: [
      "All learning paths, unlocked",
      "Interactive framework workspaces",
      "Unlimited knowledge captures",
      "AI insights: gaps, conflicts & recommendations",
      "Spaced-repetition reviews & skill scores",
      "Notion, Word & PDF import",
      "Priority support",
    ],
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="section-pad relative">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(251,113,133,0.06),transparent)]"
      />
      <div className="relative mx-auto max-w-5xl">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mx-auto max-w-2xl text-center"
        >
          <motion.span variants={fadeUp} className="eyebrow">
            Pricing
          </motion.span>
          <motion.h2
            variants={fadeUp}
            className="text-balance text-3xl font-bold tracking-tight text-white sm:text-5xl"
          >
            Start free. <span className="text-gradient">Upgrade when it clicks.</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-5 text-zinc-400 sm:text-lg">
            No credit card required. Your knowledge is exportable on every tier.
          </motion.p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mt-16 grid gap-6 md:grid-cols-2"
        >
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              variants={fadeUp}
              custom={i}
              className={cn(
                "relative rounded-3xl p-[1px]",
                tier.highlighted
                  ? "bg-gradient-to-b from-sol-400/70 via-orange-500/40 to-transparent shadow-[0_0_60px_-18px_rgba(251,191,36,0.45)]"
                  : "bg-white/10"
              )}
            >
              {tier.highlighted && (
                <span className="absolute -top-3.5 left-1/2 z-10 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-gradient-to-r from-sol-400 to-orange-500 px-4 py-1.5 text-xs font-bold text-night-950">
                  <Sparkles className="h-3 w-3" />
                  MOST POPULAR
                </span>
              )}
              <div className="flex h-full flex-col rounded-3xl bg-night-900/95 p-8 sm:p-9">
                <h3 className="text-lg font-semibold text-white">{tier.name}</h3>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-5xl font-bold tracking-tight text-white">
                    {tier.price}
                  </span>
                  <span className="text-sm text-zinc-500">{tier.period}</span>
                </div>
                <p className="mt-3 text-sm text-zinc-400">{tier.description}</p>

                <ul className="mt-8 flex-1 space-y-3.5">
                  {tier.features.map((f) => (
                    <li key={f} className="flex gap-3 text-sm text-zinc-300">
                      <Check
                        className={cn(
                          "mt-0.5 h-4 w-4 shrink-0",
                          tier.highlighted ? "text-sol-400" : "text-zinc-500"
                        )}
                      />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href={tier.href}
                  className={cn(
                    "mt-9 w-full text-center",
                    tier.highlighted ? "btn-primary" : "btn-ghost"
                  )}
                >
                  {tier.cta}
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
