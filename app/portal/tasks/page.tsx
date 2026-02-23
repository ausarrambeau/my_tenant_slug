'use client';

import { useRouter } from "next/navigation";
import { MarketingAgencyCRM } from "@/components/MarketingAgencyCRM";

export default function TenantRoutePage() {
  const router = useRouter();

  const tabToPath = {
    dashboard: "/",
    clients: "/portal/contacts",
    projects: "/portal/tasks",
    board: "/portal/pipeline",
    calendar: "/portal/calendar",
    messages: "/portal/messages",
    settings: "/portal/settings",
  } as const;

  return (
    <div className="crm-shell">
      <MarketingAgencyCRM
        activeTab="projects"
        onTabChange={(tab) => {
          const nextPath = tabToPath[tab] || "/";
          router.push(nextPath);
        }}
      />
    </div>
  );
}
