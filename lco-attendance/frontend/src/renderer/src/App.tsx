import { useEffect, useState } from "react"
import { RefreshCw } from "lucide-react"

import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { fetchHealth, getApiUrl, type HealthResponse } from "@/lib/api"

type ConnectionState =
  | { status: "loading" }
  | { status: "ok"; data: HealthResponse }
  | { status: "error"; message: string }

export default function App() {
  const [connection, setConnection] = useState<ConnectionState>({
    status: "loading",
  })

  async function checkHealth() {
    setConnection({ status: "loading" })
    try {
      const data = await fetchHealth()
      setConnection({ status: "ok", data })
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to reach the API"
      setConnection({ status: "error", message })
    }
  }

  useEffect(() => {
    void checkHealth()
  }, [])

  return (
    <div className="relative min-h-full bg-background text-foreground">
      <div className="absolute top-4 right-4 z-10">
        <ModeToggle />
      </div>

      <main className="mx-auto flex min-h-full max-w-3xl flex-col justify-center gap-10 px-8 py-14">
        <header className="space-y-4">
          <p className="text-xs font-semibold tracking-[0.12em] text-foreground uppercase">
            Desktop scaffold
          </p>
          <h1 className="text-5xl leading-[0.92] font-black tracking-[-0.05em] text-foreground md:text-6xl">
            LCO Attendance
          </h1>
          <p className="font-serif max-w-xl text-xl leading-snug text-foreground italic">
            Electron frontend connected to the FastAPI backend.
          </p>
        </header>

        <section className="space-y-5 border border-border bg-card p-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-bold tracking-[-0.03em]">API health</h2>
            <Button
              variant="outline"
              size="sm"
              className="rounded-none border-border"
              onClick={() => void checkHealth()}
              disabled={connection.status === "loading"}
            >
              <RefreshCw
                className={
                  connection.status === "loading" ? "animate-spin" : undefined
                }
              />
              Refresh
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">
            Endpoint:{" "}
            <code className="text-foreground">{getApiUrl()}/health</code>
          </p>

          {connection.status === "loading" && (
            <p className="text-sm text-muted-foreground">Checking connection…</p>
          )}

          {connection.status === "ok" && (
            <div className="space-y-1 text-sm">
              <p>
                Status:{" "}
                <span className="font-semibold text-deep-lime">
                  {connection.data.status}
                </span>
              </p>
              <p>
                Database:{" "}
                <span className="font-semibold text-deep-lime">
                  {connection.data.database}
                </span>
              </p>
            </div>
          )}

          {connection.status === "error" && (
            <p className="text-sm text-destructive">{connection.message}</p>
          )}
        </section>
      </main>
    </div>
  )
}
