import { useState, type FormEvent } from "react"

import { useAlert } from "@/components/alert-provider"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DEMO_EMAIL,
  DEMO_PASSWORD,
  tryLogin,
  type AuthSession,
} from "@/data/mock-auth"

type LoginPageProps = {
  onSuccess: (session: AuthSession) => void
  onBack: () => void
}

export function LoginPage({ onSuccess, onBack }: LoginPageProps) {
  const { showAlert } = useAlert()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const result = tryLogin(email, password)

    if (!result.ok) {
      showAlert({
        tone: "error",
        title: "Login failed",
        message: result.message,
      })
      return
    }

    showAlert({
      tone: "success",
      title: "Welcome back",
      message: `Signed in as ${result.session.email}`,
    })
    onSuccess(result.session)
  }

  return (
    <div className="app-shell text-foreground">
      <main className="relative z-[1] mx-auto flex min-h-full max-w-lg flex-col px-6 py-10 md:px-8">
        <div className="mb-8 flex items-center justify-between gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="cursor-pointer"
            onClick={onBack}
          >
            Back
          </Button>
          <ModeToggle />
        </div>

        <section className="surface-card surface-elevated mx-auto w-full px-6 py-8 sm:px-8">
          <p className="text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase">
            Admin access
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-[-0.05em]">
            Sign in
          </h1>
          <p className="font-serif mt-2 text-base text-foreground/80 italic">
            Enter your credentials to open the admin dashboard.
          </p>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <label className="block space-y-2">
              <span className="block text-[11px] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
                Email
              </span>
              <Input
                type="email"
                autoComplete="username"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder={DEMO_EMAIL}
              />
            </label>

            <label className="block space-y-2">
              <span className="block text-[11px] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
                Password
              </span>
              <Input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
              />
            </label>

            <Button type="submit" className="mt-2 w-full cursor-pointer">
              Sign in
            </Button>
          </form>

          <p className="mt-5 text-xs text-muted-foreground">
            Demo hint:{" "}
            <span className="font-mono text-foreground">
              {DEMO_EMAIL} / {DEMO_PASSWORD}
            </span>
            . Any non-empty email and password will work for this mock.
          </p>
        </section>
      </main>
    </div>
  )
}
