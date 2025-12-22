import { ArrowUpRight, BellOff, Clock, TrendingUp, Activity } from "lucide-react";
import { kpiData } from "@/lib/mockData";

const kpis = [
  {
    label: "Total Alerts (24h)",
    value: kpiData.totalAlerts,
    icon: Activity,
    change: "+12%",
    trend: "up",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    label: "Escalated Alerts",
    value: kpiData.escalatedAlerts,
    icon: ArrowUpRight,
    change: "+2",
    trend: "up",
    color: "text-warning",
    bgColor: "bg-warning/10",
  },
  {
    label: "Suppressed Alerts",
    value: kpiData.suppressedAlerts,
    icon: BellOff,
    change: "+7",
    trend: "up",
    color: "text-muted-foreground",
    bgColor: "bg-muted/50",
  },
  {
    label: "Avg MTTR",
    value: kpiData.mttr,
    icon: Clock,
    change: "-0.3h",
    trend: "down",
    color: "text-info",
    bgColor: "bg-info/10",
  },
];

export function KPICards() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {kpis.map((kpi) => (
        <div
          key={kpi.label}
          className="cyber-card p-4 hover:border-primary/50 transition-colors"
        >
          <div className="flex items-start justify-between">
            <div className={`p-2 rounded-lg ${kpi.bgColor}`}>
              <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
            </div>
            <div
              className={`flex items-center gap-1 text-xs font-medium ${
                kpi.trend === "up"
                  ? kpi.label.includes("Escalated") || kpi.label.includes("Total")
                    ? "text-destructive"
                    : "text-success"
                  : "text-success"
              }`}
            >
              <TrendingUp
                className={`h-3 w-3 ${kpi.trend === "down" ? "rotate-180" : ""}`}
              />
              {kpi.change}
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold tracking-tight">{kpi.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{kpi.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
