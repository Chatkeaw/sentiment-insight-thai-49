import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { 
  BarChart3, 
  Search, 
  Globe, 
  MessageSquare, 
  AlertTriangle, 
  FileText, 
  Users, 
  Settings,
  Bot
} from 'lucide-react';

interface HorizontalNavigationProps {
  activePage: string;
  onPageChange: (page: string) => void;
}

const HorizontalNavigation: React.FC<HorizontalNavigationProps> = ({
  activePage,
  onPageChange,
}) => {
  const { state, hasPermission } = useAuth();

  const baseMenuItems = [
    { id: "overview", label: "สรุปภาพรวมประจำเดือน", icon: BarChart3 },
    { id: "analytics", label: "ติดตามผลดำเนินงาน", icon: Search },
    { id: "regional", label: "ศักยภาพรายพื้นที่", icon: Globe },
    { id: "feedback", label: "ความคิดเห็น", icon: MessageSquare },
    { id: "complaints", label: "ข้อร้องเรียน", icon: AlertTriangle },
    { id: "category-reference", label: "เอกสารอ้างอิง", icon: FileText },
  ];

  const adminMenuItems = [
    { id: "user-management", label: "ผู้ใช้งาน", icon: Users, permission: "manage_users" },
    { id: "system-management", label: "ระบบ", icon: Settings, permission: "system_management" },
    { id: "ai-agent", label: "AI AGENT", icon: Bot, isNew: true, permission: "system_management" }
  ];

  const availableAdminItems = adminMenuItems.filter(item => 
    !item.permission || hasPermission(item.permission)
  );

  return (
    <nav className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-pink-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Main Menu Items - Left Side */}
          <div className="flex items-center space-x-8 overflow-x-auto">
            {/* Main Menu Label */}

            {baseMenuItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activePage === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => onPageChange(item.id)}
                  className={cn(
                    "flex items-center space-x-2 px-4 py-2.5 rounded-lg transition-all duration-200 whitespace-nowrap text-sm border border-transparent",
                    isActive 
                      ? "bg-pink-600 text-white font-medium shadow-md hover:bg-pink-700" 
                      : "text-gray-700 hover:bg-pink-50 hover:text-pink-600 hover:border-pink-200"
                  )}
                >
                  <IconComponent className={cn(
                    isActive ? "w-5 h-5" : "w-4 h-4"
                  )} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Vertical Divider */}
          {availableAdminItems.length > 0 && (
            <>
              <div className="h-8 w-px bg-gradient-to-b from-transparent via-gray-400 to-transparent"></div>
              
              {/* Admin Section - Right Side */}
              <div className="flex items-center space-x-6">
                {/* Admin Label */}

                
                {/* Admin Menu Items */}
                <div className="flex items-center space-x-4">
                  {availableAdminItems.map((item) => {
                    const IconComponent = item.icon;
                    const isActive = activePage === item.id;
                    
                    return (
                      <button
                        key={item.id}
                        onClick={() => onPageChange(item.id)}
                        className={cn(
                          "flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 whitespace-nowrap text-sm relative",
                          isActive 
                            ? "bg-pink-600 text-white font-medium shadow-md hover:bg-pink-700" 
                            : "text-gray-700 hover:bg-gray-100 hover:text-pink-600"
                        )}
                      >
                        <IconComponent className="w-4 h-4" />
                        <span>{item.label}</span>
                        {item.isNew && (
                          <Badge 
                            variant="destructive" 
                            className="ml-2 text-xs px-1.5 py-0.5 h-5 absolute -top-1 -right-1"
                          >
                            NEW
                          </Badge>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Mobile Responsive - Hidden on desktop, shown on mobile */}
        <div className="md:hidden flex items-center gap-2 pb-4 overflow-x-auto">
          <div className="flex items-center gap-2 min-w-max">
            {baseMenuItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activePage === item.id;
              
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onPageChange(item.id)}
                  className={cn(
                    "text-xs px-3 py-2 whitespace-nowrap",
                    isActive ? "font-medium" : ""
                  )}
                >
                  <IconComponent className="w-3 h-3 mr-1.5" />
                  {item.label}
                </Button>
              );
            })}
            {availableAdminItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activePage === item.id;
              
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onPageChange(item.id)}
                  className={cn(
                    "text-xs px-3 py-2 whitespace-nowrap relative",
                    isActive ? "font-medium" : ""
                  )}
                >
                  <IconComponent className="w-3 h-3 mr-1.5" />
                  {item.label}
                  {item.isNew && (
                    <Badge 
                      variant="destructive" 
                      className="ml-1 text-xs px-1 py-0 h-4 absolute -top-1 -right-1"
                    >
                      NEW
                    </Badge>
                  )}
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default HorizontalNavigation;