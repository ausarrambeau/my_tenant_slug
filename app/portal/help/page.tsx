const page = {
  "title": "Help",
  "description": "Help workspace generated from tenant navigation and module policies.",
  "routePath": "/portal/help",
  "moduleKey": null,
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
    "key": "dashboard",
    "path": "/portal/help",
    "title": "Help",
    "description": "Help workspace generated from tenant navigation and module policies."
  },
  "kpis": [
    {
      "label": "Revenue This Week",
      "value": "$86.4K"
    },
    {
      "label": "Qualified Leads",
      "value": "42"
    },
    {
      "label": "Overdue Tasks",
      "value": "7"
    }
  ],
  "columns": [
    {
      "title": "Today",
      "items": [
        "08:30 standup",
        "Follow-up sweep",
        "Proposal approvals"
      ]
    },
    {
      "title": "Watchlist",
      "items": [
        "2 at-risk accounts",
        "1 SLA breach",
        "5 stale leads"
      ]
    },
    {
      "title": "Automation",
      "items": [
        "Lead router healthy",
        "Reminder jobs healthy",
        "Sync queue: 2 min"
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
