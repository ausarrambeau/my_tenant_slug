'use client';

import { useEffect, useMemo, useState } from "react";

const page = {
  "title": "Pipeline",
  "description": "Stage-by-stage opportunity flow with ownership and aging.",
  "routePath": "/portal/pipeline",
  "moduleKey": "pipeline",
  "companyName": "Test Eleven",
  "navItems": [
    {
      "label": "Dashboard",
      "path": "/portal/dashboard",
      "external": false
    },
    {
      "label": "Help",
      "path": "/portal/help",
      "external": false
    },
    {
      "label": "Messages",
      "path": "/portal/messages",
      "external": false
    }
  ]
} as const;
const composition = {
  "surface": {
    "key": "pipeline",
    "path": "/portal/pipeline",
    "title": "Pipeline",
    "description": "Stage-by-stage opportunity flow with ownership and aging."
  },
  "kpis": [
    {
      "label": "Open Opportunities",
      "value": "26"
    },
    {
      "label": "Weighted Pipeline",
      "value": "$412K"
    },
    {
      "label": "Avg Stage Time",
      "value": "4.3d"
    }
  ],
  "columns": [
    {
      "title": "Prospect",
      "items": [
        "9 deals",
        "Owner mix balanced",
        "Lead source paid/social"
      ]
    },
    {
      "title": "Proposal",
      "items": [
        "11 deals",
        "3 due today",
        "2 need legal review"
      ]
    },
    {
      "title": "Negotiation",
      "items": [
        "6 deals",
        "2 executive escalations",
        "Close plan in progress"
      ]
    }
  ]
} as const;

function normalizePath(path: string) {
  const trimmed = String(path || "").trim();
  if (!trimmed) return "/";
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return "/";
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}

function isActive(path: string) {
  return normalizePath(path) === normalizePath(page.routePath);
}

function formatCurrency(value: unknown) {
  const amount = Number(value || 0);
  if (!Number.isFinite(amount)) return "$0";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount);
}

async function loadBoardSnapshot() {
  const response = await fetch("/api/control-plane/crm/board?limit=50", {
    method: "GET",
    cache: "no-store",
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = String((payload as any)?.error || `Control-plane proxy failed (${response.status}).`);
    throw new Error(message);
  }

  return (payload as any)?.board || null;
}

export default function TenantRoutePage() {
  const [liveBoard, setLiveBoard] = useState<any | null>(null);
  const [liveError, setLiveError] = useState("");

  useEffect(() => {
    let active = true;
    loadBoardSnapshot()
      .then((board) => {
        if (!active) return;
        setLiveBoard(board);
        setLiveError("");
      })
      .catch((error: any) => {
        if (!active) return;
        setLiveBoard(null);
        setLiveError(error?.message || "Live data unavailable.");
      });

    return () => {
      active = false;
    };
  }, []);

  const kpis = useMemo(() => {
    if (!liveBoard?.metrics) return composition.kpis;
    const metrics = liveBoard.metrics;
    return [
      { label: "Pipeline", value: formatCurrency(metrics.totalPipeline) },
      { label: "Active Deals", value: String(metrics.activeDeals || 0) },
      { label: "Win Rate", value: `${Number(metrics.winRatePct || 0)}%` },
    ];
  }, [liveBoard]);

  const columns = useMemo(() => {
    const opportunities = Array.isArray(liveBoard?.opportunities) ? liveBoard.opportunities : [];
    if (!opportunities.length) return composition.columns;

    const top = opportunities.slice(0, 9);
    const groups = [top.slice(0, 3), top.slice(3, 6), top.slice(6, 9)];
    return groups.map((items, index) => ({
      title: ["Live Pipeline", "Next Actions", "Owners"][index] || `Live Column ${index + 1}`,
      items: items.length
        ? items.map((item: any) => {
            const company = String(item?.company || "Opportunity");
            const stage = String(item?.stage || "lead");
            const owner = String(item?.owner || "Unassigned");
            return `${company} • ${stage} • ${owner}`;
          })
        : ["No records available."],
    }));
  }, [liveBoard]);

  return (
    <div className="crm-shell">
      <aside className="crm-sidebar">
        <div className="crm-brand">
          <div className="crm-brand-mark">GB</div>
          <div>
            <p className="crm-brand-name">{page.companyName}</p>
            <p className="crm-brand-sub">Client Portal</p>
          </div>
        </div>

        <nav className="crm-nav" aria-label="Primary">
          {page.navItems.map((item) => (
            <a key={`${item.label}-${item.path}`} href={item.path} className={isActive(item.path) ? "crm-nav-link active" : "crm-nav-link"}>
              <span>{item.label}</span>
              <small>{item.path}</small>
            </a>
          ))}
        </nav>
      </aside>

      <main className="crm-main">
        <header className="crm-topbar">
          <div>
            <p className="eyebrow">CRM Surface</p>
            <h1>{composition.surface.title}</h1>
            <p className="tagline">{composition.surface.description}</p>
            {liveError ? <p className="tagline" style={{ marginTop: "0.5rem" }}>{liveError}</p> : null}
          </div>
        </header>

        <section className="crm-kpis" aria-label="Surface KPIs">
          {kpis.map((kpi) => (
            <article key={kpi.label} className="crm-kpi-card">
              <p>{kpi.label}</p>
              <h3>{kpi.value}</h3>
            </article>
          ))}
        </section>

        <section className="crm-grid-three">
          {columns.map((column) => (
            <article key={column.title} className="panel panel-dark">
              <h2>{column.title}</h2>
              <ul className="crm-data-list">
                {column.items.map((item: string) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
