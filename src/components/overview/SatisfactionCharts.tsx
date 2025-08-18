
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, LineChart, Line } from 'recharts';
import { ChartData } from '@/types/dashboard';
import { useAnalytics } from '@/contexts/AnalyticsContext';
import { ExportButton } from '@/components/shared/ExportButton';
import { MonthlyComparison } from '@/components/shared/MonthlyComparison';

interface SatisfactionChartsProps {
  satisfactionData: ChartData[];
  regionSatisfactionData: ChartData[];
}

export const SatisfactionCharts: React.FC<SatisfactionChartsProps> = ({
  satisfactionData,
  regionSatisfactionData,
}) => {
  const { unlockAnalytics } = useAnalytics();

  // Generate trend data for satisfaction over time
  const trendData = Array.from({ length: 12 }, (_, i) => ({
    month: `${i + 1}`,
    value: 3.8 + Math.random() * 0.8,
  }));

  const handleSatisfactionTopicsClick = () => {
    unlockAnalytics('satisfaction-topics');
  };

  const handleRegionalSatisfactionClick = () => {
    unlockAnalytics('regional-satisfaction');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-foreground">การประเมินความพึงพอใจ</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Satisfaction Topics */}
        <Card 
          className="chart-container-small animate-fade-in cursor-pointer hover:shadow-lg transition-shadow" 
          onClick={handleSatisfactionTopicsClick}
        >
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="card-title">หัวข้อการประเมินความพึงพอใจ</CardTitle>
            <ExportButton data={satisfactionData} type="chart" filename="satisfaction-topics" />
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={satisfactionData} margin={{ left: 20, right: 20, bottom: 60 }}>
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  fontSize={11}
                  interval={0}
                />
                <YAxis 
                  domain={[0, 5]}
                  label={{ value: 'คะแนน', angle: -90, position: 'insideLeft' }}
                  fontSize={12}
                />
                <Tooltip 
                  formatter={(value) => [`${Number(value).toFixed(1)}`, 'คะแนน']}
                  labelFormatter={(label) => `หัวข้อ: ${label}`}
                />
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Satisfaction Trend */}
        <Card className="chart-container-small animate-fade-in">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="card-title">แนวโน้มคะแนนความพึงพอใจ</CardTitle>
            <ExportButton data={trendData} type="chart" filename="satisfaction-trend" />
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <XAxis 
                  dataKey="month"
                  label={{ value: 'เดือน', position: 'insideBottom', offset: -10 }}
                  fontSize={12}
                />
                <YAxis 
                  domain={[0, 5]}
                  label={{ value: 'คะแนน', angle: -90, position: 'insideLeft' }}
                  fontSize={12}
                />
                <Tooltip 
                  formatter={(value) => [`${Number(value).toFixed(1)}`, 'คะแนน']}
                  labelFormatter={(label) => `เดือน: ${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Regional Satisfaction - Large Container */}
      <Card 
        className="chart-container-large animate-fade-in cursor-pointer hover:shadow-lg transition-shadow"
        onClick={handleRegionalSatisfactionClick}
      >
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="card-title">เปรียบเทียบคะแนนความพึงพอใจ รายภาค</CardTitle>
          <ExportButton data={regionSatisfactionData} type="chart" filename="regional-satisfaction" />
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={regionSatisfactionData} margin={{ bottom: 40 }}>
              <XAxis 
                dataKey="name" 
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                domain={[0, 5]}
                label={{ value: 'คะแนน', angle: -90, position: 'insideLeft' }}
                fontSize={12}
              />
              <Tooltip 
                formatter={(value) => [`${Number(value).toFixed(1)}`, 'คะแนน']}
                labelFormatter={(label) => `${label}`}
              />
              <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
