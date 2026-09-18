import type { Metadata } from "next";
import { AuthShell } from "@/components/site/auth-shell";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Giriş Yap",
  description: "LinguaPro Dil Akademisi öğrenci, eğitmen ve yönetici girişi.",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;

  return (
    <AuthShell
      title="Tekrar hoş geldiniz"
      subtitle="Hesabınıza giriş yaparak panelinize erişin."
    >
      <LoginForm callbackUrl={callbackUrl} />
    </AuthShell>
  );
}
