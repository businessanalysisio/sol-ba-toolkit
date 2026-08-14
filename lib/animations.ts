export const reveal = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
}

export const stagger = {
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
}

export const springTransition = {
  type: "spring",
  stiffness: 110,
  damping: 18,
}

// ---- Variants ported from sol-website (used by SkillsBrowser,
// DecisionBriefBuilder, AuthForm, and the skills pages) ----
import type { Variants } from "framer-motion"

export const EASE = [0.21, 0.47, 0.32, 0.98] as const

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.08, ease: EASE },
  }),
}

export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
}

export const viewportOnce = { once: true, margin: "-80px" } as const
