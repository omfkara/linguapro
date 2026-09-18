import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { DashboardShell } from "@/components/dashboard/shell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/giris");
  }

  return (
    <DashboardShell
      role="admin"
      roleLabel="Yönetim Paneli"
      userName={session.user.name ?? "Yönetici"}
      userEmail={session.user.email ?? ""}
    >
      {children}
    </DashboardShell>
  );
}
