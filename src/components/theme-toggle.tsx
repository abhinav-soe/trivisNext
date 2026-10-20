"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

import { Moon, Sun } from "@/components/icons"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])
  if (!mounted) return <div className="size-9" />

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="transition-all"
    >
      {theme === "dark" ? (
        <Sun className="text-primary size-4" />
      ) : (
        <Moon className="text-primary size-4" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
