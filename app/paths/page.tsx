import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { LearningPaths } from "@/components/sol/LearningPaths"
import { getLearningPaths } from "@/lib/supabase"

export default async function PathsPage() {
  const paths = await getLearningPaths()

  return (
    <main className="min-h-screen bg-sol-night text-white">
      <div className="mx-auto max-w-6xl px-4 pt-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-sol-muted transition hover:text-white">
          <ArrowLeft className="size-4" />
          Back to Sol
        </Link>
        <div className="mt-12 max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-sol-gold">Skill tracks</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-6xl">Choose the BA path that matches your operating role.</h1>
          <p className="mt-5 leading-7 text-sol-muted">
            Each path turns business analysis theory into reusable artifacts, decisions, and working habits.
          </p>
        </div>
      </div>
      <LearningPaths paths={paths} />
    </main>
  )
}
