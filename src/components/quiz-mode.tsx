"use client"

import { AnimatePresence, motion } from "motion/react"
import { useEffect, useState } from "react"

import { AnimatedBars, CheckCircle, RotateCcw, Trophy, XCircle } from "@/components/icons"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import type { Question, QuizResponse } from "@/types"

type Phase = "input" | "quiz" | "results"

const SUGGESTIONS = [
  "JavaScript Closures",
  "World War II",
  "Photosynthesis",
  "Ancient Rome",
  "Machine Learning",
  "The Solar System",
  "Shakespeare",
  "Climate Science",
  "Human Psychology",
  "The Cold War",
]

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`bg-muted animate-pulse rounded-lg ${className}`} />
}

function useCountUp(target: number, duration = 900): number {
  const [count, setCount] = useState(0)
  useEffect(() => {
    setCount(0)
    if (target === 0) return
    let frame = 0
    const totalFrames = Math.round(duration / 16)
    const timer = setInterval(() => {
      frame++
      setCount(Math.round(target * Math.min(frame / totalFrames, 1)))
      if (frame >= totalFrames) clearInterval(timer)
    }, 16)
    return () => clearInterval(timer)
  }, [target, duration])
  return count
}

function Confetti() {
  const colors = [
    "bg-primary",
    "bg-yellow-400",
    "bg-green-400",
    "bg-pink-400",
    "bg-cyan-400",
    "bg-orange-400",
  ]
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {Array.from({ length: 22 }).map((_, i) => (
        <motion.span
          key={i}
          className={`absolute h-2 w-2 rounded-sm ${colors[i % colors.length]}`}
          style={{ left: `${(i * 43 + 7) % 100}%`, top: 0 }}
          initial={{ y: -8, rotate: 0, opacity: 1 }}
          animate={{ y: 90, rotate: 540, opacity: 0 }}
          transition={{ duration: 0.7 + (i % 6) * 0.12, delay: i * 0.045, ease: "easeIn" }}
        />
      ))}
    </div>
  )
}

