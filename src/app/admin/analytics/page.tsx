"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar,
} from "recharts";
import {
  BarChart2, Eye, Users, TrendingUp, Monitor, Smartphone, Tablet,
  Globe, RefreshCw, Calendar, MousePointer, ChevronDown,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { format, parseISO, subDays } from "date-fns";
import type { ViewsPerDay, TopPage, DeviceStat } from "@/lib/analytics";

const GOLD    = "#C9921A";
const TEAL    = "#0EA5E9";
const EMERALD = "#10B981";
const PURPLE  = "#8B5CF6";

const DEVICE_COLORS: Record<string, string> = {
  desktop: TEAL, mobile: GOLD, tablet: EMERALD, unknown: "#475569",
};
const DEVICE_ICONS: Record<string, React.ElementType> = {
  desktop: Monitor, mobile: Smartphone, tablet: Tablet, unknown: Globe,
};

const TIME_WINDOWS = [
  { label: "7 days",    days: 7 },
  { label: "14 days",   days: 14 },
  { label: "30 days",   days: 30 },
  { label: "3 months",  days: 90 },
  { label: "1 year",    days: 365 },
];

const CustomTooltip = ({ active, payload, label }: {
  active?: boolean; payload?: Array<{ value: number; name: string; color: string }>; label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[var(--bg-surface)] border border-white/10 rounded-xl p-3 text-xs shadow-xl">
      <p className="text-slate-400 mb-2">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-semibold">{p.name}: {p.value.toLocaleString()}</p>
      ))}
    </div>
  );
};

function StatCard({ icon: Icon, label, value, sub, color = GOLD }: {
  icon: React.ElementType; label: string; value: number | string; sub?: string; color?: string;
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-5 border border-white/5">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
        style={{ background: `${color}20` }}>
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <div className="text-2xl font-black text-white mb-0.5">{typeof value === "number" ? value.toLocaleString() : value}</div>
      <div className="text-slate-400 text-sm font-medium">{label}</div>
      {sub && <div className="text-slate-600 text-xs mt-1">{sub}</div>}
    </motion.div>
  );
}

