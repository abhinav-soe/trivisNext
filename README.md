# Trivis Next — AI Quiz & Interactive Story Generator

Trivis Next is an LLM-powered web application that combines AI-generated quizzes with interactive, branching stories. Users can generate multiple-choice questions on a topic, review their scores, or explore stories that evolve based on their choices.

Built with Next.js, React, TypeScript, LangChain, and OpenRouter, the project demonstrates LLM integration, schema validation, API development, and interactive frontend state management.

## Features

### AI Quiz Generator
- Generate 10 multiple-choice questions on a chosen topic.
- Complete quizzes and review scores.
- Generate additional questions for continued practice.
- Validate generated responses using Zod schemas.

### Interactive Story Generator
- Generate stories from a user-provided premise.
- Continue a story by selecting from available choices.
- Use a compact narrative summary when continuing a story to reduce repeated context.

### LLM Integration
- Connect to language models through OpenRouter and LangChain.
- Use Zod schemas to define expected response structures.
- Attempt structured output first, with a plain-text JSON extraction fallback.
- Configure model access using environment variables.

### User Interface
- Responsive interface built with React and Tailwind CSS.
- UI components from shadcn/ui.
- Dark and light themes using `next-themes`.
- Mock mode for exploring the interface without live LLM requests.

## Tech Stack

- **Framework:** Next.js 16, React
- **Language:** TypeScript
- **LLM orchestration:** LangChain
- **Model provider:** OpenRouter
- **Validation:** Zod
- **Styling:** Tailwind CSS, shadcn/ui
- **Theme management:** next-themes

## How It Works

1. **User input:** The user enters a topic for a quiz or a premise for a story.
2. **API request:** The frontend sends the input to a Next.js API route.
3. **Model invocation:** LangChain invokes the configured chat model through OpenRouter.
4. **Response validation:** The application attempts structured output and uses a JSON extraction fallback when needed.
5. **Interactive rendering:** The frontend displays the generated quiz or story.
6. **Continuation:** Quiz users can request more questions, while story users can choose an option to generate the next part of the narrative.

Story continuation uses a compact summary of earlier narrative context instead of resending the full story. The application does not require a database for this workflow.

## API Routes

| Endpoint | Purpose |
|---|---|
| `/api/quiz` | Generate a quiz |
| `/api/quiz/more` | Generate additional questions |
| `/api/story` | Generate a story |
| `/api/story/continue` | Continue a story based on a choice |

The mock interface is available at `/mock`.

## Getting Started

### Prerequisites

- Node.js compatible with the project's dependencies
- npm
- An OpenRouter API key for live AI generation

### 1. Clone the repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd <YOUR_REPOSITORY_DIRECTORY>
```

Replace the placeholders with your repository URL and directory name.

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root, alongside `package.json`.

```env
OPENROUTER_API_KEY=your_openrouter_api_key
OPENROUTER_MODEL=your_supported_model_id
```

Replace these placeholders with your own OpenRouter API key and a supported model identifier.

**Security:** Never commit `.env.local` or expose API keys in your source code. Ensure `.env.local` is listed in `.gitignore`.

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Try mock mode

Visit [http://localhost:3000/mock](http://localhost:3000/mock) to explore the UI using mock data without making live model requests.

## Project Structure

The following is a simplified overview; confirm the exact folders against your repository.

```text
.
├── src/
│   ├── app/
│   │   └── api/
│   │       ├── quiz/
│   │       └── story/
│   ├── lib/
│   │   └── langchain.ts
│   └── types/
│       └── index.ts
├── public/
├── package.json
├── .gitignore
└── README.md
```

- `src/lib/langchain.ts` — configures the language model and response-generation logic.
- `src/types/index.ts` — defines shared types and Zod schemas.
- `src/app/api/` — contains the API handlers for quiz and story generation.
- `src/app/` — contains the application routes and UI.

## Troubleshooting

**Live generation fails:** Check that `.env.local` exists in the project root, that the API key is valid, and that the selected model is available through OpenRouter.

**Structured-output errors:** Different models may support different response formats. Check the server logs and confirm that generated responses satisfy the expected schemas.

**Application fails to start:** Verify your Node.js version and run `npm install` again if dependencies are missing.

## Potential Improvements

- Automated tests for API routes and response validation.
- More robust retries and malformed-response handling.
- Persistent quiz history and saved stories.
- Evaluation of output quality across multiple language models.
- Usage monitoring and improved error reporting.

## License and Attribution

Review the original repository's license and attribution requirements before redistributing or modifying the project. Add or retain the appropriate license information before publishing it as an open-source project.
