"use client"

import { Check, Sparkles } from "lucide-react"
import { ScrollReveal } from "./ScrollReveal"

const tiers = [
  {
    name: "Free",
    price: "$0",
    description: "For exploring second-brain workflows and core BA frameworks.",
    features: ["20 saved notes", "8 framework templates", "Starter learning path", "Local progress snapshot"],
  },
  {
    name: "Pro",
    price: "$18",
    description: "For professionals turning research, meetings, and decisions into reusable knowledge.",
    features: ["Unlimited knowledge capture", "Full framework library", "AI insight synthesis", "Supabase sync and dashboard", "Progress analytics"],
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal>
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-sol-gold">Pricing</p>
          <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-5xl">
            Start free. Upgrade when Sol becomes your operating memory.
          </h2>
        </ScrollReveal>
        <div className="mt-12 grid gap-4 lg:grid-cols-2">
          {tiers.map((tier) => (
            <div key={tier.name} className="rounded-lg border border-white/10 bg-sol-panel p-7">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-2xl font-semibold text-white">{tier.name}</h3>
                {tier.name === "Pro" ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-sol-gold/10 px-3 py-1 text-xs text-sol-gold">
                    <Sparkles className="size-3" />
                    Most useful
                  </span>
                ) : null}
              </div>
              <p className="mt-5 text-5xl font-semibold tracking-tight text-white">
                {tier.price}
                <span className="text-base font-normal text-sol-muted"> / month</span>
              </p>
              <p className="mt-4 leading-7 text-sol-muted">{tier.description}</p>
              <ul className="mt-8 space-y-3">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm text-sol-muted">
                    <Check className="size-4 text-sol-mint" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
