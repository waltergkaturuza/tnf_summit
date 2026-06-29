"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight, CheckCircle, MapPin,
  Globe,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { useLanguage } from "@/context/LanguageContext";
import { summitInfo, themes, whyAttend } from "@/lib/data";

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay }} className={className}>
      {children}
    </motion.div>
  );
}

export default function AboutPage() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <PageHeader title={t.about.heroTitle} subtitle={t.about.heroSub} />
      {/* What is the Summit — wallpaper background */}
      <section className="wallpaper-surface relative py-20 overflow-hidden">
        <div className="absolute inset-0" aria-hidden>
          <Image
            src="/about_wallpaper.webp"
            alt=""
            fill
            priority
            sizes="100vw"
            quality={82}
            className="object-cover object-center wallpaper-photo"
          />
        </div>
        <div aria-hidden className="absolute inset-0 wallpaper-scrim" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <FadeIn>
              <div>
                <span className="text-[#C9921A] text-sm font-bold uppercase tracking-widest">{t.about.whatIsBadge}</span>
                <h2 className="text-3xl font-black text-white mt-3 mb-6">{t.about.whatIsTitle}</h2>
                <p className="leading-relaxed mb-4 text-theme-primary">
                  {t.about.whatIsDesc1}
                </p>
                <p className="leading-relaxed mb-4 text-theme-primary">
                  {t.about.whatIsDesc2}
                </p>
                <p className="leading-relaxed mb-8 text-theme-primary">
                  {t.about.whatIsDesc3}
                </p>
                <div className="flex flex-wrap gap-3">
                  {t.about.whatIsTags.map((tag) => (
                    <span key={tag} className="wallpaper-glass glass px-3 py-1.5 rounded-full text-xs text-theme-primary">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="space-y-4">
                {t.about.whatIsCards.map((card, i) =>
                  card ? (
                    <div key={i} className="wallpaper-glass glass rounded-xl p-4">
                      <div className="text-white font-bold text-sm">{card.title}</div>
                      <div className="text-xs mt-1 leading-relaxed text-theme-primary">{card.desc}</div>
                    </div>
                  ) : null,
                )}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Why Attend */}
      <section id="why-attend" className="py-20 bg-[var(--bg-alt)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-14">
              <span className="text-[#C9921A] text-sm font-bold uppercase tracking-widest">{t.about.whyAttendBadge}</span>
              <h2 className="text-4xl font-black text-white mt-3">{t.about.whyAttendTitle}</h2>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyAttend.map((item, i) => (
                <FadeIn key={i} delay={i * 0.1}>
                  <div className="glass rounded-2xl p-6 card-hover h-full">
                    <h3 className="text-white font-bold mb-3">{item.audience}</h3>
                    <p className="text-sm leading-relaxed text-theme-primary">{item.description}</p>
                  </div>
                </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 14 Themes */}
      <section id="themes" className="py-20 section-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-14">
              <span className="text-[#C9921A] text-sm font-bold uppercase tracking-widest">{t.about.themesBadge}</span>
              <h2 className="text-4xl font-black text-white mt-3">{t.about.themesTitle}</h2>
              <p className="mt-4 max-w-2xl mx-auto text-theme-primary">
                {t.about.themesIntro}
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {themes.map((theme, i) => (
              <FadeIn key={theme.id} delay={i * 0.04}>
                <div className="glass rounded-xl p-5 border border-white/5 hover:border-white/15 transition-colors card-hover">
                  <div className="flex items-start gap-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-base font-black"
                      style={{ background: `${theme.color}20`, color: theme.color, border: `1px solid ${theme.color}30` }}
                    >
                      {theme.id}
                    </div>
                    <div>
                      <p className="text-white text-sm font-semibold leading-relaxed">
                        {theme.label}
                      </p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Tripartism */}
      <section className="py-20 bg-[var(--bg-alt)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-14">
              <span className="text-[#C9921A] text-sm font-bold uppercase tracking-widest">{t.about.tripartiteSectionBadge}</span>
              <h2 className="text-4xl font-black text-white mt-3">{t.about.tripartiteTitle}</h2>
              <p className="mt-4 max-w-2xl mx-auto text-theme-primary">
                {t.about.tripartiteIntro}
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { color: "#3B82F6", item: t.about.tripartiteItems[0] },
              { color: "#C9921A", item: t.about.tripartiteItems[1] },
              { color: "#10B981", item: t.about.tripartiteItems[2] },
            ].map((pillar, i) => (
              <FadeIn key={i} delay={i * 0.15}>
                <div className="glass rounded-2xl p-8 text-center card-hover border border-white/5">
                  <h3 className="text-xl font-black mb-3" style={{ color: pillar.color }}>{pillar.item.title}</h3>
                  <p className="text-sm leading-relaxed text-theme-primary">{pillar.item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Venue */}
      <section id="venue" className="py-20 section-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <FadeIn>
              <div>
                <span className="text-[#C9921A] text-sm font-bold uppercase tracking-widest">{t.about.venueBadge}</span>
                <h2 className="text-3xl font-black text-white mt-3 mb-6">
                  {t.about.venueTitle.includes("·") ? (
                    <>
                      {t.about.venueTitle.split("·")[0]?.trim()}<br />
                      <span className="gradient-text">{t.about.venueTitle.split("·")[1]?.trim()}</span>
                    </>
                  ) : (
                    <span className="gradient-text">{t.about.venueTitle}</span>
                  )}
                </h2>
                <p className="leading-relaxed mb-6 text-theme-primary">
                  {t.about.venueIntro}
                </p>
                <div className="space-y-3 mb-8">
                  {t.about.venueBullets.map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-[#10B981] mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-theme-primary">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 glass rounded-xl p-3">
                  <MapPin className="w-5 h-5 text-[#C9921A]" />
                  <span className="text-sm text-theme-primary">{t.about.venueAddress}</span>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="space-y-4">
                {[
                  { title: "Summit Week", value: "21–25 Sep 2026" },
                  { title: "Official Opening Day", value: "Wednesday 23 September" },
                  { title: "Gala Dinner", value: "Wednesday 23 Sep, Black Tie" },
                  { title: "Innovation Challenge Finals", value: "During Gala Dinner" },
                  { title: "Excursions Day", value: "Friday 25 September" },
                  { title: "Nearest Airport", value: "Victoria Falls International Airport" },
                  { title: "Time Zone", value: "CAT (UTC+2)" },
                  { title: "Currency", value: "USD / ZiG" },
                ].map((item, i) => (
                  <div key={i} className="glass rounded-xl p-4">
                    <div className="text-xs text-theme-primary">{item.title}</div>
                    <div className="text-white text-sm font-semibold mt-0.5">{item.value}</div>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* TNF Secretariat */}
      <section className="py-20 bg-[var(--bg-alt)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <span className="text-[#C9921A] text-sm font-bold uppercase tracking-widest">{t.about.organiserBadge}</span>
            <h2 className="text-3xl font-black text-white mt-3 mb-6">{t.about.organiserTitle}</h2>
            <p className="leading-relaxed mb-4 text-theme-primary">
              {t.about.organiserDesc1}
            </p>
            <p className="leading-relaxed mb-8 text-theme-primary">
              {t.about.organiserDesc2}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact" className="btn-gold px-8 py-3 rounded-xl text-sm font-bold flex items-center gap-2">
                {t.about.contactSecretariat}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={summitInfo.mainWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline-gold px-8 py-3 rounded-xl text-sm font-semibold flex items-center gap-2"
              >
                {t.about.visitTnfWebsite}
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
