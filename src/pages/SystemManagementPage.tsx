
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Database, 
  Shield, 
  Activity, 
  HardDrive, 
  Network,
  AlertTriangle,
  CheckCircle 
} from 'lucide-react';

export const SystemManagementPage: React.FC = () => {
  const systemStats = [
    { label: 'สถานะระบบ', value: 'ปกติ', status: 'success', icon: CheckCircle },
    { label: 'การใช้งาน CPU', value: '32%', status: 'normal', icon: Activity },
    { label: 'การใช้งานหน่วยความจำ', value: '68%', status: 'warning', icon: HardDrive },
    { label: 'สถานะเครือข่าย', value: 'เชื่อมต่อ', status: 'success', icon: Network },
  ];

  const systemSettings = [
    {
      title: 'การตั้งค่าระบบ',
      description: 'จัดการการตั้งค่าพื้นฐานของระบบ',
      icon: Settings,
      items: ['ข้อมูลองค์กร', 'การแจ้งเตือน', 'ธีมและรูปแบบ']
    },
    {
      title: 'ฐานข้อมูล',
      description: 'จัดการและตรวจสอบฐานข้อมูล',
      icon: Database,
      items: ['สำรองข้อมูล', 'การเชื่อมต่อ', 'ประสิทธิภาพ']
    },
    {
      title: 'ความปลอดภัย',
      description: 'การตั้งค่าและนโยบายความปลอดภัย',
      icon: Shield,
      items: ['นโยบายรหัสผ่าน', 'การเข้ารหัส', 'การตรวจสอบ']
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-emerald-600';
      case 'warning': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      default: return 'text-blue-600';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success': return 'secondary';
      case 'warning': return 'destructive';
      case 'error': return 'destructive';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">จัดการระบบ</h1>
        <p className="text-muted-foreground">
          ตรวจสอบสถานะและจัดการการตั้งค่าระบบ
        </p>
      </div>

      {/* System Status Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        {systemStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <stat.icon className={`h-4 w-4 ${getStatusColor(stat.status)}`} />
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <div className={`text-2xl font-bold ${getStatusColor(stat.status)}`}>
                  {stat.value}
                </div>
                <Badge variant={getStatusBadge(stat.status)} className="text-xs">
                  {stat.status === 'success' ? 'ปกติ' : stat.status === 'warning' ? 'เฝ้าระวัง' : 'ข้อผิดพลาด'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* System Settings */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {systemSettings.map((setting, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <setting.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">{setting.title}</CardTitle>
                  <CardDescription>{setting.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                {setting.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex items-center text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-primary/50 rounded-full mr-2"></div>
                    {item}
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full">
                จัดการ
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent System Activities */}
      <Card>
        <CardHeader>
          <CardTitle>กิจกรรมระบบล่าสุด</CardTitle>
          <CardDescription>ประวัติการเปลี่ยนแปลงและกิจกรรมของระบบ</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                time: '10:30 น.',
                action: 'อัปเดตระบบเสร็จสิ้น',
                user: 'System',
                status: 'success'
              },
              {
                time: '09:15 น.',
                action: 'สำรองข้อมูลอัตโนมัติ',
                user: 'System',
                status: 'success'
              },
              {
                time: '08:45 น.',
                action: 'เข้าสู่ระบบ Admin',
                user: 'สมชาย บริหาร',
                status: 'normal'
              },
              {
                time: '07:30 น.',
                action: 'ตรวจสอบประสิทธิภาพ',
                user: 'System',
                status: 'warning'
              }
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.status === 'success' ? 'bg-emerald-500' :
                    activity.status === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                  }`}></div>
                  <div>
                    <div className="font-medium">{activity.action}</div>
                    <div className="text-sm text-muted-foreground">โดย {activity.user}</div>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">{activity.time}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
