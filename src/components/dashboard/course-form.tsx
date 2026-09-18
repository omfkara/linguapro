"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AlertCircle, CheckCircle2, Loader2, BookPlus } from "lucide-react";
import { createCourseAction, type FormState } from "@/lib/actions/course-actions";
import { Button } from "@/components/ui/button";

const initialState: FormState = {};
const CEFR = ["A1", "A2", "B1", "B2", "C1", "C2"];

export function CourseForm({
  teachers,
  redirectTo,
}: {
  teachers?: { id: string; name: string }[];
  redirectTo: string;
}) {
  const [state, formAction, pending] = useActionState(
    createCourseAction,
    initialState
  );
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      const t = setTimeout(() => router.push(redirectTo), 1000);
      return () => clearTimeout(t);
    }
  }, [state?.success, router, redirectTo]);

  if (state?.success) {
    return (
      <div className="flex items-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700 ring-1 ring-green-100">
        <CheckCircle2 size={18} /> Kurs oluşturuldu, yönlendiriliyorsunuz...
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5 rounded-2xl border border-ink-100 bg-white p-7 shadow-sm">
      {state?.error && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-100">
          <AlertCircle size={16} /> {state.error}
        </div>
      )}

      <div>
        <label className="text-sm font-semibold text-ink-900">Kurs Başlığı</label>
        <input
          name="title"
          required
          placeholder="Örn: İngilizce B1 Seviye Konuşma Kursu"
          className="mt-1.5 w-full rounded-xl border border-ink-100 px-4 py-2.5 text-sm outline-none ring-brand-500 focus:ring-2"
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className="text-sm font-semibold text-ink-900">Dil</label>
          <input
            name="language"
            required
            defaultValue="İngilizce"
            className="mt-1.5 w-full rounded-xl border border-ink-100 px-4 py-2.5 text-sm outline-none ring-brand-500 focus:ring-2"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-ink-900">Seviye</label>
          <select
            name="level"
            className="mt-1.5 w-full rounded-xl border border-ink-100 px-4 py-2.5 text-sm outline-none ring-brand-500 focus:ring-2"
          >
            {CEFR.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>
      </div>

      {teachers && (
        <div>
          <label className="text-sm font-semibold text-ink-900">Eğitmen</label>
          <select
            name="teacherId"
            className="mt-1.5 w-full rounded-xl border border-ink-100 px-4 py-2.5 text-sm outline-none ring-brand-500 focus:ring-2"
          >
            {teachers.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="text-sm font-semibold text-ink-900">Kısa Açıklama</label>
        <input
          name="shortDescription"
          placeholder="Kurs kartlarında görünecek kısa özet"
          maxLength={200}
          className="mt-1.5 w-full rounded-xl border border-ink-100 px-4 py-2.5 text-sm outline-none ring-brand-500 focus:ring-2"
        />
      </div>

      <div>
        <label className="text-sm font-semibold text-ink-900">Detaylı Açıklama</label>
        <textarea
          name="description"
          required
          rows={5}
          className="mt-1.5 w-full resize-none rounded-xl border border-ink-100 px-4 py-2.5 text-sm outline-none ring-brand-500 focus:ring-2"
        />
      </div>

      <div>
        <label className="text-sm font-semibold text-ink-900">
          Fiyat (₺) <span className="font-normal text-ink-400">— 0 girerseniz ücretsiz olur</span>
        </label>
        <input
          name="price"
          type="number"
          min={0}
          defaultValue={0}
          className="mt-1.5 w-full rounded-xl border border-ink-100 px-4 py-2.5 text-sm outline-none ring-brand-500 focus:ring-2"
        />
      </div>

      <Button type="submit" disabled={pending} className="w-full sm:w-auto">
        {pending ? <Loader2 size={16} className="animate-spin" /> : <BookPlus size={16} />}
        Kursu Oluştur
      </Button>
    </form>
  );
}
