import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Zap, RefreshCw, ChevronDown, ChevronUp, Info, AlertCircle } from "lucide-react";

export interface MetricSummary {
  type: "tokens_processed" | "quota_remaining";
  value: number;
  unit?: string;
  models?: Record<string, number>;
  lastEventTime?: string;
}

export interface AiUsageData {
  success: boolean;
  updatedAt: string;
  lastEventTime?: string;
  period: "all_time" | "today" | "this_month";
  isLive: boolean;
  freshness?: "LIVE" | "STALE";
  metrics: {
    openai: MetricSummary | null;
    antigravity: MetricSummary | null;
    combined: MetricSummary | null;
  };
}

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  formatAsCompact?: boolean;
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  duration = 600,
  formatAsCompact = true,
}) => {
  const [displayValue, setDisplayValue] = useState(value);
  const prevValueRef = useRef(value);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion || duration <= 0) {
      setDisplayValue(value);
      prevValueRef.current = value;
      return;
    }

    const startValue = prevValueRef.current;
    const endValue = value;
    if (startValue === endValue) return;

    const startTime = performance.now();

    const updateNumber = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startValue + (endValue - startValue) * easedProgress);

      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(updateNumber);
      } else {
        prevValueRef.current = value;
      }
    };

    const animId = requestAnimationFrame(updateNumber);
    return () => cancelAnimationFrame(animId);
  }, [value, duration, shouldReduceMotion]);

  const formatNumber = (num: number): string => {
    if (formatAsCompact) {
      if (num >= 1_000_000) {
        return (num / 1_000_000).toFixed(2) + "M";
      }
      if (num >= 1000) {
        return (num / 1000).toFixed(0) + "K";
      }
    }
    return num.toLocaleString();
  };

  return <span title={value.toLocaleString()}>{formatNumber(displayValue)}</span>;
};

function formatRelativeTime(isoString: string): string {
  if (!isoString) return "JUST NOW";
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMinutes < 1) return "JUST NOW";
  if (diffMinutes === 1) return "1 MIN AGO";
  if (diffMinutes < 60) return `${diffMinutes} MINS AGO`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours === 1) return "1 HOUR AGO";
  if (diffHours < 24) return `${diffHours} HOURS AGO`;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function formatCompactToken(num: number): string {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(2) + "M";
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(0) + "K";
  }
  return num.toString();
}

