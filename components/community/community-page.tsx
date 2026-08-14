import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import MemberDirectory from "./member-directory"
import AnnouncementBoard from "./announcement-board"
import { Users, Megaphone } from "lucide-react"

export default function CommunityPage() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-3xl font-bold tracking-tight">Community Hub</h2>
        <p className="text-muted-foreground">Connect with members and stay up-to-date.</p>
      </div>
      <Tabs defaultValue="directory" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="directory">
            <Users className="mr-2 h-4 w-4" />
            Member Directory
          </TabsTrigger>
          <TabsTrigger value="announcements">
            <Megaphone className="mr-2 h-4 w-4" />
            Announcements
          </TabsTrigger>
        </TabsList>
        <TabsContent value="directory" className="mt-6">
          <MemberDirectory />
        </TabsContent>
        <TabsContent value="announcements" className="mt-6">
          <AnnouncementBoard />
        </TabsContent>
      </Tabs>
    </div>
  )
}
