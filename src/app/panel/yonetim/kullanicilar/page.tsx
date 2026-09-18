import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { db } from "@/db";
import { users } from "@/db/schema";
import { desc } from "drizzle-orm";
import { CreateUserForm } from "./create-user-form";
import { toggleUserActiveAction, deleteUserAction } from "@/lib/actions/admin-actions";
import { Trash2, Power } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { auth } from "@/auth";

export const metadata = { title: "Kullanıcılar" };

const ROLE_LABELS: Record<string, string> = {
  ADMIN: "Yönetici",
  TEACHER: "Eğitmen",
  STUDENT: "Öğrenci",
};

const ROLE_COLORS: Record<string, string> = {
  ADMIN: "bg-purple-50 text-purple-700 ring-purple-200",
  TEACHER: "bg-blue-50 text-blue-700 ring-blue-200",
  STUDENT: "bg-green-50 text-green-700 ring-green-200",
};

export default async function AdminUsersPage() {
  const session = await auth();
  const allUsers = await db.select().from(users).orderBy(desc(users.createdAt));

  return (
    <div>
      <DashboardPageHeader
        title="Kullanıcılar"
        description="Öğrenci, eğitmen ve yönetici hesaplarını yönetin."
        action={<CreateUserForm />}
      />

      <div className="overflow-x-auto rounded-2xl border border-ink-100 bg-white shadow-sm">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-ink-100 bg-ink-50/60 text-xs font-bold uppercase tracking-wide text-ink-500">
            <tr>
              <th className="px-5 py-3">Kullanıcı</th>
              <th className="px-5 py-3">Rol</th>
              <th className="px-5 py-3">Durum</th>
              <th className="px-5 py-3">Kayıt Tarihi</th>
              <th className="px-5 py-3 text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {allUsers.map((u) => (
              <tr key={u.id}>
                <td className="px-5 py-3.5">
                  <p className="font-semibold text-ink-900">{u.name}</p>
                  <p className="text-xs text-ink-500">{u.email}</p>
                </td>
                <td className="px-5 py-3.5">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-bold ring-1 ring-inset ${ROLE_COLORS[u.role]}`}
                  >
                    {ROLE_LABELS[u.role]}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                      u.isActive
                        ? "bg-green-50 text-green-700"
                        : "bg-ink-100 text-ink-500"
                    }`}
                  >
                    {u.isActive ? "Aktif" : "Pasif"}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-ink-500">{formatDate(u.createdAt)}</td>
                <td className="px-5 py-3.5">
                  <div className="flex justify-end gap-2">
                    <form action={toggleUserActiveAction.bind(null, u.id)}>
                      <button
                        type="submit"
                        title={u.isActive ? "Pasifleştir" : "Aktifleştir"}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-500 hover:bg-ink-50 hover:text-brand-600"
                      >
                        <Power size={16} />
                      </button>
                    </form>
                    {session?.user.id !== u.id && (
                      <form action={deleteUserAction.bind(null, u.id)}>
                        <button
                          type="submit"
                          title="Sil"
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-500 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      </form>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
