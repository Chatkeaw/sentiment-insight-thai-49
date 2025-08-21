
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { RegionalFeedbackModal } from '@/components/analytics/RegionalFeedbackModal';

// Generate regions from 1-18
const regions = Array.from({ length: 18 }, (_, i) => ({
  value: `${i + 1}`,
  label: `ภาคที่ ${i + 1}`
}));

// Generate mock data for bar chart
const generateRegionalData = (selectedRegion: string) => {
  if (selectedRegion === "all") {
    return regions.map(region => ({
      region: region.label,
      positive: Math.floor(Math.random() * 100) + 50,
      negative: Math.floor(Math.random() * 50) + 10,
      neutral: Math.floor(Math.random() * 30) + 5
    }));
  } else {
    const regionData = regions.find(r => r.value === selectedRegion);
    return regionData ? [{
      region: regionData.label,
      positive: Math.floor(Math.random() * 100) + 50,
      negative: Math.floor(Math.random() * 50) + 10,
      neutral: Math.floor(Math.random() * 30) + 5
    }] : [];
  }
};

export const RegionalPage: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const chartData = generateRegionalData(selectedRegion);

  return (
    <div className="min-h-screen p-6 space-y-6">
      <div className="flex flex-col space-y-4">
        <h1 className="text-3xl font-bold text-foreground">
          กราฟข้อคิดเห็นลูกค้า รายพื้นที่
        </h1>

        {/* Region Filter */}
        <div className="max-w-md">
          <label className="text-sm font-medium text-foreground mb-2 block">ภาค</label>
          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger>
              <SelectValue placeholder="เลือกภาค" />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              <SelectItem value="all">ทั้งหมด</SelectItem>
              {regions.map((region) => (
                <SelectItem key={region.value} value={region.value}>
                  {region.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>
              ข้อคิดเห็นลูกค้า
              {selectedRegion !== "all" && ` - ${regions.find(r => r.value === selectedRegion)?.label}`}
            </CardTitle>
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
                    name === 'positive' ? 'เชิงบวก' : name === 'negative' ? 'เชิงลบ' : 'เป็นกลาง'
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
                <Bar dataKey="neutral" fill="#6B7280" name="neutral" />
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
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-500 rounded"></div>
                <span className="text-sm text-muted-foreground">เป็นกลาง</span>
              </div>
            </div>

            {/* Detail Button */}
            <div className="flex justify-center mt-6">
              <Button 
                onClick={() => setIsModalOpen(true)}
                variant="outline"
                className="px-6"
              >
                ดูรายละเอียด
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Regional Feedback Modal */}
      <RegionalFeedbackModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
