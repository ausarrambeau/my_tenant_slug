'use client';

import { MarketingAgencyCRM } from "@/components/MarketingAgencyCRM";

export default function TenantRoutePage() {
  return (
    <div className="crm-shell">
      <MarketingAgencyCRM activeTab="settings" />
    </div>
  );
}
