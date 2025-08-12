import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
interface GlobalFiltersProps {
  onFiltersChange?: (filters: FilterState) => void;
}
interface FilterState {
  serviceTypes: string[];
  region: string;
  district: string;
  branch: string;
  timeRange: string;
}
const GlobalFilters: React.FC<GlobalFiltersProps> = ({
  onFiltersChange
}) => {
  const [filters, setFilters] = useState<FilterState>({
    serviceTypes: [],
    region: "",
    district: "",
    branch: "",
    timeRange: "1month"
  });

  // Mock data สำหรับ dropdown
  const serviceTypes = ["การฝากเงิน/ถอนเงิน", "การซื้อผลิตภัณฑ์", "การชำระค่าบริการ/ค่าธรรมเนียม", "อื่นๆ"];
  const regions = Array.from({
    length: 18
  }, (_, i) => ({
    value: `ภาค ${i + 1}`,
    label: `ภาค ${i + 1}`
  }));
  const getDistrictsForRegion = (region: string) => {
    if (!region || region === "All") return [];
    // Mock districts for selected region
    return Array.from({
      length: 3
    }, (_, i) => ({
      value: `${region} เขต ${i + 1}`,
      label: `เขต ${i + 1}`
    }));
  };
  const getBranchesForDistrict = (district: string) => {
    if (!district || district === "All") return [];
    // Mock branches for selected district
    return Array.from({
      length: 5
    }, (_, i) => ({
      value: `${district} สาขา ${i + 1}`,
      label: `สาขา ${i + 1}`
    }));
  };
  const timeRanges = [{
    value: "1day",
    label: "วันนี้"
  }, {
    value: "1week",
    label: "1 สัปดาห์ล่าสุด"
  }, {
    value: "1month",
    label: "1 เดือนล่าสุด"
  }, {
    value: "3months",
    label: "3 เดือนล่าสุด"
  }, {
    value: "6months",
    label: "6 เดือนล่าสุด"
  }, {
    value: "1year",
    label: "1 ปีล่าสุด"
  }];
  const updateFilters = (newFilters: Partial<FilterState>) => {
    const updatedFilters = {
      ...filters,
      ...newFilters
    };
    setFilters(updatedFilters);
    onFiltersChange?.(updatedFilters);
  };
  const handleRegionChange = (value: string) => {
    updateFilters({
      region: value,
      district: "",
      branch: ""
    });
  };
  const handleDistrictChange = (value: string) => {
    updateFilters({
      district: value,
      branch: ""
    });
  };
  const handleServiceTypeToggle = (serviceType: string) => {
    const newServiceTypes = filters.serviceTypes.includes(serviceType) ? filters.serviceTypes.filter(type => type !== serviceType) : [...filters.serviceTypes, serviceType];
    updateFilters({
      serviceTypes: newServiceTypes
    });
  };
  const handleSelectAllServiceTypes = () => {
    const newServiceTypes = filters.serviceTypes.length === serviceTypes.length ? [] : [...serviceTypes];
    updateFilters({
      serviceTypes: newServiceTypes
    });
  };
  const removeServiceType = (serviceType: string) => {
    updateFilters({
      serviceTypes: filters.serviceTypes.filter(type => type !== serviceType)
    });
  };
  const districts = getDistrictsForRegion(filters.region);
  const branches = getBranchesForDistrict(filters.district);
  return;
};
export default GlobalFilters;