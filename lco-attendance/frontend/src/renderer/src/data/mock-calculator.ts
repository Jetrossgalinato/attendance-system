import { findMemberById, type Member } from "./mock-members"

export type BorrowType = "Borrow" | "Return"
export type BorrowStatus = "Out" | "Returned"

export const SCAN_COOLDOWN_MS = 1500

export type CalculatorRecord = {
  id: string
  memberId: string
  name: string
  college: string
  organization: string
  type: BorrowType
  scannedAt: string
  status: BorrowStatus
}

export type CalculatorSummary = {
  outNow: number
  borrowedToday: number
  returnedToday: number
  returnRate: number
}

export type GroupRank = {
  key: string
  label: string
  count: number
}

let scanSeq = 0

export function createBorrowId(): string {
  scanSeq += 1
  return `borrow-${Date.now()}-${scanSeq}`
}

export function formatBorrowTime(iso: string): string {
  const date = new Date(iso)
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })
}

function isSameLocalDay(iso: string, day: Date = new Date()): boolean {
  const date = new Date(iso)
  return (
    date.getFullYear() === day.getFullYear() &&
    date.getMonth() === day.getMonth() &&
    date.getDate() === day.getDate()
  )
}

/** Latest event per member determines whether they currently have a calculator out. */
export function getMembersOut(records: CalculatorRecord[]): Set<string> {
  const latest = new Map<string, CalculatorRecord>()
  for (const record of records) {
    const existing = latest.get(record.memberId)
    if (!existing) {
      latest.set(record.memberId, record)
      continue
    }
    if (new Date(record.scannedAt) > new Date(existing.scannedAt)) {
      latest.set(record.memberId, record)
    }
  }

  const out = new Set<string>()
  for (const [memberId, record] of latest) {
    if (record.type === "Borrow") out.add(memberId)
  }
  return out
}

export function recordFromMember(
  member: Member,
  type: BorrowType,
  scannedAt: Date = new Date()
): CalculatorRecord {
  return {
    id: createBorrowId(),
    memberId: member.id,
    name: member.name,
    college: member.college,
    organization: member.organization,
    type,
    scannedAt: scannedAt.toISOString(),
    status: type === "Borrow" ? "Out" : "Returned",
  }
}

export function summarizeCalculator(
  records: CalculatorRecord[]
): CalculatorSummary {
  const outNow = getMembersOut(records).size

  let borrowedToday = 0
  let returnedToday = 0
  for (const record of records) {
    if (!isSameLocalDay(record.scannedAt)) continue
    if (record.type === "Borrow") borrowedToday += 1
    else returnedToday += 1
  }

  const returnRate =
    borrowedToday === 0
      ? 0
      : Math.round((returnedToday / borrowedToday) * 100)

  return { outNow, borrowedToday, returnedToday, returnRate }
}

function rankByField(
  records: CalculatorRecord[],
  field: "college" | "organization",
  limit = 5
): GroupRank[] {
  const counts = new Map<string, number>()

  for (const record of records) {
    if (record.type !== "Borrow") continue
    const key = record[field]
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }

  return [...counts.entries()]
    .map(([label, count]) => ({ key: label, label, count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
    .slice(0, limit)
}

export function rankByCollege(
  records: CalculatorRecord[],
  limit = 5
): GroupRank[] {
  return rankByField(records, "college", limit)
}

export function rankByOrganization(
  records: CalculatorRecord[],
  limit = 5
): GroupRank[] {
  return rankByField(records, "organization", limit)
}

function seedTime(hour: number, minute: number, second = 0): string {
  const date = new Date()
  date.setHours(hour, minute, second, 0)
  return date.toISOString()
}

/** Preloaded session rows for presentation (newest first). */
export const SEED_CALCULATOR: CalculatorRecord[] = [
  {
    id: "seed-c8",
    memberId: "LCO-1008",
    name: "Hiro Tanaka",
    college: "DLSU Manila",
    organization: "Youth Fellowship",
    type: "Borrow",
    scannedAt: seedTime(10, 14, 22),
    status: "Out",
  },
  {
    id: "seed-c7",
    memberId: "LCO-1003",
    name: "Carla Mendoza",
    college: "DLSU Manila",
    organization: "Media Team",
    type: "Return",
    scannedAt: seedTime(10, 2, 8),
    status: "Returned",
  },
  {
    id: "seed-c6",
    memberId: "LCO-1001",
    name: "Ana Reyes",
    college: "UP Diliman",
    organization: "LCO Core",
    type: "Borrow",
    scannedAt: seedTime(9, 48, 41),
    status: "Out",
  },
  {
    id: "seed-c5",
    memberId: "LCO-1006",
    name: "Felix Ramos",
    college: "Mapúa University",
    organization: "Tech Crew",
    type: "Borrow",
    scannedAt: seedTime(9, 31, 15),
    status: "Out",
  },
  {
    id: "seed-c4",
    memberId: "LCO-1003",
    name: "Carla Mendoza",
    college: "DLSU Manila",
    organization: "Media Team",
    type: "Borrow",
    scannedAt: seedTime(9, 12, 3),
    status: "Out",
  },
  {
    id: "seed-c3",
    memberId: "LCO-1010",
    name: "Jonas Lim",
    college: "UST",
    organization: "Usher Corps",
    type: "Return",
    scannedAt: seedTime(8, 55, 47),
    status: "Returned",
  },
  {
    id: "seed-c2",
    memberId: "LCO-1007",
    name: "Gina Lopez",
    college: "Ateneo de Manila",
    organization: "LCO Core",
    type: "Borrow",
    scannedAt: seedTime(8, 41, 19),
    status: "Out",
  },
  {
    id: "seed-c1",
    memberId: "LCO-1010",
    name: "Jonas Lim",
    college: "UST",
    organization: "Usher Corps",
    type: "Borrow",
    scannedAt: seedTime(8, 22, 5),
    status: "Out",
  },
]

export type BorrowScanResult =
  | { ok: true; record: CalculatorRecord }
  | {
      ok: false
      reason: "empty" | "unknown" | "already_out" | "nothing_to_return"
      message: string
    }

export function tryRecordBorrowScan(
  rawId: string,
  existing: CalculatorRecord[],
  type: BorrowType
): BorrowScanResult {
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

  const outMembers = getMembersOut(existing)
  const isOut = outMembers.has(member.id)

  if (type === "Borrow" && isOut) {
    return {
      ok: false,
      reason: "already_out",
      message: `${member.name} already has a calculator out.`,
    }
  }

  if (type === "Return" && !isOut) {
    return {
      ok: false,
      reason: "nothing_to_return",
      message: `${member.name} has nothing to return.`,
    }
  }

  return { ok: true, record: recordFromMember(member, type) }
}
