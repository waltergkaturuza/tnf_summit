"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";

export default function DonateFloatingButton() {
  return (
    <Link href="/donate">
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-5 py-3 rounded-full shadow-xl bg-[#C9921A] hover:bg-[#F5B730] text-[#0A1628] font-bold text-sm transition-colors border-2 border-[#F5B730]/50"
        aria-label="Donate"
      >
        <Heart className="w-4 h-4" fill="currentColor" />
        <span>Donate</span>
      </motion.button>
    </Link>
  );
}
