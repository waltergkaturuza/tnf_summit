"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { ArrowRight, Mic, Globe, Star, Users, Calendar, Bell } from "lucide-react";

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay }} className={className}>
      {children}
    </motion.div>
  );
}

const expectedProfiles = [
  {
    role: "Heads of State & Ministers",
    desc: "H.E. President of the Republic of Zimbabwe and Ministers of Finance, Labour, Industry, Trade, Youth and Women&apos;s Affairs from 6+ African nations.",
    icon: "🏛",
    color: "#3B82F6",
    day: "Day 3 — Official Opening",
  },
  {
    role: "Global Economists & Development Leaders",
    desc: "Globally recognised economists and senior development leaders delivering the Day 1 Opening Keynote on Africa&apos;s $3.4 Trillion Investment Frontier.",
    icon: "📊",
    color: "#C9921A",
    day: "Day 1 Keynote",
  },
  {
    role: "ILO Director-General",
    desc: "International Labour Organization Director-General addressing the Official Opening and presenting the ILO Africa Future of Work Monitor 2026.",
    icon: "🌍",
    color: "#10B981",
    day: "Day 2 & Day 3",
  },
  {
    role: "AU Commission Chairperson",
    desc: "African Union Commission Chairperson addressing the Official Opening Ceremony and continental integration agenda.",
    icon: "🌐",
    color: "#8B5CF6",
    day: "Day 3 — Official Opening",
  },
  {
    role: "Reserve Bank Governor",
    desc: "Governor, Reserve Bank of Zimbabwe addressing the FinTech Special Feature Session on Digital Finance and the FinTech Revolution.",
    icon: "💱",
    color: "#F59E0B",
    day: "Day 2",
  },
  {
    role: "ZIDA Director-General",
    desc: "Zimbabwe Investment and Development Agency Director-General facilitating the Investment Pipeline & Deal Facilitation session.",
    icon: "💼",
    color: "#EC4899",
    day: "Day 1 & Day 3",
  },
  {
    role: "African Women Investors & CEOs",
    desc: "Leading African women investors, DFI leaders and women-led enterprise CEOs on the closing the gender investment gap panel.",
    icon: "💪",
    color: "#14B8A6",
    day: "Day 2",
  },
  {
    role: "Technology & Future-of-Work Thought Leaders",
    desc: "Global technology and future-of-work thought leaders on AI, automation, platform economy and the jobs of tomorrow.",
    icon: "🤖",
    color: "#6366F1",
    day: "Day 2",
  },
  {
    role: "Regional Investment Representatives",
    desc: "Panelists from East Africa, West Africa (ECOWAS), Middle East/Gulf, Asia-Pacific, Europe and Americas on frontier investment opportunities.",
    icon: "🗺",
    color: "#84CC16",
    day: "Day 2 — Theme N Panel",
  },
  {
    role: "Zimbabwe&apos;s Indigenous Business Champions",
    desc: "Zimbabwe&apos;s most prominent and successful indigenous business leaders discussing indigenous entrepreneurship and economic empowerment.",
    icon: "⭐",
    color: "#C9921A",
    day: "Day 1 — Theme M Panel",
  },
  {
    role: "Youth Innovation Challenge Finalists",
    desc: "12 African youth finalists pitching digital and green economy solutions to a live global investor panel.",
    icon: "🚀",
    color: "#F59E0B",
    day: "Day 2 Round 1 & Day 3 Finals",
  },
  {
    role: "ESC Network Delegates",
    desc: "Economic and Social Council delegates and tripartite institution representatives from AICESIS and UCESA member institutions.",
    icon: "🤝",
    color: "#64748B",
    day: "Day 2 — ESC Session",
  },
];

