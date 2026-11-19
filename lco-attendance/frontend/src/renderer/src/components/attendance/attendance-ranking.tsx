import type { AttendanceRank } from "@/data/mock-attendance"
import { cn } from "@/lib/utils"

type AttendanceRankingProps = {
  ranks: AttendanceRank[]
}

export function AttendanceRanking({ ranks }: AttendanceRankingProps) {
  return (
    <section className="flex h-full flex-col border border-border bg-card">
      <div className="border-b border-border px-4 py-3">
        <h2 className="text-lg font-bold tracking-[-0.03em]">Ranking</h2>
        <p className="mt-1 text-xs font-semibold tracking-[0.08em] text-muted-foreground uppercase">
          Top 5 this session
        </p>
      </div>

      {ranks.length === 0 ? (
        <p className="flex-1 px-4 py-8 text-sm text-muted-foreground">
          Rankings appear after the first scan.
        </p>
      ) : (
        <ol className="min-h-0 flex-1 divide-y divide-border">
          {ranks.map((rank, index) => (
            <li
              key={rank.memberId}
              className="flex items-center gap-3 px-4 py-3"
            >
              <span
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center text-sm font-black",
                  index === 0
                    ? "bg-lime text-[#181a17]"
                    : "bg-muted text-foreground"
                )}
              >
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{rank.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {rank.department}
                </p>
              </div>
              <span className="text-sm font-bold tabular-nums">
                {rank.count}
              </span>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}
