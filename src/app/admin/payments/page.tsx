"use client";

import { useEffect, useState, useCallback, Fragment } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard, DollarSign, TrendingUp, Clock, AlertCircle,
  CheckCircle, FileText, Search, Filter, RefreshCw,
  Download, Plus, X, ChevronDown, Eye, Edit3, Send, ChevronRight,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { logAudit } from "@/lib/audit";

type PaymentStatus = "unpaid" | "paid" | "partial" | "refunded";
type InvoiceStatus = "draft" | "sent" | "paid" | "overdue" | "cancelled";

type RegPayment = {
  id: string;
  name: string;
  email: string;
  organisation: string;
  category: string;
  feeAmount: number;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  createdAt: string;
};

type GatewayAuditRow = {
  id: string;
  createdAt: string;
  details: Record<string, unknown>;
};

type Invoice = {
  id: string;
  invoiceNumber: string;
  payeeName: string;
  payeeEmail: string;
  payeeOrg: string;
  totalUsd: number;
  status: InvoiceStatus;
  dueDate: string | null;
  paidAt: string | null;
  paymentRef: string;
  createdAt: string;
  registrationId: string | null;
};

const STATUS_CONFIG: Record<PaymentStatus, { label: string; color: string; bg: string }> = {
  unpaid:   { label: "Unpaid",   color: "#EF4444", bg: "#EF4444" },
  paid:     { label: "Paid",     color: "#10B981", bg: "#10B981" },
  partial:  { label: "Partial",  color: "#F59E0B", bg: "#F59E0B" },
  refunded: { label: "Refunded", color: "#64748b", bg: "#64748b" },
};

const INV_STATUS: Record<InvoiceStatus, { label: string; color: string }> = {
  draft:     { label: "Draft",     color: "#64748b" },
  sent:      { label: "Sent",      color: "#0EA5E9" },
  paid:      { label: "Paid",      color: "#10B981" },
  overdue:   { label: "Overdue",   color: "#EF4444" },
  cancelled: { label: "Cancelled", color: "#475569" },
};

function usd(cents: number) { return `$${(cents / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}` ;}
function fmtFee(amount: number) { return `$${amount.toLocaleString()}` ;}

