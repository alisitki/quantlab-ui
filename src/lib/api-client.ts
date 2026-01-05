export const API_BASE = "http://157.180.87.223:9100";

export type QualityState = 'GOOD' | 'DEGRADED' | 'BAD';
export type ComponentState = 'READY' | 'DEGRADED' | 'BAD' | 'OFFLINE' | 'ERROR';

// GET /collector/now
export interface CollectorNow {
  state: ComponentState;
  uptime_seconds: number; // Changed from uptime to uptime_seconds to match API
  last_heartbeat_utc: string; // Changed from last_heartbeat_ts to last_heartbeat_utc
  memory_rss_mb: number; // Changed from rss_mb to memory_rss_mb
  queue_pct: number; // Changed from queue object to simple percentage
  drain_mode: string; // Changed structure based on "drain_mode" in user request (assuming string or boolean, strictly following "drain_mode" field name)
  ws_connected: Record<string, boolean>; // Changed from exchanges object to separate verified maps
  eps_by_exchange: Record<string, number>;
}

// GET /collector/day/:YYYYMMDD/summary
export interface CollectorDaySummary {
  date: string;
  overall_quality: QualityState;
  trust_epoch: boolean;
  window_counts: {
    GOOD: number;
    DEGRADED: number;
    BAD: number;
  };
  bad_windows: string[];
  max_queue_pct: number;
  total_drops: number;
  total_reconnects: number;
  total_offline_seconds: Record<string, number>;
  accelerated_drain_seconds: number;
  recommended_usage: {
    ml_backtest: boolean;
    production_trading: boolean;
    notes: string;
  };
}

// GET /collector/day/:YYYYMMDD/windows
export interface CollectorWindow {
  window: string;
  quality: QualityState;
  is_partial: boolean;
  queue_peak_pct: number;
  drops: number;
  reconnects: number;
  accelerated_drain_seconds: number;
  offline_seconds: Record<string, number>;
  eps: Record<string, { min: number; avg: number }>;
}

// GET /collector/uploader/now
export interface CollectorUploaderNow {
  state: 'READY' | 'DEGRADED' | 'BAD' | 'ERROR';
  last_success_upload_utc: string;
  seconds_since_last_success: number;
  pending_files: number;
  spool_size_gb: number;
  alert_sent_24h: boolean;
}

export async function fetchCollectorNow(signal?: AbortSignal): Promise<CollectorNow> {
  const res = await fetch(`${API_BASE}/collector/now`, { signal, cache: "no-store" });
  if (!res.ok) throw new Error(`now status=${res.status}`);
  return res.json();
}

export async function fetchCollectorUploaderNow(signal?: AbortSignal): Promise<CollectorUploaderNow> {
  const res = await fetch(`${API_BASE}/collector/uploader/now`, { signal, cache: "no-store" });
  if (!res.ok) throw new Error(`uploader status=${res.status}`);
  return res.json();
}

export async function fetchCollectorMeta(signal?: AbortSignal) {
  const res = await fetch(`${API_BASE}/collector/meta`, { signal, cache: "no-store" });
  if (!res.ok) throw new Error(`meta status=${res.status}`);
  return res.json();
}

export async function fetchCollectorDaySummary(dateYYYYMMDD: string, signal?: AbortSignal): Promise<CollectorDaySummary> {
  const res = await fetch(`${API_BASE}/collector/day/${dateYYYYMMDD}/summary`, { signal, cache: "no-store" });
  if (!res.ok) throw new Error(`summary status=${res.status}`);
  return res.json();
}

export async function fetchCollectorDayWindows(dateYYYYMMDD: string, signal?: AbortSignal): Promise<CollectorWindow[]> {
  const res = await fetch(`${API_BASE}/collector/day/${dateYYYYMMDD}/windows`, { signal, cache: "no-store" });
  if (!res.ok) throw new Error(`windows status=${res.status}`);
  return res.json();
}
