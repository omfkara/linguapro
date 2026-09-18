import { db } from "@/db";
import { courses, users, videos, enrollments } from "@/db/schema";
import { eq, and, count } from "drizzle-orm";

export async function getPublishedCourses() {
  const rows = await db
    .select({
      id: courses.id,
      title: courses.title,
      slug: courses.slug,
      shortDescription: courses.shortDescription,
      description: courses.description,
      language: courses.language,
      level: courses.level,
      coverImage: courses.coverImage,
      price: courses.price,
      teacherName: users.name,
    })
    .from(courses)
    .leftJoin(users, eq(courses.teacherId, users.id))
    .where(eq(courses.published, true))
    .orderBy(courses.createdAt);

  return rows;
}

export async function getCourseBySlug(slug: string) {
  const [course] = await db
    .select({
      id: courses.id,
      title: courses.title,
      slug: courses.slug,
      description: courses.description,
      shortDescription: courses.shortDescription,
      language: courses.language,
      level: courses.level,
      coverImage: courses.coverImage,
      price: courses.price,
      published: courses.published,
      teacherId: courses.teacherId,
      teacherName: users.name,
      teacherBio: users.bio,
    })
    .from(courses)
    .leftJoin(users, eq(courses.teacherId, users.id))
    .where(eq(courses.slug, slug))
    .limit(1);

  if (!course) return null;

  const courseVideos = await db
    .select()
    .from(videos)
    .where(eq(videos.courseId, course.id))
    .orderBy(videos.order);

  return { ...course, videos: courseVideos };
}

export async function isStudentEnrolled(studentId: string, courseId: string) {
  const [row] = await db
    .select({ id: enrollments.id })
    .from(enrollments)
    .where(
      and(
        eq(enrollments.studentId, studentId),
        eq(enrollments.courseId, courseId)
      )
    )
    .limit(1);
  return !!row;
}

export async function getCourseVideoCount(courseId: string) {
  const [row] = await db
    .select({ value: count() })
    .from(videos)
    .where(eq(videos.courseId, courseId));
  return row?.value ?? 0;
}
