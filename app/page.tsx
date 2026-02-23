'use client';

import { MarketingAgencyCRM } from "@/components/MarketingAgencyCRM";

export default function HomePage() {
  return (
    <div className="crm-shell">
      <MarketingAgencyCRM activeTab="dashboard" />
    </div>
  );
}
