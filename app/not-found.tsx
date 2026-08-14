import Link from "next/link"
import { ArrowLeft, Compass } from "lucide-react"

const suggestions = [
  { href: "/paths", label: "Learning paths", hint: "Role-based tracks from founder to consulting BA" },
  { href: "/frameworks", label: "Framework library", hint: "SWOT, JTBD, MoSCoW, and more — with when to use each" },
  { href: "/brief-builder", label: "Decision Brief Builder", hint: "Turn a messy problem into a one-page brief" },
  { href: "/skills", label: "Skill library", hint: "Distilled lessons from nine business analysis books" },
]

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-sol-night px-5 py-16 text-zinc-200">
      <div className="w-full max-w-2xl">
        <p className="font-mono text-sm uppercase tracking-[0.24em] text-sol-gold">404</p>
        <h1 className="mt-5 text-balance text-4xl font-bold tracking-tight text-white sm:text-5xl">
          That page isn&apos;t here.
        </h1>
        <p className="mt-5 max-w-lg leading-8 text-sol-muted">
          The link may be out of date, or the item you were looking for may have been removed. Nothing
          you had open was lost.
        </p>

        <div className="mt-10 grid gap-3 sm:grid-cols-2">
          {suggestions.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group rounded-lg border border-sol-line bg-sol-panel p-4 transition hover:border-sol-gold/40"
            >
              <span className="flex items-center gap-2 font-medium text-white">
                <Compass className="size-4 text-sol-gold" />
                {item.label}
              </span>
              <span className="mt-1.5 block text-sm leading-6 text-sol-muted">{item.hint}</span>
            </Link>
          ))}
        </div>

        <Link
          href="/"
          className="mt-10 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm text-zinc-300 transition hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft className="size-4" />
          Back to Sol
        </Link>
      </div>
    </main>
  )
}
