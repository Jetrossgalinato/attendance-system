import { useEffect, useState } from "react"
import {
  Calculator,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  LayoutDashboard,
  LogOut,
} from "lucide-react"

import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import {
  getDisplayName,
  getInitials,
  type AuthSession,
} from "@/data/mock-auth"
import { cn } from "@/lib/utils"

const STORAGE_KEY = "lco-admin-sidebar-collapsed"

type AdminSidebarProps = {
  session: AuthSession
  onLogout: () => void
}

type NavItem = {
  id: string
  label: string
  icon: typeof LayoutDashboard
  active?: boolean
  disabled?: boolean
}

const NAV_ITEMS: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    active: true,
  },
  {
    id: "attendance",
    label: "Attendance Monitoring",
    icon: ClipboardCheck,
    disabled: true,
  },
  {
    id: "borrowing",
    label: "Borrowing Monitoring",
    icon: Calculator,
    disabled: true,
  },
]

export function AdminSidebar({ session, onLogout }: AdminSidebarProps) {
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY)
      if (stored === "1") setCollapsed(true)
    } catch {
      // Ignore storage errors in restricted environments.
    }
  }, [])

  function toggleCollapsed() {
    setCollapsed((current) => {
      const next = !current
      try {
        window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0")
      } catch {
        // Ignore storage errors.
      }
      return next
    })
  }

  const displayName = getDisplayName(session.email)
  const initials = getInitials(session.email)

  return (
    <aside
      className={cn(
        "surface-card surface-elevated flex h-full shrink-0 flex-col overflow-hidden transition-[width] duration-300 ease-out",
        collapsed ? "w-[72px]" : "w-[260px]"
      )}
    >
      <div
        className={cn(
          "flex items-center border-b border-border/80 px-3 py-3",
          collapsed ? "justify-center" : "justify-between gap-2"
        )}
      >
        {!collapsed ? (
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase">
              LCO Admin
            </p>
          </div>
        ) : null}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 w-8 shrink-0 cursor-pointer rounded-full p-0"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          onClick={toggleCollapsed}
        >
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </Button>
      </div>

      <div
        className={cn(
          "flex items-center gap-3 border-b border-border/80 px-3 py-4",
          collapsed && "justify-center px-2"
        )}
      >
        <div
          className="surface-chip flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-lime/40 text-sm font-black text-[#181a17]"
          aria-hidden
        >
          {initials}
        </div>
        {!collapsed ? (
          <div className="min-w-0">
            <p className="truncate font-semibold tracking-tight">{displayName}</p>
            <p className="truncate text-xs text-muted-foreground">
              {session.email}
            </p>
          </div>
        ) : null}
      </div>

      <nav className="flex flex-1 flex-col gap-1.5 p-2.5" aria-label="Admin">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              type="button"
              disabled={item.disabled}
              title={item.disabled ? "Coming soon" : item.label}
              aria-current={item.active ? "page" : undefined}
              aria-disabled={item.disabled || undefined}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold tracking-tight transition-colors",
                collapsed && "justify-center px-2",
                item.active &&
                  "bg-lime/40 text-[#181a17] shadow-[var(--shadow-1)]",
                !item.active &&
                  !item.disabled &&
                  "text-foreground hover:bg-muted",
                item.disabled &&
                  "cursor-not-allowed text-muted-foreground opacity-45"
              )}
            >
              <Icon className="size-4 shrink-0" strokeWidth={2.25} />
              {!collapsed ? <span className="truncate">{item.label}</span> : null}
            </button>
          )
        })}
      </nav>

      <div
        className={cn(
          "mt-auto flex flex-col gap-2 border-t border-border/80 p-2.5",
          collapsed && "items-center"
        )}
      >
        <div
          className={cn(
            "flex",
            collapsed ? "justify-center" : "items-center justify-between gap-2"
          )}
        >
          {!collapsed ? (
            <span className="px-1 text-xs font-semibold tracking-[0.08em] text-muted-foreground uppercase">
              Theme
            </span>
          ) : null}
          <ModeToggle />
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className={cn(
            "cursor-pointer",
            collapsed ? "h-9 w-9 rounded-full p-0" : "w-full justify-start"
          )}
          aria-label="Logout"
          title="Logout"
          onClick={onLogout}
        >
          <LogOut />
          {!collapsed ? "Logout" : null}
        </Button>
      </div>
    </aside>
  )
}
