const page = {
  "title": "Help",
  "description": "UI scaffold placeholder for Help. Connect APIs and actions in a later integration step.",
  "routePath": "/portal/help"
} as const;

export default function TenantRoutePage() {
  return (
    <main className="tenant-shell">
      <section className="panel">
        <p className="eyebrow">Portal Module</p>
        <h1>{page.title}</h1>
        <p className="tagline">{page.description}</p>
      </section>

      <section className="panel">
        <h2>UI Scaffold</h2>
        <p>
          This page is generated from tenant template config for <code>{page.routePath}</code>.
        </p>
        <p>
          Wire live data and actions later through centralized control-plane APIs.
        </p>
      </section>

      <section className="panel">
        <h2>Navigation</h2>
        <div className="nav-grid">
          <a className="link-chip" href="/">
            <span>Portal Home</span>
            <small>/</small>
          </a>
        </div>
      </section>
    </main>
  );
}
