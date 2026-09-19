"use server";

import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/db";
import { siteSettings } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { SiteSettings } from "@/lib/queries/settings";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/giris");
  }
  return session;
}

const languageSchema = z.object({
  name: z.string().min(1),
  flag: z.string().min(1),
  students: z.string().min(1),
});

const heroSlideSchema = z.object({
  eyebrow: z.string().min(1),
  title: z.string().min(1),
  highlight: z.string().min(1),
  titleEnd: z.string().min(1),
  description: z.string().min(1),
  statValue: z.string().min(1),
  statLabel: z.string().min(1),
});

const statSchema = z.object({
  value: z.number(),
  suffix: z.string(),
  label: z.string().min(1),
});

const stepSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
});

const settingsSchema = z.object({
  logoUrl: z.string(),
  siteName: z.string().min(1, "Site adı boş olamaz."),
  shortName: z.string().min(1, "Kısa ad boş olamaz."),
  tagline: z.string().min(1),
  description: z.string().min(1),

  phone: z.string(),
  email: z.string(),
  address: z.string(),
  instagramUrl: z.string(),
  youtubeUrl: z.string(),
  linkedinUrl: z.string(),

  languages: z.array(languageSchema).min(1, "En az bir dil ekleyin."),
  heroSlides: z.array(heroSlideSchema).min(1, "En az bir slayt ekleyin."),
  stats: z.array(statSchema).length(4, "İstatistik kutuları tam olarak 4 adet olmalı."),

  howItWorksEyebrow: z.string().min(1),
  howItWorksTitle: z.string().min(1),
  howItWorksSteps: z.array(stepSchema).length(4, "Adımlar tam olarak 4 adet olmalı."),

  levelTestEyebrow: z.string().min(1),
  levelTestTitle: z.string().min(1),
  levelTestDescription: z.string().min(1),
  levelTestReadyTitle: z.string().min(1),
  levelTestNotReadyTitle: z.string().min(1),
  levelTestLoggedInText: z.string().min(1),
  levelTestGuestText: z.string().min(1),

  seoTitles: z.record(z.string(), z.string()),
  seoDescriptions: z.record(z.string(), z.string()),
});

export async function updateSiteSettingsAction(
  data: SiteSettings
): Promise<{ success?: boolean; error?: string }> {
  await requireAdmin();

  const parsed = settingsSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Geçersiz veri." };
  }
  const v = parsed.data;

  await db
    .insert(siteSettings)
    .values({ id: 1, ...v, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: siteSettings.id,
      set: { ...v, updatedAt: new Date() },
    });

  // Ayarları okuyan tüm herkese açık sayfaları yeniden oluştur.
  revalidatePath("/", "layout");

  return { success: true };
}
