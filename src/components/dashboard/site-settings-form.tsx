"use client";

import { useState, useTransition } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Plus,
  Trash2,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { updateSiteSettingsAction } from "@/lib/actions/settings-actions";
import type { SiteSettings } from "@/lib/queries/settings";

const TABS = [
  { id: "genel", label: "Genel & Logo" },
  { id: "iletisim", label: "İletişim & Sosyal" },
  { id: "diller", label: "Sunulan Diller" },
  { id: "slider", label: "Ana Sayfa Slider" },
  { id: "istatistik", label: "İstatistikler" },
  { id: "adimlar", label: "4 Adım Bölümü" },
  { id: "seviyetesti", label: "Seviye Testi Sayfası" },
  { id: "seo", label: "Tarayıcı Başlıkları (SEO)" },
] as const;

type TabId = (typeof TABS)[number]["id"];

const SEO_PAGES: { key: string; label: string }[] = [
  { key: "home", label: "Ana Sayfa" },
  { key: "kurslar", label: "Kurslar" },
  { key: "hakkimizda", label: "Hakkımızda" },
  { key: "hizmetler", label: "Hizmetlerimiz" },
  { key: "iletisim", label: "İletişim" },
  { key: "seviyeTespitSinavi", label: "Seviye Tespit Sınavı" },
];

const inputCls =
  "mt-1.5 w-full rounded-xl border border-ink-100 px-4 py-2.5 text-sm outline-none ring-brand-500 focus:ring-2";
const labelCls = "text-sm font-semibold text-ink-900";

function Field({
  label,
  value,
  onChange,
  textarea,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
  hint?: string;
}) {
  return (
    <div>
      <label className={labelCls}>
        {label}
        {hint && <span className="ml-1.5 font-normal text-ink-400">{hint}</span>}
      </label>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className={inputCls + " resize-none"}
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={inputCls}
        />
      )}
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-5 rounded-2xl border border-ink-100 bg-white p-7 shadow-sm">
      {children}
    </div>
  );
}

