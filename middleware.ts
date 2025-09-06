import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Daftar route yang memerlukan authentication
const protectedRoutes = ["/dashboard", "/profile", "/settings", "/"];
// Daftar route yang tidak boleh diakses jika sudah login
const authRoutes = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Cek token dari cookie atau header
  const token =
    request.cookies.get("token")?.value ||
    request.headers.get("authorization")?.replace("Bearer ", "");

  // Jika mengakses route yang memerlukan auth tapi belum login
  if (protectedRoutes.some((route) => pathname === route || pathname.startsWith(route + "/"))) {
    if (!token) {
      // Redirect ke login
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
    // Jika sudah login dan akses root ("/"), redirect ke dashboard
    if (pathname === "/") {
      const dashboardUrl = new URL("/dashboard", request.url);
      return NextResponse.redirect(dashboardUrl);
    }
  }

  // Jika sudah login tapi mengakses halaman auth (login/register)
  if (authRoutes.some((route) => pathname === route || pathname.startsWith(route + "/"))) {
    if (token) {
      // Redirect ke dashboard
      const dashboardUrl = new URL("/dashboard", request.url);
      return NextResponse.redirect(dashboardUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Proteksi semua route kecuali API, static, image, favicon
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}; 