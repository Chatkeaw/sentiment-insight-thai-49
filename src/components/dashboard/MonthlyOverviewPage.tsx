import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ExportButton } from '@/components/shared/ExportButton';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { getComplaintCategoryColor, sortComplaintData } from '@/utils/exportUtils';

export const MonthlyOverviewPage: React.FC = () => {
  // ---- NEW: ตั้งค่าเริ่มต้นเป็น "เดือนล่าสุด" และ "ปีปัจจุบัน" ตั้งแต่ useState ----
  const now = new Date();
  const initialMonth = String(now.getMonth() + 1); // '1'..'12'
  const initialYear = String(now.getFullYear());   // '2025' เป็นต้น

  const [selectedMonth, setSelectedMonth] = useState<string>(initialMonth);
  const [selectedYear, setSelectedYear] = useState<string>(initialYear);
  // ---------------------------------------------------------------------------

  // Mock data based on selected month/year
  const rawComplaintTopics = [
    { name: 'พนักงานและบุคลากร', positive: 245, negative: 89, category: 'staff' },
    { name: 'เทคโนโลยีและดิจิทัล', positive: 156, negative: 134, category: 'technology' },
    { name: 'การปฏิบัติตามหลักธรรมาภิบาลทางการตลาด', positive: 23, negative: 156, category: 'marketConduct' },
    { name: 'สภาพแวดล้อมและสิ่งอำนวยความสะดวก', positive: 198, negative: 76, category: 'environment' },
    { name: 'ระบบและกระบวนการให้บริการ', positive: 134, negative: 67, category: 'service' },
    { name: 'เงื่อนไขและผลิตภัณฑ์', positive: 89, negative: 45, category: 'products' },
    { name: 'อื่นๆ', positive: 67, negative: 34, category: 'other' },
  ];

  // Sort topics with Market Conduct first, then by complaint count
  const sortedComplaintTopics = sortComplaintData(rawComplaintTopics, 'negative');
  
  const complaintTopics = sortedComplaintTopics.map((item, index) => {
    const isMarketConduct = item.category === 'marketConduct';
    let colorIndex = index;
    if (isMarketConduct) {
      colorIndex = -1; // Special case for Market Conduct
    } else {
      colorIndex = index - 1; // Adjust index since Market Conduct takes first position
    }
    
    return {
      ...item,
      value: item.negative, // Use negative count for chart value
      color: getComplaintCategoryColor(item.name, Math.max(0, colorIndex), isMarketConduct)
    };
  });

  const rawComplaintCategories = [
    { name: 'ความสุภาพและมารยาทของพนักงาน', positive: 189, negative: 45 },
    { name: 'ความเอาใจใส่ในการให้บริการลูกค้า', positive: 167, negative: 23 },
    { name: 'ไม่เอาเปรียบ', positive: 145, negative: 12 },
    { name: 'ระบบ Core ของธนาคาร', positive: 98, negative: 87 },
    { name: 'ความรวดเร็วในการให้บริการ', positive: 123, negative: 56 },
    { name: 'ไม่บังคับ', positive: 78, negative: 34 },
    { name: 'พื้นที่และความคับคั่ง', positive: 67, negative: 89 },
  ];

  // Sort categories with highest complaint count first
  const sortedComplaintCategories = sortComplaintData(rawComplaintCategories, 'negative');
  
  const complaintCategories = sortedComplaintCategories.map((item, index) => ({
    ...item,
    value: Math.round((item.negative / (item.positive + item.negative)) * 100), // Calculate percentage
    color: getComplaintCategoryColor(item.name, index, false)
  }));

  const monthlyTrend = Array.from({ length: 12 }, (_, i) => ({
    month: `${i + 1}`,
    complaints: Math.floor(Math.random() * 50) + 20,
    feedback: Math.floor(Math.random() * 100) + 50,
  }));

  const months = [
    { value: '1', label: 'มกราคม' },
    { value: '2', label: 'กุมภาพันธ์' },
    { value: '3', label: 'มีนาคม' },
    { value: '4', label: 'เมษายน' },
    { value: '5', label: 'พฤษภาคม' },
    { value: '6', label: 'มิถุนายน' },
    { value: '7', label: 'กรกฎาคม' },
    { value: '8', label: 'สิงหาคม' },
    { value: '9', label: 'กันยายน' },
    { value: '10', label: 'ตุลาคม' },
    { value: '11', label: 'พฤศจิกายน' },
    { value: '12', label: 'ธันวาคม' },
  ];

  const years = Array.from({ length: 5 }, (_, i) => {
    const year = new Date().getFullYear() - i;
    return { value: year.toString(), label: year.toString() };
  });

  const getCurrentMonthLabel = () => {
    const month = months.find(m => m.value === selectedMonth);
    return month ? `${month.label} ${selectedYear}` : 'เลือกเดือน';
  };

  const handleNavigateToFeedback = (topic: string) => {
    // Navigate to feedback page with pre-filtered topic
    const event = new CustomEvent('changePage', { detail: 'feedback' });
    window.dispatchEvent(event);
    
    // Store the selected topic filter
    localStorage.setItem('feedbackFilter', JSON.stringify({ 
      topic, 
      month: selectedMonth, 
      year: selectedYear 
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header with Month/Year Selection */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-foreground">
          สรุปภาพรวมประจำเดือน - {getCurrentMonthLabel()}
        </h2>
        <div className="flex gap-3">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="เลือกเดือน" />
            </SelectTrigger>
            <SelectContent>
              {months.map(month => (
                <SelectItem key={month.value} value={month.value}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-24">
              <SelectValue placeholder="ปี" />
            </SelectTrigger>
            <SelectContent>
              {years.map(year => (
                <SelectItem key={year.value} value={year.value}>
                  {year.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">รวมข้อเสนอแนะ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">1,234</div>
            <p className="text-xs text-muted-foreground">+12% จากเดือนก่อน</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">ข้อร้องเรียน</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">156</div>
            <p className="text-xs text-muted-foreground">-5% จากเดือนก่อน</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">สาขาที่มีข้อมูล</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">98</div>
            <p className="text-xs text-muted-foreground">จาก 100 สาขา</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">คะแนนเฉลี่ย</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">4.2</div>
            <p className="text-xs text-muted-foreground">จากคะแนนเต็ม 5</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Complaint Topics Chart */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">หัวข้อที่ลูกค้าร้องเรียน</CardTitle>
            <ExportButton 
              data={complaintTopics}
              type="chart"
              elementId="complaint-topics-chart"
              chartType="กราฟแท่งหัวข้อร้องเรียน"
              filename="หัวข้อร้องเรียน-รายเดือน"
              title={`หัวข้อที่ลูกค้าร้องเรียน - ${getCurrentMonthLabel()}`}
            />
          </CardHeader>
          <CardContent>
            <div id="complaint-topics-chart">
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={complaintTopics} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    width={180} 
                    fontSize={12}
                    tick={{ fontSize: 10 }}
                  />
                  <Tooltip 
                    formatter={(value) => [`${value} ครั้ง`, 'จำนวนร้องเรียน']}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {complaintTopics.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {complaintTopics.slice(0, 5).map((topic, index) => (
                <button
                  key={topic.name}
                  onClick={() => handleNavigateToFeedback(topic.category)}
                  className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-50 transition-colors border border-gray-200"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-gray-500">{index + 1}</span>
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: topic.color }}
                      />
                      <span className="text-sm font-medium">{topic.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-green-600">● {topic.positive}</span>
                      <span className="text-sm text-red-600">● {topic.negative}</span>
                      <span className="text-xs text-muted-foreground">→ ดูความคิดเห็น</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Complaint Categories Pie Chart */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">หมวดหมู่ที่ลูกค้าร้องเรียน</CardTitle>
            <ExportButton 
              data={complaintCategories}
              type="chart"
              elementId="complaint-categories-chart"
              chartType="กราฟวงกลมหมวดหมู่ร้องเรียน"
              filename="หมวดหมู่ร้องเรียน-รายเดือน"
              title={`หมวดหมู่ที่ลูกค้าร้องเรียน - ${getCurrentMonthLabel()}`}
            />
          </CardHeader>
          <CardContent>
            <div id="complaint-categories-chart" className="flex items-center">
              <div className="flex-1">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={complaintCategories}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {complaintCategories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value, name) => [`${value}%`, name]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="ml-4 space-y-3">
                {complaintCategories.slice(0, 7).map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-500 w-6">{index + 1}</span>
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <div className="text-sm flex-1">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-muted-foreground flex gap-2">
                        <span className="text-green-600">● {item.positive}</span>
                        <span className="text-red-600">● {item.negative}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trend Chart */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">แนวโน้มรายเดือน</CardTitle>
          <ExportButton 
            data={monthlyTrend}
            type="chart"
            elementId="monthly-trend-chart"
            chartType="กราฟเส้นแนวโน้มรายเดือน"
            filename="แนวโน้ม-รายเดือน"
            title={`แนวโน้มรายเดือน - ${selectedYear}`}
          />
        </CardHeader>
        <CardContent>
          <div id="monthly-trend-chart">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="month" 
                  label={{ value: 'เดือน', position: 'insideBottom', offset: -10 }}
                />
                <YAxis 
                  label={{ value: 'จำนวน', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  formatter={(value, name) => [
                    `${value} ครั้ง`, 
                    name === 'complaints' ? 'ข้อร้องเรียน' : 'ข้อเสนอแนะ'
                  ]}
                  labelFormatter={(label) => `เดือน ${label}`}
                />
                <Bar dataKey="complaints" fill="#EF4444" name="complaints" />
                <Bar dataKey="feedback" fill="#10B981" name="feedback" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