export const LiveAiUsageCounter: React.FC = () => {
  const [data, setData] = useState<AiUsageData | null>(null);
  const [period, setPeriod] = useState<"all_time" | "today" | "this_month">("all_time");
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showModels, setShowModels] = useState<boolean>(false);
  const [showTooltip, setShowTooltip] = useState<boolean>(false);

  const abortControllerRef = useRef<AbortController | null>(null);
  const activePeriodRef = useRef<"all_time" | "today" | "this_month">(period);
  activePeriodRef.current = period;

  const fetchUsage = useCallback(
    async (selectedPeriod: "all_time" | "today" | "this_month", isManual: boolean = false) => {
      // Cancel any ongoing fetch request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const controller = new AbortController();
      abortControllerRef.current = controller;

      if (isManual) setRefreshing(true);
      else if (!data) setLoading(true);

      setError(null);

      try {
        const response = await fetch(`/api/ai-usage?period=${selectedPeriod}`, {
          headers: { Accept: "application/json" },
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const result: AiUsageData = await response.json();
        // Guard against stale response if period changed while request was in-flight
        if (activePeriodRef.current !== selectedPeriod) {
          return;
        }

        if (result && result.success) {
          setData(result);
        } else {
          throw new Error("Invalid API response");
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") {
          // Request was aborted due to filter switch; ignore
          return;
        }
        console.error("[LiveAiUsageCounter] Fetch error:", err);
        setError("DATA TEMPORARILY UNAVAILABLE");
      } finally {
        if (activePeriodRef.current === selectedPeriod) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    },
    [data]
  );

  useEffect(() => {
    fetchUsage(period);

    // Frontend polling every 90 seconds
    const interval = setInterval(() => {
      fetchUsage(period);
    }, 90000);

    return () => {
      clearInterval(interval);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [period, fetchUsage]);

  const handlePeriodChange = (newPeriod: "all_time" | "today" | "this_month") => {
    if (newPeriod === period) return;
    setPeriod(newPeriod);
  };

  const handleManualRefresh = () => {
    fetchUsage(period, true);
  };

  const openaiMetric = data?.metrics?.openai;
  const antigravityMetric = data?.metrics?.antigravity;
  const combinedMetric = data?.metrics?.combined;

  // Determine if both metrics are token usage and can be combined
  const canCombine =
    openaiMetric?.type === "tokens_processed" &&
    antigravityMetric?.type === "tokens_processed" &&
    combinedMetric?.value !== undefined;

  const totalTokens = canCombine
    ? combinedMetric!.value
    : openaiMetric?.type === "tokens_processed"
    ? openaiMetric.value
    : 0;

  return (
    <div className="mt-6 pt-5 border-t border-[#1E2024]/14 select-none">
      {/* HEADER BAR: LABEL, TIME RANGE SELECTOR & REFRESH BUTTON */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          {/* Status Indicator */}
          <span className="relative flex h-2.5 w-2.5">
            {refreshing && (
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
            AI ACTIVITY
          </span>

          {/* Data provenance info toggle */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowTooltip(!showTooltip);
            }}
            aria-label="Data provenance information"
            className="text-[#1E2024]/50 hover:text-[#1E2024] transition-colors focus:outline-none cursor-pointer"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* TIME PERIOD TABS & MANUAL REFRESH BUTTON */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#1E2024]/6 p-0.5 rounded-lg border border-[#1E2024]/10 font-mono text-[10px] font-bold">
            {(["all_time", "today", "this_month"] as const).map((p) => {
              const label = p === "all_time" ? "ALL TIME" : p === "today" ? "TODAY" : "THIS MONTH";
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
            title="Refresh AI usage data"
            className="p-1.5 rounded-lg border border-[#1E2024]/12 bg-[#1E2024]/5 text-[#1E2024] hover:bg-[#1E2024]/10 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-[#FFD21F]" : ""}`} />
          </button>
        </div>
      </div>

      {/* PROVENANCE TOOLTIP BANNER */}
      {showTooltip && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="mb-4 p-3 rounded-xl bg-[#1E2024]/6 border border-[#1E2024]/12 font-mono text-xs text-[#1E2024]/80 flex items-start gap-2"
        >
          <Zap className="w-4 h-4 text-[#FFD21F] flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-[#1E2024]">Data Provenance &amp; Verification</p>
            <p className="mt-0.5 leading-relaxed text-[11px]">
              Aggregated live metrics from verified backend AI execution events. OpenAI tokens are calculated from actual API payload usage. Antigravity interaction metrics track real LLM execution activity without exposing API credentials.
            </p>
          </div>
        </motion.div>
      )}

      {/* MAIN METRIC DISPLAY AREA */}
      {loading ? (
        /* LOADING SKELETON */
        <div className="py-6 space-y-3">
          <div className="h-10 w-48 bg-[#1E2024]/10 rounded-xl animate-pulse" />
          <div className="h-4 w-32 bg-[#1E2024]/8 rounded-md animate-pulse" />
          <div className="grid grid-cols-2 gap-4 pt-3">
            <div className="h-8 bg-[#1E2024]/6 rounded-lg animate-pulse" />
            <div className="h-8 bg-[#1E2024]/6 rounded-lg animate-pulse" />
          </div>
        </div>
      ) : error ? (
        /* ERROR STATE */
        <div className="py-6 px-4 rounded-2xl bg-red-500/8 border border-red-500/20 text-red-900 font-mono text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <div>
            <span className="font-bold block">{error}</span>
            <span className="text-[11px] opacity-75">
              {data?.updatedAt ? `LAST KNOWN SYNC: ${formatRelativeTime(data.updatedAt)}` : "Unable to contact usage backend."}
            </span>
          </div>
        </div>
      ) : (
        /* FACTUAL DATA DISPLAY */
        <div>
          {/* DISPLAY MODE 1: COMBINED TOKEN METRIC */}
          {canCombine ? (
            <div className="space-y-4">
              {/* BIG NUMERICAL COUNTER */}
              <div className="flex items-baseline gap-3">
                <div
                  className="font-sans font-bold text-4xl sm:text-5xl md:text-6xl text-[#1E2024] tracking-[-0.03em] leading-none"
                  title={`Exact value: ${totalTokens.toLocaleString()} tokens`}
                >
                  <AnimatedNumber value={totalTokens} formatAsCompact={true} />
                </div>
                <span className="font-mono text-xs sm:text-sm font-bold uppercase tracking-[0.16em] text-[#1E2024]/65">
                  TOKENS PROCESSED
                </span>
              </div>

              {/* INDIVIDUAL PROVIDER BREAKDOWN GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {/* OPENAI METRIC ROW */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#1E2024]/5 border border-[#1E2024]/10 font-mono">
                  <span className="text-xs font-semibold text-[#1E2024]/75">OPENAI</span>
                  <span className="text-sm font-bold text-[#1E2024]">
                    {openaiMetric ? formatCompactToken(openaiMetric.value) : "0"}
                  </span>
                </div>

                {/* ANTIGRAVITY METRIC ROW */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#1E2024]/5 border border-[#1E2024]/10 font-mono">
                  <span className="text-xs font-semibold text-[#1E2024]/75">ANTIGRAVITY</span>
                  <span className="text-sm font-bold text-[#1E2024]">
                    {antigravityMetric ? formatCompactToken(antigravityMetric.value) : "0"}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* DISPLAY MODE 2: INCOMPATIBLE OR INDIVIDUAL METRICS (NO INCOMPATIBLE ADDITION) */
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* OPENAI STATUS */}
                <div className="p-4 rounded-2xl bg-[#1E2024]/5 border border-[#1E2024]/10 font-mono">
                  <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#1E2024]/60 block mb-1">
                    OPENAI
                  </span>
                  {openaiMetric ? (
                    <div>
                      <div className="text-2xl font-bold text-[#1E2024]">
                        <AnimatedNumber value={openaiMetric.value} />
                      </div>
                      <span className="text-[10px] uppercase text-[#1E2024]/60 font-semibold">
                        TOKENS PROCESSED
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs font-bold text-gray-500">UNAVAILABLE</span>
                  )}
                </div>

                {/* ANTIGRAVITY STATUS (HANDLES TOKENS OR QUOTA) */}
                <div className="p-4 rounded-2xl bg-[#1E2024]/5 border border-[#1E2024]/10 font-mono">
                  <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#1E2024]/60 block mb-1">
                    ANTIGRAVITY
                  </span>
                  {antigravityMetric ? (
                    <div>
                      <div className="text-2xl font-bold text-[#1E2024]">
                        {antigravityMetric.type === "quota_remaining" ? (
                          `${antigravityMetric.value}%`
                        ) : (
                          <AnimatedNumber value={antigravityMetric.value} />
                        )}
                      </div>
                      <span className="text-[10px] uppercase text-[#1E2024]/60 font-semibold">
                        {antigravityMetric.type === "quota_remaining"
                          ? "QUOTA REMAINING"
                          : "TOKENS PROCESSED"}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs text-[#1E2024]/60 font-semibold">
                      CONNECTOR: NOT CONFIGURED
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* MODEL BREAKDOWN ACCORDION TOGGLE */}
          <div className="mt-4 flex items-center justify-between border-t border-[#1E2024]/10 pt-3 font-mono text-xs">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowModels(!showModels);
              }}
              className="inline-flex items-center gap-1.5 text-[#1E2024]/70 hover:text-[#1E2024] font-semibold transition-colors focus:outline-none cursor-pointer"
            >
              <span>MODEL BREAKDOWN</span>
              {showModels ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {/* RELATIVE TIMESTAMP */}
            <span className="text-[11px] font-semibold text-[#1E2024]/50 uppercase">
              {data?.freshness === "STALE" ? "STALE DATA — " : ""}UPDATED {data?.updatedAt ? formatRelativeTime(data.updatedAt) : "JUST NOW"}
            </span>
          </div>

          {/* EXPANDABLE MODEL DETAILS */}
          {showModels && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 p-3 rounded-xl bg-[#1E2024]/5 border border-[#1E2024]/10 font-mono text-xs space-y-3"
            >
              {openaiMetric?.models && Object.keys(openaiMetric.models).length > 0 && (
                <div>
                  <span className="font-bold text-[#1E2024]/60 text-[10px] uppercase block mb-1.5">
                    OPENAI MODELS
                  </span>
                  <div className="space-y-1">
                    {Object.entries(openaiMetric.models).map(([model, count]) => (
                      <div key={model} className="flex justify-between items-center text-[#1E2024]">
                        <span className="font-semibold">{model}</span>
                        <span className="font-bold">{count.toLocaleString()} tokens</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {antigravityMetric?.models && Object.keys(antigravityMetric.models).length > 0 && (
                <div>
                  <span className="font-bold text-[#1E2024]/60 text-[10px] uppercase block mb-1.5">
                    ANTIGRAVITY MODELS
                  </span>
                  <div className="space-y-1">
                    {Object.entries(antigravityMetric.models).map(([model, count]) => (
                      <div key={model} className="flex justify-between items-center text-[#1E2024]">
                        <span className="font-semibold">{model}</span>
                        <span className="font-bold">{count.toLocaleString()} tokens</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};

export default LiveAiUsageCounter;
