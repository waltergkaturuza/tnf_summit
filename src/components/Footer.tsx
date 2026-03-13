"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, Globe, Send, CheckCircle, ExternalLink } from "lucide-react";
import { summitInfo } from "@/lib/data";

const footerLinks = {
  summit: [
    { label: "About the Summit", href: "/about" },
    { label: "Why Attend", href: "/about#why-attend" },
    { label: "Spotlight Themes", href: "/about#themes" },
    { label: "Venue", href: "/about#venue" },
  ],
  programme: [
    { label: "Full Programme", href: "/program" },
    { label: "Keynote Speakers", href: "/speakers" },
    { label: "Concurrent Sessions", href: "/program#concurrent" },
    { label: "Excursions Day", href: "/program#excursions" },
  ],
  participate: [
    { label: "Register", href: "/registration" },
    { label: "Fees & Categories", href: "/registration#fees" },
    { label: "Sponsors & Partners", href: "/sponsors" },
    { label: "Contact Us", href: "/contact" },
  ],
  media: [
    { label: "Photo Gallery", href: "/gallery" },
    { label: "Press & Media", href: "/contact#media" },
    { label: "Downloads", href: "/gallery#downloads" },
    { label: "TNF Secretariat", href: "https://tnfzim.com", external: true },
  ],
};

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

function NewsletterSignup() {
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
        setMessage("You are already subscribed!");
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
    <div className="border-b border-white/5 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h3 className="text-white font-bold text-lg mb-1">Stay Updated</h3>
            <p className="text-slate-400 text-sm">
              Subscribe for Summit updates, speaker announcements, and more.
            </p>
          </div>
          {subscribed ? (
            <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold">
              <CheckCircle className="w-5 h-5" />
              Thank you! You are subscribed.
            </div>
          ) : message ? (
            <div className="text-amber-400 text-sm font-semibold">{message}</div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex gap-2 w-full sm:w-auto">
              <input
                type="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="flex-1 sm:w-72 bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#C9921A]/60 disabled:opacity-50"
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
  return (
    <footer className="bg-[#061020] border-t border-white/5">
      {/* Newsletter */}
      <NewsletterSignup />

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Brand — real TNF logo */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-2 group w-fit">
              <div className="relative h-12 w-40">
                <Image
                  src="/tnf-logo.png"
                  alt="Tripartite Negotiating Forum"
                  fill
                  className="object-contain object-left"
                />
              </div>
            </Link>
            <p className="text-[#C9921A] text-xs font-semibold mb-4">Global Summit 2026 — Inaugural Edition</p>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Africa&apos;s premier tripartite-led global convening platform on Inclusive Growth, Decent Work and Investment Promotion. Anchored in UN SDG 8, AU Agenda 2063, AfCFTA, and Zimbabwe&apos;s NDS2.
            </p>

            {/* Contact details */}
            <div className="space-y-3">
              <a href={`mailto:${summitInfo.email}`} className="flex items-center gap-2.5 text-slate-400 hover:text-[#F5B730] text-sm transition-colors">
                <Mail className="w-4 h-4 text-[#C9921A] flex-shrink-0" />
                {summitInfo.email}
              </a>
              <a href={`mailto:${summitInfo.emailAlt}`} className="flex items-center gap-2.5 text-slate-400 hover:text-[#F5B730] text-sm transition-colors">
                <Mail className="w-4 h-4 text-[#C9921A] flex-shrink-0" />
                {summitInfo.emailAlt}
              </a>
              <a href="tel:+2632427830" className="flex items-center gap-2.5 text-slate-400 hover:text-[#F5B730] text-sm transition-colors">
                <Phone className="w-4 h-4 text-[#C9921A] flex-shrink-0" />
                {summitInfo.phone}
              </a>
              <div className="flex items-start gap-2.5 text-slate-400 text-sm">
                <MapPin className="w-4 h-4 text-[#C9921A] mt-0.5 flex-shrink-0" />
                {summitInfo.address}
              </div>
              <a
                href={summitInfo.mainWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-slate-400 hover:text-[#F5B730] text-sm transition-colors"
              >
                <Globe className="w-4 h-4 text-[#C9921A] flex-shrink-0" />
                tnfzim.com
              </a>
            </div>

            {/* Social icons — real TNF accounts */}
            <div className="flex items-center gap-3 mt-6">
              <a
                href={summitInfo.social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow TNF on X / Twitter"
                className="w-9 h-9 rounded-lg glass flex items-center justify-center text-slate-400 hover:text-white hover:border-[#C9921A]/40 transition-all"
              >
                <XIcon className="w-3.5 h-3.5" />
              </a>
              <a
                href={summitInfo.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow TNF on Facebook"
                className="w-9 h-9 rounded-lg glass flex items-center justify-center text-slate-400 hover:text-white hover:border-[#C9921A]/40 transition-all"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>
              <a
                href={summitInfo.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TNF on LinkedIn"
                className="w-9 h-9 rounded-lg glass flex items-center justify-center text-slate-400 hover:text-white hover:border-[#C9921A]/40 transition-all"
              >
                <LinkedInIcon className="w-3.5 h-3.5" />
              </a>
              <a
                href={summitInfo.social.youtube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TNF on YouTube"
                className="w-9 h-9 rounded-lg glass flex items-center justify-center text-slate-400 hover:text-white hover:border-[#C9921A]/40 transition-all"
              >
                <YouTubeIcon className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Back to main TNF site */}
            <a
              href={summitInfo.mainWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-5 text-slate-500 hover:text-[#C9921A] text-xs transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              Visit TNF Secretariat website
            </a>
          </div>

          {/* Links */}
          <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-4 gap-8">
            <div>
              <h4 className="text-white font-semibold text-sm mb-4">The Summit</h4>
              <ul className="space-y-2.5">
                {footerLinks.summit.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-slate-400 hover:text-[#F5B730] text-sm transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Programme</h4>
              <ul className="space-y-2.5">
                {footerLinks.programme.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-slate-400 hover:text-[#F5B730] text-sm transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Participate</h4>
              <ul className="space-y-2.5">
                {footerLinks.participate.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-slate-400 hover:text-[#F5B730] text-sm transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Media</h4>
              <ul className="space-y-2.5">
                {footerLinks.media.map((link) => (
                  <li key={link.href}>
                    {"external" in link && link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-[#F5B730] text-sm transition-colors flex items-center gap-1"
                      >
                        {link.label}
                        <ExternalLink className="w-3 h-3 opacity-50" />
                      </a>
                    ) : (
                      <Link href={link.href} className="text-slate-400 hover:text-[#F5B730] text-sm transition-colors">
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          {/* Top row: copyright left, legal links right */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-3">
            <p className="text-slate-500 text-xs text-center sm:text-left">
              © 2026 Tripartite Negotiating Forum (TNF) Secretariat. All rights reserved.
            </p>
            <div className="flex items-center gap-5 text-xs">
              <Link href="/privacy" className="text-slate-500 hover:text-slate-300 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-slate-500 hover:text-slate-300 transition-colors">
                Terms of Use
              </Link>
              {/* Hidden admin link — very subtle, only for staff */}
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
            <div className="flex items-center gap-3 text-xs text-slate-600">
              <span className="text-[#C9921A] font-bold">{summitInfo.hashtag}</span>
              <span>·</span>
              <span>{summitInfo.location}</span>
              <span>·</span>
              <span>{summitInfo.dates}</span>
            </div>
            <p className="text-slate-600 text-xs">
              Developed by{" "}
              <a
                href="https://www.quantistechnologies.co.zw/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-[#C9921A] font-semibold transition-colors"
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
