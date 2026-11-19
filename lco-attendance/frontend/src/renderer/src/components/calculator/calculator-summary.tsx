import type { CalculatorSummary } from "@/data/mock-calculator"

type CalculatorSummaryCardsProps = {
  summary: CalculatorSummary
}

const cards: Array<{
  key: keyof CalculatorSummary
  label: string
  format?: (value: number) => string
}> = [
  { key: "outNow", label: "Out now" },
  { key: "borrowedToday", label: "Borrowed today" },
  { key: "returnedToday", label: "Returned today" },
  {
    key: "returnRate",
    label: "Return rate",
    format: (value) => `${value}%`,
  },
]

export function CalculatorSummaryCards({
  summary,
}: CalculatorSummaryCardsProps) {
  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <article
          key={card.key}
          className="border border-border bg-card px-4 py-4"
        >
          <p className="text-[11px] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
            {card.label}
          </p>
          <p className="mt-2 text-3xl font-black tracking-[-0.04em] text-foreground">
            {card.format
              ? card.format(summary[card.key])
              : summary[card.key]}
          </p>
        </article>
      ))}
    </section>
  )
}
