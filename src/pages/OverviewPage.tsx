
import React from 'react';
import TimeFilter from '@/components/TimeFilter';
import KPICards from '@/components/overview/KPICards';
import ServiceTypeChart from '@/components/overview/ServiceTypeChart';
import { SatisfactionCharts } from '@/components/overview/SatisfactionCharts';
import { SentimentCharts } from '@/components/overview/SentimentCharts';
import { CategoryRankings } from '@/components/overview/CategoryRankings';
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

  return (
    <div className="space-y-6 max-w-full">
      {/* Time Filter */}
      <div className="flex justify-end">
        <TimeFilter
          value={timeFilter}
          onChange={onTimeFilterChange}
        />
      </div>

      {/* KPI Cards and Service Type Chart - Same Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <KPICards data={kpiData} />
        </div>
        <div className="xl:col-span-1">
          <ServiceTypeChart data={serviceTypeData} />
        </div>
      </div>

      {/* Satisfaction Charts */}
      <SatisfactionCharts 
        satisfactionData={satisfactionData}
        regionSatisfactionData={regionSatisfactionData}
      />

      {/* Sentiment Charts */}
      <SentimentCharts sentimentData={sentimentData} />

      {/* Category Rankings */}
      <CategoryRankings />
    </div>
  );
};
