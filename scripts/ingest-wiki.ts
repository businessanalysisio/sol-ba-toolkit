/**
 * Ingests the LLM-Wiki into Qdrant (vectors) and Neo4j (link graph).
 *
 *   npx tsx scripts/ingest-wiki.ts [--reset]
 *
 * Both stores are derived. This script is idempotent: chunk ids are a hash of
 * (slug, heading), so re-running updates in place rather than duplicating, and
 * --reset drops the collection when the embedding model or chunking changes.
 */

import crypto from "node:crypto"
import neo4j from "neo4j-driver"
import { readWikiGraph, type WikiPage } from "../lib/wiki/parse"
import { embed } from "../lib/retrieval/embed"
import {
  countPoints,
  dropCollection,
  ensureCollection,
  upsertChunks,
  type ChunkPayload,
} from "../lib/retrieval/qdrant"
import { NEO4J_PASSWORD, NEO4J_URL, NEO4J_USER } from "../lib/retrieval/config"

/** Qdrant point ids must be a uuid or an unsigned int; hash the natural key. */
function chunkId(slug: string, heading: string | null): string {
  const hash = crypto.createHash("sha1").update(`${slug}::${heading ?? ""}`).digest("hex")
  // Shape the digest into a uuid so Qdrant accepts it.
  return [
    hash.slice(0, 8),
    hash.slice(8, 12),
    hash.slice(12, 16),
    hash.slice(16, 20),
    hash.slice(20, 32),
  ].join("-")
}

/**
 * A section becomes one chunk, prefixed with its page title and heading so the
 * embedding carries the context a bare paragraph would lose.
 */
function chunksOf(page: WikiPage): { id: string; text: string; payload: ChunkPayload }[] {
  return page.sections
    .filter((section) => section.body.length > 40)
    .map((section) => {
      const context = [page.title, section.heading].filter(Boolean).join(" — ")
      return {
        id: chunkId(page.slug, section.heading),
        text: `${context}\n\n${section.body}`,
        payload: {
          docId: page.slug,
          title: page.title,
          corpus: "wiki",
          heading: section.heading,
          text: section.body.slice(0, 1200),
          href: `/knowledge-base/${page.slug}`,
        },
      }
    })
}

async function main() {
  const reset = process.argv.includes("--reset")
  const graph = readWikiGraph()
  console.log(`wiki: ${graph.pages.length} pages, ${graph.edges.length} edges`)

  // ---- Qdrant ------------------------------------------------------------
  if (reset) {
    await dropCollection()
    console.log("qdrant: collection dropped")
  }
  await ensureCollection()

  const chunks = graph.pages.flatMap(chunksOf)
  console.log(`qdrant: embedding ${chunks.length} chunks…`)

  const points: { id: string; vector: number[]; payload: ChunkPayload }[] = []
  for (const [index, chunk] of chunks.entries()) {
    points.push({ id: chunk.id, vector: await embed(chunk.text), payload: chunk.payload })
    if ((index + 1) % 25 === 0) console.log(`  ${index + 1}/${chunks.length}`)
  }
  await upsertChunks(points)
  console.log(`qdrant: ${await countPoints()} points in collection`)

  // ---- Neo4j -------------------------------------------------------------
  const driver = neo4j.driver(NEO4J_URL, neo4j.auth.basic(NEO4J_USER, NEO4J_PASSWORD))
  const session = driver.session()
  try {
    await session.run("CREATE CONSTRAINT wiki_page_slug IF NOT EXISTS FOR (p:WikiPage) REQUIRE p.slug IS UNIQUE")

    for (const page of graph.pages) {
      await session.run(
        `MERGE (p:WikiPage {slug: $slug})
         SET p.title = $title, p.type = $type, p.file = $file, p.sections = $sections`,
        { slug: page.slug, title: page.title, type: page.type, file: page.file, sections: page.sections.length },
      )
    }

    // Edges are replaced wholesale: a link removed from the markdown must
    // disappear from the graph, or the graph starts lying about the wiki.
    await session.run("MATCH (:WikiPage)-[r:LINKS_TO]->(:WikiPage) DELETE r")
    for (const edge of graph.edges) {
      await session.run(
        `MATCH (a:WikiPage {slug: $from}) MATCH (b:WikiPage {slug: $to}) MERGE (a)-[:LINKS_TO]->(b)`,
        edge,
      )
    }

    const counts = await session.run(
      `MATCH (p:WikiPage) WITH count(p) AS pages
       MATCH (:WikiPage)-[r:LINKS_TO]->(:WikiPage) RETURN pages, count(r) AS links`,
    )
    const record = counts.records[0]
    console.log(`neo4j: ${record.get("pages")} pages, ${record.get("links")} links`)
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
