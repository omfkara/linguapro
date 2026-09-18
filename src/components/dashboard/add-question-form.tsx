"use client";

import { useActionState } from "react";
import { AlertCircle, CheckCircle2, Loader2, PlusCircle } from "lucide-react";
import { addQuestionAction, type FormState } from "@/lib/actions/exam-actions";
import { Button } from "@/components/ui/button";

const initialState: FormState = {};
const CEFR = ["A1", "A2", "B1", "B2", "C1", "C2"];

export function AddQuestionForm({
  examId,
  isLevelTest,
}: {
  examId: string;
  isLevelTest?: boolean;
}) {
  const action = addQuestionAction.bind(null, examId);
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="space-y-4 rounded-2xl border border-ink-100 bg-white p-6 shadow-sm">
      <h3 className="font-display text-sm font-bold text-ink-950">Yeni Soru Ekle</h3>

      {state?.error && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2.5 text-xs text-red-700 ring-1 ring-red-100">
          <AlertCircle size={14} /> {state.error}
        </div>
      )}
      {state?.success && (
        <div className="flex items-center gap-2 rounded-xl bg-green-50 px-3 py-2.5 text-xs text-green-700 ring-1 ring-green-100">
          <CheckCircle2 size={14} /> Soru eklendi.
        </div>
      )}

      <div>
        <label className="text-xs font-semibold text-ink-900">Soru Metni</label>
        <textarea
          name="text"
          required
          rows={2}
          className="mt-1 w-full resize-none rounded-lg border border-ink-100 px-3 py-2 text-sm outline-none ring-brand-500 focus:ring-2"
        />
      </div>

      <div className="space-y-2">
        {["A", "B", "C", "D"].map((letter, i) => (
          <div key={letter} className="flex items-center gap-2">
            <label className="flex items-center gap-1.5 text-xs font-bold text-ink-500">
              <input
                type="radio"
                name="correctAnswerIndex"
                value={i}
                required
                defaultChecked={i === 0}
              />
              {letter}
            </label>
            <input
              name={`option${letter}`}
              required
              placeholder={`Şık ${letter}`}
              className="flex-1 rounded-lg border border-ink-100 px-3 py-2 text-sm outline-none ring-brand-500 focus:ring-2"
            />
          </div>
        ))}
        <p className="text-[11px] text-ink-400">
          Doğru cevabın yanındaki radyo düğmesini işaretleyin.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-ink-900">Puan</label>
          <input
            name="points"
            type="number"
            min={1}
            defaultValue={1}
            className="mt-1 w-full rounded-lg border border-ink-100 px-3 py-2 text-sm outline-none ring-brand-500 focus:ring-2"
          />
        </div>
        {isLevelTest && (
          <div>
            <label className="text-xs font-semibold text-ink-900">Hedef Seviye</label>
            <select
              name="targetLevel"
              className="mt-1 w-full rounded-lg border border-ink-100 px-3 py-2 text-sm outline-none ring-brand-500 focus:ring-2"
            >
              {CEFR.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <Button type="submit" size="sm" disabled={pending} className="w-full sm:w-auto">
        {pending ? <Loader2 size={14} className="animate-spin" /> : <PlusCircle size={14} />}
        Soruyu Ekle
      </Button>
    </form>
  );
}
