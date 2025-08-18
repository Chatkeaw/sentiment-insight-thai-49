import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Button } from '@/components/ui/button';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';

interface SentimentAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewFeedback?: (region?: string) => void;
}

export const SentimentAnalysisModal: React.FC<SentimentAnalysisModalProps> = ({
  isOpen,
  onClose,
  onViewFeedback,
}) => {
  // Mock data for 6 months trend
  const trendData = [
    { month: 'ม.ค. 67', positive: 232, negative: 78 },
    { month: 'ก.พ. 67', positive: 267, negative: 102 },
    { month: 'มี.ค. 67', positive: 245, negative: 89 },
    { month: 'เม.ย. 67', positive: 201, negative: 76 },
    { month: 'พ.ค. 67', positive: 198, negative: 65 },
    { month: 'มิ.ย. 68', positive: 312, negative: 149 }
  ];

  // Monthly change data
  const monthlyChange = {
    total: {
      current: 364,
      previous: 301,
      change: 21,
      changePercent: 44,
      isIncrease: true
    },
    positive: {
      current: 406,
      previous: 472,
      change: -14,
      changePercent: 87,
      isIncrease: false
    },
    negative: {
      current: 87,
      previous: 178,
      change: -51,
      changePercent: 44,
      isIncrease: false
    }
  };

  // Regional breakdown data (18 regions)
  const regionalData = [
    { region: 'ภาค 1', total: 78, positive: 41, negative: 15 },
    { region: 'ภาค 2', total: 79, positive: 50, negative: 18 },
    { region: 'ภาค 3', total: 86, positive: 48, negative: 30 },
    { region: 'ภาค 4', total: 81, positive: 50, negative: 15 },
    { region: 'ภาค 5', total: 71, positive: 43, negative: 22 },
    { region: 'ภาค 6', total: 65, positive: 38, negative: 15 },
    { region: 'ภาค 7', total: 73, positive: 45, negative: 14 },
    { region: 'ภาค 8', total: 69, positive: 41, negative: 15 },
    { region: 'ภาค 9', total: 82, positive: 52, negative: 12 },
    { region: 'ภาค 10', total: 77, positive: 44, negative: 14 },
    { region: 'ภาค 11', total: 84, positive: 49, negative: 14 },
    { region: 'ภาค 12', total: 76, positive: 46, negative: 14 },
    { region: 'ภาค 13', total: 88, positive: 53, negative: 15 },
    { region: 'ภาค 14', total: 74, positive: 42, negative: 15 },
    { region: 'ภาค 15', total: 80, positive: 48, negative: 14 },
    { region: 'ภาค 16', total: 75, positive: 44, negative: 15 },
    { region: 'ภาค 17', total: 83, positive: 51, negative: 13 },
    { region: 'ภาค 18', total: 72, positive: 43, negative: 14 }
  ];

  const handleViewFeedback = (region?: string) => {
    if (onViewFeedback) {
      onViewFeedback(region);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-xl font-semibold">
            ประเภท / หมวดหมู่ ความคิดเห็น : ทั้งหมด
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            วิเคราะห์ข้อมูลความคิดเห็นของลูกค้าตามหัวข้อและหมวดหมู่ที่เลือก
          </p>
        </DialogHeader>
        
        <div className="space-y-8">
          {/* Sentiment Trend Chart */}
          <Card className="border rounded-2xl shadow-none">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                แนวโน้มทัศนคติของลูกค้า
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={trendData} margin={{ top: 20, right: 80, left: 20, bottom: 20 }}>
                  <XAxis 
                    dataKey="month" 
                    fontSize={12}
                    tick={{ fill: 'hsl(var(--foreground))' }}
                  />
                  <YAxis 
                    fontSize={12}
                    tick={{ fill: 'hsl(var(--foreground))' }}
                    domain={[0, 400]}
                  />
                  <Tooltip 
                    formatter={(value, name) => [
                      `${value} ครั้ง`, 
                      name === 'positive' ? 'เชิงบวก' : 'เชิงลบ'
                    ]}
                    labelFormatter={(label) => `${label}`}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="positive"
                    stroke="#10B981"
                    strokeWidth={3}
                    dot={{ fill: '#10B981', strokeWidth: 2, r: 6 }}
                    fill="#10B981"
                    fillOpacity={0.1}
                  />
                  <Line
                    type="monotone"
                    dataKey="negative"
                    stroke="#EF4444"
                    strokeWidth={3}
                    dot={{ fill: '#EF4444', strokeWidth: 2, r: 6 }}
                    fill="#EF4444"
                    fillOpacity={0.1}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Monthly Change Cards */}
          <div>
            <h3 className="text-lg font-semibold mb-4">การเปลี่ยนแปลงรายเดือน</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Total Comments Card */}
              <Card className="bg-gradient-to-b from-gray-100 to-gray-50 border rounded-2xl shadow-none">
                <CardContent className="p-6">
                  <h4 className="text-white font-medium mb-4 bg-gray-600 px-3 py-2 rounded-lg">
                    จำนวนความคิดเห็นที่กล่าวถึง
                  </h4>
                  <div className="text-4xl font-bold text-gray-800 mb-2">
                    {monthlyChange.total.current}
                  </div>
                  <div className="flex items-center gap-2 text-sm mb-2">
                    {monthlyChange.total.isIncrease ? (
                      <ArrowUpIcon className="w-4 h-4 text-green-600" />
                    ) : (
                      <ArrowDownIcon className="w-4 h-4 text-red-600" />
                    )}
                    <span className={monthlyChange.total.isIncrease ? "text-green-600" : "text-red-600"}>
                      เพิ่มขึ้น {monthlyChange.total.change}% จาก {monthlyChange.total.previous} (1 เดือนก่อนหน้า)
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    ลดลง {monthlyChange.total.changePercent}% จาก 653 (3 เดือนก่อนหน้า)
                  </p>
                </CardContent>
              </Card>

              {/* Positive Comments Card */}
              <Card className="bg-gradient-to-b from-green-100 to-green-50 border rounded-2xl shadow-none">
                <CardContent className="p-6">
                  <h4 className="text-white font-medium mb-4 bg-green-600 px-3 py-2 rounded-lg">
                    จำนวนความคิดเห็นเชิงบวก
                  </h4>
                  <div className="text-4xl font-bold text-green-800 mb-2">
                    {monthlyChange.positive.current}
                  </div>
                  <div className="flex items-center gap-2 text-sm mb-2">
                    <ArrowDownIcon className="w-4 h-4 text-red-600" />
                    <span className="text-red-600">
                      ลดลง {Math.abs(monthlyChange.positive.change)}% จาก {monthlyChange.positive.previous} (1 เดือนก่อนหน้า)
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    เพิ่มขึ้น {monthlyChange.positive.changePercent}% จาก 217 (3 เดือนก่อนหน้า)
                  </p>
                </CardContent>
              </Card>

              {/* Negative Comments Card */}
              <Card className="bg-gradient-to-b from-red-100 to-red-50 border rounded-2xl shadow-none">
                <CardContent className="p-6">
                  <h4 className="text-white font-medium mb-4 bg-red-600 px-3 py-2 rounded-lg">
                    จำนวนความคิดเห็นเชิงลบ
                  </h4>
                  <div className="text-4xl font-bold text-red-800 mb-2">
                    {monthlyChange.negative.current}
                  </div>
                  <div className="flex items-center gap-2 text-sm mb-2">
                    <ArrowDownIcon className="w-4 h-4 text-green-600" />
                    <span className="text-green-600">
                      ลดลง {Math.abs(monthlyChange.negative.change)}% จาก {monthlyChange.negative.previous} (1 เดือนก่อนหน้า)
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    ลดลง {monthlyChange.negative.changePercent}% จาก 156 (3 เดือนก่อนหน้า)
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Regional Breakdown Table */}
          <Card className="border rounded-2xl shadow-none">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                การแจกแจงรายภาค
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-4 px-4 font-medium text-muted-foreground">ภาค</th>
                      <th className="text-center py-4 px-4 font-medium text-muted-foreground">ความคิดเห็น</th>
                      <th className="text-center py-4 px-4">
                        <div className="flex flex-col items-center">
                          <span className="text-muted-foreground">ทั้งหมด</span>
                        </div>
                      </th>
                      <th className="text-center py-4 px-4">
                        <div className="flex flex-col items-center">
                          <span className="text-muted-foreground">เชิงบวก</span>
                        </div>
                      </th>
                      <th className="text-center py-4 px-4">
                        <div className="flex flex-col items-center">
                          <span className="text-muted-foreground">เชิงลบ</span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {regionalData.map((region, index) => (
                      <tr key={index} className="border-b hover:bg-muted/30 transition-colors">
                        <td className="py-4 px-4 font-medium">{region.region}</td>
                        <td className="py-4 px-4 text-center">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs"
                            onClick={() => handleViewFeedback(region.region)}
                          >
                            ดูความคิดเห็น
                          </Button>
                        </td>
                        <td className="py-4 px-4 text-center font-bold">{region.total}</td>
                        <td className="py-4 px-4 text-center font-bold text-green-600">{region.positive}</td>
                        <td className="py-4 px-4 text-center font-bold text-red-600 underline">{region.negative}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
