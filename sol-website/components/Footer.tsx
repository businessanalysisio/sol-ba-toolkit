"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Loader2, Sun } from "lucide-react";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/animations";

type SubmitState = "idle" | "loading" | "success" | "error";

const footerLinks = [
  {
    heading: "Product",
    links: [
      { label: "Features", href: "/#features" },
      { label: "Learning Paths", href: "/paths" },
      { label: "Skills Library", href: "/skills" },
      { label: "Framework Library", href: "/frameworks" },
      { label: "Pricing", href: "/#pricing" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "FAQ", href: "/#faq" },
      { label: "Testimonials", href: "/#testimonials" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/#top" },
      { label: "Privacy", href: "/#top" },
      { label: "Terms", href: "/#top" },
    ],
  },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (state === "loading") return;
    setState("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setState("success");
      setMessage(data.message);
      setEmail("");
    } catch (err) {
      setState("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <footer className="relative overflow-hidden border-t border-white/5">
      {/* Final CTA + email capture */}
      <div className="section-pad relative">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[780px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(251,191,36,0.1),transparent)]"
        />
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="relative mx-auto max-w-3xl text-center"
        >
          <motion.h2
            variants={fadeUp}
            className="text-balance text-3xl font-bold tracking-tight text-white sm:text-5xl"
          >
            Your future self is <span className="text-gradient">already grateful</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="mx-auto mt-5 max-w-xl text-zinc-400 sm:text-lg">
            Join the newsletter for one sharp business analysis idea every week —
            frameworks, teardowns, and lessons from the community.
          </motion.p>

          <motion.form
            variants={fadeUp}
            onSubmit={handleSubscribe}
            className="mx-auto mt-9 flex max-w-md flex-col gap-3 sm:flex-row"
          >
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (state !== "idle") setState("idle");
              }}
              placeholder="you@company.com"
              className="glass w-full flex-1 rounded-full px-5 py-3.5 text-sm text-white placeholder:text-zinc-500 focus:border-sol-400/50 focus:outline-none focus:ring-2 focus:ring-sol-400/20"
            />
            <button
              type="submit"
              disabled={state === "loading"}
              className="btn-primary shrink-0 disabled:opacity-70"
            >
              {state === "loading" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Subscribe <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </motion.form>

          <div className="mt-4 h-6" aria-live="polite">
            {state === "success" && (
              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-1.5 text-sm text-emerald-400"
              >
                <CheckCircle2 className="h-4 w-4" /> {message}
              </motion.p>
            )}
            {state === "error" && (
              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-rose-400"
              >
                {message}
              </motion.p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Link columns */}
      <div className="border-t border-white/5 px-5 py-14 sm:px-8">
        <div className="mx-auto grid max-w-6xl gap-10 sm:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <Link href="/#top" className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-sol-300 to-orange-500">
                <Sun className="h-[18px] w-[18px] text-night-950" strokeWidth={2.4} />
              </span>
              <span className="text-lg font-bold text-white">Sol</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-zinc-500">
              The second brain system for mastering business analysis. Capture
              knowledge, practice frameworks, make sharper decisions.
            </p>
          </div>
          {footerLinks.map((col) => (
            <nav key={col.heading} aria-label={col.heading}>
              <h3 className="text-sm font-semibold text-white">{col.heading}</h3>
              <ul className="mt-4 space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-zinc-500 transition-colors hover:text-sol-300"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="mx-auto mt-12 flex max-w-6xl flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 sm:flex-row">
          <p className="text-xs text-zinc-600">
            © {new Date().getFullYear()} Sol. Built for people who think in frameworks.
          </p>
          <p className="text-xs text-zinc-600">Made with Next.js · Tailwind · Framer Motion</p>
        </div>
      </div>
    </footer>
  );
}
