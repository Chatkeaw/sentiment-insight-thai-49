import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { OverviewPage } from "./OverviewPage";
import { RegionalPage } from "./RegionalPage";
import { AnalyticsPage } from "./AnalyticsPage";
import { AnalyticsProvider } from "@/contexts/AnalyticsContext";
import { Header } from "@/components/Header";
import { TimeFilter as TimeFilterType } from "@/types/dashboard";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FeedbackPage } from "./FeedbackPage";
import { ComplaintsPage } from "./ComplaintsPage";
import { AIAgentPage } from "./AIAgentPage";

const Index = () => {
  const [activePage, setActivePage] = useState("overview");
  const [timeFilter, setTimeFilter] = useState<TimeFilterType['value']>("1month");

  const handlePageChange = (page: string) => {
    setActivePage(page);
  };

  const handleBackToOverview = () => {
    setActivePage("overview");
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gradient-to-br from-background via-pink-50/30 to-background">
          <AppSidebar activePage={activePage} onPageChange={handlePageChange} />
          
          <main className="flex-1 flex flex-col">
            <Header />
            <div className="flex-1 p-6 overflow-auto">
              {renderContent()}
            </div>
          </main>

          {/* Scroll to Top Button */}
          <Button
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 rounded-full w-12 h-12 p-0 shadow-lg bg-primary hover:bg-primary/90 z-50"
            aria-label="กลับสู่ด้านบน"
          >
            <ArrowUp className="w-5 h-5" />
          </Button>
        </div>
      </SidebarProvider>
    </AnalyticsProvider>
  );
};

export default Index;
