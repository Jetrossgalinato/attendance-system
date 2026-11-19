import type { TransitionEvent } from "react"
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

type AdminSidebarProps = {
  session: AuthSession
  onLogout: () => void
  collapsed: boolean
  animating: boolean
  onToggle: () => void
  onWidthTransitionEnd: (event: TransitionEvent<HTMLElement>) => void
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

export function AdminSidebar({
  session,
  onLogout,
  collapsed,
  animating,
  onToggle,
  onWidthTransitionEnd,
}: AdminSidebarProps) {
  const displayName = getDisplayName(session.email)
  const initials = getInitials(session.email)

  return (
    <aside
      className={cn(
        "admin-sidebar fixed inset-y-0 left-0 z-30 flex h-dvh flex-col overflow-hidden border-r border-border/80 bg-card shadow-[var(--shadow-2)]",
        "rounded-none rounded-r-2xl",
        collapsed ? "w-[72px]" : "w-[260px]"
      )}
      data-collapsed={collapsed ? "true" : "false"}
      data-animating={animating ? "true" : "false"}
      onTransitionEnd={onWidthTransitionEnd}
    >
      <div
        className={cn(
          "flex items-center border-b border-border/80 px-3 py-3",
          collapsed ? "justify-center" : "justify-between gap-2"
        )}
      >
        <div
          className={cn(
            "sidebar-copy min-w-0 overflow-hidden",
            collapsed && "sidebar-copy-hidden"
          )}
        >
          <p className="truncate text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase">
            LCO Admin
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 w-8 shrink-0 cursor-pointer rounded-full p-0"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          onClick={onToggle}
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
        <div
          className={cn(
            "sidebar-copy min-w-0 overflow-hidden",
            collapsed && "sidebar-copy-hidden"
          )}
        >
          <p className="truncate font-semibold tracking-tight">{displayName}</p>
          <p className="truncate text-xs text-muted-foreground">
            {session.email}
          </p>
        </div>
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
                "relative flex items-center overflow-hidden rounded-xl py-2.5 text-sm tracking-tight",
                collapsed ? "justify-center gap-0 px-2" : "gap-3 px-3",
                item.active &&
                  "bg-lime/20 font-bold text-foreground before:absolute before:inset-y-1.5 before:left-0 before:w-1 before:rounded-full before:bg-lime",
                !item.active &&
                  !item.disabled &&
                  "font-semibold text-foreground hover:bg-muted",
                item.disabled &&
                  "cursor-not-allowed font-semibold text-muted-foreground opacity-45"
              )}
            >
              <Icon
                className="size-4 shrink-0"
                strokeWidth={item.active ? 2.5 : 2.25}
              />
              <span
                className={cn(
                  "sidebar-copy truncate",
                  collapsed && "sidebar-copy-hidden"
                )}
              >
                {item.label}
              </span>
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
          <span
            className={cn(
              "sidebar-copy px-1 text-xs font-semibold tracking-[0.08em] text-muted-foreground uppercase",
              collapsed && "sidebar-copy-hidden"
            )}
          >
            Theme
          </span>
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
          <span
            className={cn("sidebar-copy", collapsed && "sidebar-copy-hidden")}
          >
            Logout
          </span>
        </Button>
      </div>
    </aside>
  )
}
