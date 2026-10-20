import type { BaseMessageLike } from "@langchain/core/messages"
import { ChatOpenAI } from "@langchain/openai"
import type { z } from "zod"

export function createModel() {
  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) throw new Error("OPENROUTER_API_KEY is not set")

  return new ChatOpenAI({
    model: process.env.OPENROUTER_MODEL ?? "openai/gpt-4o-mini",
    apiKey,
    temperature: 0.7,
    configuration: {
      baseURL: "https://openrouter.ai/api/v1",
      defaultHeaders: {
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "Trivis",
      },
    },
  })
}

function extractJson(text: string): unknown {
  // Try fenced code block first: ```json ... ``` or ``` ... ```
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (fenced) return JSON.parse(fenced[1].trim())

  // Fall back to first { ... } or [ ... ] in the text
  const start = text.search(/[{[]/)
  if (start !== -1) {
    const end = Math.max(text.lastIndexOf("}"), text.lastIndexOf("]"))
    if (end > start) return JSON.parse(text.slice(start, end + 1))
  }

  throw new Error("No JSON found in model response")
}

export async function invokeStructured<T>(
  schema: z.ZodType<T>,
  messages: BaseMessageLike[]
): Promise<T> {
  const model = createModel()

  // Attempt 1: withStructuredOutput (tool-calling / JSON mode)
  try {
    const result = await model.withStructuredOutput(schema).invoke(messages)
    const validated = schema.safeParse(result)
    if (validated.success) return validated.data
  } catch (err) {
    // model doesn't support tool-calling — fall through
  }

  // Attempt 2: plain text invoke + JSON extraction
  const response = await model.invoke(messages)
  const text =
    typeof response.content === "string" ? response.content : JSON.stringify(response.content)

  const parsed = schema.safeParse(extractJson(text))
  if (parsed.success) return parsed.data

  throw new Error("Model returned an unexpected format. Try a different model.")
}
