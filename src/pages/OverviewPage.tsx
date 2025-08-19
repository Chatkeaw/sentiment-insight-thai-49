import React from 'react';
import KPICards from '@/components/overview/KPICards';
import ServiceTypeChart from '@/components/overview/ServiceTypeChart';
import SentimentPieChart from '@/components/overview/SentimentPieChart';
import { SatisfactionCharts } from '@/components/overview/SatisfactionCharts';
import { SentimentCharts } from '@/components/overview/SentimentCharts';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import ExportButton from '@/components/shared/ExportButton';
import { Eye, MessageCircle } from 'lucide-react';
import { getKPIData, getServiceTypeData, getSatisfactionData, getRegionSatisfactionData, getSentimentData } from '@/data/mockData';
import { TimeFilter as TimeFilterType } from '@/types/dashboard';

// สีสำหรับการจัดอันดับ - Market Conduct เป็นสีแดงเข้มสุด แล้วจางลงตามลำดับ
const RANKING_COLORS = [
  '#DC2626', // Market Conduct - สีแดงเข้มที่สุด
  '#EF4444', // อันดับ 2
  '#F87171', // อันดับ 3
  '#FCA5A5', // อันดับ 4
  '#FECACA', // อันดับ 5
  '#FEE2E2', // อันดับ 6
  '#FEF2F2'  // อันดับ 7
];

// Mock data สำหรับหัวข้อที่ลูกค้าร้องเรียน
const getComplaintTopicsData = () => [
  { id: 1, topic: 'Market Conduct', count: 245, percentage: 35.2, color: RANKING_COLORS[0] },
  { id: 2, topic: 'การชำระเงินและค่าธรรมเนียม', count: 198, percentage: 28.4, color: RANKING_COLORS[1] },
  { id: 3, topic: 'คุณภาพการให้บริการ', count: 156, percentage: 22.4, color: RANKING_COLORS[2] },
  { id: 4, topic: 'ระบบเทคโนโลยี', count: 134, percentage: 19.2, color: RANKING_COLORS[3] },
  { id: 5, topic: 'การสื่อสารและข้อมูล', count: 89, percentage: 12.8, color: RANKING_COLORS[4] },
  { id: 6, topic: 'สิ่งอำนวยความสะดวก', count: 67, percentage: 9.6, color: RANKING_COLORS[5] },
  { id: 7, topic: 'อื่นๆ', count: 34, percentage: 4.9, color: RANKING_COLORS[6] }
];

// Mock data สำหรับหมวดหมู่ที่ลูกค้าร้องเรียน
const getComplaintCategoriesData = () => [
  { id: 1, category: 'การบริการที่เคาน์เตอร์', count: 189, percentage: 27.1, color: RANKING_COLORS[0] },
  { id: 2, category: 'ระบบ Mobile Banking', count: 167, percentage: 24.0, color: RANKING_COLORS[1] },
  { id: 3, category: 'การทำธุรกรรมออนไลน์', count: 145, percentage: 20.8, color: RANKING_COLORS[2] },
  { id: 4, category: 'บัตรเครดิต/เดบิต', count: 123, percentage: 17.7, color: RANKING_COLORS[3] },
  { id: 5, category: 'การปรึกษาและแนะนำ', count: 98, percentage: 14.1, color: RANKING_COLORS[4] },
  { id: 6, category: 'สภาพแวดล้อมสาขา', count: 76, percentage: 10.9, color: RANKING_COLORS[5] },
  { id: 7, category: 'เวลาให้บริการ', count: 45, percentage: 6.5, color: RANKING_COLORS[6] }
];

interface RankingItemProps {
  rank: number;
  title: string;
  count: number;
  percentage: number;
  color: string;
  onViewDetails: () => void;
  onViewComments: () => void;
}

const RankingItem: React.FC<RankingItemProps> = ({ 
  rank, 
  title, 
  count, 
  percentage, 
  color, 
  onViewDetails, 
  onViewComments 
}) => (
  <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
    <div className="flex items-center space-x-3 flex-1">
      <div 
        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold"
        style={{ backgroundColor: color }}
      >
        {rank}
      </div>
      <div className="flex-1">
        <div className="font-medium text-gray-900">{title}</div>
        <div className="flex items-center space-x-4 mt-1">
          <span className="text-lg font-bold" style={{ color: color }}>
            {count} <span className="text-sm font-normal text-gray-500">ครั้ง</span>
          </span>
          <div className="flex-1 max-w-32">
            <Progress value={percentage} className="h-2" style={{ backgroundColor: `${color}20` }} />
          </div>
          <span className="text-sm text-gray-500">{percentage}%</span>
        </div>
      </div>
    </div>
    <div className="flex items-center space-x-2 ml-4">
      <button
        onClick={onViewDetails}
        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
        title="ดูรายละเอียด"
      >
        <Eye size={16} />
      </button>
      <button
        onClick={onViewComments}
        className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
        title="ดูความคิดเห็น"
      >
        <MessageCircle size={16} />
      </button>
    </div>
  </div>
);

const CategoryRankings: React.FC = () => {
  const complaintTopicsData = getComplaintTopicsData();
  const complaintCategoriesData = getComplaintCategoriesData();

  const handleViewDetails = (type: 'topic' | 'category', item: any) => {
    console.log(`View details for ${type}:`, item);
    // TODO: Navigate to details page with filtered data
  };

  const handleViewComments = (type: 'topic' | 'category', item: any) => {
    console.log(`View comments for ${type}:`, item);
    // TODO: Navigate to Customer Feedback Insights page with pre-filtered data
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* หัวข้อที่ลูกค้าร้องเรียน */}
      <Card className="animate-fade-in">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="card-title">หัวข้อที่ลูกค้าร้องเรียน</CardTitle>
          <ExportButton 
            data={complaintTopicsData}
            type="table"
            elementId="complaint-topics-ranking"
            filename="หัวข้อที่ลูกค้าร้องเรียน"
            title="อันดับหัวข้อที่ลูกค้าร้องเรียน"
          />
        </CardHeader>
        <CardContent>
          <div id="complaint-topics-ranking" className="space-y-1">
            {complaintTopicsData.map((item, index) => (
              <RankingItem
                key={item.id}
                rank={index + 1}
                title={item.topic}
                count={item.count}
                percentage={item.percentage}
                color={item.color}
                onViewDetails={() => handleViewDetails('topic', item)}
                onViewComments={() => handleViewComments('topic', item)}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* หมวดหมู่ที่ลูกค้าร้องเรียน */}
      <Card className="animate-fade-in">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="card-title">หมวดหมู่ที่ลูกค้าร้องเรียน</CardTitle>
          <ExportButton 
            data={complaintCategoriesData}
            type="table"
            elementId="complaint-categories-ranking"
            filename="หมวดหมู่ที่ลูกค้าร้องเรียน"
            title="อันดับหมวดหมู่ที่ลูกค้าร้องเรียน"
          />
        </CardHeader>
        <CardContent>
          <div id="complaint-categories-ranking" className="space-y-1">
            {complaintCategoriesData.map((item, index) => (
              <RankingItem
                key={item.id}
                rank={index + 1}
                title={item.category}
                count={item.count}
                percentage={item.percentage}
                color={item.color}
                onViewDetails={() => handleViewDetails('category', item)}
                onViewComments={() => handleViewComments('category', item)}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

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