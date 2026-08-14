import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:4510"),
  title: {
    default: "Sol — Your second brain for business analysis",
    template: "%s · Sol",
  },
  description:
    "Sol transforms scattered business knowledge into actionable insights. Structured learning paths, an interactive framework library, and AI-powered knowledge organization for founders, PMs, and business analysts.",
  openGraph: {
    title: "Sol — Your second brain for business analysis",
    description:
      "Transform scattered business knowledge into actionable insights with structured learning paths, interactive frameworks, and AI-powered organization.",
    type: "website",
    siteName: "Sol",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sol — Your second brain for business analysis",
    description:
      "Transform scattered business knowledge into actionable insights.",
  },
};

export const viewport: Viewport = {
  themeColor: "#06060a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans`}>{children}</body>
    </html>
  );
}
