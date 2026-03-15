"use client";

import { useState } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Mail, Phone, MapPin, Globe, Send, CheckCircle,
  Clock, MessageSquare, User, Building, ChevronDown
} from "lucide-react";
import { summitInfo } from "@/lib/data";

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay }} className={className}>
      {children}
    </motion.div>
  );
}

const enquiryTypes = [
  "General Enquiry",
  "Delegate Registration",
  "Speaker / Panelist",
  "Sponsorship / Partnership",
  "Media Accreditation",
  "Bilateral Meeting Request",
  "Exhibition / Exhibitor",
  "TNF Innovation Challenge",
  "Virtual Attendance",
  "Other",
];

const contactItems = [
  {
    icon: Mail,
    label: "General Enquiries",
    value: summitInfo.email,
    href: `mailto:${summitInfo.email}`,
    color: "#3B82F6",
  },
  {
    icon: Mail,
    label: "Secretariat Email",
    value: summitInfo.emailAlt,
    href: `mailto:${summitInfo.emailAlt}`,
    color: "#06B6D4",
  },
  {
    icon: Phone,
    label: "TNF Secretariat",
    value: `${summitInfo.phone} / ${summitInfo.phoneLocal}`,
    href: `tel:+2632427830`,
    color: "#10B981",
  },
  {
    icon: MapPin,
    label: "Secretariat Address",
    value: summitInfo.address,
    color: "#C9921A",
  },
  {
    icon: Globe,
    label: "TNF Website",
    value: "tnfzim.com",
    href: summitInfo.mainWebsite,
    color: "#8B5CF6",
  },
  {
    icon: Clock,
    label: "Office Hours",
    value: "Mon–Fri, 08:00–17:00 CAT (UTC+2)",
    color: "#F59E0B",
  },
];

