import React, { useState, useEffect } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { RegionalPage } from "./RegionalPage";
import { AnalyticsPage } from "./AnalyticsPage";
import { AnalyticsProvider } from "@/contexts/AnalyticsContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import DashboardHeader from "@/components/DashboardHeader";
import { TimeFilter as TimeFilterType } from "@/types/dashboard";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomerFeedbackSystem } from "@/components/feedback/CustomerFeedbackSystem";
import ComplaintsPage from "./ComplaintsPage";
import { AIAgentPage } from "./AIAgentPage";
import { UserManagementPage } from "./UserManagementPage";
import { SystemManagementPage } from "./SystemManagementPage";
import CategoryReferencePage from "./CategoryReferencePage";
import DashboardPage from "@/components/DashboardPage";

const Index = () => {
  const [activePage, setActivePage] = useState(() => {
    return localStorage.getItem('selectedMenuItem') || "overview";
  });
  const [timeFilter, setTimeFilter] = useState<TimeFilterType['value']>("1month");
  const [lastUpdate, setLastUpdate] = useState<string>("");
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    return localStorage.getItem('sidebarOpen') !== 'false';
  });

  const handlePageChange = (page: string) => {
    setActivePage(page);
    localStorage.setItem('selectedMenuItem', page);
  };

  const handleSidebarToggle = () => {
    const newState = !sidebarOpen;
    setSidebarOpen(newState);
    localStorage.setItem('sidebarOpen', newState.toString());
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleRefreshData = () => {
    console.log('Refreshing data...');
    const now = new Date();
    const day = now.getDate().toString().padStart(2, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const year = now.getFullYear();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    setLastUpdate(`${day}-${month}-${year} ${hours}:${minutes}`);
  };


  useEffect(() => {
    localStorage.setItem('selectedMenuItem', activePage);
  }, [activePage]);

  // Listen for custom page change events
  useEffect(() => {
    const handleCustomPageChange = (event: CustomEvent) => {
      handlePageChange(event.detail);
    };

    window.addEventListener('changePage', handleCustomPageChange as EventListener);
    return () => {
      window.removeEventListener('changePage', handleCustomPageChange as EventListener);
    };
  }, []);

  const handleBackToOverview = () => {
    setActivePage("overview");
  };

  const renderContent = () => {
    switch (activePage) {
      case "overview":
        return <DashboardPage onPageChange={handlePageChange} />;
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
        return <CustomerFeedbackSystem />;
      case "complaints":
        return <ComplaintsPage />;
      case "category-reference":
        return <CategoryReferencePage />;
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
        return <DashboardPage onPageChange={handlePageChange} />;
    }
  };

  return (
    <AuthProvider>
      <ProtectedRoute>
        <AnalyticsProvider>
          <div className="min-h-screen w-full bg-white flex">
            {/* Sidebar */}
            <AppSidebar
              activePage={activePage}
              onPageChange={handlePageChange}
              isOpen={sidebarOpen}
              onToggle={handleSidebarToggle}
            />

            {/* Main Content Area */}
            <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-[72px]'}`}>
              {/* Dashboard Header */}
              <header className="border-b bg-white/95 backdrop-blur-sm sticky top-0 z-30">
                <div className="container mx-auto px-6 py-3">
                  <DashboardHeader
                    lastUpdate={lastUpdate}
                    onRefresh={handleRefreshData}
                  />
                </div>
              </header>

              {/* Main Content */}
              <main className="flex-1 w-full">
                <div className="container mx-auto px-6 py-6 max-w-7xl">
                  {renderContent()}
                </div>
              </main>

              {/* Scroll to Top Button - Hide on AI Agent page */}
              {activePage !== "ai-agent" && (
                <Button
                  onClick={scrollToTop}
                  className="fixed bottom-6 right-6 rounded-full w-12 h-12 p-0 shadow-lg bg-primary hover:bg-primary/90 z-50 transition-all duration-300 hover:scale-110"
                  aria-label="กลับสู่ด้านบน"
                >
                  <ArrowUp className="w-5 h-5" />
                </Button>
              )}
            </div>
          </div>
        </AnalyticsProvider>
      </ProtectedRoute>
    </AuthProvider>
  );
};

export default Index;
