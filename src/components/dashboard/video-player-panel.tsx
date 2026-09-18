"use client";

import { useState, useTransition } from "react";
import { PlayCircle, CheckCircle2, Circle, Loader2 } from "lucide-react";
import { markVideoCompletedAction } from "@/lib/actions/progress-actions";
import { cn, formatDuration } from "@/lib/utils";

interface VideoItem {
  id: string;
  title: string;
  videoUrl: string;
  durationSeconds: number | null;
  completed: boolean;
}

export function VideoPlayerPanel({
  courseId,
  videos,
}: {
  courseId: string;
  videos: VideoItem[];
}) {
  const [activeId, setActiveId] = useState(videos[0]?.id);
  const [completedIds, setCompletedIds] = useState(
    new Set(videos.filter((v) => v.completed).map((v) => v.id))
  );
  const [pending, startTransition] = useTransition();

  const active = videos.find((v) => v.id === activeId) ?? videos[0];

  function handleComplete() {
    if (!active) return;
    startTransition(async () => {
      await markVideoCompletedAction(active.id, courseId);
      setCompletedIds((prev) => new Set(prev).add(active.id));
    });
  }

  if (!active) {
    return (
      <p className="rounded-xl border border-dashed border-ink-200 p-8 text-center text-sm text-ink-500">
        Bu kursta henüz video bulunmuyor.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
      <div>
        <div className="aspect-video overflow-hidden rounded-2xl bg-ink-950 shadow-lg">
          <iframe
            key={active.id}
            src={active.videoUrl}
            title={active.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="h-full w-full"
          />
        </div>
        <div className="mt-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-lg font-bold text-ink-950">{active.title}</h2>
            {!!active.durationSeconds && (
              <p className="text-sm text-ink-500">{formatDuration(active.durationSeconds)}</p>
            )}
          </div>
          <button
            onClick={handleComplete}
            disabled={pending || completedIds.has(active.id)}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition",
              completedIds.has(active.id)
                ? "bg-green-50 text-green-700"
                : "bg-brand-600 text-white hover:bg-brand-700"
            )}
          >
            {pending ? (
              <Loader2 size={16} className="animate-spin" />
            ) : completedIds.has(active.id) ? (
              <CheckCircle2 size={16} />
            ) : null}
            {completedIds.has(active.id) ? "Tamamlandı" : "Tamamlandı Olarak İşaretle"}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-wide text-ink-400">
          Ders Listesi
        </p>
        {videos.map((v, i) => (
          <button
            key={v.id}
            onClick={() => setActiveId(v.id)}
            className={cn(
              "flex w-full items-center gap-3 rounded-xl border p-3 text-left transition",
              v.id === active.id
                ? "border-brand-300 bg-brand-50"
                : "border-ink-100 bg-white hover:bg-ink-50"
            )}
          >
            {completedIds.has(v.id) ? (
              <CheckCircle2 size={18} className="shrink-0 text-success" />
            ) : v.id === active.id ? (
              <PlayCircle size={18} className="shrink-0 text-brand-600" />
            ) : (
              <Circle size={18} className="shrink-0 text-ink-300" />
            )}
            <span className="flex-1 text-sm font-medium text-ink-900">
              {i + 1}. {v.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
