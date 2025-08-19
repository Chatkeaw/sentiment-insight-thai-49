// src/pages/ComplaintsPage.tsx
import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockFeedbackData } from "@/data/mockData";
import { FeedbackEntry } from "@/types/dashboard";

/** ===== Utilities: parse date (รองรับ DD/MM/YYYY พ.ศ. และ YYYY-MM-DD) ===== */
function parseDateLoose(s: string): Date | null {
  if (!s) return null;
  // ISO 8601
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) {
    const d = new Date(s);
    return isNaN(d.getTime()) ? null : d;
  }
  // DD/MM/YYYY (BE/AD)
  const m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (m) {
    const dd = Number(m[1]);
    const MM = Number(m[2]);
    let yyyy = Number(m[3]);
    if (yyyy > 2400) yyyy -= 543; // BE -> AD
    const d = new Date(yyyy, MM - 1, dd);
    return isNaN(d.getTime()) ? null : d;
  }
  return null;
}

/** labels ของรหัสย่อย 1.x–5.x */
const COMMENT_TAG_LABELS: Record<string, string> = {
  "1.1": "ความสุภาพและมารยาทของพนักงาน",
  "1.2": "ความเอาใจใส่ในการให้บริการลูกค้า",
  "1.3": "ความสามารถในการตอบคำถามหรือให้คำแนะนำ",
  "1.4": "ความถูกต้องในการให้บริการ",
  "1.5": "ความรวดเร็วในการให้บริการ",
  "1.6": "ความเป็นมืออาชีพและการแก้ไขปัญหาเฉพาะหน้า",
  "1.7": "ความประทับใจในการให้บริการ",
  "1.8": "รปภ, แม่บ้าน",
  "2.1": "ความพร้อมในการให้บริการ",
  "2.2": "กระบวนการ/ความเป็นธรรมในการให้บริการ",
  "2.3": "ระบบเรียกคิวและจัดการคิว",
  "2.4": "ภาระเอกสาร",
  "3.1": "ระบบ Core ของธนาคาร",
  "3.2": "เครื่องออกบัตรคิว",
  "3.3": "ATM / ADM / CDM",
  "3.4": "E-KYC / Scanner",
  "3.5": "แอพพลิเคชัน MyMo",
  "3.6": "เครื่องปรับสมุด",
  "3.7": "เครื่องนับเงิน",
  "4.1": "รายละเอียดผลิตภัณฑ์",
  "4.2": "เงื่อนไขอนุมัติ",
  "4.3": "ระยะเวลาอนุมัติ",
  "4.4": "ความยืดหยุ่น",
  "4.5": "ความเรียบง่ายของข้อมูล",
  "5.1": "ความสะอาด",
  "5.2": "พื้นที่และความคับคั่ง",
  "5.3": "อุณหภูมิ",
  "5.4": "โต๊ะรับบริการ",
  "5.5": "จุดรอรับบริการ",
  "5.6": "แสง",
  "5.7": "เสียง",
  "5.8": "ห้องน้ำ",
  "5.9": "ที่จอดรถ",
  "5.10": "ป้าย-สื่อประชาสัมพันธ์",
  "5.11": "สิ่งอำนวยความสะดวกอื่นๆ",
};

/** map คีย์เดิม -> รหัส 1.x–5.x */
const LEGACY_KEY_TO_CODE: Record<string, string> = {
  // staff
  staffPoliteness: "1.1",
  staffCare: "1.2",
  staffConsultation: "1.3",
  staffAccuracy: "1.4",
  staffSpeed: "1.5",
  staffProfessionalism: "1.6",
  staffImpression: "1.7",
  staffSecurity: "1.8",
  // service
  serviceReadiness: "2.1",
  serviceProcess: "2.2",
  serviceQueue: "2.3",
  serviceDocuments: "2.4",
  // tech
  techCore: "3.1",
  techQueue: "3.2",
  techATM: "3.3",
  techKYC: "3.4",
  techApp: "3.5",
  techBookUpdate: "3.6",
  techCashCounter: "3.7",
  // products
  productDetails: "4.1",
  productConditions: "4.2",
  productApprovalTime: "4.3",
  productFlexibility: "4.4",
  productSimplicity: "4.5",
  // environment
  envCleanliness: "5.1",
  envSpace: "5.2",
  envTemperature: "5.3",
  envDesk: "5.4",
  envWaitingArea: "5.5",
  envLighting: "5.6",
  envSound: "5.7",
  envRestroom: "5.8",
  envParking: "5.9",
  envSignage: "5.10",
  envOtherFacilities: "5.11",
};

/** ใช้กรองด้วย prefix 1.–5. ตามหมวดหลัก */
const MAIN_CATEGORY_PREFIX: Record<string, string | null> = {
  all: null,
  staff: "1.",
  service: "2.",
  technology: "3.",
  products: "4.",
  environment: "5.",
  marketConduct: null,
  other: null,
};

