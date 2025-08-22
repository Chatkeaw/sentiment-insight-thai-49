import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

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
    { id: "overview", label: "สรุปภาพรวมประจำเดือน", icon: "📊" },
    { id: "analytics", label: "ติดตามผลดำเนินงาน", icon: "📈" },
    { id: "regional", label: "ศักยภาพรายพื้นที่", icon: "🌍" },
    { id: "feedback", label: "ความคิดเห็น", icon: "💬" },
    { id: "complaints", label: "ข้อร้องเรียน", icon: "⚠️" },
    { id: "category-reference", label: "เอกสารอ้างอิง", icon: "📚" },
  ];

  const adminMenuItems = [
    { id: "user-management", label: "ผู้ใช้งาน", icon: "👥", permission: "manage_users" },
    { id: "system-management", label: "ระบบ", icon: "⚙️", permission: "system_management" },
  ];

  const aiAgentItem = { id: "ai-agent", label: "AI AGENT", icon: "🤖", isNew: true };

  const allMenuItems = [
    ...baseMenuItems,
    ...adminMenuItems.filter(item => hasPermission(item.permission)),
    aiAgentItem
  ];

  return (
    <nav className="border-b bg-white shadow-sm">
      <div className="container mx-auto px-6">
        <div className="flex items-center gap-1 overflow-x-auto py-4">
          <div className="flex items-center gap-1 min-w-max">
            {allMenuItems.map((item) => (
              <Button
                key={item.id}
                variant={activePage === item.id ? "default" : "ghost"}
                onClick={() => onPageChange(item.id)}
                className={cn(
                  "text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200 whitespace-nowrap",
                  "hover:bg-muted hover:text-foreground",
                  activePage === item.id 
                    ? "bg-primary text-primary-foreground shadow-sm" 
                    : "text-muted-foreground"
                )}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
                {item.id === "ai-agent" && (
                  <Badge 
                    variant="destructive" 
                    className="ml-2 text-xs px-1.5 py-0.5 h-5"
                  >
                    NEW
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default HorizontalNavigation;