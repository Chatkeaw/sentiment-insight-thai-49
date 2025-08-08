
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { ChartData } from "@/types/dashboard";

interface ServiceTypeChartProps {
  data: ChartData[];
}

const ServiceTypeChart: React.FC<ServiceTypeChartProps> = ({ data }) => {
  const COLORS = [
    "hsl(var(--primary))",    // ชมพูเข้ม
    "hsl(var(--secondary))",  // ชมพูกลาง  
    "hsl(var(--accent))",     // ชมพูอ่อน
    "hsl(var(--muted))"       // เทา
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-border rounded-lg shadow-md">
          <p className="font-medium">{data.name}</p>
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
        {`${value}%`}
      </text>
    );
  };

  return (
    <Card className="chart-container-medium animate-fade-in">
      <CardHeader>
        <CardTitle className="card-title">ประเภทการให้บริการ</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={CustomLabel}
              outerRadius={80}
              innerRadius={40}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* แสดงรายละเอียดด้านล่าง */}
        <div className="mt-4 space-y-2">
          {data.map((entry, index) => (
            <div key={entry.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-foreground">{entry.name}</span>
              </div>
              <span className="font-medium text-foreground">{entry.value}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceTypeChart;
