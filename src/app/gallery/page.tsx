"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import Link from "next/link";
import {
  Image as ImageIcon, Video, FileText, Download,
  Bell, Play, ExternalLink, ArrowRight
} from "lucide-react";

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay }} className={className}>
      {children}
    </motion.div>
  );
}

const previewImages = [
  { label: "Victoria Falls — Summit Venue", emoji: "🌊", aspectRatio: "aspect-[4/3]", color: "#0EA5E9" },
  { label: "Elephant Hills Resort", emoji: "🏨", aspectRatio: "aspect-square", color: "#10B981" },
  { label: "Zambezi River Views", emoji: "🌅", aspectRatio: "aspect-[3/2]", color: "#F59E0B" },
  { label: "Victoria Falls UNESCO Site", emoji: "🌍", aspectRatio: "aspect-[4/3]", color: "#8B5CF6" },
  { label: "Conference Facilities", emoji: "🎤", aspectRatio: "aspect-square", color: "#C9921A" },
  { label: "Victoria Falls Bridge", emoji: "🌉", aspectRatio: "aspect-[16/9]", color: "#EC4899" },
];

const postSummitContent = [
  {
    category: "Photography",
    icon: ImageIcon,
    color: "#3B82F6",
    desc: "Official Summit photography from all sessions, ceremonies, social events and excursions.",
    items: ["Opening Ceremony", "Plenary Sessions", "Concurrent Sessions", "Gala Dinner", "Excursions Day", "Networking Events"],
  },
  {
    category: "Video Recordings",
    icon: Video,
    color: "#EC4899",
    desc: "Full session recordings from plenary halls. Innovation Challenge pitches and key panel discussions.",
    items: ["Keynote Addresses", "Plenary Recordings", "Innovation Challenge Finals", "Official Opening Ceremony", "Closing Ceremony", "Highlights Reel"],
  },
  {
    category: "Presentations",
    icon: FileText,
    color: "#10B981",
    desc: "Speaker presentations and supporting documents from all sessions where permission has been granted.",
    items: ["Keynote Slides", "Panel Presentations", "Workshop Materials", "ILO Future of Work Monitor 2026", "ZIDA Investment Brief", "Rapporteur Reports"],
  },
  {
    category: "Official Documents",
    icon: Download,
    color: "#C9921A",
    desc: "Official summit documents including the Victoria Falls Declaration and Investment Commitments register.",
    items: ["Victoria Falls Declaration", "Summit Outcomes Report", "Investment Commitments Register", "Cross-Regional Investment Bulletin", "Summit Programme", "Press Communiqués"],
  },
];

