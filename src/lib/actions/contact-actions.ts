"use server";

import { z } from "zod";
import { db } from "@/db";
import { contactMessages } from "@/db/schema";

const contactSchema = z.object({
  name: z.string().min(2, "Ad soyad en az 2 karakter olmalı."),
  email: z.string().email("Geçerli bir e-posta adresi girin."),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(10, "Mesajınız en az 10 karakter olmalı."),
  // Honeypot: botlar bu gizli alanı doldurur, insanlar doldurmaz.
  website: z.string().max(0).optional(),
});

export type ContactState = {
  error?: string;
  success?: boolean;
};

export async function submitContactAction(
  _prev: ContactState,
  formData: FormData
): Promise<ContactState> {
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    subject: formData.get("subject") || undefined,
    message: formData.get("message"),
    website: formData.get("website") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Geçersiz bilgiler." };
  }

  // Honeypot dolu ise sessizce "başarılı" dönerek botu oyalıyoruz.
  if (parsed.data.website) {
    return { success: true };
  }

  await db.insert(contactMessages).values({
    name: parsed.data.name.trim(),
    email: parsed.data.email.toLowerCase().trim(),
    phone: parsed.data.phone?.trim(),
    subject: parsed.data.subject?.trim(),
    message: parsed.data.message.trim(),
  });

  return { success: true };
}
