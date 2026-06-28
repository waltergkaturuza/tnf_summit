"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Plus, Edit3, Trash2, X, Shield, Eye, Check,
  UserCheck, UserX, RefreshCw, Mail, Search, Crown, GraduationCap,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { logAudit } from "@/lib/audit";

type AdminRole = "super_admin" | "admin" | "editor" | "viewer" | "reviewer";

type AdminUser = {
  id: string;
  email: string;
  fullName: string;
  role: AdminRole;
  department: string;
  institution: string;
  isActive: boolean;
  createdAt: string;
  lastSeenAt: string | null;
};

const ROLE_CONFIG: Record<AdminRole, { label: string; color: string; bg: string; icon: React.ElementType; perms: string[] }> = {
  super_admin: {
    label: "Super Admin", color: "#F5B730", bg: "#C9921A",
    icon: Crown,
    perms: ["Full access to everything, including user management and site settings"],
  },
  admin: {
    label: "Admin", color: "#0EA5E9", bg: "#0EA5E9",
    icon: Shield,
    perms: ["Manage registrations, speakers, sponsors, messages", "Upload media, view analytics", "Cannot manage users or delete data"],
  },
  editor: {
    label: "Editor", color: "#10B981", bg: "#10B981",
    icon: Edit3,
    perms: ["Update speaker bios, programme info", "Manage gallery and documents", "Read-only access to registrations"],
  },
  viewer: {
    label: "Viewer", color: "#8B5CF6", bg: "#8B5CF6",
    icon: Eye,
    perms: ["Read-only access to dashboard and analytics", "Cannot make any changes"],
  },
  reviewer: {
    label: "Reviewer", color: "#F59E0B", bg: "#F59E0B",
    icon: GraduationCap,
    perms: ["Review assigned abstracts using the 1–30 rubric", "Listed on the Abstracts → Reviewers tab"],
  },
};

function RoleBadge({ role }: { role: AdminRole }) {
  const cfg = ROLE_CONFIG[role];
  const Icon = cfg.icon;
  return (
    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
      style={{ background: `${cfg.bg}20`, color: cfg.color }}>
      <Icon className="w-3 h-3" />{cfg.label}
    </span>
  );
}

