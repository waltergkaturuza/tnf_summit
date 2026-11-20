"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import {
  Download, Image as ImageIcon, Video, FileText,
  Bell, Play, ExternalLink, ArrowRight, X, ChevronLeft, ChevronRight as ChevronRightIcon,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { useLanguage } from "@/context/LanguageContext";
import { fetchPublicGallery, type MediaFile } from "@/lib/storage";
import { fetchAttachmentsForResources } from "@/lib/db";

type ResourceItem = Awaited<ReturnType<typeof fetchAttachmentsForResources>>[number];

function isImageName(name: string) {
  return /\.(png|jpe?g|webp|gif|avif)(\?|$)/i.test(name);
}
function isVideoName(name: string) {
  return /\.(mp4|webm|mov|m4v)(\?|$)/i.test(name);
}
function isPresentationName(name: string) {
  return /\.(pptx?|key)(\?|$)/i.test(name) || /presentation|slides/i.test(name);
}
function isPresentationResource(item: ResourceItem) {
  return item.category === "programme" || item.type === "programme" || item.type === "schedule" || item.type === "brochure" || isPresentationName(item.name);
}

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
  { label: "Victoria Falls, Summit Venue", emoji: "🌊", aspectRatio: "aspect-[4/3]", color: "#0EA5E9" },
  { label: "Elephant Hills Resort", emoji: "🏨", aspectRatio: "aspect-square", color: "#10B981" },
  { label: "Zambezi River Views", emoji: "🌅", aspectRatio: "aspect-[3/2]", color: "#F59E0B" },
  { label: "Victoria Falls UNESCO Site", emoji: "🌍", aspectRatio: "aspect-[4/3]", color: "#8B5CF6" },
  { label: "Conference Facilities", emoji: "🎤", aspectRatio: "aspect-square", color: "#C9921A" },
  { label: "Victoria Falls Bridge", emoji: "🌉", aspectRatio: "aspect-[16/9]", color: "#EC4899" },
];

function LightBox({ files, index, onClose, onPrev, onNext }: {
  files: MediaFile[]; index: number;
  onClose: () => void; onPrev: () => void; onNext: () => void;
}) {
  const f = files[index];
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onPrev, onNext]);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
      onClick={onClose}>
      <button onClick={onClose} className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white z-10">
        <X className="w-5 h-5" />
      </button>
      <button onClick={e => { e.stopPropagation(); onPrev(); }} className="absolute left-4 w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white z-10">
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button onClick={e => { e.stopPropagation(); onNext(); }} className="absolute right-4 w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white z-10">
        <ChevronRightIcon className="w-5 h-5" />
      </button>
      <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="max-w-5xl max-h-[85vh] flex flex-col items-center gap-4"
        onClick={e => e.stopPropagation()}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={f.publicUrl} alt={f.altText} className="max-h-[75vh] max-w-full rounded-xl object-contain" />
        {f.caption && <p className="text-sm text-center text-theme-primary">{f.caption}</p>}
        <p className="text-xs text-theme-primary">{index + 1} / {files.length}</p>
      </motion.div>
    </motion.div>
  );
}

