
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface SentimentAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewFeedback: (region?: string) => void;
}

// Topic categories mapping
const topicCategories = {
  'พนักงานและบุคลากร': [
    'ความสุภาพและมารยาทของพนักงาน',
    'ความเอาใจใส่ในการให้บริการลูกค้า',
    'ความรวดเร็วในการให้บริการ',
    'ความแม่นยำในการให้บริการ',
    'ความเป็นมืออาชีพ',
    'การให้คำปรึกษา',
    'ภาพลักษณ์และบุคลิกภาพ',
    'ความปลอดภัย'
  ],
  'ระบบและกระบวนการให้บริการ': [
    'ความพร้อมในการให้บริการ',
    'กระบวนการให้บริการ',
    'ระบบเรียกคิวและจัดการคิว',
    'เอกสารและขั้นตอน'
  ],
  'เทคโนโลยีและดิจิทัล': [
    'ระบบ Core ของธนาคาร',
    'ระบบเรียกคิวและจัดการคิว',
    'ATM ADM CDM',
    'ระบบ KYC',
    'แอปพลิเคชัน',
    'การอัพเดทสมุดบัญชี',
    'เครื่องนับเงิน'
  ],
  'เงื่อนไขและผลิตภัณฑ์': [
    'รายละเอียดผลิตภัณฑ์',
    'เงื่อนไขและข้อกำหนด',
    'ระยะเวลาอนุมัติ',
    'ความยืดหยุ่น',
    'ความเรียบง่าย'
  ],
  'สภาพแวดล้อมและสิ่งอำนวยความสะดวก': [
    'ความสะอาด',
    'พื้นที่และความคับคั่ง',
    'อุณหภูมิ',
    'โต๊ะและอุปกรณ์',
    'พื้นที่รอคิว',
    'แสงสว่าง',
    'เสียง',
    'ห้องน้ำ',
    'ที่จอดรถ',
    'ป้ายบอกทาง',
    'สิ่งอำนวยความสะดวกอื่นๆ'
  ],
  'Market Conduct': [
    'ไม่เอาเปรียบ',
    'ไม่บังคับ',
    'ไม่หลอกลวง',
    'ไม่รบกวน'
  ],
  'อื่นๆ': [
    'ภาพรวมทั่วไป'
  ]
};

export const SentimentAnalysisModal: React.FC<SentimentAnalysisModalProps> = ({
  isOpen,
  onClose,
  onViewFeedback,
}) => {
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  // Mock trend data
  const trendData = Array.from({ length: 12 }, (_, i) => ({
    month: `${i + 1}`,
    positive: Math.floor(Math.random() * 30) + 40,
    negative: Math.floor(Math.random() * 20) + 15,
  }));

  // Get available categories for selected topic
  const getAvailableCategories = (topic: string) => {
    return topicCategories[topic as keyof typeof topicCategories] || [];
  };

  // Handle topic change
  const handleTopicChange = (value: string) => {
    setSelectedTopic(value);
    setSelectedCategory(''); // Reset category when topic changes
  };

  // Handle category change
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
  };

  const availableCategories = getAvailableCategories(selectedTopic);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            วิเคราะห์ข้อมูลความคิดเห็นของลูกค้าตามหัวข้อและหมวดหมู่ที่เลือก
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Filter Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">ตัวกรอง</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* หัวข้อการประเมิน */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    หัวข้อการประเมิน
                  </label>
                  <Select value={selectedTopic} onValueChange={handleTopicChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="เลือกหัวข้อ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="พนักงานและบุคลากร">1. พนักงานและบุคลากร</SelectItem>
                      <SelectItem value="ระบบและกระบวนการให้บริการ">2. ระบบและกระบวนการให้บริการ</SelectItem>
                      <SelectItem value="เทคโนโลยีและดิจิทัล">3. เทคโนโลยีและดิจิทัล</SelectItem>
                      <SelectItem value="เงื่อนไขและผลิตภัณฑ์">4. เงื่อนไขและผลิตภัณฑ์</SelectItem>
                      <SelectItem value="สภาพแวดล้อมและสิ่งอำนวยความสะดวก">5. สภาพแวดล้อมและสิ่งอำนวยความสะดวก</SelectItem>
                      <SelectItem value="Market Conduct">6. Market Conduct</SelectItem>
                      <SelectItem value="อื่นๆ">7. อื่นๆ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* หมวดหมู่ที่กล่าวถึง */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    หมวดหมู่ที่กล่าวถึง
                  </label>
                  <Select 
                    value={selectedCategory} 
                    onValueChange={handleCategoryChange}
                    disabled={!selectedTopic}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="เลือกหมวดหมู่" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableCategories.map((category, index) => (
                        <SelectItem key={index} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Applied Filters Display */}
              {(selectedTopic || selectedCategory) && (
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <div className="text-sm font-medium mb-2">ตัวกรองที่เลือก:</div>
                  <div className="flex flex-wrap gap-2">
                    {selectedTopic && (
                      <span className="px-3 py-1 bg-primary text-primary-foreground rounded-full text-xs">
                        หัวข้อ: {selectedTopic}
                      </span>
                    )}
                    {selectedCategory && (
                      <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs">
                        หมวดหมู่: {selectedCategory}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Sentiment Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">แนวโน้มทัศนคติของลูกค้า</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="month"
                    label={{ value: 'เดือน', position: 'insideBottom', offset: -10 }}
                    fontSize={12}
                  />
                  <YAxis 
                    label={{ value: 'ความถี่ (ครั้ง)', angle: -90, position: 'insideLeft' }}
                    fontSize={12}
                  />
                  <Tooltip 
                    formatter={(value, name) => [`${value} ครั้ง`, name === 'positive' ? 'เชิงบวก' : 'เชิงลบ']}
                    labelFormatter={(label) => `เดือน: ${label}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="positive" 
                    stroke="#10B981" 
                    strokeWidth={3}
                    dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                    name="positive"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="negative" 
                    stroke="#EF4444" 
                    strokeWidth={3}
                    dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
                    name="negative"
                  />
                  <Legend 
                    formatter={(value) => value === 'positive' ? 'เชิงบวก' : 'เชิงลบ'}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Sample Data Display */}
          {(selectedTopic || selectedCategory) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">ข้อมูลตัวอย่าง</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">124</div>
                      <div className="text-sm text-muted-foreground">ความคิดเห็นเชิงบวก</div>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">56</div>
                      <div className="text-sm text-muted-foreground">ความคิดเห็นเชิงลบ</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-600">23</div>
                      <div className="text-sm text-muted-foreground">ความคิดเห็นที่เป็นกลาง</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              ปิด
            </Button>
            <Button 
              onClick={() => onViewFeedback()}
              className="bg-primary hover:bg-primary/90"
            >
              ดูความคิดเห็นทั้งหมด
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
