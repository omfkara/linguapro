import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";
import bcrypt from "bcryptjs";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool, { schema });

const DEMO_VIDEO_URL = "https://www.youtube.com/embed/M7lc1UVf-VE";

async function hash(pw: string) {
  return bcrypt.hash(pw, 12);
}

async function main() {
  // Idempotent: uygulama her başladığında (örn. Railway yeniden deploy /
  // restart) otomatik çalıştırılabilmesi için, veri zaten varsa atla.
  const existing = await db.select({ id: schema.users.id }).from(schema.users).limit(1);
  if (existing.length > 0) {
    console.log("Seed verisi zaten mevcut, atlanıyor.");
    await pool.end();
    return;
  }

  console.log("Seed verisi oluşturuluyor...\n");

  // ---------- Kullanıcılar ----------
  const [admin] = await db
    .insert(schema.users)
    .values({
      name: "Sistem Yöneticisi",
      email: "admin@linguapro.com.tr",
      passwordHash: await hash("Admin1234"),
      role: "ADMIN",
    })
    .returning();

  const [teacher1] = await db
    .insert(schema.users)
    .values({
      name: "Dr. Ayşe Demir",
      email: "ayse.demir@linguapro.com.tr",
      passwordHash: await hash("Ogretmen1234"),
      role: "TEACHER",
      bio: "12 yıllık deneyime sahip İngilizce okutmanı, Cambridge CELTA sertifikalı.",
    })
    .returning();

  const [teacher2] = await db
    .insert(schema.users)
    .values({
      name: "Kaan Yıldırım",
      email: "kaan.yildirim@linguapro.com.tr",
      passwordHash: await hash("Ogretmen1234"),
      role: "TEACHER",
      bio: "Almanya'da 8 yıl yaşamış, Goethe Enstitüsü sertifikalı Almanca eğitmeni.",
    })
    .returning();

  const [student1] = await db
    .insert(schema.users)
    .values({
      name: "Elif Aydın",
      email: "elif@example.com",
      passwordHash: await hash("Ogrenci1234"),
      role: "STUDENT",
    })
    .returning();

  const [student2] = await db
    .insert(schema.users)
    .values({
      name: "Mert Kaya",
      email: "mert@example.com",
      passwordHash: await hash("Ogrenci1234"),
      role: "STUDENT",
    })
    .returning();

  console.log("✓ Kullanıcılar oluşturuldu");

  // ---------- Kurslar ----------
  const [course1] = await db
    .insert(schema.courses)
    .values({
      title: "İngilizce B1 Seviye Konuşma Kursu",
      slug: "ingilizce-b1-seviye-konusma-kursu",
      language: "İngilizce",
      level: "B1",
      shortDescription: "Günlük hayatta akıcı konuşabilmek için pratik odaklı kurs.",
      description:
        "Bu kurs, İngilizce B1 seviyesindeki öğrencilerin konuşma becerilerini geliştirmesi için tasarlanmıştır. Gerçek hayat senaryoları, telaffuz alıştırmaları ve interaktif ders videolarıyla akıcılığınızı artıracaksınız.",
      teacherId: teacher1.id,
      price: 0,
      published: true,
    })
    .returning();

  const [course2] = await db
    .insert(schema.courses)
    .values({
      title: "Almanca A1 Başlangıç Kursu",
      slug: "almanca-a1-baslangic-kursu",
      language: "Almanca",
      level: "A1",
      shortDescription: "Sıfırdan Almanca öğrenmeye bu kapsamlı kursla başlayın.",
      description:
        "Almanca'ya hiç aşina değilseniz tam size göre. Temel dilbilgisi kurallarından günlük konuşma kalıplarına kadar sıfırdan başlayan kapsamlı bir müfredat sunuyoruz.",
      teacherId: teacher2.id,
      price: 0,
      published: true,
    })
    .returning();

  console.log("✓ Kurslar oluşturuldu");

  // ---------- Videolar ----------
  const videoTitles1 = [
    "Ders 1: Tanışma ve Günlük Sohbet",
    "Ders 2: Seyahat Terimleri",
    "Ders 3: İş Hayatında İngilizce",
    "Ders 4: Telaffuz Teknikleri",
  ];
  for (let i = 0; i < videoTitles1.length; i++) {
    await db.insert(schema.videos).values({
      courseId: course1.id,
      title: videoTitles1[i],
      provider: "youtube",
      videoUrl: DEMO_VIDEO_URL,
      durationSeconds: 600 + i * 120,
      order: i,
      isFreePreview: i === 0,
    });
  }

  const videoTitles2 = [
    "Ders 1: Alfabe ve Telaffuz",
    "Ders 2: Temel Selamlaşmalar",
    "Ders 3: Sayılar ve Zaman",
    "Ders 4: Basit Cümle Yapıları",
  ];
  for (let i = 0; i < videoTitles2.length; i++) {
    await db.insert(schema.videos).values({
      courseId: course2.id,
      title: videoTitles2[i],
      provider: "youtube",
      videoUrl: DEMO_VIDEO_URL,
      durationSeconds: 480 + i * 90,
      order: i,
      isFreePreview: i === 0,
    });
  }

  console.log("✓ Videolar oluşturuldu");

  // ---------- Kurs Sınavı ----------
  const [exam1] = await db
    .insert(schema.exams)
    .values({
      title: "B1 Konuşma Kursu Değerlendirme Sınavı",
      description: "Kurs boyunca öğrendiklerinizi ölçen değerlendirme sınavı.",
      type: "COURSE_EXAM",
      courseId: course1.id,
      createdById: teacher1.id,
      durationMinutes: 20,
      passingScore: 60,
      published: true,
    })
    .returning();

  const examQuestions = [
    {
      text: "'How are you doing?' sorusuna en uygun günlük yanıt hangisidir?",
      options: ["I am doing great, thanks!", "Book is red.", "Yesterday tomorrow.", "Car blue fast."],
      correct: 0,
    },
    {
      text: "Bir iş toplantısına geç kaldığınızı kibarca nasıl ifade edersiniz?",
      options: ["Whatever.", "I apologize for being late.", "Not my problem.", "So what."],
      correct: 1,
    },
    {
      text: "'Could you please repeat that?' cümlesinin anlamı nedir?",
      options: ["Bunu tekrar eder misiniz?", "Bunu unutun.", "Acele edin.", "Hoşça kalın."],
      correct: 0,
    },
    {
      text: "Havaalanında check-in yaparken en uygun ifade hangisidir?",
      options: ["Give me ticket now.", "I'd like to check in for my flight, please.", "Where money?", "Fast fast go."],
      correct: 1,
    },
    {
      text: "'I look forward to hearing from you' ifadesi hangi bağlamda kullanılır?",
      options: ["Restoran siparişinde", "Resmi e-posta kapanışında", "Trafik cezasında", "Spor müsabakasında"],
      correct: 1,
    },
  ];

  for (let i = 0; i < examQuestions.length; i++) {
    const q = examQuestions[i];
    await db.insert(schema.questions).values({
      examId: exam1.id,
      text: q.text,
      type: "MULTIPLE_CHOICE",
      options: q.options,
      correctAnswerIndex: q.correct,
      points: 1,
      order: i,
    });
  }

  console.log("✓ Kurs sınavı ve sorular oluşturuldu");

  // ---------- Seviye Tespit Sınavı ----------
  const [levelTest] = await db
    .insert(schema.exams)
    .values({
      title: "Genel İngilizce Seviye Tespit Sınavı",
      description: "CEFR standardına uygun, A1'den C2'ye seviye tespit sınavı.",
      type: "LEVEL_TEST",
      createdById: admin.id,
      durationMinutes: 20,
      passingScore: 0,
      published: true,
    })
    .returning();

  const levelQuestions: {
    text: string;
    options: string[];
    correct: number;
    level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  }[] = [
    { text: "'___ name is John.'", options: ["My", "I", "Me", "Mine"], correct: 0, level: "A1" },
    { text: "'She ___ a teacher.'", options: ["are", "is", "am", "be"], correct: 1, level: "A1" },
    { text: "'They ___ to school every day.'", options: ["go", "goes", "going", "went"], correct: 0, level: "A2" },
    { text: "'I ___ my homework yesterday.'", options: ["do", "did", "done", "doing"], correct: 1, level: "A2" },
    { text: "'If I ___ more time, I would travel more.'", options: ["have", "had", "having", "has"], correct: 1, level: "B1" },
    { text: "'By next year, I ___ my degree.'", options: ["will complete", "will have completed", "complete", "completed"], correct: 1, level: "B1" },
    { text: "'The report, ___ was submitted late, caused issues.'", options: ["which", "who", "whom", "whose"], correct: 0, level: "B2" },
    { text: "'Hardly ___ the meeting started when the fire alarm rang.'", options: ["had", "has", "did", "was"], correct: 0, level: "B2" },
    { text: "'Choose the sentence with the most formal register.'", options: ["Gimme that.", "Could you kindly provide that?", "Give it here.", "Hand it over."], correct: 1, level: "C1" },
    { text: "'The nuance between \"imply\" and \"infer\" is best described as:'", options: ["They are identical.", "Imply = suggest, Infer = deduce.", "Imply = deduce, Infer = suggest.", "Neither has meaning."], correct: 1, level: "C1" },
    { text: "'Identify the idiom meaning \"to discuss a sensitive topic directly\".'", options: ["Beat around the bush", "Grasp the nettle", "Miss the boat", "Spill the beans"], correct: 1, level: "C2" },
    { text: "'Select the sentence demonstrating correct subjunctive mood.'", options: ["If I was rich, I would travel.", "If I were rich, I would travel.", "If I am rich, I would travel.", "If I will be rich, I travel."], correct: 1, level: "C2" },
  ];

  for (let i = 0; i < levelQuestions.length; i++) {
    const q = levelQuestions[i];
    await db.insert(schema.questions).values({
      examId: levelTest.id,
      text: q.text,
      type: "MULTIPLE_CHOICE",
      options: q.options,
      correctAnswerIndex: q.correct,
      points: 1,
      order: i,
      targetLevel: q.level,
    });
  }

  console.log("✓ Seviye tespit sınavı ve sorular oluşturuldu");

  // ---------- Kayıt (Enrollment) ----------
  await db.insert(schema.enrollments).values({
    studentId: student1.id,
    courseId: course1.id,
    progressPercent: 25,
  });

  console.log("✓ Örnek kurs kaydı oluşturuldu");

  // ---------- İletişim Mesajı ----------
  await db.insert(schema.contactMessages).values({
    name: "Zeynep Şahin",
    email: "zeynep@ornek.com",
    phone: "+90 555 123 45 67",
    subject: "Kurumsal eğitim talebi",
    message:
      "Merhaba, 15 kişilik ekibimiz için kurumsal İngilizce eğitimi almak istiyoruz. Fiyat teklifi alabilir miyiz?",
  });

  console.log("✓ Örnek iletişim mesajı oluşturuldu");

  console.log("\n✅ Seed işlemi tamamlandı!\n");
  console.log("Giriş bilgileri:");
  console.log("  Yönetici : admin@linguapro.com.tr / Admin1234");
  console.log("  Eğitmen  : ayse.demir@linguapro.com.tr / Ogretmen1234");
  console.log("  Eğitmen  : kaan.yildirim@linguapro.com.tr / Ogretmen1234");
  console.log("  Öğrenci  : elif@example.com / Ogrenci1234");
  console.log("  Öğrenci  : mert@example.com / Ogrenci1234");

  await pool.end();
}

main().catch((err) => {
  console.error("Seed hatası:", err);
  process.exit(1);
});
