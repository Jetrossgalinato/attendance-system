import type { ReactNode } from "react"

import { AdminSidebar } from "@/components/admin/admin-sidebar"
import type { AuthSession } from "@/data/mock-auth"

type AdminShellProps = {
  session: AuthSession
  onLogout: () => void
  children: ReactNode
}

export function AdminShell({ session, onLogout, children }: AdminShellProps) {
  return (
    <div className="app-shell text-foreground">
      <div className="relative z-[1] flex min-h-dvh gap-4 p-4 md:gap-5 md:p-5">
        <AdminSidebar session={session} onLogout={onLogout} />
        <div className="min-h-0 min-w-0 flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  )
}
