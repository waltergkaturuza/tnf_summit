"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  Registration, ContactMessage, NewsletterSubscriber, Speaker,
  generateMockRegistrations, generateMockMessages, generateMockSubscribers, generateMockSpeakers,
} from "@/lib/adminData";

const ADMIN_CREDENTIALS = { email: "admin@tnfzim.com", password: "TNF@Summit2026" };

type AdminContextType = {
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  registrations: Registration[];
  updateRegistration: (id: string, updates: Partial<Registration>) => void;
  deleteRegistration: (id: string) => void;
  messages: ContactMessage[];
  updateMessage: (id: string, updates: Partial<ContactMessage>) => void;
  deleteMessage: (id: string) => void;
  subscribers: NewsletterSubscriber[];
  updateSubscriber: (id: string, updates: Partial<NewsletterSubscriber>) => void;
  deleteSubscriber: (id: string) => void;
  speakers: Speaker[];
  updateSpeaker: (id: string, updates: Partial<Speaker>) => void;
  addSpeaker: (speaker: Omit<Speaker, "id" | "addedAt">) => void;
  deleteSpeaker: (id: string) => void;
};

const AdminContext = createContext<AdminContextType | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [speakers, setSpeakers] = useState<Speaker[]>([]);

  useEffect(() => {
    const session = sessionStorage.getItem("tnf_admin_auth");
    if (session === "true") setIsAuthenticated(true);

    const storedRegs = localStorage.getItem("tnf_registrations");
    setRegistrations(storedRegs ? JSON.parse(storedRegs) : generateMockRegistrations());

    const storedMsgs = localStorage.getItem("tnf_messages");
    setMessages(storedMsgs ? JSON.parse(storedMsgs) : generateMockMessages());

    const storedSubs = localStorage.getItem("tnf_subscribers");
    setSubscribers(storedSubs ? JSON.parse(storedSubs) : generateMockSubscribers());

    const storedSpeakers = localStorage.getItem("tnf_speakers");
    setSpeakers(storedSpeakers ? JSON.parse(storedSpeakers) : generateMockSpeakers());
  }, []);

  const persist = (key: string, data: unknown) => localStorage.setItem(key, JSON.stringify(data));

  const login = (email: string, password: string) => {
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      setIsAuthenticated(true);
      sessionStorage.setItem("tnf_admin_auth", "true");
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("tnf_admin_auth");
  };

  const updateRegistration = (id: string, updates: Partial<Registration>) => {
    const updated = registrations.map((r) => (r.id === id ? { ...r, ...updates } : r));
    setRegistrations(updated);
    persist("tnf_registrations", updated);
  };

  const deleteRegistration = (id: string) => {
    const updated = registrations.filter((r) => r.id !== id);
    setRegistrations(updated);
    persist("tnf_registrations", updated);
  };

  const updateMessage = (id: string, updates: Partial<ContactMessage>) => {
    const updated = messages.map((m) => (m.id === id ? { ...m, ...updates } : m));
    setMessages(updated);
    persist("tnf_messages", updated);
  };

  const deleteMessage = (id: string) => {
    const updated = messages.filter((m) => m.id !== id);
    setMessages(updated);
    persist("tnf_messages", updated);
  };

  const updateSubscriber = (id: string, updates: Partial<NewsletterSubscriber>) => {
    const updated = subscribers.map((s) => (s.id === id ? { ...s, ...updates } : s));
    setSubscribers(updated);
    persist("tnf_subscribers", updated);
  };

  const deleteSubscriber = (id: string) => {
    const updated = subscribers.filter((s) => s.id !== id);
    setSubscribers(updated);
    persist("tnf_subscribers", updated);
  };

  const updateSpeaker = (id: string, updates: Partial<Speaker>) => {
    const updated = speakers.map((s) => (s.id === id ? { ...s, ...updates } : s));
    setSpeakers(updated);
    persist("tnf_speakers", updated);
  };

  const addSpeaker = (speaker: Omit<Speaker, "id" | "addedAt">) => {
    const newSpeaker: Speaker = {
      ...speaker,
      id: `SPK-${String(Date.now()).slice(-4)}`,
      addedAt: new Date().toISOString(),
    };
    const updated = [...speakers, newSpeaker];
    setSpeakers(updated);
    persist("tnf_speakers", updated);
  };

  const deleteSpeaker = (id: string) => {
    const updated = speakers.filter((s) => s.id !== id);
    setSpeakers(updated);
    persist("tnf_speakers", updated);
  };

  return (
    <AdminContext.Provider value={{
      isAuthenticated, login, logout,
      registrations, updateRegistration, deleteRegistration,
      messages, updateMessage, deleteMessage,
      subscribers, updateSubscriber, deleteSubscriber,
      speakers, updateSpeaker, addSpeaker, deleteSpeaker,
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
