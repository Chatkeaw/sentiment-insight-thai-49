import React from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, RotateCcw, FileText } from 'lucide-react';
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
}

// Mock data function
const getFlowAgentById = (id: string): FlowAgentData => {
  const mockData: Record<string, FlowAgentData> = {
    feedback_798: {
      id: "feedback_798",
      request_id: "REQ-2025-001",
      basic: {
        submitted_at: "2025-01-03T15:36:00Z"
      },
      branch: "ประชาชื่น",
      sub_branch: "ประชาชื่น 1",
      district: "บางเขน",
      region: "ภาค 1",
      province: "กรุงเทพฯ",
      service_type: "การชำระค่าบริการ/ค่าธรรมเนียม",
      scores: {
        trust: 4,
        consultation: 3,
        speed: 2,
        accuracy: 4,
        equipment: 3,
        environment: 4,
        overall: 3
      },
      customer_comment: "เครื่องชำระเงินเสียบ่อย ต้องซ่อม พนักงานช่วยได้แต่ใช้เวลานาน อุณหภูมิร้อน สถานที่คับแคบ ไม่มีที่จอดรถเพียงพอ",
      tags: ["เครื่องชำระเงิน", "พนักงาน", "สภาพแวดล้อม", "ที่จอดรถ", "อุณหภูมิ"]
    },
    feedback_784: {
      id: "feedback_784",
      request_id: "REQ-2025-002",
      submitted_at: "2025-01-02T10:22:00Z",
      branch: "เซ็นทรัล มหาชัย",
      sub_branch: "เซ็นทรัล มหาชัย",
      district: "สมุทรสาคร",
      region: "ภาค 4",
      province: "สมุทรสาคร",
      service_type: "บัตรเดบิต/บัตรเอทีเอ็ม",
      scores: {
        trust: 2,
        consultation: 1,
        speed: 1,
        accuracy: 2,
        equipment: 1,
        environment: 3,
        overall: 2
      },
      customer_comment: "เครื่อง ATM กลืนบัตรและตัดเงินซ้ำ ไม่มีเจ้าหน้าที่ช่วยทันที ต้องรอนาน ระบบล่าช้า",
      tags: ["ATM", "กลืนบัตร", "ตัดเงินซ้ำ", "เจ้าหน้าที่", "ระบบล่าช้า"]
    }
  };

  return mockData[id] || {
    id,
    request_id: `REQ-${id}`,
    created_at: new Date().toISOString(),
    branch: "ไม่ระบุ",
    sub_branch: "ไม่ระบุ",
    district: "ไม่ระบุ",
    region: "ไม่ระบุ",
    province: "ไม่ระบุ",
    service_type: "ไม่ระบุ",
    scores: {
      trust: 3,
      consultation: 3,
      speed: 3,
      accuracy: 3,
      equipment: 3,
      environment: 3,
      overall: 3
    },
    customer_comment: "ไม่มีความคิดเห็น",
    tags: []
  };
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
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} | ${pad(d.getHours())}:${pad(d.getMinutes())} น.`;
};

export const FlowAgentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  // Get data from state or mock
  const pageData = location.state || getFlowAgentById(id || '');
  const submittedText = formatThaiNumeric(resolveSubmittedAt(pageData));

  const handleBack = () => {
    navigate('/');
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const satisfactionLabels = [
    "ความน่าไว้วางใจ",
    "การให้คำปรึกษา", 
    "ความรวดเร็ว",
    "ความถูกต้อง",
    "อุปกรณ์",
    "สภาพแวดล้อม",
    "โดยรวม"
  ];

  const getScoreValue = (key: string): number => {
    const scoreMap: Record<string, keyof typeof pageData.scores> = {
      "ความน่าไว้วางใจ": "trust",
      "การให้คำปรึกษา": "consultation",
      "ความรวดเร็ว": "speed", 
      "ความถูกต้อง": "accuracy",
      "อุปกรณ์": "equipment",
      "สภาพแวดล้อม": "environment",
      "โดยรวม": "overall"
    };
    
    return pageData.scores?.[scoreMap[key]] || 3;
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Navbar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBack}
                  className="rounded-full w-10 h-10 p-0 border-[#F9CADF] hover:bg-[#F9CADF]"
                >
                  <ArrowLeft className="w-4 h-4 text-[#C0245E]" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>กลับสู่ข้อร้องเรียน</TooltipContent>
            </Tooltip>
            <h1 className="text-2xl font-bold text-[#7A3443]">ประวัติการประมวล Flow ด้วย Agent</h1>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                className="rounded-full w-10 h-10 p-0 border-[#F9CADF] hover:bg-[#F9CADF]"
              >
                <RotateCcw className="w-4 h-4 text-[#C0245E]" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>รีเฟรช</TooltipContent>
          </Tooltip>
        </div>

        {/* ข้อมูลพื้นฐาน Card */}
        <Card className="rounded-2xl shadow-sm border border-[#F9CADF] bg-white p-5 md:p-6">
          <CardHeader className="pb-4">
            <CardTitle className="font-semibold text-[#7A3443]">ข้อมูลพื้นฐาน</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Request ID</label>
                <p className="text-[#C0245E] font-medium">{pageData.request_id || pageData.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">เวลาที่ส่งข้อเสนอแนะ</label>
                <p className="text-[#C0245E] font-medium">{submittedText}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* พื้นที่ให้บริการ Card */}
        <Card className="rounded-2xl shadow-sm border border-[#F9CADF] bg-white p-5 md:p-6">
          <CardHeader className="pb-4">
            <CardTitle className="font-semibold text-[#7A3443]">พื้นที่ให้บริการ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">สาขา</label>
                <p className="text-foreground">{pageData.branch || 'ไม่ระบุ'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">สาขาย่อย</label>
                <p className="text-foreground">{pageData.sub_branch || 'ไม่ระบุ'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">เขต</label>
                <p className="text-foreground">{pageData.district || 'ไม่ระบุ'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">ภาค</label>
                <p className="text-foreground">{pageData.region || 'ไม่ระบุ'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">จังหวัด</label>
                <p className="text-foreground">{pageData.province || 'ไม่ระบุ'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">ประเภทบริการ</label>
                <p className="text-foreground">{pageData.service_type || 'ไม่ระบุ'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ความพึงพอใจ Card */}
        <Card className="rounded-2xl shadow-sm border border-[#F9CADF] bg-white p-5 md:p-6">
          <CardHeader className="pb-4">
            <CardTitle className="font-semibold text-[#7A3443]">ความพึงพอใจ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {satisfactionLabels.map((label) => {
                const score = getScoreValue(label);
                return (
                  <div key={label} className="text-center">
                    <label className="text-xs font-medium text-muted-foreground block mb-2">
                      {label}
                    </label>
                    <div className="text-lg font-bold">
                      <span className="text-[#C0245E]">{score}</span>
                      <span className="text-muted-foreground">/5</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* ความคิดเห็นลูกค้า Card */}
        <Card className="rounded-2xl shadow-sm border border-[#F9CADF] bg-white p-5 md:p-6">
          <CardHeader className="pb-4">
            <CardTitle className="font-semibold text-[#7A3443]">ความคิดเห็นลูกค้า</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Comment Box */}
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-foreground leading-relaxed">
                {pageData.customer_comment || pageData.comment || 'ไม่มีความคิดเห็น'}
              </p>
            </div>
            
            {/* Tags */}
            {(pageData.tags && pageData.tags.length > 0) && (
              <div>
                <label className="text-sm font-medium text-muted-foreground block mb-2">
                  การจำแนกประเภทความคิดเห็น
                </label>
                <div className="flex flex-wrap">
                  {pageData.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm mr-2 mb-2 bg-[#FFE0EA] border border-[#F9CADF] text-[#8C1F45] hover:bg-[#FFE0EA]"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
};

export default FlowAgentDetailPage;