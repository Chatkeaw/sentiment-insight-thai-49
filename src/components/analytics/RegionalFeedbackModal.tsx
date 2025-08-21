import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';

interface RegionalFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RegionalFeedbackModal: React.FC<RegionalFeedbackModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Generate regions 1-18
  const regions = Array.from({ length: 18 }, (_, i) => ({
    value: `region-${i + 1}`,
    label: `ภาคที่ ${i + 1}`
  }));

  // Categories
  const categories = [
    { value: 'staff', label: 'พนักงานและบุคลากร' },
    { value: 'service', label: 'ระบบและกระบวนการให้บริการ' },
    { value: 'technology', label: 'เทคโนโลยีและดิจิทัล' },
    { value: 'products', label: 'เงื่อนไขและผลิตภัณฑ์' },
    { value: 'environment', label: 'สภาพแวดล้อมและสิ่งอำนวยความสะดวก' },
    { value: 'other', label: 'อื่น ๆ' }
  ];

  // Mock data for trend line chart (6 months)
  const trendData = [
    { month: 'ธ.ค. 66', positive: 145, negative: 65 },
    { month: 'ม.ค. 67', positive: 178, negative: 89 },
    { month: 'ก.พ. 67', positive: 203, negative: 76 },
    { month: 'มี.ค. 67', positive: 189, negative: 94 },
    { month: 'เม.ย. 67', positive: 221, negative: 102 },
    { month: 'พ.ค. 67', positive: 234, negative: 87 }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">
              กราฟข้อคิดเห็นลูกค้า รายพื้นที่
            </DialogTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            วิเคราะห์แนวโน้มความคิดเห็นลูกค้าตามภาคและหมวดหมู่ที่เลือก
          </p>
        </DialogHeader>

        {/* Filter Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-muted/30 rounded-lg">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">ภาค</label>
            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger className="w-full bg-background">
                <SelectValue placeholder="ทั้งหมด" />
              </SelectTrigger>
              <SelectContent className="bg-background border shadow-lg z-50 max-h-60">
                <SelectItem value="all">ทั้งหมด</SelectItem>
                {regions.map((region) => (
                  <SelectItem key={region.value} value={region.value}>
                    {region.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">หมวดหมู่ที่กล่าวถึง</label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full bg-background">
                <SelectValue placeholder="ทั้งหมด" />
              </SelectTrigger>
              <SelectContent className="bg-background border shadow-lg z-50">
                <SelectItem value="all">ทั้งหมด</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Trend Chart */}
        <Card className="border rounded-2xl shadow-none">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              แนวโน้มความคิดเห็นลูกค้า
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={trendData} margin={{ top: 20, right: 80, left: 20, bottom: 20 }}>
                <XAxis 
                  dataKey="month" 
                  fontSize={12}
                  tick={{ fill: 'hsl(var(--foreground))' }}
                />
                <YAxis 
                  fontSize={12}
                  tick={{ fill: 'hsl(var(--foreground))' }}
                  domain={[0, 300]}
                  label={{ value: 'จำนวน (ครั้ง)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  formatter={(value, name) => [
                    `${value} ครั้ง`, 
                    name === 'positive' ? 'เชิงบวก' : 'เชิงลบ'
                  ]}
                  labelFormatter={(label) => `${label}`}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="positive"
                  stroke="#10B981"
                  strokeWidth={3}
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 6 }}
                  name="positive"
                />
                <Line
                  type="monotone"
                  dataKey="negative"
                  stroke="#EF4444"
                  strokeWidth={3}
                  dot={{ fill: '#EF4444', strokeWidth: 2, r: 6 }}
                  name="negative"
                />
              </LineChart>
            </ResponsiveContainer>

            {/* Legend */}
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span className="text-sm text-foreground">เชิงบวก</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                <span className="text-sm text-foreground">เชิงลบ</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Close Button */}
        <div className="flex justify-end mt-6">
          <Button onClick={onClose} variant="outline">
            <X className="w-4 h-4 mr-2" />
            ปิด
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};