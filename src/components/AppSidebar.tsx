
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
  Activity
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
} from '@/components/ui/sidebar';
import { useAnalytics } from '@/contexts/AnalyticsContext';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';

interface AppSidebarProps {
  activePage: string;
  onPageChange: (page: string) => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({ activePage, onPageChange }) => {
  const { state } = useAnalytics();
  const { state: authState, hasPermission } = useAuth();

  const dashboardItems = [
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

  const managementItems = [
    { 
      id: 'user-management', 
      title: 'จัดการผู้ใช้งาน', 
      icon: Users,
      permission: 'manage_users'
    },
    { 
      id: 'ai-models', 
      title: 'จัดการโมเดล AI', 
      icon: Settings,
      permission: 'manage_ai'
    },
    { 
      id: 'activity-logs', 
      title: 'บันทึกการใช้งาน', 
      icon: Activity,
      permission: 'view_logs'
    },
  ];

  return (
    <Sidebar className="border-r border-border/50 bg-gradient-to-b from-pink-50/50 to-white/50">
      <SidebarContent>
        {/* Dashboard Section */}
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2 p-4">
              {dashboardItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => !item.disabled && onPageChange(item.id)}
                    className={`
                      w-full justify-start text-left p-4 rounded-lg transition-all duration-200
                      ${activePage === item.id 
                        ? 'bg-primary/20 text-primary border-l-4 border-primary font-medium' 
                        : item.disabled 
                          ? 'text-muted-foreground/50 cursor-not-allowed bg-gray-100' 
                          : 'text-primary/70 hover:bg-primary/10 hover:text-primary'
                      }
                    `}
                    disabled={item.disabled}
                  >
                    <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
                    <span className="text-sm font-medium leading-tight">
                      {item.title}
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Management Section - Only for authorized users */}
        {managementItems.some(item => hasPermission(item.permission)) && (
          <SidebarGroup>
            <SidebarGroupLabel className="flex items-center">
              การจัดการระบบ
              <Badge variant="outline" className="ml-2 text-xs">
                {authState.user?.role === 'system_admin' ? 'System' : 'Admin'}
              </Badge>
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-2 p-4">
                {managementItems
                  .filter(item => hasPermission(item.permission))
                  .map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        onClick={() => onPageChange(item.id)}
                        className={`
                          w-full justify-start text-left p-4 rounded-lg transition-all duration-200
                          ${activePage === item.id 
                            ? 'bg-primary/20 text-primary border-l-4 border-primary font-medium' 
                            : 'text-primary/70 hover:bg-primary/10 hover:text-primary'
                          }
                        `}
                      >
                        <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
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
      </SidebarContent>
    </Sidebar>
  );
};
