export type AuthSession = {
  email: string
}

export type LoginResult =
  | { ok: true; session: AuthSession }
  | { ok: false; message: string }

export const DEMO_EMAIL = "admin@lco.local"
export const DEMO_PASSWORD = "admin123"

export function tryLogin(email: string, password: string): LoginResult {
  const trimmedEmail = email.trim()
  const trimmedPassword = password.trim()

  if (!trimmedEmail || !trimmedPassword) {
    return {
      ok: false,
      message: "Enter both email and password to continue.",
    }
  }

  return {
    ok: true,
    session: { email: trimmedEmail },
  }
}

export function getDisplayName(email: string): string {
  const local = email.trim().split("@")[0] ?? "Admin"
  if (!local) return "Admin"
  return local.charAt(0).toUpperCase() + local.slice(1).toLowerCase()
}

export function getInitials(email: string): string {
  const local = (email.trim().split("@")[0] ?? "A").replace(/[^a-zA-Z0-9]/g, "")
  if (!local) return "AD"
  if (local.length === 1) return local.toUpperCase()
  return (local[0] + local[1]).toUpperCase()
}
