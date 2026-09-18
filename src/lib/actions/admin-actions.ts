"use server";

import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/db";
import { users, contactMessages } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { hashPassword, isStrongPassword } from "@/lib/password";

export type FormState = { error?: string; success?: boolean };

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/giris");
  }
  return session;
}

const createUserSchema = z.object({
  name: z.string().min(2, "Ad soyad en az 2 karakter olmalı."),
  email: z.string().email("Geçerli bir e-posta girin."),
  password: z.string().min(8, "Parola en az 8 karakter olmalı."),
  role: z.enum(["ADMIN", "TEACHER", "STUDENT"]),
});

export async function createUserByAdminAction(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  await requireAdmin();

  const parsed = createUserSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Geçersiz bilgiler." };
  }

  if (!isStrongPassword(parsed.data.password)) {
    return {
      error: "Parola en az 8 karakter, bir büyük harf ve bir rakam içermelidir.",
    };
  }

  const email = parsed.data.email.toLowerCase().trim();
  const [existing] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existing) {
    return { error: "Bu e-posta adresiyle zaten bir kullanıcı mevcut." };
  }

  const passwordHash = await hashPassword(parsed.data.password);

  await db.insert(users).values({
    name: parsed.data.name.trim(),
    email,
    passwordHash,
    role: parsed.data.role,
  });

  revalidatePath("/panel/yonetim/kullanicilar");
  return { success: true };
}

export async function toggleUserActiveAction(userId: string) {
  await requireAdmin();
  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user) return;
  await db.update(users).set({ isActive: !user.isActive }).where(eq(users.id, userId));
  revalidatePath("/panel/yonetim/kullanicilar");
}

export async function deleteUserAction(userId: string) {
  const session = await requireAdmin();
  if (session.user.id === userId) return; // kendi hesabını silemez
  await db.delete(users).where(eq(users.id, userId));
  revalidatePath("/panel/yonetim/kullanicilar");
}

export async function markMessageReadAction(messageId: string) {
  await requireAdmin();
  await db
    .update(contactMessages)
    .set({ isRead: true })
    .where(eq(contactMessages.id, messageId));
  revalidatePath("/panel/yonetim/mesajlar");
}

export async function deleteMessageAction(messageId: string) {
  await requireAdmin();
  await db.delete(contactMessages).where(eq(contactMessages.id, messageId));
  revalidatePath("/panel/yonetim/mesajlar");
}
