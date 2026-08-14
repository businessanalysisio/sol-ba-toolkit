import { SolLandingPage } from "@/components/sol/SolLandingPage"
import { getFrameworks, getLearningPaths, getTestimonials } from "@/lib/supabase"

export default async function HomePage() {
  const [paths, frameworks, testimonials] = await Promise.all([
    getLearningPaths(),
    getFrameworks(),
    getTestimonials(),
  ])

  return <SolLandingPage paths={paths} frameworks={frameworks} testimonials={testimonials} />
}
