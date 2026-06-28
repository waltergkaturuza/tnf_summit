"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import * as db from "@/lib/db";
import type { Registration, Donation, ContactMessage, NewsletterSubscriber, Speaker, Update, Abstract, InnovationApplication, AbstractReviewer, AbstractAssignment, AbstractReview } from "@/lib/adminData";

type AdminContextType = {
  isAuthenticated: boolean;
  authLoading: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;

  registrations: Registration[];
  regsLoading: boolean;
  updateRegistration: (id: string, updates: Partial<Registration>) => Promise<void>;
  deleteRegistration: (id: string) => Promise<void>;
  refreshRegistrations: () => Promise<void>;

  donations: Donation[];
  donationsLoading: boolean;
  updateDonation: (id: string, updates: Partial<Donation>) => Promise<void>;
  refreshDonations: () => Promise<void>;

  messages: ContactMessage[];
  msgsLoading: boolean;
  updateMessage: (id: string, updates: Partial<ContactMessage>) => Promise<void>;
  deleteMessage: (id: string) => Promise<void>;

  subscribers: NewsletterSubscriber[];
  subsLoading: boolean;
  updateSubscriber: (id: string, updates: Partial<NewsletterSubscriber>) => Promise<void>;
  deleteSubscriber: (id: string) => Promise<void>;

  speakers: Speaker[];
  spksLoading: boolean;
  updateSpeaker: (id: string, updates: Partial<Speaker>) => Promise<void>;
  addSpeaker: (speaker: Omit<Speaker, "id" | "addedAt">) => Promise<void>;
  deleteSpeaker: (id: string) => Promise<void>;

  updates: Update[];
  updatesLoading: boolean;
  addUpdate: (u: Omit<Update, "id" | "createdAt" | "updatedAt">) => Promise<Update>;
  updateUpdate: (id: string, updates: Partial<Update>) => Promise<void>;
  deleteUpdate: (id: string) => Promise<void>;
  refreshUpdates: () => Promise<void>;

  abstracts: Abstract[];
  abstractsLoading: boolean;
  updateAbstract: (id: string, updates: Partial<Abstract>) => Promise<void>;
  deleteAbstract: (id: string) => Promise<void>;
  refreshAbstracts: () => Promise<void>;
  abstractReviewers: AbstractReviewer[];
  abstractAssignments: AbstractAssignment[];
  abstractReviews: AbstractReview[];
  abstractReviewLoading: boolean;
  refreshAbstractReviewData: () => Promise<void>;
  assignAbstractReviewers: (abstractId: string, reviewerIds: string[]) => Promise<void>;
  saveAbstractReview: (review: Omit<AbstractReview, "id" | "createdAt" | "updatedAt">) => Promise<void>;

  innovationApplications: InnovationApplication[];
  innovationLoading: boolean;
  updateInnovationApplication: (id: string, updates: Partial<InnovationApplication>) => Promise<void>;
  deleteInnovationApplication: (id: string) => Promise<void>;
  refreshInnovationApplications: () => Promise<void>;
};

