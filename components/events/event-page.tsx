// @ts-nocheck -- Legacy prototype pending migration to the canonical Sol domain model.
"use client"

import { useState } from "react"
import { events } from "@/lib/data"
import EventCard from "./event-card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

export default function EventPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [eventType, setEventType] = useState("all")

  const upcomingEvents = events
    .filter((event) => new Date(event.date) >= new Date())
    .filter((event) => event.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((event) => eventType === "all" || event.type === eventType)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const pastEvents = events
    .filter((event) => new Date(event.date) < new Date())
    .filter((event) => event.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((event) => eventType === "all" || event.type === eventType)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const eventTypes = ["all", ...Array.from(new Set(events.map((e) => e.type)))]

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Events</h1>
          <p className="text-gray-600">Discover workshops, tours, and sessions.</p>
        </div>
        <Button>
          <PlusCircle className="h-4 w-4 mr-2" />
          Create Event
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <Input
          placeholder="Search events..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select value={eventType} onValueChange={setEventType}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            {eventTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type === "all" ? "All Types" : type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Upcoming Events</h2>
        {upcomingEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No upcoming events match your criteria.</p>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Past Events</h2>
        {pastEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No past events found.</p>
        )}
      </div>
    </div>
  )
}
