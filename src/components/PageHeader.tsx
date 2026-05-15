"use client";

import { motion } from "framer-motion";

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  /** Optional second line (e.g. programme date/venue details). */
  subtitleLine2?: string;
};

/** Inner-page banner (Chilmund-style): centered title + subtitle on illuminated TNF green. */
export default function PageHeader({ title, subtitle, subtitleLine2 }: PageHeaderProps) {
  return (
    <section className="page-header-green relative overflow-hidden mt-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 text-center"
      >
        <h1 className="text-2xl sm:text-3xl lg:text-[2.25rem] font-black text-white leading-tight tracking-tight">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-2 text-sm sm:text-base text-white/90 leading-snug max-w-3xl mx-auto text-pretty">
            {subtitle}
          </p>
        ) : null}
        {subtitleLine2 ? (
          <p className="mt-1.5 text-sm text-white/80 leading-snug max-w-3xl mx-auto text-pretty">
            {subtitleLine2}
          </p>
        ) : null}
      </motion.div>
    </section>
  );
}
