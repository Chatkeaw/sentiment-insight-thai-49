import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { CalendarIcon, Search } from 'lucide-react';
import { DateRange } from 'react-day-picker';

interface FeedbackEntry {
  id: string;
  region: string;
  area: string;
  branch: string;
  service_type: string;
  timestamp: string;
  raw_comment: string;
  subcategory: string;
  sentiment: 'positive' | 'negative';
  severity: 'normal' | 'high';
}

const mockFeedbackData: FeedbackEntry[] = [
  {
    id: '1',
    region: 'ภาคกลาง',
    area: 'กรุงเทพฯ',
    branch: 'บางเขน',
    service_type: 'เปิดบัญชี',
    timestamp: '2024-07-01 09:30',
    raw_comment: 'พนักงานให้บริการดีมาก สุภาพและรวดเร็ว',
    subcategory: '1.1 ความสุภาพและมารยาทของพนักงาน',
    sentiment: 'positive',
    severity: 'normal'
  },
  {
    id: '2',
    region: 'ภาคตะวันออกเฉียงเหนือ',
    area: 'ขอนแก่น',
    branch: 'เมืองขอนแก่น',
    service_type: 'สมัครแอป',
    timestamp: '2024-07-01 15:50',
    raw_comment: 'เข้าแอป MyMo ไม่ได้ และไม่มีใครให้คำตอบที่ชัดเจน',
    subcategory: '3.5 แอพพลิเคชั่น MyMo',
    sentiment: 'negative',
    severity: 'high'
  },
  {
    id: '3',
    region: 'ภาคใต้',
    area: 'สงขลา',
    branch: 'หาดใหญ่',
    service_type: 'ถอนเงิน',
    timestamp: '2024-07-01 13:20',
    raw_comment: 'พนักงานดี แต่เครื่องนับเงินเสีย รอคิวนาน',
    subcategory: '3.7 เครื่องนับเงิน',
    sentiment: 'negative',
    severity: 'normal'
  }
];

interface CustomerFeedbackSystemProps {
  className?: string;
}

