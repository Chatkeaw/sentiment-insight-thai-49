
import React, { useState, useEffect } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { OverviewPage } from "./OverviewPage";
import { RegionalPage } from "./RegionalPage";
import { AnalyticsPage } from "./AnalyticsPage";
import { AnalyticsProvider } from "@/contexts/AnalyticsContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import DashboardHeader from "@/components/DashboardHeader";
import GlobalFilters from "@/components/GlobalFilters";
import { TimeFilter as TimeFilterType } from "@/types/dashboard";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FeedbackPage } from "./FeedbackPage";
import { ComplaintsPage } from "./ComplaintsPage";
import { AIAgentPage } from "./AIAgentPage";
import { UserManagementPage } from "./UserManagementPage";
import { SystemManagementPage } from "./SystemManagementPage";
import DashboardPage from "@/components/DashboardPage";

const Index = () => {
  const [activePage, setActivePage] = useState(() => {
    return localStorage.getItem('selectedMenuItem') || "overview";
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('sidebar_open');
    return saved ? JSON.parse(saved) : true;
  });
  const [timeFilter, setTimeFilter] = useState<TimeFilterType['value']>("1month");
  const [lastUpdate, setLastUpdate] = useState<string>("");
  const [globalFilters, setGlobalFilters] = useState<any>({});

  const handlePageChange = (page: string) => {
    setActivePage(page);
    localStorage.setItem('selectedMenuItem', page);
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    localStorage.setItem('sidebar_open', JSON.stringify(isSidebarOpen));
  }, [isSidebarOpen]);

  useEffect(() => {
    localStorage.setItem('selectedMenuItem', activePage);
  }, [activePage]);

  const handleBackToOverview = () => {
    setActivePage("overview");
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRefreshData = () => {
    const now = new Date();
    const day = now.getDate().toString().padStart(2, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const year = now.getFullYear();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    setLastUpdate(`${day}-${month}-${year} ${hours}:${minutes}`);
  };

  const handleFiltersChange = (filters: any) => {
    setGlobalFilters(filters);
    setTimeFilter(filters.timeRange || "1month");
  };

  const renderContent = () => {
    switch (activePage) {
      case "overview":
        return <DashboardPage />;
      case "regional":
        return <RegionalPage />;
      case "analytics":
        return (
          <AnalyticsPage 
            onBack={handleBackToOverview}
            timeFilter={timeFilter}
            onTimeFilterChange={setTimeFilter}
          />
        );
      case "feedback":
        return (
          <FeedbackPage 
            timeFilter={timeFilter}
            onTimeFilterChange={setTimeFilter}
          />
        );
      case "complaints":
        return (
          <ComplaintsPage 
            timeFilter={timeFilter}
            onTimeFilterChange={setTimeFilter}
          />
        );
      case "ai-agent":
        return <AIAgentPage />;
      case "user-management":
        return (
          <ProtectedRoute requiredPermission="manage_users">
            <UserManagementPage />
          </ProtectedRoute>
        );
      case "system-management":
        return (
          <ProtectedRoute requiredPermission="system_management">
            <SystemManagementPage />
          </ProtectedRoute>
        );
      default:
        return <DashboardPage />;
    }
  };

  return (
    <AuthProvider>
      <ProtectedRoute>
        <AnalyticsProvider>
          <div className="min-h-screen w-full bg-gradient-to-br from-background via-pink-50/30 to-background flex relative">
            {/* Mobile Overlay */}
            {isSidebarOpen && (
              <div 
                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
                onClick={() => setIsSidebarOpen(false)}
              />
            )}
            
            {/* Sidebar */}
            <AppSidebar 
              activePage={activePage} 
              onPageChange={handlePageChange}
              isOpen={isSidebarOpen}
              onToggle={toggleSidebar}
            />
            
            {/* Main Content */}
            <main className={`flex-1 transition-all duration-300 ease-out ${isSidebarOpen ? 'lg:ml-[256px]' : 'lg:ml-[72px]'} mr-4`}>
              
              {/* Dashboard Header */}
              <header className="flex items-center gap-2 px-4 py-4 pl-16 border-b bg-white/80 backdrop-blur-sm sticky top-0 z-40">
                <div className="flex-1">
                  <DashboardHeader 
                    lastUpdate={lastUpdate}
                    onRefresh={handleRefreshData}
                  />
                </div>
              </header>
              
              {/* Global Filters */}
              <div className="container mx-auto px-6 pt-6">
                <GlobalFilters onFiltersChange={handleFiltersChange} />
              </div>
              
              {/* Dashboard Content */}
              <div className="container mx-auto px-6 pb-6">
                {renderContent()}
              </div>
            </main>

            {/* Scroll to Top Button */}
            <Button
              onClick={scrollToTop}
              className="fixed bottom-6 right-6 rounded-full w-12 h-12 p-0 shadow-lg bg-primary hover:bg-primary/90 z-50 transition-all duration-300 hover:scale-110"
              aria-label="กลับสู่ด้านบน"
            >
              <ArrowUp className="w-5 h-5" />
            </Button>
          </div>
        </AnalyticsProvider>
      </ProtectedRoute>
    </AuthProvider>
  );
};

export default Index;
