"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import {
  registerStudentAction,
  type RegisterState,
} from "@/lib/actions/auth-actions";
import { Button } from "@/components/ui/button";

const initialState: RegisterState = {};

export function RegisterForm() {
  const [state, formAction, pending] = useActionState(
    registerStudentAction,
    initialState
  );
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      const t = setTimeout(() => router.push("/panel/ogrenci"), 1200);
      return () => clearTimeout(t);
    }
  }, [state?.success, router]);

  if (state?.success) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl bg-green-50 px-6 py-10 text-center ring-1 ring-green-100">
        <CheckCircle2 size={40} className="text-success" />
        <p className="font-display text-lg font-bold text-ink-950">
          Hesabınız oluşturuldu!
        </p>
        <p className="text-sm text-ink-500">
          Öğrenci panelinize yönlendiriliyorsunuz...
        </p>
        <Loader2 size={18} className="animate-spin text-brand-500" />
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      {state?.error && (
        <div className="flex items-start gap-2.5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-100">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <span>{state.error}</span>
        </div>
      )}

      <div>
        <label htmlFor="name" className="text-sm font-semibold text-ink-900">
          Ad Soyad
        </label>
        <div className="relative mt-1.5">
          <User
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-300"
            size={18}
          />
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="Adınız Soyadınız"
            className="w-full rounded-xl border border-ink-100 bg-white py-3 pl-11 pr-4 text-sm text-ink-900 outline-none ring-brand-500 transition focus:ring-2"
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="text-sm font-semibold text-ink-900">
          E-posta Adresi
        </label>
        <div className="relative mt-1.5">
          <Mail
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-300"
            size={18}
          />
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="ornek@eposta.com"
            className="w-full rounded-xl border border-ink-100 bg-white py-3 pl-11 pr-4 text-sm text-ink-900 outline-none ring-brand-500 transition focus:ring-2"
          />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="text-sm font-semibold text-ink-900">
          Parola
        </label>
        <div className="relative mt-1.5">
          <Lock
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-300"
            size={18}
          />
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            autoComplete="new-password"
            placeholder="En az 8 karakter"
            className="w-full rounded-xl border border-ink-100 bg-white py-3 pl-11 pr-11 text-sm text-ink-900 outline-none ring-brand-500 transition focus:ring-2"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-300 hover:text-ink-600"
            aria-label={showPassword ? "Parolayı gizle" : "Parolayı göster"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        <p className="mt-1.5 text-xs text-ink-400">
          En az 8 karakter, bir büyük harf ve bir rakam içermelidir.
        </p>
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? (
          <>
            <Loader2 size={18} className="animate-spin" /> Hesap oluşturuluyor...
          </>
        ) : (
          "Ücretsiz Hesap Oluştur"
        )}
      </Button>

      <p className="text-center text-xs text-ink-400">
        Kayıt olarak{" "}
        <Link href="/" className="underline hover:text-ink-600">
          Kullanım Koşulları
        </Link>{" "}
        ve{" "}
        <Link href="/" className="underline hover:text-ink-600">
          Gizlilik Politikası
        </Link>
        &apos;nı kabul etmiş olursunuz.
      </p>

      <p className="text-center text-sm text-ink-500">
        Zaten hesabınız var mı?{" "}
        <Link href="/giris" className="font-semibold text-brand-600 hover:text-brand-700">
          Giriş yapın
        </Link>
      </p>
    </form>
  );
}
