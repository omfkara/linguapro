import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { DashboardShell } from "@/components/dashboard/shell";

export default async function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user || (session.user.role !== "TEACHER" && session.user.role !== "ADMIN")) {
    redirect("/giris");
  }

  return (
    <DashboardShell
      role="teacher"
      roleLabel="Eğitmen Paneli"
      userName={session.user.name ?? "Eğitmen"}
      userEmail={session.user.email ?? ""}
    >
      {children}
    </DashboardShell>
  );
}
