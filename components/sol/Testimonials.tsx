"use client"

import { motion } from "framer-motion"
import type { Testimonial } from "@/lib/types"
import { ScrollReveal } from "./ScrollReveal"

export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <section className="px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal>
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-sol-gold">Social proof</p>
          <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-5xl">
            Built for operators who need clearer thinking under pressure.
          </h2>
        </ScrollReveal>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.figure
              key={testimonial.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="rounded-lg border border-white/10 bg-white/[0.045] p-6"
            >
              <blockquote className="leading-7 text-sol-muted">"{testimonial.quote}"</blockquote>
              <figcaption className="mt-8 border-t border-white/10 pt-5">
                <p className="font-medium text-white">{testimonial.name}</p>
                <p className="mt-1 text-sm text-sol-muted">
                  {testimonial.role}, {testimonial.company}
                </p>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  )
}
