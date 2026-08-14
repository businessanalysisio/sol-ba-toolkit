export type SubscriptionTier = "free" | "pro"

export type UserProfile = {
  id: string
  email: string
  name: string
  created_at: string
  subscription_tier: SubscriptionTier
}

export type LearningPath = {
  id: string
  title: string
  description: string
  order: number
  modules: string[]
  audience: string
  duration: string
  level: "Foundation" | "Applied" | "Advanced"
  progress: number
}

export type Module = {
  id: string
  path_id: string
  title: string
  content: string
  order: number
}

export type UserProgress = {
  id: string
  user_id: string
  module_id: string
  completed_at: string | null
  score: number
}

export type Framework = {
  id: string
  name: string
  category: string
  description: string
  use_cases: string[]
  signal: string
  artifact: string
}

export type Testimonial = {
  id: string
  name: string
  role: string
  company: string
  quote: string
  avatar_url: string
}

export type Feature = {
  title: string
  description: string
  metric: string
}
