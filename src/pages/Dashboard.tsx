import { KPICards } from "@/components/dashboard/KPICards";
import { AlertsTable } from "@/components/dashboard/AlertsTable";
import { MitreChart } from "@/components/dashboard/MitreChart";
import { AlertTrendChart } from "@/components/dashboard/AlertTrendChart";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Security Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Real-time overview of your security posture
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* KPI Cards */}
      <KPICards />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AlertTrendChart />
        <MitreChart />
      </div>

      {/* Alerts Table */}
      <AlertsTable />
    </div>
  );
}
