"use client"

import { motion } from "framer-motion"
import { Brain, ChartNoAxesCombined, Library, Trophy } from "lucide-react"
import { features } from "@/lib/mock-data"
import { ScrollReveal } from "./ScrollReveal"

const icons = [Library, ChartNoAxesCombined, Brain, Trophy]

export function Features() {
  return (
    <section id="features" className="px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal>
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-sol-gold">Capabilities</p>
          <h2 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-5xl">
            A learning system for people who turn ambiguity into decisions.
          </h2>
        </ScrollReveal>
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = icons[index]
            return (
              <motion.article
                key={feature.title}
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06 }}
                whileHover={{ y: -6 }}
                className="rounded-lg border border-white/10 bg-white/[0.045] p-6 backdrop-blur-md"
              >
                <Icon className="size-6 text-sol-mint" />
                <h3 className="mt-8 text-xl font-semibold text-white">{feature.title}</h3>
                <p className="mt-3 text-sm leading-6 text-sol-muted">{feature.description}</p>
                <p className="mt-8 text-sm font-medium text-sol-gold">{feature.metric}</p>
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
