"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Star, Globe, CheckCircle, Mail, TrendingUp } from "lucide-react";
import { sponsors } from "@/lib/data";
import { fetchPublicSponsorLogos, type MediaFile } from "@/lib/storage";

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay }} className={className}>
      {children}
    </motion.div>
  );
}

const tiers = [
  {
    id: "platinum",
    label: "Platinum",
    emoji: "💎",
    color: "#94A3B8",
    bgColor: "rgba(148, 163, 184, 0.1)",
    borderColor: "rgba(148, 163, 184, 0.3)",
    description: "Premier event partners with maximum visibility across all summit touchpoints.",
    benefits: [
      "Prime logo placement on all summit materials & stage backdrops",
      "Dedicated exhibition booth — premium location",
      "Speaking opportunity at a plenary session",
      "VIP delegate seats (10 delegates)",
      "Bilateral meeting priority booking",
      "Summit App sponsor spotlight",
      "Post-summit report brand placement",
      "Press release co-branding",
    ],
    sponsors: sponsors.platinum,
  },
  {
    id: "gold",
    label: "Gold",
    emoji: "🥇",
    color: "#C9921A",
    bgColor: "rgba(201, 146, 26, 0.1)",
    borderColor: "rgba(201, 146, 26, 0.3)",
    description: "High-profile partners with prominent brand exposure and delegate access.",
    benefits: [
      "Logo on summit website, programme & signage",
      "Exhibitor booth — standard location",
      "Plenary mention at opening session",
      "VIP delegate seats (6 delegates)",
      "Bilateral meeting scheduling access",
      "Summit App brand listing",
    ],
    sponsors: sponsors.gold,
  },
  {
    id: "silver",
    label: "Silver",
    emoji: "🥈",
    color: "#CBD5E1",
    bgColor: "rgba(203, 213, 225, 0.1)",
    borderColor: "rgba(203, 213, 225, 0.3)",
    description: "Associate partners with brand visibility and programme engagement.",
    benefits: [
      "Logo on summit website & programme book",
      "Exhibitor table-top display",
      "Delegate seats (4 delegates)",
      "Summit App brand listing",
      "Networking event acknowledgement",
    ],
    sponsors: sponsors.silver,
  },
  {
    id: "partners",
    label: "Official Partners",
    emoji: "🤝",
    color: "#10B981",
    bgColor: "rgba(16, 185, 129, 0.1)",
    borderColor: "rgba(16, 185, 129, 0.3)",
    description: "Strategic partners providing expertise, networks and programme support.",
    benefits: [
      "Partner acknowledgement in opening remarks",
      "Logo on summit website & digital materials",
      "Delegate seats (2 delegates)",
      "Partner spotlight on Summit App",
    ],
    sponsors: sponsors.partners,
  },
];

const whySponsor = [
  { icon: "👥", value: "1,500+", label: "Senior Delegates", desc: "Ministers, investors, DFI leaders, social partners" },
  { icon: "🌍", value: "30+", label: "Countries Represented", desc: "Pan-African and global delegate base" },
  { icon: "💼", value: "USD Billions", label: "Investment Discussed", desc: "Deal rooms, pipelines and LOI signings" },
  { icon: "📺", value: "Hybrid", label: "Media Reach", desc: "Live streaming and media coverage" },
];

