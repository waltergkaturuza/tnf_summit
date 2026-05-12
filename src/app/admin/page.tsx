"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { Lock, Mail, Eye, EyeOff, Shield, LogIn, AlertCircle, CheckCircle } from "lucide-react";
import { useAdmin } from "@/context/AdminContext";

export default function AdminLoginPage() {
  const [email, setEmail]           = useState("");
  const [password, setPassword]     = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]           = useState("");
  const [loading, setLoading]       = useState(false);
  const { login, isAuthenticated, authLoading } = useAdmin();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && isAuthenticated) router.push("/admin/dashboard");
  }, [isAuthenticated, authLoading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { ok, error: err } = await login(email, password);
    setLoading(false);
    if (ok) {
      router.push("/admin/dashboard");
    } else {
      setError(err ?? "Invalid credentials. Please check your email and password.");
    }
  };

  if (authLoading) return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#C9921A]/30 border-t-[#C9921A] rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] hero-bg flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">

        <div className="text-center mb-8">
          <div className="flex justify-center mb-5">
            <div className="relative h-14 w-48">
              <Image src="/tnf-logo.png" alt="TNF" fill className="object-contain" />
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 mb-1">
            <Shield className="w-5 h-5 text-[#C9921A]" />
            <h1 className="text-2xl font-black text-white">Admin Portal</h1>
          </div>
          <p className="text-slate-500 text-sm">Zimbabwe TNF Global Summit 2026. Management System</p>
        </div>

        <div className="glass rounded-2xl p-8 border border-white/5">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-slate-400 text-xs font-semibold uppercase tracking-wide mb-1.5 block">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email" required placeholder="your@email.com"
                  value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-[#C9921A]/60"
                />
              </div>
            </div>
            <div>
              <label className="text-slate-400 text-xs font-semibold uppercase tracking-wide mb-1.5 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type={showPassword ? "text" : "password"} required placeholder="••••••••"
                  value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-10 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-[#C9921A]/60"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2.5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20">
                <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                <p className="text-red-400 text-xs leading-relaxed">{error}</p>
              </motion.div>
            )}

            <button type="submit" disabled={loading}
              className="w-full btn-gold py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50">
              {loading
                ? <><div className="w-4 h-4 border-2 border-[#0A1628]/30 border-t-[#0A1628] rounded-full animate-spin" />Authenticating…</>
                : <><LogIn className="w-4 h-4" />Sign In</>}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-white/5 text-center">
            <a href="mailto:info@tnfzim.com" className="text-slate-500 hover:text-[#C9921A] text-xs transition-colors">
              Need access? → info@tnfzim.com
            </a>
          </div>
        </div>

        <div className="text-center mt-5 space-y-1.5">
          <a href="/" className="text-slate-600 hover:text-slate-400 text-xs transition-colors block">← Return to Summit Website</a>
          <p className="text-slate-700 text-xs">
            Developed by{" "}
            <a href="https://www.quantistechnologies.co.zw/" target="_blank" rel="noopener noreferrer" className="hover:text-slate-500">
              Quantis Technologies
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
