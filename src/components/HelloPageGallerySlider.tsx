"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

/** Local assets from `public/hello page/` (Victoria Falls & summit context). */
const SLIDES = [
  {
    path: "/hello page/victoria-falls-with-a-rainbow-halo-02hm9yk7rbm20tgn.jpg",
    alt: "Victoria Falls with rainbow mist over the gorge",
    title: "Victoria Falls",
    subtitle: "Host destination for the Zimbabwe TNF Global Summit 2026",
  },
  {
    path: "/hello page/victoria-falls-with-a-rainbow-halo-02hm9yk7rbm20tgn (1).jpg",
    alt: "Victoria Falls rainbow and spray",
    title: "Natural wonder",
    subtitle: "One of the Seven Natural Wonders of the World",
  },
  {
    path: "/hello page/victoria-falls-on-zambezi-river-jghmkkbz82ozatxr.jpg",
    alt: "Victoria Falls on the Zambezi River",
    title: "Zambezi River",
    subtitle: "Elephant Hills Resort overlooks the mighty Zambezi",
  },
  {
    path: "/hello page/victoria-falls-zambia-wallpaper-preview.jpg",
    alt: "Wide view of Victoria Falls",
    title: "Panorama",
    subtitle: "World-class setting for tripartite dialogue",
  },
  {
    path: "/hello page/360_F_221948766_efKngyq424dEwe2N22QSsfPOgdyvZnq3.jpg",
    alt: "Victoria Falls landscape",
    title: "Summit backdrop",
    subtitle: "Zimbabwe welcomes global delegates",
  },
  {
    path: "/hello page/istockphoto-507449285-612x612.jpg",
    alt: "Victoria Falls scenic view",
    title: "Victoria Falls, Zimbabwe",
    subtitle: "21–25 September 2026",
  },
] as const;

const AUTO_MS = 5500;

function slideSrc(path: string): string {
  return encodeURI(path);
}

export default function HelloPageGallerySlider({ className = "" }: { className?: string }) {
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
    return () => window.clearInterval(id);
  }, [go]);

  const slide = SLIDES[index];

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-white/10 bg-[var(--bg-surface)] shadow-lg ${className}`}
      role="region"
      aria-roledescription="carousel"
      aria-label="Summit destination gallery"
    >
      <div className="relative aspect-[4/3] sm:aspect-[16/10] w-full min-h-[280px] sm:min-h-[300px] lg:min-h-[320px]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={slide.path}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0"
          >
            <Image
              src={slideSrc(slide.path)}
              alt={slide.alt}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 65vw"
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628]/95 via-[#0A1628]/30 to-transparent" />
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
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 rounded-full bg-black/45 hover:bg-black/60 text-white p-2.5 border border-white/15 transition-colors"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 rounded-full bg-black/45 hover:bg-black/60 text-white p-2.5 border border-white/15 transition-colors"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6" />
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
