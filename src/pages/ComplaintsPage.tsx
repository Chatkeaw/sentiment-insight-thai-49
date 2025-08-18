import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import TimeFilter from '@/components/TimeFilter';
import { TimeFilter as TimeFilterType } from '@/types/dashboard';
import { mockFeedbackData } from '@/data/mockData';
import { FeedbackEntry } from '@/types/dashboard';

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
  const [selectedServiceType, setSelectedServiceType] = useState<string>('all');

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
    { value: 'staff', label: 'พนักงาน' },
    { value: 'service', label: 'การบริการ' },
    { value: 'technology', label: 'เทคโนโลยี' },
    { value: 'products', label: 'ผลิตภัณฑ์' },
    { value: 'environment', label: 'สภาพแวดล้อม' },
    { value: 'marketConduct', label: 'การปฏิบัติตลาด' },
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
      { value: 'serviceReadiness', label: 'ความพร้อม' },
      { value: 'serviceProcess', label: 'กระบวนการ' },
      { value: 'serviceQueue', label: 'ระบบคิว' },
      { value: 'serviceDocuments', label: 'เอกสาร' }
    ],
    technology: [
      { value: 'techCore', label: 'ระบบ Core' },
      { value: 'techQueue', label: 'ระบบคิว' },
      { value: 'techATM', label: 'ATM' },
      { value: 'techKYC', label: 'KYC' },
      { value: 'techApp', label: 'แอปพลิเคชัน' },
      { value: 'techBookUpdate', label: 'ปรับปรุงสมุด' },
      { value: 'techCashCounter', label: 'เครื่องนับเงิน' }
    ],
    products: [
      { value: 'productDetails', label: 'รายละเอียด' },
      { value: 'productConditions', label: 'เงื่อนไข' },
      { value: 'productApprovalTime', label: 'เวลาอนุมัติ' },
      { value: 'productFlexibility', label: 'ความยืดหยุ่น' },
      { value: 'productSimplicity', label: 'ความง่าย' }
    ],
    environment: [
      { value: 'envCleanliness', label: 'ความสะอาด' },
      { value: 'envSpace', label: 'พื้นที่' },
      { value: 'envTemperature', label: 'อุณหภูมิ' },
      { value: 'envDesk', label: 'โต๊ะทำงาน' },
      { value: 'envWaitingArea', label: 'พื้นที่รอ' },
      { value: 'envLighting', label: 'แสงสวาง' },
      { value: 'envSound', label: 'เสียงรบกวน' },
      { value: 'envRestroom', label: 'ห้องน้ำ' },
      { value: 'envParking', label: 'ที่จอดรถ' },
      { value: 'envSignage', label: 'ป้ายบอกทาง' },
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

  const serviceTypes = [
    'ทั้งหมด',
    'การฝากเงิน/ถอนเงิน',
    'การซื้อผลิตภัณฑ์',
    'การชำระค่าบริการ/ค่าธรรมเนียม',
    'อื่นๆ'
  ];

  // Time period options
  const timePeriods = [
    { value: 'monthly', label: 'รายเดือน' },
    { value: 'quarterly', label: 'ไตรมาส' },
    { value: 'custom', label: 'กำหนดเอง' }
  ];

  const [selectedTimePeriod, setSelectedTimePeriod] = useState('monthly');

  // Filter feedback data - only negative sentiments
  const filteredComplaints = useMemo(() => {
    return mockFeedbackData.filter(feedback => {
      // Must have negative sentiment
      const hasNegative = Object.values(feedback.sentiment).some(s => s === -1);
      if (!hasNegative) return false;
      
      // Location filters
      if (selectedRegion !== 'all' && feedback.branch.region !== selectedRegion) return false;
      if (selectedDistrict !== 'all' && feedback.branch.district !== selectedDistrict) return false;
      if (selectedBranch !== 'all' && feedback.branch.branch !== selectedBranch) return false;
      
      // Service type filter
      if (selectedServiceType !== 'all' && selectedServiceType !== 'ทั้งหมด' && feedback.serviceType !== selectedServiceType) return false;
      
      // Category filters
      if (selectedMainCategory !== 'all') {
        const categoryValue = feedback.sentiment[selectedMainCategory as keyof typeof feedback.sentiment];
        if (categoryValue !== -1) return false;
      }
      
      return true;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [selectedRegion, selectedDistrict, selectedBranch, selectedMainCategory, selectedServiceType]);

  // Calculate statistics
  const totalComplaints = filteredComplaints.length;
  const totalFeedback = mockFeedbackData.length;
  const complaintPercentage = totalFeedback > 0 ? ((totalComplaints / totalFeedback) * 100).toFixed(1) : '0';

  // Chart data for categories
  const categoryChartData = useMemo(() => {
    const categoryCounts: { [key: string]: number } = {};
    
    filteredComplaints.forEach(complaint => {
      Object.entries(complaint.sentiment).forEach(([category, sentiment]) => {
        if (sentiment === -1) {
          const categoryLabel = mainCategories.find(c => c.value === category)?.label || category;
          categoryCounts[categoryLabel] = (categoryCounts[categoryLabel] || 0) + 1;
        }
      });
    });

    return Object.entries(categoryCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [filteredComplaints]);

  // Get detailed sentiments for display (only negative ones)
  const getDetailedSentiments = (feedback: FeedbackEntry) => {
    const results: Array<{ category: string; subcategory: string; sentiment: number }> = [];
    
    Object.entries(feedback.detailedSentiment).forEach(([key, value]) => {
      if (value === -1) {
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
      {/* Header */}
      <div className="flex flex-col space-y-2">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-foreground">⚠️ ข้อร้องเรียนลูกค้า</h1>
          <TimeFilter
            value={timeFilter}
            onChange={onTimeFilterChange}
          />
        </div>
        <p className="text-muted-foreground">รวมเฉพาะความคิดเห็นเชิงลบและข้อร้องเรียน</p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>ตัวกรองข้อมูล</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Location Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">เขต/ภาค</label>
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

            <div className="space-y-2">
              <label className="text-sm font-medium">สาขา</label>
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

            <div className="space-y-2">
              <label className="text-sm font-medium">ประเภทเวลา</label>
              <Select value={selectedTimePeriod} onValueChange={setSelectedTimePeriod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timePeriods.map(period => (
                    <SelectItem key={period.value} value={period.value}>
                      {period.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">หมวดหมู่</label>
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
        </CardContent>
      </Card>

      {/* Dashboard Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Statistics Cards */}
        <div className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">จำนวนข้อร้องเรียนทั้งหมด</p>
                  <p className="text-3xl font-bold text-destructive">{totalComplaints}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">สัดส่วนจากความคิดเห็นทั้งหมด</p>
                  <p className="text-xl font-semibold text-destructive">{complaintPercentage}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Category Chart */}
        <Card>
          <CardHeader>
            <CardTitle>กราฟแท่ง - หมวดหมู่ข้อร้องเรียน</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={categoryChartData.slice(0, 5)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  fontSize={12}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis fontSize={12} />
                <Tooltip />
                <Bar dataKey="value" fill="hsl(var(--destructive))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Complaints List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📋 รายการข้อร้องเรียน ({filteredComplaints.length} รายการ)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {filteredComplaints.map((complaint) => {
              const detailedSentiments = getDetailedSentiments(complaint);
              
              return (
                <Card key={complaint.id} className="border-l-4 border-l-destructive">
                  <CardContent className="p-4">
                    {/* Card Header */}
                    <div className="flex items-start gap-3 mb-3">
                      <span className="text-xl">⚠️</span>
                      <div className="flex-1">
                        {/* Metadata */}
                        <div className="flex flex-wrap gap-4 mb-2 text-sm text-muted-foreground">
                          <span>📅 {complaint.date}</span>
                          <span>🏢 {complaint.branch.branch}</span>
                          <span>🔧 {complaint.serviceType}</span>
                        </div>
                        
                        {/* Content */}
                        <p className="text-foreground leading-relaxed mb-3">
                          {complaint.comment}
                        </p>
                        
                        {/* Tags */}
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-muted-foreground">หมวดหมู่:</p>
                          <div className="flex flex-wrap gap-2">
                            {detailedSentiments.map((item, index) => (
                              <Badge
                                key={index}
                                variant="destructive"
                                className="text-xs"
                              >
                                {item.category}: {item.subcategory}
                              </Badge>
                            ))}
                          </div>
                        </div>
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