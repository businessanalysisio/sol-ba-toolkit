// @ts-nocheck -- Legacy prototype pending migration to the canonical Sol domain model.
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import type { Event, Workspace } from "@/types/workspace"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, MapPin, Users, ArrowLeft, Ticket, Briefcase } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// Mock current user
const MOCK_USER = { id: "current_user", name: "Alex Ray", avatar: "/placeholder.svg?width=40&height=40" }

/**
 * View + RSVP state only. Existence is resolved by the server page, so this
 * component can trust that `initialEvent` is real — which is why there is no
 * "Event not found" branch here any more.
 */
export default function EventDetail({
  initialEvent,
  workspace,
}: {
  initialEvent: Event
  workspace: Workspace | null
}) {
  const router = useRouter()

  const [event, setEvent] = useState<Event>(initialEvent)
  const [isRsvpd, setIsRsvpd] = useState(() =>
    initialEvent.attendees.some((attendee) => attendee.id === MOCK_USER.id),
  )

  const handleRsvp = () => {
    setEvent((prevEvent) => ({
      ...prevEvent,
      attendees: isRsvpd
        ? prevEvent.attendees.filter((attendee) => attendee.id !== MOCK_USER.id)
        : [...prevEvent.attendees, MOCK_USER],
    }))
    setIsRsvpd(!isRsvpd)
  }

  const eventDate = new Date(event.date)
  const isPast = eventDate < new Date()

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Events
      </Button>

      <div className="space-y-8">
        <Card>
          <CardHeader className="p-0">
            <Image
              src={event.coverImage || "/placeholder.svg"}
              alt={event.title}
              width={800}
              height={400}
              className="w-full h-64 object-cover rounded-t-lg"
            />
          </CardHeader>
          <CardContent className="p-6">
            <Badge variant="secondary" className="mb-2">
              {event.type}
            </Badge>
            <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
            <p className="text-lg text-gray-600">{event.description}</p>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-gray-700">
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Date and Time</p>
                    <p>
                      {eventDate.toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <p>
                      {eventDate.toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        timeZoneName: "short",
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Location</p>
                    <p>{event.location}</p>
                  </div>
                </div>
                {workspace && (
                  <div className="flex items-start">
                    <Briefcase className="h-5 w-5 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Related Workspace</p>
                      <Link href={`/workspaces/${workspace.id}`} className="text-blue-600 hover:underline">
                        {workspace.name}
                      </Link>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Ticket className="h-5 w-5 mr-2" />
                  Registration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-3xl font-bold text-center">{event.price > 0 ? `$${event.price}` : "Free"}</div>
                <Button onClick={handleRsvp} className="w-full" disabled={isPast}>
                  {isPast ? "Event Ended" : isRsvpd ? "Cancel RSVP" : "RSVP Now"}
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Attendees ({event.attendees.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {event.attendees.slice(0, 5).map((attendee) => (
                    <div key={attendee.id} className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={attendee.avatar || "/placeholder.svg"} alt={attendee.name} />
                        <AvatarFallback>{attendee.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span>{attendee.name}</span>
                    </div>
                  ))}
                  {event.attendees.length > 5 && (
                    <p className="text-sm text-gray-500">+ {event.attendees.length - 5} more</p>
                  )}
                  {event.attendees.length === 0 && <p className="text-sm text-gray-500">Be the first to RSVP!</p>}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
