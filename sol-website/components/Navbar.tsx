"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from "framer-motion";
import { Menu, Sun, X } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/#features", label: "Features" },
  { href: "/#paths", label: "Learning Paths" },
  { href: "/skills", label: "Skills" },
  { href: "/#frameworks", label: "Frameworks" },
  { href: "/brief-builder", label: "Tool" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#faq", label: "FAQ" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress, scrollY } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 26,
    restDelta: 0.001,
  });

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24));

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Scroll progress indicator */}
      <motion.div
        style={{ scaleX: progress }}
        className="h-[2px] origin-left bg-gradient-to-r from-sol-300 via-sol-400 to-ember"
      />

      <div className="mx-auto mt-3 max-w-6xl px-4 sm:mt-4 sm:px-6">
        <nav
          className={cn(
            "flex items-center justify-between rounded-2xl px-4 py-3 transition-all duration-500 sm:px-5",
            scrolled ? "glass shadow-2xl shadow-black/40" : "border border-transparent"
          )}
          aria-label="Main navigation"
        >
          <Link href="/#top" className="group flex items-center gap-2.5">
            <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-sol-300 to-orange-500 shadow-[0_0_20px_-4px_rgba(251,191,36,0.8)] transition-shadow group-hover:shadow-[0_0_28px_-2px_rgba(251,191,36,0.9)]">
              <Sun className="h-4.5 w-4.5 h-[18px] w-[18px] text-night-950" strokeWidth={2.4} />
            </span>
            <span className="text-lg font-bold tracking-tight text-white">Sol</span>
          </Link>

          <ul className="hidden items-center gap-1 md:flex">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="rounded-full px-3.5 py-2 text-sm text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden items-center gap-2 md:flex">
            <Link
              href="/login"
              className="rounded-full px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:text-white"
            >
              Log in
            </Link>
            <Link
              href="/brief-builder"
              className="rounded-full bg-gradient-to-r from-sol-400 to-orange-500 px-4.5 px-[18px] py-2 text-sm font-semibold text-night-950 transition-all hover:brightness-110"
            >
              Open tool
            </Link>
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="rounded-lg p-2 text-zinc-300 hover:bg-white/5 md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>

        {/* Mobile menu */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="glass mt-2 overflow-hidden rounded-2xl p-2 shadow-2xl shadow-black/50 md:hidden"
            >
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-4 py-3 text-sm text-zinc-300 transition-colors hover:bg-white/5 hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-2 grid grid-cols-2 gap-2 border-t border-white/10 p-2 pt-3">
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="btn-ghost py-2.5 text-center"
                >
                  Log in
                </Link>
                <Link
                  href="/brief-builder"
                  onClick={() => setOpen(false)}
                  className="btn-primary py-2.5 text-center"
                >
                  Open tool
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
