import { EMBED_DIMENSIONS, EMBED_MODEL, OLLAMA_URL } from "./config"

/**
 * Embeddings via the local Ollama service.
 *
 * Kept behind a narrow interface — one function, text in, vector out — so the
 * provider can change without touching ingestion or search. The dimension check
 * is not paranoia: a model swap that silently returns a different width
 * produces a Qdrant collection that accepts writes and returns nonsense.
 */

export class EmbeddingUnavailableError extends Error {
  constructor(cause: string) {
    super(
      `Embedding service unavailable at ${OLLAMA_URL}: ${cause}. ` +
        `Start it with: docker-compose -f infra/docker-compose.yml up -d ollama`,
    )
    this.name = "EmbeddingUnavailableError"
  }
}

export async function embed(text: string): Promise<number[]> {
  let response: Response
  try {
    response = await fetch(`${OLLAMA_URL}/api/embeddings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: EMBED_MODEL, prompt: text }),
    })
  } catch (error) {
    throw new EmbeddingUnavailableError(error instanceof Error ? error.message : "connection failed")
  }

  if (!response.ok) {
    throw new EmbeddingUnavailableError(`HTTP ${response.status} ${await response.text()}`)
  }

  const body = (await response.json()) as { embedding?: number[] }
  const vector = body.embedding
  if (!Array.isArray(vector) || vector.length === 0) {
    throw new EmbeddingUnavailableError(`model "${EMBED_MODEL}" returned no embedding`)
  }
  if (vector.length !== EMBED_DIMENSIONS) {
    throw new Error(
      `Embedding width mismatch: "${EMBED_MODEL}" returned ${vector.length}, ` +
        `collection expects ${EMBED_DIMENSIONS}. Set EMBED_DIMENSIONS and re-ingest.`,
    )
  }
  return vector
}

/** Sequential on purpose — Ollama serialises anyway, and this keeps ingest logs readable. */
export async function embedAll(texts: string[], onProgress?: (done: number) => void): Promise<number[][]> {
  const vectors: number[][] = []
  for (const [index, text] of texts.entries()) {
    vectors.push(await embed(text))
    onProgress?.(index + 1)
  }
  return vectors
}
