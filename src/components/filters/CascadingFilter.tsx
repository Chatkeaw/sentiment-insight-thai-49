
import React, { useEffect, useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getLocationData } from '@/utils/csvDataLoader';
import { LocationData, CascadingFilterOptions, LocationFilters } from '@/types/locations';

interface CascadingFilterProps {
  options?: CascadingFilterOptions;
  value?: LocationFilters; 
  onFiltersChange?: (filters: LocationFilters) => void;
  title?: string;
  className?: string;
}

const defaultOptions: CascadingFilterOptions = {
  showRegion: true,
  showProvince: true,
  showDistrict: true,
  showBranch: true,
  regionLabel: 'ภาค',
  provinceLabel: 'จังหวัด',
  districtLabel: 'เขต',
  branchLabel: 'หน่วยบริการ',
};

export const CascadingFilter: React.FC<CascadingFilterProps> = ({
  options = defaultOptions,
  onFiltersChange,
  title = 'พื้นที่ให้บริการ',
  className = ''
}) => {
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [filters, setFilters] = useState<LocationFilters>({
    regionId: 'all',
    provinceId: 'all',
    districtId: 'all',
    branchId: 'all',
  });

  const mergedOptions = { ...defaultOptions, ...options };

  // Load location data
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getLocationData();
        setLocationData(data);
      } catch (error) {
        console.error('Failed to load location data:', error);
      }
    };
    loadData();
  }, []);

  // Get filtered options for each level
  const availableProvinces = useMemo(() => {
    if (!locationData || filters.regionId === 'all') return locationData?.provinces || [];
    return locationData.provinces.filter(p => p.regionId === filters.regionId);
  }, [locationData, filters.regionId]);

  const availableDistricts = useMemo(() => {
    if (!locationData || filters.provinceId === 'all') return locationData?.districts || [];
    return locationData.districts.filter(d => d.provinceId === filters.provinceId);
  }, [locationData, filters.provinceId]);

  const availableBranches = useMemo(() => {
    if (!locationData || filters.districtId === 'all') return locationData?.branches || [];
    return locationData.branches.filter(b => b.districtId === filters.districtId);
  }, [locationData, filters.districtId]);

  // Handle filter changes with cascading reset
  const handleFilterChange = (level: keyof LocationFilters, value: string) => {
    setFilters(prev => {
      const newFilters = { ...prev, [level]: value };
      
      // Reset dependent filters when parent changes
      if (level === 'regionId') {
        newFilters.provinceId = 'all';
        newFilters.districtId = 'all';
        newFilters.branchId = 'all';
      } else if (level === 'provinceId') {
        newFilters.districtId = 'all';
        newFilters.branchId = 'all';
      } else if (level === 'districtId') {
        newFilters.branchId = 'all';
      }
      
      return newFilters;
    });
  };

  // Notify parent of filter changes
  useEffect(() => {
    onFiltersChange?.(filters);
  }, [filters, onFiltersChange]);

  if (!locationData) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-muted-foreground">
            กำลังโหลดข้อมูล...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Region Filter */}
          {mergedOptions.showRegion && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                {mergedOptions.regionLabel}
              </label>
              <Select 
                value={filters.regionId} 
                onValueChange={(value) => handleFilterChange('regionId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={`เลือก${mergedOptions.regionLabel}`} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทั้งหมด</SelectItem>
                  {locationData.regions.map((region) => (
                    <SelectItem key={region.id} value={region.id}>
                      {region.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Province Filter */}
          {mergedOptions.showProvince && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                {mergedOptions.provinceLabel}
              </label>
              <Select 
                value={filters.provinceId} 
                onValueChange={(value) => handleFilterChange('provinceId', value)}
                disabled={filters.regionId === 'all' && mergedOptions.showRegion}
              >
                <SelectTrigger>
                  <SelectValue placeholder={`เลือก${mergedOptions.provinceLabel}`} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทั้งหมด</SelectItem>
                  {availableProvinces.map((province) => (
                    <SelectItem key={province.id} value={province.id}>
                      {province.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* District Filter */}
          {mergedOptions.showDistrict && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                {mergedOptions.districtLabel}
              </label>
              <Select 
                value={filters.districtId} 
                onValueChange={(value) => handleFilterChange('districtId', value)}
                disabled={filters.provinceId === 'all' && mergedOptions.showProvince}
              >
                <SelectTrigger>
                  <SelectValue placeholder={`เลือก${mergedOptions.districtLabel}`} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทั้งหมด</SelectItem>
                  {availableDistricts.map((district) => (
                    <SelectItem key={district.id} value={district.id}>
                      {district.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Branch Filter */}
          {mergedOptions.showBranch && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                {mergedOptions.branchLabel}
              </label>
              <Select 
                value={filters.branchId} 
                onValueChange={(value) => handleFilterChange('branchId', value)}
                disabled={filters.districtId === 'all' && mergedOptions.showDistrict}
              >
                <SelectTrigger>
                  <SelectValue placeholder={`เลือก${mergedOptions.branchLabel}`} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทั้งหมด</SelectItem>
                  {availableBranches.map((branch) => (
                    <SelectItem key={branch.id} value={branch.id}>
                      {branch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
