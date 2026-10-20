"use client"

import { motion } from "motion/react"
import { useState } from "react"

import { BookOpen, BrainCircuit } from "@/components/icons"
import { QuizMode } from "@/components/quiz-mode"
import { StoryMode } from "@/components/story-mode"
import { ThemeToggle } from "@/components/theme-toggle"

type Mode = "quiz" | "story"

export function AppShell() {
  const [mode, setMode] = useState<Mode>("quiz")

  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-card flex h-14 items-center border-b px-4 sm:px-6">
        {/* Left — Logo */}
        <div className="flex flex-1 items-center gap-2.5">
          <span className="text-primary text-[17px] font-semibold tracking-tight">Trivis</span>
          <span className="text-muted-foreground hidden text-[11px] leading-none sm:block">
            AI quizzes &amp; stories
          </span>
        </div>

        {/* Center — Mode toggle */}
        <div role="group" aria-label="App mode">
          <div className="bg-muted inline-flex items-stretch gap-1 rounded-full p-1 shadow-xs">
            {(["quiz", "story"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                aria-pressed={mode === m}
                className={[
                  "relative z-10 flex cursor-pointer items-center gap-1.5 rounded-full px-4 py-1.5 text-[13px] font-semibold select-none",
                  "transition-colors duration-200",
                  mode === m
                    ? "text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                ].join(" ")}
              >
                {mode === m && (
                  <motion.div
                    layoutId="nav-tab-pill"
                    className="bg-primary absolute inset-0 rounded-full"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  {m === "quiz" ? (
                    <BrainCircuit className="size-[15px]" />
                  ) : (
                    <BookOpen className="size-[15px]" />
                  )}
                  {m === "quiz" ? "Quiz" : "Story"}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Right — Actions */}
        <div className="flex flex-1 items-center justify-end">
          <ThemeToggle />
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center px-4 py-10">
        <div className="w-full max-w-2xl">{mode === "quiz" ? <QuizMode /> : <StoryMode />}</div>
      </main>
    </div>
  )
}
