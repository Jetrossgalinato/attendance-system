import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import type { AuthSession } from "@/data/mock-auth"
import { cn } from "@/lib/utils"

type AdminDashboardPageProps = {
  session: AuthSession
  onLogout: () => void
}

const placeholderStats = [
  { label: "Members", value: "—" },
  { label: "Sessions", value: "—" },
  { label: "Borrows", value: "—" },
  { label: "Returns", value: "—" },
] as const

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
              Statistics overview — details coming soon.
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

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {placeholderStats.map((stat) => (
            <article
              key={stat.label}
              className={cn("surface-card surface-card-hover px-5 py-5")}
            >
              <p className="text-[11px] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
                {stat.label}
              </p>
              <p className="mt-2 text-3xl font-black tracking-[-0.04em] text-foreground">
                {stat.value}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">Coming soon</p>
            </article>
          ))}
        </section>

        <section className="surface-card px-5 py-6">
          <h2 className="text-lg font-bold tracking-[-0.03em]">
            Dashboard notes
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            This is a frontend scaffold. Detailed admin statistics and charts
            will be added later.
          </p>
        </section>
      </main>
    </div>
  )
}
