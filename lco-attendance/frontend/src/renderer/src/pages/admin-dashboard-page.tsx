import {
  AttendanceStatusChart,
  BorrowsByCollegeChart,
  TopOrganizationsChart,
  WeeklyAttendanceChart,
} from "@/components/admin/admin-charts"
import { AdminActivityTable } from "@/components/admin/admin-activity-table"
import { AdminKpiCards } from "@/components/admin/admin-kpi-cards"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import {
  ADMIN_KPIS,
  ATTENDANCE_STATUS,
  BORROWS_BY_COLLEGE,
  RECENT_ACTIVITY,
  TOP_ORGANIZATIONS,
  WEEKLY_ATTENDANCE,
} from "@/data/mock-admin"
import type { AuthSession } from "@/data/mock-auth"

type AdminDashboardPageProps = {
  session: AuthSession
  onLogout: () => void
}

export function AdminDashboardPage({
  session,
  onLogout,
}: AdminDashboardPageProps) {
  return (
    <div className="app-shell text-foreground">
      <main className="relative z-[1] mx-auto flex min-h-full max-w-7xl flex-col gap-8 px-6 py-10 md:px-8">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 space-y-2.5">
            <p className="text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase">
              Admin · Signed in
            </p>
            <h1 className="text-4xl font-black tracking-[-0.05em] text-foreground md:text-5xl">
              Admin Dashboard
            </h1>
            <p className="font-serif max-w-2xl text-lg text-foreground/80 italic">
              Live overview from this session’s mock data.
            </p>
            <p className="text-sm text-muted-foreground">
              Signed in as{" "}
              <span className="font-semibold text-foreground">
                {session.email}
              </span>
            </p>
          </div>

          <div className="header-actions-bar flex shrink-0 items-center gap-1.5">
            <ModeToggle />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="cursor-pointer border-transparent bg-transparent shadow-none hover:bg-muted/80"
              onClick={onLogout}
            >
              Logout
            </Button>
          </div>
        </header>

        <AdminKpiCards kpis={ADMIN_KPIS} />

        <div className="grid items-stretch gap-6 lg:grid-cols-2">
          <WeeklyAttendanceChart data={WEEKLY_ATTENDANCE} />
          <BorrowsByCollegeChart data={BORROWS_BY_COLLEGE} />
        </div>

        <div className="grid items-stretch gap-6 lg:grid-cols-2">
          <AttendanceStatusChart data={ATTENDANCE_STATUS} />
          <TopOrganizationsChart data={TOP_ORGANIZATIONS} />
        </div>

        <AdminActivityTable rows={RECENT_ACTIVITY} />
      </main>
    </div>
  )
}
