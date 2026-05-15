"use client";

import { motion } from "framer-motion";

type PageHeaderProps = {
  title: string;
  subtitle?: string;
};

/** Inner-page banner (Chilmund-style): centered title + subtitle on illuminated TNF green. */
export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <section className="page-header-green relative overflow-hidden mt-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 text-center"
      >
        <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-black text-white leading-tight tracking-tight">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-4 text-base sm:text-lg text-white/90 leading-relaxed max-w-3xl mx-auto text-pretty">
            {subtitle}
          </p>
        ) : null}
      </motion.div>
    </section>
  );
}
