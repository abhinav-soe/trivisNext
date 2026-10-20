import { HumanMessage, SystemMessage } from "@langchain/core/messages"
import { NextResponse } from "next/server"
import { z } from "zod"

import { invokeStructured } from "@/lib/langchain"
import { storyContinueResponseSchema } from "@/types"

const requestSchema = z.object({
  topic: z.string().min(1),
  genre: z.string().min(1),
  title: z.string().min(1),
  context: z.string().min(1),
  chosenOption: z.string().min(1),
  sectionCount: z.number().int().min(0),
})

function buildSystemPrompt(
  topic: string,
  genre: string,
  title: string,
  context: string,
  chosenOption: string,
  sectionCount: number
): string {
  return `You are continuing a ${genre} short story titled "${title}" set in ${topic}.
Append exactly two new sections that follow this plot seed:

  > "${chosenOption}"

Use only this context (do not reprint prior sections):
"${context}"

Return only a valid JSON object with these keys:
{
  "sections": [
    { "heading": "Section ${sectionCount + 1} heading", "text": "100–150 words" },
    { "heading": "Section ${sectionCount + 2} heading", "text": "100–150 words" }
  ],
  "options": [
    "<Next idea 1: clear branching prompt>",
    "<Next idea 2: another clear branch>"
  ],
  "context": "<Updated 20–30 word summary of full story so far>"
}

OUTPUT RULES:
1. Do not duplicate or paraphrase earlier sections.
2. Keep context concise yet comprehensive enough to ground these new sections.
3. Maintain consistent tone, POV, and genre conventions.`
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = requestSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 })
    }

    const { topic, genre, title, context, chosenOption, sectionCount } = parsed.data

    const result = await invokeStructured(storyContinueResponseSchema, [
      new SystemMessage(
        buildSystemPrompt(topic, genre, title, context, chosenOption, sectionCount)
      ),
      new HumanMessage(`Continue the story with: ${chosenOption}`),
    ])

    return NextResponse.json(result)
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to continue story"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
