import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { frameworks, learningPaths, testimonials } from "./data";
import type { Framework, LearningPath, Testimonial } from "./types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  if (!client) client = createClient(supabaseUrl!, supabaseAnonKey!);
  return client;
}

/**
 * Data hooks fall back to the bundled mock data when Supabase isn't
 * configured, so the site is fully browsable with zero setup.
 */
export async function fetchLearningPaths(): Promise<LearningPath[]> {
  const supabase = getSupabase();
  if (supabase) {
    const { data, error } = await supabase
      .from("learning_paths")
      .select("*, modules(*)")
      .order("order", { ascending: true });
    if (!error && data && data.length > 0) return data as LearningPath[];
  }
  return learningPaths;
}

export async function fetchFrameworks(): Promise<Framework[]> {
  const supabase = getSupabase();
  if (supabase) {
    const { data, error } = await supabase
      .from("frameworks")
      .select("*")
      .order("name", { ascending: true });
    if (!error && data && data.length > 0) return data as Framework[];
  }
  return frameworks;
}

export async function fetchTestimonials(): Promise<Testimonial[]> {
  const supabase = getSupabase();
  if (supabase) {
    const { data, error } = await supabase.from("testimonials").select("*");
    if (!error && data && data.length > 0) return data as Testimonial[];
  }
  return testimonials;
}
