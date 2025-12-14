import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Activity } from "lucide-react";
import { kpiData } from "@/lib/mockData";

export function AlertTrendChart() {
  return (
    <div className="cyber-card p-4 h-full">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="h-5 w-5 text-primary" />
        <h2 className="font-semibold">Alert Trend (24h)</h2>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={kpiData.alertsTrend}>
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(217, 33%, 20%)"
              vertical={false}
            />
            <XAxis
              dataKey="hour"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 11 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 11 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(222, 47%, 9%)",
                border: "1px solid hsl(217, 33%, 20%)",
                borderRadius: "8px",
                fontSize: "12px",
              }}
              labelStyle={{ color: "hsl(210, 40%, 96%)" }}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="hsl(217, 91%, 60%)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorCount)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-lg font-bold text-primary">156</p>
          <p className="text-xs text-muted-foreground">Total</p>
        </div>
        <div>
          <p className="text-lg font-bold text-success">25</p>
          <p className="text-xs text-muted-foreground">Peak Hour</p>
        </div>
        <div>
          <p className="text-lg font-bold text-warning">6.5/h</p>
          <p className="text-xs text-muted-foreground">Average</p>
        </div>
      </div>
    </div>
  );
}