export function SiteSettingsForm({ initial }: { initial: SiteSettings }) {
  const [data, setData] = useState<SiteSettings>(initial);
  const [tab, setTab] = useState<TabId>("genel");
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<{ error?: string; success?: boolean }>({});

  function update<K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) {
    setData((d) => ({ ...d, [key]: value }));
  }

  function handleSubmit() {
    setResult({});
    startTransition(async () => {
      const res = await updateSiteSettingsAction(data);
      setResult(res);
      if (res.success) {
        setTimeout(() => setResult({}), 3000);
      }
    });
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2 border-b border-ink-100 pb-4">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={
              "rounded-full px-4 py-2 text-xs font-bold transition " +
              (tab === t.id
                ? "bg-brand-600 text-white shadow-sm"
                : "bg-ink-50 text-ink-600 hover:bg-ink-100")
            }
          >
            {t.label}
          </button>
        ))}
      </div>

      {result.error && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-100">
          <AlertCircle size={16} /> {result.error}
        </div>
      )}
      {result.success && (
        <div className="flex items-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700 ring-1 ring-green-100">
          <CheckCircle2 size={16} /> Kaydedildi — değişiklikler canlı sitede yayında.
        </div>
      )}

      {tab === "genel" && (
        <Card>
          <Field
            label="Logo Görsel URL'si"
            hint="(resim barındırma servisinden aldığınız bağlantı — boş bırakılırsa yalnızca site adı gösterilir)"
            value={data.logoUrl}
            onChange={(v) => update("logoUrl", v)}
          />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="Site Adı" value={data.siteName} onChange={(v) => update("siteName", v)} />
            <Field
              label="Kısa Ad"
              hint="(navbar'da logonun yanında)"
              value={data.shortName}
              onChange={(v) => update("shortName", v)}
            />
          </div>
          <Field label="Slogan" value={data.tagline} onChange={(v) => update("tagline", v)} />
          <Field
            label="Site Açıklaması"
            hint="(SEO ve sosyal paylaşımlarda kullanılır)"
            textarea
            value={data.description}
            onChange={(v) => update("description", v)}
          />
        </Card>
      )}

      {tab === "iletisim" && (
        <Card>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="Telefon" value={data.phone} onChange={(v) => update("phone", v)} />
            <Field label="E-posta" value={data.email} onChange={(v) => update("email", v)} />
          </div>
          <Field label="Adres" value={data.address} onChange={(v) => update("address", v)} />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <Field label="Instagram" value={data.instagramUrl} onChange={(v) => update("instagramUrl", v)} />
            <Field label="YouTube" value={data.youtubeUrl} onChange={(v) => update("youtubeUrl", v)} />
            <Field label="LinkedIn" value={data.linkedinUrl} onChange={(v) => update("linkedinUrl", v)} />
          </div>
        </Card>
      )}

      {tab === "diller" && (
        <Card>
          <p className="text-sm text-ink-500">
            Ana sayfadaki kayan dil şeridinde gösterilir. Bayrak alanına emoji yapıştırabilirsiniz (🇬🇧).
          </p>
          {data.languages.map((lang, i) => (
            <div key={i} className="grid grid-cols-1 gap-3 rounded-xl border border-ink-100 p-4 sm:grid-cols-[100px_1fr_140px_auto]">
              <Field
                label="Bayrak"
                value={lang.flag}
                onChange={(v) => {
                  const next = [...data.languages];
                  next[i] = { ...next[i], flag: v };
                  update("languages", next);
                }}
              />
              <Field
                label="Dil Adı"
                value={lang.name}
                onChange={(v) => {
                  const next = [...data.languages];
                  next[i] = { ...next[i], name: v };
                  update("languages", next);
                }}
              />
              <Field
                label="Öğrenci Sayısı"
                value={lang.students}
                onChange={(v) => {
                  const next = [...data.languages];
                  next[i] = { ...next[i], students: v };
                  update("languages", next);
                }}
              />
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => update("languages", data.languages.filter((_, idx) => idx !== i))}
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-red-500 hover:bg-red-50"
                  aria-label="Dili sil"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              update("languages", [...data.languages, { name: "", flag: "🏳️", students: "" }])
            }
            className="flex items-center gap-1.5 rounded-xl border border-dashed border-ink-200 px-4 py-2.5 text-sm font-semibold text-brand-600 hover:bg-brand-50"
          >
            <Plus size={16} /> Dil Ekle
          </button>
        </Card>
      )}

      {tab === "slider" && (
        <Card>
          <p className="text-sm text-ink-500">
            Ana sayfanın en üstündeki dönen (otomatik geçişli) slaytlar.
          </p>
          {data.heroSlides.map((slide, i) => (
            <div key={i} className="space-y-3 rounded-xl border border-ink-100 p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wide text-ink-400">
                  Slayt {i + 1}
                </span>
                {data.heroSlides.length > 1 && (
                  <button
                    type="button"
                    onClick={() => update("heroSlides", data.heroSlides.filter((_, idx) => idx !== i))}
                    className="flex items-center gap-1 text-xs font-bold text-red-500 hover:underline"
                  >
                    <Trash2 size={14} /> Sil
                  </button>
                )}
              </div>
              <Field
                label="Üst Etiket (eyebrow)"
                value={slide.eyebrow}
                onChange={(v) => {
                  const next = [...data.heroSlides];
                  next[i] = { ...next[i], eyebrow: v };
                  update("heroSlides", next);
                }}
              />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <Field
                  label="Başlık (başlangıç)"
                  value={slide.title}
                  onChange={(v) => {
                    const next = [...data.heroSlides];
                    next[i] = { ...next[i], title: v };
                    update("heroSlides", next);
                  }}
                />
                <Field
                  label="Vurgulu Kelime"
                  value={slide.highlight}
                  onChange={(v) => {
                    const next = [...data.heroSlides];
                    next[i] = { ...next[i], highlight: v };
                    update("heroSlides", next);
                  }}
                />
                <Field
                  label="Başlık (bitiş)"
                  value={slide.titleEnd}
                  onChange={(v) => {
                    const next = [...data.heroSlides];
                    next[i] = { ...next[i], titleEnd: v };
                    update("heroSlides", next);
                  }}
                />
              </div>
              <Field
                label="Açıklama"
                textarea
                value={slide.description}
                onChange={(v) => {
                  const next = [...data.heroSlides];
                  next[i] = { ...next[i], description: v };
                  update("heroSlides", next);
                }}
              />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field
                  label="İstatistik Değeri"
                  hint='(ör: "12.000+")'
                  value={slide.statValue}
                  onChange={(v) => {
                    const next = [...data.heroSlides];
                    next[i] = { ...next[i], statValue: v };
                    update("heroSlides", next);
                  }}
                />
                <Field
                  label="İstatistik Etiketi"
                  hint='(ör: "aktif öğrenci")'
                  value={slide.statLabel}
                  onChange={(v) => {
                    const next = [...data.heroSlides];
                    next[i] = { ...next[i], statLabel: v };
                    update("heroSlides", next);
                  }}
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              update("heroSlides", [
                ...data.heroSlides,
                {
                  eyebrow: "",
                  title: "",
                  highlight: "",
                  titleEnd: "",
                  description: "",
                  statValue: "",
                  statLabel: "",
                },
              ])
            }
            className="flex items-center gap-1.5 rounded-xl border border-dashed border-ink-200 px-4 py-2.5 text-sm font-semibold text-brand-600 hover:bg-brand-50"
          >
            <Plus size={16} /> Slayt Ekle
          </button>
        </Card>
      )}

      {tab === "istatistik" && (
        <Card>
          <p className="text-sm text-ink-500">
            Ana sayfada koyu şerit üzerinde gösterilen 4 sayaç kutusu (ör. &ldquo;12.400+ Aktif Öğrenci&rdquo;).
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {data.stats.map((s, i) => (
              <div key={i} className="grid grid-cols-3 gap-2 rounded-xl border border-ink-100 p-4">
                <div>
                  <label className={labelCls}>Sayı</label>
                  <input
                    type="number"
                    value={s.value}
                    onChange={(e) => {
                      const next = [...data.stats];
                      next[i] = { ...next[i], value: Number(e.target.value) || 0 };
                      update("stats", next);
                    }}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Sonek</label>
                  <input
                    value={s.suffix}
                    placeholder="+ veya %"
                    onChange={(e) => {
                      const next = [...data.stats];
                      next[i] = { ...next[i], suffix: e.target.value };
                      update("stats", next);
                    }}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Etiket</label>
                  <input
                    value={s.label}
                    onChange={(e) => {
                      const next = [...data.stats];
                      next[i] = { ...next[i], label: e.target.value };
                      update("stats", next);
                    }}
                    className={inputCls}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {tab === "adimlar" && (
        <Card>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field
              label="Üst Etiket"
              value={data.howItWorksEyebrow}
              onChange={(v) => update("howItWorksEyebrow", v)}
            />
            <Field
              label="Bölüm Başlığı"
              value={data.howItWorksTitle}
              onChange={(v) => update("howItWorksTitle", v)}
            />
          </div>
          <p className="text-sm text-ink-500">
            &ldquo;Dört Adımda Hedefinize Ulaşın&rdquo; bölümündeki 4 adımın başlık ve açıklaması.
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {data.howItWorksSteps.map((s, i) => (
              <div key={i} className="space-y-2 rounded-xl border border-ink-100 p-4">
                <span className="text-xs font-bold uppercase tracking-wide text-ink-400">
                  Adım {i + 1}
                </span>
                <Field
                  label="Başlık"
                  value={s.title}
                  onChange={(v) => {
                    const next = [...data.howItWorksSteps];
                    next[i] = { ...next[i], title: v };
                    update("howItWorksSteps", next);
                  }}
                />
                <Field
                  label="Açıklama"
                  textarea
                  value={s.description}
                  onChange={(v) => {
                    const next = [...data.howItWorksSteps];
                    next[i] = { ...next[i], description: v };
                    update("howItWorksSteps", next);
                  }}
                />
              </div>
            ))}
          </div>
        </Card>
      )}

      {tab === "seviyetesti" && (
        <Card>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field
              label="Üst Etiket"
              value={data.levelTestEyebrow}
              onChange={(v) => update("levelTestEyebrow", v)}
            />
            <Field
              label="Başlık"
              value={data.levelTestTitle}
              onChange={(v) => update("levelTestTitle", v)}
            />
          </div>
          <Field
            label="Açıklama"
            textarea
            value={data.levelTestDescription}
            onChange={(v) => update("levelTestDescription", v)}
          />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field
              label="Sınav Yayındayken Başlık"
              value={data.levelTestReadyTitle}
              onChange={(v) => update("levelTestReadyTitle", v)}
            />
            <Field
              label="Sınav Yayında Değilken Başlık"
              value={data.levelTestNotReadyTitle}
              onChange={(v) => update("levelTestNotReadyTitle", v)}
            />
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field
              label="Giriş Yapmış Kullanıcı Metni"
              textarea
              value={data.levelTestLoggedInText}
              onChange={(v) => update("levelTestLoggedInText", v)}
            />
            <Field
              label="Ziyaretçi (giriş yapmamış) Metni"
              textarea
              value={data.levelTestGuestText}
              onChange={(v) => update("levelTestGuestText", v)}
            />
          </div>
        </Card>
      )}

      {tab === "seo" && (
        <Card>
          <p className="text-sm text-ink-500">
            Her sayfanın tarayıcı sekmesinde görünen başlığı ve arama motorları için açıklaması.
          </p>
          {SEO_PAGES.map((p) => (
            <div key={p.key} className="grid grid-cols-1 gap-3 rounded-xl border border-ink-100 p-4 sm:grid-cols-2">
              <Field
                label={`${p.label} — Başlık`}
                value={data.seoTitles[p.key] ?? ""}
                onChange={(v) => update("seoTitles", { ...data.seoTitles, [p.key]: v })}
              />
              <Field
                label={`${p.label} — Açıklama`}
                value={data.seoDescriptions[p.key] ?? ""}
                onChange={(v) => update("seoDescriptions", { ...data.seoDescriptions, [p.key]: v })}
              />
            </div>
          ))}
        </Card>
      )}

      <div className="sticky bottom-4 flex justify-end">
        <Button type="button" onClick={handleSubmit} disabled={pending} className="shadow-lg">
          {pending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          Değişiklikleri Kaydet
        </Button>
      </div>
    </div>
  );
}
