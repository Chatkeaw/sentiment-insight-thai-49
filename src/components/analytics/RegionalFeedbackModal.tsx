import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface RegionalFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Generate regions from 1-18
const regions = Array.from({ length: 18 }, (_, i) => ({
  value: `${i + 1}`,
  label: `ภาคที่ ${i + 1}`
}));

// Category options
const categories = [
  { value: "all", label: "ทั้งหมด" },
  { value: "staff", label: "พนักงานและบุคลากร" },
  { value: "service", label: "ระบบและกระบวนการให้บริการ" },
  { value: "technology", label: "เทคโนโลยีและดิจิทัล" },
  { value: "products", label: "เงื่อนไขและผลิตภัณฑ์" },
  { value: "environment", label: "สภาพแวดล้อมและสิ่งอำนวยความสะดวก" },
  { value: "others", label: "อื่น ๆ" }
];

// Generate mock trend data for line chart
const generateTrendData = (region: string, category: string) => {
  const months = [
    'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
    'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
  ];

  return months.map(month => ({
    month,
    positive: Math.floor(Math.random() * 50) + 20,
    negative: Math.floor(Math.random() * 30) + 5
  }));
};

export const RegionalFeedbackModal: React.FC<RegionalFeedbackModalProps> = ({
  isOpen,
  onClose
}) => {
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const trendData = generateTrendData(selectedRegion, selectedCategory);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            กราฟแนวโน้มความคิดเห็นลูกค้า รายพื้นที่
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Filter Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">ภาค</label>
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

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">หมวดหมู่ที่กล่าวถึง</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="เลือกหมวดหมู่" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Line Chart */}
          <div className="bg-card rounded-lg p-6 border">
            <h3 className="text-lg font-medium text-foreground mb-4">
              แนวโน้มความคิดเห็นลูกค้า
              {selectedRegion !== "all" && ` - ภาคที่ ${selectedRegion}`}
              {selectedCategory !== "all" && ` - ${categories.find(c => c.value === selectedCategory)?.label}`}
            </h3>
            
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={trendData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="month" 
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
                    name === 'positive' ? 'เชิงบวก' : 'เชิงลบ'
                  ]}
                  labelFormatter={(label) => `เดือน ${label}`}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--foreground))'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="positive" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="negative" 
                  stroke="#EF4444" 
                  strokeWidth={3}
                  dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#EF4444', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>

            {/* Legend */}
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-1 bg-green-500 rounded"></div>
                <span className="text-sm text-muted-foreground">เชิงบวก</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-1 bg-red-500 rounded"></div>
                <span className="text-sm text-muted-foreground">เชิงลบ</span>
              </div>
            </div>
          </div>

          {/* Close Button */}
          <div className="flex justify-end">
            <Button onClick={onClose} className="flex items-center gap-2">
              <X className="h-4 w-4" />
              ปิด
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};