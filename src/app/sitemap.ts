import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site-config";
import { db } from "@/db";
import { courses } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE.url}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE.url}/hakkimizda`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE.url}/hizmetler`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE.url}/kurslar`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE.url}/seviye-tespit-sinavi`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE.url}/iletisim`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${SITE.url}/giris`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE.url}/kayit`, changeFrequency: "yearly", priority: 0.4 },
  ];

  let courseRoutes: MetadataRoute.Sitemap = [];
  try {
    const published = await db
      .select({ slug: courses.slug, updatedAt: courses.updatedAt })
      .from(courses)
      .where(eq(courses.published, true));
    courseRoutes = published.map((c) => ({
      url: `${SITE.url}/kurslar/${c.slug}`,
      lastModified: c.updatedAt,
      changeFrequency: "weekly",
      priority: 0.8,
    }));
  } catch {
    // Derleme zamanında DB erişilemezse statik rotalarla devam edilir.
  }

  return [...staticRoutes, ...courseRoutes];
}
