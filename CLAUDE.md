@AGENTS.md

# Trivis Next — Project Guide

## What This Project Is

Trivis Next is a Next.js 16 app (App Router) with two AI-powered modes:

- **Quiz** — enter any topic → get 10 AI-generated MCQs → answer one at a time → score + review → generate more on the same topic.
- **Story** — enter a topic + genre → get an AI-generated branching short story → pick from 2 options to continue indefinitely.

All AI calls go through LangChain in Next.js `/api` route handlers. No database, no auth, no streaming. Model and API key are fixed via env vars.

`/mock` runs the full UI with hardcoded data and fake delays — no API key needed. Use it for UI development.

---

## Running the Project

```bash
npm install
cp .env.example .env.local   # fill in OPENROUTER_API_KEY
npm run dev                  # → http://localhost:3000
npm run build                # production build + type check
npm run lint                 # ESLint
```

---

## Environment Variables

| Variable             | Required | Default              | Description               |
| -------------------- | -------- | -------------------- | ------------------------- |
| `OPENROUTER_API_KEY` | Yes      | —                    | Key from openrouter.ai    |
| `OPENROUTER_MODEL`   | No       | `openai/gpt-4o-mini` | Any OpenRouter model slug |

Free models (`:free` suffix) may be rate-limited. To list all models:

```bash
curl https://openrouter.ai/api/v1/models \
  -H "Authorization: Bearer $OPENROUTER_API_KEY" -o models.json
```

---

## File Structure

```
src/
├── app/
│   ├── layout.tsx                  # Root layout — Geist font, ThemeProvider
│   ├── page.tsx                    # / — Quiz/Story tabs (live)
│   ├── globals.css                 # Tailwind + shadcn CSS variables
│   ├── mock/
│   │   └── page.tsx                # /mock — Quiz/Story tabs (hardcoded data)
│   └── api/
│       ├── quiz/
│       │   ├── route.ts            # POST /api/quiz
│       │   └── more/route.ts       # POST /api/quiz/more
│       └── story/
│           ├── route.ts            # POST /api/story
│           └── continue/route.ts   # POST /api/story/continue
├── components/
│   ├── quiz-mode.tsx               # Live quiz UI
│   ├── story-mode.tsx              # Live story UI
│   ├── mock-quiz-mode.tsx          # Mock quiz UI (no fetch)
│   ├── mock-story-mode.tsx         # Mock story UI (no fetch)
│   ├── providers.tsx               # ThemeProvider client wrapper
│   ├── theme-toggle.tsx            # Sun/Moon dark mode button
│   └── ui/                         # shadcn/ui primitives (do not edit)
├── lib/
│   ├── langchain.ts                # createModel() + invokeStructured()
│   ├── mock-data.ts                # Hardcoded quiz + story data
│   └── utils.ts                    # shadcn cn() helper
└── types/
    └── index.ts                    # Zod schemas + inferred TS types
```

---

## API Routes

### `POST /api/quiz`

**Body:** `{ topic: string }`
**Returns:** `QuizResponse` — `{ topic, questions[10] }`
Each question: `{ question, codeSnippet?, options[4], correctAnswerIndex: 0-3 }`

### `POST /api/quiz/more`

**Body:** `{ topic: string, existingQuestions: string[] }`
**Returns:** Same shape as `/api/quiz`. Avoids repeating questions in `existingQuestions`.

### `POST /api/story`

**Body:** `{ topic: string, genre: string }`
**Returns:** `StoryResponse` — `{ topic, genre, title, sections[], options: [string, string], context }`
`sections` is 3–6 items of `{ heading?, text }`. `context` is a 20–30 word summary used to continue the story efficiently.

### `POST /api/story/continue`

**Body:** `{ topic, genre, title, context, chosenOption: string, sectionCount: number }`
**Returns:** `StoryContinueResponse` — `{ sections[2], options: [string, string], context }`
Always returns exactly 2 new sections. The client appends them to the existing sections array.

All routes return `{ error: string }` with a 4xx/5xx status on failure.

---

## LangChain Architecture (`src/lib/langchain.ts`)

### `createModel()`

Returns a `ChatOpenAI` instance pointed at OpenRouter. Reads `OPENROUTER_API_KEY` and `OPENROUTER_MODEL` from env. Throws immediately if the key is missing.

### `invokeStructured<T>(schema: ZodType<T>, messages): Promise<T>`

