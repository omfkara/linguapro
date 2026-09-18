"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";
import { loginAction, type LoginState } from "@/lib/actions/auth-actions";
import { Button } from "@/components/ui/button";

const initialState: LoginState = {};

export function LoginForm({ callbackUrl }: { callbackUrl?: string }) {
  const [state, formAction, pending] = useActionState(
    loginAction,
    initialState
  );
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="callbackUrl" value={callbackUrl || "/panel"} />

      {state?.error && (
        <div className="flex items-start gap-2.5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-100">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <span>{state.error}</span>
        </div>
      )}

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
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="text-sm font-semibold text-ink-900">
            Parola
          </label>
          <span className="text-xs font-medium text-ink-400">
            Şifremi unuttum (yakında)
          </span>
        </div>
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
            autoComplete="current-password"
            placeholder="••••••••"
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
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? (
          <>
            <Loader2 size={18} className="animate-spin" /> Giriş yapılıyor...
          </>
        ) : (
          "Giriş Yap"
        )}
      </Button>

      <p className="text-center text-sm text-ink-500">
        Hesabınız yok mu?{" "}
        <Link href="/kayit" className="font-semibold text-brand-600 hover:text-brand-700">
          Ücretsiz kayıt olun
        </Link>
      </p>
    </form>
  );
}
