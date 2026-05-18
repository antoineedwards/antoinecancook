import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_NAME = "admin_session";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

/** Generate a secure session value based on the secret */
async function getSessionValue() {
  const secret = process.env.ADMIN_SECRET || "default_fallback_secret_do_not_use";
  const data = new TextEncoder().encode(secret + "_salt");
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Set the admin session cookie (called after successful login). */
export async function setAdminSession() {
  const cookieStore = await cookies();
  const val = await getSessionValue();
  cookieStore.set(COOKIE_NAME, val, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });
}

/** Clear the admin session cookie (logout). */
export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

/** Returns true if the current request has a valid admin session. */
export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const val = await getSessionValue();
  return cookieStore.get(COOKIE_NAME)?.value === val;
}

/** Throws a redirect to /admin if not authenticated. Use in Server Components. */
export async function requireAdmin() {
  const ok = await isAdminAuthenticated();
  if (!ok) redirect("/admin");
}