Two-attempt wrapper used by every API route:

````
Attempt 1 — withStructuredOutput(schema)
  Uses LangChain's tool-calling / JSON mode.
  Works on: GPT-4o, Claude, Gemini, most paid models.
  On success: Zod-validates and returns.
  On failure (model doesn't support tool-calling): falls through.

Attempt 2 — plain invoke → text → JSON extraction
  Calls model.invoke(), gets raw text content.
  Tries to parse: ```json fences first, then first { } block in text.
  Zod-validates the parsed object.
  On failure: throws "Model returned an unexpected format."
````

Every API route follows this exact pattern — no exceptions:

```ts
const result = await invokeStructured(responseSchema, [
  new SystemMessage("..."),
  new HumanMessage("..."),
])
return NextResponse.json(result)
```

---

## Types (`src/types/index.ts`)

All Zod schemas and their inferred TypeScript types live here. Schemas serve double duty: runtime validation in `invokeStructured` and input validation in API routes.

| Export                                                  | Used for                                                                         |
| ------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `questionSchema` / `Question`                           | Individual MCQ                                                                   |
| `quizResponseSchema` / `QuizResponse`                   | `/api/quiz` response                                                             |
| `storySectionSchema` / `StorySection`                   | One story paragraph                                                              |
| `storyResponseSchema` / `StoryResponse`                 | `/api/story` response                                                            |
| `storyContinueResponseSchema` / `StoryContinueResponse` | `/api/story/continue` response                                                   |
| `GENRES`                                                | Genre dropdown options (Fantasy, Sci-Fi, Mystery, Romance, Thriller, Historical) |

---

## Component State Machines

### QuizMode (and MockQuizMode)

`phase: "input" | "quiz" | "results"`

```
input  →(generate)→  quiz  →(last answer)→  results
                       ↑                        │
                       └──────(more questions)──┘
                  (new quiz resets to input)
```

Key rules:

- Reset `selected` and `answered` **before** incrementing `currentIndex` in `handleNext()`. React batches these together — order matters to avoid a one-frame flash of old state.
- The question `<Card>` has `key={currentIndex}`. This forces a full Radix UI RadioGroup remount on each question, preventing the previous selection from persisting visually.
- `RadioGroup value` must always be a defined string (`""` when nothing selected, not `undefined`) to keep it a controlled component throughout its lifetime.

### StoryMode (and MockStoryMode)

`story: StoryState | null` (null = show input form)

```
null  →(generate)→  StoryState{ sections[2], options[2], context }
                         ↑
                         └──(choose option)── append 2 sections, update options+context
                    (new story resets to null)
```

`context` (20–30 words) is passed to `/api/story/continue` instead of full section text. Sections accumulate on the client; the server never sees prior sections.

---

## Theming

- `next-themes` with `attribute="class"`, `defaultTheme="dark"`
- `<html suppressHydrationWarning>` prevents SSR/client mismatch
- `ThemeToggle` in the header toggles Sun ↔ Moon
- shadcn CSS variables in `globals.css` handle all color switching via `.dark` class

---

## Mock Route (`/mock`)

Same layout and tabs as `/` but uses `MockQuizMode` and `MockStoryMode`. Mock components:

- Replace every `fetch()` with `await new Promise(r => setTimeout(r, 800-900))` for realistic latency
- Return data from `src/lib/mock-data.ts` (hardcoded JavaScript quiz + Harry Potter story)
- Are structurally identical to live components — UI changes should be made to both or abstracted

---

## How to Add a New Feature

**New API route:**

1. Add Zod schemas to `src/types/index.ts`
2. Create `src/app/api/<name>/route.ts`
3. Use `invokeStructured(schema, [SystemMessage(...), HumanMessage(...)])`
4. Wrap in try/catch; return `NextResponse.json({ error }, { status: 5xx })` on failure

**New UI mode:**

1. Create `src/components/<name>-mode.tsx` (live) and `src/components/mock-<name>-mode.tsx`
2. Add mock data to `src/lib/mock-data.ts`
3. Add a `TabsTrigger` + `TabsContent` in both `src/app/page.tsx` and `src/app/mock/page.tsx`

**Changing the model:**
Edit `OPENROUTER_MODEL` in `.env.local`. No code changes needed. `invokeStructured` handles both tool-calling models and plain-text models automatically.
