import { useState } from "react"

import { AlertProvider } from "@/components/alert-provider"
import type { AuthSession } from "@/data/mock-auth"
import { AdminDashboardPage } from "@/pages/admin-dashboard-page"
import { AttendancePage } from "@/pages/attendance-page"
import { CalculatorPage } from "@/pages/calculator-page"
import { LoginPage } from "@/pages/login-page"

export type AppView = "attendance" | "calculator" | "login" | "admin"

export default function App() {
  const [view, setView] = useState<AppView>("attendance")
  const [session, setSession] = useState<AuthSession | null>(null)
  const [returnView, setReturnView] = useState<"attendance" | "calculator">(
    "attendance"
  )

  function handleChangeMode() {
    setView((current) =>
      current === "attendance" ? "calculator" : "attendance"
    )
  }

  function handleLoginClick() {
    setReturnView(view === "calculator" ? "calculator" : "attendance")
    setView("login")
  }

  function handleLoginSuccess(nextSession: AuthSession) {
    setSession(nextSession)
    setView("admin")
  }

  function handleLoginBack() {
    setView(returnView)
  }

  function handleLogout() {
    setSession(null)
    setView("attendance")
  }

  let content = (
    <AttendancePage
      onChangeMode={handleChangeMode}
      onLoginClick={handleLoginClick}
    />
  )

  if (view === "calculator") {
    content = (
      <CalculatorPage
        onChangeMode={handleChangeMode}
        onLoginClick={handleLoginClick}
      />
    )
  } else if (view === "login") {
    content = (
      <LoginPage onSuccess={handleLoginSuccess} onBack={handleLoginBack} />
    )
  } else if (view === "admin") {
    if (!session) {
      content = (
        <LoginPage onSuccess={handleLoginSuccess} onBack={handleLoginBack} />
      )
    } else {
      content = (
        <AdminDashboardPage session={session} onLogout={handleLogout} />
      )
    }
  }

  return <AlertProvider>{content}</AlertProvider>
}