export default function GalleryPage() {
  const [activeTab, setActiveTab] = useState("venue");

  return (
    <div className="min-h-screen bg-[#0A1628] pt-20">
      {/* Header */}
      <section className="py-20 hero-bg pattern-overlay relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0A1628]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-[#C9921A] text-sm font-bold uppercase tracking-widest">Media Centre</span>
            <h1 className="text-4xl sm:text-5xl font-black text-white mt-3 mb-4">
              Gallery & <span className="gradient-text">Media Centre</span>
            </h1>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Official Summit photography, video recordings, presentations and documents. Full media gallery available after the Summit (September 2026).
            </p>
          </motion.div>
        </div>
      </section>

      {/* Coming Soon Banner */}
      <div className="bg-[#C9921A]/10 border-y border-[#C9921A]/20 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center gap-3 flex-wrap">
          <Bell className="w-5 h-5 text-[#F5B730]" />
          <p className="text-[#F5B730] text-sm font-semibold">
            Summit media will be published here after September 2026. Register to receive media notifications.
          </p>
          <Link href="/registration" className="text-[#0A1628] bg-[#C9921A] px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-[#F5B730] transition-colors">
            Register
          </Link>
        </div>
      </div>

      {/* Venue Preview */}
      <section className="py-20 section-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-10">
              <span className="text-[#C9921A] text-sm font-bold uppercase tracking-widest">The Venue</span>
              <h2 className="text-3xl font-black text-white mt-3">Victoria Falls & Elephant Hills Resort</h2>
              <p className="text-slate-400 mt-3">A world-class summit destination — one of the Seven Natural Wonders of the World</p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {previewImages.map((img, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <div className={`glass rounded-2xl overflow-hidden card-hover ${img.aspectRatio} flex items-center justify-center border border-white/5 hover:border-white/20 transition-all`}
                  style={{ minHeight: "160px" }}>
                  <div className="text-center p-6">
                    <div className="text-5xl sm:text-6xl mb-3">{img.emoji}</div>
                    <div className="text-white text-xs sm:text-sm font-medium">{img.label}</div>
                    <div className="mt-3 text-[10px] px-2 py-0.5 rounded-full inline-block" style={{ background: `${img.color}20`, color: img.color }}>
                      Coming Sept 2026
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Post-Summit Media */}
      <section id="downloads" className="py-20 bg-[#061020]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-14">
              <span className="text-[#C9921A] text-sm font-bold uppercase tracking-widest">Post-Summit</span>
              <h2 className="text-4xl font-black text-white mt-3">What Will Be Available</h2>
              <p className="text-slate-400 mt-4 max-w-2xl mx-auto">
                The full media centre will be activated following the Summit. Here&apos;s what delegates and media can expect to access.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {postSummitContent.map((section, i) => {
              const Icon = section.icon;
              return (
                <FadeIn key={section.category} delay={i * 0.1}>
                  <div className="glass rounded-2xl p-6 card-hover h-full">
                    <div className="flex items-start gap-4 mb-4">
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: `${section.color}20`, border: `1px solid ${section.color}30` }}
                      >
                        <Icon className="w-5 h-5" style={{ color: section.color }} />
                      </div>
                      <div>
                        <h3 className="text-white font-bold">{section.category}</h3>
                        <p className="text-slate-400 text-xs mt-1 leading-relaxed">{section.desc}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {section.items.map((item) => (
                        <div key={item} className="flex items-center gap-2 text-slate-400 text-sm">
                          <div className="w-1.5 h-1.5 rounded-full" style={{ background: section.color }} />
                          {item}
                          <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-slate-700 text-slate-500">Soon</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* Live Coverage */}
      <section className="py-20 section-gradient">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <div className="glass-gold rounded-3xl p-10 sm:p-12">
              <div className="text-5xl mb-6">📺</div>
              <h2 className="text-3xl font-black text-white mb-4">Live & Hybrid Coverage</h2>
              <p className="text-slate-300 mb-8 leading-relaxed">
                The TNF Global Summit will offer hybrid attendance with live streaming of plenary sessions. Virtual delegates can participate in real-time from anywhere in the world.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {[
                  { icon: "🎥", title: "Live Streaming", desc: "Plenary sessions streamed live on the Summit platform" },
                  { icon: "💬", title: "Virtual Q&A", desc: "Virtual delegates participate in session Q&A" },
                  { icon: "📱", title: "Summit App", desc: "Real-time programme, bilateral booking & voting" },
                ].map((item) => (
                  <div key={item.title} className="glass rounded-xl p-4 text-center">
                    <div className="text-2xl mb-2">{item.icon}</div>
                    <div className="text-white font-bold text-sm">{item.title}</div>
                    <div className="text-slate-400 text-xs mt-1">{item.desc}</div>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/registration" className="btn-gold px-8 py-3 rounded-xl text-sm font-bold flex items-center gap-2">
                  Register for Virtual Access
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/contact" className="btn-outline-gold px-8 py-3 rounded-xl text-sm font-semibold flex items-center gap-2">
                  Media Accreditation
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Press & Social */}
      <section className="py-16 bg-[#061020]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <h2 className="text-2xl font-black text-white mb-4">Follow the Summit</h2>
            <p className="text-slate-400 mb-6">
              Use <span className="text-[#F5B730] font-bold">#TNFGlobalSummit</span> on social media to join the global conversation.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {["Twitter / X", "LinkedIn", "Facebook", "YouTube"].map((platform) => (
                <a
                  key={platform}
                  href="#"
                  className="glass px-6 py-3 rounded-xl text-slate-300 text-sm font-medium hover:text-white hover:border-white/20 transition-all border border-white/5"
                >
                  {platform}
                </a>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
