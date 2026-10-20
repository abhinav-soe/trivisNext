"use client"

import { motion } from "motion/react"
import { useEffect, useRef, useState } from "react"

import { AnimatedBars, BookOpen, RotateCcw, Sparkles } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { StoryContinueResponse, StoryResponse, StorySection } from "@/types"
import { GENRES } from "@/types"

const ENDING_THRESHOLD = 10

const SUGGESTIONS: { topic: string; genre: string }[] = [
  { topic: "Harry Potter", genre: "Fantasy" },
  { topic: "Mars Colony", genre: "Sci-Fi" },
  { topic: "Victorian London", genre: "Mystery" },
  { topic: "Viking Age", genre: "Historical" },
  { topic: "Deep Ocean", genre: "Thriller" },
  { topic: "Forbidden Love", genre: "Romance" },
  { topic: "Ancient Egypt", genre: "Mystery" },
  { topic: "Starship Crew", genre: "Sci-Fi" },
]

type StoryState = {
  topic: string
  genre: string
  title: string
  sections: StorySection[]
  options: [string, string]
  context: string
}

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`bg-muted animate-pulse rounded-lg ${className}`} />
}

function StorySkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-7 w-2/3" />
      </div>
      <div className="flex flex-col gap-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="bg-card flex flex-col gap-2.5 rounded-xl border p-5">
            <Skeleton className="h-3 w-1/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        ))}
      </div>
    </div>
  )
}

function ContinueSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {[0, 1].map((i) => (
        <div key={i} className="bg-card flex flex-col gap-2.5 rounded-xl border p-5">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      ))}
    </div>
  )
}

