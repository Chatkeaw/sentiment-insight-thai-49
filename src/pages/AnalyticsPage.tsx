import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ChevronRight, AlertTriangle, TrendingUp } from 'lucide-react';
import TimeFilter from '@/components/TimeFilter';
import { TimeFilter as TimeFilterType } from '@/types/dashboard';

interface CategoryData {
  name: string;
  category?: string;
  positive: number;
  negative: number;
  total: number;
}

interface AnalyticsPageProps {
  onBack: () => void;
  timeFilter: TimeFilterType['value'];
  onTimeFilterChange: (value: TimeFilterType['value']) => void;
}

// คอมโพเนนต์ CategoryRankings
const CategoryRankings: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryData | null>(null);
  const [modalType, setModalType] = useState<'main' | 'sub'>('main');

  // ข้อมูลประเภทหลัก (หัวข้อที่ลูกค้าร้องเรียน)
  const categoryTypes = [
    { name: 'พนักงานและบุคลากร', positive: 245, negative: 89, total: 425 },
    { name: 'เทคโนโลยีและดิจิทัล', positive: 156, negative: 134, total: 312 },
    { name: 'Market Conduct', positive: 23, negative: 12, total: 248 },
    { name: 'สภาพแวดล้อมและสิ่งอำนวยความสะดวก', positive: 198, negative: 76, total: 189 },
    { name: 'ระบบและกระบวนการให้บริการ', positive: 134, negative: 67, total: 156 },
    { name: 'เงื่อนไขและผลิตภัณฑ์', positive: 89, negative: 45, total: 134 },
    { name: 'อื่นๆ', positive: 67, negative: 34, total: 67 },
  ].sort((a, b) => b.negative - a.negative);

  // ข้อมูลหมวดหมู่ย่อย (หมวดหมู่ที่ลูกค้าร้องเรียน)
  const detailedCategories = [
    { name: 'ความสุภาพและมารยาทของพนักงาน', category: 'พนักงานและบุคลากร', positive: 189, negative: 45, total: 142 },
    { name: 'ความเอาใจใส่ในการให้บริการลูกค้า', category: 'พนักงานและบุคลากร', positive: 167, negative: 23, total: 128 },
    { name: 'ไม่เอาเปรียบ', category: 'Market Conduct', positive: 145, negative: 12, total: 96 },
    { name: 'ระบบ Core ของธนาคาร', category: 'เทคโนโลยีและดิจิทัล', positive: 98, negative: 87, total: 89 },
    { name: 'ความรวดเร็วในการให้บริการ', category: 'พนักงานและบุคลากร', positive: 123, negative: 56, total: 84 },
    { name: 'ไม่บังคับ', category: 'Market Conduct', positive: 78, negative: 34, total: 76 },
    { name: 'พื้นที่และความคับคั่ง', category: 'สภาพแวดล้อมและสิ่งอำนวยความสะดวก', positive: 67, negative: 89, total: 67 },
  ].sort((a, b) => b.negative - a.negative);

  const handleViewDetails = (category: CategoryData, type: 'main' | 'sub') => {
    setSelectedCategory(category);
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
  };

  // ฟังก์ชันกำหนดสีของวงกลมตามลำดับ
  const getRankColor = (index: number) => {
    if (index === 0) return 'bg-red-700';
    if (index === 1) return 'bg-red-600';
    if (index === 2) return 'bg-red-500';
    return 'bg-gray-300';
  };

  // ฟังก์ชันคำนวณสีพื้นหลังสำหรับหัวข้อหลัก
  const getMainCategoryColor = (negative: number, name: string) => {
    // Market Conduct ให้สีแดงเข้มที่สุด
    if (name === 'Market Conduct') return 'bg-red-900/30';
    
    // ไล่สีแดงตามจำนวน negative (มากไปน้อย)
    if (negative >= 100) return 'bg-red-800/30';
    if (negative >= 80) return 'bg-red-700/30';
    if (negative >= 60) return 'bg-red-600/30';
    if (negative >= 40) return 'bg-red-500/30';
    if (negative >= 20) return 'bg-red-400/30';
    return 'bg-red-300/30';
  };
  
  // ฟังก์ชันคำนวณสีพื้นหลังสำหรับหมวดหมู่ย่อย
  const getSubCategoryColor = (negative: number, name: string) => {
    // ไม่เอาเปรียบและไม่บังคับให้สีแดงเข้มที่สุด
    if (name === 'ไม่เอาเปรียบ' || name === 'ไม่บังคับ') return 'bg-red-900/30';
    
    // ไล่สีแดงตามจำนวน negative (มากไปน้อย)
    if (negative >= 80) return 'bg-red-800/30';
    if (negative >= 60) return 'bg-red-700/30';
    if (negative >= 40) return 'bg-red-600/30';
    if (negative >= 20) return 'bg-red-500/30';
    return 'bg-red-400/30';
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* การ์ดหัวข้อที่ลูกค้าร้องเรียน */}
        <Card className="shadow-lg border-0 rounded-xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white py-4">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-semibold">หัวข้อที่ลูกค้าร้องเรียน</CardTitle>
              <Button 
                variant="ghost" 
                className="text-white hover:bg-red-800 p-2 h-8"
                onClick={() => handleViewDetails({name: 'ทั้งหมด', positive: 0, negative: 0, total: 0}, 'main')}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-200">
              {categoryTypes.map((item, index) => (
                <div 
                  key={index}
                  className={`flex items-center justify-between p-4 transition-colors ${getMainCategoryColor(item.negative, item.name)}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${getRankColor(index)}`}>
                      {index + 1}
                    </div>
                    <span className="font-medium text-gray-800">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.name === 'Market Conduct' && (
                      <AlertTriangle size={16} className="text-red-600" />
                    )}
                    <span className="font-bold text-red-600">{item.negative}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* การ์ดหมวดหมู่ที่ลูกค้าร้องเรียน */}
        <Card className="shadow-lg border-0 rounded-xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-semibold">หมวดหมู่ที่ลูกค้าร้องเรียน</CardTitle>
              <Button 
                variant="ghost" 
                className="text-white hover:bg-orange-600 p-2 h-8"
                onClick={() => handleViewDetails({name: 'ทั้งหมด', positive: 0, negative: 0, total: 0}, 'sub')}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-200">
              {detailedCategories.map((item, index) => (
                <div 
                  key={index}
                  className={`flex items-center justify-between p-4 transition-colors ${getSubCategoryColor(item.negative, item.name)}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${getRankColor(index)}`}>
                      {index + 1}
                    </div>
                    <span className="font-medium text-gray-800">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {(item.name === 'ไม่เอาเปรียบ' || item.name === 'ไม่บังคับ') && (
                      <TrendingUp size={16} className="text-red-600" />
                    )}
                    <span className="font-bold text-red-600">{item.negative}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Info Section */}
      <div className="mt-8 p-6 bg-white rounded-xl shadow-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">สรุปการวิเคราะห์</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-4 h-4 rounded-full bg-red-600"></div>
              <span className="font-semibold">หัวข้อร้องเรียนสูงสุด</span>
            </div>
            <p className="text-gray-700">เทคโนโลยีและดิจิทัล (134 รายการ)</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-4 h-4 rounded-full bg-orange-500"></div>
              <span className="font-semibold">หมวดหมู่ร้องเรียนสูงสุด</span>
            </div>
            <p className="text-gray-700">พื้นที่และความคับคั่ง (89 รายการ)</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-4 h-4 rounded-full bg-blue-500"></div>
              <span className="font-semibold">แนวโน้ม</span>
            </div>
            <p className="text-gray-700">Market Conduct มีอัตราการร้องเรียนเพิ่มขึ้น 15%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ 
  onBack, 
  timeFilter, 
  onTimeFilterChange 
}) => {
  return (
    <div className="space-y-6 max-w-full">
      {/* Header with Back Button and Time Filter */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          กลับ
        </Button>
        
        <TimeFilter
          value={timeFilter}
          onChange={onTimeFilterChange}
        />
      </div>

      {/* Content */}
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-semibold text-gray-700">ติดตามผลดำเนินงาน</h2>
          <p className="text-lg text-muted-foreground">การวิเคราะห์การร้องเรียนและความคิดเห็นของลูกค้า</p>
        </div>
        
        {/* ใช้คอมโพเนนต์ CategoryRankings */}
        <CategoryRankings />
      </div>
    </div>
  );
};