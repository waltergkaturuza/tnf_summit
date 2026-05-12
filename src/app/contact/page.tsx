"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Mail, Phone, MapPin, Globe, Send, CheckCircle,
  Clock, MessageSquare, User, Building, ChevronDown
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import {
  getThemeSponsorshipOffer,
  getThemeSponsorshipOfferTier,
  getSummitWidePartnershipTier,
  SPONSORSHIP_DISCOUNT_RATE,
  summitInfo,
  summitDirectContacts,
  type ThemeSponsorshipPackageTier,
} from "@/lib/data";

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay }} className={className}>
      {children}
    </motion.div>
  );
}

const phoneEntryColors = ["#10B981", "#22C55E", "#84CC16"] as const;

const contactEntries: {
  icon: React.ElementType;
  value: string;
  href?: string;
  color: string;
}[] = [
  { icon: Mail, value: summitInfo.email, href: `mailto:${summitInfo.email}`, color: "#3B82F6" },
  ...summitDirectContacts.map((c, i) => ({
    icon: Phone,
    value: c.phoneDisplay.replace(/\s/g, ""),
    href: c.telHref,
    color: phoneEntryColors[i] ?? "#10B981",
  })),
  { icon: MapPin, value: summitInfo.address, color: "#C9921A" },
  { icon: Globe, value: "tnfzim.com", href: summitInfo.mainWebsite, color: "#8B5CF6" },
  { icon: Clock, value: "Mon–Fri, 08:00–17:00 CAT (UTC+2)", color: "#F59E0B" },
];

function ContactPageContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [form, setForm] = useState({
    name: "", email: "", phone: "", organisation: "",
    enquiryType: "", message: "",
  });

  useEffect(() => {
    const wide = searchParams.get("summitWide");
    if (wide) {
      const sw = getSummitWidePartnershipTier(wide);
      setForm((prev) => {
        if (prev.message.trim()) return prev;
        const msg = sw
          ? `I would like to enquire about a Summit-Wide Full Partnership: ${sw.title}. Investment band: ${sw.priceBand}. Passes & access: ${sw.passesAndAccess}.`
          : `I would like to enquire about a Summit-Wide Full Partnership (tier: ${wide}).`;
        return { ...prev, enquiryType: "Sponsorship / Partnership", message: msg };
      });
      return;
    }
    const theme = searchParams.get("theme");
    if (!theme) return;
    const tierParam = searchParams.get("tier");
    const tier =
      tierParam === "platinum" ||
      tierParam === "gold" ||
      tierParam === "silver" ||
      tierParam === "official_partner"
        ? (tierParam as ThemeSponsorshipPackageTier)
        : undefined;
    const offer = tier
      ? getThemeSponsorshipOfferTier(theme, tier)
      : getThemeSponsorshipOffer(theme);
    setForm((prev) => {
      if (prev.message.trim()) return prev;
      const pct = Math.round(SPONSORSHIP_DISCOUNT_RATE * 100);
      const msg = offer
        ? offer.listPriceUsd === offer.priceUsd
          ? `I would like to enquire about sponsoring Spotlight Theme ${offer.themeId}: ${offer.themeLabel}. Package: ${offer.packageLabel}. Investment: USD ${offer.priceUsd.toLocaleString()}.`
          : `I would like to enquire about sponsoring Spotlight Theme ${offer.themeId}: ${offer.themeLabel}. Package: ${offer.packageLabel}. List investment USD ${offer.listPriceUsd.toLocaleString()}; after ${pct}% reduction: USD ${offer.priceUsd.toLocaleString()}.`
        : `I would like to enquire about sponsoring spotlight theme ${theme}.`;
      return { ...prev, enquiryType: "Sponsorship / Partnership", message: msg };
    });
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError("");
    try {
      const { insertMessage } = await import("@/lib/db");
      await insertMessage({
        name: form.name, email: form.email, phone: form.phone,
        organisation: form.organisation, enquiryType: form.enquiryType,
        message: form.message,
      });
      setSubmitted(true);
    } catch {
      setSubmitError(t.contact.submitError);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pt-20">
      {/* Header */}
      <section className="py-20 hero-bg pattern-overlay relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--bg-primary)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-[#C9921A] text-sm font-bold uppercase tracking-widest">{t.contact.heroBadge}</span>
            <h1 className="text-4xl sm:text-5xl font-black text-white mt-3 mb-4">
              {t.contact.heroTitle}
            </h1>
            <p className="max-w-2xl mx-auto text-theme-primary">
              {t.contact.heroSub}
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-10">
          {/* Contact Details */}
          <div className="space-y-6">
            <FadeIn>
              <h2 className="text-2xl font-black text-white mb-6">{t.contact.secretariatTitle}</h2>
              <div className="space-y-4">
                {t.contact.contactItems.slice(0, 5).map((item, i) => {
                  const entry = contactEntries[i];
                  if (!entry) return null;
                  const Icon = entry.icon;
                  const href = entry.href;
                  const value = entry.value;
                  const color = entry.color;
                  return (
                    <div key={i} className="glass rounded-xl p-4 flex items-start gap-4">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: `${color}20`, border: `1px solid ${color}30` }}
                      >
                        <Icon className="w-5 h-5" style={{ color }} />
                      </div>
                      <div>
                        <div className="text-xs font-medium mb-0.5 text-theme-primary">{item.label}</div>
                        {href ? (
                          <a
                            href={href}
                            target={href.startsWith("http") ? "_blank" : undefined}
                            rel="noopener noreferrer"
                            className="text-white text-sm hover:text-[#F5B730] transition-colors font-medium"
                          >
                            {value}
                          </a>
                        ) : (
                          <div className="text-white text-sm font-medium">{value}</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </FadeIn>
          </div>

          {/* Extra info column */}
          <div className="space-y-6">
            <FadeIn delay={0.12}>
              <h2 className="text-2xl font-black text-white mb-6">Quick Info</h2>
              <div className="space-y-4">
                {t.contact.contactItems.slice(5).map((item, localIdx) => {
                  const idx = localIdx + 5;
                  const entry = contactEntries[idx];
                  if (!entry) return null;
                  const Icon = entry.icon;
                  const href = entry.href;
                  const value = entry.value;
                  const color = entry.color;
                  return (
                    <div key={idx} className="glass rounded-xl p-4 flex items-start gap-4">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: `${color}20`, border: `1px solid ${color}30` }}
                      >
                        <Icon className="w-5 h-5" style={{ color }} />
                      </div>
                      <div>
                        <div className="text-xs font-medium mb-0.5 text-theme-primary">{item.label}</div>
                        {href ? (
                          <a
                            href={href}
                            target={href.startsWith("http") ? "_blank" : undefined}
                            rel="noopener noreferrer"
                            className="text-white text-sm hover:text-[#F5B730] transition-colors font-medium"
                          >
                            {value}
                          </a>
                        ) : (
                          <div className="text-white text-sm font-medium">{value}</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </FadeIn>

            <FadeIn delay={0.22}>
              <div className="glass-gold rounded-2xl p-5">
                <div className="text-2xl mb-2">📅</div>
                <h3 className="text-white font-bold mb-1">{t.contact.summitDates}</h3>
                <div className="text-[#F5B730] font-bold">21–25 September 2026</div>
                <div className="text-xs mt-1 text-theme-primary">{t.contact.summitDatesVenue}</div>
                <div className="divider-gold my-3" />
                <div className="text-[#F5B730] font-bold text-sm">{t.contact.earlyBirdCloses}</div>
              </div>
            </FadeIn>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <FadeIn delay={0.1}>
              {submitted ? (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="glass rounded-2xl p-10 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-3">{t.contact.messageSentTitle}</h3>
                  <p className="text-theme-primary">
                    {t.contact.messageSentSub} <strong className="text-white">{form.email}</strong>.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 sm:p-8">
                  <h2 className="text-xl font-black text-white mb-6 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-[#C9921A]" />
                    {t.contact.sendMessage}
                  </h2>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-medium mb-1.5 block text-theme-primary">{t.contact.formFullName}</label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-primary" />
                          <input
                            required
                            type="text"
                            placeholder={t.contact.placeholders.name}
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-theme-primary/70 focus:outline-none focus:border-[#C9921A]/60"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-medium mb-1.5 block text-theme-primary">{t.contact.formEmail}</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-primary" />
                          <input
                            required
                            type="email"
                            placeholder={t.contact.placeholders.email}
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-theme-primary/70 focus:outline-none focus:border-[#C9921A]/60"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-medium mb-1.5 block text-theme-primary">{t.contact.formPhone}</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-primary" />
                          <input
                            type="tel"
                            placeholder={t.contact.placeholders.phone}
                            value={form.phone}
                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-theme-primary/70 focus:outline-none focus:border-[#C9921A]/60"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-medium mb-1.5 block text-theme-primary">{t.contact.formOrganisation}</label>
                        <div className="relative">
                          <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-primary" />
                          <input
                            type="text"
                            placeholder={t.contact.placeholders.organisation}
                            value={form.organisation}
                            onChange={(e) => setForm({ ...form, organisation: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-theme-primary/70 focus:outline-none focus:border-[#C9921A]/60"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-medium mb-1.5 block text-theme-primary">{t.contact.formEnquiryType}</label>
                      <select
                        required
                        value={form.enquiryType}
                        onChange={(e) => setForm({ ...form, enquiryType: e.target.value })}
                        className="w-full bg-[var(--bg-surface)] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#C9921A]/60"
                      >
                        <option value="">{t.contact.placeholders.enquiryType}</option>
                        {t.contact.enquiryTypes.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-medium mb-1.5 block text-theme-primary">{t.contact.formMessage}</label>
                      <textarea
                        required
                        rows={5}
                        placeholder={t.contact.placeholders.message}
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-theme-primary/70 focus:outline-none focus:border-[#C9921A]/60 resize-none"
                      />
                    </div>

                    {submitError && (
                      <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-xl p-3">{submitError}</p>
                    )}
                    <button type="submit" disabled={submitting} className="w-full btn-gold py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50">
                      {submitting
                        ? <><div className="w-4 h-4 border-2 border-[#0A1628]/30 border-t-[#0A1628] rounded-full animate-spin" />{t.contact.submitSending}</>
                        : <><Send className="w-4 h-4" />{t.contact.submitSend}</>}
                    </button>
                  </div>
                </form>
              )}
            </FadeIn>
          </div>
        </div>

        {/* FAQs */}
        <div id="media" className="mt-20">
          <FadeIn>
            <div className="text-center mb-12">
              <span className="text-[#C9921A] text-sm font-bold uppercase tracking-widest">{t.contact.faqBadge}</span>
              <h2 className="text-3xl font-black text-white mt-3">{t.contact.faqTitle}</h2>
            </div>
          </FadeIn>

          <div className="max-w-3xl mx-auto space-y-3">
            {t.contact.faqs.map((faq, i) => (
              <FadeIn key={i} delay={i * 0.05}>
                <div className="glass rounded-xl overflow-hidden border border-white/5">
                  <button
                    className="w-full text-left px-5 py-4 flex items-center justify-between gap-4"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <span className="text-white text-sm font-semibold">{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-theme-primary flex-shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`}
                    />
                  </button>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      className="px-5 pb-4 border-t border-white/5"
                    >
                      <p className="text-sm leading-relaxed pt-3 text-theme-primary">{faq.a}</p>
                    </motion.div>
                  )}
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--bg-primary)] pt-20 flex items-center justify-center text-theme-primary text-sm">
          Loading…
        </div>
      }
    >
      <ContactPageContent />
    </Suspense>
  );
}
