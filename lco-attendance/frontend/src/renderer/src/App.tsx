import { useEffect, useState } from "react"
import { RefreshCw } from "lucide-react"

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
    <main className="mx-auto flex min-h-full max-w-2xl flex-col justify-center gap-8 px-6 py-12">
      <header className="space-y-2">
        <p className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
          Desktop scaffold
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground">
          LCO Attendance
        </h1>
        <p className="text-base text-muted-foreground">
          Electron frontend connected to the FastAPI backend.
        </p>
      </header>

      <section className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-medium">API health</h2>
          <Button
            variant="outline"
            size="sm"
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
          Endpoint: <code className="text-foreground">{getApiUrl()}/health</code>
        </p>

        {connection.status === "loading" && (
          <p className="text-sm text-muted-foreground">Checking connection…</p>
        )}

        {connection.status === "ok" && (
          <div className="space-y-1 text-sm">
            <p>
              Status:{" "}
              <span className="font-medium text-emerald-700">
                {connection.data.status}
              </span>
            </p>
            <p>
              Database:{" "}
              <span className="font-medium text-emerald-700">
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
  )
}
