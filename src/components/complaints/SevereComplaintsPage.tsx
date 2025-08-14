import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { CalendarIcon, AlertTriangle } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import TimeFilter from '@/components/TimeFilter';
import { TimeFilter as TimeFilterType } from '@/types/dashboard';

interface SevereComplaint {
  id: string;
  ref_code: string;
  region: string;
  area: string;
  branch: string;
  timestamp: string;
  raw_comment: string;
  category_tags: string;
  sentiment: 'negative';
  severity: 'high';
  serviceType: string;
}

const mockSevereComplaints: SevereComplaint[] = [
  {
    id: '1',
    ref_code: 'cb001',
    region: 'ภาคกลาง',
    area: 'กรุงเทพมหานคร',
    branch: 'ดอนเมือง',
    timestamp: '2024-07-05 14:30',
    raw_comment: 'พนักงานไม่สุภาพ พูดจาก้าวร้าว ไม่ให้ความช่วยเหลือ เมื่อลูกค้ามีปัญหาเรื่องโอนเงิน ทำให้รู้สึกไม่ปลอดภัย จะไม่ใช้บริการธนาคารนี้อีก',
    category_tags: '1.1 ความสุภาพและมารยาทของพนักงาน, 1.2 การใส่ใจของพนักงาน',
    sentiment: 'negative',
    severity: 'high',
    serviceType: 'การฝากเงิน/ถอนเงิน'
  },
  {
    id: '2',
    ref_code: 'cb002',
    region: 'ภาคเหนือ',
    area: 'เชียงใหม่',
    branch: 'เมืองเชียงใหม่',
    timestamp: '2024-07-04 16:45',
    raw_comment: 'ระบบธนาคารล่ม 3 ชั่วโมง ไม่สามารถถอนเงินได้ พนักงานไม่มีแจ้งให้ทราบล่วงหน้า ต้องรอแบบลำบาก เสียเวลาทำงาน',
    category_tags: '3.1 ระบบ Core ของธนาคาร, 1.3 การสื่อสารพนักงาน',
    sentiment: 'negative',
    severity: 'high',
    serviceType: 'การฝากเงิน/ถอนเงิน'
  },
  {
    id: '3',
    ref_code: 'cb003',
    region: 'ภาคตะวันออกเฉียงเหนือ',
    area: 'ขอนแก่น',
    branch: 'เมืองขอนแก่น',
    timestamp: '2024-07-03 11:20',
    raw_comment: 'เครื่อง ATM กินบัตร ไม่มีพนักงานดูแล ต้องรอ 2 สัปดาห์ถึงจะได้บัตรใหม่ ไม่มีทางออกให้ลูกค้า ธนาคารไม่รับผิดชอบ',
    category_tags: '3.3 ATM ADM CDM, 1.6 ความเป็นมืออาชีพและการแก้ไขปัญหาเฉพาะหน้า',
    sentiment: 'negative',
    severity: 'high',
    serviceType: 'การชำระค่าบริการ/ค่าธรรมเนียม'
  },
  {
    id: '4',
    ref_code: 'cb004',
    region: 'ภาคใต้',
    area: 'สงขลา',
    branch: 'หาดใหญ่',
    timestamp: '2024-07-02 09:15',
    raw_comment: 'แอป MyMo ใช้งานไม่ได้เป็นอาทิตย์ โอนเงินไม่ได้ ชำระบิลไม่ได้ พนักงานบอกให้รอ ไม่มีทางแก้ไข ส่งผลกระทบต่อธุรกิจ',
    category_tags: '3.5 แอพพลิเคชั่น MyMo, 2.1 ความพร้อมในการให้บริการ',
    sentiment: 'negative',
    severity: 'high',
    serviceType: 'การซื้อผลิตภัณฑ์'
  },
  {
    id: '5',
    ref_code: 'cb005',
    region: 'ภาคกลาง',
    area: 'กรุงเทพมหานคร',
    branch: 'บางนา',
    timestamp: '2024-07-01 15:30',
    raw_comment: 'พนักงานขายผลิตภัณฑ์แบบบังคับ ไม่อธิบายความเสี่ยง หลอกว่าไม่มีความเสี่ยง ตอนนี้เสียเงิน ธนาคารไม่ยอมรับผิดชอบ',
    category_tags: '4.1 การให้ข้อมูลผลิตภัณฑ์, 6.2 การไม่หลอกลวง',
    sentiment: 'negative',
    severity: 'high',
    serviceType: 'การซื้อผลิตภัณฑ์'
  }
];

interface SevereComplaintsPageProps {
  className?: string;
}

