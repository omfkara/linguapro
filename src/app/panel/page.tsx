import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function PanelIndexPage() {
  const session = await auth();
  if (!session?.user) redirect("/giris");

  switch (session.user.role) {
    case "ADMIN":
      redirect("/panel/yonetim");
    case "TEACHER":
      redirect("/panel/ogretmen");
    default:
      redirect("/panel/ogrenci");
  }
}
