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

const GlobalFilters: React.FC<GlobalFiltersProps> = ({ onFiltersChange }) => {
  const [filters, setFilters] = useState<FilterState>({
    serviceTypes: [],
    region: "",
    district: "",
    branch: "",
    timeRange: "1month"
  });

  // Mock data สำหรับ dropdown
  const serviceTypes = [
    "การฝากเงิน/ถอนเงิน",
    "การซื้อผลิตภัณฑ์", 
    "การชำระค่าบริการ/ค่าธรรมเนียม",
    "อื่นๆ"
  ];

  const regions = Array.from({ length: 18 }, (_, i) => ({
    value: `ภาค ${i + 1}`,
    label: `ภาค ${i + 1}`
  }));

  const getDistrictsForRegion = (region: string) => {
    if (!region || region === "All") return [];
    // Mock districts for selected region
    return Array.from({ length: 3 }, (_, i) => ({
      value: `${region} เขต ${i + 1}`,
      label: `เขต ${i + 1}`
    }));
  };

  const getBranchesForDistrict = (district: string) => {
    if (!district || district === "All") return [];
    // Mock branches for selected district
    return Array.from({ length: 5 }, (_, i) => ({
      value: `${district} สาขา ${i + 1}`,
      label: `สาขา ${i + 1}`
    }));
  };

  const timeRanges = [
    { value: "1day", label: "วันนี้" },
    { value: "1week", label: "1 สัปดาห์ล่าสุด" },
    { value: "1month", label: "1 เดือนล่าสุด" },
    { value: "3months", label: "3 เดือนล่าสุด" },
    { value: "6months", label: "6 เดือนล่าสุด" },
    { value: "1year", label: "1 ปีล่าสุด" }
  ];

  const updateFilters = (newFilters: Partial<FilterState>) => {
    const updatedFilters = { ...filters, ...newFilters };
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
    const newServiceTypes = filters.serviceTypes.includes(serviceType)
      ? filters.serviceTypes.filter(type => type !== serviceType)
      : [...filters.serviceTypes, serviceType];
    
    updateFilters({ serviceTypes: newServiceTypes });
  };

  const handleSelectAllServiceTypes = () => {
    const newServiceTypes = filters.serviceTypes.length === serviceTypes.length ? [] : [...serviceTypes];
    updateFilters({ serviceTypes: newServiceTypes });
  };

  const removeServiceType = (serviceType: string) => {
    updateFilters({
      serviceTypes: filters.serviceTypes.filter(type => type !== serviceType)
    });
  };

  const districts = getDistrictsForRegion(filters.region);
  const branches = getBranchesForDistrict(filters.district);

  return (
    <Card className="p-6 mb-6 bg-gradient-to-r from-white to-pink-50/30 border-pink-100">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* ประเภทการให้บริการ - Multi-Select */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            ประเภทการให้บริการ
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                {filters.serviceTypes.length === 0 
                  ? "เลือกประเภทการให้บริการ" 
                  : `เลือกแล้ว ${filters.serviceTypes.length} รายการ`}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="start">
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">ประเภทการให้บริการ</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSelectAllServiceTypes}
                  >
                    {filters.serviceTypes.length === serviceTypes.length ? "ยกเลิกทั้งหมด" : "เลือกทั้งหมด"}
                  </Button>
                </div>
                <div className="space-y-2">
                  {serviceTypes.map((serviceType) => (
                    <div key={serviceType} className="flex items-center space-x-2">
                      <Checkbox
                        id={serviceType}
                        checked={filters.serviceTypes.includes(serviceType)}
                        onCheckedChange={() => handleServiceTypeToggle(serviceType)}
                      />
                      <label htmlFor={serviceType} className="text-sm">
                        {serviceType}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
          
          {/* แสดง badges ของรายการที่เลือก */}
          {filters.serviceTypes.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {filters.serviceTypes.map((serviceType) => (
                <Badge key={serviceType} variant="secondary" className="text-xs">
                  {serviceType}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 ml-1 text-muted-foreground hover:text-destructive"
                    onClick={() => removeServiceType(serviceType)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* หมวดพื้นที่ให้บริการ - Cascading Select */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            พื้นที่ให้บริการ
          </label>
          
          {/* ภาค */}
          <Select value={filters.region} onValueChange={handleRegionChange}>
            <SelectTrigger>
              <SelectValue placeholder="เลือกภาค" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">ทุกภาค</SelectItem>
              {regions.map((region) => (
                <SelectItem key={region.value} value={region.value}>
                  {region.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* เขต */}
          <Select 
            value={filters.district} 
            onValueChange={handleDistrictChange}
            disabled={!filters.region || filters.region === "All"}
          >
            <SelectTrigger className={!filters.region || filters.region === "All" ? "opacity-50" : ""}>
              <SelectValue placeholder="เลือกเขต" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">ทุกเขต</SelectItem>
              {districts.map((district) => (
                <SelectItem key={district.value} value={district.value}>
                  {district.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* สาขา */}
          <Select 
            value={filters.branch} 
            onValueChange={(value) => updateFilters({ branch: value })}
            disabled={!filters.district || filters.district === "All"}
          >
            <SelectTrigger className={!filters.district || filters.district === "All" ? "opacity-50" : ""}>
              <SelectValue placeholder="เลือกสาขา" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">ทุกสาขา</SelectItem>
              {branches.map((branch) => (
                <SelectItem key={branch.value} value={branch.value}>
                  {branch.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* ช่วงเวลาเก็บข้อมูล */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            ช่วงเวลาเก็บข้อมูล
          </label>
          <Select value={filters.timeRange} onValueChange={(value) => updateFilters({ timeRange: value })}>
            <SelectTrigger>
              <SelectValue placeholder="เลือกช่วงเวลา" />
            </SelectTrigger>
            <SelectContent>
              {timeRanges.map((range) => (
                <SelectItem key={range.value} value={range.value}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  );
};

export default GlobalFilters;