export default function SponsorsPage() {
  const [logos, setLogos] = useState<MediaFile[]>([]);

  useEffect(() => {
    fetchPublicSponsorLogos().then(setLogos).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-[#0A1628] pt-20">
      {/* Header */}
      <section className="py-20 hero-bg pattern-overlay relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0A1628]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-[#C9921A] text-sm font-bold uppercase tracking-widest">Partners & Sponsors</span>
            <h1 className="text-4xl sm:text-5xl font-black text-white mt-3 mb-4">
              Sponsors & <span className="gradient-text">Official Partners</span>
            </h1>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Join Africa&apos;s most influential tripartite platform as a sponsor or partner. Position your organisation at the intersection of policy, investment and decent work.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Partner Logos — from Supabase Storage */}
      {logos.length > 0 && (
        <section className="py-16 section-gradient">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <div className="text-center mb-10">
                <span className="text-[#C9921A] text-sm font-bold uppercase tracking-widest">Our Partners</span>
                <h2 className="text-2xl font-black text-white mt-3">Official Partners & Sponsors</h2>
              </div>
            </FadeIn>
            <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-12">
              {logos.map((logo, i) => (
                <FadeIn key={logo.id} delay={i * 0.05}>
                  <div className="flex flex-col items-center gap-3 group">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl glass flex items-center justify-center p-3 border border-white/5 hover:border-[#C9921A]/30 transition-colors">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={logo.publicUrl}
                        alt={logo.altText}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    {logo.caption && (
                      <p className="text-slate-400 text-xs text-center max-w-[120px]">{logo.caption}</p>
                    )}
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why Sponsor */}
      <section className="py-16 section-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-10">
              <h2 className="text-3xl font-black text-white">Why Sponsor the TNF Global Summit?</h2>
              <p className="text-slate-400 mt-3 max-w-2xl mx-auto">
                Unparalleled access to Africa&apos;s most senior decision-makers, investors and policy shapers.
              </p>
            </div>
          </FadeIn>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {whySponsor.map((item, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="glass rounded-2xl p-5 text-center card-hover">
                  <div className="text-3xl mb-2">{item.icon}</div>
                  <div className="text-2xl font-black gradient-text">{item.value}</div>
                  <div className="text-white font-bold text-sm mt-1">{item.label}</div>
                  <div className="text-slate-500 text-xs mt-1">{item.desc}</div>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.2}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                "Exclusive access to Africa&apos;s premier tripartite convening platform",
                "Direct engagement with ministers and senior policymakers",
                "Investment deal room participation facilitated by ZIDA",
                "ESG leadership positioning before institutional investors and DFIs",
                "Bilateral meeting matching with potential partners and clients",
                "Media and press exposure at a globally recognised summit",
                "Association with UN SDG 8, AU Agenda 2063 and AfCFTA frameworks",
                "Post-summit report distribution to all delegates and partners",
              ].map((benefit) => (
                <div key={benefit} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#10B981] mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300 text-sm">{benefit}</span>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Sponsorship Tiers */}
      <section className="py-20 bg-[#061020]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-14">
              <span className="text-[#C9921A] text-sm font-bold uppercase tracking-widest">Sponsorship</span>
              <h2 className="text-4xl font-black text-white mt-3">Sponsorship Packages</h2>
            </div>
          </FadeIn>

          <div className="space-y-8">
            {tiers.map((tier, i) => (
              <FadeIn key={tier.id} delay={i * 0.1}>
                <div
                  className="glass rounded-2xl p-6 sm:p-8 border"
                  style={{ borderColor: tier.borderColor, background: tier.bgColor }}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Tier info */}
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-3xl">{tier.emoji}</span>
                        <div>
                          <div className="text-sm text-slate-400 font-medium">Sponsorship Level</div>
                          <h3 className="text-2xl font-black" style={{ color: tier.color }}>
                            {tier.label}
                          </h3>
                        </div>
                      </div>
                      <p className="text-slate-400 text-sm mb-4">{tier.description}</p>

                      {/* Existing sponsors */}
                      {tier.sponsors.length > 0 && (
                        <div>
                          <div className="text-slate-500 text-xs font-bold uppercase mb-2">Current {tier.label} Partners</div>
                          <div className="space-y-2">
                            {tier.sponsors.map((s) => (
                              <a
                                key={s.name}
                                href={s.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 glass rounded-lg px-3 py-2 hover:border-white/20 transition-colors border border-transparent"
                              >
                                <div
                                  className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black"
                                  style={{ background: `${tier.color}20`, color: tier.color }}
                                >
                                  {s.name.slice(0, 2)}
                                </div>
                                <div>
                                  <div className="text-white text-xs font-bold">{s.name}</div>
                                  <div className="text-slate-500 text-[10px]">{s.description}</div>
                                </div>
                                <Globe className="w-3 h-3 text-slate-500 ml-auto" />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Benefits */}
                    <div className="lg:col-span-2">
                      <div className="text-slate-400 text-xs font-bold uppercase mb-3">Package Benefits</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {tier.benefits.map((b) => (
                          <div key={b} className="flex items-start gap-2.5">
                            <Star className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: tier.color }} />
                            <span className="text-slate-300 text-sm">{b}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-5">
                        <Link
                          href="/contact"
                          className="inline-flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl transition-all"
                          style={{
                            background: `${tier.color}20`,
                            color: tier.color,
                            border: `1px solid ${tier.color}40`,
                          }}
                        >
                          Enquire About {tier.label} Sponsorship
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 section-gradient">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <div className="glass-gold rounded-3xl p-10 sm:p-12">
              <div className="text-4xl mb-4">🤝</div>
              <h2 className="text-3xl font-black text-white mb-4">Become a Summit Partner</h2>
              <p className="text-slate-300 mb-8 leading-relaxed">
                For custom sponsorship packages, sector table sponsorship, and partnership opportunities, contact the TNF Secretariat&apos;s partnerships team directly.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/contact" className="btn-gold px-8 py-3 rounded-xl text-sm font-bold flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Contact Partnerships Team
                </Link>
                <a
                  href="mailto:info@tnfzim.com"
                  className="btn-outline-gold px-8 py-3 rounded-xl text-sm font-semibold flex items-center gap-2"
                >
                  <TrendingUp className="w-4 h-4" />
                  info@tnfzim.com
                </a>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
