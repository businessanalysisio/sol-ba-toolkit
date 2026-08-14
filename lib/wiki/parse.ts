import fs from "node:fs"
import path from "node:path"

/**
 * Parses the LLM-Wiki in `wiki/` into nodes and edges.
 *
 * The wiki is the canonical prose layer: hand-written Markdown, Git-versioned,
 * `[[wikilink]]`-connected. Everything downstream is derived from it —
 * Neo4j holds the link graph, Qdrant holds embeddings of the chunks — so this
 * parser is the single place that decides what a page and a link *are*.
 *
 * Nothing here needs a running service, which is deliberate: the wiki must stay
 * readable and diffable on its own.
 */

export type WikiPageType = "concept" | "entity" | "source" | "synthesis" | "index"

export interface WikiSection {
  /** Heading text, or null for the lead paragraphs before the first heading. */
  heading: string | null
  level: number
  body: string
}

export interface WikiPage {
  slug: string
  type: WikiPageType
  title: string
  file: string
  body: string
  sections: WikiSection[]
  /** Distinct slugs this page links to, in first-appearance order. */
  links: string[]
}

export interface WikiGraph {
  pages: WikiPage[]
  /** Link edges. `to` may name a page that does not exist yet — see danglingLinks. */
  edges: { from: string; to: string }[]
  /** Link targets with no page of their own. A wiki always has some; they are work to do. */
  danglingLinks: string[]
}

const DIR_TYPE: Record<string, WikiPageType> = {
  concepts: "concept",
  entities: "entity",
  sources: "source",
  syntheses: "synthesis",
}

const WIKILINK = /\[\[([a-z0-9][a-z0-9-]*)\]\]/g

/** `wiki/concepts/ba-skills-library.md` → `ba-skills-library` */
export function slugOf(file: string): string {
  return path.basename(file, ".md").toLowerCase()
}

export function typeOf(file: string): WikiPageType {
  const parent = path.basename(path.dirname(file))
  return DIR_TYPE[parent] ?? "index"
}

/** First `# heading`, else the slug humanised. */
function titleOf(markdown: string, slug: string): string {
  const match = markdown.match(/^#\s+(.+)$/m)
  return match ? match[1].trim() : slug.replace(/-/g, " ")
}

/**
 * Splits on ATX headings. Sections are the retrieval unit — embedding a whole
 * page loses the specificity that makes a citation worth showing, and embedding
 * a sentence loses the context that makes it intelligible.
 */
export function sectionsOf(markdown: string): WikiSection[] {
  const lines = markdown.split("\n")
  const sections: WikiSection[] = []
  let heading: string | null = null
  let level = 0
  let buffer: string[] = []

  const flush = () => {
    const body = buffer.join("\n").trim()
    if (body) sections.push({ heading, level, body })
    buffer = []
  }

  for (const line of lines) {
    const match = line.match(/^(#{1,6})\s+(.*)$/)
    if (match) {
      flush()
      level = match[1].length
      heading = match[2].trim()
      // The H1 is the page title, not a section of it.
      if (level === 1) heading = null
      continue
    }
    buffer.push(line)
  }
  flush()
  return sections
}

export function linksOf(markdown: string): string[] {
  const found: string[] = []
  for (const match of markdown.matchAll(WIKILINK)) {
    if (!found.includes(match[1])) found.push(match[1])
  }
  return found
}

export function parsePage(file: string, markdown: string): WikiPage {
  const slug = slugOf(file)
  return {
    slug,
    type: typeOf(file),
    title: titleOf(markdown, slug),
    file,
    body: markdown,
    sections: sectionsOf(markdown),
    links: linksOf(markdown),
  }
}

/** Walks `root` (default `wiki/`) and builds the whole graph. */
export function readWikiGraph(root = path.join(process.cwd(), "wiki")): WikiGraph {
  const files: string[] = []
  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) walk(full)
      else if (entry.name.endsWith(".md")) files.push(full)
    }
  }
  walk(root)

  const pages = files.sort().map((file) => parsePage(file, fs.readFileSync(file, "utf8")))
  const known = new Set(pages.map((page) => page.slug))

  const edges: { from: string; to: string }[] = []
  const dangling = new Set<string>()
  for (const page of pages) {
    for (const to of page.links) {
      if (to === page.slug) continue // self-links carry no information
      edges.push({ from: page.slug, to })
      if (!known.has(to)) dangling.add(to)
    }
  }

  return { pages, edges, danglingLinks: [...dangling].sort() }
}

/** Pages linking *to* a slug — the backlinks panel in the reference. */
export function backlinksOf(graph: WikiGraph, slug: string): string[] {
  return graph.edges.filter((edge) => edge.to === slug).map((edge) => edge.from)
}
