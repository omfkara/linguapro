import Link from "next/link";
import { auth } from "@/auth";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { db } from "@/db";
import { enrollments, examAttempts, courses, exams } from "@/db/schema";
import { eq, and, desc, count } from "drizzle-orm";
import { BookOpen, Award, Gauge, TrendingUp, ArrowRight } from "lucide-react";
import { LEVEL_DESCRIPTIONS } from "@/lib/exam-scoring";

export const metadata = { title: "Öğrenci Paneli" };

export default async function StudentOverviewPage() {
  const session = await auth();
  const studentId = session!.user.id;

  const [{ value: courseCount }] = await db
    .select({ value: count() })
    .from(enrollments)
    .where(eq(enrollments.studentId, studentId));

  const [{ value: attemptCount }] = await db
    .select({ value: count() })
    .from(examAttempts)
    .where(eq(examAttempts.studentId, studentId));

  const [levelResult] = await db
    .select({
      resultLevel: examAttempts.resultLevel,
      scorePercent: examAttempts.scorePercent,
      completedAt: examAttempts.completedAt,
    })
    .from(examAttempts)
    .innerJoin(exams, eq(examAttempts.examId, exams.id))
    .where(and(eq(examAttempts.studentId, studentId), eq(exams.type, "LEVEL_TEST")))
    .orderBy(desc(examAttempts.completedAt))
    .limit(1);

  const recentCourses = await db
    .select({
      id: courses.id,
      title: courses.title,
      progressPercent: enrollments.progressPercent,
    })
    .from(enrollments)
    .innerJoin(courses, eq(enrollments.courseId, courses.id))
    .where(eq(enrollments.studentId, studentId))
    .orderBy(desc(enrollments.enrolledAt))
    .limit(4);

  return (
    <div>
      <DashboardPageHeader
        title={`Merhaba, ${session?.user.name?.split(" ")[0]} 👋`}
        description="Öğrenme yolculuğunuzun genel görünümü."
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <StatCard icon={BookOpen} label="Kayıtlı Kurs" value={courseCount} />
        <StatCard icon={Award} label="Tamamlanan Sınav" value={attemptCount} />
        <StatCard
          icon={Gauge}
          label="Mevcut Seviyeniz"
          value={levelResult?.resultLevel ?? "Belirlenmedi"}
        />
      </div>

      {!levelResult && (
        <Link
          href="/panel/ogrenci/seviye-testi"
          className="mt-6 flex items-center justify-between gap-4 rounded-2xl bg-gradient-to-br from-brand-600 to-ink-950 px-6 py-5 text-white shadow-lg shadow-brand-900/20 transition hover:-translate-y-0.5"
        >
          <div className="flex items-center gap-3">
            <Gauge size={22} />
            <div>
              <p className="font-display text-sm font-bold">
                Seviyenizi henüz öğrenmediniz
              </p>
              <p className="text-xs text-ink-100/80">
                Ücretsiz seviye tespit sınavına girerek size özel kurslar keşfedin.
              </p>
            </div>
          </div>
          <ArrowRight size={18} />
        </Link>
      )}

      {levelResult?.resultLevel && (
        <div className="mt-6 rounded-2xl border border-ink-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-bold text-brand-600">
            <TrendingUp size={16} /> Seviye Tespit Sonucunuz: {levelResult.resultLevel}
          </div>
          <p className="mt-2 text-sm text-ink-600">
            {LEVEL_DESCRIPTIONS[levelResult.resultLevel as keyof typeof LEVEL_DESCRIPTIONS]}
          </p>
        </div>
      )}

      <div className="mt-10">
        <h2 className="font-display text-lg font-bold text-ink-950">Kurslarım</h2>
        {recentCourses.length === 0 ? (
          <p className="mt-3 text-sm text-ink-500">
            Henüz bir kursa kayıt olmadınız.{" "}
            <Link href="/kurslar" className="font-semibold text-brand-600 hover:underline">
              Kursları keşfedin →
            </Link>
          </p>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {recentCourses.map((c) => (
              <Link
                key={c.id}
                href={`/panel/ogrenci/kurslar/${c.id}`}
                className="rounded-2xl border border-ink-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <p className="font-display text-sm font-bold text-ink-950">{c.title}</p>
                <div className="mt-3 flex items-center gap-2">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink-100">
                    <div
                      className="h-full rounded-full bg-brand-500"
                      style={{ width: `${c.progressPercent}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-ink-600">
                    %{c.progressPercent}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
