"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight, CheckCircle, ExternalLink,
} from "lucide-react";
import CountdownTimer from "@/components/CountdownTimer";
import HelloPageGallerySlider from "@/components/HelloPageGallerySlider";
import { WILDLIFE_SLIDES } from "@/lib/wildlifeSlides";
import { useLanguage } from "@/context/LanguageContext";
import { summitInfo, themes, keyFacts, sponsors } from "@/lib/data";

/** End of each Innovation Timeline step. A step is ticked once this date has passed. */
const INNOVATION_STEP_ENDS = [
  "2026-07-31",
  "2026-08-31",
  "2026-09-22",
  "2026-09-23",
  "2026-09-23",
] as const;

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function HomePage() {
  const { t } = useLanguage();
  const innovationNow = Date.now();
  const innovationReached = INNOVATION_STEP_ENDS.map(
    (end) => innovationNow > new Date(`${end}T23:59:59`).getTime()
  );
  const innovationCurrent = innovationReached.findIndex((done) => !done);
  return (
    <div className="min-h-screen">
      {/* ─── HERO ─── */}
      <section className="hero-on-photo relative isolate h-[min(70vh,640px)] min-h-[480px] overflow-hidden sm:min-h-[540px]">
        <Image
          src="/2026-11-17 at 12.14.53.jpeg"
          alt="Delegates gathered at the Zimbabwe TNF Global Summit"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_54%]"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(8, 24, 20, 0.28) 0%, rgba(8, 32, 26, 0.38) 46%, rgba(6, 18, 16, 0.72) 100%)",
          }}
        />

        <div className="relative z-10 flex h-full flex-col items-center justify-end px-4 pb-24 pt-24 text-center sm:px-6 sm:pb-28">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mb-3"
          >
            <p
              className="text-3xl font-black leading-[0.98] tracking-tight text-white sm:text-4xl lg:text-5xl"
              style={{ textShadow: "0 2px 24px rgba(0,0,0,0.45)" }}
            >
              {t.home.title}
            </p>
            <p
              className="mt-0.5 text-3xl font-black leading-[0.98] tracking-tight text-[#C9921A] sm:text-4xl lg:text-5xl"
              style={{ textShadow: "0 2px 18px rgba(0,0,0,0.35)" }}
            >
              Global Summit
            </p>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.18 }}
            className="max-w-3xl text-balance text-xl font-bold leading-[1.15] text-white sm:text-2xl lg:text-3xl"
            style={{ textShadow: "0 2px 24px rgba(0,0,0,0.45)" }}
          >
            {t.home.aboutTitle}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.22 }}
            className="mt-4 max-w-xl text-pretty text-base leading-relaxed text-white sm:text-lg"
            style={{ textShadow: "0 1px 12px rgba(0,0,0,0.55)" }}
          >
            {t.home.subtitle1} {t.home.subtitle2}. {t.home.date}, {t.home.venue}.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.34 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4"
          >
            <Link
              href="/registration"
              className="btn-gold rounded-full px-8 py-3 text-sm font-bold sm:text-base"
            >
              {t.home.registerNow}
            </Link>
            <Link
              href="/about"
              className="rounded-full border-2 border-white px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/15 sm:text-base"
            >
              {t.home.aboutHeading}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured strip overlapping the photo, matching the reference layout */}
      <div className="relative z-20 -mt-16 px-4 sm:-mt-20 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="mx-auto flex max-w-6xl flex-col gap-4 rounded-[1.75rem] border-l-[7px] border-[#33A852] bg-white px-5 py-5 shadow-[0_18px_50px_rgba(0,0,0,0.22)] sm:flex-row sm:items-center sm:gap-8 sm:px-8 sm:py-6"
        >
          <div className="min-w-0 flex-1 text-left">
            <p className="text-sm font-semibold text-[#1a1a1a]">{t.home.featuredLabel}</p>
            <h2 className="mt-1 text-base font-bold leading-snug text-[#111827] sm:text-lg">
              {t.home.registerCtaHeading}
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-[#4b5563]">
              {t.home.registerCtaSub}
            </p>
          </div>
          <Link
            href="/registration"
            className="featured-learn-more inline-flex shrink-0 items-center justify-center self-start rounded-full bg-[#14532d] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#166534] sm:mr-16 sm:self-center lg:mr-20"
          >
            {t.cta.learnMore}
          </Link>
        </motion.div>
      </div>

      <section className="relative z-10 pb-8 pt-8 sm:pt-10">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <CountdownTimer />
        </div>
      </section>

      {/* ─── KEY STATS ─── */}
      <section className="key-stats-bar border-y py-4 sm:py-5">
        <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-x-2 gap-y-2 sm:gap-x-3 lg:gap-x-4">
            {keyFacts.map((fact, i) => (
              <FadeIn key={i} delay={i * 0.05}>
                <div className="text-center py-1.5 px-1 sm:py-2 sm:px-1.5">
                  <div className="text-lg sm:text-xl font-black gradient-text leading-tight">{fact.value}</div>
                  <div className="text-[10px] sm:text-xs mt-0.5 leading-snug text-theme-primary">{t.home.keyFactLabels[i] ?? fact.label}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ABOUT ─── */}
      <section className="wallpaper-surface relative overflow-hidden py-20 lg:py-24">
        <HelloPageGallerySlider variant="background" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <motion.div>
              <span className="text-[#C9921A] text-sm font-bold uppercase tracking-widest">{t.home.aboutHeading}</span>
              <h2 className="mt-3 mb-6 whitespace-nowrap text-xl font-bold leading-[1.15] sm:text-2xl lg:text-3xl">
                <span className="gradient-text">{t.home.aboutTitle}</span>
              </h2>
              <div className="max-w-3xl">
              <p className="leading-relaxed mb-6 text-white/90 text-justify text-pretty">
                {t.home.aboutDesc1}
              </p>
              <p className="leading-relaxed mb-8 text-white/90 text-justify text-pretty">
                {t.home.aboutDesc2}
              </p>
              <div className="flex flex-wrap gap-3 pb-10">
                {t.home.aboutTags.map((tag) => (
                  <span key={tag} className="wallpaper-glass glass px-3 py-1.5 rounded-full text-xs border border-white/20 text-white/90">
                    {tag}
                  </span>
                ))}
              </div>
              </div>
            </motion.div>
          </FadeIn>

          <FadeIn delay={0.25}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 lg:mt-6">
              {[
                { title: t.home.aboutCard1Title, sub: t.home.aboutCard1Sub },
                { title: t.home.aboutCard2Title, sub: t.home.aboutCard2Sub },
                { title: t.home.aboutCard3Title, sub: t.home.aboutCard3Sub },
                { title: t.home.aboutCard4Title, sub: t.home.aboutCard4Sub },
              ].map((item) => (
                <div key={item.title} className="wallpaper-glass glass rounded-2xl p-5 card-hover border border-slate-200/80">
                  <div className="font-bold text-sm text-theme-primary">{item.title}</div>
                  <div className="text-xs mt-1 text-theme-primary opacity-90">{item.sub}</div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── WHY ATTEND ─── */}
      <section className="why-attend-photo relative isolate overflow-hidden py-10 sm:py-12">
        <Image
          src="/who-should-attend.jpg"
          alt="Delegates seated at the Zimbabwe TNF Global Summit"
          fill
          unoptimized
          sizes="100vw"
          className="object-cover object-[center_42%]"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(10,22,40,0.22) 0%, rgba(10,22,40,0.12) 52%, rgba(10,22,40,0.28) 100%)",
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="why-attend-heading text-center mb-6 sm:mb-8" style={{ textShadow: "0 2px 16px rgba(0,0,0,0.65)" }}>
              <span className="text-[#C9921A] text-sm font-bold uppercase tracking-widest">{t.home.whyAttendHeading}</span>
              <h2 className="text-4xl font-black text-white mt-2">{t.home.whoShouldAttend}</h2>
              <p className="mt-3 max-w-2xl mx-auto text-white">
                {t.home.whyAttendIntro}
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.home.whyAttendItems.map((item, i) => (
                <FadeIn key={i} delay={i * 0.1}>
                  <div className="glass rounded-2xl p-6 card-hover h-full">
                    <h3 className="text-white font-bold text-sm mb-3">{item.audience}</h3>
                    <p className="text-sm leading-relaxed text-theme-primary">{item.description}</p>
                  </div>
                </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SPOTLIGHT THEMES ─── */}
      <section className="py-20 section-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-14">
              <span className="text-[#C9921A] text-sm font-bold uppercase tracking-widest">{t.home.programmeHeading}</span>
              <h2 className="text-4xl font-black text-white mt-3">{t.home.themesHeading}</h2>
              <p className="mt-4 max-w-2xl mx-auto text-theme-primary">
                {t.home.programmeIntro}
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {themes.map((theme, i) => {
              return (
                <FadeIn key={theme.id} delay={i * 0.04}>
                  <Link
                    href={`/sponsors#theme-${theme.id.toLowerCase()}`}
                    className="block glass rounded-xl p-4 card-hover border border-white/5 hover:border-[#C9921A]/40 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9921A]/50"
                  >
                    <div>
                      <div className="text-xs font-black mb-1" style={{ color: theme.color }}>
                        THEME {theme.id}
                      </div>
                      <p className="text-white text-xs leading-relaxed font-medium">
                        {theme.label}
                      </p>
                    </div>
                  </Link>
                </FadeIn>
              );
            })}
          </div>

          <FadeIn delay={0.2}>
            <div className="text-center mt-10">
              <Link href="/program" className="btn-outline-gold px-8 py-3 rounded-xl text-sm font-semibold inline-flex items-center gap-2">
                {t.home.viewFullProgramme}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── SUMMIT WEEK AT A GLANCE ─── */}
      <section className="py-20 bg-[var(--bg-alt)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-14">
              <span className="text-[#C9921A] text-sm font-bold uppercase tracking-widest">{t.home.scheduleHeading}</span>
              <h2 className="text-4xl font-black text-white mt-3">{t.home.summitWeek}</h2>
              <p className="mt-4 text-theme-primary">{t.home.scheduleDate}</p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
            {t.home.weekDays.map((day, i) => {
              const colors = ["#64748B", "#3B82F6", "#8B5CF6", "#10B981", "#F59E0B", "#EC4899", "#94A3B8"];
              return (
                <FadeIn key={day.date} delay={i * 0.07}>
                  <div className="glass rounded-xl p-4 card-hover text-center border border-white/5 h-full">
                    <div className="text-xs mb-1 text-theme-primary">{day.date}</div>
                    <div className="text-sm font-bold mb-2" style={{ color: colors[i % colors.length] }}>{day.label}</div>
                    <p className="text-xs leading-relaxed text-theme-primary">{day.desc}</p>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── REGISTRATION CTA ─── */}
      <section className="py-20 section-gradient">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="glass-gold rounded-3xl p-10 sm:p-14 text-center relative overflow-hidden">
              <div className="absolute inset-0 pattern-overlay opacity-50" />
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-6">
                  <CheckCircle className="w-4 h-4 text-[#F5B730]" />
                  <span className="text-[#F5B730] text-sm font-semibold">{t.home.registerCtaBadge}</span>
                </div>
                <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
                  {t.home.registerCtaHeading}
                </h2>
                <p className="text-lg mb-8 max-w-2xl mx-auto text-theme-primary">
                  {t.home.registerCtaSub}
                </p>

                <div className="flex flex-wrap items-center justify-center gap-4">
                  <Link href="/registration" className="btn-gold px-10 py-4 rounded-xl text-base font-bold flex items-center gap-2">
                    Register Now
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link href="/registration#fees" className="btn-outline-gold px-8 py-4 rounded-xl text-base font-semibold">
                    {t.home.viewAllFees}
                  </Link>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── PARTNERS ─── */}
      <section className="py-8 sm:py-10 bg-[var(--bg-alt)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-5">
              <span className="text-[#C9921A] text-sm font-bold uppercase tracking-widest">{t.home.partnersHeading}</span>
              <h2 className="text-3xl font-black text-white mt-2">{t.home.partnersSub}</h2>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
              {sponsors.partners.map((partner) => (
                <div
                  key={partner.name}
                  className="rounded-2xl overflow-hidden flex items-center justify-center"
                >
                  {"logo" in partner && partner.logo ? (
                    <Image
                      src={partner.logo}
                      alt={partner.fullName}
                      width={220}
                      height={160}
                      className="h-24 sm:h-32 w-auto object-contain"
                    />
                  ) : (
                    <span className="text-sm font-medium text-theme-primary">{partner.name}</span>
                  )}
                </div>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="text-center mt-5">
              <Link href="/sponsors" className="text-[#C9921A] text-sm hover:text-[#F5B730] transition-colors flex items-center gap-1.5 justify-center">
                {t.home.viewAllSponsors}
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── INNOVATION CHALLENGE ─── */}
      <section className="py-20 section-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <FadeIn>
              <div>
                <span className="text-[#C9921A] text-sm font-bold uppercase tracking-widest">{t.home.innovationHeading}</span>
                <h2 className="text-4xl font-black text-white mt-3 mb-6">
                  {t.home.innovationTitle}
                </h2>
                <p className="leading-relaxed mb-6 text-theme-primary">
                  {t.home.innovationDesc}
                </p>
                <ul className="space-y-3 mb-8">
                  {t.home.innovationBullets.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#10B981] mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-theme-primary">{item}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/innovation/apply" className="btn-gold px-8 py-3 rounded-xl text-sm font-bold inline-flex items-center gap-2">
                  {t.home.applyInnovation}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="glass rounded-3xl p-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-black text-white">{t.home.innovationTimelineTitle}</h3>
                </div>
                <div className="space-y-4">
                  {t.home.innovationSteps.map((item, i) => {
                    const done = innovationReached[i] ?? false;
                    const current = i === innovationCurrent;
                    return (
                    <div key={i} className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full flex-shrink-0 ${done || current ? "bg-[#10B981]" : "bg-slate-600"} ${current ? "pulse-gold" : ""}`} />
                      <div className="flex-1 flex items-center justify-between">
                        <span className={`text-sm font-medium ${done || current ? "text-white" : "text-theme-primary"}`}>{item.step}</span>
                        <span className="text-xs text-theme-primary">{item.date}</span>
                      </div>
                    </div>
                    );
                  })}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ─── VENUE ─── */}
      <section className="wallpaper-surface relative overflow-hidden py-20 lg:py-24">
        <HelloPageGallerySlider
          variant="background"
          slides={WILDLIFE_SLIDES}
          ariaLabel="Elephant Hills Resort and Victoria Falls venue gallery"
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-14">
              <span className="text-[#C9921A] text-sm font-bold uppercase tracking-widest">{t.home.venueHeading}</span>
              <h2 className="text-4xl font-black text-white mt-3">
                {t.home.venueTitle}
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-white/90">
                {t.home.venueIntro}
              </p>
              <Link
                href="/accommodation"
                className="btn-gold inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-xl text-sm font-bold"
              >
                {t.nav.bookAccommodation}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {t.home.venueCards.map((card, i) => (
              <FadeIn key={card.title} delay={i * 0.08}>
                <motion.div className="wallpaper-glass glass rounded-2xl p-6 card-hover border border-slate-200/80">
                  <h3 className="font-bold mb-2 text-theme-primary">{card.title}</h3>
                  <p className="text-sm leading-relaxed text-theme-primary opacity-90">{card.desc}</p>
                </motion.div>
              </FadeIn>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/accommodation"
              className="btn-outline-gold inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold"
            >
              {t.nav.bookAccommodation}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="py-10 sm:py-12 hero-bg pattern-overlay relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl" style={{ background: "rgba(51, 168, 82, 0.12)" }} />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <FadeIn>
            <h2 className="text-5xl sm:text-6xl font-black text-white mb-3">
              <span className="shimmer">{t.home.finalCtaTitle}</span>
            </h2>
            <p className="text-xl mb-6 max-w-2xl mx-auto text-theme-primary">
              {t.home.finalCtaSub}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/registration" className="btn-gold px-12 py-5 rounded-xl text-lg font-black flex items-center gap-2">
                {t.home.registerForSummit}
                <ArrowRight className="w-6 h-6" />
              </Link>
              <Link href="/contact" className="btn-outline-gold px-10 py-5 rounded-xl text-lg font-semibold">
                {t.home.contactUs}
              </Link>
            </div>
            <p className="text-sm mt-4 text-theme-primary">
              {t.home.finalHashtag}
            </p>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
