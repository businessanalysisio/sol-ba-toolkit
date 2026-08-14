import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FrameworkGrid from "@/components/FrameworkGrid";
import { fetchFrameworks } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Framework Library",
  description:
    "40+ business analysis frameworks — SWOT, Porter's Five Forces, JTBD, and more — with steps and use cases.",
};

export default async function FrameworksPage() {
  const frameworks = await fetchFrameworks();

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-36">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-sol-300"
          >
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Link>
        </div>
        {/* Reuse the interactive grid; its own heading introduces the library */}
        <div className="-mt-16">
          <FrameworkGrid frameworks={frameworks} />
        </div>
      </main>
      <Footer />
    </>
  );
}