export default function GalleryPage() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("venue");
  const [liveFiles, setLiveFiles]   = useState<MediaFile[]>([]);
  const [resources, setResources]   = useState<Awaited<ReturnType<typeof fetchAttachmentsForResources>>>([]);
  const [galleryLoading, setGalleryLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex]   = useState<number | null>(null);

  useEffect(() => {
    fetchPublicGallery().then(f => {
      setLiveFiles(f);
      setGalleryLoading(false);
    }).catch(() => setGalleryLoading(false));
  }, []);

  useEffect(() => {
    fetchAttachmentsForResources().then(setResources).catch(() => setResources([]));
  }, []);

  const photos = liveFiles.filter((f) => f.mediaType === "image");
  const videos = liveFiles.filter((f) => f.mediaType === "video");
  const presentationResources = resources.filter((item) => isPresentationResource(item) && !isImageName(item.name) && !isVideoName(item.name));
  const documentResources = resources.filter((item) => !isPresentationResource(item) && !isImageName(item.publicUrl) && !isImageName(item.name) && !isVideoName(item.publicUrl) && !isVideoName(item.name));
  const libraryDocuments = liveFiles.filter((f) => f.mediaType === "document" || f.mediaType === "audio");
  const presentationFiles = libraryDocuments.filter((f) => isPresentationName(`${f.originalName} ${f.fileName} ${f.altText}`));
  const officialFiles = libraryDocuments.filter((f) => !isPresentationName(`${f.originalName} ${f.fileName} ${f.altText}`));
  const hasGroupedMedia = photos.length + videos.length + presentationResources.length + documentResources.length + presentationFiles.length + officialFiles.length > 0;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <PageHeader title={t.gallery.heroTitle} subtitle={t.gallery.heroSub} />

      {/* Gallery grouped into Photography, Video, Presentations, and Official Documents */}
      {!galleryLoading && hasGroupedMedia && (
        <section id="downloads" className="py-12 sm:py-16 section-gradient">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {photos.length > 0 && (
                <FadeIn>
                  <div className="glass rounded-2xl p-6 h-full">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 bg-[#3B82F6]/15 border border-[#3B82F6]/30">
                        <ImageIcon className="w-5 h-5 text-[#3B82F6]" />
                      </div>
                      <div>
                        <h3 className="text-white font-bold">Photography</h3>
                        <p className="text-xs mt-1 leading-relaxed text-theme-primary">Official Summit photography from all sessions, ceremonies, social events and excursions.</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {photos.map((f) => (
                        <button key={f.id} type="button" className="group text-left" onClick={() => setLightboxIndex(photos.findIndex((p) => p.id === f.id))}>
                          <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-white/5">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={f.publicUrl} alt={f.altText} className="h-full w-full object-cover" loading="lazy" />
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-2">
                              <p className="text-xs font-semibold text-white line-clamp-2">{f.altText || f.originalName}</p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </FadeIn>
              )}

              {videos.length > 0 && (
                <FadeIn delay={0.05}>
                  <div className="glass rounded-2xl p-6 h-full">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 bg-[#EC4899]/15 border border-[#EC4899]/30">
                        <Video className="w-5 h-5 text-[#EC4899]" />
                      </div>
                      <div>
                        <h3 className="text-white font-bold">Video Recordings</h3>
                        <p className="text-xs mt-1 leading-relaxed text-theme-primary">Full session recordings from plenary halls, Innovation Challenge pitches and key panel discussions.</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {videos.map((f) => (
                        <a key={f.id} href={f.publicUrl} target="_blank" rel="noopener noreferrer" className="group relative block aspect-[4/3] overflow-hidden rounded-xl bg-white/5">
                          <video src={f.publicUrl} className="h-full w-full object-cover" muted />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/45">
                              <Play className="ml-0.5 h-5 w-5 text-white" />
                            </div>
                          </div>
                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-2">
                            <p className="text-xs font-semibold text-white line-clamp-2">{f.altText || f.originalName}</p>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                </FadeIn>
              )}

              {(presentationResources.length > 0 || presentationFiles.length > 0) && (
                <FadeIn delay={0.1}>
                  <div className="glass rounded-2xl p-6 h-full">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 bg-[#10B981]/15 border border-[#10B981]/30">
                        <FileText className="w-5 h-5 text-[#10B981]" />
                      </div>
                      <div>
                        <h3 className="text-white font-bold">Presentations</h3>
                        <p className="text-xs mt-1 leading-relaxed text-theme-primary">Speaker presentations and supporting documents from sessions where permission has been granted.</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {presentationFiles.map((f) => (
                        <a key={f.id} href={f.publicUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-theme-primary hover:text-white">
                          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#10B981]" />
                          <span className="min-w-0 flex-1 truncate">{f.altText || f.originalName || f.fileName}</span>
                        </a>
                      ))}
                      {presentationResources.map((att) => (
                        <a key={att.id} href={`/api/track-download?url=${encodeURIComponent(att.publicUrl)}&attachmentId=${att.id}&name=${encodeURIComponent(att.name)}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-theme-primary hover:text-white">
                          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#10B981]" />
                          <span className="min-w-0 flex-1 truncate">{att.name}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                </FadeIn>
              )}

              {(documentResources.length > 0 || officialFiles.length > 0) && (
                <FadeIn delay={0.15}>
                  <div className="glass rounded-2xl p-6 h-full">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 bg-[#C9921A]/15 border border-[#C9921A]/30">
                        <Download className="w-5 h-5 text-[#C9921A]" />
                      </div>
                      <div>
                        <h3 className="text-white font-bold">Official Documents</h3>
                        <p className="text-xs mt-1 leading-relaxed text-theme-primary">Official summit documents, including declarations, outcome reports and the investment commitments register.</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {officialFiles.map((f) => (
                        <a key={f.id} href={f.publicUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-theme-primary hover:text-white">
                          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#C9921A]" />
                          <span className="min-w-0 flex-1 truncate">{f.altText || f.originalName || f.fileName}</span>
                        </a>
                      ))}
                      {documentResources.map((att) => (
                        <a key={att.id} href={`/api/track-download?url=${encodeURIComponent(att.publicUrl)}&attachmentId=${att.id}&name=${encodeURIComponent(att.name)}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-theme-primary hover:text-white">
                          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#C9921A]" />
                          <span className="min-w-0 flex-1 truncate">{att.name}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                </FadeIn>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <LightBox files={photos} index={lightboxIndex} onClose={() => setLightboxIndex(null)}
            onPrev={() => setLightboxIndex(i => i !== null ? (i - 1 + photos.length) % photos.length : 0)}
            onNext={() => setLightboxIndex(i => i !== null ? (i + 1) % photos.length : 0)}
          />
        )}
      </AnimatePresence>

      {/* Coming Soon Banner, only when no gallery content yet */}
      {!galleryLoading && !hasGroupedMedia && (
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
      )}

      {/* Venue Preview, only when no live gallery content */}
      {!galleryLoading && !hasGroupedMedia && (
        <section className="py-20 section-gradient">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <div className="text-center mb-10">
                <span className="text-[#C9921A] text-sm font-bold uppercase tracking-widest">The Venue</span>
                <h2 className="text-3xl font-black text-white mt-3">Victoria Falls & Elephant Hills Resort</h2>
                <p className="mt-3 text-theme-primary">A world-class summit destination, one of the Seven Natural Wonders of the World</p>
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
      )}

      {/* Live Coverage */}
      <section className="py-20 section-gradient">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <div className="glass-gold rounded-3xl p-10 sm:p-12">
              <h2 className="text-3xl font-black text-white mb-4">Live & Hybrid Coverage</h2>
              <p className="mb-8 leading-relaxed text-theme-primary">
                The Zimbabwe TNF Global Summit will offer hybrid attendance with live streaming of plenary sessions. Virtual delegates can participate in real-time from anywhere in the world.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {[
                  { title: "Live Streaming", desc: "Plenary sessions streamed live on the Summit platform" },
                  { title: "Virtual Q&A", desc: "Virtual delegates participate in session Q&A" },
                  { title: "Summit App", desc: "Real-time programme, bilateral booking & voting" },
                ].map((item) => (
                  <div key={item.title} className="glass rounded-xl p-4 text-center">
                    <div className="text-white font-bold text-sm">{item.title}</div>
                    <div className="text-xs mt-1 text-theme-primary">{item.desc}</div>
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
      <section className="py-16 bg-[var(--bg-alt)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <h2 className="text-2xl font-black text-white mb-4">Follow the Summit</h2>
            <p className="mb-6 text-theme-primary">
              Use <span className="text-[#F5B730] font-bold">#TNFGlobalSummit</span> on social media to join the global conversation.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {["Twitter / X", "LinkedIn", "Facebook", "YouTube"].map((platform) => (
                <a
                  key={platform}
                  href="#"
                  className="glass px-6 py-3 rounded-xl text-sm font-medium hover:text-white hover:border-white/20 transition-all border border-white/5 text-theme-primary"
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
