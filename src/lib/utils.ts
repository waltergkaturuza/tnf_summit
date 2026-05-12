import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getSessionTypeColor(type: string): string {
  const colors: Record<string, string> = {
    plenary: "bg-blue-500/20 text-blue-300 border-blue-500/40",
    workshop: "bg-purple-500/20 text-purple-300 border-purple-500/40",
    networking: "bg-slate-500/20 text-slate-300 border-slate-500/40",
    ceremony: "bg-gold-500/20 text-amber-300 border-amber-500/40",
    special: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
    concurrent: "bg-sky-500/20 text-sky-300 border-sky-500/40",
    social: "bg-pink-500/20 text-pink-300 border-pink-500/40",
    excursion: "bg-green-500/20 text-green-300 border-green-500/40",
  };
  return colors[type] || "bg-slate-500/20 text-slate-300 border-slate-500/40";
}

export function getSessionTypeBadge(type: string): string {
  const badges: Record<string, string> = {
    plenary: "Plenary",
    workshop: "Workshop",
    networking: "Networking",
    ceremony: "Ceremony",
    special: "Special Session",
    concurrent: "Concurrent",
    social: "Social Event",
    excursion: "Excursion",
  };
  return badges[type] || type;
}

export function getRoomLabel(room: string): string {
  const rooms: Record<string, string> = {
    A: "Room A, Main Plenary Hall",
    B: "Room B, Syndicate Hall",
    BOTH: "All Venues",
    ALL: "All Venues",
  };
  return rooms[room] || room;
}

export function getCountdownData(targetDate: Date): { days: number; hours: number; minutes: number; seconds: number } {
  const now = new Date();
  const diff = targetDate.getTime() - now.getTime();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds };
}
