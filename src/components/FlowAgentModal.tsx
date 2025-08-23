import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, RefreshCw } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface FlowAgentData {
  id: string;
  request_id?: string;
  basic?: {
    submitted_at?: string;
  };
  submitted_at?: string;
  created_at?: string;
  branch?: string;
  sub_branch?: string;
  district?: string;
  region?: string;
  province?: string;
  service_type?: string;
  scores?: {
    trust?: number;
    consultation?: number;
    speed?: number;
    accuracy?: number;
    equipment?: number;
    environment?: number;
    overall?: number;
  };
  customer_comment?: string;
  tags?: string[];
  sentiment?: 'positive' | 'negative';
}

interface FlowAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  feedbackId?: string;
  initialData?: any;
}

// Mock data function with more examples
const getFlowAgentById = (id: string): FlowAgentData => {
  const mockData: Record<string, FlowAgentData> = {
    feedback_183: {
      id: "feedback_183",
      request_id: "2e8149a9-9612-4d21-b57c-3a2cadc911fd",
      basic: {
        submitted_at: "2025-01-03T15:36:00Z"
      },
      branch: "สาขา 10/ท่าบ่อ",
      sub_branch: "—",
      district: "ท่าบ่อ",
      region: "ภาค 10",
      province: "หนองคาย",
      service_type: "ฝากเงิน/ถอนเงิน ATM",
      scores: {
        trust: 1,
        consultation: 3,
        speed: 4,
        accuracy: 2,
        equipment: 5,
        environment: 3,
        overall: 3
      },
      customer_comment: "พนักงานพูดจาดี แต่ควรเพิ่มเครื่องและความเร็ว",
      tags: [
        "กระบวนการให้บริการ: ความพร้อมในการให้บริการ (เชิงลบ)",
        "พนักงานและบุคลากร: ความรวดเร็วในการให้บริการ (เชิงลบ)"
      ],
      sentiment: 'negative'
    },
    feedback_131: {
      id: "feedback_131",
      request_id: "REQ-2025-131",
      basic: {
        submitted_at: "2025-01-02T14:22:00Z"
      },
      branch: "สาขาใหญ่สีลม",
      sub_branch: "สีลม 1",
      district: "บางรัก",
      region: "ภาค 1",
      province: "กรุงเทพฯ",
      service_type: "บัญชีเงินฝาก",
      scores: {
        trust: 5,
        consultation: 4,
        speed: 5,
        accuracy: 5,
        equipment: 4,
        environment: 5,
        overall: 5
      },
      customer_comment: "บริการดีเยี่ยม พนักงานใจดี ให้คำแนะนำดี สถานที่สะอาด",
      tags: [
        "พนักงานและบุคลากร: การให้บริการ (เชิงบวก)",
        "สภาพแวดล้อม: ความสะอาด (เชิงบวก)"
      ],
      sentiment: 'positive'
    },
    feedback_19: {
      id: "feedback_19",
      request_id: "REQ-2025-019",
      basic: {
        submitted_at: "2025-01-01T09:15:00Z"
      },
      branch: "สาขาเซ็นทรัลลาดพร้าว",
      sub_branch: "เซ็นทรัลลาดพร้าว",
      district: "จตุจักร",
      region: "ภาค 1",
      province: "กรุงเทพฯ",
      service_type: "โมบายแอป",
      scores: {
        trust: 5,
        consultation: 5,
        speed: 4,
        accuracy: 5,
        equipment: 5,
        environment: 4,
        overall: 5
      },
      customer_comment: "แอปใช้งานง่าย อัพเดทใหม่ทำให้เร็วขึ้น ประทับใจมาก UI สวยงามดี",
      tags: [
        "เทคโนโลยีและดิจิทัล: การใช้งานแอป (เชิงบวก)",
        "เทคโนโลยีและดิจิทัล: ประสบการณ์ผู้ใช้ (เชิงบวก)"
      ],
      sentiment: 'positive'
    }
  };

  // If ID not found, return a random positive or negative example
  if (!mockData[id]) {
    const examples = Object.values(mockData);
    return examples[Math.floor(Math.random() * examples.length)];
  }

  return mockData[id];
};

// Utility functions
const pad = (n: number): string => String(n).padStart(2, '0');

