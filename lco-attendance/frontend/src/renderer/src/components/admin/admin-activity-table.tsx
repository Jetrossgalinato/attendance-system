import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { AdminActivityRow } from "@/data/mock-admin"
import { cn } from "@/lib/utils"

type AdminActivityTableProps = {
  rows: AdminActivityRow[]
}

function statusClass(status: string): string {
  switch (status) {
    case "Present":
    case "Out":
      return "bg-lime/40 text-foreground"
    case "Late":
      return "bg-destructive/10 text-destructive"
    case "Returned":
      return "bg-muted text-foreground"
    default:
      return "bg-muted text-foreground"
  }
}

export function AdminActivityTable({ rows }: AdminActivityTableProps) {
  return (
    <section className="surface-card overflow-hidden">
      <div className="border-b border-border/80 px-5 py-4">
        <h2 className="text-lg font-bold tracking-[-0.03em]">Recent activity</h2>
        <p className="mt-1 text-xs font-semibold tracking-[0.08em] text-muted-foreground uppercase">
          Attendance & borrows · latest
        </p>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Time</TableHead>
            <TableHead>Person</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Detail</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell className="font-medium tabular-nums">{row.time}</TableCell>
              <TableCell className="font-semibold">{row.actor}</TableCell>
              <TableCell>
                <span
                  className={cn(
                    "surface-chip inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide uppercase",
                    row.kind === "Attendance"
                      ? "bg-lime/40 text-foreground"
                      : "bg-muted text-foreground"
                  )}
                >
                  {row.kind}
                </span>
              </TableCell>
              <TableCell className="text-muted-foreground">{row.detail}</TableCell>
              <TableCell>
                <span
                  className={cn(
                    "surface-chip inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide uppercase",
                    statusClass(row.status)
                  )}
                >
                  {row.status}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  )
}
