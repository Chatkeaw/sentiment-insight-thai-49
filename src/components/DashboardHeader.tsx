import React from "react";

interface DashboardHeaderProps {
  lastUpdate?: string;
  onRefresh?: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ lastUpdate, onRefresh }) => {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
      {lastUpdate && (
        <div className="text-sm text-muted-foreground">
          Last updated: {lastUpdate}
        </div>
      )}
    </div>
  );
};

export default DashboardHeader;