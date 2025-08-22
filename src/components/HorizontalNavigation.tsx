import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { 
  BarChart3, 
  TrendingUp, 
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
    { id: "analytics", label: "ติดตามผลดำเนินงาน", icon: TrendingUp },
    { id: "regional", label: "ศักยภาพรายพื้นที่", icon: Globe },
    { id: "feedback", label: "ความคิดเห็น", icon: MessageSquare },
    { id: "complaints", label: "ข้อร้องเรียน", icon: AlertTriangle },
    { id: "category-reference", label: "เอกสารอ้างอิง", icon: FileText },
  ];

  const adminMenuItems = [
    { id: "system-management", label: "จัดการระบบ", icon: Settings, permission: "system_management" },
    { id: "user-management", label: "ผู้ใช้งาน", icon: Users, permission: "manage_users" },
    { id: "system", label: "ระบบ", icon: Settings, permission: "system_management" },
    { id: "ai-agent", label: "AI AGENT", icon: Bot, isNew: true, permission: "system_management" }
  ];

  const availableAdminItems = adminMenuItems.filter(item => 
    !item.permission || hasPermission(item.permission)
  );

  return (
    <nav className="bg-card border-b border-border shadow-sm font-sarabun">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between px-6 py-3">
          
          {/* เมนูหลัก - ฝั่งซ้าย */}
          <div className="flex items-center space-x-2">
            {baseMenuItems.map((item, index) => {
              const IconComponent = item.icon;
              const isActive = activePage === item.id;
              
              return (
                <React.Fragment key={item.id}>
                  <button
                    onClick={() => onPageChange(item.id)}
                    className={cn(
                      "flex items-center space-x-2 px-4 py-2.5 rounded-md transition-all duration-200 whitespace-nowrap text-sm font-medium",
                      isActive 
                        ? "bg-primary text-primary-foreground shadow-md hover:bg-primary/90" 
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                    )}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                  
                  {/* เส้นแบ่งเล็กๆ หลังเมนู active */}
                  {isActive && index < baseMenuItems.length - 1 && (
                    <div className="h-6 w-px bg-border mx-3"></div>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* เมนูจัดการระบบ - ฝั่งขวา */}
          {availableAdminItems.length > 0 && (
            <div className="flex items-center space-x-4">
              {availableAdminItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = activePage === item.id;
                
                // AI AGENT ให้เป็น badge พิเศษ
                if (item.id === 'ai-agent') {
                  return (
                    <button
                      key={item.id}
                      onClick={() => onPageChange(item.id)}
                      className={cn(
                        "relative flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-primary text-white px-4 py-2.5 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200",
                        isActive && "ring-2 ring-primary/30"
                      )}
                    >
                      <IconComponent className="w-4 h-4" />
                      <span className="text-sm font-medium">{item.label}</span>
                      
                      {/* NEW Badge */}
                      {item.isNew && (
                        <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs px-1.5 py-0.5 rounded-full font-bold animate-pulse">
                          NEW
                        </span>
                      )}
                      
                      {/* Glow effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-primary/80 rounded-lg blur opacity-30 -z-10"></div>
                    </button>
                  );
                }
                
                return (
                  <button
                    key={item.id}
                    onClick={() => onPageChange(item.id)}
                    className={cn(
                      "flex items-center space-x-2 px-3 py-2 rounded-md transition-all duration-200 whitespace-nowrap text-sm",
                      isActive 
                        ? "bg-primary text-primary-foreground font-medium shadow-sm" 
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                    )}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Mobile Responsive - Hidden on desktop, shown on mobile */}
        <div className="md:hidden border-t border-border">
          <div className="flex items-center gap-2 px-4 py-3 overflow-x-auto">
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
                      "text-xs px-3 py-2 whitespace-nowrap h-8",
                      isActive ? "font-medium" : ""
                    )}
                  >
                    <IconComponent className="w-3 h-3 mr-1.5" />
                    {item.label}
                  </Button>
                );
              })}
              
              {/* Mobile divider */}
              {availableAdminItems.length > 0 && (
                <div className="h-6 w-px bg-border mx-2"></div>
              )}
              
              {availableAdminItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = activePage === item.id;
                
                if (item.id === 'ai-agent') {
                  return (
                    <Button
                      key={item.id}
                      variant={isActive ? "default" : "outline"}
                      size="sm"
                      onClick={() => onPageChange(item.id)}
                      className={cn(
                        "text-xs px-3 py-2 whitespace-nowrap h-8 relative bg-gradient-to-r from-purple-500 to-primary text-white border-0",
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
                }
                
                return (
                  <Button
                    key={item.id}
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    onClick={() => onPageChange(item.id)}
                    className={cn(
                      "text-xs px-3 py-2 whitespace-nowrap h-8",
                      isActive ? "font-medium" : ""
                    )}
                  >
                    <IconComponent className="w-3 h-3 mr-1.5" />
                    {item.label}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default HorizontalNavigation;