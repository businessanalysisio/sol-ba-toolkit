import type { Metadata } from "next";
import DecisionBriefBuilder from "@/components/sol/DecisionBriefBuilder";

export const metadata: Metadata = {
  title: "Decision Brief Builder | Sol",
  description:
    "A Sol tool for turning messy business problems into structured BA decision briefs.",
};

export default function BriefBuilderPage() {
  return <DecisionBriefBuilder />;
}
