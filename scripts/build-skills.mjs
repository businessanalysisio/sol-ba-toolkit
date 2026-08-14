/**
 * Improves the cloned skills library (content/skills/) and generates the
 * website's skill database.
 *
 * Improvements applied to every skill file (clone only — originals untouched):
 *  - fills empty categories using per-source / title rules
 *  - adds a URL slug, reading time, and summary to the frontmatter
 *  - resolves "Related Techniques / Tools" names into real skill cross-links
 *
 * Outputs:
 *  - rewritten frontmatter in each content/skills/**\/*.md
 *  - public/skills-index.json   (compact index for the client-side browser)
 *  - lib/generated/skills-db.json (full metadata + file paths for detail pages)
 *  - content/skills/catalog.json  (regenerated, enriched catalog)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CONTENT = path.join(ROOT, "content", "skills");

const CATEGORY_RULES = [
  { test: (s) => /^Elicitation technique/i.test(s.title), category: "Elicitation Techniques" },
];
const SOURCE_DEFAULT_CATEGORY = {
  "Seven Steps to Mastering Business Analysis": "Core BA Practice",
  "How to Start Your Own Business": "Entrepreneurship",
  "Introduction to Business Data Analytics": "Data Analytics",
  "Guide to Product Ownership Analysis": "Product Ownership",
};

function kebab(str) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function parseFrontmatter(raw) {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!m) return null;
  const fm = {};
  for (const line of m[1].split("\n")) {
    const kv = line.match(/^(\w[\w_]*):\s*(.*)$/);
    if (!kv) continue;
    let [, key, value] = kv;
    value = value.trim();
    if (value.startsWith("[")) {
      try { value = JSON.parse(value.replace(/'/g, '"')); } catch { value = []; }
    } else {
      value = value.replace(/^"(.*)"$/, "$1");
      if (/^\d+$/.test(value)) value = Number(value);
    }
    fm[key] = value;
  }
  return { fm, body: raw.slice(m[0].length) };
}

function firstParagraph(body, heading) {
  const re = new RegExp(`^## ${heading}\\s*\\n+([\\s\\S]*?)(?=\\n## |$)`, "m");
  const m = body.match(re);
  if (!m) return "";
  const para = m[1].trim().split(/\n\s*\n/)[0] || "";
  return para.replace(/\s+/g, " ").trim();
}

function extractRelatedNames(body) {
  const m = body.match(/^## Related Techniques \/ Tools\s*\n+([\s\S]*?)(?=\n## |$)/m);
  if (!m) return [];
  const names = [];
  for (const line of m[1].split("\n")) {
    const bullet = line.replace(/^\s*[*-]\s*/, "").trim();
    if (!bullet) continue;
    // Split on commas that are not inside parentheses
    for (const part of bullet.split(/,(?![^(]*\))/)) {
      const item = part.trim();
      if (!item) continue;
      const numMatch = item.match(/^(.*?)\s*\((\d+)\)$/);
      if (numMatch) names.push({ name: numMatch[1].trim(), number: Number(numMatch[2]) });
      else names.push({ name: item, number: null });
    }
  }
  return names;
}

// ---- Load all skill files ----------------------------------------------
const files = [];
for (const dir of fs.readdirSync(CONTENT, { withFileTypes: true })) {
  if (!dir.isDirectory()) continue;
  for (const f of fs.readdirSync(path.join(CONTENT, dir.name))) {
    if (/^\d+_.*\.md$/.test(f)) files.push(path.join(dir.name, f));
  }
}
files.sort();

const skills = [];
for (const rel of files) {
  const raw = fs.readFileSync(path.join(CONTENT, rel), "utf8");
  const parsed = parseFrontmatter(raw);
  if (!parsed || !parsed.fm.id) {
    console.warn(`skip (no frontmatter): ${rel}`);
    continue;
  }
  skills.push({ rel, ...parsed.fm, body: parsed.body });
}

// ---- Improve each skill --------------------------------------------------
const byNumber = new Map(skills.map((s) => [Number(s.number), s]));
const byTitle = new Map(skills.map((s) => [String(s.title).toLowerCase(), s]));
// Elicitation techniques are often referenced by their bare name
for (const s of skills) {
  const bare = String(s.title).replace(/^Elicitation technique:\s*/i, "").toLowerCase();
  if (!byTitle.has(bare)) byTitle.set(bare, s);
}

