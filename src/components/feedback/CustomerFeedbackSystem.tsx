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
  category: string;
  sentiment: 'positive' | 'negative' | 'mixed';
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
    raw_comment: 'พนักงานให้บริการดีมาก พูดจาสุภาพ แนะนำบริการอย่างชัดเจน',
    category: 'บริการลูกค้า',
    sentiment: 'positive',
    severity: 'normal'
  },
  {
    id: '2',
    region: 'ภาคตะวันออกเฉียงเหนือ',
    area: 'อุบลราชธานี',
    branch: 'เมืองอุบลฯ',
    service_type: 'สินเชื่อ',
    timestamp: '2024-07-01 15:50',
    raw_comment: 'ไม่สามารถ login เข้าแอป MyMo ได้ พนักงานไม่สามารถช่วยเหลือได้เลย',
    category: 'แอปพลิเคชัน',
    sentiment: 'negative',
    severity: 'high'
  },
  {
    id: '3',
    region: 'ภาคใต้',
    area: 'สงขลา',
    branch: 'หาดใหญ่',
    service_type: 'บัตร ATM',
    timestamp: '2024-07-01 13:20',
    raw_comment: 'พนักงานบริการดี แต่ระบบออกบัตรล่าช้า ใช้เวลานานเกินไป',
    category: 'ระบบ',
    sentiment: 'mixed',
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
  const [category, setCategory] = useState<string>('all');
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

  const serviceTypes = ['เปิดบัญชี', 'สินเชื่อ', 'บัตร ATM'];
  const categories = ['บริการลูกค้า', 'แอปพลิเคชัน', 'ระบบ'];

  // Filtered feedback data
  const filteredFeedback = useMemo(() => {
    return mockFeedbackData.filter(feedback => {
      if (selectedRegion !== 'all' && feedback.region !== selectedRegion) return false;
      if (selectedArea !== 'all' && feedback.area !== selectedArea) return false;
      if (selectedBranch !== 'all' && feedback.branch !== selectedBranch) return false;
      if (serviceType !== 'all' && feedback.service_type !== serviceType) return false;
      if (sentiment !== 'all' && feedback.sentiment !== sentiment) return false;
      if (category !== 'all' && feedback.category !== category) return false;
      if (searchTerm && !feedback.raw_comment.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      
      return true;
    });
  }, [selectedRegion, selectedArea, selectedBranch, serviceType, sentiment, category, searchTerm]);

  // Get background color based on sentiment
  const getBackgroundColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-50 border-green-200';
      case 'negative':
        return 'bg-red-50 border-red-200';
      case 'mixed':
        return 'bg-yellow-50 border-yellow-200';
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
    setCategory('all');
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
              <label className="text-xs text-muted-foreground">หมวดหมู่ที่ถูกกล่าวถึง</label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="เลือกหมวดหมู่" />
                </SelectTrigger>
                <SelectContent className="bg-background">
                  <SelectItem value="all">ทั้งหมด</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
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
                    <span><strong>หมวดหมู่:</strong> {feedback.category}</span>
                  </div>

                  {/* Comment */}
                  <div className="mb-3">
                    <p className="text-foreground leading-relaxed">{feedback.raw_comment}</p>
                  </div>

                  {/* Tags */}
                  <div className="flex gap-2">
                    <Badge 
                      variant={feedback.sentiment === 'positive' ? 'default' : feedback.sentiment === 'negative' ? 'destructive' : 'secondary'}
                    >
                      {feedback.sentiment === 'positive' ? 'เชิงบวก' : feedback.sentiment === 'negative' ? 'เชิงลบ' : 'เชิงผสม'}
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
