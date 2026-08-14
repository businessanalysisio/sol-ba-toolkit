import { createClient } from "@supabase/supabase-js"
import { frameworks, learningPaths, testimonials } from "./mock-data"
import type { Framework, LearningPath, Testimonial } from "./types"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl as string, supabaseAnonKey as string)
  : null

export async function getLearningPaths(): Promise<LearningPath[]> {
  if (!supabase) return learningPaths

  const { data, error } = await supabase
    .from("learning_paths")
    .select("id,title,description,order,modules,audience,duration,level,progress")
    .order("order")

  return error || !data?.length ? learningPaths : (data as LearningPath[])
}

export async function getFrameworks(): Promise<Framework[]> {
  if (!supabase) return frameworks

  const { data, error } = await supabase
    .from("frameworks")
    .select("id,name,category,description,use_cases,signal,artifact")
    .order("name")

  return error || !data?.length ? frameworks : (data as Framework[])
}

export async function getTestimonials(): Promise<Testimonial[]> {
  if (!supabase) return testimonials

  const { data, error } = await supabase
    .from("testimonials")
    .select("id,name,role,company,quote,avatar_url")
    .limit(6)

  return error || !data?.length ? testimonials : (data as Testimonial[])
}
