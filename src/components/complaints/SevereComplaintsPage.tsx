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
  date: string; // ISO-8601 (YYYY-MM-DD)
  region: string;
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
    id: "C-001",
    date: "2025-08-14",
    region: "ภาคกลาง",
    area: "กรุงเทพเหนือ",
    branch: "สาขางามวงศ์วาน",
    branch_code: "BKK-N01",
    service_type: "ธุรกรรมเงินฝาก",
    category: "พนักงานและบุคลากร",
    sub_category: "ความสุภาพและมารยาทของพนักงาน",
    comment: "พนักงานพูดจาเสียงดังและประชดลูกค้าต่อหน้า ผู้อื่นจำนวนมาก รู้สึกไม่ปลอดภัย",
    sentiment: "negative",
    severity_label: "severe",
    severity_score: 0.92,
    attachments: []
  },
  {
    id: "C-002",
    date: "2025-08-13",
    region: "ภาคกลาง",
    area: "กรุงเทพใต้",
    branch: "สาขาสีลม",
    branch_code: "BKK-S02",
    service_type: "บัตรเดบิต/บัตรเอทีเอ็ม",
    category: "เทคโนโลยีและดิจิทัล",
    sub_category: "ATM/ADM/CDM",
    comment: "เครื่อง ATM กลืนบัตรและตัดเงินซ้ำ ติดต่อสาขาแล้วไม่รับเรื่องทันที",
    sentiment: "negative",
    severity_label: "severe",
    severity_score: 0.89,
    attachments: []
  },
  {
    id: "C-003",
    date: "2025-08-12",
    region: "ภาคเหนือ",
    area: "เชียงใหม่ในเมือง",
    branch: "สาขานิมมานฯ",
    branch_code: "CMI-01",
    service_type: "สินเชื่อส่วนบุคคล",
    category: "ระบบและกระบวนการให้บริการ",
    sub_category: "เอกสารและข้อมูล",
    comment: "เอกสารสำคัญของลูกค้าถูกส่งผิดอีเมล มีข้อมูลส่วนตัวรั่วไหล",
    sentiment: "negative",
    severity_label: "severe",
    severity_score: 0.95,
    attachments: ["img1.png"]
  },
  {
    id: "C-004",
    date: "2025-08-10",
    region: "ภาคอีสาน",
    area: "ขอนแก่นเมือง",
    branch: "สาขากลางเมือง",
    branch_code: "KKC-01",
    service_type: "โมบายแอป",
    category: "เทคโนโลยีและดิจิทัล",
    sub_category: "Mobile Application",
    comment: "แอปล่มช่วงสิ้นเดือน โอนเงินไม่ผ่านแต่ยอดถูกตัดหาย ไม่มีการแจ้งเตือน",
    sentiment: "negative",
    severity_label: "severe",
    severity_score: 0.90,
    attachments: []
  },
  {
    id: "C-005",
    date: "2025-08-09",
    region: "ภาคใต้",
    area: "ภูเก็ตเมือง",
    branch: "สาขาถลาง",
    branch_code: "HKT-02",
    service_type: "โอนเงินต่างธนาคาร",
    category: "ระบบและกระบวนการให้บริการ",
    sub_category: "ระยะเวลาการให้บริการ",
    comment: "รอคิวเกิน 2 ชั่วโมงโดยไม่มีระบบจัดคิว แจ้งเจ้าหน้าที่แล้วไม่ช่วยเหลือ",
    sentiment: "negative",
    severity_label: "severe",
    severity_score: 0.86,
    attachments: []
  },
  {
    id: "C-006",
    date: "2025-08-08",
    region: "ภาคตะวันออก",
    area: "ชลบุรีชายฝั่ง",
    branch: "สาขาศรีราชา",
    branch_code: "CBI-03",
    service_type: "ธุรกรรมต่างประเทศ",
    category: "ระบบและกระบวนการให้บริการ",
    sub_category: "ความถูกต้องของข้อมูล",
    comment: "โอนไปต่างประเทศผิดบัญชีจากการกรอกข้อมูลที่สาขา ลูกค้าเสียหายจำนวนมาก",
    sentiment: "negative",
    severity_label: "severe",
    severity_score: 0.94,
    attachments: []
  },
  {
    id: "C-007",
    date: "2025-08-07",
    region: "ภาคกลาง",
    area: "นนทบุรี",
    branch: "สาขาแจ้งวัฒนะ",
    branch_code: "NBT-01",
    service_type: "บริการสินเชื่อบ้าน",
    category: "พนักงานและบุคลากร",
    sub_category: "เอาใจใส่ลูกค้า",
    comment: "ปฏิเสธให้ข้อมูลสำคัญเกี่ยวกับดอกเบี้ย ทำให้ตัดสินใจผิดพลาด เสียค่าปรับสูง",
    sentiment: "negative",
    severity_label: "severe",
    severity_score: 0.88,
    attachments: []
  },
  {
    id: "C-008",
    date: "2025-08-06",
    region: "ภาคใต้",
    area: "หาดใหญ่",
    branch: "สาขาหาดใหญ่ใน",
    branch_code: "HDY-01",
    service_type: "ธุรกรรมเงินฝาก",
    category: "สภาพแวดล้อมและสิ่งอำนวยความสะดวก",
    sub_category: "ความสะอาด",
    comment: "ห้องน้ำสาขาไม่สะอาดอย่างมาก มีน้ำรั่วและกลิ่นแรง ส่งผลต่อสุขภาพผู้ใช้บริการ",
    sentiment: "negative",
    severity_label: "severe",
    severity_score: 0.83,
    attachments: []
  },
  {
    id: "C-009",
    date: "2025-08-06",
    region: "ภาคเหนือ",
    area: "เชียงรายเมือง",
    branch: "สาขาแม่สาย",
    branch_code: "CRI-02",
    service_type: "เคาน์เตอร์สาขา",
    category: "ระบบและกระบวนการให้บริการ",
    sub_category: "การจัดคิว/ระบบคิว",
    comment: "มีการแซงคิวหลายครั้ง เจ้าหน้าที่ไม่จัดการ ทำให้เกิดการโต้เถียงรุนแรง",
    sentiment: "negative",
    severity_label: "severe",
    severity_score: 0.84,
    attachments: []
  },
  {
    id: "C-010",
    date: "2025-08-05",
    region: "ภาคตะวันออกเฉียงเหนือ",
    area: "อุดรธานี",
    branch: "สาขา UD Town",
    branch_code: "UDN-01",
    service_type: "เปิดบัญชีใหม่",
    category: "เอกสารและข้อมูล",
    sub_category: "ข้อมูลส่วนบุคคล",
    comment: "ขอสำเนาบัตรประชาชนเกินความจำเป็นและเก็บรักษาไม่ปลอดภัย",
    sentiment: "negative",
    severity_label: "severe",
    severity_score: 0.91,
    attachments: []
  },
  {
    id: "C-011",
    date: "2025-08-04",
    region: "ภาคตะวันตก",
    area: "กาญจนบุรี",
    branch: "สาขาเมืองกาญจน์",
    branch_code: "KRI-01",
    service_type: "ตู้นับเหรียญ/ฝากเหรียญ",
    category: "เทคโนโลยีและดิจิทัล",
    sub_category: "เครื่องรับฝากเงิน (CDM)",
    comment: "เครื่องขัดข้อง นับเงินผิดจำนวน สูญหายและเคลมยาก",
    sentiment: "negative",
    severity_label: "severe",
    severity_score: 0.85,
    attachments: []
  },
  {
    id: "C-012",
    date: "2025-08-03",
    region: "ภาคกลาง",
    area: "ปทุมธานี",
    branch: "สาขารังสิต",
    branch_code: "PTM-01",
    service_type: "โมบายแอป",
    category: "ความปลอดภัย",
    sub_category: "ความเสี่ยงทุจริต/ฟิชชิง",
    comment: "ได้รับ SMS หลอกลวงจากชื่อธนาคาร ลิงก์พาไปกรอกข้อมูล แอปไม่มีเตือนความปลอดภัย",
    sentiment: "negative",
    severity_label: "severe",
    severity_score: 0.93,
    attachments: []
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
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};