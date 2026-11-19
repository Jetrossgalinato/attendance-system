import { useEffect, useId, useRef, useState } from "react"
import { Html5Qrcode } from "html5-qrcode"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"

type QrScannerProps = {
  open: boolean
  onClose: () => void
  onScan: (decodedText: string) => void
}

export function QrScanner({ open, onClose, onScan }: QrScannerProps) {
  const scannerId = useId().replace(/:/g, "")
  const elementId = `qr-reader-${scannerId}`
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const handlingRef = useRef(false)
  const [error, setError] = useState<string | null>(null)
  const [starting, setStarting] = useState(false)

  useEffect(() => {
    if (!open) return

    let cancelled = false
    handlingRef.current = false
    setError(null)
    setStarting(true)

    const scanner = new Html5Qrcode(elementId)
    scannerRef.current = scanner

    async function start() {
      try {
        await scanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 240, height: 240 } },
          (decodedText) => {
            if (handlingRef.current) return
            handlingRef.current = true
            onScan(decodedText)
          },
          () => undefined
        )
        if (!cancelled) setStarting(false)
      } catch (err) {
        if (cancelled) return
        setStarting(false)
        const message =
          err instanceof Error ? err.message : "Unable to access the camera."
        setError(
          `${message} You can still use the keyboard / USB ID scanner.`
        )
      }
    }

    void start()

    return () => {
      cancelled = true
      const active = scannerRef.current
      scannerRef.current = null
      if (!active) return
      void (async () => {
        try {
          if (active.isScanning) {
            await active.stop()
          }
          active.clear()
        } catch {
          // Camera may already be stopped when the dialog unmounts.
        }
      })()
    }
  }, [elementId, onScan, open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4">
      <div className="w-full max-w-lg border border-border bg-background shadow-lg">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div>
            <h2 className="text-lg font-bold tracking-[-0.03em]">Scan QR</h2>
            <p className="text-xs text-muted-foreground">
              Point the camera at a member QR (payload = member ID)
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="cursor-pointer"
            onClick={onClose}
            aria-label="Close QR scanner"
          >
            <X />
          </Button>
        </div>

        <div className="space-y-3 p-4">
          <div
            id={elementId}
            className="overflow-hidden border border-border bg-muted"
          />
          {starting && !error && (
            <p className="text-sm text-muted-foreground">Starting camera…</p>
          )}
          {error && (
            <p className="text-sm font-medium text-destructive" role="alert">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
