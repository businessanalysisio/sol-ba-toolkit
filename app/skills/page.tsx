import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/sol/Navbar";
import { Footer } from "@/components/sol/Footer";
import SkillsBrowser from "@/components/sol/SkillsBrowser";
import { getAllSkills } from "@/lib/skills";

export const metadata: Metadata = {
  title: "Skills Library | Sol",
  description:
    "651 business analysis skills from 9 foundational books — searchable, categorized, and cross-linked.",
};

export default function SkillsPage() {
  const skills = getAllSkills();
  const sources = new Set(skills.map((s) => s.source)).size;

  return (
    <>
      <Navbar />
      <main className="section-pad min-h-screen bg-sol-night pt-36">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-sol-muted transition-colors hover:text-sol-gold"
          >
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Link>
          <div className="mt-6 max-w-2xl">
            <span className="eyebrow">Skills library</span>
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              {skills.length} skills, <span className="text-gradient">one second brain</span>
            </h1>
            <p className="mt-4 text-sol-muted sm:text-lg">
              The complete Sol knowledge base — distilled from {sources}{" "}
              foundational business analysis books, categorized and cross-linked
              so every skill leads you to the next one.
            </p>
          </div>

          <SkillsBrowser />
        </div>
      </main>
      <Footer />
    </>
  );
}
