export type SubscriptionTier = "free" | "pro";

export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
  subscription_tier: SubscriptionTier;
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  order: number;
  level: "Foundation" | "Intermediate" | "Advanced";
  duration: string;
  accent: string;
  modules: Module[];
}

export interface Module {
  id: string;
  path_id: string;
  title: string;
  content: string;
  order: number;
}

export interface UserProgress {
  id: string;
  user_id: string;
  module_id: string;
  completed_at: string | null;
  score: number | null;
}

export interface Framework {
  id: string;
  name: string;
  category: "Strategy" | "Requirements" | "Customer" | "Process";
  description: string;
  use_cases: string[];
  best_for: string;
  steps: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  quote: string;
  avatar_url: string;
}