export function StoryMode() {
  const [topic, setTopic] = useState("")
  const [genre, setGenre] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [story, setStory] = useState<StoryState | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const animateFromRef = useRef(0)

  useEffect(() => {
    if (story) bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [story?.sections.length])

  // Keyboard shortcuts: press 1 or 2 to choose story path
  useEffect(() => {
    if (!story || loading || story.sections.length >= ENDING_THRESHOLD) return
    const options = story.options
    function onKey(e: KeyboardEvent) {
      if (e.key === "1") handleChoose(options[0])
      if (e.key === "2") handleChoose(options[1])
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [story?.options, loading])

  async function handleGenerate() {
    if (!topic.trim() || !genre) return
    setLoading(true)
    setError(null)
    animateFromRef.current = 0
    try {
      const res = await fetch("/api/story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: topic.trim(), genre }),
      })
      const data: StoryResponse = await res.json()
      if (!res.ok) throw new Error((data as { error?: string }).error ?? "Failed to generate story")
      setStory(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  async function handleChoose(chosenOption: string) {
    if (!story) return
    animateFromRef.current = story.sections.length
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/story/continue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: story.topic,
          genre: story.genre,
          title: story.title,
          context: story.context,
          chosenOption,
          sectionCount: story.sections.length,
        }),
      })
      const data: StoryContinueResponse = await res.json()
      if (!res.ok) throw new Error((data as { error?: string }).error ?? "Failed to continue story")
      setStory((prev) =>
        prev
          ? {
              ...prev,
              sections: [...prev.sections, ...data.sections],
              options: data.options,
              context: data.context,
            }
          : prev
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  function handleReset() {
    setStory(null)
    setTopic("")
    setGenre("")
    setError(null)
    animateFromRef.current = 0
  }

  if (!story) {
    if (loading) return <StorySkeleton />
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="story-topic" className="text-base font-semibold">
              Topic or Universe
            </Label>
            <Input
              id="story-topic"
              placeholder="e.g. Harry Potter, Ancient Rome, Space Exploration…"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !loading && topic.trim() && genre) handleGenerate()
              }}
              disabled={loading}
              className="h-10 text-base"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label className="text-base font-semibold">Genre</Label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {GENRES.map((g) => (
                <Button
                  key={g}
                  variant={genre === g ? "default" : "outline"}
                  size="sm"
                  onClick={() => setGenre(g)}
                  disabled={loading}
                  className="justify-center font-medium"
                >
                  {g}
                </Button>
              ))}
            </div>
          </div>
          <Button
            onClick={handleGenerate}
            disabled={loading || !topic.trim() || !genre}
            className="h-10 self-start px-5"
          >
            {loading ? (
              <AnimatedBars size={16} className="mr-2" />
            ) : (
              <BookOpen className="mr-2 size-4" />
            )}
            {loading ? "Writing…" : "Begin Story"}
          </Button>
        </div>

        <div className="flex flex-col gap-2.5">
          <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
            Quick start
          </p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((s, i) => {
              const active = topic === s.topic && genre === s.genre
              return (
                <motion.button
                  key={s.topic}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => {
                    setTopic(s.topic)
                    setGenre(s.genre)
                  }}
                  className={[
                    "bg-card cursor-pointer rounded-full border px-3.5 py-1.5 text-xs font-medium shadow-xs transition-colors duration-150",
                    active
                      ? "border-primary text-primary"
                      : "text-muted-foreground hover:border-primary/40 hover:text-foreground",
                  ].join(" ")}
                >
                  {s.topic}
                  <span className={active ? "text-primary/60" : "text-muted-foreground/60"}>
                    {" "}
                    · {s.genre}
                  </span>
                </motion.button>
              )
            })}
          </div>
        </div>

        {error && <p className="text-destructive text-sm">{error}</p>}
      </div>
    )
  }

  const isEnding = story.sections.length >= ENDING_THRESHOLD

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-primary/70 text-xs font-bold tracking-[0.12em] uppercase">
            {story.genre} · {story.topic}
          </p>
          <h2 className="mt-1 text-2xl font-bold">{story.title}</h2>
        </div>
        <Button variant="ghost" size="sm" onClick={handleReset} className="shrink-0">
          <RotateCcw className="mr-1.5 size-3.5" /> New Story
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        {story.sections.map((section, i) => {
          const isNew = i >= animateFromRef.current
          return (
            <motion.div
              key={i}
              initial={isNew ? { opacity: 0, y: 10 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={
                isNew
                  ? {
                      duration: 0.42,
                      delay: (i - animateFromRef.current) * 0.1,
                      ease: [0.22, 1, 0.36, 1],
                    }
                  : { duration: 0 }
              }
            >
              <Card className="shadow-sm">
                <CardContent className="flex flex-col gap-2.5 py-5">
                  {section.heading && (
                    <p className="text-primary text-xs font-bold tracking-[0.15em] uppercase">
                      {section.heading}
                    </p>
                  )}
                  <p className="text-foreground/90 font-serif text-base leading-[1.75]">
                    {section.text}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {error && <p className="text-destructive text-sm">{error}</p>}

      {loading && <ContinueSkeleton />}

      {!loading && !isEnding && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="text-primary size-4" />
            <p className="text-primary text-sm font-semibold">
              What happens next?{" "}
              <span className="text-muted-foreground ml-1 text-xs font-normal">press 1 or 2</span>
            </p>
          </div>
          <div className="flex flex-col gap-2.5">
            {story.options.map((opt, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <Button
                  variant="outline"
                  className="bg-card h-auto w-full justify-start gap-3 px-5 py-4 text-left whitespace-normal shadow-xs hover:shadow-md"
                  onClick={() => handleChoose(opt)}
                >
                  <span className="bg-primary text-primary-foreground flex size-7 shrink-0 items-center justify-center rounded-full text-sm font-bold">
                    {i + 1}
                  </span>
                  <span className="flex-1 text-sm leading-relaxed">{opt}</span>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {!loading && isEnding && (
        <div className="bg-card flex flex-col items-center gap-4 rounded-xl border py-10 text-center shadow-sm">
          <p className="text-primary font-serif text-2xl font-bold">~ The End ~</p>
          <p className="text-muted-foreground max-w-xs text-sm">
            Your story is complete. Start a new adventure whenever you&apos;re ready.
          </p>
          <Button onClick={handleReset} variant="default">
            <RotateCcw className="mr-2 size-4" /> New Story
          </Button>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  )
}
