/**
 * Ingests every corpus into Qdrant (vectors) and Neo4j (graphs).
 *
 *   npx tsx scripts/ingest.ts               # everything
 *   npx tsx scripts/ingest.ts --only=wiki   # wiki | skills | docs
 *   npx tsx scripts/ingest.ts --reset       # drop the collection first
 *
 * Idempotent: point ids are a hash of the natural key, so re-running updates in
 * place. --reset is for when the embedding model or the chunking changes, since
 * neither is detectable from the stored vectors.
 */

import crypto from "node:crypto"
import fs from "node:fs"
import path from "node:path"
import neo4j, { type Session } from "neo4j-driver"
import { readWikiGraph, sectionsOf, type WikiPage } from "../lib/wiki/parse"
import { getAllSkills } from "../lib/skills"
import { embed } from "../lib/retrieval/embed"
import {
  countPoints,
  dropCollection,
  ensureCollection,
  upsertChunks,
  type ChunkPayload,
} from "../lib/retrieval/qdrant"
import { NEO4J_PASSWORD, NEO4J_URL, NEO4J_USER } from "../lib/retrieval/config"

interface Chunk {
  id: string
  text: string
  payload: ChunkPayload
}

/** Qdrant point ids must be a uuid or unsigned int; shape a sha1 into a uuid. */
function chunkId(key: string): string {
  const h = crypto.createHash("sha1").update(key).digest("hex")
  return [h.slice(0, 8), h.slice(8, 12), h.slice(12, 16), h.slice(16, 20), h.slice(20, 32)].join("-")
}

// --- wiki -------------------------------------------------------------------

function wikiChunks(page: WikiPage): Chunk[] {
  return page.sections
    .filter((section) => section.body.length > 40)
    .map((section) => ({
      id: chunkId(`wiki::${page.slug}::${section.heading ?? ""}`),
      // Prefix with title and heading so the vector carries the context a bare
      // paragraph would lose.
      text: `${[page.title, section.heading].filter(Boolean).join(" — ")}\n\n${section.body}`,
      payload: {
        docId: page.slug,
        title: page.title,
        corpus: "wiki",
        heading: section.heading,
        text: section.body.slice(0, 1200),
        href: `/knowledge-base/${page.slug}`,
      },
    }))
}

// --- skills -----------------------------------------------------------------

function skillChunks(): Chunk[] {
  const chunks: Chunk[] = []
  for (const skill of getAllSkills()) {
    // skill.path is relative to content/skills, as renderSkillHtml resolves it.
    const file = path.join(process.cwd(), "content", "skills", skill.path)
    if (!fs.existsSync(file)) continue
    const body = fs.readFileSync(file, "utf8")
    // Skills are short — median ~175 words — so the whole skill is one chunk.
    // Splitting them would fragment a technique across citations.
    chunks.push({
      id: chunkId(`skill::${skill.slug}`),
      text: `${skill.title} (${skill.source})\n\n${skill.summary}\n\n${body}`.slice(0, 8000),
      payload: {
        docId: skill.slug,
        title: skill.title,
        corpus: "skill",
        heading: skill.source,
        text: skill.summary || body.slice(0, 1200),
        href: `/skills/${skill.slug}`,
      },
    })
  }
  return chunks
}

// --- docs -------------------------------------------------------------------

function docChunks(): Chunk[] {
  const root = path.join(process.cwd(), "docs")
  if (!fs.existsSync(root)) return []
  const files: string[] = []
  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) walk(full)
      else if (entry.name.endsWith(".md")) files.push(full)
    }
  }
  walk(root)

  const chunks: Chunk[] = []
  for (const file of files.sort()) {
    const body = fs.readFileSync(file, "utf8")
    const rel = path.relative(process.cwd(), file)
    const title = body.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? path.basename(file, ".md")
    for (const section of sectionsOf(body)) {
      if (section.body.length <= 40) continue
      chunks.push({
        id: chunkId(`doc::${rel}::${section.heading ?? ""}`),
        text: `${[title, section.heading].filter(Boolean).join(" — ")}\n\n${section.body}`,
        payload: {
          docId: rel,
          title,
          corpus: "doc",
          heading: section.heading,
          text: section.body.slice(0, 1200),
          // Internal docs have no route in the app; a citation names them
          // without pretending they are readable in place.
          href: null,
        },
      })
    }
  }
  return chunks
}

