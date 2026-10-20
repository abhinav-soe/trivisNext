import { HumanMessage, SystemMessage } from "@langchain/core/messages"
import { NextResponse } from "next/server"
import { z } from "zod"

import { invokeStructured } from "@/lib/langchain"
import { quizResponseSchema } from "@/types"

const requestSchema = z.object({
  topic: z.string().min(1).max(200),
})

const SYSTEM_PROMPT = `You are a quiz generator. When given a topic, generate exactly 10 multiple-choice questions about it.

Guidelines:
- Correct any spelling mistakes in the topic and capitalize the first letter of each word, but do not change the topic itself.
- Each question must have exactly 4 distinct answer options.
- correctAnswerIndex must be an integer 0–3 indicating the correct option.
- Include a codeSnippet (plain string, no backticks or markdown) only when it genuinely helps the question.
- Cover diverse aspects of the topic across the 10 questions.
- There must be exactly one correct answer per question.`

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = requestSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 })
    }

    const result = await invokeStructured(quizResponseSchema, [
      new SystemMessage(SYSTEM_PROMPT),
      new HumanMessage(`Generate a quiz about: ${parsed.data.topic}`),
    ])

    return NextResponse.json(result)
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to generate quiz"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
