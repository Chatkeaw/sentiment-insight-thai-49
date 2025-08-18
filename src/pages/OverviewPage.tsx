
import React from 'react';
import KPICards from '@/components/overview/KPICards';
import ServiceTypeChart from '@/components/overview/ServiceTypeChart';
import SentimentPieChart from '@/components/overview/SentimentPieChart';
import { SatisfactionCharts } from '@/components/overview/SatisfactionCharts';
import { SentimentCharts } from '@/components/overview/SentimentCharts';
import { CategoryRankings } from '@/components/overview/CategoryRankings';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExportButton } from '@/components/shared/ExportButton';
import { getKPIData, getServiceTypeData, getSatisfactionData, getRegionSatisfactionData, getSentimentData } from '@/data/mockData';
import { TimeFilter as TimeFilterType } from '@/types/dashboard';

interface OverviewPageProps {
  timeFilter: TimeFilterType['value'];
  onTimeFilterChange: (value: TimeFilterType['value']) => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({ timeFilter, onTimeFilterChange }) => {
  const kpiData = getKPIData();
  const serviceTypeData = getServiceTypeData();
  const satisfactionData = getSatisfactionData();
  const regionSatisfactionData = getRegionSatisfactionData();
  const sentimentData = getSentimentData();
  
  // Mock data สำหรับกราฟเส้นแนวโน้ม
  const trendData = Array.from({ length: 30 }, (_, i) => ({
    day: `${i + 1}`,
    forms: Math.floor(Math.random() * 50) + 20
  }));
  
  // Mock data สำหรับแนวโน้มหมวดหมู่ความคิดเห็น
  const categoryTrendData = Array.from({ length: 30 }, (_, i) => ({
    day: `${i + 1}`,
    positive: Math.floor(Math.random() * 30) + 10,
    negative: Math.floor(Math.random() * 15) + 5
  }));

  return (
    <div className="space-y-6 max-w-full">
      {/* ง1. แถว KPI — การ์ด 4 ใบเรียงต่อกัน */}
      <KPICards data={kpiData} />

      {/* แถวที่ 2: กราฟ Ring Pie ประเภทการใช้บริการ และ กราฟเส้นแนวโน้ม */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ง2. กราฟ Ring Pie : ประเภทการใช้บริการ */}
        <ServiceTypeChart data={serviceTypeData} />
        
        {/* ง3. กราฟเส้นแนวโน้ม */}
        <Card className="chart-container-medium animate-fade-in">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="card-title">แนวโน้มการส่งแบบประเมิน</CardTitle>
            <ExportButton 
              data={trendData}
              type="chart"
              elementId="form-submission-trend-chart"
              chartType="กราฟเส้นแนวโน้มการส่งแบบประเมิน"
              filename="แนวโน้ม-แบบประเมิน"
              title="แนวโน้มการส่งแบบประเมิน"
            />
          </CardHeader>
          <CardContent>
            <div id="form-submission-trend-chart">
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={trendData}>
                  <XAxis 
                    dataKey="day" 
                    fontSize={12}
                    tick={{ fill: 'hsl(var(--foreground))' }}
                  />
                  <YAxis 
                    fontSize={12}
                    tick={{ fill: 'hsl(var(--foreground))' }}
                  />
                  <Tooltip 
                    formatter={(value) => [`${value} ครั้ง`, 'จำนวนฟอร์ม']}
                    labelFormatter={(label) => `วันที่ ${label}`}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="forms" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* แถวที่ 3: ความพึงพอใจ */}
      <SatisfactionCharts 
        satisfactionData={satisfactionData}
        regionSatisfactionData={regionSatisfactionData}
      />

      {/* แถวที่ 4: ทัศนคติ และ แนวโน้มหมวดหมู่ความคิดเห็น */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ง5. กราฟ Ring Pie : ทัศนคติ */}
        <SentimentPieChart data={sentimentData} />
        
        {/* ง6. กราฟเส้นแนวโน้มหมวดหมู่ความคิดเห็น */}
        <Card className="chart-container-medium animate-fade-in">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="card-title">แนวโน้มหมวดหมู่ความคิดเห็น</CardTitle>
            <ExportButton 
              data={categoryTrendData}
              type="chart"
              elementId="comment-category-trend-chart"
              chartType="กราฟเส้นแนวโน้มหมวดหมู่ความคิดเห็น"
              filename="แนวโน้ม-หมวดหมู่ความคิดเห็น"
              title="แนวโน้มหมวดหมู่ความคิดเห็น"
            />
          </CardHeader>
          <CardContent>
            <div id="comment-category-trend-chart">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={categoryTrendData}>
                  <XAxis 
                    dataKey="day" 
                    fontSize={12}
                    tick={{ fill: 'hsl(var(--foreground))' }}
                  />
                  <YAxis 
                    fontSize={12}
                    tick={{ fill: 'hsl(var(--foreground))' }}
                  />
                  <Tooltip 
                    formatter={(value, name) => [
                      `${value} ครั้ง`, 
                      name === 'positive' ? 'เชิงบวก' : 'เชิงลบ'
                    ]}
                    labelFormatter={(label) => `วันที่ ${label}`}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="positive" 
                    stroke="hsl(var(--success))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--success))', strokeWidth: 2, r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="negative" 
                    stroke="hsl(var(--destructive))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--destructive))', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ง7. อันดับหมวดหมู่ใหญ่ และ ง8. อันดับหมวดหมู่ย่อย */}
      <CategoryRankings />
    </div>
  );
};
