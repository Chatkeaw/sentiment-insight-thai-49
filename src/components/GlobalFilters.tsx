import React, { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CascadingFilter } from "./filters/CascadingFilter";
import { LocationFilters } from "@/types/locations";

interface GlobalFiltersProps {
  onFiltersChange?: (filters: FilterState & { value: string }) => void;
}

interface FilterState {
  serviceTypes: string[];
  locationFilters: LocationFilters;
  timeRange: string;
  month: string;
  year: string;
}

type MonthState = { month: string; year: string };

const MONTHS = [
  { value: "1", label: "มกราคม" },
  { value: "2", label: "กุมภาพันธ์" },
  { value: "3", label: "มีนาคม" },
  { value: "4", label: "เมษายน" },
  { value: "5", label: "พฤษภาคม" },
  { value: "6", label: "มิถุนายน" },
  { value: "7", label: "กรกฎาคม" },
  { value: "8", label: "สิงหาคม" },
  { value: "9", label: "กันยายน" },
  { value: "10", label: "ตุลาคม" },
  { value: "11", label: "พฤศจิกายน" },
  { value: "12", label: "ธันวาคม" }
];

function getInitialMonth(): MonthState {
  try {
    const saved = localStorage.getItem("dashboard.month");
    if (saved) {
      const v = JSON.parse(saved) as MonthState;
      if (v && MONTHS.some(m => m.value === v.month) && /^\d{4}$/.test(v.year)) {
        return v;
      }
    }
  } catch (_) {}
  const now = new Date();
  return { month: String(now.getMonth() + 1), year: String(now.getFullYear()) };
}

const GlobalFilters: React.FC<GlobalFiltersProps> = ({ onFiltersChange }) => {
  const serviceTypes = [
    "การฝากเงิน/ถอนเงิน",
    "การซื้อผลิตภัณฑ์",
    "การชำระค่าบริการ/ค่าธรรมเนียม",
    "อื่นๆ"
  ];

  const timeRanges = [
    { value: "1day", label: "วันนี้" },
    { value: "1week", label: "1 สัปดาห์ล่าสุด" },
    { value: "1month", label: "1 เดือนล่าสุด" },
    { value: "3months", label: "3 เดือนล่าสุด" },
    { value: "6months", label: "6 เดือนล่าสุด" },
    { value: "1year", label: "1 ปีล่าสุด" }
  ];

  const initialMonth = useMemo(getInitialMonth, []);
  const [filters, setFilters] = useState<FilterState>({
    serviceTypes: [],
    locationFilters: {
      regionId: "all",
      provinceId: "all", 
      districtId: "all",
      branchId: "all"
    },
    timeRange: "1month",
    month: initialMonth.month,
    year: initialMonth.year
  });

  // Update localStorage and dispatch event when month/year changes
  useEffect(() => {
    const monthState = { month: filters.month, year: filters.year };
    localStorage.setItem("dashboard.month", JSON.stringify(monthState));
    window.dispatchEvent(new CustomEvent("dashboard:month-change", { detail: monthState }));
  }, [filters.month, filters.year]);

  // Notify parent component of filter changes
  useEffect(() => {
    const value = `${filters.year}-${filters.month.padStart(2, "0")}`;
    onFiltersChange?.({ ...filters, value });
  }, [filters, onFiltersChange]);

  const updateFilters = (updates: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...updates }));
  };

  const handleLocationFiltersChange = (locationFilters: LocationFilters) => {
    updateFilters({ locationFilters });
  };

  const removeServiceType = (serviceType: string) => {
    updateFilters({
      serviceTypes: filters.serviceTypes.filter(s => s !== serviceType)
    });
  };

  const clearAllFilters = () => {
    setFilters({
      serviceTypes: [],
      locationFilters: {
        regionId: "all",
        provinceId: "all",
        districtId: "all", 
        branchId: "all"
      },
      timeRange: "1month",
      month: initialMonth.month,
      year: initialMonth.year
    });
  };

  return (
    <div className="space-y-4">
      {/* Location Filters */}
      <CascadingFilter
        onFiltersChange={handleLocationFiltersChange}
        title="พื้นที่ให้บริการ"
      />

      {/* Other Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-4 items-center">
          {/* Service Types Filter */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-foreground">ประเภทบริการ</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-48 justify-start">
                  {filters.serviceTypes.length === 0 
                    ? "เลือกประเภทบริการ" 
                    : `เลือกแล้ว ${filters.serviceTypes.length} รายการ`
                  }
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-3">
                <div className="space-y-2">
                  {serviceTypes.map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={type}
                        checked={filters.serviceTypes.includes(type)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            updateFilters({
                              serviceTypes: [...filters.serviceTypes, type]
                            });
                          } else {
                            removeServiceType(type);
                          }
                        }}
                      />
                      <label htmlFor={type} className="text-sm font-medium cursor-pointer">
                        {type}
                      </label>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Month/Year Filter */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-foreground">เดือน/ปี</label>
            <div className="flex gap-2">
              <Select value={filters.month} onValueChange={(value) => updateFilters({ month: value })}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="เลือกเดือน" />
                </SelectTrigger>
                <SelectContent>
                  {MONTHS.map((month) => (
                    <SelectItem key={month.value} value={month.value}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filters.year} onValueChange={(value) => updateFilters({ year: value })}>
                <SelectTrigger className="w-20">
                  <SelectValue placeholder="ปี" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 5 }, (_, i) => {
                    const year = new Date().getFullYear() - i;
                    const yearBE = year + 543;
                    return (
                      <SelectItem key={year} value={String(year)}>
                        {yearBE}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Time Range Filter */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-foreground">ช่วงเวลา</label>
            <Select value={filters.timeRange} onValueChange={(value) => updateFilters({ timeRange: value })}>
              <SelectTrigger className="w-40">
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

          {/* Clear All Button */}
          <div className="flex flex-col justify-end">
            <Button variant="outline" size="sm" onClick={clearAllFilters}>
              ล้างตัวกรองทั้งหมด
            </Button>
          </div>
        </div>

        {/* Active Filters Display */}
        {filters.serviceTypes.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-sm font-medium text-muted-foreground">ประเภทบริการที่เลือก:</span>
            {filters.serviceTypes.map((type) => (
              <Badge key={type} variant="secondary" className="flex items-center gap-1">
                {type}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => removeServiceType(type)}
                />
              </Badge>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default GlobalFilters;
