import type { CommunityMember } from "@/types/workspace"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Mail } from "lucide-react"

interface MemberCardProps {
  member: CommunityMember
}

export default function MemberCard({ member }: MemberCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-col items-center text-center">
        <Avatar className="h-24 w-24 mb-4">
          <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
          <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <CardTitle>{member.name}</CardTitle>
        <p className="text-sm text-muted-foreground">{member.role}</p>
      </CardHeader>
      <CardContent className="text-center">
        <div className="mb-4">
          <h4 className="font-semibold text-sm mb-2">Skills</h4>
          <div className="flex flex-wrap gap-1 justify-center">
            {member.skills.map((skill) => (
              <Badge key={skill} variant="secondary">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <h4 className="font-semibold text-sm mb-2">Interests</h4>
          <div className="flex flex-wrap gap-1 justify-center">
            {member.interests.map((interest) => (
              <Badge key={interest} variant="outline">
                {interest}
              </Badge>
            ))}
          </div>
        </div>
        <Button size="sm" className="w-full">
          <Mail className="mr-2 h-4 w-4" />
          Contact
        </Button>
      </CardContent>
    </Card>
  )
}
