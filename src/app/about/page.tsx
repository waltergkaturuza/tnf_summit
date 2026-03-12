"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import {
  ArrowRight, CheckCircle, MapPin, Calendar, Users,
  Globe, TrendingUp, Mic, Building, Rocket, Heart,
  Star, Landmark, Handshake
} from "lucide-react";
import { summitInfo, themes, whyAttend } from "@/lib/data";

const iconMap: Record<string, React.ElementType> = {
  TrendingUp, Globe, Handshake, Rocket, Landmark, Heart, Building, Mic, Users,
};

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
  return (
    <div className="min-h-screen bg-[#0A1628] pt-20">
      {/* Header */}
      <section className="py-20 hero-bg pattern-overlay relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0A1628]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-[#C9921A] text-sm font-bold uppercase tracking-widest">About the Summit</span>
            <h1 className="text-4xl sm:text-5xl font-black text-white mt-3 mb-4">
              Africa&apos;s Premier <span className="gradient-text">Tripartite Platform</span>
            </h1>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              The inaugural TNF Global Summit on Inclusive Growth, Decent Work & Investment Promotion — setting the standard for tripartite-led global convening.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 section-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <FadeIn>
              <div>
                <span className="text-[#C9921A] text-sm font-bold uppercase tracking-widest">The Summit</span>
                <h2 className="text-3xl font-black text-white mt-3 mb-6">What is the TNF Global Summit?</h2>
                <p className="text-slate-300 leading-relaxed mb-4">
                  The TNF Global Summit on Inclusive Growth, Decent Work and Investment Promotion is Africa&apos;s premier tripartite-led global convening platform. It is the inaugural flagship event of the Tripartite Negotiating Forum (TNF) Secretariat of Zimbabwe.
                </p>
                <p className="text-slate-400 leading-relaxed mb-4">
                  Anchored in the United Nations Sustainable Development Goal 8 (SDG 8), the African Union&apos;s Agenda 2063, the African Continental Free Trade Area (AfCFTA), and Zimbabwe&apos;s National Development Strategy 2 (NDS2) and Vision 2030, the Summit brings together the world&apos;s most influential voices on economic growth, decent work, and investment.
                </p>
                <p className="text-slate-400 leading-relaxed mb-8">
                  Hosted at the iconic Elephant Hills Resort in Victoria Falls, Zimbabwe, the Summit produces binding policy commitments, investment pipelines, and measurable social outcomes, positioning Zimbabwe and the TNF as Africa&apos;s recognised global convening hub.
                </p>
                <div className="flex flex-wrap gap-3">
                  {["UN SDG 8", "AU Agenda 2063", "AfCFTA", "Zimbabwe NDS2", "Vision 2030", "Tripartism", "Social Dialogue"].map((tag) => (
                    <span key={tag} className="glass px-3 py-1.5 rounded-full text-xs text-slate-300">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="space-y-4">
                {[
                  { icon: "🎯", title: "Binding Policy Commitments", desc: "The Summit produces tangible policy commitments adopted by participating governments and social partners." },
                  { icon: "💰", title: "Investment Pipelines", desc: "Bankable projects presented to investors with direct matchmaking through ZIDA and development finance institutions." },
                  { icon: "📊", title: "Measurable Outcomes", desc: "The Victoria Falls Declaration captures concrete commitments on inclusive growth and decent work indicators." },
                  { icon: "🌍", title: "Global Convening Hub", desc: "Positions Zimbabwe as Africa&apos;s recognised platform for tripartite-led global dialogue on the future of work." },
                ].map((item, i) => (
                  <div key={i} className="glass rounded-xl p-4 flex items-start gap-4">
                    <div className="text-2xl">{item.icon}</div>
                    <div>
                      <div className="text-white font-bold text-sm">{item.title}</div>
                      <div className="text-slate-400 text-xs mt-1 leading-relaxed">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Why Attend */}
      <section id="why-attend" className="py-20 bg-[#061020]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-14">
              <span className="text-[#C9921A] text-sm font-bold uppercase tracking-widest">Why Attend</span>
              <h2 className="text-4xl font-black text-white mt-3">Who Should Join?</h2>
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
                    <h3 className="text-white font-bold mb-3">{item.audience}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{item.description}</p>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* 14 Themes */}
      <section id="themes" className="py-20 section-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-14">
              <span className="text-[#C9921A] text-sm font-bold uppercase tracking-widest">Spotlight Themes</span>
              <h2 className="text-4xl font-black text-white mt-3">14 Critical Themes</h2>
              <p className="text-slate-400 mt-4 max-w-2xl mx-auto">
                The Summit addresses 14 spotlight themes covering Africa&apos;s most pressing economic transformation agenda.
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
                        {theme.label.replace(" ★ NEW", "")}
                      </p>
                      {theme.isNew && (
                        <span className="inline-block mt-1.5 text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold">
                          ★ NEW FOR 2026
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Tripartism */}
      <section className="py-20 bg-[#061020]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-14">
              <span className="text-[#C9921A] text-sm font-bold uppercase tracking-widest">Our Foundation</span>
              <h2 className="text-4xl font-black text-white mt-3">The Tripartite Model</h2>
              <p className="text-slate-400 mt-4 max-w-2xl mx-auto">
                The TNF Global Summit is grounded in genuine tripartism — bringing together the three key social partners.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { emoji: "🏛", title: "Government", desc: "Ministries of Finance, Labour, Industry, Trade and Youth from African nations — shaping policy.", color: "#3B82F6" },
              { emoji: "💼", title: "Employers", desc: "Confederation of Zimbabwe Industries (CZI) and regional business chambers representing the private sector.", color: "#C9921A" },
              { emoji: "👷", title: "Workers", desc: "Zimbabwe Congress of Trade Unions (ZCTU) and affiliated workers&apos; organisations — the voice of labour.", color: "#10B981" },
            ].map((pillar, i) => (
              <FadeIn key={i} delay={i * 0.15}>
                <div className="glass rounded-2xl p-8 text-center card-hover border border-white/5">
                  <div className="text-5xl mb-4">{pillar.emoji}</div>
                  <h3 className="text-xl font-black mb-3" style={{ color: pillar.color }}>{pillar.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{pillar.desc}</p>
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
                <span className="text-[#C9921A] text-sm font-bold uppercase tracking-widest">Venue</span>
                <h2 className="text-3xl font-black text-white mt-3 mb-6">
                  Elephant Hills Resort<br />
                  <span className="gradient-text">Victoria Falls, Zimbabwe</span>
                </h2>
                <p className="text-slate-300 leading-relaxed mb-6">
                  One of Africa&apos;s most iconic resort venues, Elephant Hills Resort sits on the banks of the Zambezi River, just minutes from the majestic Victoria Falls — Mosi-oa-Tunya — one of the Seven Natural Wonders of the World.
                </p>
                <div className="space-y-3 mb-8">
                  {[
                    "World-class Main Plenary Hall & Syndicate Rooms",
                    "Full exhibition facilities for 200+ exhibitors",
                    "Luxury accommodation on-site",
                    "Zambezi riverfront terrace & pool deck",
                    "Gala dinner Grand Ballroom",
                    "Direct access to Victoria Falls activities",
                    "International airport with direct flights from major hubs",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-[#10B981] mt-0.5 flex-shrink-0" />
                      <span className="text-slate-300 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 glass rounded-xl p-3">
                  <MapPin className="w-5 h-5 text-[#C9921A]" />
                  <span className="text-slate-300 text-sm">Elephant Hills Resort, 1 Squire Mugadza Drive, Victoria Falls, Zimbabwe</span>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="space-y-4">
                {[
                  { title: "Summit Week", value: "20–26 Sep 2026", icon: "📅" },
                  { title: "Official Opening Day", value: "Wednesday 23 September", icon: "🎊" },
                  { title: "Gala Dinner", value: "Wednesday 23 Sep — Black Tie", icon: "🎭" },
                  { title: "Innovation Challenge Finals", value: "During Gala Dinner", icon: "🏆" },
                  { title: "Excursions Day", value: "Friday 25 September", icon: "🦁" },
                  { title: "Nearest Airport", value: "Victoria Falls International Airport", icon: "✈️" },
                  { title: "Time Zone", value: "CAT (UTC+2)", icon: "🕐" },
                  { title: "Currency", value: "USD / ZiG", icon: "💵" },
                ].map((item, i) => (
                  <div key={i} className="glass rounded-xl p-3 flex items-center gap-4">
                    <div className="text-2xl w-10 text-center">{item.icon}</div>
                    <div className="flex-1">
                      <div className="text-slate-400 text-xs">{item.title}</div>
                      <div className="text-white text-sm font-semibold">{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* TNF Secretariat */}
      <section className="py-20 bg-[#061020]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <span className="text-[#C9921A] text-sm font-bold uppercase tracking-widest">Organiser</span>
            <h2 className="text-3xl font-black text-white mt-3 mb-6">Tripartite Negotiating Forum (TNF) Secretariat</h2>
            <p className="text-slate-400 leading-relaxed mb-4">
              The Tripartite Negotiating Forum (TNF) is Zimbabwe&apos;s official tripartite institution, comprising Government, Employers&apos; organisations, and Workers&apos; organisations. It serves as the national platform for structured social dialogue on economic, labour, and social policy matters.
            </p>
            <p className="text-slate-400 leading-relaxed mb-8">
              The TNF Secretariat, based in Harare, Zimbabwe, coordinates the Forum&apos;s activities and manages the TNF Global Summit as part of its mandate to position Zimbabwe as a regional hub for tripartite dialogue and inclusive economic governance.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact" className="btn-gold px-8 py-3 rounded-xl text-sm font-bold flex items-center gap-2">
                Contact the Secretariat
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={summitInfo.mainWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline-gold px-8 py-3 rounded-xl text-sm font-semibold flex items-center gap-2"
              >
                Visit TNF Website
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
