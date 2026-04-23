"use client";

import { useMemo, useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Users, CheckCircle, Clock, DollarSign,
  MessageSquare, Bell, Mic, TrendingUp, Globe,
  ArrowRight, AlertCircle, ArrowUpRight, Download,
  Newspaper, FileText, FolderOpen, Activity, Paperclip,
} from "lucide-react";
import { useAdmin } from "@/context/AdminContext";
import { fetchDownloadStats, fetchAllAttachmentsForAdmin } from "@/lib/db";
import { fetchMediaFiles } from "@/lib/storage";

function StatCard({ label, value, sub, icon: Icon, color, href }: {
  label: string; value: string | number; sub?: string;
  icon: React.ElementType; color: string; href?: string;
}) {
  const content = (
    <motion.div whileHover={{ scale: 1.02 }} className="glass rounded-2xl p-5 border border-white/5 hover:border-white/15 transition-all cursor-pointer">
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}20`, border: `1px solid ${color}30` }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        {href && <ArrowUpRight className="w-4 h-4 text-slate-600" />}
      </div>
      <div className="text-3xl font-black text-white mb-1">{value}</div>
      <div className="text-slate-400 text-sm font-medium">{label}</div>
      {sub && <div className="text-slate-600 text-xs mt-1">{sub}</div>}
    </motion.div>
  );
  return href ? <Link href={href}>{content}</Link> : content;
}

function RecentRow({ reg }: { reg: ReturnType<typeof useAdmin>["registrations"][0] }) {
  const statusColors: Record<string, string> = {
    pending: "text-amber-400 bg-amber-400/10",
    confirmed: "text-emerald-400 bg-emerald-400/10",
    cancelled: "text-red-400 bg-red-400/10",
    waitlisted: "text-blue-400 bg-blue-400/10",
  };
  return (
    <div className="flex items-center gap-4 py-3 border-b border-white/5 last:border-0">
      <div className="w-9 h-9 rounded-xl bg-[#C9921A]/15 flex items-center justify-center flex-shrink-0">
        <span className="text-[#C9921A] text-xs font-black">{reg.firstName[0]}{reg.lastName[0]}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-white text-sm font-semibold truncate">{reg.salutation} {reg.firstName} {reg.lastName}</div>
        <div className="text-slate-500 text-xs truncate">{reg.organisation} · {reg.country}</div>
      </div>
      <div className="hidden sm:block text-slate-400 text-xs">{reg.category.split("/")[0].trim()}</div>
      <div className={`text-xs px-2 py-1 rounded-full font-bold capitalize flex-shrink-0 ${statusColors[reg.status]}`}>{reg.status}</div>
      <div className="text-slate-500 text-xs hidden md:block flex-shrink-0">
        {new Date(reg.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { registrations, messages, subscribers, speakers, updates, abstracts } = useAdmin();
  const [downloadCount, setDownloadCount] = useState<number | null>(null);
  const [attachmentsCount, setAttachmentsCount] = useState<number | null>(null);
  const [mediaCount, setMediaCount] = useState<number | null>(null);
  const [auditCount, setAuditCount] = useState<number | null>(null);

  useEffect(() => {
    fetchDownloadStats(90).then((s) => setDownloadCount(s.total)).catch(() => setDownloadCount(0));
  }, []);
  useEffect(() => {
    fetchAllAttachmentsForAdmin().then((a) => setAttachmentsCount(a.length)).catch(() => setAttachmentsCount(0));
  }, []);
  useEffect(() => {
    fetchMediaFiles().then((f) => setMediaCount(f.length)).catch(() => setMediaCount(0));
  }, []);
  useEffect(() => {
    import("@/lib/supabase").then(({ supabase }) =>
      supabase.schema("tnf_summit").from("audit_trail").select("*", { count: "exact", head: true }).gte("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
    ).then(({ count }) => setAuditCount(count ?? 0)).catch(() => setAuditCount(0));
  }, []);

  const stats = useMemo(() => {
    const total = registrations.length;
    const confirmed = registrations.filter(r => r.status === "confirmed").length;
    const pending = registrations.filter(r => r.status === "pending").length;
    const cancelled = registrations.filter(r => r.status === "cancelled").length;
    const inPerson = registrations.filter(r => r.attendanceMode !== "virtual").length;
    const virtual = registrations.filter(r => r.attendanceMode === "virtual").length;
    const revenue = registrations.filter(r => r.paymentStatus === "paid").reduce((s, r) => s + r.feeAmount, 0);
    const unread = messages.filter(m => m.status === "unread").length;
    const activeSubs = subscribers.filter(s => s.status === "active").length;
    const confSpeakers = speakers.filter(s => s.status === "confirmed").length;

    const byCategory: Record<string, number> = {};
    registrations.forEach(r => { byCategory[r.category] = (byCategory[r.category] || 0) + 1; });

    const byCountry: Record<string, number> = {};
    registrations.forEach(r => { byCountry[r.country] = (byCountry[r.country] || 0) + 1; });
    const topCountries = Object.entries(byCountry).sort((a, b) => b[1] - a[1]).slice(0, 5);

    return { total, confirmed, pending, cancelled, inPerson, virtual, revenue, unread, activeSubs, confSpeakers, byCategory, topCountries };
  }, [registrations, messages, subscribers, speakers]);

  const recentRegs = [...registrations].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 8);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-white">Dashboard</h1>
        <p className="text-slate-400 text-sm mt-1">Zimbabwe TNF Global Summit 2026 — 21–25 September · Victoria Falls</p>
      </div>

      {/* Alert for pending */}
      {stats.pending > 0 && (
        <Link href="/admin/registrations">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 hover:border-amber-500/40 transition-colors">
            <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <p className="text-amber-300 text-sm flex-1"><strong>{stats.pending} registration{stats.pending > 1 ? "s" : ""}</strong> pending confirmation</p>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </div>
        </Link>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Registrations" value={stats.total} sub={`${stats.inPerson} in-person · ${stats.virtual} virtual`} icon={Users} color="#3B82F6" href="/admin/registrations" />
        <StatCard label="Confirmed" value={stats.confirmed} sub={stats.total > 0 ? `${Math.round(stats.confirmed / stats.total * 100)}% of total` : "—"} icon={CheckCircle} color="#10B981" href="/admin/registrations" />
        <StatCard label="Pending" value={stats.pending} sub="Awaiting confirmation" icon={Clock} color="#F59E0B" href="/admin/registrations" />
        <StatCard label="Revenue (USD)" value={`$${stats.revenue.toLocaleString()}`} sub="Confirmed paid registrations" icon={DollarSign} color="#C9921A" />
        <StatCard label="Unread Messages" value={stats.unread} sub={`${messages.length} total enquiries`} icon={MessageSquare} color="#8B5CF6" href="/admin/messages" />
        <StatCard label="Newsletter" value={stats.activeSubs} sub="Active subscribers" icon={Bell} color="#EC4899" href="/admin/newsletter" />
        <StatCard label="Speakers" value={stats.confSpeakers} sub={`${speakers.length} total · ${speakers.filter(s => s.status === "tentative").length} tentative`} icon={Mic} color="#0EA5E9" href="/admin/speakers" />
        <StatCard label="Countries" value={Object.keys(registrations.reduce((acc, r) => ({ ...acc, [r.country]: 1 }), {})).length} sub="Nationalities represented" icon={Globe} color="#14B8A6" />
        <StatCard label="Resource Downloads" value={downloadCount ?? "—"} sub="Last 90 days" icon={Download} color="#8B5CF6" href="/admin/analytics" />
        <StatCard label="Updates & News" value={updates.filter(u => u.published).length} sub={`${updates.length} total · ${updates.filter(u => !u.published).length} draft`} icon={Newspaper} color="#0EA5E9" href="/admin/updates" />
        <StatCard label="Resources" value={attachmentsCount ?? "—"} sub="Attachments & documents" icon={Paperclip} color="#EC4899" href="/admin/resources" />
        <StatCard label="Abstracts" value={abstracts.length} sub="Submitted abstracts" icon={FileText} color="#10B981" href="/admin/abstracts" />
        <StatCard label="Media Library" value={mediaCount ?? "—"} sub="Images, docs & videos" icon={FolderOpen} color="#F59E0B" href="/admin/media" />
        <StatCard label="Audit Trail" value={auditCount ?? "—"} sub="Actions last 7 days" icon={Activity} color="#64748b" href="/admin/audit" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent registrations */}
        <div className="lg:col-span-2 glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-white font-bold">Recent Registrations</h2>
            <Link href="/admin/registrations" className="text-[#C9921A] text-xs hover:text-[#F5B730] flex items-center gap-1 transition-colors">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div>{recentRegs.map(r => <RecentRow key={r.id} reg={r} />)}</div>
        </div>

        {/* Side panels */}
        <div className="space-y-5">
          {/* Registrations by category */}
          <div className="glass rounded-2xl p-5">
            <h3 className="text-white font-bold text-sm mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-[#C9921A]" />By Category</h3>
            <div className="space-y-2.5">
              {Object.entries(stats.byCategory).sort((a, b) => b[1] - a[1]).map(([cat, count]) => {
                const pct = stats.total > 0 ? Math.round(count / stats.total * 100) : 0;
                return (
                  <div key={cat}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400 truncate max-w-[160px]">{cat.split("/")[0].trim()}</span>
                      <span className="text-white font-bold">{count}</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#C9921A] to-[#F5B730] rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top countries */}
          <div className="glass rounded-2xl p-5">
            <h3 className="text-white font-bold text-sm mb-4 flex items-center gap-2"><Globe className="w-4 h-4 text-[#C9921A]" />Top Countries</h3>
            <div className="space-y-2">
              {stats.topCountries.map(([country, count], i) => (
                <div key={country} className="flex items-center gap-3">
                  <span className="text-slate-500 text-xs w-4">{i + 1}</span>
                  <span className="flex-1 text-slate-300 text-sm">{country}</span>
                  <span className="text-white font-bold text-sm">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent unread messages */}
          <div className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold text-sm flex items-center gap-2"><MessageSquare className="w-4 h-4 text-[#C9921A]" />Unread Messages</h3>
              <Link href="/admin/messages" className="text-[#C9921A] text-xs hover:text-[#F5B730]"><ArrowRight className="w-3 h-3" /></Link>
            </div>
            {messages.filter(m => m.status === "unread").slice(0, 3).map(m => (
              <div key={m.id} className="py-2 border-b border-white/5 last:border-0">
                <div className="text-white text-xs font-semibold">{m.name}</div>
                <div className="text-slate-500 text-xs truncate">{m.enquiryType}</div>
                <div className="text-slate-600 text-xs truncate">{m.message.slice(0, 60)}...</div>
              </div>
            ))}
            {stats.unread === 0 && <p className="text-slate-600 text-xs text-center py-2">All messages read</p>}
          </div>

          {/* Recent Updates & News */}
          <div className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold text-sm flex items-center gap-2"><Newspaper className="w-4 h-4 text-[#C9921A]" />Recent Updates</h3>
              <Link href="/admin/updates" className="text-[#C9921A] text-xs hover:text-[#F5B730]"><ArrowRight className="w-3 h-3" /></Link>
            </div>
            {[...updates].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 3).map(u => (
              <div key={u.id} className="py-2 border-b border-white/5 last:border-0">
                <div className="text-white text-xs font-semibold truncate">{u.title}</div>
                <div className="text-slate-500 text-xs">{u.category} · {u.published ? "Published" : "Draft"}</div>
              </div>
            ))}
            {updates.length === 0 && <p className="text-slate-600 text-xs text-center py-2">No updates yet</p>}
          </div>

          {/* Recent Abstracts */}
          {abstracts.length > 0 && (
            <div className="glass rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-bold text-sm flex items-center gap-2"><FileText className="w-4 h-4 text-[#C9921A]" />Recent Abstracts</h3>
                <Link href="/admin/abstracts" className="text-[#C9921A] text-xs hover:text-[#F5B730]"><ArrowRight className="w-3 h-3" /></Link>
              </div>
              {[...abstracts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 3).map(a => (
                <div key={a.id} className="py-2 border-b border-white/5 last:border-0">
                  <div className="text-white text-xs font-semibold truncate">{a.title}</div>
                  <div className="text-slate-500 text-xs truncate">{a.trackId}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
