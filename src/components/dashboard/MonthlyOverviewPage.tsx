import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChartData } from '@/types/dashboard';
import { ExportButton } from '@/components/shared/ExportButton';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { getComplaintCategoryColor } from '@/utils/exportUtils';

export const MonthlyOverviewPage: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');

  // Initialize with current month and year
  useEffect(() => {
    const now = new Date();
    const currentMonth = (now.getMonth() + 1).toString();
    const currentYear = now.getFullYear().toString();
    
    setSelectedMonth(currentMonth);
    setSelectedYear(currentYear);
  }, []);

  // Mock data based on selected month/year
  const complaintTopics = [
    { name: 'การปฏิบัติตามหลักธรรมาภิบาลทางการตลาด', value: 25, category: 'marketConduct' },
    { name: 'พนักงานและบุคลากร', value: 18, category: 'staff' },
    { name: 'ระบบและกระบวนการให้บริการ', value: 15, category: 'service' },
    { name: 'เทคโนโลยีและดิจิทัล', value: 12, category: 'technology' },
    { name: 'ผลิตภัณฑ์และบริการทางการเงิน', value: 10, category: 'products' },
    { name: 'สภาพแวดล้อมและสิ่งอำนวยความสะดวก', value: 8, category: 'environment' },
    { name: 'อื่นๆ', value: 5, category: 'other' },
  ].map((item, index) => ({
    ...item,
    color: getComplaintCategoryColor(item.name, index, 7)
  }));

  const complaintCategories = [
    { name: 'ร้ายแรง', value: 35, color: '#DC2626' },
    { name: 'ปานกลาง', value: 45, color: '#F59E0B' },
    { name: 'เล็กน้อย', value: 20, color: '#10B981' },
  ];

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
                    width={150} 
                    fontSize={12}
                    tick={{ fontSize: 10 }}
                  />
                  <Tooltip 
                    formatter={(value) => [`${value} ครั้ง`, 'จำนวน']}
                  />
                  <Bar 
                    dataKey="value" 
                    fill="#DC2626"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {complaintTopics.slice(0, 3).map((topic, index) => (
                <button
                  key={topic.name}
                  onClick={() => handleNavigateToFeedback(topic.category)}
                  className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-50 transition-colors border border-gray-200"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{topic.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {topic.value} ครั้ง → ดูความคิดเห็น
                    </span>
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
                {complaintCategories.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <div className="text-sm">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-muted-foreground">{item.value}%</div>
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