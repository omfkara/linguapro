import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { db } from "@/db";
import { contactMessages } from "@/db/schema";
import { desc } from "drizzle-orm";
import { markMessageReadAction, deleteMessageAction } from "@/lib/actions/admin-actions";
import { MessageSquare, Trash2, Mail, MailOpen } from "lucide-react";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Mesajlar" };

export default async function AdminMessagesPage() {
  const messages = await db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));

  return (
    <div>
      <DashboardPageHeader
        title="İletişim Mesajları"
        description="İletişim formu üzerinden gelen talepleri buradan yönetin."
      />

      {messages.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="Henüz mesaj yok"
          description="İletişim formu üzerinden gelen mesajlar burada görünecek."
        />
      ) : (
        <div className="space-y-3">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`rounded-2xl border p-5 shadow-sm ${
                m.isRead ? "border-ink-100 bg-white" : "border-brand-200 bg-brand-50/40"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="flex items-center gap-2 font-display text-sm font-bold text-ink-950">
                    {m.isRead ? (
                      <MailOpen size={15} className="text-ink-400" />
                    ) : (
                      <Mail size={15} className="text-brand-600" />
                    )}
                    {m.name}
                  </p>
                  <p className="text-xs text-ink-500">
                    {m.email} {m.phone && `· ${m.phone}`}
                  </p>
                  {m.subject && (
                    <p className="mt-1 text-xs font-semibold text-brand-700">{m.subject}</p>
                  )}
                </div>
                <span className="text-xs text-ink-400">{formatDate(m.createdAt)}</span>
              </div>
              <p className="mt-3 text-sm text-ink-700">{m.message}</p>
              <div className="mt-4 flex items-center gap-2 border-t border-ink-100 pt-3">
                {!m.isRead && (
                  <form action={markMessageReadAction.bind(null, m.id)}>
                    <button
                      type="submit"
                      className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-brand-600 hover:bg-brand-50"
                    >
                      Okundu İşaretle
                    </button>
                  </form>
                )}
                <form action={deleteMessageAction.bind(null, m.id)} className="ml-auto">
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                  >
                    <Trash2 size={14} /> Sil
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
