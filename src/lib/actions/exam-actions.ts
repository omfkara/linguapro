"use server";

import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/db";
import { exams, questions, examAttempts, courses } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { scoreToLevel } from "@/lib/exam-scoring";

const CEFR = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;

export type FormState = { error?: string; success?: boolean };

async function requireStaff() {
  const session = await auth();
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "TEACHER")) {
    redirect("/giris");
  }
  return session;
}

async function assertExamAccess(examId: string) {
  const session = await requireStaff();
  const [exam] = await db.select().from(exams).where(eq(exams.id, examId)).limit(1);
  if (!exam) redirect("/panel");

  if (session.user.role === "TEACHER") {
    if (exam.type === "LEVEL_TEST") redirect("/panel/ogretmen/sinavlar");
    if (exam.courseId) {
      const [course] = await db
        .select({ teacherId: courses.teacherId })
        .from(courses)
        .where(eq(courses.id, exam.courseId))
        .limit(1);
      if (!course || course.teacherId !== session.user.id) {
        redirect("/panel/ogretmen/sinavlar");
      }
    }
  }
  return { session, exam };
}

const examSchema = z.object({
  title: z.string().min(3, "Başlık en az 3 karakter olmalı."),
  description: z.string().optional(),
  courseId: z.string().uuid().optional(),
  durationMinutes: z.coerce.number().min(1).max(240).default(30),
  passingScore: z.coerce.number().min(0).max(100).default(60),
});

export async function createExamAction(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const session = await requireStaff();

  const parsed = examSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    courseId: formData.get("courseId") || undefined,
    durationMinutes: formData.get("durationMinutes") || 30,
    passingScore: formData.get("passingScore") || 60,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Geçersiz bilgiler." };
  }

  if (parsed.data.courseId) {
    const [course] = await db
      .select({ teacherId: courses.teacherId })
      .from(courses)
      .where(eq(courses.id, parsed.data.courseId))
      .limit(1);
    if (
      !course ||
      (session.user.role === "TEACHER" && course.teacherId !== session.user.id)
    ) {
      return { error: "Bu kurs için sınav oluşturma yetkiniz yok." };
    }
  }

  await db.insert(exams).values({
    title: parsed.data.title,
    description: parsed.data.description,
    type: "COURSE_EXAM",
    courseId: parsed.data.courseId,
    createdById: session.user.id,
    durationMinutes: parsed.data.durationMinutes,
    passingScore: parsed.data.passingScore,
    published: false,
  });

  revalidatePath("/panel/ogretmen/sinavlar");
  revalidatePath("/panel/yonetim/sinavlar");
  return { success: true };
}

export async function createLevelTestAction(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/giris");
  }

  const [existing] = await db
    .select({ id: exams.id })
    .from(exams)
    .where(eq(exams.type, "LEVEL_TEST"))
    .limit(1);

  if (existing) {
    return { error: "Zaten bir seviye tespit sınavı mevcut." };
  }

  const title = (formData.get("title") as string) || "Genel Seviye Tespit Sınavı";
  const durationMinutes = Number(formData.get("durationMinutes")) || 20;

  await db.insert(exams).values({
    title,
    description: "CEFR standardına uygun seviye tespit sınavı.",
    type: "LEVEL_TEST",
    createdById: session.user.id,
    durationMinutes,
    passingScore: 0,
    published: false,
  });

  revalidatePath("/panel/yonetim/seviye-testi");
  return { success: true };
}

const questionSchema = z.object({
  text: z.string().min(3, "Soru metni en az 3 karakter olmalı."),
  optionA: z.string().min(1),
  optionB: z.string().min(1),
  optionC: z.string().min(1),
  optionD: z.string().min(1),
  correctAnswerIndex: z.coerce.number().min(0).max(3),
  points: z.coerce.number().min(1).default(1),
  targetLevel: z.enum(CEFR).optional(),
});

export async function addQuestionAction(
  examId: string,
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  await assertExamAccess(examId);

  const parsed = questionSchema.safeParse({
    text: formData.get("text"),
    optionA: formData.get("optionA"),
    optionB: formData.get("optionB"),
    optionC: formData.get("optionC"),
    optionD: formData.get("optionD"),
    correctAnswerIndex: formData.get("correctAnswerIndex"),
    points: formData.get("points") || 1,
    targetLevel: formData.get("targetLevel") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Geçersiz bilgiler." };
  }

  const existing = await db
    .select({ id: questions.id })
    .from(questions)
    .where(eq(questions.examId, examId));

  await db.insert(questions).values({
    examId,
    text: parsed.data.text,
    type: "MULTIPLE_CHOICE",
    options: [
      parsed.data.optionA,
      parsed.data.optionB,
      parsed.data.optionC,
      parsed.data.optionD,
    ],
    correctAnswerIndex: parsed.data.correctAnswerIndex,
    points: parsed.data.points,
    order: existing.length,
    targetLevel: parsed.data.targetLevel,
  });

  revalidatePath(`/panel/ogretmen/sinavlar/${examId}`);
  revalidatePath(`/panel/yonetim/sinavlar/${examId}`);
  return { success: true };
}

export async function deleteQuestionAction(examId: string, questionId: string) {
  await assertExamAccess(examId);
  await db
    .delete(questions)
    .where(and(eq(questions.id, questionId), eq(questions.examId, examId)));
  revalidatePath(`/panel/ogretmen/sinavlar/${examId}`);
  revalidatePath(`/panel/yonetim/sinavlar/${examId}`);
}

export async function togglePublishExamAction(examId: string) {
  const { exam } = await assertExamAccess(examId);
  await db
    .update(exams)
    .set({ published: !exam.published })
    .where(eq(exams.id, examId));
  revalidatePath(`/panel/ogretmen/sinavlar`);
  revalidatePath(`/panel/yonetim/sinavlar`);
}

export async function deleteExamAction(examId: string) {
  await assertExamAccess(examId);
  await db.delete(exams).where(eq(exams.id, examId));
  revalidatePath(`/panel/ogretmen/sinavlar`);
  revalidatePath(`/panel/yonetim/sinavlar`);
}

// ---------- Öğrenci: sınav çözme ----------

export async function submitExamAction(
  examId: string,
  answers: Record<string, number>
): Promise<{ scorePercent: number; passed: boolean; resultLevel?: string }> {
  const session = await auth();
  if (!session?.user || session.user.role !== "STUDENT") {
    redirect("/giris");
  }

  const [exam] = await db.select().from(exams).where(eq(exams.id, examId)).limit(1);
  if (!exam || !exam.published) redirect("/panel/ogrenci");

  const examQuestions = await db
    .select()
    .from(questions)
    .where(eq(questions.examId, examId));

  const totalPoints = examQuestions.reduce((sum, q) => sum + q.points, 0) || 1;
  let earnedPoints = 0;

  for (const q of examQuestions) {
    const given = answers[q.id];
    if (given === q.correctAnswerIndex) earnedPoints += q.points;
  }

  const scorePercent = Math.round((earnedPoints / totalPoints) * 100);
  const passed = scorePercent >= exam.passingScore;
  const resultLevel = exam.type === "LEVEL_TEST" ? scoreToLevel(scorePercent) : undefined;

  await db.insert(examAttempts).values({
    examId,
    studentId: session.user.id,
    answers,
    scorePercent,
    resultLevel,
    passed,
    status: "COMPLETED",
    completedAt: new Date(),
  });

  revalidatePath("/panel/ogrenci");
  revalidatePath("/panel/ogrenci/sonuclar");

  return { scorePercent, passed, resultLevel };
}
