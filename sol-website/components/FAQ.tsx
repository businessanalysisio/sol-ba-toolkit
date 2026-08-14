"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { fadeUp, staggerContainer, viewportOnce, EASE } from "@/lib/animations";
import { faqs } from "@/lib/data";
import { cn } from "@/lib/utils";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="section-pad">
      <div className="mx-auto max-w-3xl">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mx-auto max-w-2xl text-center"
        >
          <motion.span variants={fadeUp} className="eyebrow">
            FAQ
          </motion.span>
          <motion.h2
            variants={fadeUp}
            className="text-balance text-3xl font-bold tracking-tight text-white sm:text-5xl"
          >
            Questions, <span className="text-gradient">answered</span>
          </motion.h2>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mt-14 space-y-3"
        >
          {faqs.map((faq, i) => {
            const open = openIndex === i;
            return (
              <motion.div
                key={faq.q}
                variants={fadeUp}
                custom={i}
                className={cn(
                  "glass overflow-hidden rounded-2xl transition-colors duration-300",
                  open && "border-sol-400/25 bg-white/[0.06]"
                )}
              >
                <button
                  onClick={() => setOpenIndex(open ? null : i)}
                  aria-expanded={open}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="font-medium text-white">{faq.q}</span>
                  <motion.span
                    animate={{ rotate: open ? 45 : 0 }}
                    transition={{ duration: 0.3, ease: EASE }}
                    className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-colors",
                      open
                        ? "border-sol-400/40 bg-sol-400/15 text-sol-300"
                        : "border-white/15 text-zinc-400"
                    )}
                  >
                    <Plus className="h-4 w-4" />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: EASE }}
                    >
                      <p className="px-6 pb-6 leading-relaxed text-zinc-400">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
