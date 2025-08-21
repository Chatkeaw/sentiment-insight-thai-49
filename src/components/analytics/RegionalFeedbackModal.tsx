import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, TrendingUp, TrendingDown, Minus } from 'lucide-react';
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

// Generate summary card data
const generateSummaryData = (region: string, category: string) => {
  const baseImportant = Math.floor(Math.random() * 200) + 300;
  const basePositive = Math.floor(Math.random() * 200) + 350;
  const baseNegative = Math.floor(Math.random() * 100) + 50;

  return {
    important: {
      current: baseImportant,
      previousMonth: Math.floor(baseImportant * (0.7 + Math.random() * 0.6)),
      threeMonthsAgo: Math.floor(baseImportant * (0.6 + Math.random() * 0.8))
    },
    positive: {
      current: basePositive,
      previousMonth: Math.floor(basePositive * (0.8 + Math.random() * 0.4)),
      threeMonthsAgo: Math.floor(basePositive * (0.7 + Math.random() * 0.6))
    },
    negative: {
      current: baseNegative,
      previousMonth: Math.floor(baseNegative * (1.2 + Math.random() * 0.8)),
      threeMonthsAgo: Math.floor(baseNegative * (1.0 + Math.random() * 1.0))
    }
  };
};

// Calculate percentage change and direction
const calculateChange = (current: number, previous: number) => {
  if (previous === 0) {
    if (current === 0) {
      return { percentage: 0, direction: 'neutral', displayText: '0%' };
    } else {
      return { percentage: 0, direction: 'increase', displayText: 'N/A' };
    }
  }
  
  const percentage = ((current - previous) / previous) * 100;
  const direction = percentage > 0 ? 'increase' : percentage < 0 ? 'decrease' : 'neutral';
  
  return {
    percentage: Math.abs(percentage),
    direction,
    displayText: `${Math.abs(percentage).toFixed(1)}%`
  };
};