export function QuizMode() {
  const [topic, setTopic] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [quiz, setQuiz] = useState<QuizResponse | null>(null)
  const [phase, setPhase] = useState<Phase>("input")

  const [currentIndex, setCurrentIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([])
  const [loadingMore, setLoadingMore] = useState(false)

  // computed outside conditionals so hooks are called unconditionally
  const resultsScore =
    phase === "results" && quiz
      ? userAnswers.filter((ans, i) => ans === quiz.questions[i].correctAnswerIndex).length
      : 0
  const resultsPct =
    phase === "results" && quiz ? Math.round((resultsScore / quiz.questions.length) * 100) : 0
  const displayPct = useCountUp(resultsPct)

  async function handleGenerate() {
    if (!topic.trim()) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: topic.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Failed to generate quiz")
      setQuiz(data)
      setCurrentIndex(0)
      setSelected(null)
      setAnswered(false)
      setUserAnswers([])
      setPhase("quiz")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  function handleSelect(value: string) {
    if (answered) return
    const idx = parseInt(value, 10)
    setSelected(idx)
    setAnswered(true)
  }

  function handleNext() {
    if (!quiz || selected === null) return
    const newAnswers = [...userAnswers, selected]
    setUserAnswers(newAnswers)
    if (currentIndex < quiz.questions.length - 1) {
      setSelected(null)
      setAnswered(false)
      setCurrentIndex((i) => i + 1)
    } else {
      setPhase("results")
    }
  }

  function handleReset() {
    setPhase("input")
    setTopic("")
    setQuiz(null)
    setCurrentIndex(0)
    setSelected(null)
    setAnswered(false)
    setUserAnswers([])
    setError(null)
  }

  async function handleMoreQuestions() {
    if (!quiz) return
    setLoadingMore(true)
    setError(null)
    try {
      const res = await fetch("/api/quiz/more", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: quiz.topic,
          existingQuestions: quiz.questions.map((q) => q.question),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Failed to generate more questions")
      setQuiz(data)
      setCurrentIndex(0)
      setSelected(null)
      setAnswered(false)
      setUserAnswers([])
      setPhase("quiz")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoadingMore(false)
    }
  }

  if (phase === "input") {
    if (loading) {
      return (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-10" />
          </div>
          <Skeleton className="h-2.5 w-full rounded-full" />
          <div className="bg-card flex flex-col gap-5 rounded-xl border p-6 shadow-sm">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-5 w-4/5" />
            <div className="mt-1 flex flex-col gap-3">
              {[0, 1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-14 w-full rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      )
    }
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <div>
            <Label htmlFor="quiz-topic" className="text-base font-semibold">
              Topic
            </Label>
            <p className="text-muted-foreground mt-0.5 text-sm">
              Enter any subject and get 10 AI-generated questions
            </p>
          </div>
          <div className="flex gap-2">
            <Input
              id="quiz-topic"
              placeholder="e.g. JavaScript Closures, World War II…"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !loading && handleGenerate()}
              disabled={loading}
              className="h-10 text-base"
            />
            <Button
              onClick={handleGenerate}
              disabled={loading || !topic.trim()}
              className="h-10 px-5"
            >
              {loading ? <AnimatedBars size={16} /> : "Generate"}
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
            Popular topics
          </p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((s, i) => (
              <motion.button
                key={s}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setTopic(s)}
                className={[
                  "bg-card cursor-pointer rounded-full border px-3.5 py-1.5 text-xs font-medium shadow-xs transition-colors duration-150",
                  topic === s
                    ? "border-primary text-primary"
                    : "text-muted-foreground hover:border-primary/40 hover:text-foreground",
                ].join(" ")}
              >
                {s}
              </motion.button>
            ))}
          </div>
        </div>

        {error && <p className="text-destructive text-sm">{error}</p>}
      </div>
    )
  }

  if (phase === "quiz" && quiz) {
    const q: Question = quiz.questions[currentIndex]
    const progress = (currentIndex / quiz.questions.length) * 100
    const letters = ["A", "B", "C", "D"]

    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <span className="text-primary text-sm font-semibold">{quiz.topic}</span>
          <span
            className="text-muted-foreground text-sm tabular-nums"
            aria-label={`Question ${currentIndex + 1} of ${quiz.questions.length}`}
          >
            {currentIndex + 1} / {quiz.questions.length}
          </span>
        </div>
        <Progress value={progress} className="h-2.5" />

        <div aria-live="polite" aria-atomic="true" className="sr-only">
          {answered &&
            selected !== null &&
            (selected === q.correctAnswerIndex
              ? `Correct! The answer is: ${q.options[q.correctAnswerIndex]}`
              : `Incorrect. The correct answer is: ${q.options[q.correctAnswerIndex]}`)}
        </div>

        <AnimatePresence initial={false} mode="popLayout">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -18 }}
            transition={{ type: "spring", stiffness: 400, damping: 35 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg leading-relaxed font-semibold">
                  {q.question}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                {q.codeSnippet && (
                  <pre className="bg-muted border-border/50 overflow-x-auto rounded-xl border p-4 font-mono text-sm whitespace-pre-wrap">
                    {q.codeSnippet}
                  </pre>
                )}
                <RadioGroup
                  value={selected !== null ? String(selected) : ""}
                  onValueChange={handleSelect}
                  className="flex flex-col gap-2.5"
                >
                  {q.options.map((opt, i) => {
                    const isCorrect = i === q.correctAnswerIndex
                    const isSelected = i === selected
                    let optionClass =
                      "flex items-center gap-3 rounded-xl border bg-card px-4 min-h-14 cursor-pointer transition-colors duration-200"
                    if (answered) {
                      if (isCorrect) optionClass += " border-green-500 bg-green-500/10 shadow-sm"
                      else if (isSelected && !isCorrect)
                        optionClass += " border-destructive bg-destructive/10 shadow-sm"
                      else optionClass += " opacity-40"
                    } else {
                      optionClass += " shadow-xs hover:shadow-sm hover:bg-primary/5"
                    }
                    const letterClass =
                      answered && isCorrect
                        ? "bg-green-500 text-white"
                        : answered && isSelected && !isCorrect
                          ? "bg-destructive text-white"
                          : "bg-primary text-primary-foreground"
                    return (
                      <motion.div
                        key={i}
                        whileHover={!answered ? { y: -2 } : {}}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      >
                        <Label className={optionClass}>
                          <RadioGroupItem
                            value={String(i)}
                            disabled={answered}
                            className="sr-only"
                          />
                          <span
                            className={`flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors duration-200 ${letterClass}`}
                          >
                            {letters[i]}
                          </span>
                          <span className="flex-1 py-3 text-sm leading-relaxed">{opt}</span>
                          {answered && isCorrect && (
                            <CheckCircle className="size-4 shrink-0 text-green-500" />
                          )}
                          {answered && isSelected && !isCorrect && (
                            <XCircle className="text-destructive size-4 shrink-0" />
                          )}
                        </Label>
                      </motion.div>
                    )
                  })}
                </RadioGroup>

                {answered && (
                  <Button onClick={handleNext} className="mt-1 w-full self-end sm:w-auto" size="sm">
                    {currentIndex < quiz.questions.length - 1 ? "Next →" : "See Results"}
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    )
  }

  if (phase === "results" && quiz) {
    const isHigh = resultsPct >= 70

    return (
      <div className="flex flex-col gap-6">
        <Card className="relative overflow-hidden shadow-md">
          {isHigh && <Confetti />}
          <CardContent className="flex flex-col items-center gap-4 py-10">
            <motion.div
              initial={{ scale: 0.5, rotate: -8, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 14 }}
            >
              <Trophy className="size-14 text-yellow-400" />
            </motion.div>
            <motion.p
              className="text-5xl font-extrabold tabular-nums"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.2 }}
            >
              {displayPct}%
            </motion.p>
            <p className="text-muted-foreground text-sm">
              {resultsScore} of {quiz.questions.length} correct
            </p>
            <Badge variant={isHigh ? "default" : "destructive"} className="px-3 py-1 text-sm">
              {resultsPct >= 90
                ? "Excellent"
                : resultsPct >= 70
                  ? "Good"
                  : resultsPct >= 50
                    ? "Keep Practicing"
                    : "Try Again"}
            </Badge>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-3">
          <p className="text-muted-foreground text-sm font-semibold tracking-wider uppercase">
            Review
          </p>
          {quiz.questions.map((q, i) => {
            const correct = userAnswers[i] === q.correctAnswerIndex
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
              >
                <Card
                  className={`border-l-4 ${correct ? "border-l-green-500" : "border-l-destructive"}`}
                >
                  <CardContent className="flex flex-col gap-2 py-4">
                    <div className="flex items-start gap-2">
                      {correct ? (
                        <CheckCircle className="mt-0.5 size-4 shrink-0 text-green-500" />
                      ) : (
                        <XCircle className="text-destructive mt-0.5 size-4 shrink-0" />
                      )}
                      <p className="text-sm leading-relaxed">{q.question}</p>
                    </div>
                    {!correct && (
                      <p className="text-muted-foreground pl-6 text-xs">
                        Correct:{" "}
                        <span className="text-foreground font-medium">
                          {q.options[q.correctAnswerIndex]}
                        </span>
                      </p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {error && <p className="text-destructive text-sm">{error}</p>}

        <div className="flex flex-wrap gap-2">
          <Button onClick={handleMoreQuestions} disabled={loadingMore}>
            {loadingMore ? <AnimatedBars size={16} className="mr-2" /> : null}
            {loadingMore ? "Generating…" : "More Questions"}
          </Button>
          <Button variant="outline" onClick={handleReset} disabled={loadingMore}>
            <RotateCcw className="mr-2 size-4" /> New Topic
          </Button>
        </div>
      </div>
    )
  }

  return null
}
