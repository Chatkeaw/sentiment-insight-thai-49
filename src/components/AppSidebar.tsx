
import React from 'react';
import { BarChart3, MapPin, TrendingUp, MessageSquare, AlertTriangle, Bot, Home, Users, Settings, BookOpen } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { useAnalytics } from '@/contexts/AnalyticsContext';
import { useAuth } from '@/contexts/AuthContext';

interface AppSidebarProps {
  activePage: string;
  onPageChange: (page: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  activePage,
  onPageChange,
  isOpen,
  onToggle
}) => {
  const { state } = useAnalytics();
  const { state: authState } = useAuth();

  // Base menu items for all users
  const baseMenuItems = [
    {
      id: 'overview',
      title: 'สรุปภาพรวมประจำเดือน',
      icon: BarChart3
    },
    {
      id: 'analytics',
      title: 'ติดตามผลดำเนินงาน',
      icon: TrendingUp
    },
    {
      id: 'regional',
      title: 'ศักยภาพรายพื้นที่',
      icon: MapPin
    },
    {
      id: 'feedback',
      title: 'ความคิดเห็น',
      icon: MessageSquare
    },
    {
      id: 'complaints',
      title: 'ข้อร้องเรียน',
      icon: AlertTriangle
    },
    {
      id: 'category-reference',
      title: 'Category Reference',
      icon: BookOpen
    }
  ];

  // Admin-only menu items
  const adminMenuItems = authState.user?.role === 'admin' ? [
    {
      id: 'user-management',
      title: 'ผู้ใช้งาน',
      icon: Users,
      category: 'การจัดการระบบ'
    },
    {
      id: 'system-management',
      title: 'ระบบ',
      icon: Settings,
      category: 'การจัดการระบบ'
    }
  ] : [];

  // AI Agent item (available to all users)
  const aiAgentItem = {
    id: 'ai-agent',
    title: 'AI AGENT',
    icon: Bot,
    badge: 'NEW'
  };

  const allMenuItems = [...baseMenuItems, ...adminMenuItems];

  return (
    <TooltipProvider>
      <aside id="sidebar" className={`
          fixed left-0 top-0 h-screen bg-gradient-to-b from-rose-50 to-pink-50 
          rounded-3xl shadow-[0_6px_30px_rgba(236,72,153,0.12)] z-40 
          transition-all duration-300 ease-out px-3 pt-4 pb-6
          ${isOpen ? 'w-[256px]' : 'w-[72px]'}
          ${!isOpen && 'lg:w-[72px]'}
        `}>
        {/* Home Icon Button - Top */}
        <div className="flex items-center justify-center mb-6">
          <button onClick={onToggle} className="w-11 h-11 bg-white rounded-2xl shadow-lg flex items-center justify-center
                       hover:scale-105 transition-all duration-300" aria-label="Toggle sidebar" aria-expanded={isOpen} aria-controls="sidebar">
            <Home className="w-5 h-5 text-[#E91E63]" />
          </button>
        </div>

        {/* Header Section */}
        {isOpen && (
          <div className="mb-4 px-2">
            <div className="flex items-center gap-3">
              <div>
                <div className="font-semibold text-pink-700 text-sm">เมนูหลัก</div>
              </div>
            </div>
            {/* Divider */}
            <div className="my-4 h-px bg-white/60"></div>
          </div>
        )}
        
        {/* Menu Items */}
        <nav className="flex flex-col items-center space-y-4">
          {/* Base Menu Items */}
          {baseMenuItems.map(item => {
            const isActive = activePage === item.id;
            const menuButton = (
              <button 
                onClick={() => onPageChange(item.id)} 
                className={`
                  w-11 h-11 rounded-2xl transition-all duration-300 grid place-items-center
                  ${isActive 
                    ? 'bg-gradient-to-b from-pink-500 to-rose-500 text-white shadow-md scale-[1.02]' 
                    : 'bg-white/70 hover:bg-white shadow-sm backdrop-blur hover:scale-105'}
                `} 
                aria-label={item.title}
              >
                <item.icon className={`
                  w-5 h-5 transition-colors duration-300
                  ${isActive ? 'text-white' : 'text-[#D81B60]'}
                `} />
              </button>
            );

            if (!isOpen) {
              return (
                <Tooltip key={item.id}>
                  <TooltipTrigger asChild>
                    {menuButton}
                  </TooltipTrigger>
                  <TooltipContent side="right" className="bg-pink-800 text-white border-pink-600">
                    {item.title}
                  </TooltipContent>
                </Tooltip>
              );
            }

            return (
              <div key={item.id} className="flex items-center gap-3 w-full">
                {menuButton}
                <span className={`text-sm font-medium text-pink-700 transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 w-0'}`}>
                  {item.title}
                </span>
              </div>
            );
          })}

          {/* Admin Section Header */}
          {authState.user?.role === 'admin' && isOpen && adminMenuItems.length > 0 && (
            <>
              <div className="my-4 h-px bg-white/60 w-full"></div>
              <div className="px-2 w-full">
                <div className="font-semibold text-pink-700 text-sm">การจัดการระบบ</div>
              </div>
            </>
          )}

          {/* Admin Menu Items */}
          {adminMenuItems.map(item => {
            const isActive = activePage === item.id;
            const menuButton = (
              <button 
                onClick={() => onPageChange(item.id)} 
                className={`
                  w-11 h-11 rounded-2xl transition-all duration-300 grid place-items-center
                  ${isActive 
                    ? 'bg-gradient-to-b from-pink-500 to-rose-500 text-white shadow-md scale-[1.02]' 
                    : 'bg-white/70 hover:bg-white shadow-sm backdrop-blur hover:scale-105'}
                `} 
                aria-label={item.title}
              >
                <item.icon className={`
                  w-5 h-5 transition-colors duration-300
                  ${isActive ? 'text-white' : 'text-[#D81B60]'}
                `} />
              </button>
            );

            if (!isOpen) {
              return (
                <Tooltip key={item.id}>
                  <TooltipTrigger asChild>
                    {menuButton}
                  </TooltipTrigger>
                  <TooltipContent side="right" className="bg-pink-800 text-white border-pink-600">
                    {item.title}
                  </TooltipContent>
                </Tooltip>
              );
            }

            return (
              <div key={item.id} className="flex items-center gap-3 w-full">
                {menuButton}
                <span className={`text-sm font-medium text-pink-700 transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 w-0'}`}>
                  {item.title}
                </span>
              </div>
            );
          })}

          {/* AI AGENT - Special bottom button */}
          {(() => {
            const isActive = activePage === aiAgentItem.id;
            const aiButton = (
              <button 
                onClick={() => onPageChange(aiAgentItem.id)} 
                className={`
                  w-11 h-11 rounded-2xl transition-all duration-300 grid place-items-center mt-6
                  ${isActive 
                    ? 'bg-gradient-to-b from-pink-500 to-rose-500 text-white shadow-[0_10px_30px_rgba(236,72,153,0.35)] scale-[1.02]' 
                    : 'bg-gradient-to-b from-pink-500 to-rose-500 text-white shadow-[0_10px_30px_rgba(236,72,153,0.35)] hover:scale-105'}
                `} 
                aria-label={aiAgentItem.title}
              >
                <aiAgentItem.icon className="w-5 h-5 text-white" />
              </button>
            );

            if (!isOpen) {
              return (
                <Tooltip key={aiAgentItem.id}>
                  <TooltipTrigger asChild>
                    {aiButton}
                  </TooltipTrigger>
                  <TooltipContent side="right" className="bg-pink-800 text-white border-pink-600">
                    {aiAgentItem.title}
                    {aiAgentItem.badge && (
                      <Badge className="ml-2 text-xs bg-pink-600 text-white">
                        {aiAgentItem.badge}
                      </Badge>
                    )}
                  </TooltipContent>
                </Tooltip>
              );
            }

            return (
              <div key={aiAgentItem.id} className="flex items-center gap-3 w-full mt-6">
                {aiButton}
                <div className={`flex items-center gap-2 transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 w-0'}`}>
                  <span className="text-sm font-medium text-pink-700 leading-none">
                    {aiAgentItem.title}
                  </span>
                  {aiAgentItem.badge && (
                    <Badge className="text-xs bg-pink-500 text-white">
                      {aiAgentItem.badge}
                    </Badge>
                  )}
                </div>
              </div>
            );
          })()}
        </nav>
      </aside>
    </TooltipProvider>
  );
};
