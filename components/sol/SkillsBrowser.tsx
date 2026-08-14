"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, Clock, Loader2, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface IndexEntry {
  slug: string;
  number: number;
  title: string;
  source: string;
  category: string;
  tags: string[];
  summary: string;
  minutes: number;
}

const PAGE = 48;

export default function SkillsBrowser() {
  const [skills, setSkills] = useState<IndexEntry[] | null>(null);
  const [error, setError] = useState(false);
  const [query, setQuery] = useState("");
  const [source, setSource] = useState<string>("All");
  const [category, setCategory] = useState<string>("All");
  const [limit, setLimit] = useState(PAGE);

  useEffect(() => {
    fetch("/skills-index.json")
      .then((r) => r.json())
      .then(setSkills)
      .catch(() => setError(true));
  }, []);

  const sources = useMemo(
    () =>
      skills
        ? ["All", ...Array.from(new Set(skills.map((s) => s.source)))]
        : ["All"],
    [skills]
  );
  const categories = useMemo(() => {
    if (!skills) return ["All"];
    const pool = source === "All" ? skills : skills.filter((s) => s.source === source);
    return ["All", ...Array.from(new Set(pool.map((s) => s.category)))];
  }, [skills, source]);

  const filtered = useMemo(() => {
    if (!skills) return [];
    const q = query.trim().toLowerCase();
    return skills.filter((s) => {
      if (source !== "All" && s.source !== source) return false;
      if (category !== "All" && s.category !== category) return false;
      if (!q) return true;
      return (
        s.title.toLowerCase().includes(q) ||
        s.summary.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.tags.some((t) => t.includes(q))
      );
    });
  }, [skills, query, source, category]);

  const shown = filtered.slice(0, limit);

  if (error) {
    return (
      <p className="mt-16 text-center text-zinc-400">
        Could not load the skills index. Try refreshing the page.
      </p>
    );
  }

  if (!skills) {
    return (
      <div className="mt-24 flex justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-sol-400" />
      </div>
    );
  }

  return (
    <div className="mt-10">
      {/* Search + filters */}
      <div className="glass sticky top-20 z-40 rounded-2xl p-4 shadow-xl shadow-black/30 sm:p-5">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setLimit(PAGE);
            }}
            placeholder={`Search ${skills.length} skills — try "elicitation", "pricing", "stakeholder"…`}
            className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-3 pl-11 pr-10 text-sm text-white placeholder:text-zinc-600 focus:border-sol-400/50 focus:outline-none focus:ring-2 focus:ring-sol-400/20"
            aria-label="Search skills"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-zinc-500 hover:text-white"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {sources.map((s) => (
            <button
              key={s}
              onClick={() => {
                setSource(s);
                setCategory("All");
                setLimit(PAGE);
              }}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition-all",
                source === s
                  ? "border-sol-400/50 bg-sol-400/15 text-sol-200"
                  : "border-white/10 bg-white/[0.03] text-zinc-400 hover:border-white/25 hover:text-zinc-200"
              )}
            >
              {s === "All" ? `All sources` : s}
            </button>
          ))}
        </div>

        {categories.length > 2 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => {
                  setCategory(c);
                  setLimit(PAGE);
                }}
                className={cn(
                  "rounded-full border px-3 py-1 text-[11px] transition-all",
                  category === c
                    ? "border-ember/50 bg-ember/15 text-rose-200"
                    : "border-white/5 bg-transparent text-zinc-500 hover:border-white/20 hover:text-zinc-300"
                )}
              >
                {c === "All" ? "All categories" : c}
              </button>
            ))}
          </div>
        )}
      </div>

      <p className="mt-6 text-sm text-zinc-500" aria-live="polite">
        {filtered.length} skill{filtered.length === 1 ? "" : "s"}
        {query && <> matching &ldquo;{query}&rdquo;</>}
      </p>

      {/* Results */}
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((s, i) => (
          <motion.div
            key={s.slug}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: Math.min(i % PAGE, 12) * 0.02 }}
          >
            <Link
              href={`/skills/${s.slug}`}
              className="glass glass-hover group flex h-full flex-col rounded-2xl p-5"
            >
              <div className="flex items-center justify-between gap-2 text-[11px] text-zinc-500">
                <span className="truncate rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-0.5">
                  {s.category}
                </span>
                <span className="shrink-0 tabular-nums">#{s.number}</span>
              </div>
              <h3 className="mt-3 font-semibold leading-snug text-white transition-colors group-hover:text-sol-200">
                {s.title}
              </h3>
              <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-zinc-400">
                {s.summary}
              </p>
              <div className="mt-4 flex items-center justify-between text-xs text-zinc-500">
                <span className="inline-flex items-center gap-1.5 truncate">
                  <BookOpen className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{s.source}</span>
                </span>
                <span className="inline-flex shrink-0 items-center gap-1">
                  <Clock className="h-3.5 w-3.5" /> {s.minutes} min
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {filtered.length > limit && (
        <div className="mt-10 text-center">
          <button onClick={() => setLimit(limit + PAGE)} className="btn-ghost">
            Show {Math.min(PAGE, filtered.length - limit)} more of{" "}
            {filtered.length - limit} remaining
          </button>
        </div>
      )}
    </div>
  );
}
