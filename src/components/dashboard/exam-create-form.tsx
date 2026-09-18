"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2, Loader2, ClipboardPlus } from "lucide-react";
import { createExamAction, type FormState } from "@/lib/actions/exam-actions";
import { Button } from "@/components/ui/button";

const initialState: FormState = {};

export function ExamCreateForm({
  courses,
  redirectTo,
}: {
  courses: { id: string; title: string }[];
  redirectTo: string;
}) {
  const [state, formAction, pending] = useActionState(createExamAction, initialState);
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      const t = setTimeout(() => router.push(redirectTo), 900);
      return () => clearTimeout(t);
    }
  }, [state?.success, router, redirectTo]);

  if (state?.success) {
    return (
      <div className="flex items-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700 ring-1 ring-green-100">
        <CheckCircle2 size={18} /> Sınav oluşturuldu, yönlendiriliyorsunuz...
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
        <label className="text-sm font-semibold text-ink-900">Sınav Başlığı</label>
        <input
          name="title"
          required
          placeholder="Örn: Ünite 3 Değerlendirme Sınavı"
          className="mt-1.5 w-full rounded-xl border border-ink-100 px-4 py-2.5 text-sm outline-none ring-brand-500 focus:ring-2"
        />
      </div>

      <div>
        <label className="text-sm font-semibold text-ink-900">Bağlı Kurs</label>
        <select
          name="courseId"
          required
          className="mt-1.5 w-full rounded-xl border border-ink-100 px-4 py-2.5 text-sm outline-none ring-brand-500 focus:ring-2"
        >
          {courses.length === 0 && <option value="">Önce bir kurs oluşturun</option>}
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-sm font-semibold text-ink-900">Açıklama</label>
        <textarea
          name="description"
          rows={3}
          className="mt-1.5 w-full resize-none rounded-xl border border-ink-100 px-4 py-2.5 text-sm outline-none ring-brand-500 focus:ring-2"
        />
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div>
          <label className="text-sm font-semibold text-ink-900">Süre (dakika)</label>
          <input
            name="durationMinutes"
            type="number"
            min={1}
            defaultValue={30}
            className="mt-1.5 w-full rounded-xl border border-ink-100 px-4 py-2.5 text-sm outline-none ring-brand-500 focus:ring-2"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-ink-900">Geçme Notu (%)</label>
          <input
            name="passingScore"
            type="number"
            min={0}
            max={100}
            defaultValue={60}
            className="mt-1.5 w-full rounded-xl border border-ink-100 px-4 py-2.5 text-sm outline-none ring-brand-500 focus:ring-2"
          />
        </div>
      </div>

      <Button type="submit" disabled={pending || courses.length === 0} className="w-full sm:w-auto">
        {pending ? <Loader2 size={16} className="animate-spin" /> : <ClipboardPlus size={16} />}
        Sınavı Oluştur
      </Button>
    </form>
  );
}
