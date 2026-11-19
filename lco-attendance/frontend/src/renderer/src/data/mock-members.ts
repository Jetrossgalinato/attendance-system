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
    college: "CCIS",
    organization: "LCO Core",
  },
  {
    id: "LCO-1002",
    name: "Ben Santos",
    department: "Youth",
    college: "COFES",
    organization: "Youth Fellowship",
  },
  {
    id: "LCO-1003",
    name: "Carla Mendoza",
    department: "Media",
    college: "CED",
    organization: "Media Team",
  },
  {
    id: "LCO-1004",
    name: "Diego Cruz",
    department: "Ushering",
    college: "CMNS",
    organization: "Usher Corps",
  },
  {
    id: "LCO-1005",
    name: "Elena Garcia",
    department: "Children",
    college: "CEGS",
    organization: "Children Ministry",
  },
  {
    id: "LCO-1006",
    name: "Felix Ramos",
    department: "Tech",
    college: "CCIS",
    organization: "Tech Crew",
  },
  {
    id: "LCO-1007",
    name: "Gina Lopez",
    department: "Worship",
    college: "COFES",
    organization: "LCO Core",
  },
  {
    id: "LCO-1008",
    name: "Hiro Tanaka",
    department: "Youth",
    college: "CED",
    organization: "Youth Fellowship",
  },
  {
    id: "LCO-1009",
    name: "Isabel Navarro",
    department: "Media",
    college: "CMNS",
    organization: "Media Team",
  },
  {
    id: "LCO-1010",
    name: "Jonas Lim",
    department: "Ushering",
    college: "CEGS",
    organization: "Usher Corps",
  },
  {
    id: "LCO-1011",
    name: "Kai Domingo",
    department: "Children",
    college: "CCIS",
    organization: "Children Ministry",
  },
  {
    id: "LCO-1012",
    name: "Lara Villanueva",
    department: "Tech",
    college: "COFES",
    organization: "Tech Crew",
  },
  {
    id: "LCO-1013",
    name: "Marco Dela Cruz",
    department: "Worship",
    college: "CED",
    organization: "LCO Core",
  },
  {
    id: "LCO-1014",
    name: "Nina Ortega",
    department: "Youth",
    college: "CMNS",
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
