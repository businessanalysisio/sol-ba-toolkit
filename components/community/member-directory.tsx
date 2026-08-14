// @ts-nocheck -- Legacy prototype pending migration to the canonical Sol domain model.
"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { communityMembers, workspaces } from "@/lib/data"
import MemberCard from "./member-card"
import { Search } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function MemberDirectory() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedWorkspace, setSelectedWorkspace] = useState("all")
  const [selectedSkill, setSelectedSkill] = useState("all")

  const allSkills = useMemo(() => {
    const skills = new Set<string>()
    communityMembers.forEach((member) => {
      member.skills.forEach((skill) => skills.add(skill))
    })
    return Array.from(skills)
  }, [])

  const filteredMembers = communityMembers.filter((member) => {
    const matchesSearch =
      searchTerm === "" ||
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.skills.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
      member.interests.some((i) => i.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesWorkspace = selectedWorkspace === "all" || member.workspaces.includes(selectedWorkspace)
    const matchesSkill = selectedSkill === "all" || member.skills.includes(selectedSkill)

    return matchesSearch && matchesWorkspace && matchesSkill
  })

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, skill, interest..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedWorkspace} onValueChange={setSelectedWorkspace}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by program" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Programs</SelectItem>
            {workspaces.map((ws) => (
              <SelectItem key={ws.id} value={ws.id}>
                {ws.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedSkill} onValueChange={setSelectedSkill}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by skill" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Skills</SelectItem>
            {allSkills.map((skill) => (
              <SelectItem key={skill} value={skill}>
                {skill}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredMembers.map((member) => (
          <MemberCard key={member.id} member={member} />
        ))}
      </div>
    </div>
  )
}
