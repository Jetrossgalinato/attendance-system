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
