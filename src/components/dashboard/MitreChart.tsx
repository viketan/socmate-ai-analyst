import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Target } from "lucide-react";
import { mitreDistribution } from "@/lib/mockData";

const COLORS = [
  "hsl(217, 91%, 60%)",
  "hsl(38, 92%, 50%)",
  "hsl(0, 72%, 51%)",
  "hsl(142, 71%, 45%)",
  "hsl(280, 65%, 60%)",
];

export function MitreChart() {
  return (
    <div className="cyber-card p-4 h-full">
      <div className="flex items-center gap-2 mb-4">
        <Target className="h-5 w-5 text-primary" />
        <h2 className="font-semibold">MITRE ATT&CK Distribution</h2>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={mitreDistribution}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {mitreDistribution.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  stroke="hsl(222, 47%, 6%)"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(222, 47%, 9%)",
                border: "1px solid hsl(217, 33%, 20%)",
                borderRadius: "8px",
                fontSize: "12px",
              }}
              formatter={(value: number, name: string) => [
                `${value}%`,
                name,
              ]}
            />
            <Legend
              layout="vertical"
              align="right"
              verticalAlign="middle"
              iconType="circle"
              iconSize={8}
              formatter={(value) => (
                <span className="text-xs text-muted-foreground">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 space-y-2">
        {mitreDistribution.slice(0, 3).map((item, index) => (
          <div
            key={item.name}
            className="flex items-center justify-between text-sm"
          >
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: COLORS[index] }}
              />
              <span className="text-muted-foreground">{item.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">{item.value}%</span>
              <div className="flex gap-1">
                {item.techniques.map((t) => (
                  <span
                    key={t}
                    className="text-[10px] font-mono text-primary/70"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
