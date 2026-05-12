"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

/** Curated Victoria Falls imagery (Unsplash). Replace with `/gallery/...` local assets anytime. */
const SLIDES = [
  {
    src: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1600&q=80",
    alt: "Victoria Falls mist and rainbow at the gorge",
    title: "Victoria Falls — Summit Venue",
    subtitle:
      "Victoria Falls, one of the Seven Natural Wonders of the World and host venue of the TNF Global Summit 2026",
  },
  {
    src: "https://images.unsplash.com/photo-1596402184320-417e7178b409?auto=format&fit=crop&w=1600&q=80",
    alt: "Aerial view of Victoria Falls cascading into the gorge",
    title: "Victoria Falls UNESCO World Heritage Site",
    subtitle:
      "Victoria Falls — a UNESCO World Heritage Site and one of Africa's most spectacular natural attractions",
  },
  {
    src: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1600&q=80",
    alt: "Zambezi River and falls landscape",
    title: "Elephant Hills Resort, Zimbabwe",
    subtitle: "Summit headquarters at Elephant Hills Resort — Victoria Falls, on the banks of the Zambezi",
  },
] as const;

const AUTO_MS = 6000;

export default function VictoriaFallsCarousel({ className = "" }: { className?: string }) {
  const [index, setIndex] = useState(0);
  const len = SLIDES.length;

  const go = useCallback(
    (dir: -1 | 1) => {
      setIndex((i) => (i + dir + len) % len);
    },
    [len],
  );

  useEffect(() => {
    const id = window.setInterval(() => go(1), AUTO_MS);
    return () => clearInterval(id);
  }, [go]);

  const slide = SLIDES[index];

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-white/10 bg-[var(--bg-surface)] shadow-lg ${className}`}
      role="region"
      aria-roledescription="carousel"
      aria-label="Victoria Falls gallery"
    >
      <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={slide.src}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
            className="absolute inset-0"
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628]/95 via-[#0A1628]/35 to-transparent" />
          </motion.div>
        </AnimatePresence>

        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 z-10">
          <h3 className="text-white font-bold text-sm sm:text-base leading-snug drop-shadow-sm">{slide.title}</h3>
          <p className="text-xs sm:text-sm text-slate-200/95 mt-1.5 leading-relaxed max-w-prose drop-shadow-sm">
            {slide.subtitle}
          </p>
        </div>

        <button
          type="button"
          onClick={() => go(-1)}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 rounded-full bg-black/45 hover:bg-black/60 text-white p-2 border border-white/15 transition-colors"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 rounded-full bg-black/45 hover:bg-black/60 text-white p-2 border border-white/15 transition-colors"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="flex items-center justify-center gap-2 py-3 border-t border-white/10 bg-black/20">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIndex(i)}
            className={`h-2 rounded-full transition-all ${i === index ? "w-7 bg-[#F5B730]" : "w-2 bg-white/30 hover:bg-white/50"}`}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === index}
          />
        ))}
      </div>
    </div>
  );
}