// --- graphs -----------------------------------------------------------------

async function writeWikiGraph(session: Session) {
  const graph = readWikiGraph()
  await session.run(
    "CREATE CONSTRAINT wiki_page_slug IF NOT EXISTS FOR (p:WikiPage) REQUIRE p.slug IS UNIQUE",
  )
  for (const page of graph.pages) {
    await session.run(
      `MERGE (p:WikiPage {slug: $slug})
       SET p.title = $title, p.type = $type, p.sections = $sections`,
      { slug: page.slug, title: page.title, type: page.type, sections: page.sections.length },
    )
  }
  // Replaced wholesale: a link deleted from the markdown must vanish from the
  // graph, or the graph starts lying about the wiki.
  await session.run("MATCH (:WikiPage)-[r:LINKS_TO]->(:WikiPage) DELETE r")
  for (const edge of graph.edges) {
    await session.run(
      "MATCH (a:WikiPage {slug: $from}) MATCH (b:WikiPage {slug: $to}) MERGE (a)-[:LINKS_TO]->(b)",
      edge,
    )
  }
  return { pages: graph.pages.length, links: graph.edges.length }
}

async function writeSkillGraph(session: Session) {
  const skills = getAllSkills()
  await session.run("CREATE CONSTRAINT skill_slug IF NOT EXISTS FOR (s:Skill) REQUIRE s.slug IS UNIQUE")
  for (const skill of skills) {
    await session.run(
      `MERGE (s:Skill {slug: $slug})
       SET s.title = $title, s.source = $source, s.category = $category`,
      { slug: skill.slug, title: skill.title, source: skill.source, category: skill.category },
    )
  }
  await session.run("MATCH (:Skill)-[r:RELATED_TO]->(:Skill) DELETE r")
  let links = 0
  for (const skill of skills) {
    for (const related of skill.related ?? []) {
      const result = await session.run(
        "MATCH (a:Skill {slug: $from}) MATCH (b:Skill {slug: $to}) MERGE (a)-[:RELATED_TO]->(b) RETURN 1",
        { from: skill.slug, to: related },
      )
      links += result.records.length
    }
  }
  return { skills: skills.length, links }
}

// --- main -------------------------------------------------------------------

async function main() {
  const args = process.argv.slice(2)
  const only = args.find((a) => a.startsWith("--only="))?.split("=")[1]
  const reset = args.includes("--reset")
  const wants = (name: string) => !only || only === name

  if (reset) {
    await dropCollection()
    console.log("qdrant: collection dropped")
  }
  await ensureCollection()

  const chunks: Chunk[] = []
  if (wants("wiki")) {
    const c = readWikiGraph().pages.flatMap(wikiChunks)
    console.log(`wiki:   ${c.length} chunks`)
    chunks.push(...c)
  }
  if (wants("skills")) {
    const c = skillChunks()
    console.log(`skills: ${c.length} chunks`)
    chunks.push(...c)
  }
  if (wants("docs")) {
    const c = docChunks()
    console.log(`docs:   ${c.length} chunks`)
    chunks.push(...c)
  }

  console.log(`embedding ${chunks.length} chunks…`)
  const started = Date.now()
  const batch: { id: string; vector: number[]; payload: ChunkPayload }[] = []
  for (const [index, chunk] of chunks.entries()) {
    batch.push({ id: chunk.id, vector: await embed(chunk.text), payload: chunk.payload })
    if (batch.length === 64) {
      await upsertChunks(batch.splice(0))
    }
    if ((index + 1) % 100 === 0) {
      const rate = (index + 1) / ((Date.now() - started) / 1000)
      console.log(`  ${index + 1}/${chunks.length}  (${rate.toFixed(1)}/s)`)
    }
  }
  await upsertChunks(batch)
  console.log(`qdrant: ${await countPoints()} points total`)

  const driver = neo4j.driver(NEO4J_URL, neo4j.auth.basic(NEO4J_USER, NEO4J_PASSWORD))
  const session = driver.session()
  try {
    if (wants("wiki")) {
      const r = await writeWikiGraph(session)
      console.log(`neo4j:  ${r.pages} wiki pages, ${r.links} links`)
    }
    if (wants("skills")) {
      const r = await writeSkillGraph(session)
      console.log(`neo4j:  ${r.skills} skills, ${r.links} related-to links`)
    }
  } finally {
    await session.close()
    await driver.close()
  }

  console.log("done")
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
