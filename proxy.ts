import { type NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "admin_session";
const SESSION_VALUE = "authenticated";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin/* routes (excluding the login page itself)
  if (pathname.startsWith("/admin") && pathname !== "/admin") {
    const session = request.cookies.get(COOKIE_NAME)?.value;
    if (session !== SESSION_VALUE) {
      const loginUrl = new URL("/admin", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path+"],
};
