// @ts-nocheck -- Legacy prototype pending migration to the canonical Sol domain model.
import { notFound } from "next/navigation"
import { getEventById, getWorkspaceById } from "@/lib/data"
import EventDetail from "./EventDetail"

/**
 * Resolves the event on the server so a missing id returns a real 404 instead
 * of a 200 with "Event not found" text, and so a valid event never flashes
 * that message while client state catches up.
 */
export default async function EventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const event = getEventById(id)

  if (!event) {
    notFound()
  }

  const workspace = event.workspaceId ? getWorkspaceById(event.workspaceId) ?? null : null

  return <EventDetail initialEvent={event} workspace={workspace} />
}
