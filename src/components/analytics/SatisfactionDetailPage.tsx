
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, LineChart, Line } from 'recharts';
import { useAnalytics } from '@/contexts/AnalyticsContext';

export const SatisfactionDetailPage: React.FC = () => {
  const { state, setSelectedRegion } = useAnalytics();

  // Mock data for regional satisfaction
  const regionalData = Array.from({ length: 18 }, (_, i) => ({
    name: `ภาค ${i + 1}`,
    value: Math.random() * 2 + 3,
  }));

  // Mock data for satisfaction trend
  const trendData = Array.from({ length: 12 }, (_, i) => ({
    month: `${i + 1}`,
    value: 3.8 + Math.random() * 0.8,
  }));

  // Mock data for rating distribution
  const ratingData = Array.from({ length: 5 }, (_, i) => ({
    rating: `${i + 1}`,
    count: Math.floor(Math.random() * 100) + 50,
  }));

  const handleRegionClick = (data: any) => {
    setSelectedRegion(data.name);
    console.log(`Selected region: ${data.name}`);
  };

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold text-foreground">
        วิเคราะห์เชิงลึก - หัวข้อการประเมินความพึงพอใจ
      </h2>
      
      {/* Regional Comparison */}
      <Card className="chart-container-large animate-fade-in">
        <CardHeader>
          <CardTitle className="card-title">
            เปรียบเทียบคะแนนความพึงพอใจ รายภาค
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={regionalData} margin={{ bottom: 40 }}>
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
              <Bar 
                dataKey="value" 
                fill="hsl(var(--primary))" 
                radius={[4, 4, 0, 0]}
                onClick={handleRegionClick}
                style={{ cursor: 'pointer' }}
              />
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

      {/* Rating Distribution */}
      <Card className="chart-container-large animate-fade-in">
        <CardHeader>
          <CardTitle className="card-title">การให้คะแนน</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={ratingData}>
              <XAxis 
                dataKey="rating"
                label={{ value: 'คะแนน', position: 'insideBottom', offset: -10 }}
                fontSize={12}
              />
              <YAxis 
                label={{ value: 'จำนวนครั้ง', angle: -90, position: 'insideLeft' }}
                fontSize={12}
              />
              <Tooltip 
                formatter={(value) => [`${value}`, 'ครั้ง']}
                labelFormatter={(label) => `คะแนน: ${label}`}
              />
              <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