export default function AnalyticsPage() {
  const [window, setWindow] = useState(14);
  const [showWindowMenu, setShowWindowMenu] = useState(false);
  const [loading, setLoading]   = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [total, setTotal]       = useState(0);
  const [today, setToday]       = useState(0);
  const [unique, setUnique]     = useState(0);
  const [perDay, setPerDay]     = useState<ViewsPerDay[]>([]);
  const [topPages, setTopPages] = useState<TopPage[]>([]);
  const [devices, setDevices]   = useState<DeviceStat[]>([]);
  const [eventsByType, setEventsByType] = useState<{ name: string; Events: number }[]>([]);

  const since = (days: number) => subDays(new Date(), days).toISOString();

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const cutoff = since(window);

      // Total all-time
      const { count: totalCount } = await supabase.schema("tnf_summit").from("page_views")
        .select("*", { count: "exact", head: true });
      setTotal(totalCount ?? 0);

      // Today
      const { count: todayCount } = await supabase.schema("tnf_summit").from("page_views")
        .select("*", { count: "exact", head: true })
        .gte("created_at", new Date().toISOString().split("T")[0]);
      setToday(todayCount ?? 0);

      // Unique sessions in window
      const { data: sessionRows } = await supabase.schema("tnf_summit").from("page_views")
        .select("session_id").gte("created_at", cutoff).neq("session_id", "");
      setUnique(new Set((sessionRows ?? []).map((r: { session_id: string }) => r.session_id)).size);

      // Views per day — manual aggregation (views don't use the fixed 30-day view)
      const { data: rawViews } = await supabase.schema("tnf_summit").from("page_views")
        .select("created_at, session_id").gte("created_at", cutoff).order("created_at");

      const dayMap: Record<string, { total: number; sessions: Set<string> }> = {};
      (rawViews ?? []).forEach((r: { created_at: string; session_id: string }) => {
        const d = r.created_at.split("T")[0];
        if (!dayMap[d]) dayMap[d] = { total: 0, sessions: new Set() };
        dayMap[d].total++;
        if (r.session_id) dayMap[d].sessions.add(r.session_id);
      });
      setPerDay(
        Object.entries(dayMap).map(([view_date, v]) => ({
          view_date,
          total_views: v.total,
          unique_sessions: v.sessions.size,
        }))
      );

      // Top pages in window
      const { data: pageRows } = await supabase.schema("tnf_summit").from("page_views")
        .select("page_path").gte("created_at", cutoff);
      const pageMap: Record<string, number> = {};
      (pageRows ?? []).forEach((r: { page_path: string }) => { pageMap[r.page_path] = (pageMap[r.page_path] ?? 0) + 1; });
      setTopPages(
        Object.entries(pageMap).sort((a, b) => b[1] - a[1]).slice(0, 10)
          .map(([page_path, views]) => ({ page_path, views }))
      );

      // Device breakdown in window
      const { data: deviceRows } = await supabase.schema("tnf_summit").from("page_views")
        .select("device_type").gte("created_at", cutoff);
      const devMap: Record<string, number> = {};
      (deviceRows ?? []).forEach((r: { device_type: string }) => {
        const d = r.device_type || "unknown";
        devMap[d] = (devMap[d] ?? 0) + 1;
      });
      setDevices(Object.entries(devMap).map(([device_type, views]) => ({ device_type, views })));

      // Events by day (using page_path as proxy for "event type")
      const eventMap: Record<string, number> = {};
      (rawViews ?? []).forEach((r: { created_at: string }) => {
        const d = r.created_at.split("T")[0];
        eventMap[d] = (eventMap[d] ?? 0) + 1;
      });
      setEventsByType(
        Object.entries(eventMap).sort().map(([d, v]) => ({
          name: format(parseISO(d), "d MMM"),
          Events: v,
        }))
      );
    } catch (e) { console.error(e); }
    finally { setLoading(false); setRefreshing(false); }
  }, [window]);

  useEffect(() => { load(); }, [load]);

  const chartData = perDay.map(d => ({
    date:   format(parseISO(d.view_date), "d MMM"),
    Views:  d.total_views,
    Unique: d.unique_sessions,
  }));

  const devicePieData = devices.map(d => ({
    name:  d.device_type.charAt(0).toUpperCase() + d.device_type.slice(1),
    value: d.views,
    color: DEVICE_COLORS[d.device_type] ?? "#475569",
  }));
  const totalDeviceViews = devices.reduce((s, d) => s + d.views, 0);

  const windowLabel = TIME_WINDOWS.find(w => w.days === window)?.label ?? "14 days";

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-[#C9921A]/30 border-t-[#C9921A] rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <BarChart2 className="w-6 h-6 text-[#C9921A]" /> Analytics
          </h1>
          <p className="text-slate-400 text-sm mt-1">Site visitors and interactions</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Time window filter */}
          <div className="relative">
            <button onClick={() => setShowWindowMenu(!showWindowMenu)}
              className="flex items-center gap-2 glass rounded-xl px-4 py-2 text-sm text-white font-semibold border border-white/10 hover:border-[#C9921A]/40">
              <Calendar className="w-4 h-4 text-[#C9921A]" />
              {windowLabel}
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showWindowMenu ? "rotate-180" : ""}`} />
            </button>
            {showWindowMenu && (
              <div className="absolute right-0 top-full mt-2 w-40 bg-[var(--bg-surface)] border border-white/10 rounded-xl shadow-xl z-20 overflow-hidden">
                {TIME_WINDOWS.map(w => (
                  <button key={w.days} onClick={() => { setWindow(w.days); setShowWindowMenu(false); }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                      window === w.days
                        ? "bg-[#C9921A]/15 text-[#F5B730] font-bold"
                        : "text-slate-300 hover:bg-white/5 hover:text-white"
                    }`}>
                    {w.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button onClick={() => load(true)} disabled={refreshing}
            className="p-2 glass rounded-xl text-slate-400 hover:text-white transition-colors disabled:opacity-50">
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Eye}           label="Total Page Views"    value={total}  sub="All time"              color={TEAL}   />
        <StatCard icon={Users}         label="Unique Visitors"     value={unique} sub={`Last ${windowLabel}`} color={GOLD}   />
        <StatCard icon={MousePointer}  label="Views Today"         value={today}  sub="Since midnight"        color={PURPLE} />
        <StatCard icon={TrendingUp}    label="Days in Window"      value={window} sub={windowLabel}           color={EMERALD}/>
      </div>

      {/* Events by Type (Area Chart — matching screenshot) */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="glass rounded-2xl p-6 border border-white/5">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-white font-bold">Events</h2>
          <span className="text-slate-500 text-xs">BY TYPE ({windowLabel.toUpperCase()})</span>
        </div>
        <p className="text-slate-500 text-xs mb-5">Page views over time</p>
        {eventsByType.length === 0 ? (
          <div className="h-48 flex flex-col items-center justify-center text-slate-600">
            <Calendar className="w-8 h-8 mb-2 opacity-50" />
            <p className="text-sm">No events tracked yet — tracking starts as visitors browse.</p>
          </div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={eventsByType} margin={{ top: 5, right: 5, bottom: 0, left: -15 }}>
                <defs>
                  <linearGradient id="gradEvents" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={TEAL} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={TEAL} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="Events" stroke={TEAL} fill="url(#gradEvents)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
              <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded inline-block" style={{ background: TEAL }} />Page views</span>
            </div>
          </>
        )}
      </motion.div>

      {/* Page Views trend + Top Pages side-by-side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Page Views with Unique overlay */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="glass rounded-2xl p-6 border border-white/5">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-white font-bold">Page Views</h2>
            <span className="text-slate-500 text-xs">{windowLabel.toUpperCase()}</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
            <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 rounded-full inline-block" style={{ background: TEAL }} />Total</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 rounded-full inline-block" style={{ background: GOLD }} />Unique Sessions</span>
          </div>
          {chartData.length === 0
            ? <div className="h-40 flex items-center justify-center text-slate-600 text-sm">No data for this window yet.</div>
            : (
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 0, left: -15 }}>
                  <defs>
                    <linearGradient id="gV" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={TEAL} stopOpacity={0.3} /><stop offset="95%" stopColor={TEAL} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gU" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={GOLD} stopOpacity={0.3} /><stop offset="95%" stopColor={GOLD} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="date" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="Views" stroke={TEAL} fill="url(#gV)" strokeWidth={2} dot={false} />
                  <Area type="monotone" dataKey="Unique" stroke={GOLD} fill="url(#gU)" strokeWidth={2} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            )}
        </motion.div>

        {/* Top Pages — numbered list matching screenshot */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-6 border border-white/5">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-white font-bold">Top pages</h2>
            <span className="text-slate-500 text-xs">{windowLabel.toUpperCase()}</span>
          </div>
          <p className="text-slate-500 text-xs mb-4">Most visited pages</p>
          {topPages.length === 0
            ? <div className="text-slate-600 text-sm text-center py-8">No page view data yet.</div>
            : (
              <div className="space-y-1">
                {topPages.slice(0, 8).map((p, i) => {
                  const maxViews = topPages[0].views;
                  const pct = (p.views / maxViews) * 100;
                  const name = p.page_path === "/" ? "Home" : p.page_path;
                  return (
                    <div key={i} className="flex items-center gap-3 py-2 border-b border-white/3 last:border-0">
                      <span className="text-slate-600 text-xs w-4 text-right flex-shrink-0">{i + 1}</span>
                      <span className="text-slate-300 text-xs font-mono flex-1 truncate" title={name}>{name}</span>
                      <div className="w-16 h-1.5 bg-white/5 rounded-full overflow-hidden flex-shrink-0">
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: TEAL }} />
                      </div>
                      <span className="text-white text-xs font-bold w-10 text-right flex-shrink-0">{p.views.toLocaleString()}</span>
                    </div>
                  );
                })}
              </div>
            )}
        </motion.div>
      </div>

      {/* Device Breakdown */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
        className="glass rounded-2xl p-6 border border-white/5">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-white font-bold">Devices</h2>
          <span className="text-slate-500 text-xs">{windowLabel.toUpperCase()}</span>
        </div>
        <p className="text-slate-500 text-xs mb-5">Browser device types</p>
        {devicePieData.length === 0
          ? <div className="text-slate-600 text-sm text-center py-6">No device data yet.</div>
          : (
            <div className="flex items-center gap-8 flex-wrap">
              <PieChart width={140} height={140}>
                <Pie data={devicePieData} cx={65} cy={65} innerRadius={45} outerRadius={65}
                  dataKey="value" paddingAngle={3} strokeWidth={0}>
                  {devicePieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
              </PieChart>
              <div className="flex-1 space-y-3 min-w-[200px]">
                {devicePieData.map((d, i) => {
                  const Icon = DEVICE_ICONS[d.name.toLowerCase()] ?? Globe;
                  const pct = totalDeviceViews > 0 ? Math.round((d.value / totalDeviceViews) * 100) : 0;
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: `${d.color}20` }}>
                        <Icon className="w-4 h-4" style={{ color: d.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-300 font-medium">{d.name}</span>
                          <span className="text-white font-bold">{pct}%</span>
                        </div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: d.color }} />
                        </div>
                      </div>
                      <span className="text-slate-500 text-xs w-8 text-right flex-shrink-0">{d.value}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
      </motion.div>
    </div>
  );
}
