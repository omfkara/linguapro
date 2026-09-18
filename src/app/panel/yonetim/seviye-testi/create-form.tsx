"use client";

import { useActionState } from "react";
import { AlertCircle, Gauge, Loader2 } from "lucide-react";
import { createLevelTestAction, type FormState } from "@/lib/actions/exam-actions";
import { Button } from "@/components/ui/button";

const initialState: FormState = {};

export function LevelTestCreateForm() {
  const [state, formAction, pending] = useActionState(createLevelTestAction, initialState);

  return (
    <form action={formAction} className="max-w-lg space-y-5 rounded-2xl border border-ink-100 bg-white p-7 shadow-sm">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
        <Gauge size={22} />
      </div>
      <div>
        <h3 className="font-display text-base font-bold text-ink-950">
          Seviye Tespit Sınavını Oluştur
        </h3>
        <p className="mt-1 text-sm text-ink-500">
          Bu sınav sitedeki herkese açık &ldquo;Seviye Tespit Sınavı&rdquo;
          sayfasında kullanılacaktır. Yalnızca bir tane oluşturulabilir.
        </p>
      </div>

      {state?.error && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-100">
          <AlertCircle size={16} /> {state.error}
        </div>
      )}

      <div>
        <label className="text-sm font-semibold text-ink-900">Sınav Başlığı</label>
        <input
          name="title"
          defaultValue="Genel Seviye Tespit Sınavı"
          className="mt-1.5 w-full rounded-xl border border-ink-100 px-4 py-2.5 text-sm outline-none ring-brand-500 focus:ring-2"
        />
      </div>
      <div>
        <label className="text-sm font-semibold text-ink-900">Süre (dakika)</label>
        <input
          name="durationMinutes"
          type="number"
          min={5}
          defaultValue={20}
          className="mt-1.5 w-full rounded-xl border border-ink-100 px-4 py-2.5 text-sm outline-none ring-brand-500 focus:ring-2"
        />
      </div>

      <Button type="submit" disabled={pending}>
        {pending && <Loader2 size={16} className="animate-spin" />}
        Sınavı Oluştur
      </Button>
    </form>
  );
}
