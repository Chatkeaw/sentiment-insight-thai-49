
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, LineChart, Line } from 'recharts';
import { useAnalytics } from '@/contexts/AnalyticsContext';

export const RegionalSatisfactionPage: React.FC = () => {
  const { state, setSelectedDistrict } = useAnalytics();

  // Mock data for district satisfaction
  const districtData = Array.from({ length: 8 }, (_, i) => ({
    name: `เขต ${i + 1}`,
    value: Math.random() * 50 + 25,
  }));

  // Mock satisfaction topics data
  const topicsData = [
    { name: 'การดูแลเอาใจใส่', value: 4.2 },
    { name: 'การตอบคำถามและให้คำแนะนำ', value: 4.0 },
    { name: 'ความรวดเร็วในการให้บริการ', value: 3.8 },
    { name: 'ความถูกต้องในการทำธุรกรรม', value: 4.1 },
    { name: 'ความพร้อมของเครื่องมือให้บริการ', value: 3.9 },
    { name: 'สภาพแวดล้อมของสาขา', value: 3.7 },
    { name: 'ความพึงพอใจในการเข้าใช้บริการ', value: 4.0 },
  ];

  // Mock trend data
  const trendData = Array.from({ length: 12 }, (_, i) => ({
    month: `${i + 1}`,
    value: 3.8 + Math.random() * 0.8,
  }));

  const handleDistrictClick = (data: any) => {
    setSelectedDistrict(data.name);
    console.log(`Selected district: ${data.name}`);
  };

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold text-foreground">
        วิเคราะห์เชิงลึก - ความพึงพอใจรายภาค
      </h2>
      
      {/* District Satisfaction */}
      <Card className="chart-container-large animate-fade-in">
        <CardHeader>
          <CardTitle className="card-title">ความพึงพอใจรายเขต</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={districtData} margin={{ bottom: 40 }}>
              <XAxis 
                dataKey="name" 
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                label={{ value: 'ความถี่', angle: -90, position: 'insideLeft' }}
                fontSize={12}
              />
              <Tooltip 
                formatter={(value) => [`${value}`, 'ครั้ง']}
                labelFormatter={(label) => `${label}`}
              />
              <Bar 
                dataKey="value" 
                fill="hsl(var(--primary))" 
                radius={[4, 4, 0, 0]}
                onClick={handleDistrictClick}
                style={{ cursor: 'pointer' }}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Satisfaction Topics */}
      <Card className="chart-container-large animate-fade-in">
        <CardHeader>
          <CardTitle className="card-title">หัวข้อประเมินความพึงพอใจ</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={topicsData} margin={{ left: 20, right: 20, bottom: 100 }}>
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={120}
                fontSize={11}
                interval={0}
              />
              <YAxis 
                label={{ value: 'ความถี่', angle: -90, position: 'insideLeft' }}
                fontSize={12}
              />
              <Tooltip 
                formatter={(value) => [`${value}`, 'ครั้ง']}
                labelFormatter={(label) => `หัวข้อ: ${label}`}
              />
              <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Satisfaction Trend */}
      <Card className="chart-container-large animate-fade-in">
        <CardHeader>
          <CardTitle className="card-title">แนวโน้มคะแนนความพึงพอใจ</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
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
  );
};
