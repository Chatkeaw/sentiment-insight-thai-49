
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, MessageSquare, AlertTriangle, Phone } from 'lucide-react';

const DashboardPage = () => {
  const stats = [{
    title: "ลูกค้าตอบแบบประเมิน",
    value: "3,245",
    unit: "ครั้ง",
    change: "+11.97%",
    previousValue: "(2,898 ครั้ง)",
    icon: Users,
    color: "bg-purple-50",
    iconColor: "text-purple-600"
  }, {
    title: "ลูกค้าให้หมายเหตุ",
    value: "892",
    unit: "ครั้ง",
    change: "+2.65%",
    previousValue: "(869 ครั้ง)",
    icon: MessageSquare,
    color: "bg-blue-50",
    iconColor: "text-blue-600"
  }, {
    title: "ข้อร้องเรียนที่รุนแรง",
    value: "23",
    unit: "ครั้ง",
    change: "+4.17%",
    previousValue: "(24 ครั้ง)",
    icon: AlertTriangle,
    color: "bg-red-50",
    iconColor: "text-red-600"
  }, {
    title: "ลูกค้าให้ติดต่อกลับ",
    value: "156",
    unit: "ครั้ง",
    change: "+17.29%",
    previousValue: "(133 ครั้ง)",
    icon: Phone,
    color: "bg-green-50",
    iconColor: "text-green-600"
  }];

  // Generate month options from มกราคม 2567 to สิงหาคม 2568
  const monthOptions = [
    "มกราคม 2567", "กุมภาพันธ์ 2567", "มีนาคม 2567", "เมษายน 2567", "พฤษภาคม 2567", "มิถุนายน 2567",
    "กรกฎาคม 2567", "สิงหาคม 2567", "กันยายน 2567", "ตุลาคม 2567", "พฤศจิกายน 2567", "ธันวาคม 2567",
    "มกราคม 2568", "กุมภาพันธ์ 2568", "มีนาคม 2568", "เมษายน 2568", "พฤษภาคม 2568", "มิถุนายน 2568",
    "กรกฎาคม 2568", "สิงหาคม 2568"
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">สรุปภาพรวมประจำเดือน มิถุนายน 2568</h1>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">เลือกเดือน:</span>
            <select className="px-3 py-1 border rounded-md bg-background text-foreground">
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
          <Card key={index} className="relative overflow-hidden border-0 shadow-lg">
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
    </div>
  );
};

export default DashboardPage;
