"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { ScrollReveal } from "./ScrollReveal"

const faqs = [
  {
    question: "What is a second brain for business analysis?",
    answer: "It is a structured knowledge system that captures business signals, links them to frameworks, and turns them into reusable decisions, artifacts, and learning progress.",
  },
  {
    question: "Is Sol only for certified business analysts?",
    answer: "No. Sol is designed for founders, product managers, analysts, and tech operators who need business analysis thinking without a heavy enterprise toolchain.",
  },
  {
    question: "How does AI fit into the workflow?",
    answer: "AI helps organize notes, suggest frameworks, compare evidence, and draft briefs. The user remains responsible for judgment, validation, and final decisions.",
  },
  {
    question: "Can I use Sol without Supabase?",
    answer: "Yes. The local demo runs on mock data. Supabase enables authentication, synced learning progress, framework content, and production storage.",
  },
]

export function FAQ() {
  const [open, setOpen] = useState(0)

  return (
    <section id="faq" className="px-4 py-24">
      <div className="mx-auto max-w-4xl">
        <ScrollReveal>
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-sol-gold">FAQ</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-5xl">
            Questions before you build your operating memory.
          </h2>
        </ScrollReveal>
        <div className="mt-12 divide-y divide-white/10 rounded-lg border border-white/10 bg-white/[0.035]">
          {faqs.map((faq, index) => (
            <button key={faq.question} onClick={() => setOpen(open === index ? -1 : index)} className="w-full p-6 text-left">
              <div className="flex items-center justify-between gap-4">
                <span className="font-medium text-white">{faq.question}</span>
                <Plus className={`size-5 shrink-0 text-sol-mint transition ${open === index ? "rotate-45" : ""}`} />
              </div>
              {open === index ? <p className="mt-4 max-w-2xl leading-7 text-sol-muted">{faq.answer}</p> : null}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
