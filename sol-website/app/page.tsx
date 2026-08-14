import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import LearningPaths from "@/components/LearningPaths";
import FrameworkGrid from "@/components/FrameworkGrid";
import Testimonials from "@/components/Testimonials";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import {
  fetchFrameworks,
  fetchLearningPaths,
  fetchTestimonials,
} from "@/lib/supabase";

export default async function HomePage() {
  const [paths, frameworks, testimonials] = await Promise.all([
    fetchLearningPaths(),
    fetchFrameworks(),
    fetchTestimonials(),
  ]);

  return (
    <>
      <Navbar />
      <main id="top">
        <Hero />
        <Features />
        <LearningPaths paths={paths} />
        <FrameworkGrid frameworks={frameworks} />
        <Testimonials testimonials={testimonials} />
        <Pricing />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
