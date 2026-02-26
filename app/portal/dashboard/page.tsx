'use client';

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { MarketingAgencyCRM, type MarketingAgencyCRMData } from "@/components/MarketingAgencyCRM";

type BoardOpportunity = {
  company?: string;
  contact?: string;
  owner?: string;
  value?: number;
  stage?: string;
  probability?: number;
  closeDate?: string;
  activityCount?: number;
  daysInStage?: number;
  source?: string;
  nextStep?: string;
  lastContact?: string;
  email?: string;
  phone?: string;
};

type BoardPayload = {
  userName?: string;
  banner?: {
    status?: "critical" | "warning" | "healthy";
    constraint?: string;
    recommendation?: string;
    actionLabel?: string;
  };
  metrics?: Partial<MarketingAgencyCRMData["metrics"]>;
  opportunities?: BoardOpportunity[];
};

const EMPTY_DATA: MarketingAgencyCRMData = {
  userName: "Founder",
  banner: {
    status: "healthy",
    constraint: "Waiting for live CRM data.",
    recommendation: "Connect a lead source to start real-time pipeline tracking.",
    actionLabel: "CONNECT SOURCE",
  },
  metrics: {
    totalPipeline: 0,
    activeDeals: 0,
    totalContacts: 0,
    meetingsThisWeek: 0,
    forecastQuarter: 0,
    activitiesToday: 0,
    winRatePct: 0,
    avgDealSize: 0,
    salesCycleDays: 0,
    conversionRatePct: 0,
    stalledDealsCount: 0,
  },
  deals: [],
  contacts: [],
  activities: [],
  meetings: [],
  tasks: [],
};

