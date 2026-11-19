import { useCallback, useMemo, useState } from "react"

import { AttendanceRanking } from "@/components/attendance/attendance-ranking"
import { AttendanceSummaryCards } from "@/components/attendance/attendance-summary"
import { AttendanceTable } from "@/components/attendance/attendance-table"
import { IdScanInput } from "@/components/attendance/id-scan-input"
import { QrScanner } from "@/components/attendance/qr-scanner"
import { ModeToggle } from "@/components/mode-toggle"
import {
  rankAttendance,
  SEED_ATTENDANCE,
  summarizeAttendance,
  tryRecordScan,
  type AttendanceRecord,
} from "@/data/mock-attendance"

export function AttendancePage() {
  const [records, setRecords] = useState<AttendanceRecord[]>(SEED_ATTENDANCE)
  const [scanValue, setScanValue] = useState("")
  const [message, setMessage] = useState<string | null>(null)
  const [messageTone, setMessageTone] = useState<"error" | "success" | null>(
    null
  )
  const [qrOpen, setQrOpen] = useState(false)

  const summary = useMemo(() => summarizeAttendance(records), [records])
  const ranks = useMemo(() => rankAttendance(records), [records])

  const handleScan = useCallback((rawId: string) => {
    setRecords((current) => {
      const result = tryRecordScan(rawId, current)
      if (!result.ok) {
        setMessage(result.message)
        setMessageTone("error")
        return current
      }

      setMessage(`Recorded ${result.record.name}`)
      setMessageTone("success")
      setScanValue("")
      setQrOpen(false)
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
            Scan member IDs or QR codes to record today’s attendance.
          </p>
        </header>

        <AttendanceSummaryCards summary={summary} />

        <IdScanInput
          value={scanValue}
          message={message}
          messageTone={messageTone}
          onChange={setScanValue}
          onSubmitId={handleScan}
          onOpenQr={() => {
            setMessage(null)
            setMessageTone(null)
            setQrOpen(true)
          }}
        />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
          <AttendanceTable records={records} />
          <AttendanceRanking ranks={ranks} />
        </div>
      </main>

      <QrScanner
        open={qrOpen}
        onClose={() => setQrOpen(false)}
        onScan={handleScan}
      />
    </div>
  )
}