const AdminContext = createContext<AdminContextType | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [regsLoading, setRegsLoading] = useState(false);

  const [donations, setDonations] = useState<Donation[]>([]);
  const [donationsLoading, setDonationsLoading] = useState(false);

  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [msgsLoading, setMsgsLoading] = useState(false);

  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [subsLoading, setSubsLoading] = useState(false);

  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [spksLoading, setSpksLoading] = useState(false);

  const [updates, setUpdates] = useState<Update[]>([]);
  const [updatesLoading, setUpdatesLoading] = useState(false);

  const [abstracts, setAbstracts] = useState<Abstract[]>([]);
  const [abstractsLoading, setAbstractsLoading] = useState(false);
  const [abstractReviewers, setAbstractReviewers] = useState<AbstractReviewer[]>([]);
  const [abstractAssignments, setAbstractAssignments] = useState<AbstractAssignment[]>([]);
  const [abstractReviews, setAbstractReviews] = useState<AbstractReview[]>([]);
  const [abstractReviewLoading, setAbstractReviewLoading] = useState(false);

  const [innovationApplications, setInnovationApplications] = useState<InnovationApplication[]>([]);
  const [innovationLoading, setInnovationLoading] = useState(false);

  // ── Auth state from Supabase ──────────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setIsAuthenticated(!!data.session);
      setAuthLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      setAuthLoading(false);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  // ── Load data once authenticated ─────────────────────────────────────────
  useEffect(() => {
    if (!isAuthenticated) return;
    loadAll();
  }, [isAuthenticated]);

  const loadAll = async () => {
    setRegsLoading(true);
    setMsgsLoading(true);
    setSubsLoading(true);
    setSpksLoading(true);
    setUpdatesLoading(true);
    setAbstractsLoading(true);
    setInnovationLoading(true);

    setDonationsLoading(true);

    try {
      const [regs, dons, msgs, subs, spks, upds, abs, innov] = await Promise.all([
        db.fetchRegistrations(),
        db.fetchDonations().catch((e) => {
          console.warn("Donations table may be missing; run Supabase migration:", e);
          return [] as Donation[];
        }),
        db.fetchMessages(),
        db.fetchSubscribers(),
        db.fetchSpeakers(),
        db.fetchUpdates(),
        db.fetchAbstracts(),
        db.fetchInnovationApplications().catch((e) => {
          console.warn("Innovation applications table may be missing; run Supabase migration:", e);
          return [] as InnovationApplication[];
        }),
      ]);
      setRegistrations(regs);
      setDonations(dons);
      setMessages(msgs);
      setSubscribers(subs);
      setSpeakers(spks);
      setUpdates(upds);
      setAbstracts(abs);
      setInnovationApplications(innov);
      void refreshAbstractReviewDataInternal();
    } catch (err) {
      console.error("Failed to load admin data:", err);
    } finally {
      setRegsLoading(false);
      setDonationsLoading(false);
      setMsgsLoading(false);
      setSubsLoading(false);
      setSpksLoading(false);
      setUpdatesLoading(false);
      setAbstractsLoading(false);
      setInnovationLoading(false);
    }
  };

  // ── Auth ──────────────────────────────────────────────────────────────────
  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { ok: false, error: error.message };
    await db.insertAuditLog("login", { entityType: "auth", performedBy: email });
    return { ok: true };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setRegistrations([]);
    setDonations([]);
    setMessages([]);
    setSubscribers([]);
    setSpeakers([]);
    setUpdates([]);
    setAbstracts([]);
    setInnovationApplications([]);
  };

  // ── Registrations ─────────────────────────────────────────────────────────
  const refreshRegistrations = useCallback(async () => {
    setRegsLoading(true);
    try { setRegistrations(await db.fetchRegistrations()); }
    finally { setRegsLoading(false); }
  }, []);

  const updateRegistration = async (id: string, updates: Partial<Registration>) => {
    await db.updateRegistration(id, updates);
    setRegistrations(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  const deleteRegistration = async (id: string) => {
    await db.deleteRegistration(id);
    setRegistrations(prev => prev.filter(r => r.id !== id));
  };

  const refreshDonations = useCallback(async () => {
    setDonationsLoading(true);
    try { setDonations(await db.fetchDonations()); }
    finally { setDonationsLoading(false); }
  }, []);

  const updateDonation = async (id: string, updates: Partial<Donation>) => {
    await db.updateDonation(id, updates);
    setDonations(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d));
  };

  // ── Messages ──────────────────────────────────────────────────────────────
  const updateMessage = async (id: string, updates: Partial<ContactMessage>) => {
    await db.updateMessage(id, updates);
    setMessages(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
  };

  const deleteMessage = async (id: string) => {
    await db.deleteMessage(id);
    setMessages(prev => prev.filter(m => m.id !== id));
  };

  // ── Subscribers ───────────────────────────────────────────────────────────
  const updateSubscriber = async (id: string, updates: Partial<NewsletterSubscriber>) => {
    await db.updateSubscriber(id, updates);
    setSubscribers(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const deleteSubscriber = async (id: string) => {
    await db.deleteSubscriber(id);
    setSubscribers(prev => prev.filter(s => s.id !== id));
  };

  // ── Speakers ──────────────────────────────────────────────────────────────
  const updateSpeaker = async (id: string, updates: Partial<Speaker>) => {
    await db.updateSpeaker(id, updates);
    const { data } = await supabase.auth.getSession();
    await db.insertAuditLog("speaker_updated", {
      entityType: "speaker", entityId: id, entityLabel: updates.name ?? speakers.find(s => s.id === id)?.name ?? "",
      performedBy: data.session?.user?.email ?? "system",
    });
    setSpeakers(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const addSpeaker = async (speaker: Omit<Speaker, "id" | "addedAt">) => {
    await db.insertSpeaker(speaker);
    const list = await db.fetchSpeakers();
    const added = list.find(s => s.name === speaker.name && s.organisation === speaker.organisation);
    if (added) {
      const { data } = await supabase.auth.getSession();
      await db.insertAuditLog("speaker_created", {
        entityType: "speaker", entityId: added.id, entityLabel: speaker.name,
        performedBy: data.session?.user?.email ?? "system",
      });
    }
    setSpeakers(list);
  };

  const deleteSpeaker = async (id: string) => {
    const prev = speakers.find(s => s.id === id);
    await db.deleteSpeaker(id);
    const { data } = await supabase.auth.getSession();
    await db.insertAuditLog("speaker_deleted", {
      entityType: "speaker", entityId: id, entityLabel: prev?.name ?? "",
      performedBy: data.session?.user?.email ?? "system",
    });
    setSpeakers(prevList => prevList.filter(s => s.id !== id));
  };

  // ── Updates & News ────────────────────────────────────────────────────────
  const refreshUpdates = useCallback(async () => {
    setUpdatesLoading(true);
    try { setUpdates(await db.fetchUpdates()); }
    finally { setUpdatesLoading(false); }
  }, []);

  const addUpdate = async (u: Omit<Update, "id" | "createdAt" | "updatedAt">) => {
    const created = await db.insertUpdate(u);
    const { data } = await supabase.auth.getSession();
    await db.insertAuditLog("update_created", {
      entityType: "update", entityId: created.id, entityLabel: created.title,
      performedBy: data.session?.user?.email ?? "system",
    });
    setUpdates(prev => [created, ...prev]);
    return created;
  };

  const updateUpdate = async (id: string, upd: Partial<Update>) => {
    await db.updateUpdate(id, upd);
    const { data } = await supabase.auth.getSession();
    const label = upd.title ?? updates.find(u => u.id === id)?.title ?? "";
    await db.insertAuditLog("update_updated", {
      entityType: "update", entityId: id, entityLabel: label,
      performedBy: data.session?.user?.email ?? "system",
    });
    setUpdates(prev => prev.map(u => u.id === id ? { ...u, ...upd } : u));
  };

  const deleteUpdate = async (id: string) => {
    const prev = updates.find(u => u.id === id);
    await db.deleteUpdate(id);
    const { data } = await supabase.auth.getSession();
    await db.insertAuditLog("update_deleted", {
      entityType: "update", entityId: id, entityLabel: prev?.title ?? "",
      performedBy: data.session?.user?.email ?? "system",
    });
    setUpdates(prevList => prevList.filter(u => u.id !== id));
  };

  // ── Abstracts ─────────────────────────────────────────────────────────────
  const refreshAbstracts = useCallback(async () => {
    setAbstractsLoading(true);
    try { setAbstracts(await db.fetchAbstracts()); }
    finally { setAbstractsLoading(false); }
  }, []);

  const updateAbstract = async (id: string, updates: Partial<Abstract>) => {
    await db.updateAbstract(id, updates);
    setAbstracts(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
  };

  const deleteAbstract = async (id: string) => {
    await db.deleteAbstract(id);
    setAbstracts(prev => prev.filter(a => a.id !== id));
  };

  const refreshAbstractReviewDataInternal = async () => {
    setAbstractReviewLoading(true);
    try {
      const [reviewers, assignments, reviews] = await Promise.all([
        db.fetchAbstractReviewers().catch(() => [] as AbstractReviewer[]),
        db.fetchAbstractAssignments().catch(() => [] as AbstractAssignment[]),
        db.fetchAbstractReviews().catch(() => [] as AbstractReview[]),
      ]);
      setAbstractReviewers(reviewers);
      setAbstractAssignments(assignments);
      setAbstractReviews(reviews);
    } finally {
      setAbstractReviewLoading(false);
    }
  };

  const refreshAbstractReviewData = useCallback(async () => {
    await refreshAbstractReviewDataInternal();
  }, []);

  const assignAbstractReviewers = async (abstractId: string, reviewerIds: string[]) => {
    await db.assignAbstractReviewers(abstractId, reviewerIds);
    const assignments = await db.fetchAbstractAssignments();
    setAbstractAssignments(assignments);
  };

  const saveAbstractReview = async (review: Omit<AbstractReview, "id" | "createdAt" | "updatedAt">) => {
    const saved = await db.upsertAbstractReview(review);
    setAbstractReviews((prev) => {
      const rest = prev.filter((r) => !(r.abstractId === saved.abstractId && r.reviewerId === saved.reviewerId));
      return [...rest, saved];
    });
  };

  const refreshInnovationApplications = useCallback(async () => {
    setInnovationLoading(true);
    try { setInnovationApplications(await db.fetchInnovationApplications()); }
    finally { setInnovationLoading(false); }
  }, []);

  const updateInnovationApplication = async (id: string, updates: Partial<InnovationApplication>) => {
    await db.updateInnovationApplication(id, updates);
    setInnovationApplications(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
  };

  const deleteInnovationApplication = async (id: string) => {
    await db.deleteInnovationApplication(id);
    setInnovationApplications(prev => prev.filter(a => a.id !== id));
  };

  return (
    <AdminContext.Provider value={{
      isAuthenticated, authLoading, login, logout,
      registrations, regsLoading, updateRegistration, deleteRegistration, refreshRegistrations,
      donations, donationsLoading, updateDonation, refreshDonations,
      messages, msgsLoading, updateMessage, deleteMessage,
      subscribers, subsLoading, updateSubscriber, deleteSubscriber,
      speakers, spksLoading, updateSpeaker, addSpeaker, deleteSpeaker,
      updates, updatesLoading, addUpdate, updateUpdate, deleteUpdate, refreshUpdates,
      abstracts, abstractsLoading, updateAbstract, deleteAbstract, refreshAbstracts,
      abstractReviewers, abstractAssignments, abstractReviews, abstractReviewLoading,
      refreshAbstractReviewData, assignAbstractReviewers, saveAbstractReview,
      innovationApplications, innovationLoading, updateInnovationApplication, deleteInnovationApplication, refreshInnovationApplications,
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used inside AdminProvider");
  return ctx;
}
