import {
  formatScanTime,
  type AttendanceRecord,
} from "@/data/mock-attendance"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

type AttendanceTableProps = {
  records: AttendanceRecord[]
}

export function AttendanceTable({ records }: AttendanceTableProps) {
  return (
    <section className="border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h2 className="text-lg font-bold tracking-[-0.03em]">Live scans</h2>
        <p className="text-xs font-semibold tracking-[0.08em] text-muted-foreground uppercase">
          {records.length} rows
        </p>
      </div>

      {records.length === 0 ? (
        <p className="px-4 py-10 text-sm text-muted-foreground">
          No scans yet. Use the camera or enter a member ID.
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Time</TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((record) => (
              <TableRow key={record.id}>
                <TableCell className="font-medium tabular-nums">
                  {formatScanTime(record.scannedAt)}
                </TableCell>
                <TableCell className="font-mono text-xs tracking-wide">
                  {record.memberId}
                </TableCell>
                <TableCell className="font-semibold">{record.name}</TableCell>
                <TableCell>
                  <span
                    className={cn(
                      "inline-flex border px-2 py-0.5 text-xs font-semibold tracking-wide uppercase",
                      record.type === "Time In"
                        ? "border-deep-lime bg-lime/30 text-foreground"
                        : "border-border bg-muted text-foreground"
                    )}
                  >
                    {record.type}
                  </span>
                </TableCell>
                <TableCell>
                  <span
                    className={cn(
                      "inline-flex border px-2 py-0.5 text-xs font-semibold tracking-wide uppercase",
                      record.status === "Present"
                        ? "border-deep-lime bg-lime/30 text-foreground"
                        : "border-destructive/40 bg-destructive/10 text-destructive"
                    )}
                  >
                    {record.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </section>
  )
}
