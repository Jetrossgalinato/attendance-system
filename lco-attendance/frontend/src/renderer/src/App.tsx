import { useState } from "react"

import { AdminShell } from "@/components/admin/admin-shell"
import { AlertProvider } from "@/components/alert-provider"
import type { AuthSession } from "@/data/mock-auth"
import { AdminAttendanceMonitoringPage } from "@/pages/admin-attendance-monitoring-page"
import { AdminBorrowingMonitoringPage } from "@/pages/admin-borrowing-monitoring-page"
import { AdminDashboardPage } from "@/pages/admin-dashboard-page"
import { AttendancePage } from "@/pages/attendance-page"
import { CalculatorPage } from "@/pages/calculator-page"
import { LoginPage } from "@/pages/login-page"
import type { AdminPage } from "@/types/admin"

export type AppView = "attendance" | "calculator" | "login" | "admin"

export default function App() {
  const [view, setView] = useState<AppView>("attendance")
  const [session, setSession] = useState<AuthSession | null>(null)
  const [adminPage, setAdminPage] = useState<AdminPage>("dashboard")
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
    setAdminPage("dashboard")
    setView("admin")
  }

  function handleLoginBack() {
    setView(returnView)
  }

  function handleLogout() {
    setSession(null)
    setAdminPage("dashboard")
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
      let adminContent = <AdminDashboardPage />
      if (adminPage === "attendance") {
        adminContent = <AdminAttendanceMonitoringPage />
      } else if (adminPage === "borrowing") {
        adminContent = <AdminBorrowingMonitoringPage />
      }

      content = (
        <AdminShell
          session={session}
          activePage={adminPage}
          onNavigate={setAdminPage}
          onLogout={handleLogout}
        >
          {adminContent}
        </AdminShell>
      )
    }
  }

  return <AlertProvider>{content}</AlertProvider>
}
