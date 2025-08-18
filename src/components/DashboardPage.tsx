import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, MessageSquare, AlertTriangle, Phone } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { SentimentAnalysisModal } from "./analytics/SentimentAnalysisModal";

interface DashboardPageProps {
  onPageChange?: (page: string) => void;
}

const [isSentimentModalOpen, setIsSentimentModalOpen] = useState(false);

const handleMainCategoryDetails = () => {
  setIsSentimentModalOpen(true);
};

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

  // State for customer feedback section
  const [selectedSentimentType, setSelectedSentimentType] = useState<'positive' | 'negative'>('positive');

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
    previousValue: Math.random() * 2 + 2.5, // Random previous value between 2.5-4.5
  }));

  // Data for customer sentiment donut chart
  const customerSentimentData = [
    { name: "เชิงบวก", value: 68, color: "#10B981" },
    { name: "เชิงลบ", value: 32, color: "#EF4444" }
  ];

  // Data for top 7 main categories
  const top7MainCategories = [
    { name: "พนักงานและบุคลากร", positive: 245, negative: 89 },
    { name: "เทคโนโลยีและดิจิทัล", positive: 156, negative: 134 },
    { name: "Market Conduct", positive: 23, negative: 12 },
    { name: "สภาพแวดล้อมและสิ่งอำนวยความสะดวก", positive: 198, negative: 76 },
    { name: "ระบบและกระบวนการให้บริการ", positive: 134, negative: 67 },
    { name: "เงื่อนไขและผลิตภัณฑ์", positive: 89, negative: 45 },
    { name: "อื่นๆ", positive: 67, negative: 34 }
  ];

  // Data for top 7 subcategories
  const top7SubCategories = [
    { name: "ความสุภาพและมารยาทของพนักงาน", positive: 189, negative: 45 },
    { name: "ความเอาใจใส่ในการให้บริการลูกค้า", positive: 167, negative: 23 },
    { name: "ไม่เอาเปรียบ", positive: 145, negative: 12 },
    { name: "ระบบ Core ของธนาคาร", positive: 98, negative: 87 },
    { name: "ความรวดเร็วในการให้บริการ", positive: 123, negative: 56 },
    { name: "ไม่บังคับ", positive: 78, negative: 34 },
    { name: "พื้นที่และความคับคั่ง", positive: 67, negative: 89 }
  ];

  // Data for regional feedback comparison
  const regionalFeedbackData = Array.from({ length: 18 }, (_, i) => ({
    region: `ภาค ${i + 1}`,
    positive: Math.floor(Math.random() * 50) + 20,
    negative: Math.floor(Math.random() * 30) + 10,
    previousPositive: Math.floor(Math.random() * 40) + 15,
    previousNegative: Math.floor(Math.random() * 25) + 8,
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

  const handleMainCategoryDetails = () => {
    console.log("อัพเดตเพิ่มเติมภายหลัง - หัวข้อใหญ่");
  };

  const handleSubCategoryDetails = () => {
    console.log("อัพเดตเพิ่มเติมภายหลัง - หมวดหมู่ย่อย");
  };

  const handleRegionalDetails = () => {
    console.log("อัพเดตเพิ่มเติมภายหลัง - รายพื้นที่");
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
                      name === 'gray' ? 'เดือนก่อนหน้า' : 'เดือนปัจจุบัน'
                    ]}
                    labelFormatter={(label) => `ประเภท: ${label}`}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="gray" name="gray" fill="#D1D5DB" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="pink" name="pink" fill="#EC4899" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              
              {/* Legend */}
              <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-300 rounded"></div>
                  <span className="text-sm text-muted-foreground">เดือนก่อนหน้า</span>
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

      {/* ระดับความพึงพอใจ */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">ระดับความพึงพอใจ</h2>
      
        <div className="grid grid-cols-[200px_1fr] gap-6">
          {/* Overall Score Card */}
          <Card className="bg-gradient-to-b from-pink-50 to-white rounded-2xl shadow-none flex items-center justify-center">
            <CardContent className="p-8 flex flex-col justify-center items-center text-center">
              <span className="text-5xl font-bold text-foreground">{overallAverage.toFixed(2)}</span>
              <div className="flex items-center gap-2 text-sm mt-2">
                <span className="text-green-600 font-medium">↗ 2.80%</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                (คำนวณจากเดือนก่อนหน้า {(overallAverage - 0.1).toFixed(2)} คะแนน)
              </p>
            </CardContent>
          </Card>
      
          {/* Regional Satisfaction Chart */}
          <Card className="border rounded-2xl shadow-none ">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-medium text-foreground">
                ระดับความพึงพอใจ รายพื้นที่
              </CardTitle>
              <button
                onClick={handleTopicClick}
                className="text-sm px-3 py-1 border rounded-lg text-muted-foreground hover:bg-muted"
              >
                หัวข้อที่ใช้ประเมิน
              </button>
            </CardHeader>
            <CardContent className="flex justify-center items-center">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={regionalSatisfactionData} margin={{ top: 40, bottom: 30 }} barCategoryGap="20%">
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
                    formatter={(value, name) => [
                      `${Number(value).toFixed(1)}`, 
                      name === 'previousValue' ? 'เดือนก่อนหน้า' : 'เดือนปัจจุบัน'
                    ]}
                    labelFormatter={(label) => `${label}`}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  {/* เดือนก่อนหน้า */}
                  <Bar 
                    dataKey="previousValue"
                    name="previousValue"
                    fill="#D1D5DB" // เทา
                    radius={[2, 2, 0, 0]} 
                  />
                  {/* ปัจจุบัน */}
                  <Bar 
                    dataKey="value" 
                    name="value"
                    fill="#EC4899" // ชมพู
                    radius={[2, 2, 0, 0]} 
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ข้อคิดเห็นของลูกค้า */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">ข้อคิดเห็นของลูกค้า</h2>
        
        {/* Card 1: Sentiment Analysis & Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ทัศนคติของลูกค้า - Donut Chart */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-medium text-foreground">ทัศนคติของลูกค้า</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={customerSentimentData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={CustomLabel}
                    outerRadius={80}
                    innerRadius={50}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {customerSentimentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'สัดส่วน']}
                    labelFormatter={(label) => label}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* หัวข้อที่ลูกค้าร้องเรียน - Top 7 Main Categories */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-medium text-foreground">หัวข้อที่ลูกค้าร้องเรียน</CardTitle>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleMainCategoryDetails}
              >
                ดูรายละเอียด
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {top7MainCategories.map((item, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-card/50 hover:bg-card/80 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">
                        {index + 1}
                      </div>
                      <span className="font-medium text-sm">{item.name}</span>
                    </div>
                    <div className="flex gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="font-medium">{item.positive}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <span className="font-medium">{item.negative}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* หมวดหมู่ที่ลูกค้าร้องเรียน - Top 7 Sub Categories */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-medium text-foreground">หมวดหมู่ที่ลูกค้าร้องเรียน</CardTitle>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleSubCategoryDetails}
              >
                ดูรายละเอียด
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {top7SubCategories.map((item, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-card/50 hover:bg-card/80 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">
                        {index + 1}
                      </div>
                      <span className="font-medium text-sm">{item.name}</span>
                    </div>
                    <div className="flex gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="font-medium">{item.positive}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <span className="font-medium">{item.negative}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Card 2: Regional Feedback Comparison */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-medium text-foreground">ข้อคิดเห็นของลูกค้า รายพื้นที่</CardTitle>
            <div className="flex gap-2">
              <Button 
                variant={selectedSentimentType === 'positive' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedSentimentType('positive')}
              >
                เชิงบวก
              </Button>
              <Button 
                variant={selectedSentimentType === 'negative' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedSentimentType('negative')}
              >
                เชิงลบ
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleRegionalDetails}
              >
                ดูรายละเอียด
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={regionalFeedbackData} margin={{ bottom: 40 }}>
                <XAxis 
                  dataKey="region" 
                  fontSize={12}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  label={{ value: 'ความถี่ (ครั้ง)', angle: -90, position: 'insideLeft' }}
                  fontSize={12}
                />
                <Tooltip 
                  formatter={(value, name) => {
                    let label = '';
                    if (name === 'positive' || name === 'previousPositive') {
                      label = name === 'positive' ? 'เชิงบวก (เดือนปัจจุบัน)' : 'เชิงบวก (เดือนก่อนหน้า)';
                    } else {
                      label = name === 'negative' ? 'เชิงลบ (เดือนปัจจุบัน)' : 'เชิงลบ (เดือนก่อนหน้า)';
                    }
                    return [`${value} ครั้ง`, label];
                  }}
                  labelFormatter={(label) => `${label}`}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                {selectedSentimentType === 'positive' ? (
                  <>
                    <Bar dataKey="previousPositive" fill="#D1D5DB" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="positive" fill="#10B981" radius={[2, 2, 0, 0]} />
                  </>
                ) : (
                  <>
                    <Bar dataKey="previousNegative" fill="#D1D5DB" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="negative" fill="#EF4444" radius={[2, 2, 0, 0]} />
                  </>
                )}
              </BarChart>
            </ResponsiveContainer>
            
            {/* Legend */}
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-300 rounded"></div>
                <span className="text-sm text-muted-foreground">เดือนก่อนหน้า</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded ${selectedSentimentType === 'positive' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm text-muted-foreground">เดือนปัจจุบัน</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Satisfaction Analysis Modal */}
    <SentimentAnalysisModal
      isOpen={isSentimentModalOpen}
      onClose={() => setIsSentimentModalOpen(false)}
      onViewFeedback={(region) => console.log("ดูความคิดเห็นของ:", region)}
    />
    </div>
  );
};

export default DashboardPage;
