"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Users, Mic, Mail, Bell, Globe,
  LogOut, Menu, X, ChevronRight, Settings, Shield,
  UserCheck, MessageSquare, BarChart2, FolderOpen,
} from "lucide-react";
import { useAdmin } from "@/context/AdminContext";

const navItems = [
  { href: "/admin/dashboard",     label: "Dashboard",     icon: LayoutDashboard },
  { href: "/admin/analytics",     label: "Analytics",     icon: BarChart2 },
  { href: "/admin/registrations", label: "Registrations", icon: Users },
  { href: "/admin/speakers",      label: "Speakers",      icon: Mic },
  { href: "/admin/media",         label: "Media Library", icon: FolderOpen },
  { href: "/admin/messages",      label: "Messages",      icon: MessageSquare },
  { href: "/admin/newsletter",    label: "Newsletter",    icon: Bell },
  { href: "/admin/sponsors",      label: "Sponsors",      icon: Globe },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, logout, registrations, messages } = useAdmin();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated && pathname !== "/admin") {
      router.push("/admin");
    }
  }, [mounted, isAuthenticated, pathname, router]);

  if (pathname === "/admin") return <>{children}</>;
  if (!mounted || !isAuthenticated) return (
    <div className="min-h-screen bg-[#061020] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#C9921A]/30 border-t-[#C9921A] rounded-full animate-spin" />
    </div>
  );

  const unreadMessages = messages.filter(m => m.status === "unread").length;
  const pendingRegs = registrations.filter(r => r.status === "pending").length;

  const handleLogout = () => { logout(); router.push("/admin"); };

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={`${mobile ? "w-72" : "w-64"} h-full flex flex-col bg-[#06101F] border-r border-white/5`}>
      {/* Logo */}
      <div className="p-5 border-b border-white/5">
        <Link href="/" className="flex items-center gap-3 mb-1">
          <div className="relative h-8 w-32"><Image src="/tnf-logo.png" alt="TNF" fill className="object-contain object-left" /></div>
        </Link>
        <div className="flex items-center gap-1.5 mt-2">
          <Shield className="w-3 h-3 text-[#C9921A]" />
          <span className="text-[#C9921A] text-xs font-bold">Admin Portal</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          const badge = href === "/admin/messages" ? unreadMessages : href === "/admin/registrations" ? pendingRegs : 0;
          return (
            <Link key={href} href={href} onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${active ? "bg-[#C9921A]/15 text-[#F5B730] border border-[#C9921A]/20" : "text-slate-400 hover:text-white hover:bg-white/5"}`}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 ${active ? "text-[#C9921A]" : "group-hover:text-slate-200"}`} />
              <span className="flex-1">{label}</span>
              {badge > 0 && <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${active ? "bg-[#C9921A] text-[#0A1628]" : "bg-red-500 text-white"}`}>{badge}</span>}
              {active && <ChevronRight className="w-3 h-3 text-[#C9921A]" />}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="p-3 border-t border-white/5">
        <div className="flex items-center gap-3 px-3 py-2.5 mb-1">
          <div className="w-8 h-8 rounded-xl bg-[#C9921A]/20 flex items-center justify-center flex-shrink-0">
            <UserCheck className="w-4 h-4 text-[#C9921A]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white text-xs font-bold truncate">TNF Admin</div>
            <div className="text-slate-500 text-[10px] truncate">admin@tnfzim.com</div>
          </div>
        </div>
        <Link href="/" className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-400 hover:text-white text-xs transition-colors hover:bg-white/5">
          <Globe className="w-3.5 h-3.5" /> View Public Site
        </Link>
        <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-slate-400 hover:text-red-400 text-xs transition-colors hover:bg-red-500/5">
          <LogOut className="w-3.5 h-3.5" /> Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#0A1628] overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-shrink-0"><Sidebar /></div>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
            <motion.div initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ type: "spring", damping: 25 }} className="absolute left-0 top-0 h-full">
              <Sidebar mobile />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-14 bg-[#06101F] border-b border-white/5 flex items-center justify-between px-4 sm:px-6 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5">
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:flex items-center gap-2 text-slate-400 text-sm">
              {navItems.find(n => pathname.startsWith(n.href))?.icon && (() => {
                const Icon = navItems.find(n => pathname.startsWith(n.href))!.icon;
                return <Icon className="w-4 h-4" />;
              })()}
              <span className="text-white font-semibold">{navItems.find(n => pathname.startsWith(n.href))?.label || "Admin"}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="glass rounded-lg px-3 py-1.5 text-xs text-[#C9921A] font-bold">
              Summit 2026
            </div>
            <div className="text-slate-400 text-xs hidden sm:block">{new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
