
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
  province: string;
  district: string;
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
    region: "ภาค 1",
    province: "กรุงเทพฯ",
    district: "บางเขน",
    branch: "ประชาชื่น",
    service_type: 'เปิดบัญชี',
    timestamp: '2024-07-01 09:30',
    raw_comment: 'พนักงานให้บริการดีมาก สุภาพและรวดเร็ว',
    subcategory: '1.1 ความสุภาพและมารยาทของพนักงาน',
    sentiment: 'positive',
    severity: 'normal'
  },
  {
    id: '2',
    region: "ภาค 5",
    province: "กาญจนบุรี",
    district: "กาญจนบุรี",
    branch: "กาญจนบุรี",
    service_type: 'สมัครแอป',
    timestamp: '2024-07-01 15:50',
    raw_comment: 'เข้าแอป MyMo ไม่ได้ และไม่มีใครให้คำตอบที่ชัดเจน',
    subcategory: '3.5 แอพพลิเคชั่น MyMo',
    sentiment: 'negative',
    severity: 'high'
  },
  {
    id: '3',
    region: "ภาค 10",
    province: "นครพนม",
    district: "นครพนม",
    branch: "นครพนม",
    service_type: 'ถอนเงิน',
    timestamp: '2024-07-01 13:20',
    raw_comment: 'พนักงานดี แต่เครื่องนับเงินเสีย รอคิวนาน',
    subcategory: '3.7 เครื่องนับเงิน',
    sentiment: 'negative',
    severity: 'normal'
  },
  {
    id: '4',
    region: "ภาค 2",
    province: "ชลบุรี",
    district: "พัทยา",
    branch: "พัทยาใต้",
    service_type: 'โอนเงิน',
    timestamp: '2024-07-02 10:15',
    raw_comment: 'ระบบโอนเงินล่ม ต้องรอนานมาก พนักงานก็ช่วยไม่ได้',
    subcategory: '3.1 ระบบคอมพิวเตอร์',
    sentiment: 'negative',
    severity: 'high'
  },
  {
    id: '5',
    region: "ภาค 3",
    province: "นครราชสีมา",
    district: "เมืองนครราชสีมา",
    branch: "โคราช",
    service_type: 'ฝากเงิน',
    timestamp: '2024-07-02 14:30',
    raw_comment: 'บริการเยี่ยม รวดเร็ว พนักงานใจดี อธิบายละเอียด',
    subcategory: '1.1 ความสุภาพและมารยาทของพนักงาน',
    sentiment: 'positive',
    severity: 'normal'
  },
  {
    id: '6',
    region: "ภาค 4",
    province: "สงขลา",
    district: "หาดใหญ่",
    branch: "หาดใหญ่",
    service_type: 'สินเชื่อ',
    timestamp: '2024-07-02 11:45',
    raw_comment: 'รอคิวสินเชื่อ 3 ชั่วโมง พนักงานไม่ค่อยตอบคำถาม',
    subcategory: '2.1 ระยะเวลาการรอคิว',
    sentiment: 'negative',
    severity: 'normal'
  },
  {
    id: '7',
    region: "ภาค 6",
    province: "เชียงใหม่",
    district: "เมืองเชียงใหม่",
    branch: "เชียงใหม่",
    service_type: 'ปิดบัญชี',
    timestamp: '2024-07-03 09:00',
    raw_comment: 'พนักงานให้คำแนะนำดี ทำรายการเสร็จไว ประทับใจ',
    subcategory: '1.2 ความรู้และความเข้าใจในผลิตภัณฑ์',
    sentiment: 'positive',
    severity: 'normal'
  },
  {
    id: '8',
    region: "ภาค 7",
    province: "ภูเก็ต",
    district: "เมืองภูเก็ต",
    branch: "ภูเก็ต",
    service_type: 'แลกเงินตรา',
    timestamp: '2024-07-03 16:20',
    raw_comment: 'อัตราแลกเปลี่ยนไม่ดี เสียเปรียบธนาคารอื่น',
    subcategory: '4.1 อัตราดอกเบี้ย/อัตราแลกเปลี่ยน',
    sentiment: 'negative',
    severity: 'normal'
  },
  {
    id: '9',
    region: "ภาค 8",
    province: "สุราษฎร์ธานี",
    district: "เกาะสมุย",
    branch: "เกาะสมุย",
    service_type: 'เปิดบัญชี',
    timestamp: '2024-07-03 12:10',
    raw_comment: 'เอกสารไม่ครบ แต่พนักงานช่วยแก้ไขได้ ขอบคุณมาก',
    subcategory: '1.3 การแก้ไขปัญหา',
    sentiment: 'positive',
    severity: 'normal'
  },
  {
    id: '10',
    region: "ภาค 9",
    province: "ยะลา",
    district: "เมืองยะลา",
    branch: "ยะลา",
    service_type: 'ถอนเงิน',
    timestamp: '2024-07-04 08:45',
    raw_comment: 'ATM หมด แต่พนักงานไม่บอก รอเปล่าๆ นานมาก',
    subcategory: '3.2 เครื่อง ATM',
    sentiment: 'negative',
    severity: 'normal'
  },
  {
    id: '11',
    region: "ภาค 1",
    province: "กรุงเทพฯ",
    district: "สาทร",
    branch: "สีลม",
    service_type: 'สมัครแอป',
    timestamp: '2024-07-04 14:25',
    raw_comment: 'พนักงานช่วยติดตั้งแอป MyMo ให้ พอใจมาก',
    subcategory: '3.5 แอพพลิเคชั่น MyMo',
    sentiment: 'positive',
    severity: 'normal'
  },
  {
    id: '12',
    region: "ภาค 2",
    province: "ระยอง",
    district: "เมืองระยอง",
    branch: "ระยอง",
    service_type: 'โอนเงิน',
    timestamp: '2024-07-04 11:30',
    raw_comment: 'ค่าธรรมเนียมแพงไป แอปทำงานช้า',
    subcategory: '4.2 ค่าธรรมเนียม',
    sentiment: 'negative',
    severity: 'normal'
  },
  {
    id: '13',
    region: "ภาค 3",
    province: "ขอนแก่น",
    district: "เมืองขอนแก่น",
    branch: "ขอนแก่น",
    service_type: 'สินเชื่อ',
    timestamp: '2024-07-05 10:00',
    raw_comment: 'พนักงานอธิบายข้อมูลสินเชื่อชัดเจน ดีมาก',
    subcategory: '1.2 ความรู้และความเข้าใจในผลิตภัณฑ์',
    sentiment: 'positive',
    severity: 'normal'
  },
  {
    id: '14',
    region: "ภาค 4",
    province: "สุรินต์",
    district: "เมืองสุรินต์",
    branch: "สุรินต์",
    service_type: 'ฝากเงิน',
    timestamp: '2024-07-05 13:15',
    raw_comment: 'เครื่องฝากเงินขัดข้อง พนักงานไม่ช่วยแก้ไข',
    subcategory: '3.6 เครื่องฝาก-ถอนอัตโนมัติ',
    sentiment: 'negative',
    severity: 'high'
  },
  {
    id: '15',
    region: "ภาค 5",
    province: "กาญจนบุรี",
    district: "ท่าม่วง",
    branch: "ท่าม่วง",
    service_type: 'แลกเงินตรา',
    timestamp: '2024-07-05 15:40',
    raw_comment: 'บริการดี แลกเงินได้รวดเร็ว พนักงานสุภาพ',
    subcategory: '1.1 ความสุภาพและมารยาทของพนักงาน',
    sentiment: 'positive',
    severity: 'normal'
  },
  {
    id: '16',
    region: "ภาค 6",
    province: "เชียงราย",
    district: "เมืองเชียงราย",
    branch: "เชียงราย",
    service_type: 'ปิดบัญชี',
    timestamp: '2024-07-06 09:20',
    raw_comment: 'ใช้เวลานาน เอกสารเยอะไป ขั้นตอนซับซ้อน',
    subcategory: '2.2 ขั้นตอนการให้บริการ',
    sentiment: 'negative',
    severity: 'normal'
  },
  {
    id: '17',
    region: "ภาค 7",
    province: "ชุมพร",
    district: "เมืองชุมพร",
    branch: "ชุมพร",
    service_type: 'เปิดบัญชี',
    timestamp: '2024-07-06 11:50',
    raw_comment: 'พนักงานใหม่ ดูไม่มีประสบการณ์ ทำผิดหลายอย่าง',
    subcategory: '1.4 ความสามารถของพนักงาน',
    sentiment: 'negative',
    severity: 'normal'
  },
  {
    id: '18',
    region: "ภาค 8",
    province: "นครศรีธรรมราช",
    district: "เมืองนครศรีธรรมราช",
    branch: "นครศรีธรรมราช",
    service_type: 'ถอนเงิน',
    timestamp: '2024-07-06 14:05',
    raw_comment: 'ระบบล่มตลอด รอแล้วไม่ได้ เสียเวลามาก',
    subcategory: '3.1 ระบบคอมพิวเตอร์',
    sentiment: 'negative',
    severity: 'high'
  },
  {
    id: '19',
    region: "ภาค 9",
    province: "ปัตตานี",
    district: "เมืองปัตตานี",
    branch: "ปัตตานี",
    service_type: 'สมัครแอป',
    timestamp: '2024-07-07 10:30',
    raw_comment: 'แอปใช้งานง่าย พนักงานสอนใช้ให้ดี',
    subcategory: '3.5 แอพพลิเคชั่น MyMo',
    sentiment: 'positive',
    severity: 'normal'
  },
  {
    id: '20',
    region: "ภาค 10",
    province: "อุดรธานี",
    district: "เมืองอุดรธานี",
    branch: "อุดรธานี",
    service_type: 'โอนเงิน',
    timestamp: '2024-07-07 16:10',
    raw_comment: 'สาขาสะอาด พนักงานเยอะ บริการรวดเร็ว ประทับใจ',
    subcategory: '5.1 สิ่งแวดล้อมในสาขา',
    sentiment: 'positive',
    severity: 'normal'
  },
  {
    id: '21',
    region: "ภาค 1",
    province: "กรุงเทพฯ",
    district: "ลาดพร้าว",
    branch: "ลาดพร้าว",
    service_type: 'สินเชื่อ',
    timestamp: '2024-07-08 08:15',
    raw_comment: 'อนุมัติสินเชื่อนาน เอกสารส่งแล้วไม่มีใครติดตาม',
    subcategory: '2.3 การติดตามงาน',
    sentiment: 'negative',
    severity: 'high'
  },
  {
    id: '22',
    region: "ภาค 2",
    province: "สระแก้ว",
    district: "เมืองสระแก้ว",
    branch: "สระแก้ว",
    service_type: 'ฝากเงิน',
    timestamp: '2024-07-08 12:45',
    raw_comment: 'พนักงานช่วยเหลือดี อธิบายสินค้าใหม่ให้ฟัง',
    subcategory: '1.2 ความรู้และความเข้าใจในผลิตภัณฑ์',
    sentiment: 'positive',
    severity: 'normal'
  },
  {
    id: '23',
    region: "ภาค 3",
    province: "บุรีรัมย์",
    district: "เมืองบุรีรัมย์",
    branch: "บุรีรัมย์",
    service_type: 'แลกเงินตรา',
    timestamp: '2024-07-08 15:20',
    raw_comment: 'ไม่มีเงินตราที่ต้องการ บอกให้กลับมาใหม่',
    subcategory: '5.2 ความพร้อมของสินค้าและบริการ',
    sentiment: 'negative',
    severity: 'normal'
  },
  {
    id: '24',
    region: "ภาค 4",
    province: "ตรัง",
    district: "เมืองตรัง",
    branch: "ตรัง",
    service_type: 'ปิดบัญชี',
    timestamp: '2024-07-09 09:30',
    raw_comment: 'ที่จอดรถไม่พอ ต้องจอดไกลแล้วเดิน',
    subcategory: '5.3 สิ่งอำนวยความสะดวก',
    sentiment: 'negative',
    severity: 'normal'
  },
  {
    id: '25',
    region: "ภาค 5",
    province: "ราชบุรี",
    district: "เมืองราชบุรี",
    branch: "ราชบุรี",
    service_type: 'เปิดบัญชี',
    timestamp: '2024-07-09 13:00',
    raw_comment: 'บริการดีเยี่ยม ได้ของแถมด้วย พนักงานยิ้มแย้ม',
    subcategory: '1.1 ความสุภาพและมารยาทของพนักงาน',
    sentiment: 'positive',
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
        .map(f => f.district)
    )).sort();
  }, [selectedRegion]);

  const branches = useMemo(() => {
    if (selectedArea === 'all') return [];
    return Array.from(new Set(
      mockFeedbackData
        .filter(f => f.region === selectedRegion && f.district === selectedArea)
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
      if (selectedArea !== 'all' && feedback.district !== selectedArea) return false;
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
          {/* Other Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">ประเภทการให้บริการ</label>
              <div className="border rounded-md p-3 max-h-40 overflow-y-auto bg-background">
                <div className="space-y-2">
                  {serviceTypes.map(type => (
                    <div key={type} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`service-${type}`}
                        checked={selectedServiceTypes.includes(type)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedServiceTypes(prev => [...prev, type]);
                          } else {
                            setSelectedServiceTypes(prev => prev.filter(t => t !== type));
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label
                        htmlFor={`service-${type}`}
                        className="text-sm text-foreground cursor-pointer flex-1"
                      >
                        {type}
                      </label>
                    </div>
                  ))}
                </div>
                {selectedServiceTypes.length > 0 && (
                  <div className="mt-2 pt-2 border-t">
                    <button
                      onClick={() => setSelectedServiceTypes([])}
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      ล้างทั้งหมด
                    </button>
                  </div>
                )}
              </div>
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
                    <span><strong>ภาค / เขต / สาขา:</strong> {feedback.region} / {feedback.district} / {feedback.branch}</span>
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
