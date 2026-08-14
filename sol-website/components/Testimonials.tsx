"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/animations";
import type { Testimonial } from "@/lib/types";

export default function Testimonials({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  // Duplicate the list so the marquee loops seamlessly
  const track = [...testimonials, ...testimonials];

  return (
    <section id="testimonials" className="section-pad relative overflow-hidden">
      <div className="mx-auto max-w-6xl">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mx-auto max-w-2xl text-center"
        >
          <motion.span variants={fadeUp} className="eyebrow">
            Loved by analysts & founders
          </motion.span>
          <motion.h2
            variants={fadeUp}
            className="text-balance text-3xl font-bold tracking-tight text-white sm:text-5xl"
          >
            Better decisions, <span className="text-gradient">on the record</span>
          </motion.h2>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={viewportOnce}
        transition={{ duration: 1 }}
        className="mask-fade-x mt-16"
      >
        <div className="flex w-max animate-marquee gap-5 hover:[animation-play-state:paused]">
          {track.map((t, i) => (
            <figure
              key={`${t.id}-${i}`}
              className="glass w-[320px] shrink-0 rounded-3xl p-7 sm:w-[380px]"
            >
              <Quote className="h-6 w-6 text-sol-400/60" aria-hidden />
              <blockquote className="mt-4 text-[15px] leading-relaxed text-zinc-300">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-sol-400/30 to-ember/30 text-sm font-bold text-sol-200">
                  {t.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
                <div>
                  <div className="text-sm font-semibold text-white">{t.name}</div>
                  <div className="text-xs text-zinc-500">
                    {t.role} · {t.company}
                  </div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