export const CustomerFeedbackSystem: React.FC<CustomerFeedbackSystemProps> = ({ className }) => {
  // Filter states
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedArea, setSelectedArea] = useState<string>('all');
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [timeType, setTimeType] = useState<'monthly' | 'retrospective' | 'custom'>('monthly');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [serviceType, setServiceType] = useState<string>('all');
  const [sentiment, setSentiment] = useState<'positive' | 'negative' | 'all'>('all');
  const [subcategory, setSubcategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Cascading filter options
  const regions = useMemo(() => {
    return Array.from(new Set(mockFeedbackData.map(f => f.region))).sort();
  }, []);

  const areas = useMemo(() => {
    if (selectedRegion === 'all') return [];
    return Array.from(new Set(
      mockFeedbackData
        .filter(f => f.region === selectedRegion)
        .map(f => f.area)
    )).sort();
  }, [selectedRegion]);

  const branches = useMemo(() => {
    if (selectedArea === 'all') return [];
    return Array.from(new Set(
      mockFeedbackData
        .filter(f => f.region === selectedRegion && f.area === selectedArea)
        .map(f => f.branch)
    )).sort();
  }, [selectedRegion, selectedArea]);

  const serviceTypes = ['เปิดบัญชี', 'ถอนเงิน', 'ฝากเงิน', 'สินเชื่อ', 'สมัครแอป', 'บัตร ATM'];
  const subcategories = [
    '1.1 ความสุภาพและมารยาทของพนักงาน',
    '1.2 ความเอาใจใส่ในการให้บริการลูกค้า',
    '1.3 ความสามารถในการตอบคำถามหรือให้คำแนะนำ',
    '1.4 ความถูกต้องในการให้บริการ',
    '1.5 ความรวดเร็วในการให้บริการ',
    '1.6 ความเป็นมืออาชีพและการแก้ไขปัญหาเฉพาะหน้า',
    '1.7 ความประทับใจในการให้บริการ',
    '1.8 รปภ, แม่บ้าน',
    '2.1 ความพร้อมในการให้บริการ',
    '2.2 กระบวนการให้บริการ ความเป็นธรรมให้บริการ',
    '2.3 ระบบเรียกคิวและจัดการคิว',
    '2.4 ภาระเอกสาร',
    '3.1 ระบบ Core ของธนาคาร',
    '3.2 เครื่องออกบัตรคิว',
    '3.3 ATM ADM CDM',
    '3.4 E-KYC Scanner',
    '3.5 แอพพลิเคชั่น MyMo',
    '3.6 เครื่องปรับสมุด',
    '3.7 เครื่องนับเงิน',
    '4.1 รายละเอียด ผลิตภัณฑ์',
    '4.2 เงื่อนไขอนุมัติ',
    '4.3 ระยะเวลาอนุมัติ',
    '4.4 ความยืดหยุ่น',
    '4.5 ความเรียบง่ายข้อมูล',
    '5.1 ความสะอาด',
    '5.2 พื้นที่และความคับคั่ง',
    '5.3 อุณหภูมิ',
    '5.4 โต๊ะรับบริการ',
    '5.5 จุดรอรับบริการ',
    '5.6 แสง',
    '5.7 เสียง',
    '5.8 ห้องน้ำ',
    '5.9 ที่จอดรถ',
    '5.10 ป้าย-สื่อประชาสัมพันธ์',
    '5.11 สิ่งอำนวยความสะดวกอื่นๆ'
  ];

  // Filtered feedback data
  const filteredFeedback = useMemo(() => {
    return mockFeedbackData.filter(feedback => {
      if (selectedRegion !== 'all' && feedback.region !== selectedRegion) return false;
      if (selectedArea !== 'all' && feedback.area !== selectedArea) return false;
      if (selectedBranch !== 'all' && feedback.branch !== selectedBranch) return false;
      if (serviceType !== 'all' && feedback.service_type !== serviceType) return false;
      if (sentiment !== 'all' && feedback.sentiment !== sentiment) return false;
      if (subcategory !== 'all' && feedback.subcategory !== subcategory) return false;
      if (searchTerm && !feedback.raw_comment.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      
      return true;
    });
  }, [selectedRegion, selectedArea, selectedBranch, serviceType, sentiment, subcategory, searchTerm]);

  // Get background color based on sentiment
  const getBackgroundColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-50 border-green-200';
      case 'negative':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedRegion('all');
    setSelectedArea('all');
    setSelectedBranch('all');
    setTimeType('monthly');
    setDateRange(undefined);
    setServiceType('all');
    setSentiment('all');
    setSubcategory('all');
    setSearchTerm('');
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-foreground">Customer Feedback Insights</h1>
        <Button onClick={clearFilters} variant="outline" size="sm">
          ล้างตัวกรอง
        </Button>
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

          {/* Time Filters */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-foreground">ช่วงเวลา</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">ประเภทเวลา</label>
                <Select value={timeType} onValueChange={(value: 'monthly' | 'retrospective' | 'custom') => setTimeType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background">
                    <SelectItem value="monthly">รายเดือน</SelectItem>
                    <SelectItem value="retrospective">เวลาย้อนหลัง</SelectItem>
                    <SelectItem value="custom">กำหนดเอง</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {timeType === 'custom' && (
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs text-muted-foreground">ช่วงเวลา (กำหนดเอง)</label>
                  <DatePickerWithRange date={dateRange} setDate={setDateRange} />
                </div>
              )}
            </div>
          </div>

          {/* Other Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">ประเภทการให้บริการ</label>
              <Select value={serviceType} onValueChange={setServiceType}>
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

            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">ความรู้สึก</label>
              <Select value={sentiment} onValueChange={(value: 'positive' | 'negative' | 'all') => setSentiment(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="เลือกความรู้สึก" />
                </SelectTrigger>
                <SelectContent className="bg-background">
                    <SelectItem value="all">ทั้งหมด</SelectItem>
                  <SelectItem value="positive">เชิงบวก</SelectItem>
                  <SelectItem value="negative">เชิงลบ</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">หมวดหมู่ย่อยที่ถูกกล่าวถึง</label>
              <Select value={subcategory} onValueChange={setSubcategory}>
                <SelectTrigger>
                  <SelectValue placeholder="เลือกหมวดหมู่ย่อย" />
                </SelectTrigger>
                <SelectContent className="bg-background max-h-60 overflow-y-auto">
                  <SelectItem value="all">ทั้งหมด</SelectItem>
                  {subcategories.map(subcat => (
                    <SelectItem key={subcat} value={subcat}>{subcat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Search */}
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">ค้นหาในข้อความ</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="ค้นหาความคิดเห็น..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feedback List */}
      <Card>
        <CardHeader>
          <CardTitle>ความคิดเห็นลูกค้า ({filteredFeedback.length} รายการ)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {filteredFeedback.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                ไม่พบข้อมูลความคิดเห็นที่ตรงกับเงื่อนไขการกรอง
              </div>
            ) : (
              filteredFeedback.map((feedback) => (
                <div
                  key={feedback.id}
                  className={`p-4 rounded-lg border transition-colors ${getBackgroundColor(feedback.sentiment)}`}
                >
                  {/* Header Info */}
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                    <span><strong>ภาค / เขต / สาขา:</strong> {feedback.region} / {feedback.area} / {feedback.branch}</span>
                    <span><strong>ประเภทบริการ:</strong> {feedback.service_type}</span>
                    <span><strong>วันที่ - เวลา:</strong> {feedback.timestamp}</span>
                    <span><strong>หมวดหมู่ย่อย:</strong> {feedback.subcategory}</span>
                  </div>

                  {/* Comment */}
                  <div className="mb-3">
                    <p className="text-foreground leading-relaxed">{feedback.raw_comment}</p>
                  </div>

                  {/* Tags */}
                  <div className="flex gap-2">
                    <Badge 
                      variant={feedback.sentiment === 'positive' ? 'default' : 'destructive'}
                    >
                      {feedback.sentiment === 'positive' ? 'เชิงบวก' : 'เชิงลบ'}
                    </Badge>
                    {feedback.severity === 'high' && (
                      <Badge variant="destructive">
                        ⚠️ ความคิดเห็นรุนแรง
                      </Badge>
                    )}
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
