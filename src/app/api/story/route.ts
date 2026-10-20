import { HumanMessage, SystemMessage } from "@langchain/core/messages"
import { NextResponse } from "next/server"
import { z } from "zod"

import { invokeStructured } from "@/lib/langchain"
import { storyResponseSchema } from "@/types"

const requestSchema = z.object({
  topic: z.string().min(1).max(200),
  genre: z.string().min(1),
})

function buildSystemPrompt(topic: string, genre: string): string {
  return `You are a creative writing assistant specialized in crafting ${genre} short stories set in the world of ${topic}.

Produce a single valid JSON object with this exact schema:
{
  "topic": "${topic}",
  "genre": "${genre}",
  "title": "<A catchy, evocative story title>",
  "sections": [
    { "heading": "<Optional section heading>", "text": "<~100–150 words of prose>" },
    … 3–6 total …
  ],
  "options": [
    "<Option A: a clear, distinct next-step idea>",
    "<Option B: a second, contrasting next-step idea>"
  ],
  "context": "<20–30 word summary capturing title + core beats>"
}

TONE & STYLE:
• Consistent tense (past) and POV (third person).
• Honor the ${genre} genre's pacing and emotional stakes.
• Each section reads like a standalone mini-scene (~5–8 sentences).

OUTPUT RULES:
1. options must offer two compelling, divergent paths.
2. context is a concise (20–30 word) capsule of title + all sections.`
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = requestSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 })
    }

    const { topic, genre } = parsed.data

    const result = await invokeStructured(storyResponseSchema, [
      new SystemMessage(buildSystemPrompt(topic, genre)),
      new HumanMessage(`Write the opening of a ${genre} story about: ${topic}`),
    ])

    return NextResponse.json(result)
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to generate story"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
