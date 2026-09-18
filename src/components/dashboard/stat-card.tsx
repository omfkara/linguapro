import type { LucideIcon } from "lucide-react";

export function StatCard({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
          <Icon size={19} />
        </div>
        <div>
          <p className="text-xs font-semibold text-ink-500">{label}</p>
          <p className="font-display text-xl font-bold text-ink-950">{value}</p>
        </div>
      </div>
      {hint && <p className="mt-3 text-xs text-ink-400">{hint}</p>}
    </div>
  );
}
