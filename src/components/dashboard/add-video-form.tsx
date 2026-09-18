"use client";

import { useActionState } from "react";
import { AlertCircle, CheckCircle2, Loader2, PlusCircle } from "lucide-react";
import { addVideoAction, type FormState } from "@/lib/actions/course-actions";
import { Button } from "@/components/ui/button";

const initialState: FormState = {};

export function AddVideoForm({ courseId }: { courseId: string }) {
  const action = addVideoAction.bind(null, courseId);
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="space-y-4 rounded-2xl border border-ink-100 bg-white p-6 shadow-sm">
      <h3 className="font-display text-sm font-bold text-ink-950">Yeni Video Ekle</h3>

      {state?.error && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2.5 text-xs text-red-700 ring-1 ring-red-100">
          <AlertCircle size={14} /> {state.error}
        </div>
      )}
      {state?.success && (
        <div className="flex items-center gap-2 rounded-xl bg-green-50 px-3 py-2.5 text-xs text-green-700 ring-1 ring-green-100">
          <CheckCircle2 size={14} /> Video eklendi.
        </div>
      )}

      <div>
        <label className="text-xs font-semibold text-ink-900">Video Başlığı</label>
        <input
          name="title"
          required
          className="mt-1 w-full rounded-lg border border-ink-100 px-3 py-2 text-sm outline-none ring-brand-500 focus:ring-2"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-ink-900">Kaynak</label>
          <select
            name="provider"
            className="mt-1 w-full rounded-lg border border-ink-100 px-3 py-2 text-sm outline-none ring-brand-500 focus:ring-2"
          >
            <option value="youtube">YouTube</option>
            <option value="vimeo">Vimeo</option>
            <option value="diger">Diğer</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-ink-900">Süre (saniye)</label>
          <input
            name="durationSeconds"
            type="number"
            min={0}
            defaultValue={0}
            className="mt-1 w-full rounded-lg border border-ink-100 px-3 py-2 text-sm outline-none ring-brand-500 focus:ring-2"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-ink-900">Video Bağlantısı</label>
        <input
          name="videoUrl"
          required
          placeholder="https://www.youtube.com/watch?v=..."
          className="mt-1 w-full rounded-lg border border-ink-100 px-3 py-2 text-sm outline-none ring-brand-500 focus:ring-2"
        />
      </div>

      <label className="flex items-center gap-2 text-xs font-semibold text-ink-700">
        <input type="checkbox" name="isFreePreview" className="rounded" />
        Ücretsiz önizleme olarak işaretle
      </label>

      <Button type="submit" size="sm" disabled={pending} className="w-full sm:w-auto">
        {pending ? <Loader2 size={14} className="animate-spin" /> : <PlusCircle size={14} />}
        Videoyu Ekle
      </Button>
    </form>
  );
}
