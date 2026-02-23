const tenantSite = {
  "branding": {
    "companyName": "Test Four",
    "logoUrl": null,
    "tagline": "Test Four client portal",
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
      "value": "support@test-four.example.com",
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
    "copyrightText": "© 2026 Test Four. All rights reserved.",
    "links": [
      {
        "label": "Privacy",
        "url": "https://test-four.example.com/privacy"
      },
      {
        "label": "Terms",
        "url": "https://test-four.example.com/terms"
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

export default function HomePage() {
  return (
    <main className="tenant-shell">
      <header className="tenant-header">
        <div>
          <p className="eyebrow">Tenant Portal</p>
          <h1>{tenantSite.branding.companyName}</h1>
          <p className="tagline">{tenantSite.branding.tagline}</p>
        </div>
      </header>

      <section className="panel">
        <h2>Navigation</h2>
        <nav className="nav-grid" aria-label="Primary">
          {tenantSite.nav.map((item) => (
            <a key={item.id} href={item.path} className="link-chip">
              <span>{item.label}</span>
              {item.moduleKey ? <small>{item.moduleKey}</small> : null}
            </a>
          ))}
        </nav>
      </section>

      <section className="panel">
        <h2>Modules</h2>
        <div className="module-grid">
          {tenantSite.modules.map((module) => (
            <article key={module.key} className="module-card">
              <div>
                <h3>{module.title}</h3>
                <p>{module.description}</p>
              </div>
              <a href={module.href} className="module-link">
                Open
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <h2>Contact</h2>
        <ul className="contact-list">
          {tenantSite.contact.map((method) => (
            <li key={`${method.type}-${method.value}`}>
              <span>{method.label}</span>
              <a href={getContactHref(method.type, method.value)}>{method.value}</a>
            </li>
          ))}
        </ul>
      </section>

      <footer className="tenant-footer">
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
  );
}
