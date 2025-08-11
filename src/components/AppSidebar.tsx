
import React from 'react';
import { 
  BarChart3, 
  MapPin, 
  TrendingUp, 
  MessageSquare, 
  AlertTriangle, 
  Bot,
  Home,
  Lock
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
} from '@/components/ui/sidebar';
import { useAnalytics } from '@/contexts/AnalyticsContext';

interface AppSidebarProps {
  activePage: string;
  onPageChange: (page: string) => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({ activePage, onPageChange }) => {
  const { state } = useAnalytics();

  const menuItems = [
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

  return (
    <Sidebar className="border-r border-border/50 bg-gradient-to-b from-pink-50/50 to-white/50">
      <SidebarHeader className="p-4 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg flex items-center justify-center">
            <Home className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-primary">เมนูหลัก</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1 ml-11">Dashboard System</p>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1 p-4">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => !item.disabled && onPageChange(item.id)}
                    className={`
                      w-full justify-start text-left p-3 rounded-xl transition-all duration-200 group
                      ${activePage === item.id 
                        ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-lg shadow-pink-500/25' 
                        : item.disabled 
                          ? 'text-muted-foreground/50 cursor-not-allowed opacity-50' 
                          : 'text-slate-700 hover:bg-pink-50 hover:text-pink-600'
                      }
                    `}
                    disabled={item.disabled}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <div className={`
                        w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200
                        ${activePage === item.id 
                          ? 'bg-white/20' 
                          : item.disabled 
                            ? 'bg-gray-100' 
                            : 'bg-pink-100 group-hover:bg-pink-200'
                        }
                      `}>
                        <item.icon className={`
                          w-4 h-4 
                          ${activePage === item.id 
                            ? 'text-white' 
                            : item.disabled 
                              ? 'text-gray-400' 
                              : 'text-pink-600'
                          }
                        `} />
                        {item.disabled && (
                          <Lock className="w-3 h-3 text-gray-400 absolute" />
                        )}
                      </div>
                      <span className="text-sm font-medium leading-tight flex-1">
                        {item.title}
                      </span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
