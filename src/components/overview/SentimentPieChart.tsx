// src/components/overview/SentimentPieChart.tsx
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

type SentimentDatum = {
  label: string;   // ไทย: เชิงบวก / เชิงลบ / ไม่มีนัยสำคัญ
  value: number;   // เปอร์เซ็นต์
  color: string;   // สีของ slice
};

interface Props {
  data: SentimentDatum[];
  title?: string;
}

const SentimentPieChart: React.FC<Props> = ({ data, title = "ทัศนคติของลูกค้า" }) => {
  const CustomLabel = ({ cx, cy, midAngle, outerRadius, value, name }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 30;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text
        x={x}
        y={y}
        fill="hsl(var(--foreground))"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        className="text-sm font-medium"
      >
        {`${name} ${value}%`}
      </text>
    );
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-border rounded-lg shadow-md">
          <p className="font-medium">{d.label}</p>
          <p className="text-sm text-muted-foreground">สัดส่วน: {d.value}%</p>
        </div>
      );
    }
    return null;
  };

  // ป้องกันข้อมูลไม่ครบ 3 ค่า
  const filled = [
    { label: "เชิงบวก", value: 0, color: "#10B981" },
    { label: "เชิงลบ", value: 0, color: "#EF4444" },
    { label: "ไม่มีนัยสำคัญ", value: 0, color: "#6B7280" },
  ].map(base => data.find(d => d.label === base.label) ?? base);

  return (
    <Card className="chart-container-medium animate-fade-in">
      <CardHeader>
        <CardTitle className="card-title">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={filled.map(d => ({ name: d.label, value: d.value, color: d.color }))}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={CustomLabel}
              outerRadius={80}
              innerRadius={50}
              dataKey="value"
            >
              {filled.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* legend */}
        <div className="mt-4 space-y-2">
          {filled.map((d) => (
            <div key={d.label} className="flex items-center gap-2 text-sm">
              <span className="inline-block w-3 h-3 rounded" style={{ background: d.color }} />
              <span className="text-muted-foreground">{d.label}</span>
              <span className="ml-auto font-medium">{d.value}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SentimentPieChart;
