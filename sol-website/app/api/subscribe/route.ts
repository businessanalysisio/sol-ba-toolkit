import { NextResponse } from "next/server";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let email: unknown;
  try {
    ({ email } = await request.json());
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (typeof email !== "string" || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address" },
      { status: 400 }
    );
  }

  const normalized = email.trim().toLowerCase();

  if (isSupabaseConfigured) {
    const supabase = getSupabase()!;
    const { error } = await supabase
      .from("subscribers")
      .upsert({ email: normalized }, { onConflict: "email" });
    if (error) {
      console.error("Supabase subscribe error:", error.message);
      return NextResponse.json(
        { error: "Could not save your subscription. Please try again." },
        { status: 500 }
      );
    }
  } else {
    // Demo mode: no database configured — log and accept.
    console.log(`[demo] newsletter signup: ${normalized}`);
  }

  return NextResponse.json({
    message: "You're in! Check your inbox for a welcome note.",
  });
}
