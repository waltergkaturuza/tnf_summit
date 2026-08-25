"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ExternalLink, Hotel } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import WallpaperSurface from "@/components/WallpaperSurface";
import { useLanguage } from "@/context/LanguageContext";
import { GATEWAY_STREAM_HOME } from "@/lib/gatewayStream";

export default function AccommodationPage() {
  const { t } = useLanguage();
  const a = t.accommodation;

  return (
    <div className="min-h-screen flex flex-col">
      <PageHeader title={a.heroTitle} subtitle={a.heroSub} />
      <WallpaperSurface
        fillViewport
        contentClassName="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-20 flex-1 justify-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="wallpaper-form glass rounded-2xl border border-white/10 p-8 text-center space-y-6"
        >
          <div className="w-14 h-14 rounded-2xl bg-[#C9921A]/15 border border-[#C9921A]/30 flex items-center justify-center mx-auto">
            <Hotel className="w-7 h-7 text-[#C9921A]" />
          </div>
          <div>
            <h2 className="text-xl font-black text-theme-primary">{a.partnerTitle}</h2>
            <p className="mt-3 text-sm leading-relaxed text-theme-primary opacity-90">{a.partnerDesc}</p>
          </div>
          <a
            href={GATEWAY_STREAM_HOME}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold w-full sm:w-auto"
          >
            {a.bookCta}
            <ExternalLink className="w-4 h-4" />
          </a>
          <p className="text-xs text-theme-primary opacity-75">
            {a.opensExternal}{" "}
            <a
              href={GATEWAY_STREAM_HOME}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#C9921A] font-semibold hover:underline"
            >
              www.gatewaystream.com
            </a>
          </p>
        </motion.div>

        <p className="mt-8 text-center text-sm text-white/85">
          {a.needHelpBefore}{" "}
          <Link href="/contact" className="text-[#F5B730] font-semibold hover:underline inline-flex items-center gap-1">
            {a.needHelpLink}
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          {a.needHelpAfter}
        </p>
      </WallpaperSurface>
    </div>
  );
}
