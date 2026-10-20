import { z } from "zod"

// ── Quiz ──────────────────────────────────────────────────────────────────────

export const questionSchema = z.object({
  question: z.string(),
  codeSnippet: z.string(),
  options: z.array(z.string()).length(4),
  correctAnswerIndex: z.number().int().min(0).max(3),
})

export const quizResponseSchema = z.object({
  topic: z.string(),
  questions: z.array(questionSchema),
})

export type Question = z.infer<typeof questionSchema>
export type QuizResponse = z.infer<typeof quizResponseSchema>

// ── Story ─────────────────────────────────────────────────────────────────────

export const storySectionSchema = z.object({
  heading: z.string().optional(),
  text: z.string(),
})

export const storyResponseSchema = z.object({
  topic: z.string(),
  genre: z.string(),
  title: z.string(),
  sections: z.array(storySectionSchema),
  options: z.tuple([z.string(), z.string()]),
  context: z.string(),
})

export const storyContinueResponseSchema = z.object({
  sections: z.array(storySectionSchema),
  options: z.tuple([z.string(), z.string()]),
  context: z.string(),
})

export type StorySection = z.infer<typeof storySectionSchema>
export type StoryResponse = z.infer<typeof storyResponseSchema>
export type StoryContinueResponse = z.infer<typeof storyContinueResponseSchema>

export const GENRES = [
  "Fantasy",
  "Science Fiction",
  "Mystery",
  "Romance",
  "Thriller",
  "Historical",
] as const
