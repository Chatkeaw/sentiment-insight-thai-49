// src/pages/ComplaintsPage.tsx
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import TimeFilter from '@/components/TimeFilter';
import { TimeFilter as TimeFilterType, FeedbackEntry } from '@/types/dashboard';
import { mockFeedbackData } from '@/data/mockData';

/* -------------------- [LOCAL HELPERS – ไม่ต้องสร้างไฟล์ใหม่] -------------------- */

type SentimentFilter = 'all' | 'positive' | 'negative';

const CATEGORY_TREE: Record<
  string,
  { label: string; items: Array<{ value: string; label: string }> }
> = {
  '1': {
    label: '1. พนักงานและบุคลากร',
    items: [
      { value: '1.1', label: '1.1 ความสุภาพและมารยาทของพนักงาน' },
      { value: '1.2', label: '1.2 ความเอาใจใส่ในการให้บริการลูกค้า' },
      { value: '1.3', label: '1.3 ความสามารถในการตอบคำถามหรือให้คำแนะนำ' },
      { value: '1.4', label: '1.4 ความถูกต้องในการให้บริการ' },
      { value: '1.5', label: '1.5 ความรวดเร็วในการให้บริการ' },
      { value: '1.6', label: '1.6 ความเป็นมืออาชีพและการแก้ไขปัญหาเฉพาะหน้า' },
      { value: '1.7', label: '1.7 ความประทับใจในการให้บริการ' },
      { value: '1.8', label: '1.8 รปภ, แม่บ้าน' },
    ],
  },
  '2': {
    label: '2. ระบบและกระบวนการให้บริการ',
    items: [
      { value: '2.1', label: '2.1 ความพร้อมในการให้บริการ' },
      { value: '2.2', label: '2.2 กระบวนการให้บริการ ความเป็นธรรมให้บริการ' },
      { value: '2.3', label: '2.3 ระบบเรียกคิวและจัดการคิว' },
      { value: '2.4', label: '2.4 ภาระเอกสาร' },
    ],
  },
  '3': {
    label: '3. เทคโนโลยีและดิจิทัล',
    items: [
      { value: '3.1', label: '3.1 ระบบ Core ของธนาคาร' },
      { value: '3.2', label: '3.2 เครื่องออกบัตรคิว' },
      { value: '3.3', label: '3.3 ATM ADM CDM' },
      { value: '3.4', label: '3.4 E-KYC Scanner' },
      { value: '3.5', label: '3.5 แอพพลิเคชัน MyMo' },
      { value: '3.6', label: '3.6 เครื่องปรับสมุด' },
      { value: '3.7', label: '3.7 เครื่องนับเงิน' },
    ],
  },
  '4': {
    label: '4. เงื่อนไขและผลิตภัณฑ์',
    items: [
      { value: '4.1', label: '4.1 รายละเอียดผลิตภัณฑ์' },
      { value: '4.2', label: '4.2 เงื่อนไขอนุมัติ' },
      { value: '4.3', label: '4.3 ระยะเวลาอนุมัติ' },
      { value: '4.4', label: '4.4 ความยืดหยุ่น' },
      { value: '4.5', label: '4.5 ความเรียบง่ายข้อมูล' },
    ],
  },
  '5': {
    label: '5. สภาพแวดล้อมและสิ่งอำนวยความสะดวก',
    items: [
      { value: '5.1', label: '5.1 ความสะอาด' },
      { value: '5.2', label: '5.2 พื้นที่และความคับคั่ง' },
      { value: '5.3', label: '5.3 อุณหภูมิ' },
      { value: '5.4', label: '5.4 โต๊ะรับบริการ' },
      { value: '5.5', label: '5.5 จุดรอรับบริการ' },
      { value: '5.6', label: '5.6 แสง' },
      { value: '5.7', label: '5.7 เสียง' },
      { value: '5.8', label: '5.8 ห้องน้ำ' },
      { value: '5.9', label: '5.9 ที่จอดรถ' },
      { value: '5.10', label: '5.10 ป้าย-สื่อประชาสัมพันธ์' },
      { value: '5.11', label: '5.11 สิ่งอำนวยความสะดวกอื่นๆ' },
    ],
  },
  '6': {
    label: '6. Market Conduct',
    items: [
      { value: '6.1', label: '6.1 ไม่หลอกลวง' },
      { value: '6.2', label: '6.2 ไม่เอาเปรียบ' },
      { value: '6.3', label: '6.3 ไม่บังคับ' },
      { value: '6.4', label: '6.4 ไม่รบกวน' },
    ],
  },
  '7': {
    label: '7. อื่นๆ',
    items: [{ value: '7.1', label: '7.1 ความประทับใจอื่นๆ' }],
  },
};

const HEADER_OPTIONS = [
  { value: 'all', label: 'เลือกหัวข้อ (ทั้งหมด)' },
  ...Object.entries(CATEGORY_TREE).map(([value, v]) => ({ value, label: v.label })),
];

const subOptionsOf = (header: string) =>
  header && header !== 'all' ? CATEGORY_TREE[header].items : [];

/** ดึงโค้ด 1.x–7.x จาก feedback (รองรับทั้ง commentTags ใหม่ + detailedSentiment เดิม) */
function pickTagCodes(feedback: FeedbackEntry): string[] {
  const fromNew = (feedback as any)?.commentTags as string[] | undefined;
  if (Array.isArray(fromNew) && fromNew.length) return Array.from(new Set(fromNew));

  const mapLegacy: Record<string, string> = {
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
    // MC
    conductNoDeception: '6.1',
    conductNoAdvantage: '6.2',
    conductNoForcing: '6.3',
    conductNoDisturbance: '6.4',
    // other
    otherImpression: '7.1',
  };

  const detailed = (feedback as any)?.detailedSentiment as Record<string, number> | undefined;
  if (!detailed) return [];
  const codes: string[] = [];
  for (const [k, v] of Object.entries(detailed)) {
    if (v !== 0 && mapLegacy[k]) codes.push(mapLegacy[k]);
  }
  return Array.from(new Set(codes));
}

