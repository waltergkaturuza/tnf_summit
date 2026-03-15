"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Mail, ArrowRight, Users } from "lucide-react";

export default function VolunteerPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pt-28 pb-16 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#C9921A]/20 mb-6">
            <Heart className="w-8 h-8 text-[#C9921A]" />
          </div>
          <h1 className="text-4xl font-black text-white mb-3">Volunteer at the Summit</h1>
          <p className="text-slate-400 text-lg">Join the TNF Global Summit 2026 as a volunteer and help create an unforgettable experience for delegates from around the world.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="glass rounded-2xl border border-white/10 p-8 text-left space-y-6">
          <div className="flex gap-4">
            <Users className="w-6 h-6 text-[#C9921A] flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="text-white font-bold text-lg mb-2">Why volunteer?</h2>
              <p className="text-slate-400 text-sm">Support registration, session logistics, delegate assistance, and networking events. Gain valuable experience and connect with policymakers, investors, and innovators.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <Mail className="w-6 h-6 text-[#C9921A] flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="text-white font-bold text-lg mb-2">Get in touch</h2>
              <p className="text-slate-400 text-sm mb-4">To express your interest in volunteering, please contact the TNF Secretariat with your name, email, and a brief note on how you would like to contribute.</p>
              <a href="mailto:info@tnfzim.com?subject=Volunteer%20interest%20-%20TNF%20Global%20Summit%202026" className="inline-flex items-center gap-2 btn-gold px-5 py-2.5 rounded-xl text-sm font-bold">
                <Mail className="w-4 h-4" /> Email us
              </a>
            </div>
          </div>
        </motion.div>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mt-8 text-slate-500 text-sm">
          You can also <Link href="/registration" className="text-[#C9921A] font-semibold hover:underline">register as a delegate</Link> if you prefer to attend in full.
        </motion.p>
        <Link href="/contact" className="inline-flex items-center gap-2 mt-6 text-[#C9921A] font-semibold hover:underline">
          Contact page <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
