import type { ReactNode } from "react"

/**
 * Status vocabulary for the SOL screens.
 *
 * State is carried by weighted, coloured *text* rather than a filled pill —
 * pills all read at the same visual weight, so a table of them turns into
 * confetti and nothing stands out. Text lets severity sit in the hue while the
 * word itself stays the primary signal, which also means the meaning survives
 * for anyone who can't separate the hues.
 */

export type StatusTone = "positive" | "active" | "neutral" | "caution" | "critical" | "info"

const TONE_CLASS: Record<StatusTone, string> = {
  positive: "text-sol-mint",
  active: "text-sol-gold",
  neutral: "text-sol-dim",
  caution: "text-sol-warn",
  critical: "text-sol-coral",
  info: "text-sol-info",
}

/** A bare status word. The default for table cells and metadata rows. */
export function StatusText({
  tone,
  children,
  className = "",
}: {
  tone: StatusTone
  children: ReactNode
  className?: string
}) {
  return <span className={`text-sm font-semibold ${TONE_CLASS[tone]} ${className}`}>{children}</span>
}

/**
 * The eyebrow used above panel sections — orange, uppercase, tracked to the
 * system's --tracking-eyebrow.
 */
export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`text-[11px] font-semibold uppercase tracking-[0.13em] text-sol-gold ${className}`}>
      {children}
    </p>
  )
}

/**
 * A tinted letter tile — the recurring identity mark on cards, source rows and
 * activity items. `tone` picks the hue; the letter is derived by the caller so
 * it stays meaningful rather than decorative.
 */
const TILE_CLASS: Record<string, string> = {
  gold: "bg-sol-gold/15 text-sol-gold",
  mint: "bg-sol-mint/15 text-sol-mint",
  violet: "bg-sol-violet/15 text-sol-violet",
  info: "bg-sol-info/15 text-sol-info",
  warn: "bg-sol-warn/15 text-sol-warn",
  coral: "bg-sol-coral/15 text-sol-coral",
}

export function LetterTile({
  letter,
  tone = "gold",
  size = "md",
}: {
  letter: string
  tone?: keyof typeof TILE_CLASS
  size?: "sm" | "md"
}) {
  const box = size === "sm" ? "h-7 w-7 text-xs" : "h-9 w-9 text-sm"
  return (
    <span
      aria-hidden
      className={`inline-flex shrink-0 items-center justify-center rounded-lg font-semibold ${box} ${TILE_CLASS[tone]}`}
    >
      {letter}
    </span>
  )
}

/** Small outlined pill for provenance — a source id, a document version. */
export function SourceBadge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-md border border-sol-gold/40 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-sol-gold">
      {children}
    </span>
  )
}
