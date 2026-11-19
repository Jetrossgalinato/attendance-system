import { useCallback, useEffect, useId, useRef, useState } from "react"
import { Html5Qrcode } from "html5-qrcode"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type QrScannerProps = {
  enabled?: boolean
  paused?: boolean
  onScan: (decodedText: string) => void
  className?: string
}

/** Serialize camera open/close so StrictMode remounts don't fight for the device. */
let cameraGate: Promise<void> = Promise.resolve()

function enqueueCameraTask<T>(task: () => Promise<T>): Promise<T> {
  const run = cameraGate.then(task, task)
  cameraGate = run.then(
    () => undefined,
    () => undefined
  )
  return run
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function waitForElementSize(
  element: HTMLElement,
  timeoutMs = 4000
): Promise<void> {
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    if (element.clientWidth > 8 && element.clientHeight > 8) {
      return
    }
    await new Promise((resolve) => requestAnimationFrame(() => resolve(null)))
  }
  throw new Error(
    `Camera panel is too small (${element.clientWidth}×${element.clientHeight}).`
  )
}

function stopAllVideosIn(element: HTMLElement): void {
  const videos = element.querySelectorAll("video")
  videos.forEach((video) => {
    const stream = video.srcObject
    if (stream instanceof MediaStream) {
      stream.getTracks().forEach((track) => track.stop())
    }
    video.srcObject = null
    video.removeAttribute("src")
    video.load()
  })
}

async function pickCameraId(): Promise<string | MediaTrackConstraints> {
  try {
    const cameras = await Html5Qrcode.getCameras()
    if (cameras.length > 0) {
      const back = cameras.find((camera) =>
        /back|rear|environment/i.test(camera.label)
      )
      return (back ?? cameras[0]).id
    }
  } catch {
    // Fall through.
  }
  return { facingMode: "user" }
}

export function QrScanner({
  enabled = true,
  paused = false,
  onScan,
  className,
}: QrScannerProps) {
  const scannerId = useId().replace(/:/g, "")
  const elementId = `qr-reader-${scannerId}`
  const hostRef = useRef<HTMLDivElement | null>(null)
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const pausedRef = useRef(paused)
  const onScanRef = useRef(onScan)
  const [error, setError] = useState<string | null>(null)
  const [starting, setStarting] = useState(false)
  const [restartKey, setRestartKey] = useState(0)

  useEffect(() => {
    pausedRef.current = paused
  }, [paused])

  useEffect(() => {
    onScanRef.current = onScan
  }, [onScan])

  const releaseCamera = useCallback(async () => {
    const active = scannerRef.current
    scannerRef.current = null
    const host = hostRef.current

    if (active) {
      try {
        if (active.isScanning) {
          await active.stop()
        }
      } catch {
        // Already stopped.
      }
      try {
        active.clear()
      } catch {
        // Ignore clear errors.
      }
    }

    if (host) {
      stopAllVideosIn(host)
    }

    await sleep(400)
  }, [])

  useEffect(() => {
    if (!enabled) return

    let cancelled = false
    setError(null)
    setStarting(true)

    void enqueueCameraTask(async () => {
      try {
        await releaseCamera()
        if (cancelled) return

        const host = hostRef.current
        if (!host) {
          setStarting(false)
          setError("Camera container is missing.")
          return
        }

        await waitForElementSize(host)
        if (cancelled) return

        const cameraConfig = await pickCameraId()
        if (cancelled) return

        const scanner = new Html5Qrcode(elementId)
        scannerRef.current = scanner

        const config = {
          fps: 10,
          qrbox: (viewfinderWidth: number, viewfinderHeight: number) => {
            const edge = Math.min(viewfinderWidth, viewfinderHeight)
            const size = Math.max(120, Math.floor(edge * 0.7))
            return { width: size, height: size }
          },
        }

        const onSuccess = (decodedText: string) => {
          if (pausedRef.current) return
          onScanRef.current(decodedText)
        }

        try {
          await scanner.start(cameraConfig, config, onSuccess, () => undefined)
        } catch {
          await scanner.start(
            { facingMode: "user" },
            config,
            onSuccess,
            () => undefined
          )
        }

        if (!cancelled) setStarting(false)
      } catch (err) {
        if (cancelled) return
        setStarting(false)
        const name = err instanceof DOMException ? err.name : ""
        const message =
          err instanceof Error ? err.message : "Unable to access the camera."

        let hint = "Click Retry camera, or use the ID field."
        if (
          name === "NotAllowedError" ||
          /notallowed|permission/i.test(message)
        ) {
          hint =
            "Camera permission was denied. Fully quit Electron and reopen the app window."
        } else if (name === "NotFoundError" || /notfound/i.test(message)) {
          hint = "No webcam detected. Plug one in, then retry."
        } else if (
          name === "NotReadableError" ||
          /notreadable|could not start video|busy|in use/i.test(message)
        ) {
          hint =
            "Camera is locked by another window/tab. Close other camera apps and any browser tab on localhost:5173, wait a second, then retry."
        }

        setError(`${message} ${hint}`)
        await releaseCamera()
      }
    })

    return () => {
      cancelled = true
      void enqueueCameraTask(async () => {
        await releaseCamera()
      })
    }
  }, [elementId, enabled, releaseCamera, restartKey])

  return (
    <div className={cn("flex h-full min-h-0 flex-col bg-transparent", className)}>
      <div className="flex items-center justify-between px-5 py-3">
        <p className="text-[11px] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
          QR camera
        </p>
        {paused && !error && (
          <p className="text-xs font-medium text-deep-lime" role="status">
            Cooldown…
          </p>
        )}
      </div>

      <div className="relative mx-4 mb-4 min-h-0 flex-1 overflow-hidden rounded-2xl bg-muted">
        <div
          ref={hostRef}
          id={elementId}
          className="qr-scanner-viewport h-full w-full"
        />
        {starting && !error && (
          <p className="absolute inset-x-0 bottom-2 px-3 text-center text-xs text-muted-foreground">
            Starting camera…
          </p>
        )}
        {error && (
          <div className="absolute inset-x-0 bottom-0 space-y-2 rounded-b-2xl bg-background/95 px-3 py-2">
            <p className="text-xs font-medium text-destructive" role="alert">
              {error}
            </p>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="cursor-pointer"
              onClick={() => setRestartKey((value) => value + 1)}
            >
              Retry camera
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
