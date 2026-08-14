// @ts-nocheck -- Legacy prototype pending migration to the canonical Sol domain model.
import { announcements } from "@/lib/data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bell } from "lucide-react"

export default function AnnouncementBoard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bell className="mr-2 h-5 w-5" />
          Announcements
        </CardTitle>
        <CardDescription>Latest news and updates from the community.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {announcements.map((announcement) => (
          <div key={announcement.id} className="flex items-start space-x-4 p-4 border rounded-lg">
            <Avatar>
              <AvatarFallback>{announcement.author.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-semibold">{announcement.title}</h4>
              <p className="text-sm text-muted-foreground">{announcement.content}</p>
              <p className="text-xs text-muted-foreground mt-2">
                Posted by {announcement.author} on {announcement.date}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
