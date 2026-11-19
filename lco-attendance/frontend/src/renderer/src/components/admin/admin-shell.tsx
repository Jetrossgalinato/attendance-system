import {
  useCallback,
  useEffect,
  useState,
  type ReactNode,
  type TransitionEvent,
} from "react"

import { AdminSidebar } from "@/components/admin/admin-sidebar"
import type { AuthSession } from "@/data/mock-auth"
import { cn } from "@/lib/utils"

const STORAGE_KEY = "lco-admin-sidebar-collapsed"
const EXPANDED_WIDTH = 260
const COLLAPSED_WIDTH = 72

type AdminShellProps = {
  session: AuthSession
  onLogout: () => void
  children: ReactNode
}

export function AdminShell({ session, onLogout, children }: AdminShellProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [railWidth, setRailWidth] = useState(EXPANDED_WIDTH)
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY)
      if (stored === "1") {
        setCollapsed(true)
        setRailWidth(COLLAPSED_WIDTH)
      }
    } catch {
      // Ignore storage errors.
    }
  }, [])

  const persist = useCallback((next: boolean) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0")
    } catch {
      // Ignore storage errors.
    }
  }, [])

  const handleToggle = useCallback(() => {
    if (animating) return

    setAnimating(true)

    if (collapsed) {
      // Expand: reserve space first (one reflow), then animate sidebar open.
      setRailWidth(EXPANDED_WIDTH)
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          setCollapsed(false)
          persist(false)
        })
      })
    } else {
      // Collapse: animate sidebar first; snap rail after transition ends.
      setCollapsed(true)
      persist(true)
    }
  }, [animating, collapsed, persist])

  const handleSidebarTransitionEnd = useCallback(
    (event: TransitionEvent<HTMLElement>) => {
      if (event.propertyName !== "width") return
      if (event.target !== event.currentTarget) return

      if (collapsed) {
        setRailWidth(COLLAPSED_WIDTH)
      }
      setAnimating(false)
    },
    [collapsed]
  )

  return (
    <div className="app-shell text-foreground">
      <div className="relative z-[1] flex min-h-dvh">
        <div
          aria-hidden
          className="shrink-0"
          style={{ width: railWidth }}
        />

        <AdminSidebar
          session={session}
          onLogout={onLogout}
          collapsed={collapsed}
          animating={animating}
          onToggle={handleToggle}
          onWidthTransitionEnd={handleSidebarTransitionEnd}
        />

        <div
          className={cn(
            "min-h-dvh min-w-0 flex-1 overflow-y-auto",
            animating && "admin-main-animating"
          )}
        >
          <div className="px-4 py-6 sm:px-6 md:px-8 md:py-8">{children}</div>
        </div>
      </div>
    </div>
  )
}
