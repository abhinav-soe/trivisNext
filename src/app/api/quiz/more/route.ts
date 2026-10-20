import { HumanMessage, SystemMessage } from "@langchain/core/messages"
import { NextResponse } from "next/server"
import { z } from "zod"

import { invokeStructured } from "@/lib/langchain"
import { quizResponseSchema } from "@/types"

const requestSchema = z.object({
  topic: z.string().min(1).max(200),
  existingQuestions: z.array(z.string()),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = requestSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 })
    }

    const { topic, existingQuestions } = parsed.data

    const systemPrompt = `You are a quiz generator. Generate exactly 10 NEW multiple-choice questions about the topic: "${topic}".

Rules:
- Each question must have exactly 4 distinct answer options.
- correctAnswerIndex must be an integer 0–3.
- Do NOT repeat any of these existing questions:
${existingQuestions.map((q, i) => `${i + 1}. ${q}`).join("\n")}`

    const result = await invokeStructured(quizResponseSchema, [
      new SystemMessage(systemPrompt),
      new HumanMessage(`Generate 10 new questions about: ${topic}`),
    ])

    return NextResponse.json(result)
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to generate more questions"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
