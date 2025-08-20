import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

type SentimentDatum = { label: string; value: number; color: string; };
interface Props { data: SentimentDatum[]; title?: string; }

const SentimentPieChart: React.FC<Props> = ({ data, title = "ทัศนคติของลูกค้า" }) => {
  // fallback ให้ครบ 3 ค่าเสมอ เพื่อกัน data ขาด
  const base: SentimentDatum[] = [
    { label: "เชิงบวก", value: 0, color: "#10B981" },
    { label: "เชิงลบ", value: 0, color: "#EF4444" },
    { label: "ไม่มีนัยสำคัญ", value: 0, color: "#6B7280" },
  ];
  const merged = base.map(b => data.find(d => d.label === b.label) ?? b);

  const Label = ({ cx, cy, midAngle, outerRadius, value, name }: any) => {
    const RAD = Math.PI / 180;
    const r = outerRadius + 30;
    const x = cx + r * Math.cos(-midAngle * RAD);
    const y = cy + r * Math.sin(-midAngle * RAD);
    return (
      <text x={x} y={y} fill="hsl(var(--foreground))"
        textAnchor={x > cx ? "start" : "end"} dominantBaseline="central"
        className="text-sm font-medium">
        {`${name} ${value}%`}
      </text>
    );
  };

  const Tip = ({ active, payload }: any) =>
    active && payload?.length ? (
      <div className="bg-white p-3 border border-border rounded-lg shadow-md">
        <p className="font-medium">{payload[0].payload.name}</p>
        <p className="text-sm text-muted-foreground">สัดส่วน: {payload[0].value}%</p>
      </div>
    ) : null;

  return (
    <Card className="chart-container-medium animate-fade-in">
      <CardHeader><CardTitle className="card-title">{title}</CardTitle></CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={merged.map(d => ({ name: d.label, value: d.value, color: d.color }))}
              cx="50%" cy="50%" innerRadius={50} outerRadius={80}
              dataKey="value" labelLine={false} label={Label}
            >
              {merged.map((e, i) => <Cell key={i} fill={e.color} />)}
            </Pie>
            <Tooltip content={<Tip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* legend */}
        <div className="mt-4 space-y-2">
          {merged.map(d => (
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
