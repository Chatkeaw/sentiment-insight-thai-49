
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import TimeFilter from '@/components/TimeFilter';
import { useAnalytics } from '@/contexts/AnalyticsContext';
import { SatisfactionDetailPage } from '@/components/analytics/SatisfactionDetailPage';
import { RegionalSatisfactionPage } from '@/components/analytics/RegionalSatisfactionPage';
import { SentimentDetailPage } from '@/components/analytics/SentimentDetailPage';
import { TimeFilter as TimeFilterType } from '@/types/dashboard';

interface AnalyticsPageProps {
  onBack: () => void;
  timeFilter: TimeFilterType['value'];
  onTimeFilterChange: (value: TimeFilterType['value']) => void;
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ 
  onBack, 
  timeFilter, 
  onTimeFilterChange 
}) => {
  const { state } = useAnalytics();

  const renderContent = () => {
    switch (state.lastClickedChart) {
      case 'satisfaction-topics':
        return <SatisfactionDetailPage />;
      case 'regional-satisfaction':
        return <RegionalSatisfactionPage />;
      case 'regional-sentiment':
        return <SentimentDetailPage />;
      default:
        return (
          <div className="flex items-center justify-center min-h-96">
            <p className="text-lg text-muted-foreground">เลือกกราฟจากหน้าสรุปภาพรวมเพื่อดูข้อมูลเชิงลึก</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-full">
      {/* Header with Back Button and Time Filter */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          กลับ
        </Button>
        
        <TimeFilter
          value={timeFilter}
          onChange={onTimeFilterChange}
        />
      </div>

      {/* Content */}
      {renderContent()}
    </div>
  );
};
