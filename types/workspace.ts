export interface Member {
  id: string
  name: string
  role: "Project Leader" | "Member" | "Volunteer" | "Partner" | "Guest"
  avatar: string
}

export interface Task {
  id: string
  title: string
  completed: boolean
}

export interface Document {
  id: string
  name: string
  url: string
}

export interface Workspace {
  id: string
  name: string
  description: string
  goals: string[]
  milestones: string[]
  tags: string[]
  members: Member[]
  tasks: Task[]
  documents: Document[]
  coverImage: string
}

export type KnowledgeCategory = {
  id: string
  name: string
  description: string
}

export interface KnowledgeArticle {
  slug: string
  title: string
  category: string
  content: string
}

export interface CommunityMember {
  id: string
  name: string
  role: "Project Leader" | "Member" | "Volunteer" | "Partner" | "Guest"
  avatar: string
  skills: string[]
  interests: string[]
  workspaces: string[] // Array of workspace IDs
}

export interface Announcement {
  id: string
  title: string
  content: string
  author: string
  date: string
}

export interface EventAttendee {
  id: string
  name: string
  avatar: string
}

export interface Event {
  id: string
  title: string
  description: string
  date: string
  location: string
  type: "Workshop" | "Tour" | "Webinar" | "Jam Session"
  price: number
  coverImage: string
  attendees: EventAttendee[]
  workspaceId?: string // Optional link to a workspace
}
