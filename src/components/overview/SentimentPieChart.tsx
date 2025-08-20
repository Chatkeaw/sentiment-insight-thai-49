import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface SentimentData {
  positive: { count: number; percentage: number };
  negative: { count: number; percentage: number };
  neutral: { count: number; percentage: number };
}

interface SentimentPieChartProps {
  data: SentimentData;
}

const SentimentPieChart: React.FC<SentimentPieChartProps> = ({ data }) => {
  const chartData = [
    {
      name: "เชิงบวก",
      value: data.positive.percentage,
      count: data.positive.count,
      color: "hsl(var(--success))"
    },
    {
      name: "เชิงลบ", 
      value: data.negative.percentage,
      count: data.negative.count,
      color: "hsl(var(--destructive))"
    },
    {
      name: "ไม่มีนัยสำคัญ",
      value: data.neutral.percentage,
      count: data.neutral.count,
      color: "hsl(var(--muted-foreground))"
    }
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-border rounded-lg shadow-md">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-muted-foreground">
            จำนวน: {data.count.toLocaleString()} ครั้ง
          </p>
          <p className="text-sm text-muted-foreground">
            สัดส่วน: {data.value}%
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value, name }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 30;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="hsl(var(--foreground))"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="text-sm font-medium"
      >
        {`${name} ${value}%`}
      </text>
    );
  };

  return (
    <Card className="chart-container-medium animate-fade-in">
      <CardHeader>
        <CardTitle className="card-title">ทัศนคติของความคิดเห็น</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={CustomLabel}
              outerRadius={80}
              innerRadius={40}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        
        {/* สรุปข้อมูลด้านล่าง */}
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-2">
              <div className="w-3 h-3 rounded-full bg-success"></div>
              <span className="text-sm font-medium">เชิงบวก</span>
            </div>
            <p className="text-lg font-bold text-success">{data.positive.count.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">{data.positive.percentage}%</p>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-2">
              <div className="w-3 h-3 rounded-full bg-destructive"></div>
              <span className="text-sm font-medium">เชิงลบ</span>
            </div>
            <p className="text-lg font-bold text-destructive">{data.negative.count.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">{data.negative.percentage}%</p>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-2">
              <div className="w-3 h-3 rounded-full bg-muted-foreground"></div>
              <span className="text-sm font-medium">ไม่มีนัยสำคัญ</span>
            </div>
            <p className="text-lg font-bold text-muted-foreground">
              {data.neutral.count.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">{data.neutral.percentage}%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SentimentPieChart;