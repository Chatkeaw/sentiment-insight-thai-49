
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
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from '@/components/ui/sidebar';
import { useAnalytics } from '@/contexts/AnalyticsContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useIsMobile } from '@/hooks/use-mobile';

interface AppSidebarProps {
  activePage: string;
  onPageChange: (page: string) => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({ activePage, onPageChange }) => {
  const { state } = useAnalytics();
  const { open } = useSidebar();
  const isMobile = useIsMobile();

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

  const MenuItem = ({ item, isActive, isDisabled }: { 
    item: typeof menuItems[0], 
    isActive: boolean, 
    isDisabled: boolean 
  }) => {
    const content = (
      <SidebarMenuButton
        onClick={() => !isDisabled && onPageChange(item.id)}
        className={`
          w-full justify-start text-left p-4 rounded-2xl transition-all duration-300 group relative overflow-hidden
          ${isActive 
            ? 'bg-gradient-to-r from-pink-500 via-pink-600 to-rose-500 text-white shadow-xl shadow-pink-500/30 transform scale-[1.02]' 
            : isDisabled 
              ? 'text-gray-400 cursor-not-allowed opacity-60' 
              : 'text-slate-700 hover:bg-gradient-to-r hover:from-pink-50 hover:to-rose-50 hover:text-pink-700 hover:shadow-lg hover:shadow-pink-500/10 hover:scale-[1.01]'
          }
          ${!open && !isMobile ? 'justify-center p-3' : ''}
        `}
        disabled={isDisabled}
      >
        {/* Active item left highlight */}
        {isActive && (
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full opacity-80" />
        )}
        
        {/* Hover glow effect */}
        <div className={`
          absolute inset-0 rounded-2xl transition-opacity duration-300
          ${!isActive && !isDisabled ? 'opacity-0 group-hover:opacity-100 bg-gradient-to-r from-pink-100/50 to-rose-100/50' : 'opacity-0'}
        `} />
        
        <div className="flex items-center gap-4 w-full relative z-10">
          <div className={`
            w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 relative
            ${isActive 
              ? 'bg-white/20 backdrop-blur-sm shadow-lg' 
              : isDisabled 
                ? 'bg-gray-100' 
                : 'bg-pink-100 group-hover:bg-pink-200 group-hover:shadow-md'
            }
          `}>
            <item.icon className={`
              w-5 h-5 transition-all duration-300
              ${isActive 
                ? 'text-white scale-110' 
                : isDisabled 
                  ? 'text-gray-400' 
                  : 'text-pink-600 group-hover:text-pink-700 group-hover:scale-110'
              }
            `} />
            {isDisabled && (
              <Lock className="w-3 h-3 text-gray-400 absolute -top-1 -right-1 bg-white rounded-full p-0.5" />
            )}
          </div>
          
          {(open || !isMobile) && (
            <span className={`
              text-sm font-semibold leading-tight flex-1 transition-all duration-300
              ${isActive ? 'text-white' : isDisabled ? 'text-gray-400' : 'text-slate-700 group-hover:text-pink-700'}
            `}>
              {item.title}
            </span>
          )}
        </div>
        
        {/* Subtle shine effect on active */}
        {isActive && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 animate-[shimmer_2s_ease-in-out_infinite]" />
        )}
      </SidebarMenuButton>
    );

    // Wrap with tooltip for collapsed state
    if ((!open && !isMobile) || (isMobile && !open)) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              {content}
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-slate-900 text-white border-slate-700">
              <p className="text-sm">{item.title}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return content;
  };

  return (
    <Sidebar 
      className={`
        border-r border-pink-200/50 bg-gradient-to-b from-white via-pink-50/30 to-rose-50/20 backdrop-blur-sm
        transition-all duration-300 ease-in-out
        ${!open ? 'w-20' : 'w-72'}
      `}
      collapsible="icon"
    >
      {/* Header */}
      <SidebarHeader className={`
        p-6 border-b border-pink-200/50 transition-all duration-300
        ${!open && !isMobile ? 'p-4' : ''}
      `}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-pink-500 via-pink-600 to-rose-500 rounded-2xl flex items-center justify-center shadow-lg shadow-pink-500/30">
            <Home className="w-6 h-6 text-white" />
          </div>
          {(open || !isMobile) && (
            <div className="animate-fade-in">
              <h2 className="font-bold text-lg text-slate-800">เมนูหลัก</h2>
              <p className="text-xs text-pink-600/70 font-medium">Dashboard System</p>
            </div>
          )}
        </div>
      </SidebarHeader>
      
      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <MenuItem 
                    item={item} 
                    isActive={activePage === item.id}
                    isDisabled={!!item.disabled}
                  />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
