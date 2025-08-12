
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import TimeFilter from '@/components/TimeFilter';
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
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold text-gray-700">ติดตามผลดำเนินงาน</h2>
          <p className="text-lg text-muted-foreground">เนื้อหาจะถูกเพิ่มในภายหลัง</p>
        </div>
      </div>
    </div>
  );
};
