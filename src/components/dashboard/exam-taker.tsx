"use client";

import { useState, useTransition, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  Award,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { submitExamAction } from "@/lib/actions/exam-actions";
import { Button } from "@/components/ui/button";
import { LEVEL_DESCRIPTIONS } from "@/lib/exam-scoring";
import { cn } from "@/lib/utils";

interface Question {
  id: string;
  text: string;
  options: string[];
}

export function ExamTaker({
  examId,
  title,
  durationMinutes,
  questions,
  isLevelTest,
  resultRedirect,
}: {
  examId: string;
  title: string;
  durationMinutes: number;
  questions: Question[];
  isLevelTest: boolean;
  resultRedirect: string;
}) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(durationMinutes * 60);
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<{
    scorePercent: number;
    passed: boolean;
    resultLevel?: string;
  } | null>(null);
  const router = useRouter();

  const handleSubmit = useCallback(() => {
    if (result || pending) return;
    startTransition(async () => {
      const res = await submitExamAction(examId, answers);
      setResult(res);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answers, examId, pending, result]);

  useEffect(() => {
    if (result) return;
    const t = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(t);
          handleSubmit();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [result, handleSubmit]);

  if (result) {
    const level = result.resultLevel as keyof typeof LEVEL_DESCRIPTIONS | undefined;
    return (
      <div className="mx-auto max-w-lg rounded-3xl border border-ink-100 bg-white p-8 text-center shadow-lg">
        <div
          className={cn(
            "mx-auto flex h-16 w-16 items-center justify-center rounded-full",
            result.passed || isLevelTest
              ? "bg-green-50 text-success"
              : "bg-red-50 text-danger"
          )}
        >
          {result.passed || isLevelTest ? <Award size={32} /> : <XCircle size={32} />}
        </div>
        <h2 className="mt-5 font-display text-2xl font-bold text-ink-950">
          {isLevelTest ? "Seviye Tespit Sonucunuz" : result.passed ? "Tebrikler, Başarılı!" : "Sınav Tamamlandı"}
        </h2>

        {isLevelTest && level ? (
          <>
            <p className="mt-3 font-display text-5xl font-bold text-brand-600">{level}</p>
            <p className="mt-3 text-sm text-ink-600">{LEVEL_DESCRIPTIONS[level]}</p>
          </>
        ) : (
          <p className="mt-3 text-lg text-ink-600">
            Puanınız: <span className="font-bold text-ink-950">%{result.scorePercent}</span>
          </p>
        )}

        <Button size="lg" className="mt-8 w-full" onClick={() => router.push(resultRedirect)}>
          Devam Et
        </Button>
      </div>
    );
  }

  const q = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center justify-between rounded-2xl border border-ink-100 bg-white px-5 py-3.5 shadow-sm">
        <div>
          <p className="text-sm font-bold text-ink-950">{title}</p>
          <p className="text-xs text-ink-500">
            Soru {currentIndex + 1} / {questions.length} · {answeredCount} cevaplandı
          </p>
        </div>
        <div
          className={cn(
            "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold",
            secondsLeft < 60 ? "bg-red-50 text-danger" : "bg-brand-50 text-brand-700"
          )}
        >
          <Clock size={14} />
          {minutes}:{seconds.toString().padStart(2, "0")}
        </div>
      </div>

      <div className="mb-6 h-1.5 w-full overflow-hidden rounded-full bg-ink-100">
        <div
          className="h-full rounded-full bg-brand-500 transition-all"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {q && (
        <div className="rounded-2xl border border-ink-100 bg-white p-7 shadow-sm">
          <p className="font-display text-lg font-bold text-ink-950">{q.text}</p>
          <div className="mt-5 space-y-2.5">
            {q.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: i }))}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl border p-3.5 text-left text-sm font-medium transition",
                  answers[q.id] === i
                    ? "border-brand-400 bg-brand-50 text-brand-900"
                    : "border-ink-100 hover:border-ink-200 hover:bg-ink-50"
                )}
              >
                <span
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold",
                    answers[q.id] === i
                      ? "border-brand-500 bg-brand-500 text-white"
                      : "border-ink-300 text-ink-500"
                  )}
                >
                  {answers[q.id] === i ? <CheckCircle2 size={14} /> : String.fromCharCode(65 + i)}
                </span>
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 flex items-center justify-between">
        <button
          onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
          disabled={currentIndex === 0}
          className="flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-ink-600 disabled:opacity-30"
        >
          <ChevronLeft size={16} /> Önceki
        </button>

        {currentIndex === questions.length - 1 ? (
          <Button onClick={handleSubmit} disabled={pending}>
            {pending && <Loader2 size={16} className="animate-spin" />}
            Sınavı Bitir
          </Button>
        ) : (
          <button
            onClick={() => setCurrentIndex((i) => Math.min(questions.length - 1, i + 1))}
            className="flex items-center gap-1.5 rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Sonraki <ChevronRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
