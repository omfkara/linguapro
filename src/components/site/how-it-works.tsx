"use client";

import { motion } from "framer-motion";
import { UserPlus, Gauge, BookOpenCheck, Award, type LucideIcon } from "lucide-react";

// İkonlar sabit sırayla (1., 2., 3., 4. adım) eşleştirilir; başlık ve
// açıklama metinleri admin panelinden düzenlenebilir.
const STEP_ICONS: LucideIcon[] = [UserPlus, Gauge, BookOpenCheck, Award];

type Step = { title: string; description: string };

export function HowItWorks({
  eyebrow,
  title,
  steps,
}: {
  eyebrow: string;
  title: string;
  steps: Step[];
}) {
  return (
    <section className="relative bg-ink-50/60 py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-bold uppercase tracking-widest text-brand-600">
            {eyebrow}
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold text-ink-950 sm:text-4xl">
            {title}
          </h2>
        </div>

        <div className="relative mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="absolute left-0 right-0 top-8 hidden h-0.5 bg-gradient-to-r from-brand-200 via-brand-400 to-brand-200 lg:block" />
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="relative flex flex-col items-center text-center"
            >
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-brand-600 shadow-lg shadow-brand-900/10 ring-1 ring-ink-100">
                {(() => {
                  const Icon = STEP_ICONS[i] ?? UserPlus;
                  return <Icon size={26} />;
                })()}
                <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-accent-500 text-xs font-bold text-white">
                  {i + 1}
                </span>
              </div>
              <h3 className="mt-5 font-display text-lg font-bold text-ink-950">
                {step.title}
              </h3>
              <p className="mt-2 max-w-[220px] text-sm text-ink-500">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
