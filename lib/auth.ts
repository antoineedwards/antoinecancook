import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_NAME = "admin_session";
const SESSION_VALUE = "authenticated";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

/** Set the admin session cookie (called after successful login). */
export async function setAdminSession() {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, SESSION_VALUE, {
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
  return cookieStore.get(COOKIE_NAME)?.value === SESSION_VALUE;
}

/** Throws a redirect to /admin if not authenticated. Use in Server Components. */
export async function requireAdmin() {
  const ok = await isAdminAuthenticated();
  if (!ok) redirect("/admin");
}
