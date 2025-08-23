import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CalendarIcon, AlertTriangle, FileText } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import TimeFilter from '@/components/TimeFilter';
import { TimeFilter as TimeFilterType } from '@/types/dashboard';

interface SevereComplaint {
  id: string;
  date: string; // ISO-8601 (YYYY-MM-DD)
  region: string;
  province: string; // Added missing province property
  district: string; // Added missing district property
  area: string;
  branch: string;
  branch_code: string;
  service_type: string;
  category: string;
  sub_category: string;
  comment: string;
  sentiment: 'negative';
  severity_label: 'severe';
  severity_score: number; // 0-1 (>=0.80 for severe)
  attachments: string[];
}

const mockSevereComplaints: SevereComplaint[] = [
  {
    id: "SC-001",
    date: "2025-08-15",
    region: "ภาค 1",
    province: "กรุงเทพฯ",
    district: "บางเขน",
    area: "กรุงเทพ",
    branch: "ประชาชื่น",
    branch_code: "0001",
    service_type: "การชำระค่าบริการ/ค่าธรรมเนียม",
    category: "พนักงานและบุคลากร",
    sub_category: "การแก้ไขปัญหา",
    comment: "เครื่องชำระเงินเสียบ่อย ต้องซ่อม พนักงานช่วยได้แต่ใช้เวลานาน อุณหภูมิร้อน",
    sentiment: "negative",
    severity_label: "severe",
    severity_score: 0.92,
    attachments: []
  },
  {
    id: "SC-002",
    date: "2025-08-14",
    region: "ภาค 4",
    province: "สมุทรสาคร",
    district: "สมุทรสาคร",
    area: "สมุทรสาคร",
    branch: "เซ็นทรัล มหาชัย",
    branch_code: "0002",
    service_type: "บัตรเดบิต/บัตรเอทีเอ็ม",
    category: "เทคโนโลยีและดิจิทัล",
    sub_category: "ATM/ADM/CDM",
    comment: "เครื่อง ATM กลืนบัตรและตัดเงินซ้ำ ไม่มีเจ้าหน้าที่ช่วยทันที",
    sentiment: "negative",
    severity_label: "severe",
    severity_score: 0.88,
    attachments: []
  },
  {
    id: "SC-003",
    date: "2025-08-13",
    region: "ภาค 5",
    province: "กาญจนบุรี",
    district: "กาญจนบุรี",
    area: "กาญจนบุรี",
    branch: "กาญจนบุรี",
    branch_code: "0003",
    service_type: "สินเชื่อส่วนบุคคล",
    category: "ระบบและกระบวนการให้บริการ",
    sub_category: "เอกสารและข้อมูล",
    comment: "เอกสารสำคัญของลูกค้าถูกส่งผิดอีเมล มีข้อมูลส่วนตัวรั่วไหล ไม่มีการตรวจสอบความถูกต้อง",
    sentiment: "negative",
    severity_label: "severe",
    severity_score: 0.95,
    attachments: ["document_leak.pdf"]
  },
  {
    id: "SC-004",
    date: "2025-08-12",
    region: "ภาค 13",
    province: "นครราชสีมา",
    district: "นครราชสีมา 3",
    area: "นครราชสีมา",
    branch: "สีคิ้ว",
    branch_code: "0004",
    service_type: "โมบายแอป",
    category: "เทคโนโลยีและดิจิทัล",
    sub_category: "Mobile Application",
    comment: "แอปล่มช่วงสิ้นเดือน โอนเงินไม่ผ่านแต่ยอดถูกตัดหาย ไม่มีการแจ้งเตือนใดๆ ส่งผลกระทบต่อธุรกิจ",
    sentiment: "negative",
    severity_label: "severe",
    severity_score: 0.90,
    attachments: []
  },
  {
    id: "SC-005",
    date: "2025-08-11",
    region: "ภาค 10",
    province: "นครพนม",
    district: "นครพนม",
    area: "นครพนม",
    branch: "นครพนม",
    branch_code: "0005",
    service_type: "โอนเงินต่างธนาคาร",
    category: "ระบบและกระบวนการให้บริการ",
    sub_category: "ระยะเวลาการให้บริการ",
    comment: "รอคิวเกิน 3 ชั่วโมงโดยไม่มีระบบจัดคิวที่ชัดเจน แจ้งเจ้าหน้าที่แล้วไม่ได้รับความช่วยเหลือ",
    sentiment: "negative",
    severity_label: "severe",
    severity_score: 0.86,
    attachments: []
  },
  {
    id: "SC-006",
    date: "2025-08-10",
    region: "ภาค 13",
    province: "ปราจีนบุรี",
    district: "ปราจีนบุรี",
    area: "ปราจีนบุรี",
    branch: "ปราจีนบุรี",
    branch_code: "0006",
    service_type: "ธุรกรรมต่างประเทศ",
    category: "ระบบและกระบวนการให้บริการ",
    sub_category: "ความถูกต้องของข้อมูล",
    comment: "โอนเงินไปต่างประเทศผิดบัญชีจากการกรอกข้อมูลผิดของพนักงาน ลูกค้าเสียหายจำนวนมาก ไม่รับผิดชอบ",
    sentiment: "negative",
    severity_label: "severe",
    severity_score: 0.94,
    attachments: []
  }
];


interface SevereComplaintsPageProps {
  className?: string;
}

