import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import { NextResponse } from "next/server";

// Edge-safe proxy: sadece JWT doğrulaması yapar, DB'ye dokunmaz.
const { auth } = NextAuth(authConfig);

const ROLE_HOME: Record<string, string> = {
  ADMIN: "/panel/yonetim",
  TEACHER: "/panel/ogretmen",
  STUDENT: "/panel/ogrenci",
};

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth?.user;
  const role = req.auth?.user?.role;

  // Panel altındaki rotalar için oturum + rol bazlı erişim kontrolü.
  if (nextUrl.pathname.startsWith("/panel")) {
    if (!isLoggedIn) {
      const loginUrl = new URL("/giris", nextUrl);
      loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }

    const isAdminArea = nextUrl.pathname.startsWith("/panel/yonetim");
    const isTeacherArea = nextUrl.pathname.startsWith("/panel/ogretmen");
    const isStudentArea = nextUrl.pathname.startsWith("/panel/ogrenci");

    const roleAllowed =
      (isAdminArea && role === "ADMIN") ||
      (isTeacherArea && (role === "TEACHER" || role === "ADMIN")) ||
      (isStudentArea && role === "STUDENT");

    if (!roleAllowed) {
      const home = role ? ROLE_HOME[role] ?? "/" : "/";
      return NextResponse.redirect(new URL(home, nextUrl));
    }
  }

  // Zaten giriş yapmış kullanıcı giriş/kayıt sayfasına giderse panele yönlendir.
  if (
    isLoggedIn &&
    (nextUrl.pathname === "/giris" || nextUrl.pathname === "/kayit")
  ) {
    return NextResponse.redirect(
      new URL(role ? ROLE_HOME[role] ?? "/" : "/", nextUrl)
    );
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|og-image.png).*)",
  ],
};
