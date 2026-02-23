const page = {
  "title": "Pipeline",
  "description": "Stage-by-stage opportunity flow with ownership and aging.",
  "routePath": "/portal/pipeline",
  "moduleKey": "pipeline",
  "companyName": "Test Six",
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

export default function TenantRoutePage() {
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
          </div>
        </header>

        <section className="crm-kpis" aria-label="Surface KPIs">
          {composition.kpis.map((kpi) => (
            <article key={kpi.label} className="crm-kpi-card">
              <p>{kpi.label}</p>
              <h3>{kpi.value}</h3>
            </article>
          ))}
        </section>

        <section className="crm-grid-three">
          {composition.columns.map((column) => (
            <article key={column.title} className="panel panel-dark">
              <h2>{column.title}</h2>
              <ul className="crm-data-list">
                {column.items.map((item) => (
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