let categoriesFilled = 0;
let linksResolved = 0;

for (const s of skills) {
  // 1. Fill empty categories
  if (!s.category) {
    const rule = CATEGORY_RULES.find((r) => r.test(s));
    s.category = rule?.category || SOURCE_DEFAULT_CATEGORY[s.source] || "General";
    categoriesFilled++;
  }

  // 2. Slug, summary, reading time
  s.slug = `${s.number}-${kebab(String(s.title))}`;
  s.summary = firstParagraph(s.body, "Overview").slice(0, 300);
  const words = s.body.split(/\s+/).length;
  s.minutes = Math.max(1, Math.round(words / 200));

  // 3. Resolve related skills to real cross-links
  s.related = [];
  for (const ref of extractRelatedNames(s.body)) {
    const target =
      (ref.number != null && byNumber.get(ref.number)) ||
      byTitle.get(ref.name.toLowerCase());
    if (target && target.slug !== s.slug && !s.related.includes(target.slug ?? "")) {
      s.related.push(target.number); // slugs assigned in this same loop order; store number, map later
      linksResolved++;
    }
  }
}
// Map related numbers → slugs (now that every skill has a slug)
for (const s of skills) {
  s.related = [...new Set(s.related)]
    .map((n) => byNumber.get(n)?.slug)
    .filter(Boolean);
}

// ---- Write improved frontmatter back to the cloned files -----------------
for (const s of skills) {
  const fm = [
    "---",
    `id: ${s.id}`,
    `slug: "${s.slug}"`,
    `title: ${JSON.stringify(String(s.title))}`,
    `source: ${JSON.stringify(String(s.source))}`,
    `number: ${s.number}`,
    `category: ${JSON.stringify(String(s.category))}`,
    `tags: ${JSON.stringify(s.tags ?? [])}`,
    `reading_minutes: ${s.minutes}`,
    `summary: ${JSON.stringify(s.summary)}`,
    `related: ${JSON.stringify(s.related)}`,
    "---",
    "",
  ].join("\n");
  fs.writeFileSync(path.join(CONTENT, s.rel), fm + s.body);
}

// ---- Emit website data ----------------------------------------------------
const ordered = [...skills].sort((a, b) => a.number - b.number);

const index = ordered.map((s) => ({
  slug: s.slug,
  number: s.number,
  title: s.title,
  source: s.source,
  category: s.category,
  tags: s.tags ?? [],
  summary: s.summary.length > 200 ? s.summary.slice(0, 197) + "…" : s.summary,
  minutes: s.minutes,
}));
fs.mkdirSync(path.join(ROOT, "public"), { recursive: true });
fs.writeFileSync(
  path.join(ROOT, "public", "skills-index.json"),
  JSON.stringify(index)
);

const db = {};
for (const s of ordered) {
  db[s.slug] = {
    slug: s.slug,
    number: s.number,
    title: s.title,
    source: s.source,
    category: s.category,
    tags: s.tags ?? [],
    summary: s.summary,
    minutes: s.minutes,
    related: s.related,
    path: s.rel,
  };
}
fs.mkdirSync(path.join(ROOT, "lib", "generated"), { recursive: true });
fs.writeFileSync(
  path.join(ROOT, "lib", "generated", "skills-db.json"),
  JSON.stringify(db, null, 1)
);

// Regenerate the clone's catalog.json, enriched
fs.writeFileSync(
  path.join(CONTENT, "catalog.json"),
  JSON.stringify(
    ordered.map((s) => ({
      id: s.id,
      slug: s.slug,
      number: s.number,
      title: s.title,
      source: s.source,
      category: s.category,
      path: s.rel,
      tags: s.tags ?? [],
      summary: s.summary,
      reading_minutes: s.minutes,
      related: s.related,
    })),
    null,
    2
  )
);

const sources = [...new Set(ordered.map((s) => s.source))];
const categories = [...new Set(ordered.map((s) => s.category))];
console.log(`skills processed:    ${skills.length}`);
console.log(`categories filled:   ${categoriesFilled}`);
console.log(`cross-links resolved:${linksResolved}`);
console.log(`sources (${sources.length}): ${sources.join(" | ")}`);
console.log(`categories (${categories.length}): ${categories.join(" | ")}`);
console.log(`index size: ${(fs.statSync(path.join(ROOT, "public", "skills-index.json")).size / 1024).toFixed(0)} KB`);
