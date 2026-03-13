"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend,
} from "recharts";
import {
  BarChart2, Eye, Users, TrendingUp, Monitor, Smartphone, Tablet,
  Globe, RefreshCw, Calendar, MousePointer,
} from "lucide-react";
import { fetchAnalyticsSummary } from "@/lib/analytics";
import type { ViewsPerDay, TopPage, DeviceStat } from "@/lib/analytics";
import { format, parseISO } from "date-fns";

const GOLD   = "#C9921A";
const TEAL   = "#0EA5E9";
const EMERALD = "#10B981";
const PURPLE = "#8B5CF6";

const DEVICE_COLORS: Record<string, string> = {
  desktop: TEAL,
  mobile:  GOLD,
  tablet:  EMERALD,
  unknown: "#475569",
};

const DEVICE_ICONS: Record<string, React.ElementType> = {
  desktop: Monitor,
  mobile:  Smartphone,
  tablet:  Tablet,
  unknown: Globe,
};

function StatCard({ icon: Icon, label, value, sub, color = GOLD }: {
  icon: React.ElementType; label: string; value: number | string; sub?: string; color?: string;
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-5 border border-white/5">
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: `${color}20` }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
      </div>
      <div className="text-2xl font-black text-white mb-0.5">{value.toLocaleString()}</div>
      <div className="text-slate-400 text-sm font-medium">{label}</div>
      {sub && <div className="text-slate-600 text-xs mt-1">{sub}</div>}
    </motion.div>
  );
}

const CustomTooltip = ({ active, payload, label }: {
  active?: boolean; payload?: Array<{ value: number; name: string; color: string }>; label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0D1F3C] border border-white/10 rounded-xl p-3 text-xs shadow-xl">
      <p className="text-slate-400 mb-2">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-semibold">{p.name}: {p.value.toLocaleString()}</p>
      ))}
    </div>
  );
};

export default function AnalyticsPage() {
  const [loading, setLoading]   = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [total, setTotal]       = useState(0);
  const [today, setToday]       = useState(0);
  const [week, setWeek]         = useState(0);
  const [unique, setUnique]     = useState(0);
  const [perDay, setPerDay]     = useState<ViewsPerDay[]>([]);
  const [topPages, setTopPages] = useState<TopPage[]>([]);
  const [devices, setDevices]   = useState<DeviceStat[]>([]);
  const [window14, setWindow14] = useState(30);

  const load = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const stats = await fetchAnalyticsSummary();
      setTotal(stats.total);
      setToday(stats.today);
      setWeek(stats.week);
      setUnique(stats.uniqueVisitors);
      setPerDay(stats.perDay);
      setTopPages(stats.topPages);
      setDevices(stats.devices);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { load(); }, []);

  const chartData = perDay.map(d => ({
    date:    format(parseISO(d.view_date), "d MMM"),
    Views:   d.total_views,
    Unique:  d.unique_sessions,
  }));

  const devicePieData = devices.map(d => ({
    name:  d.device_type.charAt(0).toUpperCase() + d.device_type.slice(1),
    value: d.views,
    color: DEVICE_COLORS[d.device_type] ?? "#475569",
  }));

  const totalDeviceViews = devices.reduce((s, d) => s + d.views, 0);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-[#C9921A]/30 border-t-[#C9921A] rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <BarChart2 className="w-6 h-6 text-[#C9921A]" /> Analytics
          </h1>
          <p className="text-slate-400 text-sm mt-1">Site visitors and interactions</p>
        </div>
        <button onClick={() => load(true)} disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 glass rounded-xl text-slate-400 hover:text-white text-sm transition-colors disabled:opacity-50">
          <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Eye}        label="Total Page Views"   value={total}  sub="All time"      color={TEAL} />
        <StatCard icon={Users}      label="Unique Visitors"    value={unique} sub="Last 14 days"  color={GOLD} />
        <StatCard icon={TrendingUp} label="Views This Week"    value={week}   sub="Last 7 days"   color={EMERALD} />
        <StatCard icon={MousePointer} label="Views Today"      value={today}  sub="Since midnight" color={PURPLE} />
      </div>

      {/* Area Chart — Page Views Over Time */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="glass rounded-2xl p-6 border border-white/5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-white font-bold">Page Views</h2>
            <p className="text-slate-500 text-xs mt-0.5">Last 30 days</p>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 rounded-full inline-block" style={{ background: TEAL }} />Total Views</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 rounded-full inline-block" style={{ background: GOLD }} />Unique Sessions</span>
          </div>
        </div>
        {chartData.length === 0 ? (
          <div className="h-48 flex flex-col items-center justify-center text-slate-600">
            <Calendar className="w-8 h-8 mb-2 opacity-50" />
            <p className="text-sm">No data yet — tracking starts automatically as visitors browse the site.</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 0, left: -10 }}>
              <defs>
                <linearGradient id="gradViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={TEAL} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={TEAL} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradUnique" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={GOLD} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={GOLD} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="Views"  stroke={TEAL} fill="url(#gradViews)"  strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="Unique" stroke={GOLD} fill="url(#gradUnique)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </motion.div>

      {/* Bottom row: Top Pages + Devices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Top Pages */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-6 border border-white/5">
          <h2 className="text-white font-bold mb-1">Top Pages</h2>
          <p className="text-slate-500 text-xs mb-4">Last 14 days</p>
          {topPages.length === 0 ? (
            <div className="text-slate-600 text-sm text-center py-8">No page view data yet.</div>
          ) : (
            <div className="space-y-2.5">
              {topPages.slice(0, 8).map((p, i) => {
                const maxViews = topPages[0].views;
                const pct = (p.views / maxViews) * 100;
                return (
                  <div key={i} className="group">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-slate-300 text-xs font-mono truncate max-w-[200px]">{p.page_path}</span>
                      <span className="text-white text-xs font-bold ml-2 flex-shrink-0">{p.views.toLocaleString()}</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${GOLD}, ${TEAL})` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Device Breakdown */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="glass rounded-2xl p-6 border border-white/5">
          <h2 className="text-white font-bold mb-1">Devices</h2>
          <p className="text-slate-500 text-xs mb-4">Last 14 days</p>
          {devicePieData.length === 0 ? (
            <div className="text-slate-600 text-sm text-center py-8">No device data yet.</div>
          ) : (
            <div className="flex items-center gap-6">
              <PieChart width={140} height={140}>
                <Pie data={devicePieData} cx={65} cy={65} innerRadius={45} outerRadius={65}
                  dataKey="value" paddingAngle={3} strokeWidth={0}>
                  {devicePieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
              </PieChart>
              <div className="flex-1 space-y-3">
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
                      <span className="text-slate-500 text-xs w-10 text-right flex-shrink-0">{d.value}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Bar Chart — Views by Page (top 10) */}
      {topPages.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="glass rounded-2xl p-6 border border-white/5">
          <h2 className="text-white font-bold mb-1">Views by Page</h2>
          <p className="text-slate-500 text-xs mb-5">Top 10 pages — last 14 days</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={topPages.slice(0, 10).map(p => ({ page: p.page_path, Views: p.views }))}
              margin={{ top: 0, right: 0, bottom: 0, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="page" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false}
                tickFormatter={v => v.replace("/", "") || "home"} />
              <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="Views" fill={GOLD} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      )}
    </div>
  );
}
