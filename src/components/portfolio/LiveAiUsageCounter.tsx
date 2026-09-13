import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, RefreshCw, ChevronDown, ChevronUp, AlertCircle } from "lucide-react";

export interface AiActivityEvent {
  id: string;
  project: string;
  action: string;
  provider: string;
  model: string;
  timestamp: string;
  details?: string;
}

export type ActivityFilterPeriod = "recent" | "today" | "all_activity";

export interface AiActivityData {
  status?: "ok";
  success: boolean;
  updatedAt: string;
  isLive: boolean;
  lastActiveFormatted: string;
  currentBuild: {
    project: string;
    action: string;
    tools: string;
    models: string;
    timestamp: string;
  } | null;
  events: AiActivityEvent[];
  freshness?: "LIVE" | "RECENT" | "STALE" | "NO_DATA";
  filterPeriod?: ActivityFilterPeriod;
}

function formatRelativeTime(isoString: string): string {
  const timeMs = Date.parse(isoString);
  if (!Number.isFinite(timeMs)) return "UNKNOWN";

  const diffSec = Math.floor((Date.now() - timeMs) / 1000);
  if (diffSec < 60) return "LIVE NOW";

  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} MIN AGO`;

  const diffHrs = Math.floor(diffMin / 60);
  if (diffHrs < 24) return `${diffHrs} HRS AGO`;

  const diffDays = Math.floor(diffHrs / 24);
  return `${diffDays} DAYS AGO`;
}

function formatEventClockTime(isoString: string): string {
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return "";
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export const LiveAiUsageCounter: React.FC = () => {
  const [data, setData] = useState<AiActivityData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<ActivityFilterPeriod>("recent");
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [showTooltip, setShowTooltip] = useState<boolean>(false);

  const requestSeqRef = useRef<number>(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchActivity = useCallback(async (targetPeriod: ActivityFilterPeriod, isManualRefresh = false) => {
    if (isManualRefresh) {
      setRefreshing(true);
    } else if (!data) {
      setLoading(true);
    }
    setError(null);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const currentSeq = ++requestSeqRef.current;

    try {
      const response = await fetch(`/api/ai-usage?period=${targetPeriod}&_t=${Date.now()}`, {
        signal: controller.signal,
        headers: { Accept: "application/json" },
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const json: AiActivityData = await response.json();

      if (currentSeq !== requestSeqRef.current) return;

      if (!json.success && json.status !== "ok") {
        throw new Error("Invalid response payload from activity API");
      }

      setData(json);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      if (currentSeq !== requestSeqRef.current) return;

      console.error("[AiActivity] Fetch error:", err);
      setError("Unable to sync build activity telemetry.");
    } finally {
      if (currentSeq === requestSeqRef.current) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, [data]);

  useEffect(() => {
    fetchActivity(period);

    // Refresh every 90 seconds
    const interval = setInterval(() => {
      fetchActivity(period, true);
    }, 90000);

    return () => {
      clearInterval(interval);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [period, fetchActivity]);

  const handlePeriodChange = (newPeriod: ActivityFilterPeriod) => {
    if (newPeriod === period) return;
    setPeriod(newPeriod);
  };

  const handleManualRefresh = () => {
    fetchActivity(period, true);
  };

  const currentBuild = data?.currentBuild;
  const events = data?.events || [];
  const hasEvents = events.length > 0 && Boolean(currentBuild);

  return (
    <div className="mt-6 pt-5 border-t border-[#1E2024]/14 select-none">
      {/* HEADER BAR: STATUS INDICATOR, TITLE, PERIOD FILTERS & REFRESH */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          {/* Status Indicator */}
          <span className="relative flex h-2.5 w-2.5">
            {data?.isLive && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFD21F] opacity-75" />
            )}
            <span
              className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                error
                  ? "bg-red-500"
                  : data?.isLive
                  ? "bg-[#FFD21F]"
                  : "bg-gray-400"
              }`}
            />
          </span>

          <span className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-[#1E2024]">
            AI BUILD ACTIVITY
          </span>
        </div>

        {/* TIME PERIOD TABS & MANUAL REFRESH BUTTON */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#1E2024]/6 p-0.5 rounded-lg border border-[#1E2024]/10 font-mono text-[10px] font-bold">
            {(["recent", "today", "all_activity"] as const).map((p) => {
              const label = p === "recent" ? "RECENT" : p === "today" ? "TODAY" : "ALL ACTIVITY";
              const isActive = period === p;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePeriodChange(p);
                  }}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#1E2024] text-[#F7F1E5] shadow-xs"
                      : "text-[#1E2024]/70 hover:text-[#1E2024]"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleManualRefresh();
            }}
            disabled={refreshing}
            title="Refresh AI build activity"
            className="p-1.5 rounded-lg border border-[#1E2024]/12 bg-[#1E2024]/5 text-[#1E2024] hover:bg-[#1E2024]/10 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-[#FFD21F]" : ""}`} />
          </button>
        </div>
      </div>

      {/* MAIN METRIC DISPLAY AREA */}
      {loading ? (
        /* LOADING SKELETON STATE */
        <div className="py-6 px-4 rounded-2xl bg-[#1E2024]/5 border border-[#1E2024]/10 font-mono text-xs flex items-center gap-3 animate-pulse">
          <RefreshCw className="w-4 h-4 animate-spin text-[#FFD21F]" />
          <div>
            <span className="font-bold block text-[#1E2024]">SYNCING BUILD ACTIVITY...</span>
            <span className="text-[11px] text-[#1E2024]/60">Fetching latest verified application telemetry</span>
          </div>
        </div>
      ) : error ? (
        /* ERROR STATE */
        <div className="py-6 px-4 rounded-2xl bg-red-500/8 border border-red-500/20 text-red-900 font-mono text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <div>
            <span className="font-bold block">{error}</span>
            <span className="text-[11px] opacity-75">
              Unable to contact telemetry endpoint.
            </span>
          </div>
        </div>
      ) : !hasEvents ? (
        /* HONEST EMPTY STATE */
        <div className="py-6 px-4 rounded-2xl bg-[#1E2024]/5 border border-[#1E2024]/10 font-mono text-xs">
          <span className="font-bold block text-[#1E2024]">NO RECENT AI ACTIVITY</span>
          <span className="mt-1 block text-[11px] uppercase tracking-[0.12em] text-[#1E2024]/55">
            Waiting for verified build events from active applications.
          </span>
        </div>
      ) : (
        /* REAL ACTIVITY DASHBOARD GRID */
        <div className="space-y-4">
          {/* PRIMARY 2-COLUMN TELEMETRY GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* CURRENT BUILD */}
            <div className="p-4 rounded-2xl bg-[#1E2024]/5 border border-[#1E2024]/10 font-mono">
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#1E2024]/60 block mb-1">
                CURRENT BUILD
              </span>
              <div className="text-lg sm:text-xl font-bold text-[#1E2024] tracking-[-0.01em]">
                {currentBuild?.project}
              </div>
            </div>

            {/* LAST AI ACTION */}
            <div className="p-4 rounded-2xl bg-[#1E2024]/5 border border-[#1E2024]/10 font-mono">
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#1E2024]/60 block mb-1">
                LAST AI ACTION
              </span>
              <div className="text-xs sm:text-sm font-semibold text-[#1E2024] leading-snug">
                {currentBuild?.action}
              </div>
            </div>

            {/* ACTIVE TOOLS */}
            <div className="p-4 rounded-2xl bg-[#1E2024]/5 border border-[#1E2024]/10 font-mono">
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#1E2024]/60 block mb-1">
                ACTIVE TOOLS
              </span>
              <div className="text-sm font-bold text-[#1E2024]">
                {currentBuild?.tools || "ANTIGRAVITY · CODEX"}
              </div>
            </div>

            {/* MODELS USED */}
            <div className="p-4 rounded-2xl bg-[#1E2024]/5 border border-[#1E2024]/10 font-mono">
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#1E2024]/60 block mb-1">
                MODELS USED
              </span>
              <div className="text-sm font-bold text-[#1E2024]">
                {currentBuild?.models || "MODEL DATA UNAVAILABLE"}
              </div>
            </div>
          </div>

          {/* LAST ACTIVE FOOTER BAR */}
          <div className="flex items-center justify-between border-t border-[#1E2024]/10 pt-3 font-mono text-xs">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowHistory(!showHistory);
              }}
              className="inline-flex items-center gap-1.5 text-[#1E2024]/70 hover:text-[#1E2024] font-semibold transition-colors focus:outline-none cursor-pointer"
            >
              <span>RECENT ACTIVITY ({events.length})</span>
              {showHistory ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {/* RELATIVE TIMESTAMP */}
            <span className="text-[11px] font-semibold text-[#1E2024]/60 uppercase tracking-wider">
              {data?.isLive ? (
                <span className="inline-flex items-center gap-1 text-[#1E2024]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FFD21F]" />
                  LAST ACTIVE {data.lastActiveFormatted}
                </span>
              ) : (
                `LAST ACTIVE ${data?.lastActiveFormatted || "UNKNOWN"}`
              )}
            </span>
          </div>

          {/* EXPANDABLE RECENT ACTIVITY LIST */}
          <AnimatePresence>
            {showHistory && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <div className="mt-2 space-y-2 font-mono text-xs">
                  {events.slice(0, 5).map((evt, idx) => (
                    <motion.div
                      key={evt.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                      className="p-3 rounded-xl bg-[#1E2024]/5 border border-[#1E2024]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-[10px] font-bold text-[#1E2024]/50">
                          {formatEventClockTime(evt.timestamp) || formatRelativeTime(evt.timestamp)}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-[#1E2024] text-[#F7F1E5] font-bold text-[10px]">
                          {evt.project}
                        </span>
                      </div>

                      <div className="text-xs text-[#1E2024] font-medium flex-1 sm:px-2">
                        {evt.action}
                      </div>

                      <div className="text-[10px] font-semibold text-[#1E2024]/65 uppercase">
                        {evt.provider} · {evt.model}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default LiveAiUsageCounter;
