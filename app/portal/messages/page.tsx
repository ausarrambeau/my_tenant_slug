const page = {
  "title": "Messages",
  "description": "Review and respond to communication threads. Configured: allow_email=true, allow_sms=true.",
  "routePath": "/portal/messages",
  "companyName": "Test Five",
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
            <p className="eyebrow">Portal Module</p>
            <h1>{page.title}</h1>
            <p className="tagline">{page.description}</p>
          </div>
        </header>

        <section className="crm-grid-two">
          <article className="panel panel-dark">
            <h2>Module Workflow</h2>
            <p>This module is pre-rendered for <code>{page.routePath}</code> and follows the selected dark CRM template style.</p>
            <div className="crm-checklist">
              <div>
                <span>Lead intake</span>
                <strong>Ready</strong>
              </div>
              <div>
                <span>Assignment + SLA</span>
                <strong>Ready</strong>
              </div>
              <div>
                <span>Automation hooks</span>
                <strong>Placeholder</strong>
              </div>
            </div>
          </article>

          <article className="panel panel-dark">
            <h2>UI Scaffold</h2>
            <p>
              This page is generated from tenant template config for <code>{page.routePath}</code>.
            </p>
            <p>
              Wire live data and actions later through centralized control-plane APIs.
            </p>
          </article>
        </section>
      </main>
    </div>
  );
}
