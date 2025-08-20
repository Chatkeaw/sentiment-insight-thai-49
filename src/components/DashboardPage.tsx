// src/pages/DashboardPage.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, MessageSquare, AlertTriangle, Phone } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { SatisfactionDetailModal } from './SatisfactionDetailModal';
import { SentimentAnalysisModal } from './analytics/SentimentAnalysisModal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// ... (โค้ดส่วนต้นอื่น ๆ ของไฟล์คงเดิม)

const DashboardPage: React.FC<any> = ({ onPageChange }) => {
  // ... state & effect ต่าง ๆ คงเดิม

  // --------------------- แก้ตรงนี้ ---------------------
  // Data for customer sentiment donut chart (3 ค่า)
  const customerSentimentData = [
    { name: "เชิงบวก", value: 68, color: "#10B981" },
    { name: "เชิงลบ", value: 27, color: "#EF4444" },
    { name: "ไม่มีนัยสำคัญ", value: 5,  color: "#6B7280" },
  ];
  // -----------------------------------------------------

  // ... data อื่น ๆ คงเดิม

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-border rounded-lg shadow-md">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-muted-foreground">สัดส่วน: {data.value}%</p>
        </div>
      );
    }
    return null;
  };

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
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="text-sm font-medium"
      >
        {`${name} ${value}%`}
      </text>
    );
  };

  // ... ฟังก์ชัน handler ต่าง ๆ คงเดิม

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ... ส่วน header / cards / charts อื่น ๆ คงเดิม */}

      {/* ข้อคิดเห็นของลูกค้า */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">ข้อคิดเห็นของลูกค้า</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ทัศนคติของลูกค้า - Donut Chart */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-medium text-foreground">ทัศนคติของลูกค้า</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={customerSentimentData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={CustomLabel}
                    outerRadius={80}
                    innerRadius={50}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {customerSentimentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>

              {/* -------- Legend แบบภาพขวา -------- */}
              <div className="mt-4 space-y-2">
                {customerSentimentData.map((d) => (
                  <div key={d.name} className="flex items-center gap-2 text-sm">
                    <span className="inline-block w-3 h-3 rounded" style={{ background: d.color }} />
                    <span className="text-muted-foreground">{d.name}</span>
                    <span className="ml-auto font-medium">{d.value}%</span>
                  </div>
                ))}
              </div>
              {/* ----------------------------------- */}
            </CardContent>
          </Card>

          {/* ... การ์ดอีกสองใบ (หัวข้อร้องเรียน / หมวดหมู่) คงเดิม */}
        </div>

        {/* ... ส่วน chart รายพื้นที่ + legend คงเดิม */}
      </div>

      {/* ... Modals คงเดิม */}
    </div>
  );
};

export default DashboardPage;
