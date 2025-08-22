
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CascadingFilter } from '@/components/filters/CascadingFilter';
import { LocationFilters } from '@/types/locations';

// Generate mock data for bar chart based on selected filters
const generateRegionalData = (locationFilters: LocationFilters) => {
  if (locationFilters.regionId === "all") {
    // Show all regions
    return Array.from({ length: 18 }, (_, i) => ({
      region: `ภาค ${i + 1}`,
      positive: Math.floor(Math.random() * 100) + 50,
      negative: Math.floor(Math.random() * 50) + 10,
      neutral: Math.floor(Math.random() * 30) + 5
    }));
  } else {
    // Show selected region only
    const regionNumber = locationFilters.regionId.split('_')[1];
    return [{
      region: `ภาค ${regionNumber}`,
      positive: Math.floor(Math.random() * 100) + 50,
      negative: Math.floor(Math.random() * 50) + 10,
      neutral: Math.floor(Math.random() * 30) + 5
    }];
  }
};

export const RegionalPage: React.FC = () => {
  const [locationFilters, setLocationFilters] = useState<LocationFilters>({
    regionId: "all",
    provinceId: "all",
    districtId: "all",
    branchId: "all"
  });
  
  const chartData = generateRegionalData(locationFilters);

  const handleLocationFiltersChange = (filters: LocationFilters) => {
    setLocationFilters(filters);
  };

  const getChartTitle = () => {
    if (locationFilters.regionId !== "all") {
      const regionNumber = locationFilters.regionId.split('_')[1];
      return `ข้อคิดเห็นลูกค้า - ภาคที่ ${regionNumber}`;
    }
    return "ข้อคิดเห็นลูกค้า - ทุกภาค";
  };

  return (
    <div className="min-h-screen p-6 space-y-6">
      <div className="flex flex-col space-y-4">
        <h1 className="text-3xl font-bold text-foreground">
          กราฟข้อคิดเห็นลูกค้า รายพื้นที่
        </h1>

        {/* Location Filter */}
        <CascadingFilter
          options={{
            showRegion: true,
            showProvince: false,
            showDistrict: false,
            showBranch: false,
            regionLabel: "ภาค"
          }}
          onFiltersChange={handleLocationFiltersChange}
          title="เลือกภาค"
        />

        {/* Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>{getChartTitle()}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="region" 
                  stroke="hsl(var(--foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--foreground))"
                  fontSize={12}
                  label={{ value: 'จำนวน (ครั้ง)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  formatter={(value, name) => [
                    `${value} ครั้ง`,
                    name === 'positive' ? 'เชิงบวก' : name === 'negative' ? 'เชิงลบ' : 'กลางๆ'
                  ]}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--foreground))'
                  }}
                />
                <Bar dataKey="positive" fill="#10B981" name="positive" />
                <Bar dataKey="negative" fill="#EF4444" name="negative" />
              </BarChart>
            </ResponsiveContainer>

            {/* Legend */}
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-sm text-muted-foreground">เชิงบวก</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span className="text-sm text-muted-foreground">เชิงลบ</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
