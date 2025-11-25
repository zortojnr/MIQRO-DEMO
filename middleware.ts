import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

const protectedPaths = ["/teacher", "/admin", "/gov"]

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const isProtected = protectedPaths.some(p => pathname.startsWith(p))
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  if (!token && isProtected) {
    const url = req.nextUrl.clone()
    url.pathname = "/auth/login"
    return NextResponse.redirect(url)
  }

  if (pathname === "/" && token?.role) {
    const url = req.nextUrl.clone()
    if (token.role === "teacher") url.pathname = "/teacher/dashboard"
    else if (token.role === "admin") url.pathname = "/admin/dashboard"
    else if (token.role === "gov") url.pathname = "/gov/dashboard"
    else return NextResponse.next()
    return NextResponse.redirect(url)
  }

  if (isProtected && token?.role) {
    if (pathname.startsWith("/teacher") && token.role !== "teacher") return NextResponse.redirect(new URL("/", req.url))
    if (pathname.startsWith("/admin") && token.role !== "admin") return NextResponse.redirect(new URL("/", req.url))
    if (pathname.startsWith("/gov") && token.role !== "gov") return NextResponse.redirect(new URL("/", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/", "/teacher/:path*", "/admin/:path*", "/gov/:path*", "/auth/:path*"]
}

