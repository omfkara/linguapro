"use server";

import { z } from "zod";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { hashPassword, isStrongPassword } from "@/lib/password";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

const registerSchema = z.object({
  name: z.string().min(2, "Ad soyad en az 2 karakter olmalı."),
  email: z.string().email("Geçerli bir e-posta adresi girin."),
  password: z.string().min(8, "Parola en az 8 karakter olmalı."),
});

export type RegisterState = {
  error?: string;
  success?: boolean;
};

export async function registerStudentAction(
  _prev: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Geçersiz bilgiler." };
  }

  const { name, email, password } = parsed.data;

  if (!isStrongPassword(password)) {
    return {
      error:
        "Parolanız en az 8 karakter olmalı ve büyük harf, küçük harf ile rakam içermelidir.",
    };
  }

  const normalizedEmail = email.toLowerCase().trim();

  const [existing] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, normalizedEmail))
    .limit(1);

  if (existing) {
    return { error: "Bu e-posta adresi ile zaten bir hesap mevcut." };
  }

  const passwordHash = await hashPassword(password);

  await db.insert(users).values({
    name: name.trim(),
    email: normalizedEmail,
    passwordHash,
    role: "STUDENT",
  });

  try {
    await signIn("credentials", {
      email: normalizedEmail,
      password,
      redirect: false,
    });
  } catch {
    // Otomatik giriş başarısız olsa bile kayıt tamamlandı; kullanıcı manuel giriş yapabilir.
  }

  return { success: true };
}

export type LoginState = {
  error?: string;
};

export async function loginAction(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = formData.get("email");
  const password = formData.get("password");
  const callbackUrl = (formData.get("callbackUrl") as string) || "/panel";

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl,
    });
    return {};
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.type === "CredentialsSignin") {
        return { error: "E-posta veya parola hatalı." };
      }
      return { error: error.message || "Giriş sırasında bir hata oluştu." };
    }
    // NEXT_REDIRECT hatası başarılı girişte fırlatılır; yeniden fırlatılmalı.
    throw error;
  }
}
