
import React from 'react';
import { 
  BarChart3, 
  MapPin, 
  TrendingUp, 
  MessageSquare, 
  AlertTriangle, 
  Bot,
  Users,
  Settings,
  Activity,
  Download,
  Bell,
  Upload,
  Zap,
  Link,
  Shield
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { useAnalytics } from '@/contexts/AnalyticsContext';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface AppSidebarProps {
  activePage: string;
  onPageChange: (page: string) => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({ activePage, onPageChange }) => {
  const { state } = useAnalytics();
  const { state: authState, hasPermission } = useAuth();

  const mainMenuItems = [
    { id: 'overview', title: 'สรุปภาพรวม Dashboard', icon: BarChart3 },
    { id: 'regional', title: 'ศักยภาพรายพื้นที่', icon: MapPin },
    { 
      id: 'analytics', 
      title: 'วิเคราะห์เชิงลึก', 
      icon: TrendingUp, 
      disabled: !state.isUnlocked 
    },
    { id: 'feedback', title: 'ความคิดเห็น', icon: MessageSquare },
    { id: 'complaints', title: 'ข้อร้องเรียน', icon: AlertTriangle },
    { id: 'ai-agent', title: 'AI AGENT', icon: Bot },
  ];

  const hrMenuItems = [
    { 
      id: 'export-data', 
      title: 'ส่งออกข้อมูล', 
      icon: Download,
      permission: 'export_data'
    },
    { 
      id: 'notifications', 
      title: 'การแจ้งเตือน', 
      icon: Bell,
      permission: 'view_notifications'
    },
  ];

  const adminMenuItems = [
    { 
      id: 'user-management', 
      title: 'จัดการผู้ใช้งาน', 
      icon: Users,
      permission: 'manage_users'
    },
    { 
      id: 'activity-logs', 
      title: 'บันทึกการใช้งาน', 
      icon: Activity,
      permission: 'view_logs'
    },
    { 
      id: 'system-updates', 
      title: 'อัพเดทระบบ', 
      icon: Upload,
      permission: 'system_updates'
    },
  ];

  const systemMenuItems = [
    { 
      id: 'ai-models', 
      title: 'จัดการโมเดล AI', 
      icon: Bot,
      permission: 'manage_ai'
    },
    { 
      id: 'integrations', 
      title: 'การเชื่อมต่อ API', 
      icon: Link,
      permission: 'manage_integrations'
    },
    { 
      id: 'automation', 
      title: 'ระบบอัตโนมัติ', 
      icon: Zap,
      permission: 'technical_monitoring'
    },
  ];

  return (
    <Sidebar className="w-72 border-r border-border/40 bg-gradient-to-b from-pink-50/50 via-white/30 to-pink-50/30 shadow-sm">
      {/* Sidebar Header */}
      <SidebarHeader className="p-6 border-b border-border/20">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-foreground">Dashboard</h2>
            <p className="text-sm text-muted-foreground">
              {authState.user?.role === 'hr' ? 'HR User' :
               authState.user?.role === 'business_admin' ? 'Business Admin' :
               authState.user?.role === 'system_admin' ? 'System Admin' : 'User'}
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="flex-1 py-4">
        {/* Main Dashboard Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="px-6 py-2 text-xs font-semibold text-muted-foreground/80 uppercase tracking-wider">
            หน้าหลัก
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="px-3 space-y-1">
              {mainMenuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => !item.disabled && onPageChange(item.id)}
                    className={`
                      w-full justify-start px-3 py-3 rounded-lg transition-all duration-200 group
                      ${activePage === item.id 
                        ? 'bg-gradient-to-r from-pink-500/20 to-pink-400/20 text-pink-700 border-l-4 border-pink-500 font-medium shadow-sm' 
                        : item.disabled 
                          ? 'text-muted-foreground/40 cursor-not-allowed' 
                          : 'text-muted-foreground hover:bg-pink-50/60 hover:text-pink-600'
                      }
                    `}
                    disabled={item.disabled}
                  >
                    <item.icon className={`w-5 h-5 mr-3 flex-shrink-0 transition-colors ${
                      activePage === item.id ? 'text-pink-600' : 'text-muted-foreground/60 group-hover:text-pink-500'
                    }`} />
                    <span className="text-sm font-medium leading-tight">
                      {item.title}
                    </span>
                    {item.disabled && (
                      <Badge variant="outline" className="ml-auto text-xs">ล็อค</Badge>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <Separator className="mx-6 my-4" />

        {/* HR Tools Section */}
        {authState.user?.role === 'hr' && hrMenuItems.some(item => hasPermission(item.permission)) && (
          <SidebarGroup>
            <SidebarGroupLabel className="px-6 py-2 flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground/80 uppercase tracking-wider">
                เครื่องมือ HR
              </span>
              <Badge variant="secondary" className="text-xs px-2 py-0.5">
                <Users className="w-3 h-3 mr-1" />
                HR
              </Badge>
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="px-3 space-y-1">
                {hrMenuItems
                  .filter(item => hasPermission(item.permission))
                  .map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        onClick={() => onPageChange(item.id)}
                        className={`
                          w-full justify-start px-3 py-3 rounded-lg transition-all duration-200 group
                          ${activePage === item.id 
                            ? 'bg-gradient-to-r from-blue-500/20 to-blue-400/20 text-blue-700 border-l-4 border-blue-500 font-medium shadow-sm' 
                            : 'text-muted-foreground hover:bg-blue-50/60 hover:text-blue-600'
                          }
                        `}
                      >
                        <item.icon className={`w-5 h-5 mr-3 flex-shrink-0 transition-colors ${
                          activePage === item.id ? 'text-blue-600' : 'text-muted-foreground/60 group-hover:text-blue-500'
                        }`} />
                        <span className="text-sm font-medium leading-tight">
                          {item.title}
                        </span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Business Admin Section */}
        {authState.user?.role === 'business_admin' && adminMenuItems.some(item => hasPermission(item.permission)) && (
          <>
            <Separator className="mx-6 my-4" />
            <SidebarGroup>
              <SidebarGroupLabel className="px-6 py-2 flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground/80 uppercase tracking-wider">
                  การจัดการธุรกิจ
                </span>
                <Badge variant="default" className="text-xs px-2 py-0.5">
                  <Shield className="w-3 h-3 mr-1" />
                  Admin
                </Badge>
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="px-3 space-y-1">
                  {adminMenuItems
                    .filter(item => hasPermission(item.permission))
                    .map((item) => (
                      <SidebarMenuItem key={item.id}>
                        <SidebarMenuButton
                          onClick={() => onPageChange(item.id)}
                          className={`
                            w-full justify-start px-3 py-3 rounded-lg transition-all duration-200 group
                            ${activePage === item.id 
                              ? 'bg-gradient-to-r from-emerald-500/20 to-emerald-400/20 text-emerald-700 border-l-4 border-emerald-500 font-medium shadow-sm' 
                              : 'text-muted-foreground hover:bg-emerald-50/60 hover:text-emerald-600'
                            }
                          `}
                        >
                          <item.icon className={`w-5 h-5 mr-3 flex-shrink-0 transition-colors ${
                            activePage === item.id ? 'text-emerald-600' : 'text-muted-foreground/60 group-hover:text-emerald-500'
                          }`} />
                          <span className="text-sm font-medium leading-tight">
                            {item.title}
                          </span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}

        {/* System Admin Section */}
        {authState.user?.role === 'system_admin' && systemMenuItems.some(item => hasPermission(item.permission)) && (
          <>
            <Separator className="mx-6 my-4" />
            <SidebarGroup>
              <SidebarGroupLabel className="px-6 py-2 flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground/80 uppercase tracking-wider">
                  การจัดการระบบ
                </span>
                <Badge variant="destructive" className="text-xs px-2 py-0.5">
                  <Settings className="w-3 h-3 mr-1" />
                  System
                </Badge>
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="px-3 space-y-1">
                  {systemMenuItems
                    .filter(item => hasPermission(item.permission))
                    .map((item) => (
                      <SidebarMenuItem key={item.id}>
                        <SidebarMenuButton
                          onClick={() => onPageChange(item.id)}
                          className={`
                            w-full justify-start px-3 py-3 rounded-lg transition-all duration-200 group
                            ${activePage === item.id 
                              ? 'bg-gradient-to-r from-red-500/20 to-red-400/20 text-red-700 border-l-4 border-red-500 font-medium shadow-sm' 
                              : 'text-muted-foreground hover:bg-red-50/60 hover:text-red-600'
                            }
                          `}
                        >
                          <item.icon className={`w-5 h-5 mr-3 flex-shrink-0 transition-colors ${
                            activePage === item.id ? 'text-red-600' : 'text-muted-foreground/60 group-hover:text-red-500'
                          }`} />
                          <span className="text-sm font-medium leading-tight">
                            {item.title}
                          </span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}
      </SidebarContent>

      {/* Sidebar Footer */}
      <SidebarFooter className="p-4 border-t border-border/20">
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Customer Feedback System v2.1
          </p>
          <p className="text-xs text-muted-foreground">
            ฝ่ายนวัตกรรมสารสนเทศ
          </p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};
