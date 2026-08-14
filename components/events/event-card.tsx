import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Users, ArrowRight } from "lucide-react"
import type { Event } from "@/types/workspace"

interface EventCardProps {
  event: Event
}

export default function EventCard({ event }: EventCardProps) {
  const eventDate = new Date(event.date)
  const isPast = eventDate < new Date()

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-shadow hover:shadow-lg">
      <CardHeader className="p-0 relative">
        <Image
          src={event.coverImage || "/placeholder.svg"}
          alt={event.title}
          width={400}
          height={200}
          className="w-full h-48 object-cover"
        />
        {isPast && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-bold text-lg">Event Ended</span>
          </div>
        )}
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <div className="flex justify-between items-start mb-2">
          <Badge variant="secondary">{event.type}</Badge>
          <span className="text-lg font-bold">{event.price > 0 ? `$${event.price}` : "Free"}</span>
        </div>
        <CardTitle className="text-xl mb-2">{event.title}</CardTitle>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            <span>
              {eventDate.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}{" "}
              at {eventDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-2" />
            <span>{event.attendees.length} attending</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 bg-gray-50">
        <Button asChild className="w-full">
          <Link href={`/events/${event.id}`}>
            View Event <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