export const SevereComplaintsPage: React.FC<SevereComplaintsPageProps> = ({ className }) => {
  // Filter states
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedArea, setSelectedArea] = useState<string>('all');
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedServiceType, setSelectedServiceType] = useState<string>('all');
  const [timeFilterType, setTimeFilterType] = useState<'preset' | 'custom'>('preset');
  const [timeRange, setTimeRange] = useState<TimeFilterType['value']>('1month');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  // Helper function to parse categories from category_tags
  const parseCategories = (categoryTags: string): string[] => {
    return categoryTags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
  };

  // Cascading filter options
  const regions = useMemo(() => {
    return Array.from(new Set(mockSevereComplaints.map(c => c.region))).sort();
  }, []);

  const areas = useMemo(() => {
    if (selectedRegion === 'all') return [];
    return Array.from(new Set(
      mockSevereComplaints
        .filter(c => c.region === selectedRegion)
        .map(c => c.area)
    )).sort();
  }, [selectedRegion]);

  const branches = useMemo(() => {
    if (selectedArea === 'all') return [];
    return Array.from(new Set(
      mockSevereComplaints
        .filter(c => c.region === selectedRegion && c.area === selectedArea)
        .map(c => c.branch)
    )).sort();
  }, [selectedRegion, selectedArea]);

  // Get all unique categories
  const allCategories = useMemo(() => {
    const categories = new Set<string>();
    mockSevereComplaints.forEach(complaint => {
      const cats = parseCategories(complaint.category_tags);
      cats.forEach(cat => categories.add(cat));
    });
    return Array.from(categories).sort();
  }, []);

  // Get all unique service types
  const serviceTypes = useMemo(() => {
    return Array.from(new Set(mockSevereComplaints.map(c => c.serviceType))).sort();
  }, []);

  // Filtered complaints data (only severe complaints with negative sentiment and high severity)
  const filteredComplaints = useMemo(() => {
    let filtered = mockSevereComplaints.filter(complaint => {
      // Only show negative sentiment with high severity
      if (complaint.sentiment !== 'negative' || complaint.severity !== 'high') return false;
      
      if (selectedRegion !== 'all' && complaint.region !== selectedRegion) return false;
      if (selectedArea !== 'all' && complaint.area !== selectedArea) return false;
      if (selectedBranch !== 'all' && complaint.branch !== selectedBranch) return false;
      
      // Service type filter
      if (selectedServiceType !== 'all' && complaint.serviceType !== selectedServiceType) return false;
      
      // Category filter
      if (selectedCategory !== 'all') {
        const categories = parseCategories(complaint.category_tags);
        if (!categories.includes(selectedCategory)) return false;
      }
      
      // Date range filter
      if (timeFilterType === 'custom' && dateRange?.from && dateRange?.to) {
        const complaintDate = new Date(complaint.timestamp);
        if (complaintDate < dateRange.from || complaintDate > dateRange.to) return false;
      } else if (timeFilterType === 'preset') {
        const now = new Date();
        const complaintDate = new Date(complaint.timestamp);
        let cutoffDate = new Date();
        
        switch (timeRange) {
          case '1day':
            cutoffDate.setDate(now.getDate() - 1);
            break;
          case '1week':
            cutoffDate.setDate(now.getDate() - 7);
            break;
          case '1month':
            cutoffDate.setMonth(now.getMonth() - 1);
            break;
          case '3months':
            cutoffDate.setMonth(now.getMonth() - 3);
            break;
          case '6months':
            cutoffDate.setMonth(now.getMonth() - 6);
            break;
          case '1year':
            cutoffDate.setFullYear(now.getFullYear() - 1);
            break;
        }
        
        if (complaintDate < cutoffDate) return false;
      }
      
      return true;
    });

    // Sort by date (newest first)
    return filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [selectedRegion, selectedArea, selectedBranch, selectedCategory, selectedServiceType, timeFilterType, timeRange, dateRange]);

  // Clear all filters
  const clearFilters = () => {
    setSelectedRegion('all');
    setSelectedArea('all');
    setSelectedBranch('all');
    setSelectedCategory('all');
    setSelectedServiceType('all');
    setTimeFilterType('preset');
    setTimeRange('1month');
    setDateRange(undefined);
  };

  // Handle category tag click
  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center bg-pink-100 p-4 rounded-lg border border-pink-200">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-6 w-6 text-pink-600" />
          <h1 className="text-2xl font-bold text-pink-800">ข้อร้องเรียนที่รุนแรง</h1>
        </div>
        <Button onClick={clearFilters} variant="outline" size="sm" className="border-pink-300 text-pink-700 hover:bg-pink-50">
          ล้างตัวกรอง
        </Button>
      </div>

      {/* Description */}
      <div className="text-muted-foreground">
        ระบบติดตามและวิเคราะห์ข้อร้องเรียนลูกค้า ธนาคารออมสิน - แสดงเฉพาะความคิดเห็นเชิงลบที่มีความรุนแรงสูง
      </div>

      {/* Filters Card */}
      <Card>
        <CardHeader>
          <CardTitle>ตัวกรองข้อมูล</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Location Filters */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-foreground">พื้นที่</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">ภาค</label>
                <Select value={selectedRegion} onValueChange={(value) => {
                  setSelectedRegion(value);
                  setSelectedArea('all');
                  setSelectedBranch('all');
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกภาค" />
                  </SelectTrigger>
                  <SelectContent className="bg-background">
                    <SelectItem value="all">ทั้งหมด</SelectItem>
                    {regions.map(region => (
                      <SelectItem key={region} value={region}>{region}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">เขต</label>
                <Select value={selectedArea} onValueChange={(value) => {
                  setSelectedArea(value);
                  setSelectedBranch('all');
                }} disabled={selectedRegion === 'all'}>
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกเขต" />
                  </SelectTrigger>
                  <SelectContent className="bg-background">
                    <SelectItem value="all">ทั้งหมด</SelectItem>
                    {areas.map(area => (
                      <SelectItem key={area} value={area}>{area}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">สาขา</label>
                <Select value={selectedBranch} onValueChange={setSelectedBranch} disabled={selectedArea === 'all'}>
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกสาขา" />
                  </SelectTrigger>
                  <SelectContent className="bg-background">
                    <SelectItem value="all">ทั้งหมด</SelectItem>
                    {branches.map(branch => (
                      <SelectItem key={branch} value={branch}>{branch}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Service Type Filter */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-foreground">ประเภทบริการ</h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">ประเภทบริการ</label>
                <Select value={selectedServiceType} onValueChange={setSelectedServiceType}>
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกประเภทบริการ" />
                  </SelectTrigger>
                  <SelectContent className="bg-background">
                    <SelectItem value="all">ทั้งหมด</SelectItem>
                    {serviceTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Category Filter */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-foreground">หมวดหมู่ที่ถูกกล่าวถึง</h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">หมวดหมู่ย่อย</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกหมวดหมู่" />
                  </SelectTrigger>
                  <SelectContent className="bg-background">
                    <SelectItem value="all">ทั้งหมด</SelectItem>
                    {allCategories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Time Filter */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-foreground">ประเภทเวลา</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">ประเภท</label>
                <Select value={timeFilterType} onValueChange={(value: 'preset' | 'custom') => setTimeFilterType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background">
                    <SelectItem value="preset">เวลาย้อนหลัง</SelectItem>
                    <SelectItem value="custom">กำหนดเอง</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {timeFilterType === 'preset' && (
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground">ช่วงเวลา</label>
                  <TimeFilter value={timeRange} onChange={setTimeRange} />
                </div>
              )}
              
              {timeFilterType === 'custom' && (
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs text-muted-foreground">ช่วงวันที่</label>
                  <DatePickerWithRange date={dateRange} setDate={setDateRange} />
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Complaints List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              ผลการค้นหา ({filteredComplaints.length} รายการ)
            </CardTitle>
            <Badge variant="destructive" className="text-sm">
              ความรุนแรงสูง
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {filteredComplaints.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                ไม่พบข้อร้องเรียนที่รุนแรงที่ตรงกับเงื่อนไขการกรอง
              </div>
            ) : (
              filteredComplaints.map((complaint) => (
                <div
                  key={complaint.id}
                  className="p-4 rounded-lg border border-pink-200 bg-pink-50 transition-colors"
                >
                  {/* Header Info - Format: [วันที่] – [สาขา/พื้นที่] – [ประเภทบริการ] – [หมวดหมู่] */}
                  <div className="text-sm font-medium text-foreground mb-3">
                    <span className="font-bold text-pink-800">
                      {complaint.timestamp} – {complaint.branch}/{complaint.area} – {complaint.serviceType} – 
                    </span>
                    <span className="ml-1">
                      {(() => {
                        const categories = parseCategories(complaint.category_tags);
                        return categories.length > 0 ? categories.join(', ') : 'ยังไม่ระบุหมวดหมู่';
                      })()}
                    </span>
                  </div>

                  {/* Comment */}
                  <div className="mb-3">
                    <p className="text-foreground leading-relaxed text-base">{complaint.raw_comment}</p>
                  </div>

                  {/* Category Tags */}
                  <div className="flex flex-wrap gap-2">
                    {(() => {
                      const categories = parseCategories(complaint.category_tags);
                      return categories.length > 0 ? (
                        categories.map((category, index) => (
                          <Badge 
                            key={index}
                            variant="secondary"
                            className="cursor-pointer hover:bg-pink-200 bg-pink-100 text-pink-800 border-pink-300"
                            onClick={() => handleCategoryClick(category)}
                          >
                            {category}
                          </Badge>
                        ))
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground">
                          ยังไม่ระบุหมวดหมู่
                        </Badge>
                      );
                    })()}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};