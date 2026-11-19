import { findMemberById, type Member } from "./mock-members"

export type AttendanceStatus = "Present" | "Late"
export type AttendanceType = "Time In" | "Time Out"

export const SCAN_COOLDOWN_MS = 1500

export type AttendanceRecord = {
  id: string
  memberId: string
  name: string
  department: string
  type: AttendanceType
  scannedAt: string
  status: AttendanceStatus
}

export type AttendanceSummary = {
  present: number
  late: number
  total: number
  rate: number
}

export type AttendanceRank = {
  memberId: string
  name: string
  department: string
  count: number
}

/** Mock session cutoff: scans at/after 09:00 are Late. */
export const LATE_CUTOFF_HOUR = 9
export const LATE_CUTOFF_MINUTE = 0

let scanSeq = 0

export function createScanId(): string {
  scanSeq += 1
  return `scan-${Date.now()}-${scanSeq}`
}

export function getAttendanceStatus(scannedAt: Date = new Date()): AttendanceStatus {
  const minutes = scannedAt.getHours() * 60 + scannedAt.getMinutes()
  const cutoff = LATE_CUTOFF_HOUR * 60 + LATE_CUTOFF_MINUTE
  return minutes < cutoff ? "Present" : "Late"
}

export function formatScanTime(iso: string): string {
  const date = new Date(iso)
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })
}

export function recordFromMember(
  member: Member,
  type: AttendanceType,
  scannedAt: Date = new Date()
): AttendanceRecord {
  return {
    id: createScanId(),
    memberId: member.id,
    name: member.name,
    department: member.department,
    type,
    scannedAt: scannedAt.toISOString(),
    status: getAttendanceStatus(scannedAt),
  }
}

export function summarizeAttendance(
  records: AttendanceRecord[]
): AttendanceSummary {
  const uniqueMembers = new Map<string, AttendanceStatus>()
  for (const record of records) {
    if (!uniqueMembers.has(record.memberId)) {
      uniqueMembers.set(record.memberId, record.status)
    }
  }

  let present = 0
  let late = 0
  for (const status of uniqueMembers.values()) {
    if (status === "Present") present += 1
    else late += 1
  }

  const total = uniqueMembers.size
  const rate = total === 0 ? 0 : Math.round((present / total) * 100)

  return { present, late, total, rate }
}

export function rankAttendance(
  records: AttendanceRecord[],
  limit = 8
): AttendanceRank[] {
  const counts = new Map<
    string,
    { name: string; department: string; count: number }
  >()

  for (const record of records) {
    const existing = counts.get(record.memberId)
    if (existing) {
      existing.count += 1
    } else {
      counts.set(record.memberId, {
        name: record.name,
        department: record.department,
        count: 1,
      })
    }
  }

  return [...counts.entries()]
    .map(([memberId, value]) => ({
      memberId,
      name: value.name,
      department: value.department,
      count: value.count,
    }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
    .slice(0, limit)
}

function seedTime(hour: number, minute: number, second = 0): string {
  const date = new Date()
  date.setHours(hour, minute, second, 0)
  return date.toISOString()
}

/** Preloaded session rows for presentation (newest first). */
export const SEED_ATTENDANCE: AttendanceRecord[] = [
  {
    id: "seed-8",
    memberId: "LCO-1008",
    name: "Hiro Tanaka",
    department: "Youth",
    type: "Time In",
    scannedAt: seedTime(9, 12, 41),
    status: "Late",
  },
  {
    id: "seed-7",
    memberId: "LCO-1004",
    name: "Diego Cruz",
    department: "Ushering",
    type: "Time In",
    scannedAt: seedTime(9, 5, 18),
    status: "Late",
  },
  {
    id: "seed-6",
    memberId: "LCO-1012",
    name: "Lara Villanueva",
    department: "Tech",
    type: "Time Out",
    scannedAt: seedTime(8, 58, 3),
    status: "Present",
  },
  {
    id: "seed-5",
    memberId: "LCO-1001",
    name: "Ana Reyes",
    department: "Worship",
    type: "Time In",
    scannedAt: seedTime(8, 51, 27),
    status: "Present",
  },
  {
    id: "seed-4",
    memberId: "LCO-1006",
    name: "Felix Ramos",
    department: "Tech",
    type: "Time In",
    scannedAt: seedTime(8, 47, 9),
    status: "Present",
  },
  {
    id: "seed-3",
    memberId: "LCO-1003",
    name: "Carla Mendoza",
    department: "Media",
    type: "Time In",
    scannedAt: seedTime(8, 42, 55),
    status: "Present",
  },
  {
    id: "seed-2",
    memberId: "LCO-1010",
    name: "Jonas Lim",
    department: "Ushering",
    type: "Time Out",
    scannedAt: seedTime(8, 36, 14),
    status: "Present",
  },
  {
    id: "seed-1",
    memberId: "LCO-1005",
    name: "Elena Garcia",
    department: "Children",
    type: "Time In",
    scannedAt: seedTime(8, 29, 2),
    status: "Present",
  },
]

export type ScanResult =
  | { ok: true; record: AttendanceRecord }
  | { ok: false; reason: "empty" | "unknown" | "duplicate"; message: string }

export function tryRecordScan(
  rawId: string,
  existing: AttendanceRecord[],
  type: AttendanceType
): ScanResult {
  const trimmed = rawId.trim()
  if (!trimmed) {
    return { ok: false, reason: "empty", message: "Enter or scan a member ID." }
  }

  const member = findMemberById(trimmed)
  if (!member) {
    return {
      ok: false,
      reason: "unknown",
      message: `Unknown ID “${trimmed}”.`,
    }
  }

  const alreadyRecorded = existing.some(
    (record) =>
      record.memberId.toUpperCase() === member.id.toUpperCase() &&
      record.type === type
  )
  if (alreadyRecorded) {
    return {
      ok: false,
      reason: "duplicate",
      message: `${member.name} already has ${type} recorded.`,
    }
  }

  return { ok: true, record: recordFromMember(member, type) }
}
