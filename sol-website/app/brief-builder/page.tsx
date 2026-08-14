import type { Metadata } from "next";
import DecisionBriefBuilder from "@/components/DecisionBriefBuilder";

export const metadata: Metadata = {
  title: "Decision Brief Builder",
  description:
    "A Sol tool for turning messy business problems into structured BA decision briefs.",
};

export default function BriefBuilderPage() {
  return <DecisionBriefBuilder />;
}
