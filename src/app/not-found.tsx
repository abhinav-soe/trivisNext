"use client"

import { motion } from "motion/react"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <motion.p
        className="text-primary text-8xl font-extrabold tabular-nums"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        404
      </motion.p>
      <motion.div
        className="flex flex-col gap-2"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      >
        <h1 className="text-2xl font-bold">Page not found</h1>
        <p className="text-muted-foreground max-w-xs text-sm">
          This page doesn&apos;t exist. Head back and start a quiz or story.
        </p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.97 }}
      >
        <Link
          href="/"
          className="bg-primary text-primary-foreground inline-flex h-10 items-center justify-center rounded-lg px-5 text-sm font-medium shadow-xs hover:shadow-sm"
        >
          Go home
        </Link>
      </motion.div>
    </div>
  )
}
