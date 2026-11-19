import { useEffect, useId, useRef, useState } from "react"
import { Html5Qrcode } from "html5-qrcode"

import { cn } from "@/lib/utils"

type QrScannerProps = {
  enabled?: boolean
  paused?: boolean
  onScan: (decodedText: string) => void
  className?: string
}

export function QrScanner({
  enabled = true,
  paused = false,
  onScan,
  className,
}: QrScannerProps) {
  const scannerId = useId().replace(/:/g, "")
  const elementId = `qr-reader-${scannerId}`
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const pausedRef = useRef(paused)
  const onScanRef = useRef(onScan)
  const [error, setError] = useState<string | null>(null)
  const [starting, setStarting] = useState(false)

  useEffect(() => {
    pausedRef.current = paused
  }, [paused])

  useEffect(() => {
    onScanRef.current = onScan
  }, [onScan])

  useEffect(() => {
    if (!enabled) return

    let cancelled = false
    setError(null)
    setStarting(true)

    const scanner = new Html5Qrcode(elementId)
    scannerRef.current = scanner

    async function start() {
      try {
        await scanner.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: (viewfinderWidth, viewfinderHeight) => {
              const edge = Math.min(viewfinderWidth, viewfinderHeight)
              const size = Math.floor(edge * 0.72)
              return { width: size, height: size }
            },
            aspectRatio: 1.333,
          },
          (decodedText) => {
            if (pausedRef.current) return
            onScanRef.current(decodedText)
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
          // Camera may already be stopped on unmount.
        }
      })()
    }
  }, [elementId, enabled])

  return (
    <div className={cn("flex h-full min-h-0 flex-col bg-card", className)}>
      <div className="flex items-center justify-between border-b border-border px-3 py-2">
        <p className="text-[11px] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
          QR camera
        </p>
        {paused && !error && (
          <p className="text-xs font-medium text-deep-lime" role="status">
            Cooldown…
          </p>
        )}
      </div>

      <div className="relative min-h-0 flex-1 overflow-hidden bg-muted">
        <div id={elementId} className="qr-scanner-viewport h-full w-full" />
        {starting && !error && (
          <p className="absolute inset-x-0 bottom-2 px-3 text-center text-xs text-muted-foreground">
            Starting camera…
          </p>
        )}
        {error && (
          <p
            className="absolute inset-x-0 bottom-0 bg-background/90 px-3 py-2 text-xs font-medium text-destructive"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    </div>
  )
}
