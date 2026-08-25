"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Calendar, MapPin, Users,
  ArrowRight, ChevronDown, CheckCircle, ExternalLink,
} from "lucide-react";
import CountdownTimer from "@/components/CountdownTimer";
import HelloPageGallerySlider from "@/components/HelloPageGallerySlider";
import { WILDLIFE_SLIDES } from "@/lib/wildlifeSlides";
import { useLanguage } from "@/context/LanguageContext";
import { summitInfo, themes, keyFacts, sponsors } from "@/lib/data";

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
  return (
    <div className="min-h-screen">
      {/* ─── HERO ─── */}
      <section className="relative min-h-screen hero-bg pattern-overlay flex flex-col items-center justify-center overflow-hidden">
        {/* Animated orbs, TNF logo colors (green, yellow, red) */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse" style={{ background: "rgba(51, 168, 82, 0.2)" }} />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full blur-3xl animate-pulse" style={{ background: "rgba(251, 188, 5, 0.16)", animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-3xl" style={{ background: "rgba(234, 67, 53, 0.06)" }} />

        <div className="relative z-10 w-full max-w-none mx-auto px-2 sm:px-4 md:px-5 lg:px-6 xl:px-8 2xl:px-10 pt-24 pb-6 lg:pb-10">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.52fr)] gap-7 lg:gap-8 xl:gap-10 items-center">
            {/* Left: headline, meta, CTAs (Chilmund-style column) */}
            <div className="flex flex-col items-center text-center w-full max-w-3xl mx-auto">
              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="text-4xl sm:text-5xl font-black leading-tight mb-4 text-balance"
              >
                <span className="text-white">{t.home.title} </span>
                <span className="shimmer">Global Summit</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="text-lg sm:text-2xl font-light mb-2 text-theme-primary max-w-2xl mx-auto"
              >
                {t.home.subtitle1}
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="text-lg sm:text-2xl text-[#C9921A] font-semibold mb-8 max-w-2xl mx-auto"
              >
                {t.home.subtitle2}
              </motion.p>

              {/* Date & Location */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-10"
              >
                <div className="flex items-center gap-2 glass rounded-full px-4 py-2">
                  <Calendar className="w-5 h-5 shrink-0 text-[#C9921A]" />
                  <span className="text-white text-sm font-medium">{t.home.date}</span>
                </div>
                <div className="flex items-center gap-2 glass rounded-full px-4 py-2">
                  <MapPin className="w-5 h-5 shrink-0 text-[#C9921A]" />
                  <span className="text-white text-sm font-medium">{t.home.venue}</span>
                </div>
                <div className="flex items-center gap-2 glass rounded-full px-4 py-2">
                  <Users className="w-5 h-5 shrink-0 text-[#C9921A]" />
                  <span className="text-white text-sm font-medium">{t.home.delegates}</span>
                </div>
              </motion.div>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex flex-wrap items-center justify-center gap-4"
              >
                <Link href="/registration" className="btn-gold px-8 py-4 rounded-xl text-base font-bold flex items-center gap-2">
                  {t.home.registerNow}
                  <ArrowRight className="w-6 h-6 shrink-0" />
                </Link>
                <Link href="/program" className="btn-outline-gold px-8 py-4 rounded-xl text-base font-semibold flex items-center gap-2">
                  {t.home.viewProgramme}
                  <ArrowRight className="w-6 h-6 shrink-0" />
                </Link>
              </motion.div>

              {/* Organised by */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-xs mt-8 text-theme-primary max-w-md mx-auto text-center text-pretty"
              >
                {t.home.organisedBy}
              </motion.p>
            </div>

            {/* Right: image slider sharing the row */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.75, delay: 0.2 }}
              className="w-full min-w-0 mx-auto lg:mx-0"
            >
              <HelloPageGallerySlider className="w-full" />
            </motion.div>
          </div>
        </div>

        {/* Countdown — full width below the two columns */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="relative z-10 w-full max-w-none mx-auto px-2 sm:px-4 md:px-5 lg:px-6 xl:px-8 2xl:px-10 pb-14 lg:pb-16"
        >
          <div className="glass rounded-2xl px-4 py-3 sm:px-5 sm:py-4 lg:px-6 lg:py-5">
            <CountdownTimer />
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="flex flex-col items-center gap-1 cursor-pointer text-theme-primary"
          >
            <span className="text-xs uppercase tracking-widest">{t.home.explore}</span>
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </motion.div>
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
            <motion.div className="max-w-3xl">
              <span className="text-[#C9921A] text-sm font-bold uppercase tracking-widest">{t.home.aboutHeading}</span>
              <h2 className="text-4xl sm:text-5xl font-black text-white mt-3 mb-6 leading-tight">
                <span className="gradient-text">{t.home.aboutTitle}</span>
              </h2>
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
      <section className="py-20 bg-[var(--bg-alt)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-14">
              <span className="text-[#C9921A] text-sm font-bold uppercase tracking-widest">{t.home.whyAttendHeading}</span>
              <h2 className="text-4xl font-black text-white mt-3">{t.home.whoShouldAttend}</h2>
              <p className="mt-4 max-w-2xl mx-auto text-theme-primary">
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
      <section className="py-16 bg-[var(--bg-alt)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-10">
              <span className="text-[#C9921A] text-sm font-bold uppercase tracking-widest">{t.home.partnersHeading}</span>
              <h2 className="text-3xl font-black text-white mt-3">{t.home.partnersSub}</h2>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
              {sponsors.partners.map((partner) => (
                <div
                  key={partner.name}
                  className="glass px-6 py-3 rounded-xl hover:border-white/20 transition-all border border-transparent card-hover flex items-center justify-center min-h-[3.25rem]"
                >
                  {"logo" in partner && partner.logo ? (
                    <div className="bg-white rounded-lg px-3 py-1.5">
                      <Image
                        src={partner.logo}
                        alt={partner.fullName}
                        width={140}
                        height={56}
                        className="h-10 sm:h-12 w-auto object-contain"
                      />
                    </div>
                  ) : (
                    <span className="text-sm font-medium text-theme-primary">{partner.name}</span>
                  )}
                </div>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="text-center mt-10">
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
                  {t.home.innovationSteps.map((item, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full flex-shrink-0 ${i === 0 ? "bg-[#10B981] pulse-gold" : "bg-slate-600"}`} />
                      <div className="flex-1 flex items-center justify-between">
                        <span className={`text-sm font-medium ${i === 0 ? "text-white" : "text-theme-primary"}`}>{item.step}</span>
                        <span className="text-xs text-theme-primary">{item.date}</span>
                      </div>
                    </div>
                  ))}
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
      <section className="py-24 hero-bg pattern-overlay relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl" style={{ background: "rgba(51, 168, 82, 0.12)" }} />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <FadeIn>
            <h2 className="text-5xl sm:text-6xl font-black text-white mb-6">
              <span className="shimmer">{t.home.finalCtaTitle}</span>
            </h2>
            <p className="text-xl mb-10 max-w-2xl mx-auto text-theme-primary">
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
            <p className="text-sm mt-6 text-theme-primary">
              {t.home.finalHashtag}
            </p>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
