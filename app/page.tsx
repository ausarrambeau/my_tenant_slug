const tenantSite = {
  "templatePackId": "template-01-dark-crm",
  "branding": {
    "companyName": "Test Five",
    "logoUrl": null,
    "tagline": "Test Five client portal",
    "primaryColor": "#0E7490",
    "secondaryColor": "#F1F5F9",
    "accentColor": "#F97316"
  },
  "nav": [
    {
      "id": "dashboard",
      "label": "Dashboard",
      "path": "/portal/dashboard",
      "external": false,
      "moduleKey": "dashboard"
    },
    {
      "id": "help",
      "label": "Help",
      "path": "/portal/help",
      "external": false,
      "moduleKey": null
    },
    {
      "id": "messages",
      "label": "Messages",
      "path": "/portal/messages",
      "external": false,
      "moduleKey": "messages"
    }
  ],
  "modules": [
    {
      "key": "dashboard",
      "title": "Dashboard",
      "description": "Monitor account health and KPI snapshots. Configured: show_kpis=true.",
      "href": "/portal/dashboard"
    },
    {
      "key": "messages",
      "title": "Messages",
      "description": "Review and respond to communication threads. Configured: allow_email=true, allow_sms=true.",
      "href": "/portal/messages"
    },
    {
      "key": "support",
      "title": "Support",
      "description": "Open and monitor tenant support requests. Configured: ticket_form_enabled=true.",
      "href": "/portal/support"
    }
  ],
  "contact": [
    {
      "type": "email",
      "label": "Support",
      "value": "support@test-five.example.com",
      "primary": true
    },
    {
      "type": "phone",
      "label": "Main Line",
      "value": "+1-555-123-4567",
      "primary": false
    }
  ],
  "footer": {
    "copyrightText": "© 2026 Test Five. All rights reserved.",
    "links": [
      {
        "label": "Privacy",
        "url": "https://test-five.example.com/privacy"
      },
      {
        "label": "Terms",
        "url": "https://test-five.example.com/terms"
      }
    ]
  }
} as const;

function getContactHref(type: string, value: string) {
  const normalized = type.toLowerCase();
  if (normalized === "email") return `mailto:${value}`;
  if (normalized === "phone" || normalized === "sms") return `tel:${value}`;
  return value.startsWith("http") ? value : `https://${value}`;
}

const stats = [
  { label: "Modules", value: String(tenantSite.modules.length) },
  { label: "Nav Links", value: String(tenantSite.nav.filter((item) => !item.external).length) },
  { label: "Contact Methods", value: String(tenantSite.contact.length) },
];

export default function HomePage() {
  return (
    <div className="crm-shell">
      <aside className="crm-sidebar">
        <div className="crm-brand">
          <div className="crm-brand-mark">GB</div>
          <div>
            <p className="crm-brand-name">{tenantSite.branding.companyName}</p>
            <p className="crm-brand-sub">Dark CRM Template</p>
          </div>
        </div>

        <nav className="crm-nav" aria-label="Primary">
          {tenantSite.nav.filter((item) => !item.external).map((item) => (
            <a key={item.id} href={item.path} className="crm-nav-link">
              <span>{item.label}</span>
              <small>{item.path}</small>
            </a>
          ))}
        </nav>
      </aside>

      <main className="crm-main">
        <header className="crm-topbar">
          <div>
            <p className="eyebrow">Tenant Portal</p>
            <h1>{tenantSite.branding.companyName}</h1>
            <p className="tagline">{tenantSite.branding.tagline}</p>
          </div>
        </header>

        <section className="crm-kpis" aria-label="Dashboard KPIs">
          {stats.map((stat) => (
            <article key={stat.label} className="crm-kpi-card">
              <p>{stat.label}</p>
              <h3>{stat.value}</h3>
            </article>
          ))}
        </section>

        <section className="crm-grid-two">
          <article className="panel panel-dark">
            <h2>Modules</h2>
            <div className="crm-module-list">
              {tenantSite.modules.map((module) => (
                <a key={module.key} href={module.href} className="crm-module-row">
                  <div>
                    <h3>{module.title}</h3>
                    <p>{module.description}</p>
                  </div>
                  <span>Open</span>
                </a>
              ))}
            </div>
          </article>

          <article className="panel panel-dark">
            <h2>Contact</h2>
            <ul className="contact-list contact-list-dark">
              {tenantSite.contact.map((method) => (
                <li key={`${method.type}-${method.value}`}>
                  <span>{method.label}</span>
                  <a href={getContactHref(method.type, method.value)}>{method.value}</a>
                </li>
              ))}
            </ul>
          </article>
        </section>

        <footer className="tenant-footer tenant-footer-dark">
          <p>{tenantSite.footer.copyrightText}</p>
          <div className="footer-links">
            {tenantSite.footer.links.map((link) => (
              <a key={`${link.label}-${link.url}`} href={link.url}>
                {link.label}
              </a>
            ))}
          </div>
        </footer>
      </main>
    </div>
  );
}
