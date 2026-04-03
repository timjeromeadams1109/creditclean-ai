/**
 * MFA middleware gate.
 *
 * When a user has MFA enabled, the JWT callback sets mfaPending=true on
 * fresh login. This middleware intercepts all dashboard routes and redirects
 * to /auth/mfa-verify until the user passes the MFA challenge.
 *
 * Routes excluded from the gate:
 *   - /auth/* (signin, mfa-verify, etc.)
 *   - /api/auth/* (NextAuth + MFA API routes)
 *   - /_next/* and /favicon.ico (static assets)
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip auth pages, NextAuth API, MFA API, and static assets
  if (
    pathname.startsWith("/auth/") ||
    pathname.startsWith("/api/auth/") ||
    pathname.startsWith("/_next/") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Not logged in — let NextAuth handle the redirect
  if (!token) return NextResponse.next();

  // MFA pending — redirect to challenge page, preserving intended destination
  if (token.mfaPending === true) {
    const mfaUrl = new URL("/auth/mfa-verify", req.url);
    mfaUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(mfaUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all routes except static files and image optimization.
     * Adjust this if you add public marketing pages.
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
