"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Star, Globe, CheckCircle, Mail, TrendingUp } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import {
  sponsors,
  themes,
  themeSponsorshipOffers,
  getThemeSponsorshipTiers,
  type ThemeSponsorshipPackageTier,
  summitWidePartnershipTiers,
  summitWidePartnershipIntro,
  getThemeSpotlightSponsorshipDeck,
} from "@/lib/data";
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
      "Dedicated exhibition booth, premium location",
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
      "Exhibitor booth, standard location",
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
  const { t } = useLanguage();
  const [logos, setLogos] = useState<MediaFile[]>([]);
  const [sponsorThemeId, setSponsorThemeId] = useState(themeSponsorshipOffers[0]?.themeId ?? "A");

  const selectedOffer = themeSponsorshipOffers.find((o) => o.themeId === sponsorThemeId) ?? themeSponsorshipOffers[0];
  const selectedThemeTiers = getThemeSponsorshipTiers(sponsorThemeId);
  const showThemePackageBullets = selectedThemeTiers.some((o) => (o.benefitsBullets?.length ?? 0) > 0);
  const spotlightDeck = getThemeSpotlightSponsorshipDeck(sponsorThemeId);

  const themeTierCardStyle: Record<
    ThemeSponsorshipPackageTier,
    { border: string; headerBg: string; panelBg: string }
  > = {
    platinum: {
      border: "rgba(148, 163, 184, 0.35)",
      headerBg: "#475569",
      panelBg: "rgba(59, 130, 246, 0.1)",
    },
    gold: {
      border: "rgba(201, 146, 26, 0.35)",
      headerBg: "#a16207",
      panelBg: "rgba(234, 179, 8, 0.12)",
    },
    silver: {
      border: "rgba(59, 130, 246, 0.35)",
      headerBg: "#1d4ed8",
      panelBg: "rgba(59, 130, 246, 0.08)",
    },
    official_partner: {
      border: "rgba(16, 185, 129, 0.35)",
      headerBg: "#047857",
      panelBg: "rgba(16, 185, 129, 0.1)",
    },
  };

  useEffect(() => {
    fetchPublicSponsorLogos().then(setLogos).catch(() => {});
  }, []);

  useEffect(() => {
    const applyHash = () => {
      const raw = window.location.hash.replace(/^#/, "").trim().toLowerCase();
      const m = raw.match(/^theme-([a-z])$/i) ?? raw.match(/^spotlight-([a-z])$/i);
      if (!m) return;
      const letter = m[1].toUpperCase();
      if (!themes.some((th) => th.id === letter)) return;
      setSponsorThemeId(letter);
      requestAnimationFrame(() => {
        document.getElementById("spotlight-themes")?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    };
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pt-20">
      {/* Header */}
      <section className="py-20 hero-bg pattern-overlay relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--bg-primary)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-[#C9921A] text-sm font-bold uppercase tracking-widest">{t.sponsors.heroBadge}</span>
            <h1 className="text-4xl sm:text-5xl font-black text-white mt-3 mb-4">
              {t.sponsors.heroTitle}
            </h1>
            <p className="max-w-2xl mx-auto text-theme-primary">
              {t.sponsors.heroSub}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Partner Logos, from Supabase Storage */}
      {logos.length > 0 && (
        <section className="py-16 section-gradient">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <div className="text-center mb-10">
                <span className="text-[#C9921A] text-sm font-bold uppercase tracking-widest">{t.sponsors.heroBadge}</span>
                <h2 className="text-2xl font-black text-white mt-3">{t.sponsors.partnersTitle}</h2>
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
                      <p className="text-xs text-center max-w-[120px] text-theme-primary">{logo.caption}</p>
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
              <h2 className="text-3xl font-black text-white">Why Sponsor the Zimbabwe TNF Global Summit?</h2>
              <p className="mt-3 max-w-2xl mx-auto text-theme-primary">
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
                  <div className="text-xs mt-1 text-theme-primary">{item.desc}</div>
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
                  <span className="text-sm text-theme-primary">{benefit}</span>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Summit-wide partnership, full-duration exhibition + visibility */}
      <section className="py-20 section-gradient border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-10 max-w-3xl mx-auto">
              <span className="text-[#C9921A] text-sm font-bold uppercase tracking-widest">Summit-wide partnership tiers</span>
              <h2 className="text-3xl sm:text-4xl font-black text-white mt-3">Full summit partnership & exhibition</h2>
              <p className="mt-4 text-sm text-theme-primary leading-relaxed">{summitWidePartnershipIntro}</p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            {summitWidePartnershipTiers.map((sw, i) => (
              <FadeIn key={sw.id} delay={i * 0.05}>
                <div
                  className="flex flex-col h-full glass rounded-2xl overflow-hidden border border-white/10 card-hover"
                  style={{ background: sw.panelBg }}
                >
                  <div
                    className="px-4 py-3 text-center"
                    style={{ backgroundColor: sw.headerColor }}
                  >
                    <div className="text-[10px] font-bold uppercase tracking-widest text-white/90">FULL SUMMIT</div>
                    <h3 className="text-base font-black text-white leading-tight mt-1">{sw.title}</h3>
                    <div className="text-sm font-bold text-white/95 mt-2">{sw.priceBand}</div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <p className="text-xs text-[#F5B730] font-semibold mb-3">Passes &amp; access</p>
                    <p className="text-xs text-theme-primary leading-relaxed mb-4">{sw.passesAndAccess}</p>
                    <p className="text-xs font-bold uppercase text-theme-primary mb-2">Key benefits</p>
                    <ul className="space-y-2 text-xs text-theme-primary flex-1 list-disc pl-4 marker:text-white/30">
                      {sw.benefits.map((b) => (
                        <li key={b} className="leading-snug">
                          {b}
                        </li>
                      ))}
                    </ul>
                    <Link
                      href={`/contact?summitWide=${encodeURIComponent(sw.id)}`}
                      className="mt-5 inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-bold text-white transition-opacity hover:opacity-90"
                      style={{ backgroundColor: sw.headerColor }}
                    >
                      Enquire
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Theme-linked sponsorship (25% off list); deep link e.g. /sponsors#theme-a */}
      <section id="spotlight-themes" className="py-20 section-gradient scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-10">
              <span className="text-[#C9921A] text-sm font-bold uppercase tracking-widest">Spotlight themes</span>
              <h2 className="text-3xl sm:text-4xl font-black text-white mt-3">Sponsor a theme category</h2>
              <p className="mt-3 max-w-2xl mx-auto text-theme-primary text-sm">
                Each of the 14 spotlight themes is tied to a sponsorship package tier. Investment amounts below are in USD (including the current promotional rate from published list prices). Choose your theme, review the package and investment, then contact the partnerships team.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.05}>
            <div className="glass rounded-2xl p-6 sm:p-8 border border-[#C9921A]/20 mb-10">
              <label className="block text-xs font-bold uppercase tracking-wide text-theme-primary mb-2">Select spotlight theme</label>
              <div className="flex flex-col sm:flex-row gap-4 sm:items-end">
                <div className="flex-1">
                  <select
                    value={sponsorThemeId}
                    onChange={(e) => setSponsorThemeId(e.target.value)}
                    className="w-full bg-[var(--bg-surface)] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C9921A]/60"
                  >
                    {themeSponsorshipOffers.map((o) => (
                      <option key={o.themeId} value={o.themeId}>
                        {o.themeId}, {o.themeLabel}
                      </option>
                    ))}
                  </select>
                </div>
                {selectedOffer && (
                  <div className="glass-gold rounded-xl px-5 py-3 text-center sm:text-left">
                    <div className="text-xs text-theme-primary uppercase">Package</div>
                    <div className="text-lg font-black text-white">{selectedOffer.packageLabel}</div>
                    <div className="text-sm text-[#F5B730] font-bold mt-1">
                      USD {selectedOffer.priceUsd.toLocaleString()}
                    </div>
                  </div>
                )}
                {selectedOffer && (
                  <Link
                    href={`/contact?theme=${encodeURIComponent(selectedOffer.themeId)}`}
                    className="inline-flex items-center justify-center gap-2 btn-gold px-6 py-3 rounded-xl text-sm font-bold shrink-0"
                  >
                    Enquire about this theme
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </div>
          </FadeIn>

          {showThemePackageBullets && (
            <FadeIn delay={0.08}>
              <div className="mb-10">
                <div className="text-center mb-6 max-w-3xl mx-auto">
                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    Sponsorship by theme. Own a theme. Own the conversation.
                  </h3>
                  {spotlightDeck && (
                    <>
                      <p className="mt-3 text-sm text-theme-primary leading-relaxed">
                        {spotlightDeck.tagline}
                      </p>
                      <p className="mt-2 text-xs font-semibold text-white/90">
                        Key sessions: {spotlightDeck.keySessions}
                      </p>
                    </>
                  )}
                  <p className="mt-2 text-sm text-theme-primary">
                    {selectedThemeTiers.every((t) => t.listPriceUsd === t.priceUsd)
                      ? `USD investment per package matches Theme ${sponsorThemeId} in the table below.`
                      : `List and discounted USD amounts match each row for Theme ${sponsorThemeId} in the table below.`}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {selectedThemeTiers.map((tierOffer) => {
                    const bullets = tierOffer.benefitsBullets ?? [];
                    if (bullets.length === 0) return null;
                    const style = themeTierCardStyle[tierOffer.packageTier];
                    return (
                      <div
                        key={tierOffer.offerKey}
                        className="flex flex-col h-full rounded-2xl overflow-hidden border card-hover"
                        style={{ borderColor: style.border, background: style.panelBg }}
                      >
                        <div className="px-4 py-3 text-center" style={{ backgroundColor: style.headerBg }}>
                          <div className="text-[10px] font-bold uppercase tracking-widest text-white/90">
                            Theme {tierOffer.themeId}
                          </div>
                          <h4 className="text-lg font-black text-white mt-1">{tierOffer.packageLabel}</h4>
                          <div className="text-xs text-white/90 mt-1 font-semibold">
                            {tierOffer.listPriceUsd === tierOffer.priceUsd ? (
                              <>Investment USD {tierOffer.priceUsd.toLocaleString()}</>
                            ) : (
                              <>
                                List USD {tierOffer.listPriceUsd.toLocaleString()} · You pay USD{" "}
                                {tierOffer.priceUsd.toLocaleString()}
                              </>
                            )}
                          </div>
                        </div>
                        <div className="p-4 flex-1 flex flex-col">
                          <p className="text-xs font-bold uppercase text-theme-primary mb-2">Package includes</p>
                          {tierOffer.benefitsIntro && (
                            <p className="text-sm font-semibold text-white/95 mb-3 leading-snug">
                              {tierOffer.benefitsIntro}
                            </p>
                          )}
                          <ul className="space-y-2.5 text-sm text-theme-primary flex-1 list-disc pl-4 marker:text-white/35">
                            {bullets.map((b) => (
                              <li key={b} className="leading-snug">
                                {b}
                              </li>
                            ))}
                          </ul>
                          <Link
                            href={`/contact?theme=${encodeURIComponent(tierOffer.themeId)}&tier=${encodeURIComponent(
                              tierOffer.packageTier
                            )}`}
                            className="mt-5 inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-bold text-white transition-opacity hover:opacity-90"
                            style={{ backgroundColor: style.headerBg }}
                          >
                            Enquire ({tierOffer.packageLabel})
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </FadeIn>
          )}

          <div className="grid grid-cols-1 gap-2 max-h-[420px] overflow-y-auto pr-1">
            {themeSponsorshipOffers.map((o) => (
              <FadeIn key={o.themeId}>
                <div
                  className={`glass rounded-xl px-4 py-3 flex flex-wrap items-center justify-between gap-2 text-sm border ${
                    o.themeId === sponsorThemeId ? "border-[#C9921A]/50 bg-[#C9921A]/5" : "border-white/5"
                  }`}
                >
                  <div className="font-bold text-white w-8 shrink-0">{o.themeId}</div>
                  <div className="flex-1 min-w-[200px] text-theme-primary">{o.themeLabel}</div>
                  <div className="text-xs uppercase text-theme-primary w-24">{o.packageLabel}</div>
                  <div className="text-right">
                    <span className="text-[#F5B730] font-black">USD {o.priceUsd.toLocaleString()}</span>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Sponsorship Tiers */}
      <section className="py-20 bg-[var(--bg-alt)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-14">
              <span className="text-[#C9921A] text-sm font-bold uppercase tracking-widest">Sponsorship</span>
              <h2 className="text-4xl font-black text-white mt-3">{t.sponsors.packagesTitle}</h2>
              <p className="mt-3 max-w-xl mx-auto text-sm text-theme-primary">
                Package benefits below align with the Platinum, Gold, Silver and Official Partner levels attached to each spotlight theme in the table above.
              </p>
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
                          <div className="text-sm font-medium text-theme-primary">Sponsorship Level</div>
                          <h3 className="text-2xl font-black" style={{ color: tier.color }}>
                            {tier.label}
                          </h3>
                        </div>
                      </div>
                      <p className="text-sm mb-4 text-theme-primary">{tier.description}</p>

                      {/* Existing sponsors */}
                      {tier.sponsors.length > 0 && (
                        <div>
                          <div className="text-xs font-bold uppercase mb-2 text-theme-primary">Current {tier.label} Partners</div>
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
                                  <div className="text-[10px] text-theme-primary">{s.description}</div>
                                </div>
                                <Globe className="w-3 h-3 text-theme-primary ml-auto" />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Benefits */}
                    <div className="lg:col-span-2">
                          <div className="text-xs font-bold uppercase mb-3 text-theme-primary">Package Benefits</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {tier.benefits.map((b) => (
                          <div key={b} className="flex items-start gap-2.5">
                            <Star className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: tier.color }} />
                            <span className="text-sm text-theme-primary">{b}</span>
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
              <h2 className="text-3xl font-black text-white mb-4">{t.sponsors.becomePartnerTitle}</h2>
              <p className="mb-8 leading-relaxed text-theme-primary">
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
