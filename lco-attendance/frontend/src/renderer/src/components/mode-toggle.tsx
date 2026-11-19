import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  applyTheme,
  resolveTheme,
  toggleTheme,
  type Theme,
} from "@/lib/theme"

export function ModeToggle() {
  const [theme, setTheme] = useState<Theme>("light")

  useEffect(() => {
    const initial = resolveTheme()
    applyTheme(initial)
    setTheme(initial)
  }, [])

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="rounded-none border-border"
      aria-label={
        theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
      }
      onClick={() => setTheme((current) => toggleTheme(current))}
    >
      {theme === "dark" ? <Sun /> : <Moon />}
      <span className="sr-only">
        {theme === "dark" ? "Light mode" : "Dark mode"}
      </span>
    </Button>
  )
}
