import { query, type Options, type SDKMessage } from "@anthropic-ai/claude-agent-sdk"

/**
 * Text generation through the Claude Agent SDK.
 *
 * The SDK runs the Claude Code harness in a subprocess, which means it
 * authenticates the same way Claude Code does on this machine — a Claude
 * subscription login first, or ANTHROPIC_API_KEY if one happens to be
 * exported. That is the whole point of using it here: no per-token API key
 * is needed for local development.
 *
 * These routes want a model, not an agent. Built-in tools are switched off and
 * no filesystem settings are loaded, so the harness cannot read the repo, run
 * commands, or pick up CLAUDE.md / project skills — it just answers.
 */

/** Optional override. Unset means "whatever model Claude Code is configured to use". */
export const CLAUDE_AGENT_MODEL = process.env.CLAUDE_AGENT_MODEL?.trim() || undefined

export const CLAUDE_AGENT_UNAVAILABLE_MESSAGE =
  "Claude Agent SDK could not start. Sign in with `claude` (Claude subscription) on this machine, " +
  "or set GOOGLE_GENERATIVE_AI_API_KEY in .env.local to use Gemini instead."

type ClaudeTextRequest = {
  system: string
  prompt: string
  /** Aborts the underlying subprocess when the client disconnects. */
  signal?: AbortSignal
}

/**
 * Yields text deltas as the model produces them.
 *
 * `includePartialMessages` gives token-level `stream_event` chunks. If the
 * harness ever stops emitting them, the terminal `result` message still
 * carries the complete answer, so the fallback below keeps the route working
 * rather than returning an empty stream.
 */
export async function* streamClaudeText({
  system,
  prompt,
  signal,
}: ClaudeTextRequest): AsyncGenerator<string> {
  const abortController = new AbortController()
  if (signal) {
    if (signal.aborted) abortController.abort()
    else signal.addEventListener("abort", () => abortController.abort(), { once: true })
  }

  const options: Options = {
    systemPrompt: system,
    model: CLAUDE_AGENT_MODEL,
    tools: [],
    settingSources: [],
    maxTurns: 1,
    includePartialMessages: true,
    abortController,
    stderr: (data) => console.error("[claude-agent]", data.trim()),
  }

  let streamedText = false

  for await (const message of query({ prompt, options }) as AsyncGenerator<SDKMessage, void>) {
    if (message.type === "stream_event") {
      const event = message.event
      if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
        streamedText = true
        yield event.delta.text
      }
      continue
    }

    if (message.type === "result") {
      if (message.subtype !== "success") {
        throw new Error(
          message.errors?.join("; ") || `Claude Agent SDK ended with "${message.subtype}"`,
        )
      }
      // Only used when no partial events arrived — otherwise this duplicates
      // everything already streamed above.
      if (!streamedText && message.result) yield message.result
    }
  }
}

/**
 * Yields the JSON object out of a model response, tolerating the markdown
 * fence models sometimes add anyway.
 *
 * Leading prose is dropped until the first `{`. The tail is held back by a few
 * characters so a closing ``` can be removed once the stream ends — the client
 * parses partial JSON, so arriving a few characters late costs nothing.
 */
export async function* streamClaudeJson(request: ClaudeTextRequest): AsyncGenerator<string> {
  const HOLD_BACK = 8
  let started = false
  let buffer = ""

  for await (const delta of streamClaudeText(request)) {
    buffer += delta

    if (!started) {
      const start = buffer.indexOf("{")
      if (start === -1) continue
      started = true
      buffer = buffer.slice(start)
    }

    if (buffer.length > HOLD_BACK) {
      yield buffer.slice(0, -HOLD_BACK)
      buffer = buffer.slice(-HOLD_BACK)
    }
  }

  if (started) {
    const tail = buffer.replace(/\s*```\s*$/, "")
    if (tail) yield tail
  }
}

function toByteStream(deltas: AsyncGenerator<string>): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder()

  return new ReadableStream({
    async start(controller) {
      try {
        for await (const delta of deltas) {
          controller.enqueue(encoder.encode(delta))
        }
        controller.close()
      } catch (error) {
        controller.error(error)
      }
    },
  })
}

/** Wraps {@link streamClaudeText} as a streaming Response body. */
export function claudeTextStream(request: ClaudeTextRequest): ReadableStream<Uint8Array> {
  return toByteStream(streamClaudeText(request))
}

/** Wraps {@link streamClaudeJson} as a streaming Response body. */
export function claudeJsonStream(request: ClaudeTextRequest): ReadableStream<Uint8Array> {
  return toByteStream(streamClaudeJson(request))
}
