import {
  pgTable,
  text,
  timestamp,
  uuid,
  integer,
  boolean,
  pgEnum,
  jsonb,
  real,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ---------- Enums ----------
export const roleEnum = pgEnum("role", ["ADMIN", "TEACHER", "STUDENT"]);
export const examTypeEnum = pgEnum("exam_type", ["COURSE_EXAM", "LEVEL_TEST"]);
export const questionTypeEnum = pgEnum("question_type", [
  "MULTIPLE_CHOICE",
  "TRUE_FALSE",
]);
export const cefrLevelEnum = pgEnum("cefr_level", [
  "A1",
  "A2",
  "B1",
  "B2",
  "C1",
  "C2",
]);
export const attemptStatusEnum = pgEnum("attempt_status", [
  "IN_PROGRESS",
  "COMPLETED",
]);

// ---------- Users ----------
export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    passwordHash: text("password_hash").notNull(),
    role: roleEnum("role").notNull().default("STUDENT"),
    image: text("image"),
    phone: text("phone"),
    bio: text("bio"),
    isActive: boolean("is_active").notNull().default(true),
    emailVerified: timestamp("email_verified", { mode: "date" }),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("users_email_idx").on(table.email)]
);

export const usersRelations = relations(users, ({ many }) => ({
  taughtCourses: many(courses),
  enrollments: many(enrollments),
  examAttempts: many(examAttempts),
  createdExams: many(exams),
}));

// ---------- Courses ----------
export const courses = pgTable(
  "courses",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    slug: text("slug").notNull(),
    description: text("description").notNull(),
    shortDescription: text("short_description"),
    language: text("language").notNull().default("İngilizce"),
    level: cefrLevelEnum("level").notNull().default("A1"),
    coverImage: text("cover_image"),
    teacherId: uuid("teacher_id").references(() => users.id, {
      onDelete: "set null",
    }),
    price: real("price").default(0),
    published: boolean("published").notNull().default(false),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("courses_slug_idx").on(table.slug)]
);

export const coursesRelations = relations(courses, ({ one, many }) => ({
  teacher: one(users, {
    fields: [courses.teacherId],
    references: [users.id],
  }),
  videos: many(videos),
  enrollments: many(enrollments),
  exams: many(exams),
}));

// ---------- Videos ----------
export const videos = pgTable(
  "videos",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    courseId: uuid("course_id")
      .notNull()
      .references(() => courses.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description"),
    provider: text("provider").notNull().default("youtube"), // youtube | vimeo | upload
    videoUrl: text("video_url").notNull(), // embed url or uploaded file path
    thumbnail: text("thumbnail"),
    durationSeconds: integer("duration_seconds").default(0),
    order: integer("order").notNull().default(0),
    isFreePreview: boolean("is_free_preview").notNull().default(false),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => [index("videos_course_idx").on(table.courseId)]
);

export const videosRelations = relations(videos, ({ one, many }) => ({
  course: one(courses, {
    fields: [videos.courseId],
    references: [courses.id],
  }),
  progress: many(videoProgress),
}));

// ---------- Enrollments ----------
export const enrollments = pgTable(
  "enrollments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    studentId: uuid("student_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    courseId: uuid("course_id")
      .notNull()
      .references(() => courses.id, { onDelete: "cascade" }),
    progressPercent: integer("progress_percent").notNull().default(0),
    enrolledAt: timestamp("enrolled_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("enrollments_student_course_idx").on(
      table.studentId,
      table.courseId
    ),
  ]
);

export const enrollmentsRelations = relations(enrollments, ({ one }) => ({
  student: one(users, {
    fields: [enrollments.studentId],
    references: [users.id],
  }),
  course: one(courses, {
    fields: [enrollments.courseId],
    references: [courses.id],
  }),
}));

// ---------- Video progress (izleme takibi) ----------
export const videoProgress = pgTable(
  "video_progress",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    studentId: uuid("student_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    videoId: uuid("video_id")
      .notNull()
      .references(() => videos.id, { onDelete: "cascade" }),
    watchedSeconds: integer("watched_seconds").notNull().default(0),
    completed: boolean("completed").notNull().default(false),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("video_progress_student_video_idx").on(
      table.studentId,
      table.videoId
    ),
  ]
);

