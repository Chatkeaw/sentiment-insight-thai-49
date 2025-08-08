
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, LineChart, Line, Legend } from 'recharts';
import { Button } from '@/components/ui/button';

export const SentimentDetailPage: React.FC = () => {
  // Mock KPI data
  const kpiData = {
    total: 1248,
    positive: 654,
    negative: 394,
    neutral: 200,
  };

  // Mock donut data
  const donutData = [
    { name: 'เชิงบวก', value: kpiData.positive, percentage: 52, color: '#10B981' },
    { name: 'เชิงลบ', value: kpiData.negative, percentage: 32, color: '#EF4444' },
    { name: 'ไม่มีนัยสำคัญ', value: kpiData.neutral, percentage: 16, color: '#6B7280' },
  ];

  // Mock district sentiment data
  const districtSentimentData = Array.from({ length: 8 }, (_, i) => ({
    district: `เขต ${i + 1}`,
    positive: Math.floor(Math.random() * 50) + 20,
    negative: Math.floor(Math.random() * 30) + 10,
  }));

  // Mock trend data
  const trendData = Array.from({ length: 12 }, (_, i) => ({
    month: `${i + 1}`,
    positive: Math.floor(Math.random() * 30) + 40,
    negative: Math.floor(Math.random() * 20) + 15,
  }));

  // Mock detailed category data
  const categoryData = [
    { subcategory: 'ระบบ Core ของธนาคาร', category: 'เทคโนโลยีและดิจิทัล', total: 123, positive: 45, negative: 78 },
    { subcategory: 'ATM ADM CDM', category: 'เทคโนโลยีและดิจิทัล', total: 90, positive: 34, negative: 56 },
    { subcategory: 'ระบบเรียกคิวและจัดการคิว', category: 'ระบบและกระบวนการให้บริการ', total: 112, positive: 67, negative: 45 },
    { subcategory: 'พื้นที่และความคับคั่ง', category: 'สภาพแวดล้อมและสิ่งอำนวยความสะดวก', total: 66, positive: 23, negative: 43 },
    { subcategory: 'ความรวดเร็วในการให้บริการ', category: 'พนักงานและบุคลากร', total: 130, positive: 89, negative: 41 },
    { subcategory: 'อุณหภูมิ', category: 'สภาพแวดล้อมและสิ่งอำนวยความสะดวก', total: 50, positive: 12, negative: 38 },
    { subcategory: 'เครื่องนับเงิน', category: 'เทคโนโลยีและดิจิทัล', total: 80, positive: 45, negative: 35 },
    { subcategory: 'ที่จอดรถ', category: 'สภาพแวดล้อมและสิ่งอำนวยความสะดวก', total: 88, positive: 56, negative: 32 },
  ];

  const handleViewComments = (category: string) => {
    console.log(`View comments for: ${category}`);
    // This would navigate to the feedback page with filter
  };

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold text-foreground">
        วิเคราะห์เชิงลึก - ทัศนคติความคิดเห็นรายพื้นที่
      </h2>
      
      {/* KPI Card */}
      <Card className="chart-container-medium animate-fade-in">
        <CardHeader>
          <CardTitle className="card-title">ทัศนคติการให้บริการ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{kpiData.total}</div>
              <div className="text-sm text-muted-foreground">ทั้งหมด</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{kpiData.positive}</div>
              <div className="text-sm text-muted-foreground">เชิงบวก</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{kpiData.negative}</div>
              <div className="text-sm text-muted-foreground">เชิงลบ</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">{kpiData.neutral}</div>
              <div className="text-sm text-muted-foreground">ไม่มีนัยสำคัญ</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sentiment Proportion */}
      <Card className="chart-container-large animate-fade-in">
        <CardHeader>
          <CardTitle className="card-title">สัดส่วน ทัศนคติต่อการให้บริการ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <div className="flex-1">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={donutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {donutData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name) => [`${value} ครั้ง`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="ml-4 space-y-3">
              {donutData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <div className="text-sm">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-muted-foreground">
                      {item.value.toLocaleString()} ({item.percentage}%)
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* District Sentiment */}
      <Card className="chart-container-large animate-fade-in">
        <CardHeader>
          <CardTitle className="card-title">ทัศนคติการให้บริการ รายเขต</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={districtSentimentData} margin={{ bottom: 40 }}>
              <XAxis 
                dataKey="district" 
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
                formatter={(value, name) => [`${value} ครั้ง`, name === 'positive' ? 'เชิงบวก' : 'เชิงลบ']}
                labelFormatter={(label) => `${label}`}
              />
              <Bar dataKey="positive" fill="#10B981" radius={[2, 2, 0, 0]} />
              <Bar dataKey="negative" fill="#EF4444" radius={[2, 2, 0, 0]} />
              <Legend 
                formatter={(value) => value === 'positive' ? 'เชิงบวก' : 'เชิงลบ'}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Sentiment Trend */}
      <Card className="chart-container-large animate-fade-in">
        <CardHeader>
          <CardTitle className="card-title">แนวโน้มทัศนคติต่อการให้บริการ</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={trendData}>
              <XAxis 
                dataKey="month"
                label={{ value: 'เดือน', position: 'insideBottom', offset: -10 }}
                fontSize={12}
              />
              <YAxis 
                label={{ value: 'ความถี่ (ครั้ง)', angle: -90, position: 'insideLeft' }}
                fontSize={12}
              />
              <Tooltip 
                formatter={(value, name) => [`${value} ครั้ง`, name === 'positive' ? 'เชิงบวก' : 'เชิงลบ']}
                labelFormatter={(label) => `เดือน: ${label}`}
              />
              <Line 
                type="monotone" 
                dataKey="positive" 
                stroke="#10B981" 
                strokeWidth={3}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="negative" 
                stroke="#EF4444" 
                strokeWidth={3}
                dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
              />
              <Legend 
                formatter={(value) => value === 'positive' ? 'เชิงบวก' : 'เชิงลบ'}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Category Table */}
      <Card className="chart-container-large animate-fade-in">
        <CardHeader>
          <CardTitle className="card-title">ความคิดเห็นรายละเอียด</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-border">
              <thead>
                <tr className="bg-muted/50">
                  <th className="border border-border p-3 text-left font-medium">หัวข้อย่อย</th>
                  <th className="border border-border p-3 text-left font-medium">หัวข้อใหญ่</th>
                  <th className="border border-border p-3 text-center font-medium">รวม</th>
                  <th className="border border-border p-3 text-center font-medium">เชิงบวก</th>
                  <th className="border border-border p-3 text-center font-medium">เชิงลบ</th>
                  <th className="border border-border p-3 text-center font-medium">การดำเนินการ</th>
                </tr>
              </thead>
              <tbody>
                {categoryData.map((item, index) => (
                  <tr key={index} className="hover:bg-muted/30 transition-colors">
                    <td className="border border-border p-3">{item.subcategory}</td>
                    <td className="border border-border p-3 text-muted-foreground">{item.category}</td>
                    <td className="border border-border p-3 text-center font-medium">{item.total}</td>
                    <td className="border border-border p-3 text-center text-green-600 font-medium">{item.positive}</td>
                    <td className="border border-border p-3 text-center text-red-600 font-medium">{item.negative}</td>
                    <td className="border border-border p-3 text-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewComments(item.subcategory)}
                      >
                        ดูความคิดเห็น
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