const resolveSubmittedAt = (state: any): string => {
  return (
    state?.basic?.submitted_at ??
    state?.submitted_at ??
    state?.created_at ??
    state?.state?.created_at ??
    new Date().toISOString()
  );
};

const formatThaiNumeric = (raw: string): string => {
  const d = new Date(raw);
  if (isNaN(d.getTime())) return formatThaiNumeric(new Date().toISOString());
  
  const monthNames = [
    'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
    'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
  ];
  
  return `${pad(d.getDate())} ${monthNames[d.getMonth()]} ${d.getFullYear()} | ${pad(d.getHours())}:${pad(d.getMinutes())} น.`;
};

const FlowAgentModal: React.FC<FlowAgentModalProps> = ({ 
  isOpen, 
  onClose, 
  feedbackId, 
  initialData 
}) => {
  const [data, setData] = useState<FlowAgentData | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setData(initialData);
      } else if (feedbackId) {
        setData(getFlowAgentById(feedbackId));
      }
    }
  }, [isOpen, feedbackId, initialData]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleRefresh = () => {
    if (feedbackId) {
      setData(getFlowAgentById(feedbackId));
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen || !data) return null;

  const submittedText = formatThaiNumeric(resolveSubmittedAt(data));

  const satisfactionLabels = [
    { key: "trust", label: "ความสนใจในสิ่งที่ได้รับ" },
    { key: "consultation", label: "การให้คำปรึกษา" },
    { key: "speed", label: "ความรวดเร็ว" },
    { key: "accuracy", label: "ความถูกต้อง" },
    { key: "equipment", label: "อุปกรณ์" },
    { key: "environment", label: "สภาพแวดล้อม" },
    { key: "overall", label: "โดยรวม" }
  ];

  const getScoreValue = (key: string): number => {
    const scoreMap: Record<string, keyof typeof data.scores> = {
      "trust": "trust",
      "consultation": "consultation", 
      "speed": "speed",
      "accuracy": "accuracy",
      "equipment": "equipment",
      "environment": "environment",
      "overall": "overall"
    };
    
    return data.scores?.[scoreMap[key]] || 3;
  };

  // Process tags into categories
  const processCategories = (tags: string[]) => {
    const categories: Record<string, any[]> = {};
    
    tags.forEach(tag => {
      const parts = tag.split(':');
      const category = parts[0]?.trim() || 'อื่นๆ';
      const detail = parts[1]?.trim() || tag;
      const isNegative = detail.includes('เชิงลบ');
      
      if (!categories[category]) {
        categories[category] = [];
      }
      
      categories[category].push({
        title: detail.replace(/\s*\(เชิงลบ\)|\s*\(เชิงบวก\)/g, ''),
        polarity: isNegative ? 'negative' : 'positive'
      });
    });
    
    return Object.entries(categories).map(([title, items]) => ({ title, items }));
  };

  const categories = data.tags ? processCategories(data.tags) : [];

  return (
    <TooltipProvider>
        <div 
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={handleBackdropClick}
        >
        <div 
          className="bg-[#FFEAF2] border border-[#FAD1DE] rounded-3xl shadow-xl max-w-6xl w-full max-h-[85vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="border-b border-[#FAD1DE]/60 p-6 md:p-8 pb-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-[#7A3443]">
                ประวัติการประมวล Flow ด้วย Agent
              </h2>
              <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleRefresh}
                      className="w-8 h-8 p-0 text-[#7A3443] hover:bg-[#FAD1DE]/30"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>รีเฟรช</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onClose}
                      className="w-8 h-8 p-0 text-[#7A3443] hover:bg-[#FAD1DE]/30"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>ปิด</TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(85vh-120px)]">
            <div className="p-6 md:p-8 pt-6 relative">
              {/* Status Badge */}
              <div className="absolute top-4 right-6 md:right-8">
                <Badge 
                  className={`border-2 text-xs px-3 py-1 ${
                    data.sentiment === 'positive' 
                      ? 'border-green-300 text-green-600 bg-green-50/50' 
                      : 'border-rose-300 text-rose-600 bg-rose-50/50'
                  }`}
                >
                  {data.sentiment === 'positive' ? 'Positive' : 'Negative'}
                </Badge>
              </div>

              {/* Grid Layout */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-8">
                {/* Left Column */}
                <div className="md:col-span-5 space-y-6">
                  {/* ID */}
                  <div className="bg-white/60 border border-[#FAD1DE] rounded-2xl px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-600">ID:</span>
                      <span className="text-sm text-[#7A3443] break-all font-medium">
                        {data.request_id || data.id}
                      </span>
                    </div>
                  </div>

                  {/* Timestamp */}
                  <div className="bg-white/60 border border-[#FAD1DE] rounded-2xl px-4 py-3">
                    <div className="space-y-1">
                      <span className="text-sm font-medium text-gray-600 block">เวลาที่ส่งข้อเสนอแนะ</span>
                      <span className="text-sm text-[#7A3443] font-medium">{submittedText}</span>
                    </div>
                  </div>

                  {/* Service Area */}
                  <div className="bg-white/60 border border-[#FAD1DE] rounded-2xl px-4 py-3 space-y-2">
                    <h3 className="text-sm font-semibold text-[#7A3443] mb-3">พื้นที่ให้บริการ</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">สายกิ่ง:</span>
                        <span className="text-[#7A3443] font-medium">{data.branch || 'ไม่ระบุ'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">ภาค:</span>
                        <span className="text-[#7A3443] font-medium">{data.region || 'ไม่ระบุ'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">จังหวัด:</span>
                        <span className="text-[#7A3443] font-medium">{data.province || 'ไม่ระบุ'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">เขต:</span>
                        <span className="text-[#7A3443] font-medium">{data.district || 'ไม่ระบุ'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">สาขา:</span>
                        <span className="text-[#7A3443] font-medium">{data.sub_branch || 'ไม่ระบุ'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Service Type */}
                  <div className="bg-white/60 border border-[#FAD1DE] rounded-2xl px-4 py-3">
                    <div className="space-y-2">
                      <span className="text-sm font-medium text-gray-600 block">ประเภทที่ใช้บริการ</span>
                      <Badge className="bg-[#FFEAF2] text-[#7A3443] border-[#FAD1DE] hover:bg-[#FFEAF2]">
                        {data.service_type || 'ไม่ระบุ'}
                      </Badge>
                    </div>
                  </div>

                  {/* Satisfaction Scores */}
                  <div className="bg-white/60 border border-[#FAD1DE] rounded-2xl px-4 py-3">
                    <h3 className="text-sm font-semibold text-[#7A3443] mb-3">ความพึงพอใจ</h3>
                    <div className="space-y-2">
                      {satisfactionLabels.map(({ key, label }) => {
                        const score = getScoreValue(key);
                        return (
                          <div key={key} className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">{label}</span>
                            <span className="text-sm font-semibold text-[#7A3443]">{score}/5</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="md:col-span-7 space-y-6">
                  {/* Customer Comment */}
                  <div className="bg-white/70 border border-[#FAD1DE] rounded-2xl px-4 py-3">
                    <h3 className="text-sm font-semibold text-[#7A3443] mb-3">ความคิดเห็น</h3>
                    <p className="text-sm text-[#444] leading-relaxed">
                      {data.customer_comment || 'ไม่มีความคิดเห็น'}
                    </p>
                  </div>

                  {/* Classifications */}
                  {categories.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold text-[#7A3443]">การจำแนกประเภทความคิดเห็น</h3>
                      {categories.map((category, categoryIndex) => (
                        <div 
                          key={categoryIndex}
                          className="border-2 border-rose-300 bg-[#FFEAF2]/70 rounded-2xl px-4 py-3 space-y-2"
                        >
                          <h4 className="font-semibold text-[#7A3443] text-sm">{category.title}</h4>
                          {category.items.map((item, itemIndex) => (
                            <div key={itemIndex} className="flex justify-between items-center">
                              <span className="text-sm font-medium text-rose-700">{item.title}</span>
                              <Badge 
                                className={`text-xs px-2 py-1 ${
                                  item.polarity === 'positive'
                                    ? 'bg-green-200 text-green-700 border-0'
                                    : 'bg-rose-200 text-rose-700 border-0'
                                }`}
                              >
                                {item.polarity === 'positive' ? 'เชิงบวก' : 'เชิงลบ'}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default FlowAgentModal;