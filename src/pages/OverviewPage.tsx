import React from 'react';
import KPICards from '@/components/overview/KPICards';
import ServiceTypeChart from '@/components/overview/ServiceTypeChart';
import SentimentPieChart from '@/components/overview/SentimentPieChart';
import { SatisfactionCharts } from '@/components/overview/SatisfactionCharts';
import { SentimentCharts } from '@/components/overview/SentimentCharts';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ExportButton } from '@/components/shared/ExportButton';
import { Eye, MessageCircle } from 'lucide-react';
import {
  getKPIData,
  getServiceTypeData,
  getSatisfactionData,
  getRegionSatisfactionData,
  getSentimentDataForPie,     // ⬅️ ใช้อันนี้
} from '@/data/mockData';
import { TimeFilter as TimeFilterType } from '@/types/dashboard';

interface OverviewPageProps {
  timeFilter: TimeFilterType;
  onTimeFilterChange: (filter: TimeFilterType) => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({ timeFilter, onTimeFilterChange }) => {
  const kpiData = getKPIData();
  const serviceTypeData = getServiceTypeData();
  const satisfactionData = getSatisfactionData();
  const regionSatisfactionData = getRegionSatisfactionData();

  // ⬇️ ได้อาเรย์ 3 ค่า พร้อมส่งเข้า Pie
  const sentimentData = getSentimentDataForPie();

  // ... (ส่วนกราฟเส้น/การ์ดอื่นๆ คงเดิม)

  return (
    <div className="space-y-6 max-w-full">
      {/* ... */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ง5. กราฟ Ring Pie : ทัศนคติ */}
        <SentimentPieChart data={sentimentData} />
        {/* ง6. กราฟเส้นแนวโน้มหมวดหมู่ความคิดเห็น */}
        {/* ... */}
      </div>
      {/* ... */}
    </div>
  );
};