export default function SpeakersPage() {
  return (
    <div className="min-h-screen bg-[#0A1628] pt-20">
      {/* Header */}
      <section className="py-20 hero-bg pattern-overlay relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0A1628]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-[#C9921A] text-sm font-bold uppercase tracking-widest">TNF Global Summit 2026</span>
            <h1 className="text-4xl sm:text-5xl font-black text-white mt-3 mb-4">
              Keynote Speakers <span className="gradient-text">&amp; Panelists</span>
            </h1>
            <p className="text-slate-400 max-w-2xl mx-auto">
              World-class speakers including heads of state, ministers, global economists, investment leaders, technology innovators and social dialogue experts.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Coming Soon Banner */}
      <div className="bg-[#C9921A]/10 border-y border-[#C9921A]/20 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center gap-3">
          <Bell className="w-5 h-5 text-[#F5B730]" />
          <p className="text-[#F5B730] text-sm font-semibold">
            Official speaker confirmations will be announced progressively. Register now to receive speaker updates.
          </p>
          <Link href="/registration" className="text-[#0A1628] bg-[#C9921A] px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-[#F5B730] transition-colors">
            Register
          </Link>
        </div>
      </div>

      {/* Expected Speaker Profiles */}
      <section className="py-20 section-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-14">
              <span className="text-[#C9921A] text-sm font-bold uppercase tracking-widest">Speaker Profiles</span>
              <h2 className="text-4xl font-black text-white mt-3">Expected Speaker Categories</h2>
              <p className="text-slate-400 mt-4 max-w-2xl mx-auto">
                The Summit programme features speakers across these high-level categories. Individual speaker confirmations to be announced.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {expectedProfiles.map((profile, i) => (
              <FadeIn key={i} delay={i * 0.05}>
                <div className="glass rounded-2xl p-5 card-hover h-full border border-white/5 hover:border-white/15 transition-colors">
                  <div className="flex items-start gap-4 mb-3">
                    <div className="text-3xl">{profile.icon}</div>
                    <div>
                      <h3 className="text-white font-bold text-sm leading-snug">{profile.role}</h3>
                      <div className="flex items-center gap-1.5 mt-1">
                        <Calendar className="w-3 h-3 text-[#C9921A]" />
                        <span className="text-[#C9921A] text-xs">{profile.day}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-slate-400 text-xs leading-relaxed">{profile.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Speaking at the Summit */}
      <section className="py-20 bg-[#061020]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <FadeIn>
              <div>
                <span className="text-[#C9921A] text-sm font-bold uppercase tracking-widest">For Speakers</span>
                <h2 className="text-3xl font-black text-white mt-3 mb-6">
                  Speaking at the <span className="gradient-text">TNF Global Summit</span>
                </h2>
                <p className="text-slate-300 leading-relaxed mb-6">
                  The TNF Global Summit offers unparalleled visibility before Africa&apos;s most influential audience of ministers, investors, social partners and development institutions.
                </p>
                <div className="space-y-3 mb-8">
                  {[
                    "Plenary keynote sessions (45–60 minutes)",
                    "High-level panel discussions (90 minutes)",
                    "Concurrent thematic workshops (60–90 minutes)",
                    "Special feature sessions and roundtables",
                    "Innovation Challenge jury participation",
                    "Bilateral meeting scheduling via Summit App",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <Mic className="w-4 h-4 text-[#C9921A] mt-0.5 flex-shrink-0" />
                      <span className="text-slate-300 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
                <Link href="/contact" className="btn-gold px-8 py-3 rounded-xl text-sm font-bold inline-flex items-center gap-2">
                  Speaker Enquiries
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="glass-gold rounded-3xl p-8 text-center">
                <div className="text-5xl mb-4">🎤</div>
                <h3 className="text-2xl font-black text-white mb-4">Reach 1,500+ Leaders</h3>
                <p className="text-slate-400 mb-6 text-sm leading-relaxed">
                  Speak before ministers, policymakers, institutional investors, DFI leaders, business executives and civil society leaders from across Africa and the world.
                </p>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {[
                    { value: "1,500+", label: "Delegates" },
                    { value: "6+", label: "African Nations" },
                    { value: "20+", label: "Sessions" },
                    { value: "7", label: "Days" },
                  ].map((stat) => (
                    <div key={stat.label} className="glass rounded-xl p-3 text-center">
                      <div className="text-xl font-black gradient-text">{stat.value}</div>
                      <div className="text-slate-400 text-xs mt-1">{stat.label}</div>
                    </div>
                  ))}
                </div>
                <Link href="/contact" className="btn-outline-gold px-8 py-3 rounded-xl text-sm font-semibold inline-flex items-center gap-2">
                  Contact Programme Team
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
            <span className="text-[#C9921A] text-sm font-bold uppercase tracking-widest">Youth Innovation</span>
            <h2 className="text-3xl font-black text-white mt-3 mb-6">TNF Innovation Challenge</h2>
            <p className="text-slate-300 leading-relaxed mb-8">
              Are you an African youth entrepreneur with a solution for digital or green economy challenges? Apply to pitch at the TNF Innovation Challenge before a live global investor jury.
            </p>
            <div className="glass rounded-2xl p-6 mb-8 text-left">
              <h3 className="text-[#F5B730] font-bold mb-4">Challenge Format</h3>
              <div className="space-y-2 text-sm">
                {[
                  { label: "Applications", value: "Open now until May 2026" },
                  { label: "Shortlist", value: "12 African youth finalists" },
                  { label: "Round 1", value: "22 September 2026 — Live pitches before investor panel" },
                  { label: "Audience voting", value: "Real-time — Top 5 advance to Finals" },
                  { label: "Finals", value: "23 September 2026 — Ministerial Gala Dinner" },
                  { label: "Prize", value: "Investment connections, mentorship & global visibility" },
                ].map((item) => (
                  <div key={item.label} className="flex gap-3">
                    <Star className="w-4 h-4 text-[#C9921A] mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-white font-semibold">{item.label}: </span>
                      <span className="text-slate-400">{item.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <Link href="/registration" className="btn-gold px-10 py-4 rounded-xl text-sm font-bold inline-flex items-center gap-2">
              Apply for Innovation Challenge
              <ArrowRight className="w-5 h-5" />
            </Link>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
