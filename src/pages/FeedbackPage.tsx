// src/pages/FeedbackPage.tsx
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import TimeFilter from '@/components/TimeFilter';
import { ExportButton } from '@/components/shared/ExportButton';
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
  const [selectedMainCategory, setSelectedMainCategory] = useState<string>('all');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('all');
  const [selectedServiceType, setSelectedServiceType] = useState<string>('ทั้งหมด');
  const [selectedSentiment, setSelectedSentiment] = useState<string>('all');

  // วันที่ (UI เท่านั้น)
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const clearFilters = () => {
    setSelectedRegion('all');
    setSelectedDistrict('all');
    setSelectedBranch('all');
    setSelectedMainCategory('all');
    setSelectedSubCategory('all');
    setSelectedServiceType('ทั้งหมด');
    setSelectedSentiment('all');
    setStartDate('');
    setEndDate('');
  };

  // Get unique values for filters
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

  // Category mappings
  const mainCategories = [
    { value: 'all', label: 'ทั้งหมด' },
    { value: 'staff', label: 'พนักงานและบุคลากร' },
    { value: 'service', label: 'ระบบและกระบวนการให้บริการ' },
    { value: 'technology', label: 'เทคโนโลยีและดิจิทัล' },
    { value: 'products', label: 'ผลิตภัณฑ์และบริการทางการเงิน' },
    { value: 'environment', label: 'สภาพแวดล้อมและสิ่งอำนวยความสะดวก' },
    { value: 'marketConduct', label: 'การปฏิบัติตามหลักธรรมาภิบาลทางการตลาด' },
    { value: 'other', label: 'อื่นๆ' }
  ];

  const subCategoryMap: { [key: string]: Array<{ value: string; label: string }> } = {
    staff: [
      { value: 'staffPoliteness', label: 'ความสุภาพ' },
      { value: 'staffCare', label: 'การดูแลเอาใจใส่' },
      { value: 'staffConsultation', label: 'การให้คำปรึกษา' },
      { value: 'staffAccuracy', label: 'ความถูกต้อง' },
      { value: 'staffSpeed', label: 'ความรวดเร็ว' },
      { value: 'staffProfessionalism', label: 'ความเป็นมืออาชีพ' },
      { value: 'staffImpression', label: 'ความประทับใจ' },
      { value: 'staffSecurity', label: 'ความปลอดภัย' }
    ],
    service: [
      { value: 'serviceReadiness', label: 'ความพร้อมของบริการ' },
      { value: 'serviceProcess', label: 'กระบวนการให้บริการ' },
      { value: 'serviceQueue', label: 'ระบบจัดการคิว' },
      { value: 'serviceDocuments', label: 'เอกสารและข้อมูล' }
    ],
    technology: [
      { value: 'techCore', label: 'ระบบ Core ของธนาคาร' },
      { value: 'techQueue', label: 'ระบบเรียกคิวและจัดการคิว' },
      { value: 'techATM', label: 'ATM ADM CDM' },
      { value: 'techKYC', label: 'ระบบ KYC' },
      { value: 'techApp', label: 'MyMo Application' },
      { value: 'techBookUpdate', label: 'ระบบปรับปรุงสมุดบัญชี' },
      { value: 'techCashCounter', label: 'เครื่องนับเงิน' }
    ],
    products: [
      { value: 'productDetails', label: 'รายละเอียดผลิตภัณฑ์' },
      { value: 'productConditions', label: 'เงื่อนไขการใช้บริการ' },
      { value: 'productApprovalTime', label: 'ระยะเวลาอนุมัติ' },
      { value: 'productFlexibility', label: 'ความยืดหยุ่น' },
      { value: 'productSimplicity', label: 'ความง่ายในการใช้' }
    ],
    environment: [
      { value: 'envCleanliness', label: 'ความสะอาด' },
      { value: 'envSpace', label: 'พื้นที่และความคับคั่ง' },
      { value: 'envTemperature', label: 'อุณหภูมิ' },
      { value: 'envDesk', label: 'โต๊ะทำงานและเก้าอี้' },
      { value: 'envWaitingArea', label: 'พื้นที่นั่งรอ' },
      { value: 'envLighting', label: 'แสงสวาง' },
      { value: 'envSound', label: 'เสียงรบกวน' },
      { value: 'envRestroom', label: 'ห้องน้ำ' },
      { value: 'envParking', label: 'ที่จอดรถ' },
      { value: 'envSignage', label: 'ป้ายบอกทางและสัญลักษณ์' },
      { value: 'envOtherFacilities', label: 'สิ่งอำนวยความสะดวกอื่นๆ' }
    ],
    marketConduct: [
      { value: 'conductNoDeception', label: 'ไม่หลอกลวง' },
      { value: 'conductNoAdvantage', label: 'ไม่เอาเปรียบ' },
      { value: 'conductNoForcing', label: 'ไม่บังคับ' },
      { value: 'conductNoDisturbance', label: 'ไม่รบกวน' }
    ],
    other: [
      { value: 'otherImpression', label: 'ความประทับใจโดยรวม' }
    ]
  };

  const subCategories = useMemo(() => {
    if (selectedMainCategory === 'all') return [{ value: 'all', label: 'ทั้งหมด' }];
    return [{ value: 'all', label: 'ทั้งหมด' }, ...(subCategoryMap[selectedMainCategory] || [])];
  }, [selectedMainCategory]);

  const serviceTypes = [
    'ทั้งหมด',
    'การฝากเงิน/ถอนเงิน',
    'การซื้อผลิตภัณฑ์',
    'การชำระค่าบริการ/ค่าธรรมเนียม',
    'อื่นๆ'
  ];

  // Filter feedback data
  const filteredFeedback = useMemo(() => {
    return mockFeedbackData.filter(feedback => {
      // Location filters
      if (selectedRegion !== 'all' && feedback.branch.region !== selectedRegion) return false;
      if (selectedDistrict !== 'all' && feedback.branch.district !== selectedDistrict) return false;
      if (selectedBranch !== 'all' && feedback.branch.branch !== selectedBranch) return false;
      
      // Service type filter
      if (selectedServiceType !== 'all' && selectedServiceType !== 'ทั้งหมด' && feedback.serviceType !== selectedServiceType) return false;
      
      // Sentiment filter
      if (selectedSentiment !== 'all') {
        const hasPositive = Object.values(feedback.sentiment).some(s => s === 1);
        const hasNegative = Object.values(feedback.sentiment).some(s => s === -1);
        if (selectedSentiment === 'positive' && !hasPositive) return false;
        if (selectedSentiment === 'negative' && !hasNegative) return false;
      }
      
      // Category filters (main only)
      if (selectedMainCategory !== 'all') {
        const categoryValue = feedback.sentiment[selectedMainCategory as keyof typeof feedback.sentiment];
        if (categoryValue === 0) return false;
      }
      
      return true;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [selectedRegion, selectedDistrict, selectedBranch, selectedMainCategory, selectedSubCategory, selectedServiceType, selectedSentiment]);

  // Get sentiment color
  const getSentimentColor = (sentiment: number) => {
    if (sentiment === 1) return 'bg-green-100';
    if (sentiment === -1) return 'bg-red-100';
    return 'bg-gray-100';
  };

  // Get overall feedback color
  const getFeedbackColor = (feedback: FeedbackEntry) => {
    const sentiments = Object.values(feedback.sentiment);
    const hasPositive = sentiments.some(s => s === 1);
    const hasNegative = sentiments.some(s => s === -1);
    
    if (hasPositive && hasNegative) return 'bg-yellow-100';
    if (hasPositive) return 'bg-green-100';
    if (hasNegative) return 'bg-red-100';
    return 'bg-gray-100';
  };

  // Get detailed sentiments for display
  const getDetailedSentiments = (feedback: FeedbackEntry) => {
    const results: Array<{ category: string; subcategory: string; sentiment: number }> = [];
    
    Object.entries(feedback.detailedSentiment).forEach(([key, value]) => {
      if (value !== 0) {
        const mainCat = mainCategories.find(cat => 
          subCategoryMap[cat.value]?.some(sub => sub.value === key)
        );
        const subCat = subCategoryMap[mainCat?.value || '']?.find(sub => sub.value === key);
        
        if (mainCat && subCat) {
          results.push({
            category: mainCat.label,
            subcategory: subCat.label,
            sentiment: value
          });
        }
      }
    });
    
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

      {/* Filter Controls – UI แบบอ้างอิง */}
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
                <Select value={selectedRegion} onValueChange={(value) => {
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
                <Select value={selectedDistrict} onValueChange={(value) => {
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

          {/* ช่วงเวลา + ประเภทบริการ + หมวดหมู่/หมวดย่อย/ทัศนคติ */}
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
                    {serviceTypes.map(type => (
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

              {/* หมวดหมู่หลัก */}
              <div className="md:col-span-4">
                <div className="mb-1 text-sm font-medium">หมวดหมู่</div>
                <Select value={selectedMainCategory} onValueChange={(value) => {
                  setSelectedMainCategory(value);
                  setSelectedSubCategory('all');
                }}>
                  <SelectTrigger className="h-11 rounded-lg border-pink-200 focus:ring-2 focus:ring-pink-200/60">
                    <SelectValue placeholder="เลือกหมวดหมู่หลัก" />
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

              {/* หมวดหมู่ย่อย */}
              <div className="md:col-span-4">
                <div className="mb-1 text-sm font-medium">หมวดหมู่ย่อย</div>
                <Select value={selectedSubCategory} onValueChange={setSelectedSubCategory}>
                  <SelectTrigger className="h-11 rounded-lg border-pink-200 focus:ring-2 focus:ring-pink-200/60">
                    <SelectValue placeholder="เลือกหมวดหมู่ย่อย" />
                  </SelectTrigger>
                  <SelectContent>
                    {subCategories.map(category => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* ทัศนคติ */}
              <div className="md:col-span-4">
                <div className="mb-1 text-sm font-medium">ทัศนคติ</div>
                <Select value={selectedSentiment} onValueChange={setSelectedSentiment}>
                  <SelectTrigger className="h-11 rounded-lg border-pink-200 focus:ring-2 focus:ring-pink-200/60">
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
              const results: Array<{ category: string; subcategory: string; sentiment: number }> = [];
              Object.entries(feedback.detailedSentiment).forEach(([key, value]) => {
                if (value !== 0) {
                  const mainCat = mainCategories.find(cat => subCategoryMap[cat.value]?.some(sub => sub.value === key));
                  const subCat = subCategoryMap[mainCat?.value || '']?.find(sub => sub.value === key);
                  if (mainCat && subCat) {
                    results.push({ category: mainCat.label, subcategory: subCat.label, sentiment: value });
                  }
                }
              });

              const sentiments = Object.values(feedback.sentiment);
              const hasPositive = sentiments.some(s => s === 1);
              const hasNegative = sentiments.some(s => s === -1);
              const box =
                hasPositive && hasNegative ? 'bg-yellow-100'
                : hasPositive ? 'bg-green-100'
                : hasNegative ? 'bg-red-100'
                : 'bg-gray-100';

              const tagColor = (s: number) => s === 1 ? 'bg-green-100' : s === -1 ? 'bg-red-100' : 'bg-gray-100';

              return (
                <div key={feedback.id} className={`p-4 rounded-lg border ${box}`}>
                  <div className="flex flex-wrap gap-4 mb-3 text-sm text-gray-600">
                    <span><strong>วันที่:</strong> {feedback.date} {feedback.timestamp}</span>
                    <span><strong>บริการ:</strong> {feedback.serviceType}</span>
                    <span><strong>สาขา:</strong> {feedback.branch.branch} / {feedback.branch.district} / {feedback.branch.region}</span>
                  </div>

                  <div className="mb-3">
                    <p className="text-gray-800 leading-relaxed">{feedback.comment}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-700">หมวดหมู่ที่เกี่ยวข้อง:</div>
                    <div className="flex flex-wrap gap-2">
                      {results.map((item, index) => (
                        <Badge key={index} className={`${tagColor(item.sentiment)} text-gray-800 border-0`}>
                          {item.category}: {item.subcategory}{item.sentiment === 1 ? ' 👍' : ' 👎'}
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
