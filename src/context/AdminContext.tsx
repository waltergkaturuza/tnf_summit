"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import * as db from "@/lib/db";
import type { Registration, ContactMessage, NewsletterSubscriber, Speaker, Update, Abstract } from "@/lib/adminData";

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
};

const AdminContext = createContext<AdminContextType | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [regsLoading, setRegsLoading] = useState(false);

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

    try {
      const [regs, msgs, subs, spks, upds, abs] = await Promise.all([
        db.fetchRegistrations(),
        db.fetchMessages(),
        db.fetchSubscribers(),
        db.fetchSpeakers(),
        db.fetchUpdates(),
        db.fetchAbstracts(),
      ]);
      setRegistrations(regs);
      setMessages(msgs);
      setSubscribers(subs);
      setSpeakers(spks);
      setUpdates(upds);
      setAbstracts(abs);
    } catch (err) {
      console.error("Failed to load admin data:", err);
    } finally {
      setRegsLoading(false);
      setMsgsLoading(false);
      setSubsLoading(false);
      setSpksLoading(false);
      setUpdatesLoading(false);
      setAbstractsLoading(false);
    }
  };

  // ── Auth ──────────────────────────────────────────────────────────────────
  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setRegistrations([]);
    setMessages([]);
    setSubscribers([]);
    setSpeakers([]);
    setUpdates([]);
    setAbstracts([]);
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
    setSpeakers(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const addSpeaker = async (speaker: Omit<Speaker, "id" | "addedAt">) => {
    await db.insertSpeaker(speaker);
    setSpeakers(await db.fetchSpeakers());
  };

  const deleteSpeaker = async (id: string) => {
    await db.deleteSpeaker(id);
    setSpeakers(prev => prev.filter(s => s.id !== id));
  };

  // ── Updates & News ────────────────────────────────────────────────────────
  const refreshUpdates = useCallback(async () => {
    setUpdatesLoading(true);
    try { setUpdates(await db.fetchUpdates()); }
    finally { setUpdatesLoading(false); }
  }, []);

  const addUpdate = async (u: Omit<Update, "id" | "createdAt" | "updatedAt">) => {
    const created = await db.insertUpdate(u);
    setUpdates(prev => [created, ...prev]);
    return created;
  };

  const updateUpdate = async (id: string, updates: Partial<Update>) => {
    await db.updateUpdate(id, updates);
    setUpdates(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
  };

  const deleteUpdate = async (id: string) => {
    await db.deleteUpdate(id);
    setUpdates(prev => prev.filter(u => u.id !== id));
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

  return (
    <AdminContext.Provider value={{
      isAuthenticated, authLoading, login, logout,
      registrations, regsLoading, updateRegistration, deleteRegistration, refreshRegistrations,
      messages, msgsLoading, updateMessage, deleteMessage,
      subscribers, subsLoading, updateSubscriber, deleteSubscriber,
      speakers, spksLoading, updateSpeaker, addSpeaker, deleteSpeaker,
      updates, updatesLoading, addUpdate, updateUpdate, deleteUpdate, refreshUpdates,
      abstracts, abstractsLoading, updateAbstract, deleteAbstract, refreshAbstracts,
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
