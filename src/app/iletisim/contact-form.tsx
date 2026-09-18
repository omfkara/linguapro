"use client";

import { useActionState } from "react";
import { AlertCircle, CheckCircle2, Loader2, Send } from "lucide-react";
import {
  submitContactAction,
  type ContactState,
} from "@/lib/actions/contact-actions";
import { Button } from "@/components/ui/button";

const initialState: ContactState = {};

export function ContactForm() {
  const [state, formAction, pending] = useActionState(
    submitContactAction,
    initialState
  );

  if (state?.success) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl bg-green-50 px-6 py-12 text-center ring-1 ring-green-100">
        <CheckCircle2 size={44} className="text-success" />
        <p className="font-display text-xl font-bold text-ink-950">
          Mesajınız alındı!
        </p>
        <p className="max-w-sm text-sm text-ink-500">
          En kısa sürede ekibimiz sizinle iletişime geçecektir. Bizi tercih
          ettiğiniz için teşekkür ederiz.
        </p>
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

      {/* Honeypot alanı: botlara görünür, gerçek kullanıcılara görünmez */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
        aria-hidden="true"
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="text-sm font-semibold text-ink-900">
            Ad Soyad
          </label>
          <input
            id="name"
            name="name"
            required
            className="mt-1.5 w-full rounded-xl border border-ink-100 bg-white px-4 py-3 text-sm outline-none ring-brand-500 transition focus:ring-2"
          />
        </div>
        <div>
          <label htmlFor="phone" className="text-sm font-semibold text-ink-900">
            Telefon <span className="font-normal text-ink-400">(opsiyonel)</span>
          </label>
          <input
            id="phone"
            name="phone"
            className="mt-1.5 w-full rounded-xl border border-ink-100 bg-white px-4 py-3 text-sm outline-none ring-brand-500 transition focus:ring-2"
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="text-sm font-semibold text-ink-900">
          E-posta Adresi
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="mt-1.5 w-full rounded-xl border border-ink-100 bg-white px-4 py-3 text-sm outline-none ring-brand-500 transition focus:ring-2"
        />
      </div>

      <div>
        <label htmlFor="subject" className="text-sm font-semibold text-ink-900">
          Konu <span className="font-normal text-ink-400">(opsiyonel)</span>
        </label>
        <input
          id="subject"
          name="subject"
          placeholder="Örn: Kurumsal eğitim talebi"
          className="mt-1.5 w-full rounded-xl border border-ink-100 bg-white px-4 py-3 text-sm outline-none ring-brand-500 transition focus:ring-2"
        />
      </div>

      <div>
        <label htmlFor="message" className="text-sm font-semibold text-ink-900">
          Mesajınız
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="mt-1.5 w-full resize-none rounded-xl border border-ink-100 bg-white px-4 py-3 text-sm outline-none ring-brand-500 transition focus:ring-2"
        />
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? (
          <>
            <Loader2 size={18} className="animate-spin" /> Gönderiliyor...
          </>
        ) : (
          <>
            <Send size={18} /> Mesajı Gönder
          </>
        )}
      </Button>
    </form>
  );
}
