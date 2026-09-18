import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { DashboardShell } from "@/components/dashboard/shell";

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user || session.user.role !== "STUDENT") {
    redirect("/giris");
  }

  return (
    <DashboardShell
      role="student"
      roleLabel="Öğrenci Paneli"
      userName={session.user.name ?? "Öğrenci"}
      userEmail={session.user.email ?? ""}
    >
      {children}
    </DashboardShell>
  );
}
