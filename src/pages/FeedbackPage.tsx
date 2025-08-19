// src/pages/FeedbackPage.tsx
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import TimeFilter from '@/components/TimeFilter';
import { ExportButton } from '@/components/shared/ExportButton';
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

interface FeedbackPageProps {
  timeFilter: TimeFilterType['value'];
  onTimeFilterChange: (value: TimeFilterType['value']) => void;
}

export const FeedbackPage: React.FC<FeedbackPageProps> = ({ 
  timeFilter, 
  onTimeFilterChange 
}) => {
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [selectedBranch, setSelectedBranch] = useState<string>('all');

  const [selectedHeader, setSelectedHeader] = useState<string>('all'); // หัวข้อ 1–7
  const [selectedSub, setSelectedSub] = useState<string>('all');       // 1.x
  const [selectedServiceType, setSelectedServiceType] = useState<string>('all');
  const [selectedSentiment, setSelectedSentiment] = useState<SentimentFilter>('all');

  const regions = useMemo(() => {
    const unique = Array.from(new Set(mockFeedbackData.map(f => f.branch.region))).sort();
    return ['all', ...unique];
  }, []);

  const districts = useMemo(() => {
    if (selectedRegion === 'all') return ['all'];
    const unique = Array.from(new Set(
      mockFeedbackData
        .filter(f => f.branch.region === selectedRegion)
        .map(f => f.branch.district)
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

  const headerOptions = [{ value: 'all', label: 'ทั้งหมด' }, ...HEADER_OPTIONS];

  const subOptions = useMemo(() => {
    return [{ value: 'all', label: 'ทั้งหมด' }, ...subOptionsOf(selectedHeader)];
  }, [selectedHeader]);

  // Filter feedback data
  const filteredFeedback = useMemo(() => {
    return mockFeedbackData.filter(feedback => {
      if (selectedRegion !== 'all' && feedback.branch.region !== selectedRegion) return false;
      if (selectedDistrict !== 'all' && feedback.branch.district !== selectedDistrict) return false;
      if (selectedBranch !== 'all' && feedback.branch.branch !== selectedBranch) return false;

      if (selectedServiceType !== 'all' && selectedServiceType !== 'ทั้งหมด' && feedback.serviceType !== selectedServiceType) return false;

      if (!matchSentiment(feedback as FeedbackEntry, selectedSentiment)) return false;

      const codes = pickTagCodes(feedback as FeedbackEntry);
      if (selectedHeader !== 'all') {
        if (!codes.some(c => c.startsWith(`${selectedHeader}.`))) return false;
      }
      if (selectedSub !== 'all') {
        if (!codes.includes(selectedSub)) return false;
      }
      return true;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [selectedRegion, selectedDistrict, selectedBranch, selectedHeader, selectedSub, selectedServiceType, selectedSentiment]);

  // Get detailed sentiments for display
  const getSentimentColor = (sentiment: number) => {
    if (sentiment === 1) return 'bg-green-100';
    if (sentiment === -1) return 'bg-red-100';
    return 'bg-gray-100';
  };

  const getFeedbackColor = (feedback: FeedbackEntry) => {
    const sentiments = Object.values(feedback.sentiment);
    const hasPositive = sentiments.some(s => s === 1);
    const hasNegative = sentiments.some(s => s === -1);
    if (hasPositive && hasNegative) return 'bg-yellow-100';
    if (hasPositive) return 'bg-green-100';
    if (hasNegative) return 'bg-red-100';
    return 'bg-gray-100';
  };

  const getDetailedSentiments = (feedback: FeedbackEntry) => {
    const results: Array<{ category: string; subcategory: string; sentiment: number }> = [];
    // ดึงจาก detailedSentiment แล้วแปะชื่อจาก CATEGORY_TREE
    const codes = pickTagCodes(feedback);
    for (const code of codes) {
      const [head] = code.split('.');
      const headDef = CATEGORY_TREE[head];
      const subDef = headDef?.items.find(i => i.value === code);
      if (subDef) {
        // แปลง sentiment เป็น -1 / 0 / 1 จาก detailedSentiment ถ้าต้องการสี
        // (ที่นี่เราไม่ดึงค่าจริงของ sub แยก – ใช้กลางๆ เป็น 0)
        results.push({ category: headDef.label, subcategory: subDef.label, sentiment: 0 });
      }
    }
    return results;
  };

  return (
    <div className="space-y-6 max-w-full">
      {/* Header with Time Filter */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-foreground">ความคิดเห็น</h2>
        <TimeFilter
          value={timeFilter}
          onChange={onTimeFilterChange}
        />
      </div>

      {/* Filter Controls */}
      <Card className="chart-container-medium">
        <CardHeader>
          <CardTitle className="card-title">ตัวกรองข้อมูล</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Location Filters */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">พื้นที่ให้บริการ</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

          {/* Category Filters */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">หมวดหมู่ที่ถูกกล่าวถึง</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select value={selectedHeader} onValueChange={(value) => {
                setSelectedHeader(value);
                setSelectedSub('all');
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="เลือกหัวข้อ" />
                </SelectTrigger>
                <SelectContent>
                  {headerOptions.map(category => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedSub} onValueChange={setSelectedSub}>
                <SelectTrigger>
                  <SelectValue placeholder="เลือกหมวดย่อย" />
                </SelectTrigger>
                <SelectContent>
                  {subOptions.map(category => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Service Type and Sentiment Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">ประเภทการให้บริการ</label>
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

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">ทัศนคติของความคิดเห็น</label>
              <Select value={selectedSentiment} onValueChange={setSelectedSentiment}>
                <SelectTrigger>
                  <SelectValue placeholder="เลือกทัศนคติ" />
                </SelectTrigger>
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

      {/* Feedback List */}
      <Card className="chart-container-large">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="card-title">
            รายการความคิดเห็น ({filteredFeedback.length} รายการ)
          </CardTitle>
          <ExportButton 
            data={filteredFeedback}
            type="feedback"
            filename="ความคิดเห็นลูกค้า"
            title="รายการความคิดเห็นลูกค้า"
          />
        </CardHeader>
        <CardContent>
          <div className="max-h-96 overflow-y-auto space-y-4">
            {filteredFeedback.map((feedback) => {
              const detailedSentiments = getDetailedSentiments(feedback);
              
              return (
                <div
                  key={feedback.id}
                  className={`p-4 rounded-lg border ${getFeedbackColor(feedback)}`}
                >
                  {/* Header Info */}
                  <div className="flex flex-wrap gap-4 mb-3 text-sm text-gray-600">
                    <span><strong>วันที่:</strong> {feedback.date} {feedback.timestamp}</span>
                    <span><strong>บริการ:</strong> {feedback.serviceType}</span>
                    <span><strong>สาขา:</strong> {feedback.branch.branch} / {feedback.branch.district} / {feedback.branch.region}</span>
                  </div>

                  {/* Comment Content */}
                  <div className="mb-3">
                    <p className="text-gray-800 leading-relaxed">{feedback.comment}</p>
                  </div>

                  {/* Sentiment Categories */}
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-700">หมวดหมู่ที่เกี่ยวข้อง:</div>
                    <div className="flex flex-wrap gap-2">
                      {detailedSentiments.map((item, index) => (
                        <Badge
                          key={index}
                          className={`${getSentimentColor(item.sentiment)} text-gray-800 border-0`}
                        >
                          {item.category}: {item.subcategory}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredFeedback.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                ไม่พบความคิดเห็นที่ตรงกับเงื่อนไขที่เลือก
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
