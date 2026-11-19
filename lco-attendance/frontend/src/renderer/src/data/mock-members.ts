export type Member = {
  id: string
  name: string
  department: string
  college: string
  organization: string
}

export const MOCK_MEMBERS: Member[] = [
  {
    id: "LCO-1001",
    name: "Ana Reyes",
    department: "Worship",
    college: "UP Diliman",
    organization: "LCO Core",
  },
  {
    id: "LCO-1002",
    name: "Ben Santos",
    department: "Youth",
    college: "Ateneo de Manila",
    organization: "Youth Fellowship",
  },
  {
    id: "LCO-1003",
    name: "Carla Mendoza",
    department: "Media",
    college: "DLSU Manila",
    organization: "Media Team",
  },
  {
    id: "LCO-1004",
    name: "Diego Cruz",
    department: "Ushering",
    college: "UP Diliman",
    organization: "Usher Corps",
  },
  {
    id: "LCO-1005",
    name: "Elena Garcia",
    department: "Children",
    college: "UST",
    organization: "Children Ministry",
  },
  {
    id: "LCO-1006",
    name: "Felix Ramos",
    department: "Tech",
    college: "Mapúa University",
    organization: "Tech Crew",
  },
  {
    id: "LCO-1007",
    name: "Gina Lopez",
    department: "Worship",
    college: "Ateneo de Manila",
    organization: "LCO Core",
  },
  {
    id: "LCO-1008",
    name: "Hiro Tanaka",
    department: "Youth",
    college: "DLSU Manila",
    organization: "Youth Fellowship",
  },
  {
    id: "LCO-1009",
    name: "Isabel Navarro",
    department: "Media",
    college: "UP Diliman",
    organization: "Media Team",
  },
  {
    id: "LCO-1010",
    name: "Jonas Lim",
    department: "Ushering",
    college: "UST",
    organization: "Usher Corps",
  },
  {
    id: "LCO-1011",
    name: "Kai Domingo",
    department: "Children",
    college: "Ateneo de Manila",
    organization: "Children Ministry",
  },
  {
    id: "LCO-1012",
    name: "Lara Villanueva",
    department: "Tech",
    college: "Mapúa University",
    organization: "Tech Crew",
  },
  {
    id: "LCO-1013",
    name: "Marco Dela Cruz",
    department: "Worship",
    college: "UST",
    organization: "LCO Core",
  },
  {
    id: "LCO-1014",
    name: "Nina Ortega",
    department: "Youth",
    college: "DLSU Manila",
    organization: "Youth Fellowship",
  },
]

const membersById = new Map(
  MOCK_MEMBERS.map((member) => [member.id.toUpperCase(), member])
)

export function findMemberById(rawId: string): Member | undefined {
  const normalized = rawId.trim().toUpperCase()
  if (!normalized) return undefined
  return membersById.get(normalized)
}
