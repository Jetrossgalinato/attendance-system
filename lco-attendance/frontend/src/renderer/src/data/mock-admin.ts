export type AdminKpi = {
  key: "members" | "sessions" | "borrows" | "returns"
  label: string
  value: number
  delta: string
}

export type WeeklyAttendancePoint = {
  day: string
  present: number
  late: number
}

export type NamedCount = {
  name: string
  count: number
}

export type StatusSlice = {
  name: string
  value: number
  fill: string
}

export type AdminActivityKind = "Attendance" | "Borrow"

export type AdminActivityRow = {
  id: string
  time: string
  actor: string
  kind: AdminActivityKind
  detail: string
  status: string
}

export const ADMIN_KPIS: AdminKpi[] = [
  { key: "members", label: "Members", value: 148, delta: "+6% vs last week" },
  { key: "sessions", label: "Sessions", value: 12, delta: "+2 this month" },
  { key: "borrows", label: "Borrows", value: 86, delta: "+14% vs last week" },
  { key: "returns", label: "Returns", value: 71, delta: "83% return rate" },
]

export const WEEKLY_ATTENDANCE: WeeklyAttendancePoint[] = [
  { day: "Mon", present: 42, late: 8 },
  { day: "Tue", present: 48, late: 6 },
  { day: "Wed", present: 45, late: 9 },
  { day: "Thu", present: 51, late: 5 },
  { day: "Fri", present: 39, late: 11 },
  { day: "Sat", present: 28, late: 4 },
  { day: "Sun", present: 22, late: 3 },
]

export const BORROWS_BY_COLLEGE: NamedCount[] = [
  { name: "CCIS", count: 24 },
  { name: "COFES", count: 18 },
  { name: "CED", count: 16 },
  { name: "CMNS", count: 15 },
  { name: "CEGS", count: 13 },
]

export const ATTENDANCE_STATUS: StatusSlice[] = [
  { name: "Present", value: 275, fill: "#dce87a" },
  { name: "Late", value: 46, fill: "#ef9a9a" },
]

export const TOP_ORGANIZATIONS: NamedCount[] = [
  { name: "LCO Core", count: 22 },
  { name: "Youth Fellowship", count: 18 },
  { name: "Media Team", count: 15 },
  { name: "Tech Crew", count: 14 },
  { name: "Usher Corps", count: 11 },
]

export const RECENT_ACTIVITY: AdminActivityRow[] = [
  {
    id: "act-1",
    time: "11:42 AM",
    actor: "Nina Ortega",
    kind: "Borrow",
    detail: "Calculator · CMNS",
    status: "Out",
  },
  {
    id: "act-2",
    time: "11:28 AM",
    actor: "Kai Domingo",
    kind: "Borrow",
    detail: "Calculator · CCIS",
    status: "Out",
  },
  {
    id: "act-3",
    time: "11:15 AM",
    actor: "Elena Garcia",
    kind: "Borrow",
    detail: "Return · CEGS",
    status: "Returned",
  },
  {
    id: "act-4",
    time: "10:51 AM",
    actor: "Hiro Tanaka",
    kind: "Attendance",
    detail: "Time In",
    status: "Late",
  },
  {
    id: "act-5",
    time: "10:38 AM",
    actor: "Marco Dela Cruz",
    kind: "Borrow",
    detail: "Calculator · CED",
    status: "Out",
  },
  {
    id: "act-6",
    time: "10:14 AM",
    actor: "Diego Cruz",
    kind: "Attendance",
    detail: "Time In",
    status: "Late",
  },
  {
    id: "act-7",
    time: "09:48 AM",
    actor: "Ana Reyes",
    kind: "Attendance",
    detail: "Time In",
    status: "Present",
  },
  {
    id: "act-8",
    time: "09:31 AM",
    actor: "Felix Ramos",
    kind: "Borrow",
    detail: "Calculator · CCIS",
    status: "Out",
  },
  {
    id: "act-9",
    time: "09:12 AM",
    actor: "Carla Mendoza",
    kind: "Attendance",
    detail: "Time In",
    status: "Present",
  },
  {
    id: "act-10",
    time: "08:55 AM",
    actor: "Jonas Lim",
    kind: "Borrow",
    detail: "Return · CEGS",
    status: "Returned",
  },
  {
    id: "act-11",
    time: "08:41 AM",
    actor: "Gina Lopez",
    kind: "Attendance",
    detail: "Time In",
    status: "Present",
  },
  {
    id: "act-12",
    time: "08:22 AM",
    actor: "Lara Villanueva",
    kind: "Attendance",
    detail: "Time Out",
    status: "Present",
  },
]
