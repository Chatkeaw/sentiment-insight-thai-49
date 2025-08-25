
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CascadingFilter } from '@/components/filters/CascadingFilter';
import { LocationFilters } from '@/types/locations';
import { RotateCcw } from 'lucide-react';

// Generate mock data for bar chart based on selected filters
const generateRegionalData = (locationFilters: LocationFilters) => {
  // Default: Show all regions when no filters are selected
  if (locationFilters.regionId === "all") {
    return Array.from({ length: 18 }, (_, i) => ({
      name: `ภาค ${i + 1}`,
      positive: Math.floor(Math.random() * 100) + 50,
      negative: Math.floor(Math.random() * 50) + 10,
    }));
  }
  
  // Region selected: Show provinces in that region
  if (locationFilters.regionId !== "all" && locationFilters.provinceId === "all") {
    return Array.from({ length: 6 }, (_, i) => ({
      name: `จังหวัด ${String.fromCharCode(65 + i)}`,
      positive: Math.floor(Math.random() * 80) + 30,
      negative: Math.floor(Math.random() * 40) + 5,
    }));
  }
  
  // Province selected: Show districts in that province
  if (locationFilters.provinceId !== "all" && locationFilters.districtId === "all") {
    return Array.from({ length: 8 }, (_, i) => ({
      name: `เขต ${i + 1}`,
      positive: Math.floor(Math.random() * 60) + 20,
      negative: Math.floor(Math.random() * 30) + 3,
    }));
  }
  
  // District selected: Show branches in that district
  if (locationFilters.districtId !== "all" && locationFilters.branchId === "all") {
    return Array.from({ length: 5 }, (_, i) => ({
      name: `หน่วยบริการ ${i + 1}`,
      positive: Math.floor(Math.random() * 40) + 10,
      negative: Math.floor(Math.random() * 20) + 2,
    }));
  }
  
  // Branch selected: Show specific branch data
  if (locationFilters.branchId !== "all") {
    return [{
      name: `หน่วยบริการที่เลือก`,
      positive: Math.floor(Math.random() * 30) + 15,
      negative: Math.floor(Math.random() * 15) + 2,
    }];
  }
  
  return [];
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

  const handleResetFilters = () => {
    setLocationFilters({
      regionId: "all",
      provinceId: "all",
      districtId: "all",
      branchId: "all"
    });
  };

  const getChartTitle = () => {
    if (locationFilters.branchId !== "all") {
      return "ข้อคิดเห็นลูกค้า - หน่วยบริการที่เลือก";
    }
    if (locationFilters.districtId !== "all") {
      return "ข้อคิดเห็นลูกค้า - รายหน่วยบริการในเขต";
    }
    if (locationFilters.provinceId !== "all") {
      return "ข้อคิดเห็นลูกค้า - รายเขตในจังหวัด";
    }
    if (locationFilters.regionId !== "all") {
      return "ข้อคิดเห็นลูกค้า - รายจังหวัดในภาค";
    }
    return "ข้อคิดเห็นลูกค้า - รายภาค";
  };

  return (
    <div className="min-h-screen p-6 space-y-6">
      <div className="flex flex-col space-y-4">
        <h1 className="text-3xl font-bold text-foreground">
          กราฟข้อคิดเห็นลูกค้า รายพื้นที่
        </h1>

        {/* Location Filter */}
        <div className="flex flex-col lg:flex-row lg:items-end gap-4">
          <div className="flex-1">
            <CascadingFilter
              options={{
                showRegion: true,
                showProvince: true,
                showDistrict: true,
                showBranch: true,
                regionLabel: "ภาค",
                provinceLabel: "จังหวัด",
                districtLabel: "เขต",
                branchLabel: "หน่วยบริการ"
              }}
              value={locationFilters}
              onFiltersChange={handleLocationFiltersChange}
              title="เลือกพื้นที่"
            />
            {/* Reset Filters Button */}
            <Button
              onClick={handleResetFilters}
              variant="outline"
              className="flex items-center gap-2 mb-6"
            >
              <RotateCcw className="w-4 h-4" />
              ล้างตัวกรอง
            </Button>
          </div>
        </div>

        {/* Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>{getChartTitle()}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="name" 
                  stroke="hsl(var(--foreground))"
                  fontSize={12}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  stroke="hsl(var(--foreground))"
                  fontSize={12}
                  label={{ value: 'จำนวน (ครั้ง)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  formatter={(value, name) => [
                    `${value} ครั้ง`,
                    name === 'positive' ? 'เชิงบวก' : 'เชิงลบ'
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
