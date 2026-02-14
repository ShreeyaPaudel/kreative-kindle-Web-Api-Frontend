import { NextRequest, NextResponse } from "next/server";

function parseUserCookie(raw: string | undefined) {
  if (!raw) return null;

  try {
    const decoded = decodeURIComponent(raw);
    return JSON.parse(decoded);
  } catch {
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = req.cookies.get("token")?.value;
  const userRaw = req.cookies.get("user")?.value;
  const user = parseUserCookie(userRaw);

  // ✅ protect /dashboard
  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = "/auth/login";
      url.searchParams.set("from", pathname);
      return NextResponse.redirect(url);
    }
  }

  // ✅ protect /user
  if (pathname.startsWith("/user")) {
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = "/auth/login";
      url.searchParams.set("from", pathname);
      return NextResponse.redirect(url);
    }
  }

  // ✅ protect /admin
  if (pathname.startsWith("/admin")) {
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = "/auth/login";
      url.searchParams.set("from", pathname);
      return NextResponse.redirect(url);
    }

    // If user cookie missing or not admin → unauthorized
    if (!user || user.role !== "admin") {
      const url = req.nextUrl.clone();
      url.pathname = "/unauthorized";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/user/:path*", "/dashboard/:path*"],
};
