import type { Metadata } from "next";
import { AuthShell } from "@/components/site/auth-shell";
import { RegisterForm } from "./register-form";

export const metadata: Metadata = {
  title: "Ücretsiz Kayıt Ol",
  description:
    "LinguaPro Dil Akademisi'ne ücretsiz kayıt olun, seviye tespit sınavına girin ve dil öğrenmeye hemen başlayın.",
};

export default function RegisterPage() {
  return (
    <AuthShell
      title="Hesabınızı oluşturun"
      subtitle="Ücretsiz kayıt olun, seviye tespit sınavına girin ve öğrenmeye başlayın."
    >
      <RegisterForm />
    </AuthShell>
  );
}
