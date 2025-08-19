// src/pages/ComplaintsPage.tsx
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RotateCcw, Search as SearchIcon, Calendar } from 'lucide-react';
import TimeFilter from '@/components/TimeFilter';
import { TimeFilter as TimeFilterType } from '@/types/dashboard';
import { mockFeedbackData } from '@/data/mockData';
import { FeedbackEntry } from '@/types/dashboard';

interface ComplaintsPageProps {
  timeFilter: TimeFilterType['value'];
  onTimeFilterChange: (value: TimeFilterType['value']) => void;
}

/** labels ของรหัสย่อย 1.x–5.x */
const COMMENT_TAG_LABELS: Record<string, string> = {
  '1.1': 'ความสุภาพและมารยาทของพนักงาน',
  '1.2': 'ความเอาใจใส่ในการให้บริการลูกค้า',
  '1.3': 'ความสามารถในการตอบคำถามหรือให้คำแนะนำ',
  '1.4': 'ความถูกต้องในการให้บริการ',
  '1.5': 'ความรวดเร็วในการให้บริการ',
  '1.6': 'ความเป็นมืออาชีพและการแก้ไขปัญหาเฉพาะหน้า',
  '1.7': 'ความประทับใจในการให้บริการ',
  '1.8': 'รปภ, แม่บ้าน',
  '2.1': 'ความพร้อมในการให้บริการ',
  '2.2': 'กระบวนการ/ความเป็นธรรมในการให้บริการ',
  '2.3': 'ระบบเรียกคิวและจัดการคิว',
  '2.4': 'ภาระเอกสาร',
  '3.1': 'ระบบ Core ของธนาคาร',
  '3.2': 'เครื่องออกบัตรคิว',
  '3.3': 'ATM / ADM / CDM',
  '3.4': 'E-KYC / Scanner',
  '3.5': 'แอพพลิเคชัน MyMo',
  '3.6': 'เครื่องปรับสมุด',
  '3.7': 'เครื่องนับเงิน',
  '4.1': 'รายละเอียดผลิตภัณฑ์',
  '4.2': 'เงื่อนไขอนุมัติ',
  '4.3': 'ระยะเวลาอนุมัติ',
  '4.4': 'ความยืดหยุ่น',
  '4.5': 'ความเรียบง่ายของข้อมูล',
  '5.1': 'ความสะอาด',
  '5.2': 'พื้นที่และความคับคั่ง',
  '5.3': 'อุณหภูมิ',
  '5.4': 'โต๊ะรับบริการ',
  '5.5': 'จุดรอรับบริการ',
  '5.6': 'แสง',
  '5.7': 'เสียง',
  '5.8': 'ห้องน้ำ',
  '5.9': 'ที่จอดรถ',
  '5.10': 'ป้าย-สื่อประชาสัมพันธ์',
  '5.11': 'สิ่งอำนวยความสะดวกอื่นๆ',
};

/** map คีย์เดิม -> รหัส 1.x–5.x */
const LEGACY_KEY_TO_CODE: Record<string, string> = {
  staffPoliteness: '1.1',
  staffCare: '1.2',
  staffConsultation: '1.3',
  staffAccuracy: '1.4',
  staffSpeed: '1.5',
  staffProfessionalism: '1.6',
  staffImpression: '1.7',
  staffSecurity: '1.8',
  serviceReadiness: '2.1',
  serviceProcess: '2.2',
  serviceQueue: '2.3',
  serviceDocuments: '2.4',
  techCore: '3.1',
  techQueue: '3.2',
  techATM: '3.3',
  techKYC: '3.4',
  techApp: '3.5',
  techBookUpdate: '3.6',
  techCashCounter: '3.7',
  productDetails: '4.1',
  productConditions: '4.2',
  productApprovalTime: '4.3',
  productFlexibility: '4.4',
  productSimplicity: '4.5',
  envCleanliness: '5.1',
  envSpace: '5.2',
  envTemperature: '5.3',
  envDesk: '5.4',
  envWaitingArea: '5.5',
  envLighting: '5.6',
  envSound: '5.7',
  envRestroom: '5.8',
  envParking: '5.9',
  envSignage: '5.10',
  envOtherFacilities: '5.11',
};

const MAIN_CATEGORY_PREFIX: Record<string, string | null> = {
  all: null,
  staff: '1.',
  service: '2.',
  technology: '3.',
  products: '4.',
  environment: '5.',
  marketConduct: null,
  other: null,
};

