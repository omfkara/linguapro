import type { NextAuthConfig } from "next-auth";

/**
 * Proxy (edge-safe) tarafında kullanılan hafif yapılandırma.
 * Veritabanı bağlantısı gerektiren `authorize` mantığı burada YOKTUR;
 * o yalnızca src/auth.ts içindeki tam yapılandırmada, Node.js
 * runtime'ında çalışır.
 */
export const authConfig = {
  // Kendi sunucunuzda (Vercel dışı) barındırırken Auth.js'in istek Host
  // başlığına güvenmesi için gereklidir. Ters proxy arkasında çalıştırırken
  // X-Forwarded-Host'un güvenilir bir proxy'den geldiğinden emin olun.
  trustHost: true,
  pages: {
    signIn: "/giris",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 gün
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = nextUrl;
      const isPanel = pathname.startsWith("/panel");

      if (isPanel) return isLoggedIn;
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "ADMIN" | "TEACHER" | "STUDENT";
      }
      return session;
    },
  },
  providers: [], // asıl sağlayıcı src/auth.ts içinde eklenir
} satisfies NextAuthConfig;