export default function UsersPage() {
  const [users, setUsers]   = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [editUser, setEditUser] = useState<AdminUser | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<AdminUser | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState("");

  const [form, setForm] = useState({
    email: "", fullName: "", role: "viewer" as AdminRole, department: "", institution: "", password: "",
  });

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.schema("tnf_summit").from("admin_users")
      .select("*").order("created_at", { ascending: false });
    setUsers((data ?? []).map((r: Record<string, unknown>) => ({
      id:         r.id as string,
      email:      r.email as string,
      fullName:   (r.full_name as string) ?? "",
      role:       r.role as AdminRole,
      department: (r.department as string) ?? "",
      institution: (r.institution as string) ?? "",
      isActive:   !!(r.is_active),
      createdAt:  r.created_at as string,
      lastSeenAt: r.last_seen_at as string | null,
    })));
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = users.filter(u =>
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.fullName.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = async () => {
    if (!form.email || !form.fullName) { setError("Email and name are required."); return; }
    setSaving(true); setError("");
    try {
      // Create Supabase auth user
      const { data: authData, error: authErr } = await supabase.auth.admin
        ? { data: null, error: { message: "Use Supabase Dashboard to create auth user" } }
        : { data: null, error: null };

      // Insert into admin_users table
      const { error: dbErr } = await supabase.schema("tnf_summit").from("admin_users").insert({
        email: form.email, full_name: form.fullName,
        role: form.role, department: form.department,
        institution: form.role === "reviewer" ? form.institution : "",
      });
      if (dbErr) { setError(dbErr.message); return; }
      await logAudit("user_created", "admin_user", form.fullName, "", { email: form.email, role: form.role });
      setShowAdd(false);
      setForm({ email: "", fullName: "", role: "viewer", department: "", institution: "", password: "" });
      load();
    } finally { setSaving(false); }
  };

  const handleEdit = async () => {
    if (!editUser) return;
    setSaving(true);
    const { error: dbErr } = await supabase.schema("tnf_summit").from("admin_users").update({
      full_name: editUser.fullName, role: editUser.role,
      department: editUser.department,
      institution: editUser.role === "reviewer" ? editUser.institution : "",
      is_active: editUser.isActive,
    }).eq("id", editUser.id);
    if (dbErr) { setError(dbErr.message); setSaving(false); return; }
    await logAudit("user_updated", "admin_user", editUser.fullName, editUser.id, { role: editUser.role });
    setEditUser(null);
    setSaving(false);
    load();
  };

  const handleDelete = async (u: AdminUser) => {
    await supabase.schema("tnf_summit").from("admin_users").delete().eq("id", u.id);
    await logAudit("user_deleted", "admin_user", u.fullName, u.id, { email: u.email });
    setDeleteConfirm(null);
    load();
  };

  const handleToggleActive = async (u: AdminUser) => {
    await supabase.schema("tnf_summit").from("admin_users").update({ is_active: !u.isActive }).eq("id", u.id);
    setUsers(prev => prev.map(x => x.id === u.id ? { ...x, isActive: !x.isActive } : x));
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-[#C9921A]" /> User Management
          </h1>
          <p className="text-slate-400 text-sm mt-1">Manage admin access and roles</p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="p-2 glass rounded-xl text-slate-400 hover:text-white">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 btn-gold px-4 py-2 rounded-xl text-sm font-bold">
            <Plus className="w-4 h-4" /> Add User
          </button>
        </div>
      </div>

      {/* Role legend */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {(Object.entries(ROLE_CONFIG) as [AdminRole, typeof ROLE_CONFIG[AdminRole]][]).map(([role, cfg]) => {
          const Icon = cfg.icon;
          return (
            <div key={role} className="glass rounded-xl p-4 border border-white/5">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${cfg.bg}20` }}>
                  <Icon className="w-3.5 h-3.5" style={{ color: cfg.color }} />
                </div>
                <span className="text-white text-sm font-bold">{cfg.label}</span>
                <span className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: `${cfg.bg}20`, color: cfg.color }}>
                  {users.filter(u => u.role === role).length}
                </span>
              </div>
              <p className="text-slate-500 text-[10px] leading-relaxed">{cfg.perms[0]}</p>
            </div>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users…"
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-[#C9921A]/50" />
      </div>

      {/* Users table */}
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-8 h-8 border-2 border-[#C9921A]/30 border-t-[#C9921A] rounded-full animate-spin" />
        </div>
      ) : (
        <div className="glass rounded-2xl border border-white/5 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-5 py-3.5 text-slate-400 text-xs font-semibold uppercase tracking-wide">User</th>
                <th className="text-left px-5 py-3.5 text-slate-400 text-xs font-semibold uppercase tracking-wide hidden md:table-cell">Role</th>
                <th className="text-left px-5 py-3.5 text-slate-400 text-xs font-semibold uppercase tracking-wide hidden lg:table-cell">Dept / Institution</th>
                <th className="text-left px-5 py-3.5 text-slate-400 text-xs font-semibold uppercase tracking-wide hidden lg:table-cell">Last Seen</th>
                <th className="text-left px-5 py-3.5 text-slate-400 text-xs font-semibold uppercase tracking-wide">Status</th>
                <th className="px-5 py-3.5" />
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id} className="border-b border-white/3 last:border-0 hover:bg-white/2 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-sm"
                        style={{ background: `${ROLE_CONFIG[u.role].bg}20`, color: ROLE_CONFIG[u.role].color }}>
                        {u.fullName.charAt(0) || u.email.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-white text-sm font-semibold">{u.fullName || "-"}</p>
                        <p className="text-slate-500 text-xs">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell"><RoleBadge role={u.role} /></td>
                  <td className="px-5 py-4 text-slate-400 text-sm hidden lg:table-cell">
                    {u.role === "reviewer" ? (u.institution || u.department || "-") : (u.department || "-")}
                  </td>
                  <td className="px-5 py-4 text-slate-500 text-xs hidden lg:table-cell">
                    {u.lastSeenAt ? new Date(u.lastSeenAt).toLocaleDateString() : "Never"}
                  </td>
                  <td className="px-5 py-4">
                    <button onClick={() => handleToggleActive(u)}
                      className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-bold transition-colors ${
                        u.isActive ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400"
                      }`}>
                      {u.isActive ? <><UserCheck className="w-3 h-3" />Active</> : <><UserX className="w-3 h-3" />Inactive</>}
                    </button>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1 justify-end">
                      <button onClick={() => setEditUser({ ...u })} className="p-1.5 text-slate-400 hover:text-[#C9921A] transition-colors"><Edit3 className="w-3.5 h-3.5" /></button>
                      <button onClick={() => setDeleteConfirm(u)} className="p-1.5 text-slate-400 hover:text-red-400 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-slate-600">
              <Users className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No users found.</p>
            </div>
          )}
        </div>
      )}

      {/* Setup note */}
      <div className="glass rounded-xl p-4 border border-[#C9921A]/20">
        <p className="text-[#C9921A] text-xs font-bold mb-1 flex items-center gap-2"><Shield className="w-3.5 h-3.5" />Important. Creating login access</p>
        <p className="text-slate-400 text-xs leading-relaxed">
          Adding a user here grants them a role in the system. To give them login access, also create their account in{" "}
          <strong className="text-white">Supabase Dashboard → Authentication → Users → Add User</strong>.
          Use the same email address. They will receive a password reset email to set their password.
        </p>
      </div>

      {/* Add User Modal */}
      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="glass rounded-2xl p-6 w-full max-w-md border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-bold">Add Admin User</h3>
                <button onClick={() => { setShowAdd(false); setError(""); }} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              {[
                { label: "Full Name *", field: "fullName", type: "text", ph: "e.g. Tendai Moyo" },
                { label: "Email Address *", field: "email", type: "email", ph: "user@tnfzim.com" },
                { label: "Department", field: "department", type: "text", ph: "e.g. Communications" },
              ].map(f => (
                <div key={f.field}>
                  <label className="text-slate-400 text-xs font-semibold uppercase tracking-wide mb-1.5 block">{f.label}</label>
                  <input type={f.type} placeholder={f.ph}
                    value={(form as Record<string, string>)[f.field]}
                    onChange={e => setForm(p => ({ ...p, [f.field]: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-[#C9921A]/60" />
                </div>
              ))}
              {form.role === "reviewer" && (
                <div>
                  <label className="text-slate-400 text-xs font-semibold uppercase tracking-wide mb-1.5 block">Institution / University</label>
                  <input type="text" placeholder="e.g. University of Zimbabwe"
                    value={form.institution}
                    onChange={(e) => setForm((p) => ({ ...p, institution: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-[#C9921A]/60" />
                </div>
              )}
              <div>
                <label className="text-slate-400 text-xs font-semibold uppercase tracking-wide mb-1.5 block">Role</label>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.entries(ROLE_CONFIG) as [AdminRole, typeof ROLE_CONFIG[AdminRole]][]).map(([role, cfg]) => {
                    const Icon = cfg.icon;
                    return (
                      <button key={role} type="button" onClick={() => setForm(p => ({ ...p, role }))}
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold border transition-colors ${
                          form.role === role ? "border-[#C9921A]/40 bg-[#C9921A]/10 text-[#F5B730]" : "border-white/10 glass text-slate-400 hover:text-white"
                        }`}>
                        <Icon className="w-3.5 h-3.5" />{cfg.label}
                      </button>
                    );
                  })}
                </div>
              </div>
              {error && <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-xl p-3">{error}</p>}
              <div className="flex gap-3 pt-1">
                <button onClick={() => { setShowAdd(false); setError(""); }} className="flex-1 glass py-2.5 rounded-xl text-sm text-slate-300 hover:text-white">Cancel</button>
                <button onClick={handleAdd} disabled={saving} className="flex-1 btn-gold py-2.5 rounded-xl text-sm font-bold disabled:opacity-50">
                  {saving ? "Adding…" : "Add User"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {editUser && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="glass rounded-2xl p-6 w-full max-w-md border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-bold">Edit User</h3>
                <button onClick={() => setEditUser(null)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <div>
                <label className="text-slate-400 text-xs font-semibold uppercase tracking-wide mb-1.5 block">Full Name</label>
                <input value={editUser.fullName} onChange={e => setEditUser(u => u ? { ...u, fullName: e.target.value } : u)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#C9921A]/60" />
              </div>
              <div>
                <label className="text-slate-400 text-xs font-semibold uppercase tracking-wide mb-1.5 block">Department</label>
                <input value={editUser.department} onChange={e => setEditUser(u => u ? { ...u, department: e.target.value } : u)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#C9921A]/60" />
              </div>
              {editUser.role === "reviewer" && (
                <div>
                  <label className="text-slate-400 text-xs font-semibold uppercase tracking-wide mb-1.5 block">Institution / University</label>
                  <input value={editUser.institution} onChange={e => setEditUser(u => u ? { ...u, institution: e.target.value } : u)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#C9921A]/60" />
                </div>
              )}
              <div>
                <label className="text-slate-400 text-xs font-semibold uppercase tracking-wide mb-2 block">Role</label>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(ROLE_CONFIG) as AdminRole[]).map(role => {
                    const cfg = ROLE_CONFIG[role];
                    const Icon = cfg.icon;
                    return (
                      <button key={role} onClick={() => setEditUser(u => u ? { ...u, role } : u)}
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold border transition-colors ${
                          editUser.role === role ? "border-[#C9921A]/40 bg-[#C9921A]/10 text-[#F5B730]" : "border-white/10 glass text-slate-400 hover:text-white"
                        }`}>
                        <Icon className="w-3.5 h-3.5" />{cfg.label}
                      </button>
                    );
                  })}
                </div>
              </div>
              {error && <p className="text-red-400 text-xs">{error}</p>}
              <div className="flex gap-3">
                <button onClick={() => setEditUser(null)} className="flex-1 glass py-2.5 rounded-xl text-sm text-slate-300">Cancel</button>
                <button onClick={handleEdit} disabled={saving} className="flex-1 btn-gold py-2.5 rounded-xl text-sm font-bold disabled:opacity-50">
                  {saving ? "Saving…" : "Save Changes"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirm */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="glass rounded-2xl p-6 w-full max-w-sm border border-red-500/20 space-y-4 text-center">
              <div className="w-12 h-12 rounded-xl bg-red-500/15 flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h3 className="text-white font-bold">Remove User?</h3>
                <p className="text-slate-400 text-sm mt-1">
                  <span className="text-white font-medium">{deleteConfirm.fullName}</span> ({deleteConfirm.email}) will lose all admin access. Their Supabase auth account is NOT deleted.
                </p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)} className="flex-1 glass py-2.5 rounded-xl text-sm text-slate-300">Cancel</button>
                <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-xl text-sm font-bold">Remove</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