export const SevereComplaintsPage: React.FC<SevereComplaintsPageProps> = ({ className }) => {
  const navigate = useNavigate();
  
  // Filter states
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedArea, setSelectedArea] = useState<string>('all');
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedServiceType, setSelectedServiceType] = useState<string>('all');
  const [timeFilterType, setTimeFilterType] = useState<'preset' | 'custom'>('preset');
  const [timeRange, setTimeRange] = useState<TimeFilterType['value']>('1month');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

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

  // Get all unique categories (main categories)
  const allCategories = useMemo(() => {
    return Array.from(new Set(mockSevereComplaints.map(c => c.category))).sort();
  }, []);

  // Get all unique sub categories 
  const allSubCategories = useMemo(() => {
    return Array.from(new Set(mockSevereComplaints.map(c => c.sub_category))).sort();
  }, []);

  // Get all unique service types
  const serviceTypes = useMemo(() => {
    return Array.from(new Set(mockSevereComplaints.map(c => c.service_type))).sort();
  }, []);

  // Filtered complaints data (only severe complaints with negative sentiment and severity >= 0.80)
  const filteredComplaints = useMemo(() => {
    let filtered = mockSevereComplaints.filter(complaint => {
      // Only show negative sentiment with severe severity (>=0.80)
      if (complaint.sentiment !== 'negative' || complaint.severity_score < 0.80) return false;
      
      if (selectedRegion !== 'all' && complaint.region !== selectedRegion) return false;
      if (selectedArea !== 'all' && complaint.area !== selectedArea) return false;
      if (selectedBranch !== 'all' && complaint.branch !== selectedBranch) return false;
      
      // Service type filter
      if (selectedServiceType !== 'all' && complaint.service_type !== selectedServiceType) return false;
      
      // Category filter (use main category for now)
      if (selectedCategory !== 'all' && complaint.category !== selectedCategory) return false;
      
      // Date range filter
      if (timeFilterType === 'custom' && dateRange?.from && dateRange?.to) {
        const complaintDate = new Date(complaint.date);
        if (complaintDate < dateRange.from || complaintDate > dateRange.to) return false;
      } else if (timeFilterType === 'preset') {
        const now = new Date();
        const complaintDate = new Date(complaint.date);
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
    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
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

  // Handle flow agent navigation
  const handleFlowAgentClick = (complaint: SevereComplaint) => {
    const record = {
      id: complaint.id,
      request_id: complaint.id,
      created_at: complaint.date,
      submitted_at: complaint.date,
      area: complaint.area,
      province: complaint.province,
      district: complaint.district,
      service_type: complaint.service_type,
      tags: [`${complaint.category}: ${complaint.sub_category} (เชิงลบ)`],
      scores: {
        overall: Math.floor(Math.random() * 3) + 1, // Mock low scores for severe complaints
        trust: Math.floor(Math.random() * 3) + 1,
        consultation: Math.floor(Math.random() * 3) + 1,
        speed: Math.floor(Math.random() * 3) + 1,
        accuracy: Math.floor(Math.random() * 3) + 1,
        equipment: Math.floor(Math.random() * 3) + 1,
        environment: Math.floor(Math.random() * 3) + 1
      },
      customer_comment: complaint.comment,
      branch: complaint.branch,
      sub_branch: complaint.branch,
      region: complaint.region,
      sentiment: 'negative'
    };
    
    navigate(`/flow-agent/feedback/${complaint.id}`, { state: record });
  };

  return (
    <TooltipProvider>
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
                  className="p-4 rounded-lg border border-pink-200 bg-pink-50 transition-colors flex justify-between items-start gap-4"
                >
                  <div className="flex-1">
                    {/* Header Info - Format: [วันที่] – [สาขา/พื้นที่] – [ประเภทบริการ] – [หมวดหมู่] */}
                    <div className="text-sm font-medium text-foreground mb-3">
                      <span className="font-bold text-pink-800">
                        {complaint.date} – {complaint.branch}/{complaint.area} – {complaint.service_type} – {complaint.category}
                      </span>
                    </div>

                    {/* Comment */}
                    <div className="mb-3">
                      <p className="text-foreground leading-relaxed text-base">{complaint.comment}</p>
                    </div>

                    {/* Category Tags */}
                    <div className="flex flex-wrap gap-2">
                      <Badge 
                        variant="secondary"
                        className="cursor-pointer hover:bg-pink-200 bg-pink-100 text-pink-800 border-pink-300"
                        onClick={() => handleCategoryClick(complaint.category)}
                      >
                        {complaint.category}
                      </Badge>
                      <Badge 
                        variant="outline"
                        className="cursor-pointer hover:bg-slate-100 border-slate-300"
                        onClick={() => handleCategoryClick(complaint.sub_category)}
                      >
                        {complaint.sub_category}
                      </Badge>
                      <Badge 
                        variant="destructive"
                        className="text-xs"
                      >
                        คะแนนความรุนแรง: {(complaint.severity_score * 100).toFixed(0)}%
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Action Column */}
                  <div className="flex-shrink-0">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleFlowAgentClick(complaint)}
                          className="w-8 h-8 p-0 rounded-full bg-[#FCE7F3] border border-[#F9CADF] hover:bg-[#F9CADF] transition-colors"
                        >
                          <FileText className="w-4 h-4 text-[#C0245E]" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>ดู Flow Agent</TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
      </div>
    </TooltipProvider>
  );
};
