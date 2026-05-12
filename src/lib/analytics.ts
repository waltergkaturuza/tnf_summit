import { supabase } from "./supabase";

// ── Session ID (persisted in sessionStorage per browser tab) ────────────────
function getSessionId(): string {
  if (typeof window === "undefined") return "";
  const key = "tnf_session_id";
  let id = sessionStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(key, id);
  }
  return id;
}

function getDeviceType(): string {
  if (typeof window === "undefined") return "";
  const ua = navigator.userAgent;
  if (/tablet|ipad|playbook|silk/i.test(ua)) return "tablet";
  if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(ua)) return "mobile";
  return "desktop";
}

// ── Track a page view ────────────────────────────────────────────────────────
export async function trackPageView(path: string) {
  try {
    await supabase.schema("tnf_summit").from("page_views").insert({
      page_path:   path,
      referrer:    typeof document !== "undefined" ? document.referrer : "",
      session_id:  getSessionId(),
      device_type: getDeviceType(),
    });
  } catch {
    // Silently fail, never break the user experience for analytics
  }
}

// ── Admin: fetch stats ───────────────────────────────────────────────────────

export type ViewsPerDay = { view_date: string; total_views: number; unique_sessions: number };
export type TopPage     = { page_path: string; views: number };
export type DeviceStat  = { device_type: string; views: number };

export async function fetchViewsPerDay(days = 30): Promise<ViewsPerDay[]> {
  const { data } = await supabase
    .schema("tnf_summit")
    .from("v_views_per_day")
    .select("*")
    .order("view_date", { ascending: true });
  return (data ?? []) as ViewsPerDay[];
}

export async function fetchTopPages(): Promise<TopPage[]> {
  const { data } = await supabase
    .schema("tnf_summit")
    .from("v_top_pages")
    .select("*");
  return (data ?? []) as TopPage[];
}

export async function fetchDeviceBreakdown(): Promise<DeviceStat[]> {
  const { data } = await supabase
    .schema("tnf_summit")
    .from("v_device_breakdown")
    .select("*");
  return (data ?? []) as DeviceStat[];
}

export async function fetchAnalyticsSummary() {
  const [
    { count: total },
    { count: today },
    { count: week },
    topPages,
    perDay,
    devices,
  ] = await Promise.all([
    supabase.schema("tnf_summit").from("page_views").select("*", { count: "exact", head: true }),
    supabase.schema("tnf_summit").from("page_views").select("*", { count: "exact", head: true })
      .gte("created_at", new Date().toISOString().split("T")[0]),
    supabase.schema("tnf_summit").from("page_views").select("*", { count: "exact", head: true })
      .gte("created_at", new Date(Date.now() - 7 * 86400000).toISOString()),
    fetchTopPages(),
    fetchViewsPerDay(),
    fetchDeviceBreakdown(),
  ]);

  // Unique sessions (14-day window)
  const { data: sessionData } = await supabase
    .schema("tnf_summit")
    .from("page_views")
    .select("session_id")
    .gte("created_at", new Date(Date.now() - 14 * 86400000).toISOString())
    .neq("session_id", "");
  const uniqueVisitors = new Set((sessionData ?? []).map((r: { session_id: string }) => r.session_id)).size;

  return { total: total ?? 0, today: today ?? 0, week: week ?? 0, uniqueVisitors, topPages, perDay, devices };
}
