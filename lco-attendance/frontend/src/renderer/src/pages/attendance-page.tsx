import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import { AttendanceRanking } from "@/components/attendance/attendance-ranking"
import { AttendanceSummaryCards } from "@/components/attendance/attendance-summary"
import { AttendanceTable } from "@/components/attendance/attendance-table"
import { IdScanInput } from "@/components/attendance/id-scan-input"
import { QrScanner } from "@/components/attendance/qr-scanner"
import { ModeToggle } from "@/components/mode-toggle"
import {
  rankAttendance,
  SCAN_COOLDOWN_MS,
  SEED_ATTENDANCE,
  summarizeAttendance,
  tryRecordScan,
  type AttendanceRecord,
  type AttendanceType,
} from "@/data/mock-attendance"

export function AttendancePage() {
  const [records, setRecords] = useState<AttendanceRecord[]>(SEED_ATTENDANCE)
  const [scanType, setScanType] = useState<AttendanceType>("Time In")
  const [scanValue, setScanValue] = useState("")
  const [message, setMessage] = useState<string | null>(null)
  const [messageTone, setMessageTone] = useState<"error" | "success" | null>(
    null
  )
  const [cooldownUntil, setCooldownUntil] = useState(0)
  const [now, setNow] = useState(() => Date.now())

  const scanTypeRef = useRef(scanType)
  const cooldownUntilRef = useRef(cooldownUntil)

  useEffect(() => {
    scanTypeRef.current = scanType
  }, [scanType])

  useEffect(() => {
    cooldownUntilRef.current = cooldownUntil
  }, [cooldownUntil])

  useEffect(() => {
    if (cooldownUntil <= Date.now()) return
    const id = window.setInterval(() => setNow(Date.now()), 200)
    return () => window.clearInterval(id)
  }, [cooldownUntil])

  const coolingDown = now < cooldownUntil

  const summary = useMemo(() => summarizeAttendance(records), [records])
  const ranks = useMemo(() => rankAttendance(records), [records])

  const handleScan = useCallback((rawId: string) => {
    if (Date.now() < cooldownUntilRef.current) {
      return
    }

    setRecords((current) => {
      const result = tryRecordScan(rawId, current, scanTypeRef.current)
      if (!result.ok) {
        setMessage(result.message)
        setMessageTone("error")
        return current
      }

      setMessage(`Recorded ${result.record.name} · ${result.record.type}`)
      setMessageTone("success")
      setScanValue("")
      setCooldownUntil(Date.now() + SCAN_COOLDOWN_MS)
      setNow(Date.now())
      return [result.record, ...current]
    })
  }, [])

  const sessionLabel = useMemo(() => {
    return new Date().toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }, [])

  return (
    <div className="relative min-h-full bg-background text-foreground">
      <div className="absolute top-4 right-4 z-10">
        <ModeToggle />
      </div>

      <main className="mx-auto flex min-h-full max-w-7xl flex-col gap-6 px-6 py-8 pr-20 md:px-8">
        <header className="space-y-2">
          <p className="text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase">
            Session · {sessionLabel} · Live
          </p>
          <h1 className="text-4xl font-black tracking-[-0.05em] text-foreground md:text-5xl">
            LCO Attendance
          </h1>
          <p className="font-serif max-w-2xl text-lg text-foreground/80 italic">
            QR camera stays on — choose Time In or Time Out, then scan or type an
            ID.
          </p>
        </header>

        <AttendanceSummaryCards summary={summary} />

        <section className="grid h-auto overflow-hidden border border-border bg-card md:h-[280px] md:grid-cols-[minmax(280px,380px)_minmax(0,1fr)]">
          <QrScanner
            paused={coolingDown}
            onScan={handleScan}
            className="h-[240px] border-b border-border md:h-full md:border-r md:border-b-0"
          />
          <IdScanInput
            value={scanValue}
            scanType={scanType}
            message={message}
            messageTone={messageTone}
            coolingDown={coolingDown}
            onChange={setScanValue}
            onScanTypeChange={setScanType}
            onSubmitId={handleScan}
          />
        </section>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
          <AttendanceTable records={records} />
          <AttendanceRanking ranks={ranks} />
        </div>
      </main>
    </div>
  )
}