function matchSentiment(feedback: FeedbackEntry, filter: SentimentFilter): boolean {
  if (filter === 'all') return true;
  const vals = Object.values(feedback.sentiment);
  const hasPos = vals.some((v) => v === 1);
  const hasNeg = vals.some((v) => v === -1);
  return filter === 'positive' ? hasPos : hasNeg;
}

/* -------------------- [COMPONENT] -------------------- */

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

  const [selectedHeader, setSelectedHeader] = useState<string>('all');     // หัวข้อ 1–7
  const [selectedSub, setSelectedSub] = useState<string>('all');           // 1.x
  const [selectedServiceType, setSelectedServiceType] = useState<string>('all');
  const [sentimentFilter, setSentimentFilter] = useState<SentimentFilter>('all');
  const [selectedTimePeriod, setSelectedTimePeriod] = useState('monthly');

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

  const serviceTypes = [
    'ทั้งหมด',
    'การฝากเงิน/ถอนเงิน',
    'การซื้อผลิตภัณฑ์',
    'การชำระค่าบริการ/ค่าธรรมเนียม',
    'อื่นๆ'
  ];

  /** กรองข้อมูลด้วยหัวข้อ/หมวดย่อย + ทัศนคติ */
  const filteredComplaints = useMemo(() => {
    return mockFeedbackData
      .filter((feedback) => {
        if (selectedRegion !== 'all' && feedback.branch.region !== selectedRegion) return false;
        if (selectedDistrict !== 'all' && feedback.branch.district !== selectedDistrict) return false;
        if (selectedBranch !== 'all' && feedback.branch.branch !== selectedBranch) return false;

        if (selectedServiceType !== 'all' && selectedServiceType !== 'ทั้งหมด' && feedback.serviceType !== selectedServiceType) {
          return false;
        }

        // ทัศนคติ
        if (!matchSentiment(feedback as FeedbackEntry, sentimentFilter)) return false;

        // หมวดหมู่/หมวดย่อย
        const codes = pickTagCodes(feedback as FeedbackEntry);
        if (selectedHeader !== 'all') {
          if (!codes.some(c => c.startsWith(`${selectedHeader}.`))) return false;
        }
        if (selectedSub !== 'all') {
          if (!codes.includes(selectedSub)) return false;
        }

        return true;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [selectedRegion, selectedDistrict, selectedBranch, selectedHeader, selectedSub, selectedServiceType, sentimentFilter]);

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

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>ตัวกรองข้อมูล</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* พื้นที่ */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">เขต/ภาค</label>
              <Select value={selectedRegion} onValueChange={(value) => {
                setSelectedRegion(value);
                setSelectedDistrict('all');
                setSelectedBranch('all');
              }}>
                <SelectTrigger><SelectValue placeholder="เลือกภาค" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทั้งหมด</SelectItem>
                  {regions.filter(r => r !== 'all').map(region => (
                    <SelectItem key={region} value={region}>{region}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">เขต</label>
              <Select value={selectedDistrict} onValueChange={(value) => {
                setSelectedDistrict(value);
                setSelectedBranch('all');
              }}>
                <SelectTrigger><SelectValue placeholder="เลือกเขต" /></SelectTrigger>
                <SelectContent>
                  {districts.map(d => (
                    <SelectItem key={d} value={d}>{d === 'all' ? 'ทั้งหมด' : d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">สาขา</label>
              <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                <SelectTrigger><SelectValue placeholder="เลือกสาขา" /></SelectTrigger>
                <SelectContent>
                  {branches.map(b => (
                    <SelectItem key={b} value={b}>{b === 'all' ? 'ทั้งหมด' : b}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">ประเภทบริการ</label>
              <Select value={selectedServiceType} onValueChange={setSelectedServiceType}>
                <SelectTrigger><SelectValue placeholder="เลือกประเภทบริการ" /></SelectTrigger>
                <SelectContent>
                  {serviceTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* หมวดหมู่ + ทัศนคติ */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">หัวข้อ</label>
              <Select
                value={selectedHeader}
                onValueChange={(v) => {
                  setSelectedHeader(v);
                  setSelectedSub('all');
                }}
              >
                <SelectTrigger><SelectValue placeholder="เลือกหัวข้อ" /></SelectTrigger>
                <SelectContent>
                  {HEADER_OPTIONS.map(o => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">หมวดย่อย</label>
              <Select
                value={selectedSub}
                onValueChange={setSelectedSub}
              >
                <SelectTrigger><SelectValue placeholder="เลือกหมวดย่อย" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">เลือกทั้งหมด</SelectItem>
                  {subOptionsOf(selectedHeader).map(s => (
                    <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">ทัศนคติ</label>
              <Select value={sentimentFilter} onValueChange={(v: SentimentFilter) => setSentimentFilter(v)}>
                <SelectTrigger><SelectValue placeholder="ทั้งหมด" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทั้งหมด</SelectItem>
                  <SelectItem value="positive">เชิงบวก</SelectItem>
                  <SelectItem value="negative">เชิงลบ</SelectItem>
                </SelectContent>
              </Select>
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
              const codes = pickTagCodes(complaint as FeedbackEntry);
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
                                  {code}
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
