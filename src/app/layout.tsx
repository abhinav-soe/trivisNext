import "./globals.css"

import type { Metadata } from "next"
import { Geist_Mono, Lora, Plus_Jakarta_Sans } from "next/font/google"

import { Providers } from "@/components/providers"

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
})
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] })
const lora = Lora({ variable: "--font-lora", subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Trivis",
  description: "AI-powered quizzes and interactive stories",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${geistMono.variable} ${lora.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-background text-foreground min-h-screen antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
