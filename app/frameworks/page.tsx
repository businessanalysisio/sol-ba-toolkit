import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { FrameworkGrid } from "@/components/sol/FrameworkGrid"
import { getFrameworks } from "@/lib/supabase"

export default async function FrameworksPage() {
  const frameworks = await getFrameworks()

  return (
    <main className="min-h-screen bg-sol-night text-white">
      <div className="mx-auto max-w-6xl px-4 pt-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-sol-muted transition hover:text-white">
          <ArrowLeft className="size-4" />
          Back to Sol
        </Link>
        <div className="mt-12 max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-sol-gold">Framework index</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-6xl">Reusable analysis tools for sharper decisions.</h1>
          <p className="mt-5 leading-7 text-sol-muted">
            Explore business analysis frameworks by category, use case, and expected artifact.
          </p>
        </div>
      </div>
      <FrameworkGrid frameworks={frameworks} showHeader={false} />
    </main>
  )
}
