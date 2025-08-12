
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Server, 
  Database, 
  Shield, 
  Activity, 
  HardDrive, 
  Cpu, 
  MemoryStick, 
  Network,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react';

export const SystemManagementPage: React.FC = () => {
  const [lastUpdate, setLastUpdate] = useState(new Date().toLocaleString('th-TH'));

  const systemStatus = {
    server: 'online',
    database: 'online',
    security: 'secure',
    backup: 'completed'
  };

  const systemMetrics = [
    {
      title: 'CPU Usage',
      value: '23%',
      status: 'good',
      icon: Cpu,
      color: 'text-green-600'
    },
    {
      title: 'Memory Usage',
      value: '67%',
      status: 'warning',
      icon: MemoryStick,
      color: 'text-yellow-600'
    },
    {
      title: 'Disk Space',
      value: '45%',
      status: 'good',
      icon: HardDrive,
      color: 'text-green-600'
    },
    {
      title: 'Network',
      value: '1.2 GB/s',
      status: 'good',
      icon: Network,
      color: 'text-green-600'
    }
  ];

  const recentActivities = [
    {
      id: '1',
      action: 'Database backup completed',
      timestamp: '2024-01-15 03:00:00',
      status: 'success',
      details: 'Daily automated backup'
    },
    {
      id: '2',
      action: 'Security scan performed',
      timestamp: '2024-01-15 02:30:00',
      status: 'success',
      details: 'No threats detected'
    },
    {
      id: '3',
      action: 'System update applied',
      timestamp: '2024-01-14 23:15:00',
      status: 'success',
      details: 'Security patches installed'
    },
    {
      id: '4',
      action: 'Disk cleanup executed',
      timestamp: '2024-01-14 22:00:00',
      status: 'success',
      details: 'Freed 2.3 GB of space'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
      case 'secure':
      case 'completed':
      case 'success':
      case 'good':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      case 'error':
      case 'offline':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'online':
        return <Badge className="bg-green-100 text-green-800">ออนไลน์</Badge>;
      case 'secure':
        return <Badge className="bg-green-100 text-green-800">ปลอดภัย</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">เสร็จสิ้น</Badge>;
      case 'good':
        return <Badge className="bg-green-100 text-green-800">ปกติ</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-100 text-yellow-800">เตือน</Badge>;
      default:
        return <Badge variant="outline">ไม่ทราบ</Badge>;
    }
  };

  const handleRefresh = () => {
    setLastUpdate(new Date().toLocaleString('th-TH'));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">จัดการระบบ</h1>
          <p className="text-muted-foreground">
            ตรวจสอบสถานะระบบและการตั้งค่าต่างๆ
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            อัปเดตล่าสุด: {lastUpdate}
          </span>
          <Button onClick={handleRefresh}>
            <Activity className="mr-2 h-4 w-4" />
            รีเฟรช
          </Button>
        </div>
      </div>

      {/* System Status Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">เซิร์ฟเวอร์</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {getStatusIcon(systemStatus.server)}
              {getStatusBadge(systemStatus.server)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ฐานข้อมูล</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {getStatusIcon(systemStatus.database)}
              {getStatusBadge(systemStatus.database)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ความปลอดภัย</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {getStatusIcon(systemStatus.security)}
              {getStatusBadge(systemStatus.security)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">สำรองข้อมูล</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {getStatusIcon(systemStatus.backup)}
              {getStatusBadge(systemStatus.backup)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>ประสิทธิภาพระบบ</CardTitle>
          <CardDescription>
            ตรวจสอบการใช้ทรัพยากรระบบในขณะนี้
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            {systemMetrics.map((metric, index) => (
              <div key={index} className="flex items-center gap-3 p-4 border rounded-lg">
                <metric.icon className={`h-8 w-8 ${metric.color}`} />
                <div>
                  <p className="text-sm font-medium">{metric.title}</p>
                  <p className="text-2xl font-bold">{metric.value}</p>
                  {getStatusBadge(metric.status)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Activities */}
      <Card>
        <CardHeader>
          <CardTitle>กิจกรรมระบบล่าสุด</CardTitle>
          <CardDescription>
            ประวัติการทำงานและการอัปเดตของระบบ
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center gap-4 p-4 border rounded-lg">
                {getStatusIcon(activity.status)}
                <div className="flex-1">
                  <p className="font-medium">{activity.action}</p>
                  <p className="text-sm text-muted-foreground">{activity.details}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{activity.timestamp}</p>
                  {getStatusBadge(activity.status)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Configuration */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>การตั้งค่าระบบ</CardTitle>
            <CardDescription>
              จัดการการตั้งค่าพื้นฐานของระบบ
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full justify-start">
              <Database className="mr-2 h-4 w-4" />
              การตั้งค่าฐานข้อมูล
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Shield className="mr-2 h-4 w-4" />
              การตั้งค่าความปลอดภัย
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Network className="mr-2 h-4 w-4" />
              การตั้งค่าเครือข่าย
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>การบำรุงรักษา</CardTitle>
            <CardDescription>
              เครื่องมือสำหรับการบำรุงรักษาระบบ
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full justify-start">
              <HardDrive className="mr-2 h-4 w-4" />
              ทำความสะอาดระบบ
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Activity className="mr-2 h-4 w-4" />
              ตรวจสอบสุขภาพระบบ
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Database className="mr-2 h-4 w-4" />
              สำรองข้อมูล
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Alert */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          ระบบทำงานปกติ ไม่พบปัญหาที่ต้องแก้ไขเร่งด่วน การสำรองข้อมูลล่าสุดเสร็จสิ้นเมื่อวันที่ 15 มกราคม 2024 เวลา 03:00 น.
        </AlertDescription>
      </Alert>
    </div>
  );
};
