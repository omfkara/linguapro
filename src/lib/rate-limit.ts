import { db } from "@/db";
import { loginAttempts } from "@/db/schema";
import { and, gte, eq, lt } from "drizzle-orm";

const WINDOW_MS = 10 * 60 * 1000; // 10 dakika
const MAX_ATTEMPTS = 8;

/**
 * Basit ama etkili brute-force koruması: aynı e-posta/IP için son 10
 * dakikada 8'den fazla başarısız giriş denemesi varsa reddedilir.
 */
export async function isRateLimited(identifier: string): Promise<boolean> {
  const since = new Date(Date.now() - WINDOW_MS);
  const attempts = await db
    .select({ id: loginAttempts.id })
    .from(loginAttempts)
    .where(
      and(
        eq(loginAttempts.identifier, identifier),
        gte(loginAttempts.createdAt, since)
      )
    );
  return attempts.length >= MAX_ATTEMPTS;
}

export async function recordFailedAttempt(identifier: string): Promise<void> {
  await db.insert(loginAttempts).values({ identifier });
}

export async function clearAttempts(identifier: string): Promise<void> {
  const cutoff = new Date(Date.now() - WINDOW_MS);
  await db
    .delete(loginAttempts)
    .where(
      and(
        eq(loginAttempts.identifier, identifier),
        lt(loginAttempts.createdAt, new Date())
      )
    );
  void cutoff;
}
