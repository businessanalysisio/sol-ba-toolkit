"use client"

import { FormEvent, useState } from "react"
import Link from "next/link"
import { ArrowRight, BrainCircuit, Loader2 } from "lucide-react"

export function Footer() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus("loading")
    const response = await fetch("/api/email-capture", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, source: "footer-newsletter" }),
    })
    setStatus(response.ok ? "success" : "error")
    if (response.ok) setEmail("")
  }

  return (
    <footer className="px-4 pb-8 pt-24">
      <div className="mx-auto max-w-6xl rounded-lg border border-white/10 bg-white/[0.045] p-6 backdrop-blur md:p-10">
        <div className="grid gap-10 lg:grid-cols-[1fr_420px] lg:items-end">
          <div>
            <div className="flex items-center gap-2 font-semibold text-white">
              <span className="grid size-9 place-items-center rounded-full border border-sol-gold/30 bg-sol-gold/10">
                <BrainCircuit className="size-4 text-sol-gold" />
              </span>
              Sol
            </div>
            <h2 className="mt-8 max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-5xl">
              Get one BA framework and one applied insight every week.
            </h2>
            <p className="mt-4 max-w-xl leading-7 text-sol-muted">
              Practical notes for founders, product managers, analysts, and operators building sharper decision systems.
            </p>
          </div>
          <form onSubmit={onSubmit} className="space-y-3">
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                required
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@company.com"
                className="min-h-12 flex-1 rounded-full border border-white/10 bg-sol-night px-5 text-white outline-none transition placeholder:text-sol-muted focus:border-sol-gold"
              />
              <button className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-sol-gold px-6 font-medium text-sol-night transition hover:bg-white" disabled={status === "loading"}>
                {status === "loading" ? <Loader2 className="size-4 animate-spin" /> : <ArrowRight className="size-4" />}
                Join
              </button>
            </div>
            <p className="min-h-6 text-sm text-sol-muted">
              {status === "success" ? "You are on the list." : status === "error" ? "Signup failed. Try again in a moment." : "No spam. Just useful BA systems."}
            </p>
          </form>
        </div>
        <div className="mt-12 flex flex-col justify-between gap-4 border-t border-white/10 pt-6 text-sm text-sol-muted md:flex-row">
          <p>© 2026 Sol. Built for structured business thinking.</p>
          <div className="flex gap-5">
            <Link href="/paths" className="hover:text-white">Paths</Link>
            <Link href="/frameworks" className="hover:text-white">Frameworks</Link>
            <Link href="/dashboard" className="hover:text-white">Dashboard</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
