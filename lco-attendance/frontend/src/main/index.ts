import { app, BrowserWindow, session, shell } from "electron"
import { join } from "node:path"

const isDev = !app.isPackaged

// Must run before ready: auto-accept camera/mic prompts (Electron has no visible bar).
app.commandLine.appendSwitch("use-fake-ui-for-media-stream")
app.commandLine.appendSwitch("enable-features", "WebRTCPipeWireCapturer")

function allowMediaPermission(permission: string): boolean {
  return (
    permission === "media" ||
    permission === "mediaKeySystem" ||
    permission === "display-capture" ||
    permission === "speaker-selection" ||
    permission === "clipboard-sanitized-write"
  )
}

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 900,
    minHeight: 640,
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, "../preload/index.mjs"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  })

  mainWindow.on("ready-to-show", () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    void shell.openExternal(details.url)
    return { action: "deny" }
  })

  if (isDev && process.env.ELECTRON_RENDERER_URL) {
    void mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL)
  } else {
    void mainWindow.loadFile(join(__dirname, "../renderer/index.html"))
  }
}

app.whenReady().then(() => {
  const ses = session.defaultSession

  ses.setPermissionRequestHandler((_webContents, permission, callback) => {
    callback(allowMediaPermission(permission))
  })

  ses.setPermissionCheckHandler((_webContents, permission) =>
    allowMediaPermission(permission)
  )

  createWindow()

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit()
  }
})
