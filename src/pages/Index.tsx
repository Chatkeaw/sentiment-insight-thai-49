import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { OverviewPage } from "./OverviewPage";
import { RegionalPage } from "./RegionalPage";
import { AnalyticsPage } from "./AnalyticsPage";
import { AnalyticsProvider } from "@/contexts/AnalyticsContext";
import DashboardHeader from "@/components/DashboardHeader";
import GlobalFilters from "@/components/GlobalFilters";
import { TimeFilter as TimeFilterType } from "@/types/dashboard";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FeedbackPage } from "./FeedbackPage";
import { ComplaintsPage } from "./ComplaintsPage";
import { AIAgentPage } from "./AIAgentPage";

const Index = () => {
  const [activePage, setActivePage] = useState("overview");
  const [timeFilter, setTimeFilter] = useState<TimeFilterType['value']>("1month");
  const [lastUpdate, setLastUpdate] = useState<string>("");
  const [globalFilters, setGlobalFilters] = useState<any>({});

  const handlePageChange = (page: string) => {
    setActivePage(page);
  };

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
        return (
          <OverviewPage 
            timeFilter={timeFilter} 
            onTimeFilterChange={setTimeFilter}
          />
        );
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
      default:
        return <OverviewPage timeFilter={timeFilter} onTimeFilterChange={setTimeFilter} />;
    }
  };

  return (
    <AnalyticsProvider>
      <div className="min-h-screen w-full bg-gradient-to-br from-background via-pink-50/30 to-background">
        {/* Dashboard Header - Top Sticky (96px ตามข้อกำหนด) */}
        <DashboardHeader 
          lastUpdate={lastUpdate}
          onRefresh={handleRefreshData}
        />
        
        {/* Main Content */}
        <main className="w-full">
          {/* Global Filters */}
          <div className="container mx-auto px-6 pt-6">
            <GlobalFilters onFiltersChange={handleFiltersChange} />
          </div>
          
          {/* Dashboard Content */}
          <div className="container mx-auto px-6 pb-6">
            {renderContent()}
          </div>
        </main>

        {/* Scroll to Top Button - ปุ่มมุมขวาล่าง Fix Location */}
        <Button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 rounded-full w-12 h-12 p-0 shadow-lg bg-primary hover:bg-primary/90 z-50 transition-all duration-300 hover:scale-110"
          aria-label="กลับสู่ด้านบน"
        >
          <ArrowUp className="w-5 h-5" />
        </Button>
      </div>
    </AnalyticsProvider>
  );
};

export default Index;