const faqs = [
  {
    q: "When does early bird registration close?",
    a: "Early bird rates close on 30 June 2026. After this date, standard rates apply. We strongly recommend registering early to secure your place.",
  },
  {
    q: "Is virtual/hybrid attendance available?",
    a: "Yes. Virtual attendance is available at USD 100 (early bird) / USD 150 (standard). Virtual delegates access live-streamed plenary sessions and participate in Q&A via the Summit App.",
  },
  {
    q: "How do I apply for the TNF Innovation Challenge?",
    a: "Innovation Challenge applications are available via the registration form. Select 'Apply for Innovation Challenge' and you will receive a dedicated application form by email.",
  },
  {
    q: "Can I request a bilateral meeting with other delegates?",
    a: "Yes. All registered delegates can pre-book bilateral meetings via the Summit App. Bilateral meeting pre-bookings open on Arrival Day (20 September 2026).",
  },
  {
    q: "Are there group registration rates?",
    a: "Group rates are available for organisations registering 5 or more delegates. Please contact info@tnfzim.com for group registration packages.",
  },
  {
    q: "How do I obtain media accreditation?",
    a: "Media accreditation requests should be sent to info@tnfzim.com with your press credentials and media organisation details. Accreditation decisions are at the discretion of the TNF Secretariat.",
  },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [form, setForm] = useState({
    name: "", email: "", phone: "", organisation: "",
    enquiryType: "", message: "",
  });

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
      setSubmitError("Failed to send your message. Please try again or email info@tnfzim.com directly.");
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
            <span className="text-[#C9921A] text-sm font-bold uppercase tracking-widest">Get in Touch</span>
            <h1 className="text-4xl sm:text-5xl font-black text-white mt-3 mb-4">
              Contact <span className="gradient-text">Us</span>
            </h1>
            <p className="max-w-2xl mx-auto text-theme-primary">
              The TNF Secretariat team is ready to assist with registration, sponsorship, speaker and media enquiries.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Details */}
          <div className="space-y-6">
            <FadeIn>
              <h2 className="text-2xl font-black text-white mb-6">TNF Secretariat</h2>
              <div className="space-y-4">
                {contactItems.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="glass rounded-xl p-4 flex items-start gap-4">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: `${item.color}20`, border: `1px solid ${item.color}30` }}
                      >
                        <Icon className="w-5 h-5" style={{ color: item.color }} />
                      </div>
                      <div>
                        <div className="text-xs font-medium mb-0.5 text-theme-primary">{item.label}</div>
                        {item.href ? (
                          <a
                            href={item.href}
                            target={item.href.startsWith("http") ? "_blank" : undefined}
                            rel="noopener noreferrer"
                            className="text-white text-sm hover:text-[#F5B730] transition-colors font-medium"
                          >
                            {item.value}
                          </a>
                        ) : (
                          <div className="text-white text-sm font-medium">{item.value}</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="glass-gold rounded-2xl p-5">
                <div className="text-2xl mb-2">📅</div>
                <h3 className="text-white font-bold mb-1">Summit Dates</h3>
                <div className="text-[#F5B730] font-bold">20–26 September 2026</div>
                <div className="text-xs mt-1 text-theme-primary">Elephant Hills Resort, Victoria Falls, Zimbabwe</div>
                <div className="divider-gold my-3" />
                <div className="text-[#F5B730] font-bold text-sm">Early Bird Closes 30 June 2026</div>
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
                  <h3 className="text-2xl font-black text-white mb-3">Message Sent!</h3>
                  <p className="text-theme-primary">
                    Thank you for contacting the TNF Secretariat. We will respond within 2 business days at <strong className="text-white">{form.email}</strong>.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 sm:p-8">
                  <h2 className="text-xl font-black text-white mb-6 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-[#C9921A]" />
                    Send Us a Message
                  </h2>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-medium mb-1.5 block text-theme-primary">Full Name *</label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-primary" />
                          <input
                            required
                            type="text"
                            placeholder="Your name"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-theme-primary/70 focus:outline-none focus:border-[#C9921A]/60"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-medium mb-1.5 block text-theme-primary">Email Address *</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-primary" />
                          <input
                            required
                            type="email"
                            placeholder="your@email.com"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-theme-primary/70 focus:outline-none focus:border-[#C9921A]/60"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-medium mb-1.5 block text-theme-primary">Phone</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-primary" />
                          <input
                            type="tel"
                            placeholder="+263 77 000 0000"
                            value={form.phone}
                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-theme-primary/70 focus:outline-none focus:border-[#C9921A]/60"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-medium mb-1.5 block text-theme-primary">Organisation</label>
                        <div className="relative">
                          <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-primary" />
                          <input
                            type="text"
                            placeholder="Your organisation"
                            value={form.organisation}
                            onChange={(e) => setForm({ ...form, organisation: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-theme-primary/70 focus:outline-none focus:border-[#C9921A]/60"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-medium mb-1.5 block text-theme-primary">Enquiry Type *</label>
                      <select
                        required
                        value={form.enquiryType}
                        onChange={(e) => setForm({ ...form, enquiryType: e.target.value })}
                        className="w-full bg-[var(--bg-surface)] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#C9921A]/60"
                      >
                        <option value="">Select enquiry type</option>
                        {enquiryTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-medium mb-1.5 block text-theme-primary">Message *</label>
                      <textarea
                        required
                        rows={5}
                        placeholder="Please provide details about your enquiry..."
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
                        ? <><div className="w-4 h-4 border-2 border-[#0A1628]/30 border-t-[#0A1628] rounded-full animate-spin" />Sending…</>
                        : <><Send className="w-4 h-4" />Send Message</>}
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
              <span className="text-[#C9921A] text-sm font-bold uppercase tracking-widest">FAQs</span>
              <h2 className="text-3xl font-black text-white mt-3">Frequently Asked Questions</h2>
            </div>
          </FadeIn>

          <div className="max-w-3xl mx-auto space-y-3">
            {faqs.map((faq, i) => (
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
