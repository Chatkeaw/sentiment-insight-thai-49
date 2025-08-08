
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AnalyticsState {
  isUnlocked: boolean;
  lastClickedChart: string | null;
  selectedRegion: string | null;
  selectedDistrict: string | null;
  selectedBranch: string | null;
}

interface AnalyticsContextType {
  state: AnalyticsState;
  unlockAnalytics: (chartType: string) => void;
  setSelectedRegion: (region: string | null) => void;
  setSelectedDistrict: (district: string | null) => void;
  setSelectedBranch: (branch: string | null) => void;
  resetSelection: () => void;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
};

interface AnalyticsProviderProps {
  children: ReactNode;
}

export const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({ children }) => {
  const [state, setState] = useState<AnalyticsState>({
    isUnlocked: false,
    lastClickedChart: null,
    selectedRegion: null,
    selectedDistrict: null,
    selectedBranch: null,
  });

  const unlockAnalytics = (chartType: string) => {
    setState(prev => ({
      ...prev,
      isUnlocked: true,
      lastClickedChart: chartType,
    }));
  };

  const setSelectedRegion = (region: string | null) => {
    setState(prev => ({
      ...prev,
      selectedRegion: region,
      selectedDistrict: null,
      selectedBranch: null,
    }));
  };

  const setSelectedDistrict = (district: string | null) => {
    setState(prev => ({
      ...prev,
      selectedDistrict: district,
      selectedBranch: null,
    }));
  };

  const setSelectedBranch = (branch: string | null) => {
    setState(prev => ({
      ...prev,
      selectedBranch: branch,
    }));
  };

  const resetSelection = () => {
    setState(prev => ({
      ...prev,
      selectedRegion: null,
      selectedDistrict: null,
      selectedBranch: null,
    }));
  };

  return (
    <AnalyticsContext.Provider
      value={{
        state,
        unlockAnalytics,
        setSelectedRegion,
        setSelectedDistrict,
        setSelectedBranch,
        resetSelection,
      }}
    >
      {children}
    </AnalyticsContext.Provider>
  );
};
