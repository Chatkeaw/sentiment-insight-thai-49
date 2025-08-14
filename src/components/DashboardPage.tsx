import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, MessageSquare, AlertTriangle, Phone } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { SatisfactionDetailModal } from './SatisfactionDetailModal';

interface DashboardPageProps {
  onPageChange?: (page: string) => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ onPageChange }) => {
  // Generate month options from มกราคม 2567 to สิงหาคม 2568
  const monthOptions = [
    "มกราคม 2567", "กุมภาพันธ์ 2567", "มีนาคม 2567", "เมษายน 2567", "พฤษภาคม 2567", "มิถุนายน 2567",
    "กรกฎาคม 2567", "สิงหาคม 2567", "กันยายน 2567", "ตุลาคม 2567", "พฤศจิกายน 2567", "ธันวาคม 2567",
    "มกราคม 2568", "กุมภาพันธ์ 2568", "มีนาคม 2568", "เมษายน 2568", "พฤษภาคม 2568", "มิถุนายน 2568",
    "กรกฎาคม 2568", "สิงหาคม 2568"
  ];

  // State to manage selected month
  const [selectedMonth, setSelectedMonth] = useState("มิถุนายน 2568");

  // State for satisfaction detail modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedScore, setSelectedScore] = useState(0);

  // Data for branch types donut chart
  const branchTypeData = [
    { name: "สาขาให้บริการ 5 วัน", value: 52, color: "#8B5CF6" },
    { name: "สาขาให้บริการ 7 วัน", value: 45, color: "#3B82F6" },
    { name: "หน่วยให้บริการ", value: 3, color: "#6B7280" }
  ];

  // Data for service types bar chart
  const serviceTypeData = [
    { name: "สินเชื่อ", gray: 1050, pink: 1250 },
    { name: "เงินฝาก", gray: 350, pink: 420 },
    { name: "สินค้า", gray: 150, pink: 180 },
    { name: "ประกันภัย", gray: 80, pink: 95 },
    { name: "บัตรเครดิต", gray: 60, pink: 75 },
    { name: "กิจกรรม", gray: 50, pink: 65 }
  ];

  // Satisfaction topics data
  const satisfactionTopics = [
    { name: "การดูแล เอาใจใส่ ความสบายใจเมื่อมาใช้บริการ", score: 3.85 },
    { name: "การตอบคำถาม ให้คำแนะนำ ความน่าเชื่อถือ ความเป็นมืออาชีพ", score: 3.92 },
    { name: "ความรวดเร็วในการให้บริการ (หลังเรียกคิว)", score: 3.78 },
    { name: "ความถูกต้องในการทำธุรกรรม", score: 4.15 },
    { name: "ความพร้อมของเครื่องมือให้บริการ", score: 3.67 },
    { name: "สภาพแวดล้อมของสาขา", score: 3.89 },
    { name: "ความพึงพอใจในการเข้าใช้บริการสาขา", score: 3.81 }
  ];

  // Calculate overall average
  const overallAverage = satisfactionTopics.reduce((sum, topic) => sum + topic.score, 0) / satisfactionTopics.length;

  // Generate regional satisfaction data for bar chart
  const regionalSatisfactionData = Array.from({ length: 18 }, (_, i) => ({
    name: `ภาค${i + 1}`,
    value: Math.random() * 2 + 3, // Random score between 3-5
  }));

  const stats = [{
    title: "ลูกค้าตอบแบบประเมิน",
    value: "3,245",
    unit: "ครั้ง",
    change: "+11.97%",
    previousValue: "(2,898 ครั้ง)",
    icon: Users,
    color: "bg-purple-50",
    iconColor: "text-purple-600",
    clickable: false
  }, {
    title: "ลูกค้าให้หมายเหตุ",
    value: "892",
    unit: "ครั้ง",
    change: "+2.65%",
    previousValue: "(869 ครั้ง)",
    icon: MessageSquare,
    color: "bg-blue-50",
    iconColor: "text-blue-600",
    clickable: true,
    targetPage: "feedback"
  }, {
    title: "ข้อร้องเรียนที่รุนแรง",
    value: "23",
    unit: "ครั้ง",
    change: "+4.17%",
    previousValue: "(24 ครั้ง)",
    icon: AlertTriangle,
    color: "bg-red-50",
    iconColor: "text-red-600",
    clickable: true,
    targetPage: "complaints"
  }, {
    title: "ลูกค้าให้ติดต่อกลับ",
    value: "156",
    unit: "ครั้ง",
    change: "+17.29%",
    previousValue: "(133 ครั้ง)",
    icon: Phone,
    color: "bg-green-50",
    iconColor: "text-green-600",
    clickable: false
  }];

  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(event.target.value);
  };

  const handleTopicClick = () => {
    setSelectedTopic("การดูแล เอาใจใส่ ความสบายใจเมื่อมาใช้บริการ");
    setSelectedScore(overallAverage);
    setIsModalOpen(true);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-border rounded-lg shadow-md">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-muted-foreground">
            สัดส่วน: {data.value}%
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value, name }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 30;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="hsl(var(--foreground))"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="text-sm font-medium"
      >
        {`${name} ${value}%`}
      </text>
    );
  };

  const handleCardClick = (stat: any) => {
    if (stat.clickable && stat.targetPage && onPageChange) {
      onPageChange(stat.targetPage);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">สรุปภาพรวมประจำเดือน {selectedMonth}</h1>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">เลือกเดือน:</span>
            <select 
              className="px-3 py-1 border rounded-md bg-background text-foreground"
              value={selectedMonth}
              onChange={handleMonthChange}
            >
              {monthOptions.map((month, index) => (
                <option key={index} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stats.map((stat, index) => (
          <Card 
            key={index} 
            className={`relative overflow-hidden border-0  ${stat.clickable ? 'cursor-pointer hover:shadow-xl transition-shadow duration-300' : ''}`}
            onClick={() => handleCardClick(stat)}
          >
            <CardContent className={`p-6 ${stat.color}`}>
              <div className="flex items-start justify-between">
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </h3>
                  <div className="space-y-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-foreground">{stat.value}</span>
                      <span className="text-lg text-muted-foreground">{stat.unit}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-green-600 font-medium">{stat.change}</span>
                      <span className="text-muted-foreground">จากเดือนที่แล้ว {stat.previousValue}</span>
                    </div>
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${stat.iconColor.replace('text-', 'bg-').replace('600', '100')}`}>
                  <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ระดับความพึงพอใจ */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">ระดับความพึงพอใจ</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Overall Score Card */}
          <Card className="bg-purple-50">
            <CardContent className="p-6">
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground">
                  ระดับความพึงพอใจ รายพื้นที่
                </h3>
                <div className="space-y-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-foreground">{overallAverage.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-green-600 font-medium">↗ 2.80%</span>
                    <span className="text-muted-foreground">
                      (ค่าเฉลี่ยจากเดือนที่แล้ว {(overallAverage - 0.1).toFixed(2)} คะแนน)
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleTopicClick}
                  className="text-sm text-primary hover:underline cursor-pointer"
                >
                  หัวข้อที่ใช้ประเมิน
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Regional Satisfaction Chart */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-medium text-foreground">
                ระดับความพึงพอใจ รายพื้นที่
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={regionalSatisfactionData} margin={{ bottom: 40 }}>
                  <XAxis 
                    dataKey="name" 
                    fontSize={12}
                    tick={{ fill: 'hsl(var(--foreground))' }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis 
                    domain={[0, 5]}
                    fontSize={12}
                    tick={{ fill: 'hsl(var(--foreground))' }}
                    label={{ value: 'คะแนน', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip 
                    formatter={(value) => [`${Number(value).toFixed(1)}`, 'คะแนน']}
                    labelFormatter={(label) => `${label}`}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar 
                    dataKey="value" 
                    fill="#EC4899" 
                    radius={[2, 2, 0, 0]} 
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ภาพรวมการให้บริการสาขา */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">ภาพรวมการให้บริการสาขา</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ประเภทของสาขา - Donut Chart */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-medium text-foreground">ประเภทของสาขา</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={branchTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={CustomLabel}
                    outerRadius={80}
                    innerRadius={50}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {branchTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* ประเภทการให้บริการ - Bar Chart */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-medium text-foreground">ประเภทการให้บริการ</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={serviceTypeData} margin={{ bottom: 5, right: 30 }}>
                  <XAxis 
                    dataKey="name" 
                    fontSize={12}
                    tick={{ fill: 'hsl(var(--foreground))' }}
                  />
                  <YAxis 
                    fontSize={12}
                    tick={{ fill: 'hsl(var(--foreground))' }}
                  />
                  <Tooltip 
                    formatter={(value, name) => [
                      value.toLocaleString(), 
                      name === 'gray' ? 'เดือนที่แล้ว' : 'เดือนปัจจุบัน'
                    ]}
                    labelFormatter={(label) => `ประเภท: ${label}`}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="gray" fill="#9CA3AF" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="pink" fill="#EC4899" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              
              {/* Legend */}
              <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-400 rounded"></div>
                  <span className="text-sm text-muted-foreground">เดือนที่แล้ว</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-pink-500 rounded"></div>
                  <span className="text-sm text-muted-foreground">เดือนปัจจุบัน</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Satisfaction Detail Modal */}
      <SatisfactionDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        topic={selectedTopic}
        score={selectedScore}
      />
    </div>
  );
};

export default DashboardPage;