function toNumber(value: unknown, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function toText(value: unknown, fallback: string) {
  const text = typeof value === "string" ? value.trim() : "";
  return text || fallback;
}

function mapBoardToCrmData(board: BoardPayload | null, liveError: string): MarketingAgencyCRMData {
  if (!board) {
    if (!liveError) return EMPTY_DATA;
    return {
      ...EMPTY_DATA,
      banner: {
        status: "warning",
        constraint: "Live sync unavailable.",
        recommendation: liveError,
        actionLabel: "RETRY",
      },
    };
  }

  const opportunities = Array.isArray(board.opportunities) ? board.opportunities : [];

  const deals: MarketingAgencyCRMData["deals"] = opportunities.map((item, index) => ({
    company: toText(item.company, `Opportunity ${index + 1}`),
    value: toNumber(item.value, 0),
    stage: toText(item.stage, "lead"),
    probability: Math.max(0, Math.min(100, toNumber(item.probability, 25))),
    owner: toText(item.owner, "Unassigned"),
    closeDate: toText(item.closeDate, "TBD"),
    activities: Math.max(0, toNumber(item.activityCount, 0)),
    daysInStage: Math.max(0, toNumber(item.daysInStage, 0)),
  }));

  const contacts: MarketingAgencyCRMData["contacts"] = opportunities.map((item, index) => ({
    name: toText(item.contact, `Contact ${index + 1}`),
    company: toText(item.company, `Company ${index + 1}`),
    email: toText(item.email, `lead${index + 1}@example.com`),
    phone: toText(item.phone, "N/A"),
    type: toText(item.source, "lead"),
    deals: toNumber(item.value, 0) > 0 ? 1 : 0,
  }));

  const activities: MarketingAgencyCRMData["activities"] = opportunities.slice(0, 12).map((item, index) => ({
    type: "update",
    user: toText(item.owner, "System"),
    action: toText(item.nextStep, "Pipeline updated"),
    target: toText(item.company, `Opportunity ${index + 1}`),
    time: toText(item.lastContact, "Just now"),
    details: `Stage: ${toText(item.stage, "lead")} • Source: ${toText(item.source, "manual")}`,
  }));

  const tasks: MarketingAgencyCRMData["tasks"] = opportunities.slice(0, 10).map((item, index) => ({
    id: index + 1,
    title: toText(item.nextStep, "Follow up with lead"),
    description: `Advance ${toText(item.company, `Opportunity ${index + 1}`)} to next stage.`,
    status: toText(item.stage, "lead").toLowerCase() === "closed" ? "completed" : "in-progress",
    priority: toNumber(item.value, 0) >= 5000 ? "high" : "medium",
    dueDate: toText(item.closeDate, "TBD"),
    assignee: toText(item.owner, "Unassigned"),
    relatedTo: toText(item.company, `Opportunity ${index + 1}`),
    type: "deal_followup",
  }));

  return {
    userName: toText(board.userName, EMPTY_DATA.userName),
    banner: {
      status: board.banner?.status || (liveError ? "warning" : EMPTY_DATA.banner.status),
      constraint: toText(board.banner?.constraint, liveError ? "Live sync unavailable." : EMPTY_DATA.banner.constraint),
      recommendation: toText(board.banner?.recommendation, liveError || EMPTY_DATA.banner.recommendation),
      actionLabel: toText(board.banner?.actionLabel, EMPTY_DATA.banner.actionLabel),
    },
    metrics: {
      ...EMPTY_DATA.metrics,
      ...board.metrics,
      totalPipeline: toNumber(board.metrics?.totalPipeline, EMPTY_DATA.metrics.totalPipeline),
      activeDeals: toNumber(board.metrics?.activeDeals, EMPTY_DATA.metrics.activeDeals),
      totalContacts: toNumber(board.metrics?.totalContacts, Math.max(contacts.length, EMPTY_DATA.metrics.totalContacts)),
      meetingsThisWeek: toNumber(board.metrics?.meetingsThisWeek, EMPTY_DATA.metrics.meetingsThisWeek),
      forecastQuarter: toNumber(board.metrics?.forecastQuarter, EMPTY_DATA.metrics.forecastQuarter),
      activitiesToday: toNumber(board.metrics?.activitiesToday, Math.max(activities.length, EMPTY_DATA.metrics.activitiesToday)),
      winRatePct: toNumber(board.metrics?.winRatePct, EMPTY_DATA.metrics.winRatePct),
      avgDealSize: toNumber(board.metrics?.avgDealSize, EMPTY_DATA.metrics.avgDealSize),
      salesCycleDays: toNumber(board.metrics?.salesCycleDays, EMPTY_DATA.metrics.salesCycleDays),
      conversionRatePct: toNumber(board.metrics?.conversionRatePct, EMPTY_DATA.metrics.conversionRatePct),
      stalledDealsCount: toNumber(board.metrics?.stalledDealsCount, EMPTY_DATA.metrics.stalledDealsCount),
    },
    deals,
    contacts,
    activities,
    meetings: [],
    tasks,
  };
}

async function loadBoardSnapshot(): Promise<BoardPayload | null> {
  const response = await fetch("/api/control-plane/crm/board?limit=50", {
    method: "GET",
    cache: "no-store",
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message =
      typeof (payload as { error?: unknown })?.error === "string"
        ? String((payload as { error?: string }).error)
        : `Control-plane proxy failed (${response.status}).`;
    throw new Error(message);
  }

  const board = (payload as { board?: BoardPayload | null })?.board;
  return board || null;
}

export default function TenantRoutePage() {
  const router = useRouter();
  const tenantBusinessName = "Test Eighteen";
  const [board, setBoard] = useState<BoardPayload | null>(null);
  const [liveError, setLiveError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const tabToPath = {
    dashboard: "/",
    clients: "/portal/contacts",
    projects: "/portal/tasks",
    board: "/portal/pipeline",
    calendar: "/portal/calendar",
    messages: "/portal/messages",
    settings: "/portal/settings",
  } as const;

  useEffect(() => {
    let active = true;
    loadBoardSnapshot()
      .then((nextBoard) => {
        if (!active) return;
        setBoard(nextBoard);
        setLiveError("");
      })
      .catch((error: unknown) => {
        if (!active) return;
        const message = error instanceof Error ? error.message : "Live data unavailable.";
        setBoard(null);
        setLiveError(message);
      })
      .finally(() => {
        if (!active) return;
        setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const crmData = useMemo(() => {
    const next = mapBoardToCrmData(board, liveError);
    const rawName = String(next.userName || "").trim();
    const looksLikeSlug = rawName.length > 0 && !rawName.includes(" ") && /^[a-z0-9-]+$/i.test(rawName);
    return {
      ...next,
      userName: looksLikeSlug ? tenantBusinessName : rawName || tenantBusinessName,
    };
  }, [board, liveError, tenantBusinessName]);

  if (isLoading) {
    return (
      <div className="crm-shell">
        <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", color: "#9ca3af", background: "#0f0f13" }}>
          Loading CRM data...
        </div>
      </div>
    );
  }

  return (
    <div className="crm-shell">
      <MarketingAgencyCRM
        activeTab="dashboard"
        data={crmData}
        onTabChange={(tab) => {
          const nextPath = tabToPath[tab] || "/";
          router.push(nextPath);
        }}
      />
    </div>
  );
}
