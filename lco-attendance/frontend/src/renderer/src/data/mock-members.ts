export type Member = {
  id: string
  name: string
  department: string
}

export const MOCK_MEMBERS: Member[] = [
  { id: "LCO-1001", name: "Ana Reyes", department: "Worship" },
  { id: "LCO-1002", name: "Ben Santos", department: "Youth" },
  { id: "LCO-1003", name: "Carla Mendoza", department: "Media" },
  { id: "LCO-1004", name: "Diego Cruz", department: "Ushering" },
  { id: "LCO-1005", name: "Elena Garcia", department: "Children" },
  { id: "LCO-1006", name: "Felix Ramos", department: "Tech" },
  { id: "LCO-1007", name: "Gina Lopez", department: "Worship" },
  { id: "LCO-1008", name: "Hiro Tanaka", department: "Youth" },
  { id: "LCO-1009", name: "Isabel Navarro", department: "Media" },
  { id: "LCO-1010", name: "Jonas Lim", department: "Ushering" },
  { id: "LCO-1011", name: "Kai Domingo", department: "Children" },
  { id: "LCO-1012", name: "Lara Villanueva", department: "Tech" },
  { id: "LCO-1013", name: "Marco Dela Cruz", department: "Worship" },
  { id: "LCO-1014", name: "Nina Ortega", department: "Youth" },
]

const membersById = new Map(
  MOCK_MEMBERS.map((member) => [member.id.toUpperCase(), member])
)

export function findMemberById(rawId: string): Member | undefined {
  const normalized = rawId.trim().toUpperCase()
  if (!normalized) return undefined
  return membersById.get(normalized)
}