function pickTagCodes(feedback: FeedbackEntry): string[] {
  const tagsFromNew = (feedback as any).commentTags as string[] | undefined;
  if (Array.isArray(tagsFromNew) && tagsFromNew.length) return tagsFromNew;

  const detailed = (feedback as any).detailedSentiment as Record<string, number> | undefined;
  if (!detailed) return [];
  const codes: string[] = [];
  for (const [k, v] of Object.entries(detailed)) {
    if (v === -1 && LEGACY_KEY_TO_CODE[k]) {
      codes.push(LEGACY_KEY_TO_CODE[k]);
    }
  }
  return Array.from(new Set(codes));
}

export const ComplaintsPage: React.FC<ComplaintsPageProps> = ({
  timeFilter,
  onTimeFilterChange
}) => {
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [selectedMainCategory, setSelectedMainCategory] = useState<string>('all');
  const [selectedServiceType, setSelectedServiceType] = useState<string>('all');

  // ใหม่: ประเภทช่วงเวลา + ตั้งแต่/ถึง
  const [periodKind, setPeriodKind] = useState<string>('all');
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');

  const regions = useMemo(() => {
    const unique = Array.from(new Set(mockFeedbackData.map(f => f.branch.region))).sort();
    return ['all', ...unique];
  }, []);

  const districts = useMemo(() => {
    if (selectedRegion === 'all') return ['all'];
    const unique = Array.from(new Set(
      mockFeedbackData.filter(f => f.branch.region === selectedRegion).map(f => f.branch.district)
    )).sort();
    return ['all', ...unique];
  }, [selectedRegion]);

  const branches = useMemo(() => {
    if (selectedDistrict === 'all') return ['all'];
    const unique = Array.from(new Set(
      mockFeedbackData
        .filter(f =>
          (selectedRegion === 'all' || f.branch.region === selectedRegion) &&
          f.branch.district === selectedDistrict
        )
        .map(f => f.branch.branch)
    )).sort();
    return ['all', ...unique];
  }, [selectedRegion, selectedDistrict]);

  const mainCategories = [
    { value: 'all', label: 'ทั้งหมด' },
    { value: 'staff', label: 'พนักงานและบุคลากร' },
    { value: 'service', label: 'ระบบและกระบวนการให้บริการ' },
    { value: 'technology', label: 'เทคโนโลยีและดิจิทัล' },
    { value: 'products', label: 'เงื่อนไขและผลิตภัณฑ์' },
    { value: 'environment', label: 'สภาพแวดล้อมและสิ่งอำนวยความสะดวก' },
    { value: 'marketConduct', label: 'การปฏิบัติตลาด' },
    { value: 'other', label: 'อื่นๆ' }
  ];

  const serviceTypes = [
    'ทั้งหมด',
    'การฝากเงิน/ถอนเงิน',
    'การซื้อผลิตภัณฑ์',
    'การชำระค่าบริการ/ค่าธรรมเนียม',
    'อื่นๆ'
  ];

  const filteredComplaints = useMemo(() => {
    const prefix = MAIN_CATEGORY_PREFIX[selectedMainCategory] ?? null;
    return mockFeedbackData
      .filter((feedback: FeedbackEntry) => {
        if (selectedRegion !== 'all' && feedback.branch.region !== selectedRegion) return false;
        if (selectedDistrict !== 'all' && feedback.branch.district !== selectedDistrict) return false;
        if (selectedBranch !== 'all' && feedback.branch.branch !== selectedBranch) return false;

        if (selectedServiceType !== 'all' && selectedServiceType !== 'ทั้งหมด' && feedback.serviceType !== selectedServiceType) {
          return false;
        }

        if (prefix) {
          const codes = pickTagCodes(feedback);
          if (!codes.some(c => c.startsWith(prefix))) return false;
        }
        return true;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [selectedRegion, selectedDistrict, selectedBranch, selectedMainCategory, selectedServiceType]);

  const handleReset = () => {
    setSelectedRegion('all');
    setSelectedDistrict('all');
    setSelectedBranch('all');
    setSelectedMainCategory('all');
    setSelectedServiceType('all');
    setPeriodKind('all');
    setFromDate('');
    setToDate('');
  };

  const handleSearch = () => {
    // reactive อยู่แล้ว — ใส่เพื่อ flow ตาม UI
  };

  return (
    <div className="space-y-6 max-w-full">
      {/* Header */}
      <div className="flex flex-col space-y-2">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-foreground">ข้อร้องเรียนลูกค้า</h1>
          <TimeFilter value={timeFilter} onChange={onTimeFilterChange} />
        </div>
        <p className="text-muted-foreground">รายงานข้อร้องเรียนสำคัญจากลูกค้า</p>
      </div>

      {/* FILTER PANEL */}
      <Card className="bg-pink-50/70 border-pink-100">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">ตัวกรองความคิดเห็น</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleReset} className="gap-2">
                <RotateCcw className="w-4 h-4" /> ล้างตัวกรอง
              </Button>
              <Button onClick={handleSearch} className="gap-2">
                <SearchIcon className="w-4 h-4" /> ค้นหา
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* พื้นที่ให้บริการ */}
          <section className="space-y-2">
            <div className="text-sm font-medium text-foreground">พื้นที่ให้บริการ</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* ภาค */}
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">ภาค</div>
                <Select value={selectedRegion} onValueChange={(value) => {
                  setSelectedRegion(value);
                  setSelectedDistrict('all');
                  setSelectedBranch('all');
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกภาค" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">ทั้งหมด</SelectItem>
                    {regions.filter(r => r !== 'all').map(region => (
                      <SelectItem key={region} value={region}>{region}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* เขต */}
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">เขต</div>
                <Select value={selectedDistrict} onValueChange={(value) => {
                  setSelectedDistrict(value);
                  setSelectedBranch('all');
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกเขต" />
                  </SelectTrigger>
                  <SelectContent>
                    {districts.map(district => (
                      <SelectItem key={district} value={district}>
                        {district === 'all' ? 'ทั้งหมด' : district}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* สาขา */}
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">สาขา</div>
                <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกสาขา" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map(branch => (
                      <SelectItem key={branch} value={branch}>
                        {branch === 'all' ? 'ทั้งหมด' : branch}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>

          {/* ช่วงเวลาเก็บแบบประเมิน */}
          <section className="space-y-2">
            <div className="text-sm font-medium text-foreground">ช่วงเวลาเก็บแบบประเมิน</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* ประเภท */}
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">ประเภท</div>
                <Select value={periodKind} onValueChange={setPeriodKind}>
                  <SelectTrigger><SelectValue placeholder="เลือกประเภทช่วงเวลา" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">ทั้งหมด</SelectItem>
                    <SelectItem value="monthly">รายเดือน</SelectItem>
                    <SelectItem value="quarterly">ไตรมาส</SelectItem>
                    <SelectItem value="custom">กำหนดเอง</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* ตั้งแต่ */}
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">ตั้งแต่</div>
                <div className="relative">
                  <div className="absolute left-3 top-2.5 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="w-full h-10 rounded-md border border-input bg-background pl-9 pr-3 text-sm"
                  />
                </div>
              </div>

              {/* ถึง */}
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">ถึง</div>
                <div className="relative">
                  <div className="absolute left-3 top-2.5 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="w-full h-10 rounded-md border border-input bg-background pl-9 pr-3 text-sm"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* ประเภทและหมวดหมู่ */}
          <section className="space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="text-sm font-medium text-foreground">ประเภทการให้บริการ</div>
                <Select value={selectedServiceType} onValueChange={setSelectedServiceType}>
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกประเภทบริการ" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <div className="text-sm font-medium text-foreground">หมวดหมู่</div>
                <Select value={selectedMainCategory} onValueChange={setSelectedMainCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกหมวดหมู่" />
                  </SelectTrigger>
                  <SelectContent>
                    {mainCategories.map(category => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>
        </CardContent>
      </Card>

      {/* LIST */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📋 รายการข้อร้องเรียน ({filteredComplaints.length} รายการ)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {filteredComplaints.map((complaint) => {
              const codes = pickTagCodes(complaint);
              return (
                <Card key={complaint.id} className="border-l-4 border-l-destructive">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <span className="text-xl">⚠️</span>
                      <div className="flex-1">
                        <div className="flex flex-wrap gap-4 mb-2 text-sm text-muted-foreground">
                          <span>📅 {complaint.date}</span>
                          <span>🏢 {complaint.branch.branch}</span>
                          <span>🔧 {complaint.serviceType}</span>
                        </div>

                        <p className="text-foreground leading-relaxed mb-3">
                          {complaint.comment}
                        </p>

                        {codes.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-muted-foreground">หมวดหมู่ย่อย (ความคิดเห็น):</p>
                            <div className="flex flex-wrap gap-2">
                              {codes.map(code => (
                                <Badge key={code} variant="destructive" className="text-xs">
                                  {code} {COMMENT_TAG_LABELS[code] ?? ''}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {filteredComplaints.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <p className="text-lg">ไม่พบข้อร้องเรียนที่ตรงกับเงื่อนไขที่เลือก</p>
                <p className="text-sm mt-2">ลองปรับเปลี่ยนตัวกรองเพื่อดูข้อมูลเพิ่มเติม</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
