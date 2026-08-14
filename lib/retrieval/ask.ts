import { CONFIDENCE_THRESHOLD } from "./config"
import { embed } from "./embed"
import { searchChunks, type ScoredChunk } from "./qdrant"

/**
 * Evidence-gated answering.
 *
 * The rule the product is built on: no source above the threshold means no
 * answer. The model is never asked to fill the gap from its own knowledge,
 * because an answer that reads the same whether or not evidence existed is the
 * failure this whole stack is meant to prevent.
 */

export interface Citation {
  n: number
  title: string
  heading: string | null
  corpus: string
  href: string | null
  snippet: string
  score: number
}

export interface RejectedCandidate {
  title: string
  score: number
}

export type RetrievalOutcome =
  | { kind: "answerable"; citations: Citation[]; rejected: RejectedCandidate[] }
  | { kind: "refused"; reason: string; rejected: RejectedCandidate[]; threshold: number }

export async function retrieve(question: string): Promise<RetrievalOutcome> {
  const hits = await searchChunks(await embed(question))
  const accepted = hits.filter((hit) => hit.score >= CONFIDENCE_THRESHOLD)
  const rejected = hits
    .filter((hit) => hit.score < CONFIDENCE_THRESHOLD)
    .map((hit) => ({ title: hit.heading ? `${hit.title} — ${hit.heading}` : hit.title, score: hit.score }))

  if (accepted.length === 0) {
    const best = hits[0]?.score
    return {
      kind: "refused",
      reason: best
        ? `Sol found ${hits.length} passage${hits.length === 1 ? "" : "s"}, all below the confidence threshold. ` +
          `The closest scored ${best.toFixed(2)} against a threshold of ${CONFIDENCE_THRESHOLD}. ` +
          `Rather than answer from the model's own knowledge, it stopped.`
        : `Nothing in the indexed corpus came close to this question. Attach a document, or ask something the corpus covers.`,
      rejected,
      threshold: CONFIDENCE_THRESHOLD,
    }
  }

  return {
    kind: "answerable",
    citations: accepted.map((hit, index) => toCitation(hit, index + 1)),
    rejected,
  }
}

function toCitation(hit: ScoredChunk, n: number): Citation {
  return {
    n,
    title: hit.title,
    heading: hit.heading,
    corpus: hit.corpus,
    href: hit.href,
    snippet: hit.text.replace(/\s+/g, " ").slice(0, 220),
    score: hit.score,
  }
}

/**
 * The system prompt for a cited answer.
 *
 * Numbered citations are required per sentence, and the model is told the
 * sources are the only permitted ground. "Say so" beats an invented answer when
 * the passages do not cover the question — a refusal after retrieval succeeded
 * is still a correct outcome.
 */
export function citedAnswerPrompt(citations: Citation[]): string {
  const sources = citations
    .map((c) => `[${c.n}] ${c.title}${c.heading ? ` — ${c.heading}` : ""}\n${c.snippet}`)
    .join("\n\n")

  return `You are answering a business-analysis question using ONLY the numbered sources below.

Rules:
- Every sentence that makes a factual claim ends with its source marker, like [1] or [2].
- Use only what the sources say. Do not add background knowledge, however certain you are.
- If the sources do not answer the question, say exactly what they do and do not cover. That is a valid answer.
- Be brief. Two or three sentences is usually right.

Sources:
${sources}`
}
