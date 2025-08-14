
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SatisfactionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  topic: string;
  score: number;
}

export const SatisfactionDetailModal: React.FC<SatisfactionDetailModalProps> = ({
  isOpen,
  onClose,
  topic,
  score
}) => {
  // Define all 7 satisfaction topics with their scores
  const satisfactionTopics = [
    { name: "การดูแล เอาใจใส่ ความสบายใจเมื่อมาใช้บริการ", score: 3.85 },
    { name: "การตอบคำถาม ให้คำแนะนำ ความน่าเชื่อถือ ความเป็นมืออาชีพ", score: 3.92 },
    { name: "ความรวดเร็วในการให้บริการ (หลังเรียกคิว)", score: 3.78 },
    { name: "ความถูกต้องในการทำธุรกรรม", score: 4.15 },
    { name: "ความพร้อมของเครื่องมือให้บริการ", score: 3.67 },
    { name: "สภาพแวดล้อมของสาขา", score: 3.89 },
    { name: "ความพึงพอใจในการเข้าใช้บริการสาขา", score: 3.81 }
  ];

  // Generate regional data for each topic
  const generateRegionalData = (topicScore: number) => {
    return Array.from({ length: 18 }, (_, i) => ({
      name: `ภาค${i + 1}`,
      value: topicScore + (Math.random() * 0.8 - 0.4), // Random variation around topic score
      previousValue: topicScore + (Math.random() * 0.8 - 0.4) - 0.1, // Previous month slightly lower
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-semibold">
            หัวข้อที่ใช้ประเมิน
          </DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="space-y-8">
          <div className="text-sm text-muted-foreground">
            รายละเอียดการประเมินความพึงพอใจในแต่ละหัวข้อและข้อมูลเปรียบเทียบรายภาค
          </div>

          {/* Display each satisfaction topic */}
          {satisfactionTopics.map((topicData, index) => {
            const regionalData = generateRegionalData(topicData.score);
            
            return (
              <div className="space-y-6">
                {/* ชื่อหัวข้อ */}
                <h2 className="text-lg font-semibold text-foreground">
                  {topicData.name}
                </h2>
              
                {/* Card คะแนน */}
                <Card className="bg-gradient-to-b from-purple-50 to-white rounded-2xl shadow-none flex items-center justify-center">
                  <CardContent className="p-6 flex flex-col justify-center items-center text-center">
                    <div className="text-4xl font-bold text-foreground">
                      {topicData.score.toFixed(2)}
                    </div>
                    <div className="flex items-center gap-2 text-sm mt-2">
                      <span className="text-green-600 font-medium">↗ 2.80%</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      (จากเดือนก่อนหน้า {(topicData.score - 0.1).toFixed(2)} คะแนน)
                    </p>
                  </CardContent>
                </Card>
              
                {/* Regional Comparison Chart */}
                <Card className="border rounded-2xl shadow-none">
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={regionalData} margin={{ top: 40, bottom: 40 }} barCategoryGap="20%">
                        <XAxis 
                          dataKey="name" 
                          fontSize={12}
                          tick={{ fill: 'hsl(var(--foreground))' }}
                          angle={-45}
                          textAnchor="end"
                          height={80}
                        />
                        <YAxis 
                          domain={[0, 5]}
                          interval={0} // แสดง 0-5 ครบ
                          fontSize={12}
                          tick={{ fill: 'hsl(var(--foreground))' }}
                          label={{ value: 'คะแนน', angle: -90, position: 'insideLeft' }}
                        />
                        <Tooltip 
                          formatter={(value, name) => [
                            `${Number(value).toFixed(1)}`, 
                            name === 'previousValue' ? 'เดือนก่อนหน้า' : 'เดือนปัจจุบัน'
                          ]}
                          labelFormatter={(label) => `${label}`}
                          contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                          }}
                        />
                        <Bar dataKey="previousValue" name="previousValue" fill="#D1D5DB" radius={[2, 2, 0, 0]} />
                        <Bar dataKey="value" name="value" fill="#EC4899" radius={[2, 2, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

                
                {/* Add separator between topics except for the last one */}
                {index < satisfactionTopics.length - 1 && (
                  <hr className="border-gray-200 my-8" />
                )}
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};
