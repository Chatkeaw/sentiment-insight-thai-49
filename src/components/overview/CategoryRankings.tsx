import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SentimentAnalysisModal } from '@/components/analytics/SentimentAnalysisModal';

interface CategoryData {
  name: string;
  category?: string;
  positive: number;
  negative: number;
}

export const CategoryRankings: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryData | null>(null);
  const [modalType, setModalType] = useState<'main' | 'sub'>('main');

  // Mock data for category types (main categories)
  const categoryTypes = [
    { name: 'พนักงานและบุคลากร', positive: 245, negative: 89 },
    { name: 'เทคโนโลยีและดิจิทัล', positive: 156, negative: 134 },
    { name: 'สภาพแวดล้อมและสิ่งอำนวยความสะดวก', positive: 198, negative: 76 },
    { name: 'ระบบและกระบวนการให้บริการ', positive: 134, negative: 67 },
    { name: 'เงื่อนไขและผลิตภัณฑ์', positive: 89, negative: 45 },
    { name: 'Market Conduct', positive: 23, negative: 12 },
    { name: 'อื่นๆ', positive: 67, negative: 34 },
  ].sort((a, b) => b.negative - a.negative);

  // Mock data for detailed categories (subcategories)
  const detailedCategories = [
    { name: 'ระบบ Core ของธนาคาร', category: 'เทคโนโลยีและดิจิทัล', positive: 45, negative: 78 },
    { name: 'ATM ADM CDM', category: 'เทคโนโลยีและดิจิทัล', positive: 34, negative: 56 },
    { name: 'ระบบเรียกคิวและจัดการคิว', category: 'ระบบและกระบวนการให้บริการ', positive: 67, negative: 45 },
    { name: 'พื้นที่และความคับคั่ง', category: 'สภาพแวดล้อมและสิ่งอำนวยความสะดวก', positive: 23, negative: 43 },
    { name: 'ความรวดเร็วในการให้บริการ', category: 'พนักงานและบุคลากร', positive: 89, negative: 41 },
    { name: 'อุณหภูมิ', category: 'สภาพแวดล้อมและสิ่งอำนวยความสะดวก', positive: 12, negative: 38 },
    { name: 'เครื่องนับเงิน', category: 'เทคโนโลยีและดิจิทัล', positive: 45, negative: 35 },
    { name: 'ที่จอดรถ', category: 'สภาพแวดล้อมและสิ่งอำนวยความสะดวก', positive: 56, negative: 32 },
    { name: 'กระบวนการให้บริการ', category: 'ระบบและกระบวนการให้บริการ', positive: 78, negative: 29 },
    { name: 'ระยะเวลาอนุมัติ', category: 'เงื่อนไขและผลิตภัณฑ์', positive: 34, negative: 28 },
    { name: 'ไม่เอาเปรียบ', category: 'Market Conduct', positive: 5, negative: 95 },
    { name: 'ไม่บังคับ', category: 'Market Conduct', positive: 8, negative: 87 },
  ].sort((a, b) => b.negative - a.negative).slice(0, 10);

  // ฟังก์ชันคำนวณสีพื้นหลังตามจำนวน negative
  const getBackgroundColor = (negative: number, name: string) => {
    // สำหรับ Market Conduct, ไม่เอาเปรียบ, ไม่บังคับ ให้ใช้สีแดงเข้มที่สุด
    if (name === 'Market Conduct' || name === 'ไม่เอาเปรียบ' || name === 'ไม่บังคับ') {
      return 'bg-red-900/30'; // สีแดงเข้มที่สุด
    }
    
    // คำนวณความเข้มของสีตามจำนวน negative
    const maxNegative = Math.max(...detailedCategories.map(item => item.negative));
    const intensity = negative / maxNegative;
    
    // สีจะเข้มขึ้นตามจำนวน negative
    if (intensity > 0.8) return 'bg-red-800/20';
    if (intensity > 0.6) return 'bg-red-700/20';
    if (intensity > 0.4) return 'bg-red-600/20';
    if (intensity > 0.2) return 'bg-red-500/20';
    return 'bg-red-400/20';
  };

  const handleViewDetails = (category: CategoryData, type: 'main' | 'sub') => {
    setSelectedCategory(category);
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
  };

  const handleViewFeedback = (region?: string) => {
    console.log(`Navigate to feedback page with region filter: ${region}`);
    // In a real implementation, this would use navigation with filters
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-foreground">หมวดหมู่ที่ถูกกล่าวถึง และ ทัศนคติ</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Types Ranking */}
        <Card className="chart-container-medium animate-fade-in">
          <CardHeader>
            <CardTitle className="card-title">อันดับประเภทที่ถูกกล่าวถึง</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {categoryTypes.map((item, index) => (
                <div 
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-lg border border-border/50 transition-colors ${getBackgroundColor(item.negative, item.name)}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">
                      {index + 1}
                    </div>
                    <span className="font-medium text-sm">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="font-medium">{item.positive}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <span className="font-medium">{item.negative}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Detailed Categories Ranking */}
        <Card className="chart-container-medium animate-fade-in">
          <CardHeader>
            <CardTitle className="card-title">อันดับหมวดหมู่ที่ถูกกล่าวถึง (10 อันดับแรก)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {detailedCategories.map((item, index) => (
                <div 
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-lg border border-border/50 transition-colors ${getBackgroundColor(item.negative, item.name)}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{item.name}</div>
                      <div className="text-xs text-muted-foreground">{item.category}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="font-medium">{item.positive}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <span className="font-medium">{item.negative}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sentiment Analysis Modal */}
      {isModalOpen && selectedCategory && (
        <SentimentAnalysisModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onViewFeedback={handleViewFeedback}
        />
      )}
    </div>
  );
};