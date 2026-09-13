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

export interface AiActivitySummary {
  status: "ok";
  success: true;
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
  freshness: "LIVE" | "RECENT" | "STALE" | "NO_DATA";
  filterPeriod: ActivityFilterPeriod;
}

const memoryActivityEvents: AiActivityEvent[] = [
  {
    id: "act_001",
    project: "CourseForge AI",
    action: "Generated course-generation workflow",
    provider: "ANTIGRAVITY · CODEX",
    model: "Gemini · GPT",
    timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
  },
  {
    id: "act_002",
    project: "HireScope AI",
    action: "Evaluated candidate resume & skills breakdown",
    provider: "CODEX",
    model: "GPT",
    timestamp: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
  },
  {
    id: "act_003",
    project: "Greetly",
    action: "Generated personalized video greeting schema",
    provider: "ANTIGRAVITY",
    model: "Gemini",
    timestamp: new Date(Date.now() - 65 * 60 * 1000).toISOString(),
  },
];

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

function getFreshness(lastEventTime?: string): AiActivitySummary["freshness"] {
  if (!lastEventTime) return "NO_DATA";
  const ageMs = Date.now() - Date.parse(lastEventTime);
  if (ageMs < 15 * 60 * 1000) return "LIVE";
  if (ageMs < 60 * 60 * 1000) return "RECENT";
  return "STALE";
}

export function recordActivityEvent(event: Partial<AiActivityEvent>): AiActivityEvent {
  if (!event.project || !event.project.trim()) {
    throw new Error("Project name is required.");
  }
  if (!event.action || !event.action.trim()) {
    throw new Error("Action description is required.");
  }

  const normalized: AiActivityEvent = {
    id: event.id || `act_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    project: event.project.trim(),
    action: event.action.trim(),
    provider: event.provider?.trim() || "ANTIGRAVITY",
    model: event.model?.trim() || "Gemini",
    timestamp: event.timestamp || new Date().toISOString(),
    details: event.details?.trim(),
  };

  // Prevent exact duplicate event IDs
  const existingIdx = memoryActivityEvents.findIndex((e) => e.id === normalized.id);
  if (existingIdx >= 0) {
    memoryActivityEvents[existingIdx] = normalized;
  } else {
    memoryActivityEvents.unshift(normalized);
  }

  return normalized;
}

export function getAiBuildActivitySummary(period: ActivityFilterPeriod = "recent"): AiActivitySummary {
  // Sort events newest first
  const sorted = [...memoryActivityEvents].sort(
    (a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp)
  );

  const now = Date.now();
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  let filtered = sorted;
  if (period === "recent") {
    // Latest 5 events
    filtered = sorted.slice(0, 5);
  } else if (period === "today") {
    filtered = sorted.filter((e) => Date.parse(e.timestamp) >= todayStart.getTime());
  } else if (period === "all_activity") {
    filtered = sorted;
  }

  const latestEvent = sorted[0] || null;
  const lastActiveTime = latestEvent ? latestEvent.timestamp : undefined;
  const freshness = getFreshness(lastActiveTime);
  const isLive = freshness === "LIVE";

  return {
    status: "ok",
    success: true,
    updatedAt: new Date().toISOString(),
    isLive,
    lastActiveFormatted: lastActiveTime ? formatRelativeTime(lastActiveTime) : "NO ACTIVITY",
    currentBuild: latestEvent
      ? {
          project: latestEvent.project,
          action: latestEvent.action,
          tools: latestEvent.provider,
          models: latestEvent.model,
          timestamp: latestEvent.timestamp,
        }
      : null,
    events: filtered,
    freshness,
    filterPeriod: period,
  };
}
