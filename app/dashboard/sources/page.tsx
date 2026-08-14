"use client"

import { useCallback, useState, type ReactNode } from "react"
import Link from "next/link"
import { ArrowRight, CircleAlert, Loader2, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Eyebrow, LetterTile } from "@/components/sol/status"

interface Citation {
  n: number
  title: string
  heading: string | null
  corpus: string
  href: string | null
  snippet: string
  score: number
}

interface Rejected {
  title: string
  score: number
}

type Panel =
  | { state: "empty" }
  | { state: "retrieving" }
  | { state: "answered"; question: string; answer: string; citations: Citation[]; rejected: Rejected[]; coverage: { sentences: number; cited: number } }
  | { state: "refused"; question: string; reason: string; rejected: Rejected[]; threshold: number }
  | { state: "error"; message: string }

const CORPUS_TONE: Record<string, "gold" | "mint" | "violet" | "info"> = {
  wiki: "gold",
  skill: "mint",
  doc: "violet",
}

export default function SourcesPage() {
  const [question, setQuestion] = useState("")
  const [panel, setPanel] = useState<Panel>({ state: "empty" })

  const ask = useCallback(async () => {
    const text = question.trim()
    if (text.length < 3) return
    setPanel({ state: "retrieving" })
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: text }),
      })
      if (!res.ok && res.status !== 200) {
        const body = await res.json().catch(() => ({}))
        setPanel({ state: "error", message: body.error ?? `Request failed (${res.status}).` })
        return
      }
      const body = await res.json()
      if (body.state === "refused") {
        setPanel({ state: "refused", question: text, reason: body.reason, rejected: body.rejected ?? [], threshold: body.threshold })
      } else {
        setPanel({
          state: "answered",
          question: text,
          answer: body.answer,
          citations: body.citations ?? [],
          rejected: body.rejected ?? [],
          coverage: body.coverage ?? { sentences: 0, cited: 0 },
        })
      }
    } catch (error) {
      setPanel({ state: "error", message: error instanceof Error ? error.message : "Something went wrong." })
    }
  }, [question])

  return (
    <div className="mx-auto max-w-[1100px] space-y-7 p-5 md:p-9 lg:p-12">
      <header>
        <Eyebrow>Source &amp; citations</Eyebrow>
        <h1 className="mt-3 max-w-3xl text-balance text-3xl font-semibold tracking-[-0.03em] text-white md:text-4xl">
          No evidence, no answer.
        </h1>
        <p className="mt-3 max-w-2xl text-base text-muted-foreground">
          Every sentence carries a numbered citation. When retrieval finds nothing above the
          confidence threshold, Sol refuses instead of guessing.
        </p>
      </header>

      <section className="rounded-2xl border border-white/[0.09] bg-white/[0.02] p-6">
        <label htmlFor="question" className="text-sm font-medium text-white">
          Ask the corpus
        </label>
        <Textarea
          id="question"
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          rows={2}
          placeholder="How does the draft, review, approve, export workflow work?"
          className="mt-2"
        />
        <div className="mt-4 flex items-center gap-3">
          <Button onClick={ask} disabled={panel.state === "retrieving" || question.trim().length < 3}>
            {panel.state === "retrieving" ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Retrieving…</>
            ) : (
              <><Search className="mr-2 h-4 w-4" /> Ask</>
            )}
          </Button>
          <p className="text-xs text-muted-foreground">
            Answers come only from the indexed wiki, skills library and docs.
          </p>
        </div>
      </section>

      {panel.state === "empty" && (
        <div className="rounded-2xl border border-dashed border-white/[0.12] p-10 text-center">
          <p className="font-medium text-white">Sources appear here as they are retrieved</p>
          <p className="mx-auto mt-1.5 max-w-md text-sm leading-6 text-muted-foreground">
            Each answer lists what it was drawn from, with the similarity score that let it through.
          </p>
        </div>
      )}

      {panel.state === "retrieving" && (
        <div className="rounded-2xl border border-white/[0.09] bg-white/[0.02] p-6">
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin text-sol-gold" />
            Scoring candidates against the corpus…
          </p>
        </div>
      )}

      {panel.state === "error" && (
        <div role="alert" className="rounded-2xl border border-sol-coral/45 bg-sol-coral/[0.06] p-5">
          <p className="flex items-center gap-2 font-semibold text-sol-coral">
            <CircleAlert className="h-4 w-4" /> Retrieval unavailable
          </p>
          <p className="mt-2 max-w-prose text-sm leading-6 text-muted-foreground">{panel.message}</p>
        </div>
      )}

      {(panel.state === "answered" || panel.state === "refused") && (
        <Asked question={panel.question} />
      )}

      {panel.state === "answered" && (
        <>
          <section className="rounded-2xl border border-sol-gold/40 bg-sol-gold/[0.04] p-6">
            <Eyebrow>Answer · {panel.citations.length} citations</Eyebrow>
            <p className="mt-3 whitespace-pre-wrap text-[15px] leading-7 text-white">
              {renderWithMarkers(panel.answer)}
            </p>
          </section>

          <section className="rounded-2xl border border-white/[0.09] bg-white/[0.02] px-6 py-4">
            <p className="text-sm">
              <span className={panel.coverage.cited === panel.coverage.sentences ? "font-semibold text-sol-mint" : "font-semibold text-sol-warn"}>
                {panel.coverage.cited === panel.coverage.sentences ? "Every claim traced" : "Partly traced"}
              </span>{" "}
              <span className="text-muted-foreground">
                {panel.coverage.cited} of {panel.coverage.sentences} sentences carry a source.
              </span>
            </p>
          </section>

          <section className="rounded-2xl border border-white/[0.09] bg-white/[0.02] p-6">
            <div className="flex items-baseline justify-between gap-4">
              <Eyebrow>Sources</Eyebrow>
              <p className="text-xs text-muted-foreground">
                {panel.citations.length} sources · lowest confidence{" "}
                {Math.min(...panel.citations.map((c) => c.score)).toFixed(2)}
              </p>
            </div>
            <ul className="mt-4 space-y-3">
              {panel.citations.map((citation) => (
                <li key={citation.n} className="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-black/10 p-4">
                  <LetterTile letter={String(citation.n)} tone={CORPUS_TONE[citation.corpus] ?? "info"} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-white">
                      {citation.title}
                      {citation.heading ? <span className="text-muted-foreground"> — {citation.heading}</span> : null}
                    </p>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{citation.snippet}…</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="text-xs tabular-nums text-sol-mint">{citation.score.toFixed(2)}</span>
                    {citation.href && (
                      <Link href={citation.href} className="text-sm font-medium text-sol-gold hover:text-white">
                        Open <ArrowRight className="inline h-3.5 w-3.5" />
                      </Link>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}

      {panel.state === "refused" && (
        <>
          <section className="rounded-2xl border border-sol-coral/45 bg-sol-coral/[0.06] p-6">
            <p className="font-semibold text-sol-coral">
              No answer · no source above {panel.threshold}
            </p>
            <p className="mt-2 max-w-prose text-sm leading-6 text-muted-foreground">{panel.reason}</p>
            {panel.rejected.length > 0 && (
              <div className="mt-5 border-t border-white/[0.09] pt-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.13em] text-muted-foreground">
                  Rejected candidates
                </p>
                <ul className="mt-2 space-y-1">
                  {panel.rejected.slice(0, 5).map((item) => (
                    <li key={item.title} className="flex justify-between gap-4 text-sm text-muted-foreground">
                      <span className="truncate">{item.title}</span>
                      <span className="shrink-0 tabular-nums">{item.score.toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
          <section className="rounded-2xl border border-white/[0.09] bg-white/[0.02] p-6 text-center">
            <p className="text-sm text-muted-foreground">
              No source cleared the threshold, so the panel stays empty by design.
            </p>
          </section>
        </>
      )}
    </div>
  )
}

function Asked({ question }: { question: string }) {
  return (
    <div className="rounded-2xl border border-white/[0.09] bg-white/[0.035] px-5 py-3.5">
      <p className="text-[15px] text-white">{question}</p>
    </div>
  )
}

/**
 * Renders [1]-style markers in the accent so a claim's source is visible
 * inline, and the **bold** the model reaches for — otherwise the asterisks
 * show up as literal characters in the answer.
 */
function renderWithMarkers(answer: string): ReactNode[] {
  return answer.split(/(\[\d+\]|\*\*[^*]+\*\*)/g).map((part, index) => {
    if (/^\[\d+\]$/.test(part)) {
      return <sup key={index} className="mx-0.5 font-semibold text-sol-gold">{part}</sup>
    }
    if (/^\*\*[^*]+\*\*$/.test(part)) {
      return <strong key={index} className="font-semibold text-white">{part.slice(2, -2)}</strong>
    }
    return <span key={index}>{part}</span>
  })
}
