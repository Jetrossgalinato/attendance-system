import { useEffect, useRef, type FormEvent } from "react"
import { ScanLine } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type IdScanInputProps = {
  value: string
  message: string | null
  messageTone: "error" | "success" | null
  onChange: (value: string) => void
  onSubmitId: (rawId: string) => void
  onOpenQr: () => void
}

export function IdScanInput({
  value,
  message,
  messageTone,
  onChange,
  onSubmitId,
  onOpenQr,
}: IdScanInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSubmitId(value)
  }

  return (
    <section className="border border-border bg-card p-4">
      <form
        className="flex flex-col gap-3 md:flex-row md:items-end"
        onSubmit={handleSubmit}
      >
        <label className="min-w-0 flex-1 space-y-2">
          <span className="block text-[11px] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
            Scan member ID
          </span>
          <Input
            ref={inputRef}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="Scan barcode or type LCO-1001"
            autoComplete="off"
            spellCheck={false}
            className="font-mono tracking-wide"
          />
        </label>

        <div className="flex gap-2">
          <Button type="submit" className="cursor-pointer">
            Record
          </Button>
          <Button
            type="button"
            variant="outline"
            className="cursor-pointer"
            onClick={onOpenQr}
          >
            <ScanLine />
            Scan QR
          </Button>
        </div>
      </form>

      {message && (
        <p
          className={
            messageTone === "success"
              ? "mt-3 text-sm font-medium text-deep-lime"
              : "mt-3 text-sm font-medium text-destructive"
          }
          role="status"
        >
          {message}
        </p>
      )}
    </section>
  )
}
