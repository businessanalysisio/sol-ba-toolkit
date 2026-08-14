import type { Framework, LearningPath, Testimonial } from "@/lib/types"
import { FAQ } from "./FAQ"
import { Features } from "./Features"
import { Footer } from "./Footer"
import { FrameworkGrid } from "./FrameworkGrid"
import { Hero } from "./Hero"
import { LearningPaths } from "./LearningPaths"
import { Navbar } from "./Navbar"
import { Pricing } from "./Pricing"
import { Testimonials } from "./Testimonials"

export function SolLandingPage({
  paths,
  frameworks,
  testimonials,
}: {
  paths: LearningPath[]
  frameworks: Framework[]
  testimonials: Testimonial[]
}) {
  return (
    <main className="min-h-screen bg-sol-night text-white">
      <Navbar />
      <Hero />
      <Features />
      <LearningPaths paths={paths} />
      <FrameworkGrid frameworks={frameworks} />
      <Testimonials testimonials={testimonials} />
      <Pricing />
      <FAQ />
      <Footer />
    </main>
  )
}
