"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { ArrowRight, Mic, Globe, Star, Users, Calendar, Bell } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { useLanguage } from "@/context/LanguageContext";

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay }} className={className}>
      {children}
    </motion.div>
  );
}

const profileIcons = ["🏛", "📊", "🌍", "🌐", "💱", "💼", "💪", "🤖", "🗺", "⭐", "🚀", "🤝"];
const profileColors = ["#3B82F6", "#C9921A", "#10B981", "#8B5CF6", "#F59E0B", "#EC4899", "#14B8A6", "#6366F1", "#84CC16", "#C9921A", "#F59E0B", "#64748B"];

export default function SpeakersPage() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <PageHeader title={t.speakers.heroTitle} subtitle={t.speakers.heroSub} />

      {/* Coming Soon Banner */}
      <div className="bg-[#C9921A]/10 border-y border-[#C9921A]/20 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center gap-3">
          <Bell className="w-5 h-5 text-[#F5B730]" />
          <p className="text-[#F5B730] text-sm font-semibold">
            {t.speakers.comingSoonBanner}
          </p>
          <Link href="/registration" className="text-[#0A1628] bg-[#C9921A] px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-[#F5B730] transition-colors">
            {t.speakers.registerCta}
          </Link>
        </div>
      </div>

      {/* Expected Speaker Profiles */}
      <section className="py-20 section-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-14">
              <span className="text-[#C9921A] text-sm font-bold uppercase tracking-widest">{t.speakers.profilesBadge}</span>
              <h2 className="text-4xl font-black text-white mt-3">{t.speakers.profilesTitle}</h2>
              <p className="mt-4 max-w-2xl mx-auto text-theme-primary">
                {t.speakers.profilesSub}
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {t.speakers.expectedProfiles.map((profile, i) => (
              <FadeIn key={i} delay={i * 0.05}>
                <div className="glass rounded-2xl p-5 card-hover h-full border border-white/5 hover:border-white/15 transition-colors">
                  <div className="flex items-start gap-4 mb-3">
                    <div className="text-3xl">{profileIcons[i] ?? "🎤"}</div>
                    <div>
                      <h3 className="text-white font-bold text-sm leading-snug">{profile.role}</h3>
                      <div className="flex items-center gap-1.5 mt-1">
                        <Calendar className="w-3 h-3 text-[#C9921A]" />
                        <span className="text-[#C9921A] text-xs">{profile.day}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs leading-relaxed text-theme-primary">{profile.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Speaking at the Summit */}
      <section className="py-20 bg-[var(--bg-alt)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <FadeIn>
              <div>
                <span className="text-[#C9921A] text-sm font-bold uppercase tracking-widest">{t.speakers.forSpeakersBadge}</span>
                <h2 className="text-3xl font-black text-white mt-3 mb-6">
                  {t.speakers.forSpeakersTitle}
                </h2>
                <p className="leading-relaxed mb-6 text-theme-primary">
                  {t.speakers.forSpeakersIntro}
                </p>
                <div className="space-y-3 mb-8">
                  {t.speakers.forSpeakersBullets.map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <Mic className="w-4 h-4 text-[#C9921A] mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-theme-primary">{item}</span>
                    </div>
                  ))}
                </div>
                <Link href="/contact" className="btn-gold px-8 py-3 rounded-xl text-sm font-bold inline-flex items-center gap-2">
                  {t.speakers.speakerEnquiries}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="glass-gold rounded-3xl p-8 text-center">
                <div className="text-5xl mb-4">🎤</div>
                <h3 className="text-2xl font-black text-white mb-4">{t.speakers.reachTitle}</h3>
                <p className="mb-6 text-sm leading-relaxed text-theme-primary">
                  {t.speakers.reachIntro}
                </p>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {t.speakers.reachStats.map((stat) => (
                    <div key={stat.label} className="glass rounded-xl p-3 text-center">
                      <div className="text-xl font-black gradient-text">{stat.value}</div>
                      <div className="text-xs mt-1 text-theme-primary">{stat.label}</div>
                    </div>
                  ))}
                </div>
                <Link href="/contact" className="btn-outline-gold px-8 py-3 rounded-xl text-sm font-semibold inline-flex items-center gap-2">
                  {t.speakers.contactProgrammeTeam}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Innovation Challenge */}
      <section className="py-20 section-gradient">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <div className="text-5xl mb-6">🚀</div>
            <span className="text-[#C9921A] text-sm font-bold uppercase tracking-widest">{t.speakers.innovationBadge}</span>
            <h2 className="text-3xl font-black text-white mt-3 mb-6">{t.speakers.innovationTitle}</h2>
            <p className="leading-relaxed mb-8 text-theme-primary">
              {t.speakers.innovationIntro}
            </p>
            <div className="glass rounded-2xl p-6 mb-8 text-left">
              <h3 className="text-[#F5B730] font-bold mb-4">{t.speakers.innovationFormatTitle}</h3>
              <div className="space-y-2 text-sm">
                {t.speakers.innovationFormatItems.map((item) => (
                  <div key={item.label} className="flex gap-3">
                    <Star className="w-4 h-4 text-[#C9921A] mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-white font-semibold">{item.label}: </span>
                      <span className="text-theme-primary">{item.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <Link href="/registration" className="btn-gold px-10 py-4 rounded-xl text-sm font-bold inline-flex items-center gap-2">
              {t.speakers.applyInnovation}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
