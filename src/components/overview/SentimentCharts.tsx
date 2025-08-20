import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, LineChart, Line, Legend } from 'recharts';
import { useAnalytics } from '@/contexts/AnalyticsContext';
import { SentimentAnalysisModal } from '@/components/analytics/SentimentAnalysisModal';
import { ExportButton } from '@/components/shared/ExportButton';

interface SentimentData {
  positive: { count: number; percentage: number };
  negative: { count: number; percentage: number };
  neutral: { count: number; percentage: number };
}

interface SentimentChartsProps {
  sentimentData: SentimentData;
}

export const SentimentCharts: React.FC<SentimentChartsProps> = ({ sentimentData }) => {
  const { unlockAnalytics } = useAnalytics();
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);

  // Donut chart data
  const donutData = [
    { name: 'เชิงบวก', value: sentimentData.positive.count, percentage: sentimentData.positive.percentage, color: '#10B981' },
    { name: 'เชิงลบ', value: sentimentData.negative.count, percentage: sentimentData.negative.percentage, color: '#EF4444' },
    { name: 'ไม่มีนัยสำคัญ', value: sentimentData.neutral.count, percentage: sentimentData.neutral.percentage, color: '#6B7280' },
  ];

  // Regional sentiment data (18 regions x 3 bars each)
  const regionalSentimentData = Array.from({ length: 18 }, (_, i) => ({
    region: `ภาค ${i + 1}`,
    positive: Math.floor(Math.random() * 50) + 20,
    negative: Math.floor(Math.random() * 30) + 10,
    neutral: Math.floor(Math.random() * 15) + 5,
  }));

  // Trend data
  const trendData = Array.from({ length: 12 }, (_, i) => ({
    month: `${i + 1}`,
    positive: Math.floor(Math.random() * 30) + 40,
    negative: Math.floor(Math.random() * 20) + 15,
    neutral: Math.floor(Math.random() * 10) + 5,
  }));

  const handleRegionalSentimentClick = () => {
    unlockAnalytics('regional-sentiment');
  };

  const handleSentimentAnalysisClick = () => {
    console.log('Opening sentiment analysis modal');
    setIsAnalysisModalOpen(true);
  };

  const handleCloseModal = () => {
    console.log('Closing sentiment analysis modal');
    setIsAnalysisModalOpen(false);
  };

  const handleViewFeedback = (region?: string) => {
    console.log(`Navigate to feedback page with region filter: ${region}`);
    setIsAnalysisModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-foreground">ทัศนคติ</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sentiment Donut Chart - Updated to trigger modal */}
        <Card className="chart-container-small animate-fade-in">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="card-title">หัวข้อที่ลูกค้าร้องเรียน</CardTitle>
            <ExportButton 
              data={donutData}
              type="chart"
              elementId="sentiment-complaints-chart"
              chartType="กราฟวงกลมหัวข้อร้องเรียน"
              filename="ร้องเรียน-หัวข้อ"
              title="หัวข้อที่ลูกค้าร้องเรียน"
            />
          </CardHeader>
          <CardContent>
            <div id="sentiment-complaints-chart" className="flex items-center">
              <div className="flex-1">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={donutData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {donutData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value, name) => [`${value} ครั้ง`, name]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="ml-4 space-y-3">
                {donutData.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <div className="text-sm">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-muted-foreground">
                        {item.value.toLocaleString()} ({item.percentage}%)
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 text-center">
              <button 
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm"
                onClick={handleSentimentAnalysisClick}
              >
                ดูรายละเอียด
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Sentiment Trend */}
        <Card className="chart-container-small animate-fade-in">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="card-title">แนวโน้มทัศนคติต่อการให้บริการ</CardTitle>
            <ExportButton 
              data={trendData}
              type="chart"
              elementId="sentiment-trend-chart"
              chartType="กราฟเส้นแนวโน้มทัศนคติ"
              filename="แนวโน้ม-ทัศนคติ"
              title="แนวโน้มทัศนคติต่อการให้บริการ"
            />
          </CardHeader>
          <CardContent>
            <div id="sentiment-trend-chart">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <XAxis 
                    dataKey="month"
                    label={{ value: 'เดือน', position: 'insideBottom', offset: -10 }}
                    fontSize={12}
                  />
                  <YAxis 
                    label={{ value: 'ความถี่ (ครั้ง)', angle: -90, position: 'insideLeft' }}
                    fontSize={12}
                  />
                  <Tooltip 
                    formatter={(value, name) => [
                      `${value} ครั้ง`, 
                      name === 'positive' ? 'เชิงบวก' : name === 'negative' ? 'เชิงลบ' : 'ไม่มีนัยสำคัญ'
                    ]}
                    labelFormatter={(label) => `เดือน: ${label}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="positive" 
                    stroke="#10B981" 
                    strokeWidth={3}
                    dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="negative" 
                    stroke="#EF4444" 
                    strokeWidth={3}
                    dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="neutral" 
                    stroke="#6B7280" 
                    strokeWidth={3}
                    dot={{ fill: '#6B7280', strokeWidth: 2, r: 4 }}
                  />
                  <Legend 
                    formatter={(value) => 
                      value === 'positive' ? 'เชิงบวก' : 
                      value === 'negative' ? 'เชิงลบ' : 'ไม่มีนัยสำคัญ'
                    }
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Regional Sentiment - Large Container */}
      <Card 
        className="chart-container-large animate-fade-in cursor-pointer hover:shadow-lg transition-shadow"
        onClick={handleRegionalSentimentClick}
      >
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="card-title">ทัศนคติการให้บริการ รายภาค</CardTitle>
          <ExportButton 
            data={regionalSentimentData}
            type="chart"
            elementId="regional-sentiment-chart"
            chartType="กราฟแท่งทัศนคติรายภาค"
            filename="ทัศนคติ-รายภาค"
            title="ทัศนคติการให้บริการ รายภาค"
          />
        </CardHeader>
        <CardContent>
          <div id="regional-sentiment-chart">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={regionalSentimentData} margin={{ bottom: 40 }}>
                <XAxis 
                  dataKey="region" 
                  fontSize={12}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  label={{ value: 'ความถี่ (ครั้ง)', angle: -90, position: 'insideLeft' }}
                  fontSize={12}
                />
                <Tooltip 
                  formatter={(value, name) => [
                    `${value} ครั้ง`, 
                    name === 'positive' ? 'เชิงบวก' : name === 'negative' ? 'เชิงลบ' : 'ไม่มีนัยสำคัญ'
                  ]}
                  labelFormatter={(label) => `${label}`}
                />
                <Bar dataKey="positive" fill="#10B981" radius={[2, 2, 0, 0]} />
                <Bar dataKey="negative" fill="#EF4444" radius={[2, 2, 0, 0]} />
                <Bar dataKey="neutral" fill="#6B7280" radius={[2, 2, 0, 0]} />
                <Legend 
                  formatter={(value) => 
                    value === 'positive' ? 'เชิงบวก' : 
                    value === 'negative' ? 'เชิงลบ' : 'ไม่มีนัยสำคัญ'
                  }
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Sentiment Analysis Modal */}
      <SentimentAnalysisModal
        isOpen={isAnalysisModalOpen}
        onClose={handleCloseModal}
        onViewFeedback={handleViewFeedback}
      />
    </div>
  );
};