export const videoProgressRelations = relations(videoProgress, ({ one }) => ({
  student: one(users, {
    fields: [videoProgress.studentId],
    references: [users.id],
  }),
  video: one(videos, {
    fields: [videoProgress.videoId],
    references: [videos.id],
  }),
}));

// ---------- Exams (hem kurs sınavları hem seviye tespit sınavı) ----------
export const exams = pgTable("exams", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  type: examTypeEnum("type").notNull().default("COURSE_EXAM"),
  courseId: uuid("course_id").references(() => courses.id, {
    onDelete: "cascade",
  }),
  createdById: uuid("created_by_id").references(() => users.id, {
    onDelete: "set null",
  }),
  durationMinutes: integer("duration_minutes").notNull().default(30),
  passingScore: integer("passing_score").notNull().default(60),
  published: boolean("published").notNull().default(false),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});

export const examsRelations = relations(exams, ({ one, many }) => ({
  course: one(courses, {
    fields: [exams.courseId],
    references: [courses.id],
  }),
  createdBy: one(users, {
    fields: [exams.createdById],
    references: [users.id],
  }),
  questions: many(questions),
  attempts: many(examAttempts),
}));

// ---------- Questions ----------
export const questions = pgTable(
  "questions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    examId: uuid("exam_id")
      .notNull()
      .references(() => exams.id, { onDelete: "cascade" }),
    text: text("text").notNull(),
    type: questionTypeEnum("type").notNull().default("MULTIPLE_CHOICE"),
    options: jsonb("options").notNull().$type<string[]>(), // ["A metni","B metni",...]
    correctAnswerIndex: integer("correct_answer_index").notNull(),
    points: integer("points").notNull().default(1),
    order: integer("order").notNull().default(0),
    // Seviye tespit sınavında bu sorunun hangi seviyeyi temsil ettiği
    targetLevel: cefrLevelEnum("target_level"),
  },
  (table) => [index("questions_exam_idx").on(table.examId)]
);

export const questionsRelations = relations(questions, ({ one }) => ({
  exam: one(exams, {
    fields: [questions.examId],
    references: [exams.id],
  }),
}));

// ---------- Exam attempts (öğrencinin sınav denemesi) ----------
export const examAttempts = pgTable(
  "exam_attempts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    examId: uuid("exam_id")
      .notNull()
      .references(() => exams.id, { onDelete: "cascade" }),
    studentId: uuid("student_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    answers: jsonb("answers").$type<Record<string, number>>().default({}),
    scorePercent: real("score_percent"),
    resultLevel: cefrLevelEnum("result_level"), // seviye tespit sınavı sonucu
    passed: boolean("passed"),
    status: attemptStatusEnum("status").notNull().default("IN_PROGRESS"),
    startedAt: timestamp("started_at", { mode: "date" }).notNull().defaultNow(),
    completedAt: timestamp("completed_at", { mode: "date" }),
  },
  (table) => [
    index("exam_attempts_student_idx").on(table.studentId),
    index("exam_attempts_exam_idx").on(table.examId),
  ]
);

export const examAttemptsRelations = relations(examAttempts, ({ one }) => ({
  exam: one(exams, {
    fields: [examAttempts.examId],
    references: [exams.id],
  }),
  student: one(users, {
    fields: [examAttempts.studentId],
    references: [users.id],
  }),
}));

// ---------- İletişim formu mesajları ----------
export const contactMessages = pgTable("contact_messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  subject: text("subject"),
  message: text("message").notNull(),
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});

// ---------- Rate limiting (giriş denemeleri için güvenlik) ----------
export const loginAttempts = pgTable(
  "login_attempts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    identifier: text("identifier").notNull(), // email veya IP
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => [index("login_attempts_identifier_idx").on(table.identifier)]
);
