"use client";

import { useActionState, useState } from "react";
import { UserPlus, AlertCircle, CheckCircle2, Loader2, X } from "lucide-react";
import { createUserByAdminAction, type FormState } from "@/lib/actions/admin-actions";
import { Button } from "@/components/ui/button";

const initialState: FormState = {};

export function CreateUserForm() {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(
    createUserByAdminAction,
    initialState
  );

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)} size="sm">
        <UserPlus size={16} /> Yeni Kullanıcı
      </Button>
    );
  }

  return (
    <div className="mb-6 rounded-2xl border border-ink-100 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-base font-bold text-ink-950">
          Yeni Kullanıcı Ekle
        </h3>
        <button onClick={() => setOpen(false)} className="text-ink-400 hover:text-ink-700">
          <X size={18} />
        </button>
      </div>

      {state?.success ? (
        <div className="flex items-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700 ring-1 ring-green-100">
          <CheckCircle2 size={18} /> Kullanıcı başarıyla oluşturuldu.
        </div>
      ) : (
        <form action={formAction} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {state?.error && (
            <div className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-100 sm:col-span-2">
              <AlertCircle size={16} /> {state.error}
            </div>
          )}
          <div>
            <label className="text-sm font-semibold text-ink-900">Ad Soyad</label>
            <input
              name="name"
              required
              className="mt-1.5 w-full rounded-xl border border-ink-100 px-4 py-2.5 text-sm outline-none ring-brand-500 focus:ring-2"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-ink-900">E-posta</label>
            <input
              name="email"
              type="email"
              required
              className="mt-1.5 w-full rounded-xl border border-ink-100 px-4 py-2.5 text-sm outline-none ring-brand-500 focus:ring-2"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-ink-900">Parola</label>
            <input
              name="password"
              type="password"
              required
              className="mt-1.5 w-full rounded-xl border border-ink-100 px-4 py-2.5 text-sm outline-none ring-brand-500 focus:ring-2"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-ink-900">Rol</label>
            <select
              name="role"
              className="mt-1.5 w-full rounded-xl border border-ink-100 px-4 py-2.5 text-sm outline-none ring-brand-500 focus:ring-2"
            >
              <option value="STUDENT">Öğrenci</option>
              <option value="TEACHER">Eğitmen</option>
              <option value="ADMIN">Yönetici</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <Button type="submit" disabled={pending} className="w-full sm:w-auto">
              {pending ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />}
              Kullanıcıyı Oluştur
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
