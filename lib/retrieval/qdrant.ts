import { CANDIDATE_LIMIT, EMBED_DIMENSIONS, QDRANT_COLLECTION, QDRANT_URL } from "./config"

/**
 * Minimal Qdrant client over the REST API.
 *
 * Hand-rolled rather than pulling @qdrant/js-client-rest: three endpoints are
 * used (create collection, upsert, search) and a thin wrapper keeps the payload
 * shape visible at the call site, which matters because that payload is what
 * ends up rendered as a citation.
 */

export interface ChunkPayload {
  /** Stable id of the source document, e.g. a wiki slug or skill path. */
  docId: string
  /** Human title shown in the source list. */
  title: string
  /** Where it came from: "wiki" | "skill" | "doc". */
  corpus: string
  /** Section heading, when the chunk is part of a longer page. */
  heading: string | null
  /** The text that was embedded — shown as the citation snippet. */
  text: string
  /** Route the reader can open. Null when the corpus has no page in the app. */
  href: string | null
}

export interface ScoredChunk extends ChunkPayload {
  /** Cosine similarity in [0,1]. This is the number the threshold is applied to. */
  score: number
}

export class QdrantUnavailableError extends Error {
  constructor(cause: string) {
    super(
      `Qdrant unavailable at ${QDRANT_URL}: ${cause}. ` +
        `Start it with: docker-compose -f infra/docker-compose.yml up -d qdrant`,
    )
    this.name = "QdrantUnavailableError"
  }
}

async function call<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response
  try {
    response = await fetch(`${QDRANT_URL}${path}`, {
      ...init,
      headers: { "Content-Type": "application/json", ...init?.headers },
    })
  } catch (error) {
    throw new QdrantUnavailableError(error instanceof Error ? error.message : "connection failed")
  }
  if (!response.ok) {
    throw new QdrantUnavailableError(`HTTP ${response.status} on ${path}: ${await response.text()}`)
  }
  return (await response.json()) as T
}

export async function ensureCollection(): Promise<void> {
  const existing = await fetch(`${QDRANT_URL}/collections/${QDRANT_COLLECTION}`).catch(() => null)
  if (existing?.ok) return

  await call(`/collections/${QDRANT_COLLECTION}`, {
    method: "PUT",
    // Cosine, so scores land in [0,1] and the threshold means what it reads as.
    body: JSON.stringify({ vectors: { size: EMBED_DIMENSIONS, distance: "Cosine" } }),
  })
}

export async function upsertChunks(
  points: { id: string; vector: number[]; payload: ChunkPayload }[],
): Promise<void> {
  if (points.length === 0) return
  await call(`/collections/${QDRANT_COLLECTION}/points?wait=true`, {
    method: "PUT",
    body: JSON.stringify({ points }),
  })
}

export async function dropCollection(): Promise<void> {
  await fetch(`${QDRANT_URL}/collections/${QDRANT_COLLECTION}`, { method: "DELETE" }).catch(() => null)
}

export async function countPoints(): Promise<number> {
  const body = await call<{ result: { count: number } }>(
    `/collections/${QDRANT_COLLECTION}/points/count`,
    { method: "POST", body: JSON.stringify({ exact: true }) },
  )
  return body.result.count
}

/**
 * Returns candidates with their scores — *all* of them, above threshold or not.
 * The caller applies the threshold, because the rejected ones are shown to the
 * user when Sol refuses. Filtering here would throw away the evidence that the
 * refusal was reasonable.
 */
export async function searchChunks(vector: number[], limit = CANDIDATE_LIMIT): Promise<ScoredChunk[]> {
  const body = await call<{ result: { score: number; payload: ChunkPayload }[] }>(
    `/collections/${QDRANT_COLLECTION}/points/search`,
    {
      method: "POST",
      body: JSON.stringify({ vector, limit, with_payload: true }),
    },
  )
  return body.result.map((hit) => ({ ...hit.payload, score: hit.score }))
}
