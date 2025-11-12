import { NextResponse } from "next/server";

// 🟢 Halaman publik yang tidak perlu login
const publicRoutes = [
  "/",
  "/login",
  "/register",
  "/pelatihan",
  "/pelatihan",
  "/admin/login",
  "/api", // API routes tetap dibuka
  "/_next", // untuk file internal Next.js
  "/img", // untuk aset publik
  "/favicon.ico",
];

// 🟢 Helper untuk memeriksa apakah path cocok dengan daftar publik
function isPublicRoute(pathname) {
  return publicRoutes.some((route) => pathname.startsWith(route));
}

// 🟢 Middleware utama
export function middleware(req) {
  const { pathname } = req.nextUrl;

  // Jika route publik → lanjutkan
  if (isPublicRoute(pathname)) return NextResponse.next();

  // Ambil cookie token & user (karena localStorage tidak bisa diakses dari server)
  const token = req.cookies.get("token")?.value;
  const userData = req.cookies.get("user")?.value;

  // Jika tidak ada token → redirect ke login
  if (!token || !userData) {
    if (pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    } else {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // Parsing user untuk ambil role
  let user = null;
  try {
    user = JSON.parse(userData);
  } catch (e) {
    console.warn("⚠️ Gagal parsing user dari cookie.");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Admin route protection
  if (pathname.startsWith("/admin") && user.role !== "admin" && user.role !== "mitra") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

// 🧩 Tentukan routes yang akan diintersepsi
export const config = {
  matcher: [
    "/admin/:path*",
  ],
};
