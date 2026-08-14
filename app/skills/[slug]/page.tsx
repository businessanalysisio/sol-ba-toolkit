import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, BookOpen, Clock, Hash, Link2 } from "lucide-react";
import { Navbar } from "@/components/sol/Navbar";
import { Footer } from "@/components/sol/Footer";
import {
  getAdjacentSkills,
  getAllSkills,
  getSkill,
  renderSkillHtml,
} from "@/lib/skills";

export function generateStaticParams() {
  return getAllSkills().map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const skill = getSkill(slug);
  if (!skill) return { title: "Skill not found" };
  return {
    title: `${skill.title} | Sol Skills Library`,
    description: skill.summary,
  };
}

export default async function SkillPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const skill = getSkill(slug);
  if (!skill) notFound();

  const html = renderSkillHtml(skill);
  const { prev, next } = getAdjacentSkills(skill.slug);
  const related = skill.related
    .map((s) => getSkill(s))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  return (
    <>
      <Navbar />
      <main className="section-pad min-h-screen bg-sol-night pt-36">
        <article className="mx-auto max-w-3xl">
          <Link
            href="/skills"
            className="inline-flex items-center gap-1.5 text-sm text-sol-muted transition-colors hover:text-sol-gold"
          >
            <ArrowLeft className="h-4 w-4" /> All skills
          </Link>

          <div className="mt-8 flex flex-wrap items-center gap-2 text-xs">
            <span className="rounded-full border border-sol-gold/25 bg-sol-gold/10 px-3 py-1 font-medium text-sol-gold">
              {skill.category}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-sol-muted">
              <BookOpen className="h-3.5 w-3.5" /> {skill.source}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-sol-muted">
              <Hash className="h-3.5 w-3.5" />
              {skill.number}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-sol-muted">
              <Clock className="h-3.5 w-3.5" /> {skill.minutes} min read
            </span>
          </div>

          <h1 className="mt-5 text-balance text-3xl font-semibold tracking-tight text-white sm:text-5xl">
            {skill.title}
          </h1>

          <div
            className="skill-prose mt-8"
            dangerouslySetInnerHTML={{ __html: html }}
          />

          {related.length > 0 && (
            <section className="mt-12 rounded-lg border border-sol-gold/15 bg-sol-gold/[0.06] p-6 sm:p-8">
              <h2 className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-sol-gold">
                <Link2 className="h-4 w-4" /> Related skills
              </h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/skills/${r.slug}`}
                    className="rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-sm text-zinc-300 transition-colors hover:border-sol-mint/40 hover:text-sol-mint"
                  >
                    {r.title}
                  </Link>
                ))}
              </div>
            </section>
          )}

          <nav
            className="mt-12 grid gap-3 border-t border-white/10 pt-8 sm:grid-cols-2"
            aria-label="Adjacent skills"
          >
            {prev ? (
              <Link
                href={`/skills/${prev.slug}`}
                className="glass glass-hover group rounded-lg p-5"
              >
                <span className="inline-flex items-center gap-1.5 text-xs text-sol-muted">
                  <ArrowLeft className="h-3.5 w-3.5" /> Previous
                </span>
                <span className="mt-1.5 block font-medium text-zinc-200 group-hover:text-sol-gold">
                  {prev.title}
                </span>
              </Link>
            ) : (
              <span />
            )}
            {next && (
              <Link
                href={`/skills/${next.slug}`}
                className="glass glass-hover group rounded-lg p-5 text-right"
              >
                <span className="inline-flex items-center gap-1.5 text-xs text-sol-muted">
                  Next <ArrowRight className="h-3.5 w-3.5" />
                </span>
                <span className="mt-1.5 block font-medium text-zinc-200 group-hover:text-sol-gold">
                  {next.title}
                </span>
              </Link>
            )}
          </nav>
        </article>
      </main>
      <Footer />
    </>
  );
}
