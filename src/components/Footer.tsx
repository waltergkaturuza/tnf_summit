"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, Globe, Send, CheckCircle, ExternalLink } from "lucide-react";
import { summitInfo, summitDirectContacts } from "@/lib/data";
import { useLanguage } from "@/context/LanguageContext";

/* Twitter / X SVG icon */
function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.737-8.835L1.254 2.25H8.08l4.259 5.631 5.905-5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

/* Facebook SVG icon */
function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

/* LinkedIn SVG icon */
function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

/* YouTube SVG icon */
function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

/** One line per comma-separated segment for a compact footer address block. */
function footerAddressLines(address: string): string[] {
  return address.split(",").map((p) => p.trim()).filter(Boolean);
}

function FooterNavColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div className="shrink-0">
      <h4 className="text-white font-semibold text-sm mb-2.5">{title}</h4>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            {link.href.startsWith("http") ? (
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-theme-primary hover:text-[#F5B730] text-sm transition-colors inline-flex items-center gap-1"
              >
                {link.label}
                <ExternalLink className="w-3 h-3 opacity-50" />
              </a>
            ) : (
              <Link href={link.href} className="text-theme-primary hover:text-[#F5B730] text-sm transition-colors">
                {link.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function NewsletterSignup() {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const { subscribeEmail } = await import("@/lib/db");
      const result = await subscribeEmail(email, "footer");
      if (result === "already_subscribed") {
        setMessage(t.footer.thankYou);
      } else {
        setSubscribed(true);
      }
    } catch {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border-b border-white/5 py-7 sm:py-8">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-5">
          <div>
            <h3 className="text-white font-bold text-base sm:text-lg mb-0.5">{t.footer.stayUpdated}</h3>
            <p className="text-xs sm:text-sm text-theme-primary leading-snug">
              {t.footer.subscribeDesc}
            </p>
          </div>
          {subscribed ? (
            <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold">
              <CheckCircle className="w-5 h-5" />
              {t.footer.thankYou}
            </div>
          ) : message ? (
            <div className="text-amber-400 text-sm font-semibold">{message}</div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex gap-2 w-full sm:w-auto">
              <input
                type="email"
                required
                placeholder={t.footer.enterEmail}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="flex-1 sm:w-72 bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-theme-primary/70 focus:outline-none focus:border-[#C9921A]/60 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={loading}
                className="btn-gold px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 whitespace-nowrap disabled:opacity-50"
              >
                {loading
                  ? <div className="w-4 h-4 border-2 border-[#0A1628]/30 border-t-[#0A1628] rounded-full animate-spin" />
                  : <Send className="w-4 h-4" />}
                {loading ? "…" : "Subscribe"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="bg-[var(--bg-alt)] border-t border-white/5">
      {/* Newsletter */}
      <NewsletterSignup />

      {/* Main footer: brand + contact in col 1; four nav cols on the same row */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-9 lg:py-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[12rem_repeat(4,max-content)] md:gap-x-5 lg:gap-x-6 md:items-start">
          <div className="flex w-[12rem] max-w-full min-w-0 flex-col gap-6">
            <Link href="/" className="flex items-center gap-3 mb-1.5 group w-fit max-w-full">
                <div className="relative h-10 w-[10.5rem] max-w-full">
                  <Image
                    src="/tnf-logo.png"
                    alt="Tripartite Negotiating Forum"
                    fill
                    className="object-contain object-left"
                  />
                </div>
              </Link>
              <p className="text-[#C9921A] text-xs font-semibold mb-2">Global Summit 2026</p>
              <p className="w-full text-[11px] leading-relaxed text-pretty text-theme-primary">
                Africa&apos;s premier tripartite-led global convening platform on Inclusive Growth, Decent Work and Investment Promotion. Anchored in UN SDG 8, AU Agenda 2063, AfCFTA, and Zimbabwe&apos;s NDS2.
              </p>

              {/* Social icons, real TNF accounts */}
              <div className="flex items-center gap-2.5 mt-4">
                <a
                  href={summitInfo.social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow TNF on X / Twitter"
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg glass flex items-center justify-center text-theme-primary hover:text-white hover:border-[#C9921A]/40 transition-all"
                >
                  <XIcon className="w-3.5 h-3.5" />
                </a>
                <a
                  href={summitInfo.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow TNF on Facebook"
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg glass flex items-center justify-center text-theme-primary hover:text-white hover:border-[#C9921A]/40 transition-all"
                >
                  <FacebookIcon className="w-4 h-4" />
                </a>
                <a
                  href={summitInfo.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TNF on LinkedIn"
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg glass flex items-center justify-center text-theme-primary hover:text-white hover:border-[#C9921A]/40 transition-all"
                >
                  <LinkedInIcon className="w-3.5 h-3.5" />
                </a>
                <a
                  href={summitInfo.social.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TNF on YouTube"
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg glass flex items-center justify-center text-theme-primary hover:text-white hover:border-[#C9921A]/40 transition-all"
                >
                  <YouTubeIcon className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Back to main TNF site */}
              <a
                href={summitInfo.mainWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mt-3 text-theme-primary hover:text-[#C9921A] text-xs transition-colors"
              >
                <ExternalLink className="w-3 h-3" />
                {t.footer.visitSecretariat}
              </a>

            <div>
              <h4 className="text-white font-semibold text-sm mb-2.5">{t.footer.contactCol}</h4>
              <div className="space-y-2.5 text-xs">
                <a
                  href={`mailto:${summitInfo.email}`}
                  className="flex items-start gap-2 text-theme-primary hover:text-[#F5B730] transition-colors break-words"
                >
                  <Mail className="w-3.5 h-3.5 text-[#C9921A] flex-shrink-0 mt-0.5" />
                  <span className="min-w-0">{summitInfo.email}</span>
                </a>
                {summitDirectContacts.map((c) => (
                  <a
                    key={c.telHref}
                    href={c.telHref}
                    className="flex items-start gap-2 text-theme-primary hover:text-[#F5B730] transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#C9921A] flex-shrink-0 mt-0.5" />
                    <span className="min-w-0 text-pretty">
                      {c.name}, {c.phoneDisplay}
                    </span>
                  </a>
                ))}
                <a
                  href="tel:+263242783030"
                  className="flex items-start gap-2 text-theme-primary hover:text-[#F5B730] transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-[#C9921A] flex-shrink-0 mt-0.5" />
                  <span className="min-w-0">{summitInfo.phone}</span>
                </a>
                <div className="flex items-start gap-2.5 text-theme-primary text-xs leading-relaxed pt-1">
                  <MapPin className="w-3.5 h-3.5 text-[#C9921A] mt-0.5 flex-shrink-0" />
                  <span className="w-full text-pretty">
                    {footerAddressLines(summitInfo.address).map((line, i) => (
                      <span key={line}>
                        {i > 0 && <br />}
                        {line}
                      </span>
                    ))}
                  </span>
                </div>
                <a
                  href={summitInfo.mainWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-theme-primary hover:text-[#F5B730] transition-colors"
                >
                  <Globe className="w-3.5 h-3.5 text-[#C9921A] flex-shrink-0" />
                  tnfzim.com
                </a>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-5 gap-y-6 sm:grid-cols-4 md:contents">
            <FooterNavColumn title={t.footer.summitCol} links={t.footer.summitLinks} />
            <FooterNavColumn title={t.footer.programmeCol} links={t.footer.programmeLinks} />
            <FooterNavColumn title={t.footer.participateCol} links={t.footer.participateLinks} />
            <FooterNavColumn title={t.footer.mediaCol} links={t.footer.mediaLinks} />
          </div>


        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4">
          {/* Top row: copyright left, legal links right */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3 mb-2">
            <p className="text-xs text-center sm:text-left text-theme-primary">
              {t.footer.copyright}
            </p>
            <div className="flex items-center gap-5 text-xs">
              <Link href="/privacy" className="text-theme-primary hover:opacity-80 transition-colors">
                {t.footer.privacy}
              </Link>
              <Link href="/terms" className="text-theme-primary hover:opacity-80 transition-colors">
                {t.footer.terms}
              </Link>
              {/* Hidden admin link, very subtle, only for staff */}
              <Link
                href="/admin"
                className="text-slate-700 hover:text-slate-400 transition-colors duration-300"
                title="Admin"
              >
                Admin
              </Link>
            </div>
          </div>

          {/* Bottom row: hashtag + developer credit */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
              <div className="flex items-center gap-3 text-xs text-theme-primary">
                <span className="text-[#C9921A] font-bold">{t.footer.hashtag}</span>
                <span>·</span>
                <span>{summitInfo.location}</span>
                <span>·</span>
                <span>{summitInfo.dates}</span>
              </div>
            <p className="text-xs text-theme-primary">
              {t.footer.developedBy}{" "}
              <a
                href="https://www.quantistechnologies.co.zw/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-theme-primary hover:text-[#C9921A] font-semibold transition-colors"
              >
                Quantis Technologies
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
