
import React, { useState, useEffect } from 'react';
import { AnalyticsProvider } from '@/contexts/AnalyticsContext';
import { AppSidebar } from '@/components/AppSidebar';
import { Header } from '@/components/Header';
import { OverviewPage } from './OverviewPage';
import { RegionalPage } from './RegionalPage';
import { AnalyticsPage } from './AnalyticsPage';
import { FeedbackPage } from './FeedbackPage';
import { ComplaintsPage } from './ComplaintsPage';
import { AIAgentPage } from './AIAgentPage';
import { useAuth } from '@/contexts/AuthContext';
import { UserManagementPage } from './UserManagementPage';
import { SystemManagementPage } from './SystemManagementPage';
import { TimeFilter as TimeFilterType } from '@/types/dashboard';

const Index = () => {
  const [activePage, setActivePage] = useState('overview');
  const [timeFilter, setTimeFilter] = useState<TimeFilterType['value']>('1month');
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('sidebar_open');
    return saved ? JSON.parse(saved) : true;
  });
  
  const { state } = useAuth();

  useEffect(() => {
    localStorage.setItem('sidebar_open', JSON.stringify(isSidebarOpen));
  }, [isSidebarOpen]);

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleBackToOverview = () => {
    setActivePage('overview');
  };

  const renderContent = () => {
    // Check if user has permission for admin pages
    const isAdmin = state.user?.role === 'admin';
    
    if ((activePage === 'user-management' || activePage === 'system-management') && !isAdmin) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-destructive">ไม่มีสิทธิ์เข้าถึง</h2>
            <p className="text-muted-foreground">
              คุณไม่มีสิทธิ์เข้าถึงหน้านี้ กรุณาติดต่อผู้ดูแลระบบ
            </p>
          </div>
        </div>
      );
    }

    switch (activePage) {
      case 'overview':
        return <OverviewPage timeFilter={timeFilter} onTimeFilterChange={setTimeFilter} />;
      case 'regional':
        return <RegionalPage />;
      case 'analytics':
        return <AnalyticsPage onBack={handleBackToOverview} timeFilter={timeFilter} onTimeFilterChange={setTimeFilter} />;
      case 'feedback':
        return <FeedbackPage timeFilter={timeFilter} onTimeFilterChange={setTimeFilter} />;
      case 'complaints':
        return <ComplaintsPage timeFilter={timeFilter} onTimeFilterChange={setTimeFilter} />;
      case 'ai-agent':
        return <AIAgentPage />;
      case 'user-management':
        return <UserManagementPage />;
      case 'system-management':
        return <SystemManagementPage />;
      default:
        return <OverviewPage timeFilter={timeFilter} onTimeFilterChange={setTimeFilter} />;
    }
  };

  return (
    <AnalyticsProvider>
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-100 flex w-full">
        <AppSidebar 
          activePage={activePage}
          onPageChange={setActivePage}
          isOpen={isSidebarOpen}
          onToggle={handleToggleSidebar}
        />
        
        <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-[256px]' : 'ml-[72px]'}`}>
          <Header />
          <main className="p-6">
            {renderContent()}
          </main>
        </div>
      </div>
    </AnalyticsProvider>
  );
};

export default Index;
