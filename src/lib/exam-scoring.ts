import type { CEFR_LEVELS } from "@/lib/site-config";

type Level = (typeof CEFR_LEVELS)[number];

/**
 * Seviye tespit sınavı sonucunu CEFR seviyesine çevirir.
 * Yüzdelik dilim bantlarına göre basit ama tutarlı bir eşleme kullanılır.
 */
export function scoreToLevel(scorePercent: number): Level {
  if (scorePercent < 20) return "A1";
  if (scorePercent < 36) return "A2";
  if (scorePercent < 52) return "B1";
  if (scorePercent < 68) return "B2";
  if (scorePercent < 85) return "C1";
  return "C2";
}

export const LEVEL_DESCRIPTIONS: Record<Level, string> = {
  A1: "Temel düzey: Günlük hayattaki basit ifadeleri anlayabilir ve kullanabilirsiniz.",
  A2: "Temel düzey: Sık kullanılan cümleleri anlayıp basit iletişim kurabilirsiniz.",
  B1: "Orta düzey: Tanıdık konularda kendinizi anlaşılır şekilde ifade edebilirsiniz.",
  B2: "Orta düzey: Karmaşık metinleri anlayabilir, akıcı iletişim kurabilirsiniz.",
  C1: "İleri düzey: Zorlu metinleri anlayabilir, esnek ve etkili ifade edebilirsiniz.",
  C2: "İleri düzey: Duyduğunuz ve okuduğunuz hemen her şeyi kolaylıkla anlayabilirsiniz.",
};