export default function PaymentsPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "payments" | "invoices" | "gateway">("overview");
  const [payments, setPayments] = useState<RegPayment[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [gatewayLog, setGatewayLog] = useState<GatewayAuditRow[]>([]);
  const [expandedGatewayId, setExpandedGatewayId] = useState<string | null>(null);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [editPayment, setEditPayment] = useState<RegPayment | null>(null);
  const [editInvoice, setEditInvoice] = useState<Invoice | null>(null);
  const [saving, setSaving]     = useState(false);

  // Summary stats
  const [summary, setSummary] = useState({
    totalExpected: 0, totalCollected: 0, totalOutstanding: 0,
    paid: 0, unpaid: 0, partial: 0,
    totalInvoices: 0, invoicePaid: 0, invoiceOverdue: 0,
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      // Payments from registrations
      const { data: regData } = await supabase.schema("tnf_summit").from("registrations")
        .select("id,first_name,last_name,email,organisation,category,fee_amount,payment_status,payment_method,created_at")
        .neq("status", "cancelled")
        .order("created_at", { ascending: false });

      const regs: RegPayment[] = (regData ?? []).map((r: Record<string, unknown>) => ({
        id: r.id as string,
        name: `${r.first_name} ${r.last_name}`,
        email: r.email as string,
        organisation: (r.organisation as string) ?? "",
        category: (r.category as string) ?? "",
        feeAmount: (r.fee_amount as number) ?? 0,
        paymentStatus: (r.payment_status as PaymentStatus) ?? "unpaid",
        paymentMethod: (r.payment_method as string) ?? "",
        createdAt: r.created_at as string,
      }));
      setPayments(regs);

      // Compute summary
      const totalExpected = regs.reduce((s, r) => s + r.feeAmount, 0);
      const totalCollected = regs.filter(r => r.paymentStatus === "paid").reduce((s, r) => s + r.feeAmount, 0);
      setSummary(prev => ({
        ...prev,
        totalExpected,
        totalCollected,
        totalOutstanding: totalExpected - totalCollected,
        paid:    regs.filter(r => r.paymentStatus === "paid").length,
        unpaid:  regs.filter(r => r.paymentStatus === "unpaid").length,
        partial: regs.filter(r => r.paymentStatus === "partial").length,
      }));

      // Invoices
      const { data: invData } = await supabase.schema("tnf_summit").from("invoices")
        .select("*").order("created_at", { ascending: false });
      const invs: Invoice[] = (invData ?? []).map((r: Record<string, unknown>) => ({
        id: r.id as string,
        invoiceNumber: r.invoice_number as string,
        payeeName: (r.payee_name as string) ?? "",
        payeeEmail: (r.payee_email as string) ?? "",
        payeeOrg: (r.payee_org as string) ?? "",
        totalUsd: (r.total_usd as number) ?? 0,
        status: (r.status as InvoiceStatus) ?? "draft",
        dueDate: r.due_date as string | null,
        paidAt: r.paid_at as string | null,
        paymentRef: (r.payment_ref as string) ?? "",
        createdAt: r.created_at as string,
        registrationId: r.registration_id as string | null,
      }));
      setInvoices(invs);
      setSummary(prev => ({
        ...prev,
        totalInvoices: invs.length,
        invoicePaid:    invs.filter(i => i.status === "paid").length,
        invoiceOverdue: invs.filter(i => i.status === "overdue").length,
      }));

      const { data: gwData } = await supabase.schema("tnf_summit").from("audit_trail")
        .select("id,created_at,details")
        .eq("action", "iveri_gateway_event")
        .order("created_at", { ascending: false })
        .limit(500);
      setGatewayLog(
        (gwData ?? []).map((r: Record<string, unknown>) => ({
          id: r.id as string,
          createdAt: r.created_at as string,
          details: (r.details && typeof r.details === "object" ? r.details : {}) as Record<string, unknown>,
        }))
      );
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleUpdatePaymentStatus = async (id: string, status: PaymentStatus) => {
    setSaving(true);
    await supabase.schema("tnf_summit").from("registrations").update({ payment_status: status }).eq("id", id);
    await logAudit("payment_updated", "registration", payments.find(p => p.id === id)?.name ?? "", id, { payment_status: status });
    setPayments(prev => prev.map(p => p.id === id ? { ...p, paymentStatus: status } : p));
    setEditPayment(null);
    setSaving(false);
  };

  const handleInvoiceStatus = async (id: string, status: InvoiceStatus) => {
    const updates: Record<string, unknown> = { status };
    if (status === "paid") updates.paid_at = new Date().toISOString();
    await supabase.schema("tnf_summit").from("invoices").update(updates).eq("id", id);
    await logAudit("invoice_marked_paid", "invoice", id, id, { status });
    setInvoices(prev => prev.map(i => i.id === id ? { ...i, status } : i));
    setEditInvoice(null);
  };

  const exportCSV = () => {
    const rows = [
      ["Name", "Email", "Organisation", "Category", "Fee (USD)", "Payment Status", "Method", "Date"],
      ...payments.map(p => [p.name, p.email, p.organisation, p.category, p.feeAmount, p.paymentStatus, p.paymentMethod, new Date(p.createdAt).toLocaleDateString()]),
    ];
    const csv = rows.map(r => r.map(c => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "payments.csv"; a.click();
  };

  const filteredPayments = payments.filter(p =>
    (filterStatus === "all" || p.paymentStatus === filterStatus) &&
    (p.name.toLowerCase().includes(search.toLowerCase()) ||
     p.email.toLowerCase().includes(search.toLowerCase()) ||
     p.organisation.toLowerCase().includes(search.toLowerCase()))
  );

  const filteredInvoices = invoices.filter(i =>
    i.payeeName.toLowerCase().includes(search.toLowerCase()) ||
    i.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
    i.payeeEmail.toLowerCase().includes(search.toLowerCase())
  );

  const gatewaySearch = search.toLowerCase();
  const filteredGateway = gatewayLog.filter((row) => {
    if (!gatewaySearch) return true;
    const blob = JSON.stringify(row.details).toLowerCase();
    return blob.includes(gatewaySearch);
  });

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-[#C9921A]" /> Payments & Invoices
          </h1>
          <p className="text-slate-400 text-sm mt-1">Track registration payments and manage invoices</p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="p-2 glass rounded-xl text-slate-400 hover:text-white">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button onClick={exportCSV} className="flex items-center gap-2 glass rounded-xl px-4 py-2 text-sm text-slate-300 hover:text-white border border-white/10">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: DollarSign,   label: "Total Expected", value: fmtFee(summary.totalExpected),   sub: `${payments.length} registrations`, color: "#64748b" },
          { icon: CheckCircle,  label: "Collected",      value: fmtFee(summary.totalCollected),  sub: `${summary.paid} paid`,            color: "#10B981" },
          { icon: AlertCircle,  label: "Outstanding",    value: fmtFee(summary.totalOutstanding), sub: `${summary.unpaid} unpaid`,        color: "#EF4444" },
          { icon: FileText,     label: "Invoices",       value: summary.totalInvoices,            sub: `${summary.invoiceOverdue} overdue`, color: "#C9921A" },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="glass rounded-2xl p-5 border border-white/5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
              style={{ background: `${s.color}20` }}>
              <s.icon className="w-4.5 h-4.5" style={{ color: s.color }} />
            </div>
            <div className="text-xl font-black text-white">{typeof s.value === "number" ? s.value.toLocaleString() : s.value}</div>
            <div className="text-slate-400 text-sm mt-0.5">{s.label}</div>
            <div className="text-slate-600 text-xs mt-0.5">{s.sub}</div>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white/3 rounded-xl p-1 w-fit">
        {([["overview", "Overview"], ["payments", "Payments"], ["gateway", "Card activity"], ["invoices", "Invoices"]] as const).map(([tab, label]) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              activeTab === tab ? "bg-[#C9921A]/15 text-[#F5B730] border border-[#C9921A]/20" : "text-slate-400 hover:text-white"
            }`}>
            {label}
          </button>
        ))}
      </div>

      {/* Search + Filter */}
      {activeTab !== "overview" && (
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={activeTab === "gateway" ? "Search ref, email, status…" : "Search…"}
              className="w-60 bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-[#C9921A]/50"
            />
          </div>
          {activeTab === "payments" && (
            <div className="relative">
              <button onClick={() => setShowFilterMenu(!showFilterMenu)}
                className="flex items-center gap-2 glass rounded-xl px-4 py-2.5 text-sm text-white border border-white/10">
                <Filter className="w-4 h-4 text-slate-400" />
                {filterStatus === "all" ? "All Status" : STATUS_CONFIG[filterStatus as PaymentStatus]?.label}
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>
              {showFilterMenu && (
                <div className="absolute left-0 top-full mt-2 w-40 bg-[var(--bg-surface)] border border-white/10 rounded-xl shadow-xl z-20 overflow-hidden">
                  {["all", "unpaid", "paid", "partial", "refunded"].map(s => (
                    <button key={s} onClick={() => { setFilterStatus(s); setShowFilterMenu(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors capitalize ${filterStatus === s ? "text-[#F5B730] bg-[#C9921A]/10" : "text-slate-300 hover:bg-white/5"}`}>
                      {s === "all" ? "All Status" : STATUS_CONFIG[s as PaymentStatus]?.label ?? s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-8 h-8 border-2 border-[#C9921A]/30 border-t-[#C9921A] rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Payment Status Breakdown */}
              <div className="glass rounded-2xl p-6 border border-white/5">
                <h3 className="text-white font-bold mb-4">Payment Status Breakdown</h3>
                {[
                  { label: "Paid",    count: summary.paid,    total: payments.length, color: "#10B981" },
                  { label: "Unpaid",  count: summary.unpaid,  total: payments.length, color: "#EF4444" },
                  { label: "Partial", count: summary.partial, total: payments.length, color: "#F59E0B" },
                ].map(s => (
                  <div key={s.label} className="mb-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300">{s.label}</span>
                      <span className="text-white font-bold">{s.count} <span className="text-slate-500">/ {s.total}</span></span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: s.total > 0 ? `${(s.count / s.total) * 100}%` : "0%", background: s.color }} />
                    </div>
                  </div>
                ))}
              </div>
              {/* Revenue */}
              <div className="glass rounded-2xl p-6 border border-white/5">
                <h3 className="text-white font-bold mb-4">Revenue Summary</h3>
                {[
                  { label: "Total Expected", value: fmtFee(summary.totalExpected), color: "#64748b" },
                  { label: "Collected",      value: fmtFee(summary.totalCollected), color: "#10B981" },
                  { label: "Outstanding",    value: fmtFee(summary.totalOutstanding), color: "#EF4444" },
                ].map(r => (
                  <div key={r.label} className="flex justify-between items-center py-3 border-b border-white/5 last:border-0">
                    <span className="text-slate-400 text-sm">{r.label}</span>
                    <span className="font-black text-lg" style={{ color: r.color }}>{r.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* iVeri card gateway log (from audit_trail; same data as [iveri-cert] server logs) */}
          {activeTab === "gateway" && (
            <div className="space-y-3">
              <p className="text-slate-500 text-sm">
                Each row is a saved <code className="text-[#C9921A]/90">iveri_start</code> or{" "}
                <code className="text-[#C9921A]/90">iveri_return</code> step. Requires{" "}
                <code className="text-slate-400">SUPABASE_SERVICE_ROLE_KEY</code> on the server so events can be stored. Expand a row for full JSON.
              </p>
              <div className="glass rounded-2xl border border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/5">
                        {["Time", "Step", "Registration ref", "Authorised", "DB → paid", "Note", ""].map((h) => (
                          <th key={h} className="text-left px-4 py-3 text-slate-400 text-xs font-semibold uppercase tracking-wide whitespace-nowrap">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredGateway.map((row) => {
                        const d = row.details;
                        const ev = String(d.event ?? "");
                        const ref = String(d.registrationRef ?? "");
                        const ok = d.success === true;
                        const db = d.dbPaymentStatusUpdated === true;
                        const desc = String(d.description ?? d.authoriseInfoError ?? "").slice(0, 80);
                        return (
                          <Fragment key={row.id}>
                            <tr className="border-b border-white/3 hover:bg-white/2">
                              <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                                {new Date(row.createdAt).toLocaleString()}
                              </td>
                              <td className="px-4 py-3">
                                <span className="text-[#C9921A] font-mono text-xs">{ev || "—"}</span>
                              </td>
                              <td className="px-4 py-3 text-white font-mono text-xs max-w-[140px] truncate" title={ref}>
                                {ref || "—"}
                              </td>
                              <td className="px-4 py-3">
                                {ev === "iveri_return" ? (
                                  <span className={`text-xs font-bold ${ok ? "text-emerald-400" : "text-slate-500"}`}>
                                    {ok ? "Yes" : "No"}
                                  </span>
                                ) : (
                                  <span className="text-slate-600">—</span>
                                )}
                              </td>
                              <td className="px-4 py-3">
                                {ev === "iveri_return" ? (
                                  <span className={`text-xs font-bold ${db ? "text-emerald-400" : "text-slate-500"}`}>
                                    {db ? "Yes" : "No"}
                                  </span>
                                ) : (
                                  <span className="text-slate-600">—</span>
                                )}
                              </td>
                              <td className="px-4 py-3 text-slate-500 text-xs max-w-[200px] truncate" title={desc}>
                                {desc || "—"}
                              </td>
                              <td className="px-4 py-3">
                                <button
                                  type="button"
                                  onClick={() => setExpandedGatewayId((id) => (id === row.id ? null : row.id))}
                                  className="p-1 text-slate-400 hover:text-[#C9921A]"
                                  aria-label="Toggle details"
                                >
                                  <ChevronRight className={`w-4 h-4 transition-transform ${expandedGatewayId === row.id ? "rotate-90" : ""}`} />
                                </button>
                              </td>
                            </tr>
                            {expandedGatewayId === row.id && (
                              <tr className="bg-black/20">
                                <td colSpan={7} className="px-4 py-3">
                                  <pre className="text-xs text-slate-400 overflow-x-auto max-h-64 overflow-y-auto font-mono p-3 rounded-lg bg-white/3 border border-white/5">
                                    {JSON.stringify(d, null, 2)}
                                  </pre>
                                </td>
                              </tr>
                            )}
                          </Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                {filteredGateway.length === 0 && (
                  <div className="text-center py-12 text-slate-600 text-sm">
                    {gatewayLog.length === 0
                      ? "No card gateway events yet. Complete a test payment with card — entries appear after /api/payments/iveri/start and /return run."
                      : "No rows match your search."}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Payments Tab */}
          {activeTab === "payments" && (
            <div className="glass rounded-2xl border border-white/5 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/5">
                      {["Delegate", "Organisation", "Fee", "Status", "Method", "Date", ""].map(h => (
                        <th key={h} className="text-left px-5 py-3.5 text-slate-400 text-xs font-semibold uppercase tracking-wide whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPayments.map(p => {
                      const cfg = STATUS_CONFIG[p.paymentStatus];
                      return (
                        <tr key={p.id} className="border-b border-white/3 last:border-0 hover:bg-white/2">
                          <td className="px-5 py-3.5">
                            <p className="text-white text-sm font-semibold">{p.name}</p>
                            <p className="text-slate-500 text-xs">{p.email}</p>
                          </td>
                          <td className="px-5 py-3.5 text-slate-400 text-sm">{p.organisation || "—"}</td>
                          <td className="px-5 py-3.5 text-white font-bold text-sm">{fmtFee(p.feeAmount)}</td>
                          <td className="px-5 py-3.5">
                            <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                              style={{ background: `${cfg.bg}20`, color: cfg.color }}>
                              {cfg.label}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-slate-400 text-xs">{p.paymentMethod || "—"}</td>
                          <td className="px-5 py-3.5 text-slate-500 text-xs">{new Date(p.createdAt).toLocaleDateString()}</td>
                          <td className="px-5 py-3.5">
                            <button onClick={() => setEditPayment(p)} className="p-1.5 text-slate-400 hover:text-[#C9921A]"><Edit3 className="w-3.5 h-3.5" /></button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {filteredPayments.length === 0 && (
                  <div className="text-center py-12 text-slate-600 text-sm">No payments found.</div>
                )}
              </div>
            </div>
          )}

          {/* Invoices Tab */}
          {activeTab === "invoices" && (
            <div className="glass rounded-2xl border border-white/5 overflow-hidden">
              <div className="p-4 border-b border-white/5 flex justify-end">
                <div className="text-slate-500 text-xs">
                  Invoice generation: select a registration and click "Generate Invoice" — coming with PDF export.
                </div>
              </div>
              {invoices.length === 0 ? (
                <div className="text-center py-16 text-slate-600">
                  <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No invoices yet. Invoices are auto-generated when a registration is confirmed.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/5">
                        {["Invoice #", "Payee", "Amount", "Status", "Due Date", ""].map(h => (
                          <th key={h} className="text-left px-5 py-3.5 text-slate-400 text-xs font-semibold uppercase tracking-wide">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredInvoices.map(inv => {
                        const cfg = INV_STATUS[inv.status];
                        return (
                          <tr key={inv.id} className="border-b border-white/3 last:border-0 hover:bg-white/2">
                            <td className="px-5 py-3.5 text-[#C9921A] font-mono text-sm font-bold">{inv.invoiceNumber}</td>
                            <td className="px-5 py-3.5">
                              <p className="text-white text-sm font-medium">{inv.payeeName}</p>
                              <p className="text-slate-500 text-xs">{inv.payeeEmail}</p>
                            </td>
                            <td className="px-5 py-3.5 text-white font-bold">{usd(inv.totalUsd)}</td>
                            <td className="px-5 py-3.5">
                              <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                                style={{ background: `${cfg.color}20`, color: cfg.color }}>{cfg.label}</span>
                            </td>
                            <td className="px-5 py-3.5 text-slate-500 text-xs">
                              {inv.dueDate ? new Date(inv.dueDate).toLocaleDateString() : "—"}
                            </td>
                            <td className="px-5 py-3.5">
                              <div className="flex gap-1">
                                <button onClick={() => setEditInvoice(inv)} className="p-1.5 text-slate-400 hover:text-[#C9921A]"><Edit3 className="w-3.5 h-3.5" /></button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Edit Payment Modal */}
      <AnimatePresence>
        {editPayment && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="glass rounded-2xl p-6 w-full max-w-sm border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-bold">Update Payment</h3>
                <button onClick={() => setEditPayment(null)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <div>
                <p className="text-white font-semibold">{editPayment.name}</p>
                <p className="text-slate-400 text-sm">{editPayment.email}</p>
                <p className="text-[#C9921A] font-black text-lg mt-1">{fmtFee(editPayment.feeAmount)}</p>
              </div>
              <div>
                <label className="text-slate-400 text-xs font-semibold uppercase tracking-wide mb-2 block">Payment Status</label>
                <div className="grid grid-cols-2 gap-2">
                  {(["unpaid", "paid", "partial", "refunded"] as PaymentStatus[]).map(s => {
                    const cfg = STATUS_CONFIG[s];
                    return (
                      <button key={s} onClick={() => handleUpdatePaymentStatus(editPayment.id, s)} disabled={saving}
                        className={`py-2.5 rounded-xl text-sm font-bold border transition-colors ${
                          editPayment.paymentStatus === s
                            ? `border-transparent text-white`
                            : "glass border-white/10 text-slate-400 hover:text-white"
                        }`}
                        style={editPayment.paymentStatus === s ? { background: `${cfg.bg}30`, borderColor: `${cfg.color}40`, color: cfg.color } : {}}>
                        {cfg.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Invoice Status Modal */}
      <AnimatePresence>
        {editInvoice && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="glass rounded-2xl p-6 w-full max-w-sm border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-bold">{editInvoice.invoiceNumber}</h3>
                <button onClick={() => setEditInvoice(null)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <p className="text-slate-300">{editInvoice.payeeName} · {usd(editInvoice.totalUsd)}</p>
              <div>
                <label className="text-slate-400 text-xs font-semibold uppercase tracking-wide mb-2 block">Invoice Status</label>
                <div className="grid grid-cols-2 gap-2">
                  {(["draft", "sent", "paid", "overdue", "cancelled"] as InvoiceStatus[]).map(s => {
                    const cfg = INV_STATUS[s];
                    return (
                      <button key={s} onClick={() => handleInvoiceStatus(editInvoice.id, s)}
                        className={`py-2.5 rounded-xl text-sm font-bold border transition-colors ${
                          editInvoice.status === s ? `border-transparent` : "glass border-white/10 text-slate-400 hover:text-white"
                        }`}
                        style={editInvoice.status === s ? { background: `${cfg.color}25`, borderColor: `${cfg.color}40`, color: cfg.color } : {}}>
                        {cfg.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