// Summary Card Component
interface SummaryCardProps {
  title: string;
  current: number;
  previousMonth: number;
  threeMonthsAgo?: number;
  headerColor: string;
  headerBgColor: string;
  cardBgColor: string;
  ariaLabel: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  current,
  previousMonth,
  threeMonthsAgo,
  headerColor,
  headerBgColor,
  cardBgColor,
  ariaLabel
}) => {
  const monthChange = calculateChange(current, previousMonth);
  const threeMonthChange = threeMonthsAgo ? calculateChange(current, threeMonthsAgo) : null;

  const getIcon = (direction: string) => {
    switch (direction) {
      case 'increase':
        return <TrendingUp className="w-4 h-4" />;
      case 'decrease':
        return <TrendingDown className="w-4 h-4" />;
      default:
        return <Minus className="w-4 h-4" />;
    }
  };

  const getTextColor = (direction: string) => {
    switch (direction) {
      case 'increase':
        return 'text-[#20A161]';
      case 'decrease':
        return 'text-[#D14343]';
      default:
        return 'text-[#6B7280]';
    }
  };

  const getChangeText = (direction: string, percentage: string, previousValue: number) => {
    switch (direction) {
      case 'increase':
        return previousValue === 0 ? `เพิ่มขึ้นจาก 0 (${percentage})` : `เพิ่มขึ้น ${percentage} จาก ${previousValue.toLocaleString()}`;
      case 'decrease':
        return `ลดลง ${percentage} จาก ${previousValue.toLocaleString()}`;
      default:
        return `คงที่จาก ${previousValue.toLocaleString()}`;
    }
  };

  return (
    <div 
      className={`${cardBgColor} rounded-2xl shadow-sm border border-[#E5E7EB] p-6`}
      aria-label={ariaLabel}
    >
      {/* Header Pill */}
      <div 
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-4`}
        style={{ backgroundColor: headerColor, color: 'white' }}
      >
        {title}
      </div>

      {/* Current Value */}
      <div className="text-4xl font-bold text-gray-900 mb-3">
        {current.toLocaleString()}
      </div>

      {/* Month-over-Month Comparison */}
      <div className={`flex items-center gap-2 text-sm mb-2 ${getTextColor(monthChange.direction)}`}>
        {getIcon(monthChange.direction)}
        <span>
          {getChangeText(monthChange.direction, monthChange.displayText, previousMonth)} (1 เดือนก่อนหน้า)
        </span>
      </div>

      {/* 3-Month Comparison (if available) */}
      {threeMonthChange && threeMonthsAgo && (
        <div className={`flex items-center gap-2 text-sm opacity-70 ${getTextColor(threeMonthChange.direction)}`}>
          {getIcon(threeMonthChange.direction)}
          <span>
            {getChangeText(threeMonthChange.direction, threeMonthChange.displayText, threeMonthsAgo)} (3 เดือนก่อนหน้า)
          </span>
        </div>
      )}
    </div>
  );
};

export const RegionalFeedbackModal: React.FC<RegionalFeedbackModalProps> = ({
  isOpen,
  onClose
}) => {
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const trendData = generateTrendData(selectedRegion, selectedCategory);
  const summaryData = generateSummaryData(selectedRegion, selectedCategory);

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

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <SummaryCard
              title="จำนวนความคิดเห็นที่สำคัญ"
              current={summaryData.important.current}
              previousMonth={summaryData.important.previousMonth}
              threeMonthsAgo={summaryData.important.threeMonthsAgo}
              headerColor="#3B4046"
              headerBgColor="#3B4046"
              cardBgColor="bg-white"
              ariaLabel={`จำนวนความคิดเห็นที่สำคัญ เดือนล่าสุด ${summaryData.important.current} ${calculateChange(summaryData.important.current, summaryData.important.previousMonth).direction === 'increase' ? 'เพิ่มขึ้น' : calculateChange(summaryData.important.current, summaryData.important.previousMonth).direction === 'decrease' ? 'ลดลง' : 'คงที่'} ${calculateChange(summaryData.important.current, summaryData.important.previousMonth).displayText} เทียบเดือนก่อน`}
            />
            
            <SummaryCard
              title="จำนวนความคิดเห็นเชิงบวก"
              current={summaryData.positive.current}
              previousMonth={summaryData.positive.previousMonth}
              threeMonthsAgo={summaryData.positive.threeMonthsAgo}
              headerColor="#1E9E62"
              headerBgColor="#1E9E62"
              cardBgColor="bg-[#EAFBF0]"
              ariaLabel={`จำนวนความคิดเห็นเชิงบวก เดือนล่าสุด ${summaryData.positive.current} ${calculateChange(summaryData.positive.current, summaryData.positive.previousMonth).direction === 'increase' ? 'เพิ่มขึ้น' : calculateChange(summaryData.positive.current, summaryData.positive.previousMonth).direction === 'decrease' ? 'ลดลง' : 'คงที่'} ${calculateChange(summaryData.positive.current, summaryData.positive.previousMonth).displayText} เทียบเดือนก่อน`}
            />
            
            <SummaryCard
              title="จำนวนความคิดเห็นเชิงลบ"
              current={summaryData.negative.current}
              previousMonth={summaryData.negative.previousMonth}
              threeMonthsAgo={summaryData.negative.threeMonthsAgo}
              headerColor="#D14343"
              headerBgColor="#D14343"
              cardBgColor="bg-[#FDEAEA]"
              ariaLabel={`จำนวนความคิดเห็นเชิงลบ เดือนล่าสุด ${summaryData.negative.current} ${calculateChange(summaryData.negative.current, summaryData.negative.previousMonth).direction === 'increase' ? 'เพิ่มขึ้น' : calculateChange(summaryData.negative.current, summaryData.negative.previousMonth).direction === 'decrease' ? 'ลดลง' : 'คงที่'} ${calculateChange(summaryData.negative.current, summaryData.negative.previousMonth).displayText} เทียบเดือนก่อน`}
            />
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