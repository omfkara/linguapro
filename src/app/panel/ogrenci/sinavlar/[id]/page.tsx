import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/db";
import { exams, questions, enrollments } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { ExamTaker } from "@/components/dashboard/exam-taker";

export const metadata = { title: "Sınav" };

export default async function StudentExamPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  const [exam] = await db.select().from(exams).where(eq(exams.id, id)).limit(1);
  if (!exam || !exam.published) redirect("/panel/ogrenci/sinavlar");

  if (exam.type === "COURSE_EXAM" && exam.courseId) {
    const [enrollment] = await db
      .select({ id: enrollments.id })
      .from(enrollments)
      .where(
        and(
          eq(enrollments.studentId, session!.user.id),
          eq(enrollments.courseId, exam.courseId)
        )
      )
      .limit(1);
    if (!enrollment) redirect("/panel/ogrenci/kurslar");
  }

  const examQuestions = await db
    .select({
      id: questions.id,
      text: questions.text,
      options: questions.options,
    })
    .from(questions)
    .where(eq(questions.examId, id))
    .orderBy(questions.order);

  if (examQuestions.length === 0) redirect("/panel/ogrenci");

  return (
    <ExamTaker
      examId={exam.id}
      title={exam.title}
      durationMinutes={exam.durationMinutes}
      questions={examQuestions.map((q) => ({
        id: q.id,
        text: q.text,
        options: q.options as string[],
      }))}
      isLevelTest={exam.type === "LEVEL_TEST"}
      resultRedirect={
        exam.type === "LEVEL_TEST" ? "/panel/ogrenci" : "/panel/ogrenci/sonuclar"
      }
    />
  );
}
