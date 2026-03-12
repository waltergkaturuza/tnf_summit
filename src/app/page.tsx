"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import {
  Calendar, MapPin, Users, Mic, Tag, Globe,
  ArrowRight, ChevronDown, Star, TrendingUp, Cpu,
  Leaf, CreditCard, GraduationCap, Factory, MessageSquare,
  Rocket, Heart, Building, Zap, CheckCircle, ExternalLink,
} from "lucide-react";
import CountdownTimer from "@/components/CountdownTimer";
import { summitInfo, themes, keyFacts, whyAttend, registrationFees } from "@/lib/data";

const iconMap: Record<string, React.ElementType> = {
  TrendingUp, Cpu, Leaf, CreditCard, GraduationCap, Factory, MessageSquare,
  Rocket, Heart, Building, Zap, Star, Globe, Users, Calendar, MapPin, Mic, Tag,
};

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
  return (
    <div className="min-h-screen">
      {/* ─── HERO ─── */}
      <section className="relative min-h-screen hero-bg pattern-overlay flex flex-col items-center justify-center overflow-hidden">
        {/* Animated orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-3xl" />

        <div className="relative z-10 text-center max-w-5xl mx-auto px-4 pt-24 pb-16">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 glass-gold rounded-full px-4 py-2 mb-6"
          >
            <Star className="w-4 h-4 text-[#F5B730]" />
            <span className="text-[#F5B730] text-sm font-semibold">{summitInfo.edition}</span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight mb-4"
          >
            <span className="text-white">TNF </span>
            <span className="shimmer">Global Summit</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg sm:text-2xl text-slate-300 font-light mb-2"
          >
            on Inclusive Growth, Decent Work
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-lg sm:text-2xl text-[#C9921A] font-semibold mb-8"
          >
            & Investment Promotion
          </motion.p>

          {/* Date & Location */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 mb-10"
          >
            <div className="flex items-center gap-2 glass rounded-full px-4 py-2">
              <Calendar className="w-4 h-4 text-[#C9921A]" />
              <span className="text-white text-sm font-medium">20–26 September 2026</span>
            </div>
            <div className="flex items-center gap-2 glass rounded-full px-4 py-2">
              <MapPin className="w-4 h-4 text-[#C9921A]" />
              <span className="text-white text-sm font-medium">Victoria Falls, Zimbabwe</span>
            </div>
            <div className="flex items-center gap-2 glass rounded-full px-4 py-2">
              <Users className="w-4 h-4 text-[#C9921A]" />
              <span className="text-white text-sm font-medium">1,500–2,000 Delegates</span>
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
              Register Now
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/program" className="btn-outline-gold px-8 py-4 rounded-xl text-base font-semibold flex items-center gap-2">
              View Programme
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>

          {/* Organised by */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-slate-500 text-xs mt-8"
          >
            Organised by the <span className="text-slate-400">Tripartite Negotiating Forum (TNF) Secretariat</span>
          </motion.p>
        </div>

        {/* Countdown */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="relative z-10 w-full max-w-3xl mx-auto px-4 pb-20"
        >
          <div className="glass rounded-3xl p-8 sm:p-10">
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
            className="flex flex-col items-center gap-1 text-slate-500 cursor-pointer"
          >
            <span className="text-xs uppercase tracking-widest">Explore</span>
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </motion.div>
      </section>

      {/* ─── KEY STATS ─── */}
      <section className="py-12 bg-[#0D1F3C] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {keyFacts.map((fact, i) => {
              const Icon = iconMap[fact.icon] || Star;
              return (
                <FadeIn key={i} delay={i * 0.05}>
                  <div className="text-center p-3">
                    <Icon className="w-5 h-5 text-[#C9921A] mx-auto mb-2" />
                    <div className="text-xl sm:text-2xl font-black gradient-text">{fact.value}</div>
                    <div className="text-slate-500 text-xs mt-1 leading-tight">{fact.label}</div>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── ABOUT ─── */}
      <section className="py-20 section-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <FadeIn>
              <div>
                <span className="text-[#C9921A] text-sm font-bold uppercase tracking-widest">About the Summit</span>
                <h2 className="text-4xl sm:text-5xl font-black text-white mt-3 mb-6 leading-tight">
                  Africa&apos;s Premier<br />
                  <span className="gradient-text">Tripartite Platform</span>
                </h2>
                <p className="text-slate-300 leading-relaxed mb-6">
                  The TNF Global Summit on Inclusive Growth, Decent Work and Investment Promotion is Africa&apos;s premier tripartite-led global convening platform. Anchored in UN SDG 8, the African Union&apos;s Agenda 2063, the AfCFTA, and Zimbabwe&apos;s NDS2 and Vision 2030.
                </p>
                <p className="text-slate-400 leading-relaxed mb-8">
                  The Summit convenes 1,500–2,000 ministers, policymakers, investors, social partners, development institutions, and youth innovators to bridge economic growth, responsible investment, and decent work through structured social dialogue. Hosted at Elephant Hills Resort — Victoria Falls, Zimbabwe.
                </p>
                <div className="flex flex-wrap gap-3">
                  {["UN SDG 8", "AU Agenda 2063", "AfCFTA", "Zimbabwe Vision 2030", "NDS2"].map((tag) => (
                    <span key={tag} className="glass px-3 py-1.5 rounded-full text-xs text-slate-300 border border-white/10">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: "📍", title: "Victoria Falls", sub: "Elephant Hills Resort, Zimbabwe" },
                  { icon: "📅", title: "7 Days", sub: "20–26 September 2026" },
                  { icon: "🌍", title: "Global Reach", sub: "Ministers, Investors & Social Partners" },
                  { icon: "🏆", title: "Binding Outcomes", sub: "Policy Commitments & Investment Pledges" },
                ].map((item, i) => (
                  <div key={i} className="glass rounded-2xl p-5 card-hover">
                    <div className="text-3xl mb-3">{item.icon}</div>
                    <div className="text-white font-bold text-sm">{item.title}</div>
                    <div className="text-slate-400 text-xs mt-1">{item.sub}</div>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ─── WHY ATTEND ─── */}
      <section className="py-20 bg-[#061020]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-14">
              <span className="text-[#C9921A] text-sm font-bold uppercase tracking-widest">Why Attend</span>
              <h2 className="text-4xl font-black text-white mt-3">Who Should Attend?</h2>
              <p className="text-slate-400 mt-4 max-w-2xl mx-auto">
                The Summit is designed for leaders and changemakers across sectors who want to shape Africa&apos;s economic future.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyAttend.map((item, i) => {
              const Icon = iconMap[item.icon] || Star;
              return (
                <FadeIn key={i} delay={i * 0.1}>
                  <div className="glass rounded-2xl p-6 card-hover h-full">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                      style={{ background: `${item.color}20`, border: `1px solid ${item.color}40` }}
                    >
                      <Icon className="w-6 h-6" style={{ color: item.color }} />
                    </div>
                    <h3 className="text-white font-bold text-sm mb-3">{item.audience}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{item.description}</p>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── SPOTLIGHT THEMES ─── */}
      <section className="py-20 section-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-14">
              <span className="text-[#C9921A] text-sm font-bold uppercase tracking-widest">Programme</span>
              <h2 className="text-4xl font-black text-white mt-3">14 Spotlight Themes</h2>
              <p className="text-slate-400 mt-4 max-w-2xl mx-auto">
                World-class sessions covering the most critical dimensions of Africa&apos;s economic transformation.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {themes.map((theme, i) => {
              const Icon = iconMap[theme.icon] || Star;
              return (
                <FadeIn key={theme.id} delay={i * 0.04}>
                  <div className="glass rounded-xl p-4 card-hover border border-white/5 hover:border-white/15 transition-colors">
                    <div className="flex items-start gap-3">
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ background: `${theme.color}20`, border: `1px solid ${theme.color}30` }}
                      >
                        <Icon className="w-4 h-4" style={{ color: theme.color }} />
                      </div>
                      <div>
                        <div
                          className="text-xs font-black mb-1"
                          style={{ color: theme.color }}
                        >
                          THEME {theme.id}{theme.isNew ? " ★" : ""}
                        </div>
                        <p className="text-white text-xs leading-relaxed font-medium">
                          {theme.label.replace(" ★ NEW", "")}
                        </p>
                        {theme.isNew && (
                          <span className="inline-block mt-1 text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold">
                            NEW
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </FadeIn>
              );
            })}
          </div>

          <FadeIn delay={0.2}>
            <div className="text-center mt-10">
              <Link href="/program" className="btn-outline-gold px-8 py-3 rounded-xl text-sm font-semibold inline-flex items-center gap-2">
                View Full Programme
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── SUMMIT WEEK AT A GLANCE ─── */}
      <section className="py-20 bg-[#061020]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-14">
              <span className="text-[#C9921A] text-sm font-bold uppercase tracking-widest">Schedule</span>
              <h2 className="text-4xl font-black text-white mt-3">Summit Week at a Glance</h2>
              <p className="text-slate-400 mt-4">20–26 September 2026 · Elephant Hills Resort, Victoria Falls</p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3">
            {[
              { date: "Sun 20", label: "Arrival Day", desc: "Registration, check-in & bilateral pre-bookings", emoji: "✈️", color: "#64748B" },
              { date: "Mon 21", label: "Day 1", desc: "Inclusive Growth, Smart Investment & Policy Coherence", emoji: "💼", color: "#3B82F6" },
              { date: "Tue 22", label: "Day 2", desc: "Digitalisation, Platform Economy & Financial Innovation", emoji: "💡", color: "#8B5CF6" },
              { date: "Wed 23", label: "Day 3 ★", desc: "Official Opening + Climate Change & Green Jobs", emoji: "🌱", color: "#10B981" },
              { date: "Thu 24", label: "Day 4", desc: "Youth, Women, Skills & Future of Work + Closing", emoji: "🎓", color: "#EC4899" },
              { date: "Fri 25", label: "Excursions", desc: "Victoria Falls, Zambezi Cruise & Game Drive", emoji: "🦁", color: "#F59E0B" },
              { date: "Sat 26", label: "Departure", desc: "Check-out & airport transfers", emoji: "🏡", color: "#94A3B8" },
            ].map((day, i) => (
              <FadeIn key={i} delay={i * 0.07}>
                <div className="glass rounded-xl p-4 card-hover text-center border border-white/5 h-full">
                  <div className="text-2xl mb-2">{day.emoji}</div>
                  <div className="text-xs text-slate-400 mb-1">{day.date}</div>
                  <div
                    className="text-sm font-bold mb-2"
                    style={{ color: day.color }}
                  >
                    {day.label}
                  </div>
                  <p className="text-slate-400 text-xs leading-relaxed">{day.desc}</p>
                </div>
              </FadeIn>
            ))}
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
                  <span className="text-[#F5B730] text-sm font-semibold">Early Bird Closes 30 June 2026</span>
                </div>
                <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
                  Secure Your Seat Today
                </h2>
                <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
                  Join 1,500+ ministers, policymakers, investors and innovators at Africa&apos;s premier tripartite summit. Early bird rates from USD 100.
                </p>

                {/* Fee preview */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-10 max-w-2xl mx-auto">
                  {registrationFees.slice(0, 3).map((fee) => (
                    <div key={fee.category} className="glass rounded-xl p-3 text-center">
                      <div className="text-[#F5B730] text-xl font-black">${fee.earlyBird}</div>
                      <div className="text-slate-400 text-xs mt-1 leading-tight">{fee.category}</div>
                      <div className="text-slate-500 text-xs line-through">${fee.standard}</div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap items-center justify-center gap-4">
                  <Link href="/registration" className="btn-gold px-10 py-4 rounded-xl text-base font-bold flex items-center gap-2">
                    Register Now
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link href="/registration#fees" className="btn-outline-gold px-8 py-4 rounded-xl text-base font-semibold">
                    View All Fees
                  </Link>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── PARTNERS ─── */}
      <section className="py-16 bg-[#061020]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-10">
              <span className="text-[#C9921A] text-sm font-bold uppercase tracking-widest">Partners & Organisers</span>
              <h2 className="text-3xl font-black text-white mt-3">Official Partners</h2>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
              {["TNF Secretariat", "ILO", "ZIDA", "AU Commission", "AfCFTA Secretariat", "ZCTU", "CZI", "AICESIS"].map((partner) => (
                <div key={partner} className="glass px-6 py-3 rounded-xl text-slate-400 text-sm font-medium hover:text-white hover:border-white/20 transition-all border border-transparent card-hover">
                  {partner}
                </div>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="text-center mt-10">
              <Link href="/sponsors" className="text-[#C9921A] text-sm hover:text-[#F5B730] transition-colors flex items-center gap-1.5 justify-center">
                View all sponsors and partners
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
                <span className="text-[#C9921A] text-sm font-bold uppercase tracking-widest">Youth Innovation</span>
                <h2 className="text-4xl font-black text-white mt-3 mb-6">
                  TNF Innovation<br /><span className="gradient-text">Challenge 2026</span>
                </h2>
                <p className="text-slate-300 leading-relaxed mb-6">
                  12 African youth finalists pitch digital and green economy solutions to a live global investor panel. The top 5 finalists advance to the grand finale at the Ministerial Gala Dinner.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    "Live pitches before global investor jury",
                    "Real-time audience voting",
                    "Start-ups, tech hubs & youth-led enterprises",
                    "Finals at the Ministerial Gala Dinner",
                    "Connect with investors and mentors",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#10B981] mt-0.5 flex-shrink-0" />
                      <span className="text-slate-300 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/registration" className="btn-gold px-8 py-3 rounded-xl text-sm font-bold inline-flex items-center gap-2">
                  Apply for Innovation Challenge
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="glass rounded-3xl p-8">
                <div className="text-center mb-8">
                  <div className="text-6xl mb-4">🚀</div>
                  <h3 className="text-2xl font-black text-white">Innovation Timeline</h3>
                </div>
                <div className="space-y-4">
                  {[
                    { step: "Applications Open", date: "Now — May 2026", status: "open" },
                    { step: "Shortlist Announced", date: "July 2026", status: "upcoming" },
                    { step: "Round 1 Pitches", date: "22 Sep 2026", status: "upcoming" },
                    { step: "Top 5 Finals", date: "23 Sep 2026 — Gala Dinner", status: "upcoming" },
                    { step: "Winner Announced", date: "23 Sep 2026", status: "upcoming" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full flex-shrink-0 ${item.status === "open" ? "bg-[#10B981] pulse-gold" : "bg-slate-600"}`} />
                      <div className="flex-1 flex items-center justify-between">
                        <span className={`text-sm font-medium ${item.status === "open" ? "text-white" : "text-slate-400"}`}>{item.step}</span>
                        <span className="text-xs text-slate-500">{item.date}</span>
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
      <section className="py-20 bg-[#061020]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-14">
              <span className="text-[#C9921A] text-sm font-bold uppercase tracking-widest">Venue</span>
              <h2 className="text-4xl font-black text-white mt-3">
                Elephant Hills Resort<br /><span className="gradient-text">Victoria Falls, Zimbabwe</span>
              </h2>
              <p className="text-slate-400 mt-4 max-w-2xl mx-auto">
                One of Africa&apos;s most iconic resort destinations — overlooking the Zambezi River, minutes from one of the Seven Natural Wonders of the World.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { emoji: "🌊", title: "Zambezi Riverfront", desc: "Overlooking the mighty Zambezi River with breathtaking views from the resort terrace and pool deck." },
              { emoji: "🌍", title: "UNESCO World Heritage", desc: "Minutes from Victoria Falls — Mosi-oa-Tunya, one of the Seven Natural Wonders of the World." },
              { emoji: "🏨", title: "5-Star Conference Facilities", desc: "Main Plenary Hall, Syndicate Hall, breakout rooms, exhibition space and luxury accommodation." },
              { emoji: "✈️", title: "International Connectivity", desc: "Direct flights from Johannesburg, Harare, Nairobi, Dubai, Cape Town and major African capitals." },
              { emoji: "🦁", title: "Wildlife Experiences", desc: "Adjacent to Zambezi National Park — Big Five game drives, river cruises and helicopter flips over the Falls." },
              { emoji: "🤝", title: "World-Class Networking", desc: "Gala dinners, cocktail receptions, and investor deal rooms designed for meaningful connections." },
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <div className="glass rounded-2xl p-6 card-hover border border-white/5">
                  <div className="text-3xl mb-4">{item.emoji}</div>
                  <h3 className="text-white font-bold mb-2">{item.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="py-24 hero-bg pattern-overlay relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-3xl" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <FadeIn>
            <h2 className="text-5xl sm:text-6xl font-black text-white mb-6">
              Be Part of<br /><span className="shimmer">History</span>
            </h2>
            <p className="text-slate-300 text-xl mb-10 max-w-2xl mx-auto">
              Join Africa&apos;s most influential tripartite platform at Victoria Falls. Shape the continent&apos;s economic future.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/registration" className="btn-gold px-12 py-5 rounded-xl text-lg font-black flex items-center gap-2">
                Register for the Summit
                <ArrowRight className="w-6 h-6" />
              </Link>
              <Link href="/contact" className="btn-outline-gold px-10 py-5 rounded-xl text-lg font-semibold">
                Contact Us
              </Link>
            </div>
            <p className="text-slate-500 text-sm mt-6">
              #TNFGlobalSummit · {summitInfo.website}
            </p>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