/** ดึงแท็ก 1.x–5.x จาก feedback */
function pickTagCodes(feedback: FeedbackEntry): string[] {
  const tagsFromNew = (feedback as any).commentTags as string[] | undefined;
  if (Array.isArray(tagsFromNew) && tagsFromNew.length) return tagsFromNew;

  const detailed = (feedback as any).detailedSentiment as
    | Record<string, number>
    | undefined;
  if (!detailed) return [];
  const codes: string[] = [];
  for (const [k, v] of Object.entries(detailed)) {
    if (v === -1 && LEGACY_KEY_TO_CODE[k]) {
      codes.push(LEGACY_KEY_TO_CODE[k]);
    }
  }
  return Array.from(new Set(codes));
}

const SUB_SERVICE_TYPES = [
  "หน้าเคาน์เตอร์",
  "Mobile/Internet",
  "ตู้ ATM/ADM",
  "Call Center",
  "อื่นๆ",
];

const SERVICE_TYPES = [
  "ทั้งหมด",
  "การฝากเงิน/ถอนเงิน",
  "การซื้อผลิตภัณฑ์",
  "การชำระค่าบริการ/ค่าธรรมเนียม",
  "ให้คำปรึกษา/แนะนำ",
  "อื่นๆ",
];

export const ComplaintsPage: React.FC = () => {
  // location
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("all");
  const [branchQuery, setBranchQuery] = useState<string>(""); // กล่องค้นหา
  // date range
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  // service + channel
  const [selectedServiceType, setSelectedServiceType] = useState<string>("all");
  const [selectedChannel, setSelectedChannel] = useState<string>("");
  // category
  const [selectedMainCategory, setSelectedMainCategory] =
    useState<string>("all");

  const mainCategories = [
    { value: "all", label: "ทั้งหมด" },
    { value: "staff", label: "พนักงานและบุคลากร" },
    { value: "service", label: "ระบบและกระบวนการให้บริการ" },
    { value: "technology", label: "เทคโนโลยีและดิจิทัล" },
    { value: "products", label: "เงื่อนไขและผลิตภัณฑ์" },
    { value: "environment", label: "สภาพแวดล้อมและสิ่งอำนวยความสะดวก" },
    { value: "marketConduct", label: "การปฏิบัติตลาด" },
    { value: "other", label: "อื่นๆ" },
  ];

  // unique values
  const regions = useMemo(() => {
    const unique = Array.from(
      new Set(mockFeedbackData.map((f) => f.branch.region))
    ).sort();
    return ["all", ...unique];
  }, []);

  const districts = useMemo(() => {
    if (selectedRegion === "all") return ["all"];
    const unique = Array.from(
      new Set(
        mockFeedbackData
          .filter((f) => f.branch.region === selectedRegion)
          .map((f) => f.branch.district)
      )
    ).sort();
    return ["all", ...unique];
  }, [selectedRegion]);

  // filter core
  const filteredComplaints = useMemo(() => {
    const prefix = MAIN_CATEGORY_PREFIX[selectedMainCategory] ?? null;

    // pre-parse date range once
    const sd = parseDateLoose(startDate);
    const ed = parseDateLoose(endDate);
    const edEndOfDay =
      ed != null ? new Date(ed.getFullYear(), ed.getMonth(), ed.getDate(), 23, 59, 59) : null;

    return mockFeedbackData
      .filter((feedback: FeedbackEntry) => {
        // location
        if (selectedRegion !== "all" && feedback.branch.region !== selectedRegion)
          return false;
        if (
          selectedDistrict !== "all" &&
          feedback.branch.district !== selectedDistrict
        )
          return false;
        if (
          branchQuery &&
          !`${feedback.branch.branch}`.toLowerCase().includes(branchQuery.toLowerCase())
        )
          return false;

        // date range
        const d = parseDateLoose(feedback.date) || parseDateLoose(feedback.timestamp || "");
        if (sd && (!d || d < sd)) return false;
        if (edEndOfDay && (!d || d > edEndOfDay)) return false;

        // service type
        if (
          selectedServiceType !== "all" &&
          selectedServiceType !== "ทั้งหมด" &&
          feedback.serviceType !== selectedServiceType
        )
          return false;

        // channel (เดโม่: ใช้ field serviceChannel ถ้ามี, มิฉะนั้นผ่าน)
        const ch = (feedback as any).serviceChannel as string | undefined;
        if (selectedChannel && ch && ch !== selectedChannel) return false;

        // category by tag code 1.x–5.x
        if (prefix) {
          const codes = pickTagCodes(feedback);
          if (!codes.some((c) => c.startsWith(prefix))) return false;
        }
        return true;
      })
      .sort(
        (a, b) =>
          (parseDateLoose(b.date)?.getTime() || 0) -
          (parseDateLoose(a.date)?.getTime() || 0)
      );
  }, [
    selectedRegion,
    selectedDistrict,
    branchQuery,
    startDate,
    endDate,
    selectedServiceType,
    selectedChannel,
    selectedMainCategory,
  ]);

  const onClear = () => {
    setSelectedRegion("all");
    setSelectedDistrict("all");
    setBranchQuery("");
    setStartDate("");
    setEndDate("");
    setSelectedServiceType("all");
    setSelectedChannel("");
    setSelectedMainCategory("all");
  };

  const onSearch = () => {
    // จุดเชื่อมต่อ fetch API จริง
    console.log("Apply Complaints filters", {
      selectedRegion,
      selectedDistrict,
      branchQuery,
      startDate,
      endDate,
      selectedServiceType,
      selectedChannel,
      selectedMainCategory,
    });
  };

  return (
    <div className="space-y-6 max-w-full">
      {/* Header */}
      <div className="flex flex-col space-y-1">
        <h1 className="text-3xl font-bold text-foreground">ข้อร้องเรียนลูกค้า</h1>
        <p className="text-muted-foreground">
          ระบบสรุปข้อร้องเรียนสำคัญจากลูกค้า
        </p>
      </div>

      {/* Filters */}
      <Card className="border-pink-100">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-bold">ตัวกรองการแสดงผล</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClear}>
              ล้างตัวกรอง
            </Button>
            <Button onClick={onSearch}>ค้นหา</Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* แถว 1: ภาค / เขต / สาขา(ค้นหา) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-sm mb-1">ภาค</div>
              <Select
                value={selectedRegion}
                onValueChange={(v) => {
                  setSelectedRegion(v);
                  setSelectedDistrict("all");
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="เลือกภาค" />
                </SelectTrigger>
                <SelectContent>
                  {regions.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r === "all" ? "ทั้งหมด" : r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <div className="text-sm mb-1">เขต</div>
              <Select
                value={selectedDistrict}
                onValueChange={(v) => setSelectedDistrict(v)}
                disabled={selectedRegion === "all"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="เลือกเขต" />
                </SelectTrigger>
                <SelectContent>
                  {districts.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d === "all" ? "ทั้งหมด" : d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <div className="text-sm mb-1">สาขา</div>
              <Input
                placeholder="พิมพ์ชื่อ/รหัสสาขาเพื่อค้นหา"
                value={branchQuery}
                onChange={(e) => setBranchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* แถว 2: ช่วงเวลา + ช่องทาง */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-sm mb-1">ช่วงเวลา (เริ่ม)</div>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <div className="text-sm mb-1">ช่วงเวลา (สิ้นสุด)</div>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div>
              <div className="text-sm mb-1">ช่องทาง/รูปแบบการใช้บริการ</div>
              <Select
                value={selectedChannel}
                onValueChange={(v) => setSelectedChannel(v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="เลือกช่องทาง" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">ทั้งหมด</SelectItem>
                  {SUB_SERVICE_TYPES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* แถว 3: ประเภทบริการ + หมวดหมู่หลัก */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-sm mb-1">ประเภทการให้บริการ</div>
              <Select
                value={selectedServiceType}
                onValueChange={(v) => setSelectedServiceType(v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="เลือกประเภทบริการ" />
                </SelectTrigger>
                <SelectContent>
                  {SERVICE_TYPES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <div className="text-sm mb-1">หมวดหมู่หลัก</div>
              <Select
                value={selectedMainCategory}
                onValueChange={(v) => setSelectedMainCategory(v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="เลือกหมวดหมู่หลัก" />
                </SelectTrigger>
                <SelectContent>
                  {[
                    { value: "all", label: "ทั้งหมด" },
                    { value: "staff", label: "พนักงานและบุคลากร" },
                    { value: "service", label: "ระบบและกระบวนการให้บริการ" },
                    { value: "technology", label: "เทคโนโลยีและดิจิทัล" },
                    { value: "products", label: "เงื่อนไขและผลิตภัณฑ์" },
                    {
                      value: "environment",
                      label: "สภาพแวดล้อมและสิ่งอำนวยความสะดวก",
                    },
                    { value: "marketConduct", label: "การปฏิบัติตลาด" },
                    { value: "other", label: "อื่นๆ" },
                  ].map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📋 รายการข้อร้องเรียน ({filteredComplaints.length} รายการ)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {filteredComplaints.map((complaint) => {
              const codes = pickTagCodes(complaint);
              return (
                <Card key={complaint.id} className="border-l-4 border-l-destructive">
                  <CardContent className="p-4">
                    <div className="flex flex-wrap gap-4 mb-2 text-sm text-muted-foreground">
                      <span>📅 {complaint.date}</span>
                      <span>🏢 {complaint.branch.branch}</span>
                      <span>🔧 {complaint.serviceType}</span>
                    </div>
                    <p className="text-foreground leading-relaxed mb-3">
                      {complaint.comment}
                    </p>
                    {codes.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {codes.map((code) => (
                          <Badge key={code} variant="destructive" className="text-xs">
                            {code} {COMMENT_TAG_LABELS[code] ?? ""}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
            {filteredComplaints.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                ไม่พบข้อร้องเรียนที่ตรงกับเงื่อนไขที่เลือก
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComplaintsPage;
