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
      <div className="relative z-[1] flex min-h-dvh">
        <AdminSidebar session={session} onLogout={onLogout} />
        <div className="min-h-dvh min-w-0 flex-1 overflow-y-auto">
          <div className="px-4 py-6 sm:px-6 md:px-8 md:py-8">{children}</div>
        </div>
      </div>
    </div>
  )
}
