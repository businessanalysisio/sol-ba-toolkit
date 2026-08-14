/**
 * Retrieval stack configuration.
 *
 * Every value has a default that matches infra/docker-compose.yml, so a local
 * checkout works with no .env.local entries at all. Override when the services
 * move.
 */

export const QDRANT_URL = process.env.QDRANT_URL ?? "http://localhost:6333"
export const QDRANT_COLLECTION = process.env.QDRANT_COLLECTION ?? "sol_chunks"

export const NEO4J_URL = process.env.NEO4J_URL ?? "bolt://localhost:7687"
export const NEO4J_USER = process.env.NEO4J_USER ?? "neo4j"
export const NEO4J_PASSWORD = process.env.NEO4J_PASSWORD ?? "sol-local-dev"

export const OLLAMA_URL = process.env.OLLAMA_URL ?? "http://localhost:11434"
export const EMBED_MODEL = process.env.EMBED_MODEL ?? "nomic-embed-text"
/** nomic-embed-text produces 768 dimensions. Changing the model changes this. */
export const EMBED_DIMENSIONS = Number(process.env.EMBED_DIMENSIONS ?? 768)

/**
 * Similarity below which a hit is not allowed to support an answer.
 *
 * The source panel's whole claim is that Sol refuses rather than guesses, so
 * this number is the product promise in numeric form. It is deliberately a
 * config value and not a literal buried in a route: raising it silently would
 * turn a refusal into a fabrication.
 */
export const CONFIDENCE_THRESHOLD = Number(process.env.RETRIEVAL_THRESHOLD ?? 0.6)

/** How many candidates to score before applying the threshold. */
export const CANDIDATE_LIMIT = Number(process.env.RETRIEVAL_CANDIDATES ?? 8)
