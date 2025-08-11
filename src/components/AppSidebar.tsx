
import React from 'react';
import { 
  BarChart3, 
  MapPin, 
  TrendingUp, 
  MessageSquare, 
  AlertTriangle, 
  Bot,
  Home,
  Lock,
  Menu
} from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { useAnalytics } from '@/contexts/AnalyticsContext';

interface AppSidebarProps {
  activePage: string;
  onPageChange: (page: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({ activePage, onPageChange, isOpen, onToggle }) => {
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
    { id: 'ai-agent', title: 'AI AGENT', icon: Bot, badge: 'ใหม่' },
  ];

  return (
    <TooltipProvider>
      <aside
        id="sidebar"
        className={`
          fixed left-0 top-0 h-full bg-gradient-to-b from-pink-50/90 to-white/90 backdrop-blur-md
          border-r border-pink-200/50 shadow-xl z-40 transition-all duration-300 ease-in-out
          ${isOpen ? 'w-60 translate-x-0' : 'w-16 -translate-x-0 lg:translate-x-0'}
          ${!isOpen && 'lg:w-16'}
        `}
      >
        {/* Hamburger Button - Fixed at top */}
        <div className="absolute top-4 left-4 z-50">
          <button
            onClick={onToggle}
            className="w-10 h-10 bg-white rounded-xl shadow-lg border border-pink-200/50 
                       flex items-center justify-center hover:bg-pink-50 hover:border-pink-300 
                       transition-all duration-200 hover:scale-105"
            aria-label="Toggle sidebar"
            aria-expanded={isOpen}
            aria-controls="sidebar"
          >
            <Menu className="w-5 h-5 text-pink-600" />
          </button>
        </div>

        {/* Header - with top margin to avoid overlap */}
        <div className="mt-16 p-4 border-b border-pink-200/50">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Home className="w-4 h-4 text-white" />
            </div>
            <div className={`transition-all duration-300 ${isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}>
              <div className="font-semibold text-pink-800">เมนูหลัก</div>
              <div className="text-xs text-pink-600/70">Dashboard System</div>
            </div>
          </div>
        </div>
        
        {/* Menu Items */}
        <nav className="p-3 space-y-2">
          {menuItems.map((item) => {
            const isActive = activePage === item.id;
            const menuButton = (
              <button
                onClick={() => !item.disabled && onPageChange(item.id)}
                disabled={item.disabled}
                className={`
                  w-full flex items-center gap-3 p-3 rounded-2xl transition-all duration-300 group relative
                  ${isActive 
                    ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-lg shadow-pink-500/25 scale-105' 
                    : item.disabled 
                      ? 'text-gray-400 cursor-not-allowed opacity-50' 
                      : 'text-pink-800 hover:bg-pink-100/80 hover:scale-105 hover:shadow-md'
                  }
                  ${!isOpen && 'justify-center'}
                `}
                aria-label={item.title}
              >
                {/* Icon Container */}
                <div className={`
                  w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 flex-shrink-0 relative
                  ${isActive 
                    ? 'bg-white/20' 
                    : item.disabled 
                      ? 'bg-gray-100' 
                      : 'bg-pink-200/50 group-hover:bg-pink-300/50'
                  }
                `}>
                  <item.icon className={`
                    w-4 h-4 transition-colors duration-200
                    ${isActive 
                      ? 'text-white' 
                      : item.disabled 
                        ? 'text-gray-400' 
                        : 'text-pink-600 group-hover:text-pink-700'
                    }
                  `} />
                  {item.disabled && (
                    <Lock className="w-3 h-3 text-gray-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                  )}
                </div>
                
                {/* Text and Badge */}
                <div className={`flex-1 flex items-center justify-between transition-all duration-300 min-w-0 ${isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}>
                  <span className="text-sm font-medium leading-tight truncate">
                    {item.title}
                  </span>
                  {item.badge && (
                    <Badge className="ml-2 text-xs bg-pink-600/20 text-pink-800 border-pink-300 hover:bg-pink-600/30 flex-shrink-0">
                      {item.badge}
                    </Badge>
                  )}
                </div>
              </button>
            );

            // Wrap with tooltip when collapsed
            if (!isOpen) {
              return (
                <Tooltip key={item.id}>
                  <TooltipTrigger asChild>
                    {menuButton}
                  </TooltipTrigger>
                  <TooltipContent side="right" className="bg-pink-800 text-white border-pink-600">
                    {item.title}
                    {item.badge && (
                      <Badge className="ml-2 text-xs bg-pink-600 text-white">
                        {item.badge}
                      </Badge>
                    )}
                  </TooltipContent>
                </Tooltip>
              );
            }

            return (
              <div key={item.id}>
                {menuButton}
              </div>
            );
          })}
        </nav>
      </aside>
    </TooltipProvider>
  );
};
