
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
  // Generate mock data for regional comparison of this specific topic
  const regionalData = Array.from({ length: 18 }, (_, i) => ({
    name: `ภาค${i + 1}`,
    value: Math.random() * 2 + 3, // Random score between 3-5
  }));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-semibold">
            หัวข้อที่ใช้ประเมิน
          </DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="text-sm text-muted-foreground">
            รายละเอียดการประเมินความพึงพอใจในแต่ละหัวข้อและข้อมูลเปรียบเทียบ
          </div>

          {/* Topic Score Card */}
          <Card className="bg-purple-50">
            <CardContent className="p-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-foreground">
                  คะแนนความพึงพอใจเฉลี่ย ทุกภาค
                </h3>
                <div className="text-4xl font-bold text-foreground">
                  {score.toFixed(2)}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-green-600 font-medium">↗ 2.80%</span>
                  <span className="text-muted-foreground">
                    (ค่าเฉลี่ยจากเดือนที่แล้ว {(score - 0.1).toFixed(2)} คะแนน)
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Topic Name */}
          <div>
            <h3 className="text-lg font-medium text-foreground mb-4">{topic}</h3>
          </div>

          {/* Regional Comparison Chart */}
          <Card>
            <CardHeader>
              <CardTitle>{topic}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={regionalData} margin={{ bottom: 40 }}>
                  <XAxis 
                    dataKey="name" 
                    fontSize={12}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis 
                    domain={[0, 5]}
                    label={{ value: 'คะแนน', angle: -90, position: 'insideLeft' }}
                    fontSize={12}
                  />
                  <Tooltip 
                    formatter={(value) => [`${Number(value).toFixed(1)}`, 'คะแนน']}
                    labelFormatter={(label) => `${label}`}
                  />
                  <Bar 
                    dataKey="value" 
                    fill="hsl(var(--primary))" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
