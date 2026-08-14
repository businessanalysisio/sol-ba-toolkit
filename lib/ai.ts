import { google } from "@ai-sdk/google"

/**
 * Two ways to reach a model:
 *
 * - `claude` — the Claude Agent SDK, which borrows Claude Code's own
 *   credentials on this machine. Works off a Claude subscription with no API
 *   key in .env.local. This is the default.
 * - `google`  — Gemini through the Vercel AI SDK. Needs
 *   GOOGLE_GENERATIVE_AI_API_KEY.
 *
 * Set AI_PROVIDER to pin one explicitly; otherwise a configured Google key
 * wins (so existing setups keep working) and Claude is the fallback.
 */
export type AIProvider = "claude" | "google"

export const hasGoogleKey = () => Boolean(process.env.GOOGLE_GENERATIVE_AI_API_KEY)

export function aiProvider(): AIProvider {
  const configured = process.env.AI_PROVIDER?.trim().toLowerCase()
  if (configured === "claude" || configured === "google") return configured
  return hasGoogleKey() ? "google" : "claude"
}

/**
 * Model id used by the Gemini path.
 *
 * Override with GOOGLE_GENERATIVE_AI_MODEL in .env.local if you have access to a
 * different tier. The Gemini 1.5 series this project originally targeted is no
 * longer available to new API projects, so the default is a current model.
 */
export const AI_MODEL_ID = process.env.GOOGLE_GENERATIVE_AI_MODEL ?? "gemini-2.5-flash"

/**
 * True when the selected provider has what it needs to run. The Claude path has
 * no key to check — a missing subscription login surfaces as a runtime error
 * from the SDK instead, which the routes translate into a readable message.
 */
export const isAIConfigured = () => (aiProvider() === "google" ? hasGoogleKey() : true)

export const aiModel = () => google(AI_MODEL_ID)

export const AI_NOT_CONFIGURED_MESSAGE =
  "AI service is not configured. Sign in with `claude` to use your Claude subscription, " +
  "or set GOOGLE_GENERATIVE_AI_API_KEY in .env.local, then restart the server."
