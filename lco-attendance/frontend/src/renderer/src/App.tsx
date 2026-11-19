import { useState } from "react"

import { AttendancePage } from "@/pages/attendance-page"
import { CalculatorPage } from "@/pages/calculator-page"

export type AppMode = "attendance" | "calculator"

export default function App() {
  const [appMode, setAppMode] = useState<AppMode>("attendance")

  function handleChangeMode() {
    setAppMode((current) =>
      current === "attendance" ? "calculator" : "attendance"
    )
  }

  if (appMode === "calculator") {
    return <CalculatorPage onChangeMode={handleChangeMode} />
  }

  return <AttendancePage onChangeMode={handleChangeMode} />
}
