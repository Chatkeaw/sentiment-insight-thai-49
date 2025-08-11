import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Users, MessageSquare, TrendingUp, AlertTriangle, Calendar } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

const DashboardPage = () => {
  const stats = [
    {
      title: "สรุปภาพรวม",
      value: "12,543",
      description: "ความคิดเห็นทั้งหมด",
      icon: BarChart3,
      trend: "+12.5%",
      color: "pink"
    },
    {
      title: "สถิติรายวัน", 
      value: "342",
      description: "ความคิดเห็นวันนี้",
      icon: Calendar,
      trend: "+5.2%",
      color: "blue"
    },
    {
      title: "คำร้องใหม่วันนี้",
      value: "28",
      description: "ข้อร้องเรียนที่รอดำเนินการ",
      icon: AlertTriangle,
      trend: "-8.1%",
      color: "orange"
    }
  ];

  const recentActivities = [
    { id: 1, action: "ความคิดเห็นใหม่", user: "ผู้ใช้งาน A", time: "5 นาทีที่แล้ว", type: "positive" },
    { id: 2, action: "ข้อร้องเรียนใหม่", user: "ผู้ใช้งาน B", time: "15 นาทีที่แล้ว", type: "negative" },
    { id: 3, action: "การประเมินบริการ", user: "ผู้ใช้งาน C", time: "1 ชั่วโมงที่แล้ว", type: "neutral" },
    { id: 4, action: "ความคิดเห็นเชิงบวก", user: "ผู้ใช้งาน D", time: "2 ชั่วโมงที่แล้ว", type: "positive" },
  ];

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case 'positive': return 'bg-green-100 text-green-800 border-green-200';
      case 'negative': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-pink-800">ยินดีต้อนรับสู่ Dashboard</h1>
        <p className="text-pink-600/80">ภาพรวมการทำงานของระบบในเวลาเรียลไทม์</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover-scale bg-gradient-to-br from-white to-pink-50/30 border-pink-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-pink-800">
                {stat.title}
              </CardTitle>
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center
                ${stat.color === 'pink' ? 'bg-pink-100 text-pink-600' : 
                  stat.color === 'blue' ? 'bg-blue-100 text-blue-600' : 
                  'bg-orange-100 text-orange-600'}
              `}>
                <stat.icon className="w-5 h-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-pink-900">{stat.value}</div>
                <p className="text-xs text-pink-600/70">{stat.description}</p>
                <div className={`text-xs ${stat.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.trend} จากเมื่อเทียบกับเดือนที่แล้ว
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activities */}
      <Card className="bg-gradient-to-br from-white to-pink-50/20 border-pink-200/50 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-pink-800">
            <MessageSquare className="w-5 h-5" />
            กิจกรรมล่าสุด
          </CardTitle>
          <CardDescription className="text-pink-600/70">
            กิจกรรมและการอัพเดทล่าสุดของระบบ
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 rounded-lg bg-white/50 border border-pink-100 hover:bg-pink-50/30 transition-colors duration-200">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-pink-400"></div>
                  <div>
                    <p className="text-sm font-medium text-pink-900">{activity.action}</p>
                    <p className="text-xs text-pink-600/70">โดย {activity.user}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getBadgeVariant(activity.type)}>
                    {activity.type === 'positive' ? 'เชิงบวก' : 
                     activity.type === 'negative' ? 'เชิงลบ' : 'เป็นกลาง'}
                  </Badge>
                  <span className="text-xs text-pink-600/60">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="bg-gradient-to-br from-white to-pink-50/20 border-pink-200/50 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-pink-800">
            <TrendingUp className="w-5 h-5" />
            การดำเนินการด่วน
          </CardTitle>
          <CardDescription className="text-pink-600/70">
            เข้าถึงฟังก์ชันหลักของระบบได้อย่างรวดเร็ว
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "ดูรายงาน", icon: BarChart3, color: "pink" },
              { name: "จัดการผู้ใช้", icon: Users, color: "blue" },
              { name: "ตรวจสอบข้อร้องเรียน", icon: AlertTriangle, color: "orange" },
              { name: "วิเคราะห์ข้อมูล", icon: TrendingUp, color: "green" }
            ].map((action, index) => (
              <button
                key={index}
                className={`
                  p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 hover:shadow-md
                  ${action.color === 'pink' ? 'border-pink-200 hover:border-pink-300 hover:bg-pink-50' :
                    action.color === 'blue' ? 'border-blue-200 hover:border-blue-300 hover:bg-blue-50' :
                    action.color === 'orange' ? 'border-orange-200 hover:border-orange-300 hover:bg-orange-50' :
                    'border-green-200 hover:border-green-300 hover:bg-green-50'}
                `}
              >
                <action.icon className={`
                  w-6 h-6 mx-auto mb-2
                  ${action.color === 'pink' ? 'text-pink-600' :
                    action.color === 'blue' ? 'text-blue-600' :
                    action.color === 'orange' ? 'text-orange-600' :
                    'text-green-600'}
                `} />
                <p className="text-sm font-medium text-gray-700">{action.name}</p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;