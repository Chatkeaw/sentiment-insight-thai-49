// src/pages/ComplaintsPage.tsx
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import TimeFilter from '@/components/TimeFilter';
import { TimeFilter as TimeFilterType } from '@/types/dashboard';
import { mockFeedbackData } from '@/data/mockData';
import { FeedbackEntry } from '@/types/dashboard';
import { Search, Calendar, RotateCw } from 'lucide-react';

/* ---------- style helpers (UI เท่านั้น) ---------- */
const sectionBox =
  "rounded-2xl border border-pink-100 bg-pink-50/20 p-4 md:p-5";
const selectTrigger =
  "h-11 pl-9 rounded-lg border-pink-200 focus:ring-2 focus:ring-pink-200/60";
const dateInput =
  "h-11 w-full rounded-lg border border-pink-200 bg-white px-9 text-sm placeholder:text-muted-foreground focus:ring-2 focus:ring-pink-200/60 focus:border-pink-300";

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

/** map คีย์เดิม -> รหัส 1.x–5.x (ใช้กรณียังไม่ได้เพิ่ม commentTags ใน mockData) */
const LEGACY_KEY_TO_CODE: Record<string, string> = {
  // staff
  staffPoliteness: '1.1',
  staffCare: '1.2',
  staffConsultation: '1.3',
  staffAccuracy: '1.4',
  staffSpeed: '1.5',
  staffProfessionalism: '1.6',
  staffImpression: '1.7',
  staffSecurity: '1.8',
  // service
  serviceReadiness: '2.1',
  serviceProcess: '2.2',
  serviceQueue: '2.3',
  serviceDocuments: '2.4',
  // tech
  techCore: '3.1',
  techQueue: '3.2',
  techATM: '3.3',
  techKYC: '3.4',
  techApp: '3.5',
  techBookUpdate: '3.6',
  techCashCounter: '3.7',
  // products
  productDetails: '4.1',
  productConditions: '4.2',
  productApprovalTime: '4.3',
  productFlexibility: '4.4',
  productSimplicity: '4.5',
  // environment
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

/** ใช้กรองด้วย prefix 1.–5. ตามหมวดหลักในดรอปดาวน์ */
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

/** ดึงแท็ก 1.x–5.x จาก feedback: ใช้ commentTags ถ้ามี; มิฉะนั้น map จาก detailedSentiment ที่เป็น -1 */
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
  // unique
  return Array.from(new Set(codes));
}

interface ComplaintsPageProps {
  timeFilter: TimeFilterType['value'];
  onTimeFilterChange: (value: TimeFilterType['value']) => void;
}

export const ComplaintsPage: React.FC<ComplaintsPageProps> = ({
  timeFilter,
  onTimeFilterChange
}) => {
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [selectedMainCategory, setSelectedMainCategory] = useState<string>('all');
  const [selectedServiceType, setSelectedServiceType] = useState<string>('ทั้งหมด');

  // วันที่ (UI เท่านั้น)
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const clearFilters = () => {
    setSelectedRegion('all');
    setSelectedDistrict('all');
    setSelectedBranch('all');
    setSelectedMainCategory('all');
    setSelectedServiceType('ทั้งหมด');
    setStartDate('');
    setEndDate('');
  };

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

  /** กรองข้อมูลด้วย prefix 1.–5. จากแท็ก */
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

      {/* Filters – UI แบบอ้างอิง */}
      <Card className="border-pink-200/60 shadow-[0_0_0_1px_rgba(244,114,182,.08),0_6px_20px_rgba(244,114,182,.06)]">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">ตัวกรองการแสดงผล</CardTitle>
            <div className="flex gap-2">
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-2 rounded-md border border-pink-200 bg-white px-3 py-2 text-sm text-pink-700 hover:bg-pink-50"
              >
                <RotateCw className="h-4 w-4" />
                ล้างตัวกรอง
              </button>
              <button
                className="rounded-md bg-pink-600 px-4 py-2 text-sm font-medium text-white hover:bg-pink-700"
              >
                ค้นหา
              </button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* พื้นที่ให้บริการ */}
          <div className={sectionBox}>
            <div className="mb-2 text-sm font-medium text-foreground">พื้นที่ให้บริการ</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* ภาค */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Select
                  value={selectedRegion}
                  onValueChange={(value) => {
                    setSelectedRegion(value);
                    setSelectedDistrict('all');
                    setSelectedBranch('all');
                  }}>
                  <SelectTrigger className={selectTrigger}>
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
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Select
                  value={selectedDistrict}
                  onValueChange={(value) => {
                    setSelectedDistrict(value);
                    setSelectedBranch('all');
                  }}>
                  <SelectTrigger className={selectTrigger}>
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
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                  <SelectTrigger className={selectTrigger}>
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
          </div>

          {/* ช่วงเวลา + ประเภทบริการ + หมวดหมู่ */}
          <div className={sectionBox}>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* ประเภทบริการ */}
              <div className="md:col-span-4">
                <div className="mb-1 text-sm font-medium">ประเภทการให้บริการ</div>
                <Select value={selectedServiceType} onValueChange={setSelectedServiceType}>
                  <SelectTrigger className="h-11 rounded-lg border-pink-200 focus:ring-2 focus:ring-pink-200/60">
                    <SelectValue placeholder="เลือกประเภทบริการ" />
                  </SelectTrigger>
                  <SelectContent>
                    {['ทั้งหมด','การฝากเงิน/ถอนเงิน','การซื้อผลิตภัณฑ์','การชำระค่าบริการ/ค่าธรรมเนียม','อื่นๆ'].map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* ตั้งแต่ */}
              <div className="md:col-span-4 relative">
                <div className="mb-1 text-sm font-medium">ตั้งแต่</div>
                <Calendar className="absolute left-3 top-[42px] h-4 w-4 text-muted-foreground" />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className={dateInput}
                />
              </div>

              {/* ถึง */}
              <div className="md:col-span-4 relative">
                <div className="mb-1 text-sm font-medium">ถึง</div>
                <Calendar className="absolute left-3 top-[42px] h-4 w-4 text-muted-foreground" />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className={dateInput}
                />
              </div>

              {/* หมวดหมู่ */}
              <div className="md:col-span-4">
                <div className="mb-1 text-sm font-medium">หมวดหมู่</div>
                <Select value={selectedMainCategory} onValueChange={setSelectedMainCategory}>
                  <SelectTrigger className="h-11 rounded-lg border-pink-200 focus:ring-2 focus:ring-pink-200/60">
                    <SelectValue placeholder="เลือกหมวดหมู่" />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      { value: 'all', label: 'ทั้งหมด' },
                      { value: 'staff', label: 'พนักงานและบุคลากร' },
                      { value: 'service', label: 'ระบบและกระบวนการให้บริการ' },
                      { value: 'technology', label: 'เทคโนโลยีและดิจิทัล' },
                      { value: 'products', label: 'เงื่อนไขและผลิตภัณฑ์' },
                      { value: 'environment', label: 'สภาพแวดล้อมและสิ่งอำนวยความสะดวก' },
                      { value: 'marketConduct', label: 'การปฏิบัติตลาด' },
                      { value: 'other', label: 'อื่นๆ' },
                    ].map(category => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* List */}
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
