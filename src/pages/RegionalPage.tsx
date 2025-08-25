
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CascadingFilter } from '@/components/filters/CascadingFilter';
import { LocationFilters } from '@/types/locations';

// Mock data for regional feedback
const mockRegionalData = [
  {
    id: 'region-1',
    region: 'ภาค 1',
    province: 'กรุงเทพฯ',
    district: 'บางเขน',
    branch: 'ประชาชื่น',
    positiveCount: 125,
    negativeCount: 45,
    totalCount: 170
  },
  {
    id: 'region-2',
    region: 'ภาค 1',
    province: 'กรุงเทพฯ',
    district: 'ราชวัตร',
    branch: 'นางเลิ้ง',
    positiveCount: 98,
    negativeCount: 32,
    totalCount: 130
  },
  {
    id: 'region-3',
    region: 'ภาค 4',
    province: 'สมุทรสาคร',
    district: 'สมุทรสาคร',
    branch: 'เซ็นทรัล มหาชัย',
    positiveCount: 87,
    negativeCount: 28,
    totalCount: 115
  },
  {
    id: 'region-4',
    region: 'ภาค 5',
    province: 'กาญจนบุรี',
    district: 'กาญจนบุรี',
    branch: 'กาญจนบุรี',
    positiveCount: 76,
    negativeCount: 41,
    totalCount: 117
  },
  {
    id: 'region-5',
    region: 'ภาค 10',
    province: 'นครพนม',
    district: 'นครพนม',
    branch: 'นครพนม',
    positiveCount: 62,
    negativeCount: 38,
    totalCount: 100
  },
  {
    id: 'region-6',
    region: 'ภาค 11',
    province: 'ขอนแก่น',
    district: 'ขอนแก่น 1',
    branch: 'ขอนแก่น',
    positiveCount: 89,
    negativeCount: 26,
    totalCount: 115
  },
  {
    id: 'region-7',
    region: 'ภาค 13',
    province: 'นครราชสีมา',
    district: 'นครราชสีมา 1',
    branch: 'นครราชสีมา',
    positiveCount: 94,
    negativeCount: 31,
    totalCount: 125
  },
  {
    id: 'region-8',
    region: 'ภาค 13',
    province: 'ปราจีนบุรี',
    district: 'ปราจีนบุรี',
    branch: 'ปราจีนบุรี',
    positiveCount: 71,
    negativeCount: 44,
    totalCount: 115
  },
  {
    id: 'region-9',
    region: 'ภาค 15',
    province: 'ชลบุรี',
    district: 'ชลบุรี 1',
    branch: 'ชลบุรี',
    positiveCount: 105,
    negativeCount: 35,
    totalCount: 140
  },
  {
    id: 'region-10',
    region: 'ภาค 16',
    province: 'ภูเก็ต',
    district: 'ภูเก็ต',
    branch: 'ภูเก็ต',
    positiveCount: 83,
    negativeCount: 29,
    totalCount: 112
  }
];

const RegionalPage: React.FC = () => {
  // Filter states
  const [locationFilters, setLocationFilters] = useState<LocationFilters>({
    regionId: 'all',
    provinceId: 'all',
    districtId: 'all',
    branchId: 'all'
  });

  // Handle location filter changes
  const handleLocationFiltersChange = (filters: LocationFilters) => {
    setLocationFilters(filters);
  };

  // Clear all filters
  const clearFilters = () => {
    setLocationFilters({
      regionId: 'all',
      provinceId: 'all',
      districtId: 'all',
      branchId: 'all'
    });
  };

  // Filter and aggregate data based on selected filters
  const { chartData, chartTitle } = useMemo(() => {
    let filteredData = [...mockRegionalData];
    let title = 'ข้อมูลรวมทั้งหมด';
    let groupByField: keyof typeof mockRegionalData[0] = 'region';

    // Apply filters and determine grouping level
    if (locationFilters.regionId !== 'all') {
      filteredData = filteredData.filter(item => item.region === locationFilters.regionId);
      title = `ข้อมูลจังหวัดใน${locationFilters.regionId}`;
      groupByField = 'province';

      if (locationFilters.provinceId !== 'all') {
        filteredData = filteredData.filter(item => item.province === locationFilters.provinceId);
        title = `ข้อมูลเขตในจังหวัด${locationFilters.provinceId}`;
        groupByField = 'district';

        if (locationFilters.districtId !== 'all') {
          filteredData = filteredData.filter(item => item.district === locationFilters.districtId);
          title = `ข้อมูลหน่วยบริการในเขต${locationFilters.districtId}`;
          groupByField = 'branch';

          if (locationFilters.branchId !== 'all') {
            filteredData = filteredData.filter(item => item.branch === locationFilters.branchId);
            title = `ข้อมูลหน่วยบริการ${locationFilters.branchId}`;
          }
        }
      }
    }

    // Group and aggregate data
    const groupedData = new Map<string, { positive: number; negative: number; total: number }>();

    filteredData.forEach(item => {
      const key = item[groupByField] as string;
      const existing = groupedData.get(key) || { positive: 0, negative: 0, total: 0 };
      
      groupedData.set(key, {
        positive: existing.positive + item.positiveCount,
        negative: existing.negative + item.negativeCount,
        total: existing.total + item.totalCount
      });
    });

    // Convert to chart format
    const chartData = Array.from(groupedData.entries()).map(([name, data]) => ({
      name,
      เชิงบวก: data.positive,
      เชิงลบ: data.negative,
      รวม: data.total
    }));

    return { chartData, chartTitle: title };
  }, [locationFilters]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">ศักยภาพรายพื้นที่</h1>
          <p className="text-muted-foreground">วิเคราะห์ความพึงพอใจลูกค้าตามภูมิภาค</p>
        </div>
        <Button onClick={clearFilters} variant="outline" size="sm">
          ล้างตัวกรอง
        </Button>
      </div>

      {/* Cascading Location Filters */}
      <CascadingFilter
        onFiltersChange={handleLocationFiltersChange}
        title="พื้นที่ให้บริการ"
        options={{
          showRegion: true,
          showProvince: true,
          showDistrict: true,
          showBranch: true,
          regionLabel: 'ภาค',
          provinceLabel: 'จังหวัด',
          districtLabel: 'เขต',
          branchLabel: 'หน่วยบริการ',
        }}
      />

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>{chartTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={12}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="เชิงบวก" stackId="a" fill="hsl(var(--chart-1))" />
                <Bar dataKey="เชิงลบ" stackId="a" fill="hsl(var(--chart-2))" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">ความคิดเห็นเชิงบวกรวม</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold text-green-600">
              {chartData.reduce((sum, item) => sum + item.เชิงบวก, 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">ความคิดเห็นเชิงลบรวม</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold text-red-600">
              {chartData.reduce((sum, item) => sum + item.เชิงลบ, 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">ความคิดเห็นรวมทั้งหมด</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold text-foreground">
              {chartData.reduce((sum, item) => sum + item.รวม, 0)}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegionalPage;
