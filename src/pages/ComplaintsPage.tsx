// src/pages/ComplaintsPage.tsx
import React, { useMemo, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { mockFeedbackData } from "@/data/mockData";
import { FeedbackEntry } from "@/types/dashboard";

/* ---------------------------------------------
   Time filter (inline component + helpers)
   — แบบเดียวกับหน้า FeedbackPage
---------------------------------------------- */
type TimeFilterValue =
  | { mode: "all" }
  | { mode: "monthly"; month: number; yearBE: number } // month: 0-11, yearBE: 2568
  | { mode: "relative"; days: number }
  | { mode: "custom"; start: string; end: string }; // yyyy-mm-dd

const THAI_MONTHS = [
  "มกราคม",
  "กุมภาพันธ์",
  "มีนาคม",
  "เมษายน",
  "พฤษภาคม",
  "มิถุนายน",
  "กรกฎาคม",
  "สิงหาคม",
  "กันยายน",
  "ตุลาคม",
  "พฤศจิกายน",
  "ธันวาคม",
];

const toBE = (y: number) => y + 543;
const fromBE = (y: number) => y - 543;

/** แปลง "dd/mm/yyyy (พ.ศ.)" จาก mockData → Date */
function parseThaiDate(dateStr: string): Date {
  const parts = dateStr.split("/");
  if (parts.length === 3) {
    const [dd, mm, yyyy] = parts.map((p) => parseInt(p, 10));
    const year = yyyy > 2400 ? fromBE(yyyy) : yyyy;
    return new Date(year, (mm || 1) - 1, dd || 1);
  }
  return new Date(dateStr);
}

function isInTimeFilter(dateStr: string, tf: TimeFilterValue): boolean {
  if (!tf || tf.mode === "all") return true;

  const d = parseThaiDate(dateStr);
  const today = new Date();

  if (tf.mode === "monthly") {
    return (
      d.getFullYear() === fromBE(tf.yearBE) && d.getMonth() === tf.month
    );
  }
  if (tf.mode === "relative") {
    const from = new Date(today);
    from.setHours(0, 0, 0, 0);
    from.setDate(from.getDate() - tf.days);
    const end = new Date(today);
    end.setHours(23, 59, 59, 999);
    return d >= from && d <= end;
  }
  if (tf.mode === "custom") {
    if (!tf.start || !tf.end) return true;
    const start = new Date(tf.start);
    const end = new Date(tf.end);
    end.setHours(23, 59, 59, 999);
    return d >= start && d <= end;
  }
  return true;
}

const RELATIVE_CHOICES: Array<{ label: string; days: number }> = [
  { label: "1 วัน", days: 1 },
  { label: "7 วัน", days: 7 },
  { label: "14 วัน", days: 14 },
  { label: "1 เดือน", days: 30 },
  { label: "3 เดือน", days: 90 },
  { label: "6 เดือน", days: 180 },
  { label: "1 ปี", days: 365 },
];

const TimeRangeFilter: React.FC<{
  value: TimeFilterValue;
  onChange: (v: TimeFilterValue) => void;
}> = ({ value, onChange }) => {
  const now = new Date();
  const yearBE = toBE(now.getFullYear());
  const [mode, setMode] = useState<TimeFilterValue["mode"]>(
    value?.mode ?? "all"
  );
  const [month, setMonth] = useState<number>(now.getMonth());
  const [year, setYear] = useState<number>(yearBE);
  const [relDays, setRelDays] = useState<number>(30);
  const [start, setStart] = useState<string>("");
  const [end, setEnd] = useState<string>("");

  useEffect(() => {
    if (!value) return;
    setMode(value.mode);
    if (value.mode === "monthly") {
      setMonth(value.month);
      setYear(value.yearBE);
    } else if (value.mode === "relative") {
      setRelDays(value.days);
    } else if (value.mode === "custom") {
      setStart(value.start);
      setEnd(value.end);
    }
  }, [value]);

  useEffect(() => {
    if (mode === "all") onChange({ mode: "all" });
    if (mode === "monthly") onChange({ mode: "monthly", month, yearBE: year });
    if (mode === "relative") onChange({ mode: "relative", days: relDays });
    if (mode === "custom") onChange({ mode: "custom", start, end });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, month, year, relDays, start, end]);

  const months = Array.from({ length: 12 }, (_, i) => ({
    label: `${THAI_MONTHS[i]} ${String(year).slice(2)}`,
    value: i,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>ช่วงเวลาเก็บแบบประเมิน</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">ประเภท</label>
            <Select
              value={mode}
              onValueChange={(v) => setMode(v as TimeFilterValue["mode"])}
            >
              <SelectTrigger>
                <SelectValue placeholder="เลือกประเภทเวลา" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">เลือกทั้งหมด</SelectItem>
                <SelectItem value="monthly">ความคิดเห็นรายเดือน</SelectItem>
                <SelectItem value="relative">ช่วงเวลาย้อนหลัง</SelectItem>
                <SelectItem value="custom">กำหนดเอง</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {mode === "monthly" && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">เดือน</label>
                <Select
                  value={String(month)}
                  onValueChange={(v) => setMonth(parseInt(v, 10))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกเดือน" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((m) => (
                      <SelectItem key={m.value} value={String(m.value)}>
                        {m.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">ปี (พ.ศ.)</label>
                <Select
                  value={String(year)}
                  onValueChange={(v) => setYear(parseInt(v, 10))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[yearBE, yearBE - 1].map((yy) => (
                      <SelectItem key={yy} value={String(yy)}>
                        {yy}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {mode === "relative" && (
            <div className="space-y-2">
              <label className="text-sm font-medium">ย้อนหลัง</label>
              <Select
                value={String(relDays)}
                onValueChange={(v) => setRelDays(parseInt(v, 10))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="เลือกระยะเวลา" />
                </SelectTrigger>
                <SelectContent>
                  {RELATIVE_CHOICES.map((c) => (
                    <SelectItem key={c.days} value={String(c.days)}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {mode === "custom" && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">เริ่ม</label>
                <input
                  type="date"
                  className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                  value={start}
                  onChange={(e) => setStart(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">สิ้นสุด</label>
                <input
                  type="date"
                  className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                  value={end}
                  onChange={(e) => setEnd(e.target.value)}
                />
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
/* ---------------------------------------------
   END Time filter
---------------------------------------------- */

/** labels 1.x–5.x */
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

/** map key เดิม → รหัส 1.x–5.x */
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

/** prefix ของหมวดหลัก */
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

/** ดึงแท็ก 1.x–5.x จาก feedback (ใช้ commentTags ถ้ามี) */
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

export const ComplaintsPage: React.FC = () => {
  // ===== ฟิลเตอร์สถานที่/หมวดหมู่ =====
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("all");
  const [selectedBranch, setSelectedBranch] = useState<string>("all");
  const [selectedMainCategory, setSelectedMainCategory] =
    useState<string>("all");
  const [selectedServiceType, setSelectedServiceType] =
    useState<string>("all");

  // ===== ฟิลเตอร์เวลา (ใหม่) =====
  const [timeFilter, setTimeFilter] = useState<TimeFilterValue>({
    mode: "all",
  });

  // ชุดข้อมูลตัวเลือกสถานที่
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

  const branches = useMemo(() => {
    if (selectedDistrict === "all") return ["all"];
    const unique = Array.from(
      new Set(
        mockFeedbackData
          .filter(
            (f) =>
              (selectedRegion === "all" ||
                f.branch.region === selectedRegion) &&
              f.branch.district === selectedDistrict
          )
          .map((f) => f.branch.branch)
      )
    ).sort();
    return ["all", ...unique];
  }, [selectedRegion, selectedDistrict]);

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

  const serviceTypes = [
    "ทั้งหมด",
    "การฝากเงิน/ถอนเงิน",
    "การซื้อผลิตภัณฑ์",
    "การชำระค่าบริการ/ค่าธรรมเนียม",
    "อื่นๆ",
  ];

  // ===== กรองรายการข้อร้องเรียน =====
  const filteredComplaints = useMemo(() => {
    const prefix = MAIN_CATEGORY_PREFIX[selectedMainCategory] ?? null;

    return mockFeedbackData
      .filter((feedback: FeedbackEntry) => {
        // ตามเวลา
        if (!isInTimeFilter(feedback.date, timeFilter)) return false;

        // สถานที่
        if (
          selectedRegion !== "all" &&
          feedback.branch.region !== selectedRegion
        )
          return false;
        if (
          selectedDistrict !== "all" &&
          feedback.branch.district !== selectedDistrict
        )
          return false;
        if (
          selectedBranch !== "all" &&
          feedback.branch.branch !== selectedBranch
        )
          return false;

        // ประเภทบริการ
        if (
          selectedServiceType !== "all" &&
          selectedServiceType !== "ทั้งหมด" &&
          feedback.serviceType !== selectedServiceType
        )
          return false;

        // หมวดหลัก 1.–5. ด้วย prefix ของ tag code
        if (prefix) {
          const codes = pickTagCodes(feedback);
          if (!codes.some((c) => c.startsWith(prefix))) return false;
        }
        return true;
      })
      .sort(
        (a, b) =>
          parseThaiDate(b.date).getTime() - parseThaiDate(a.date).getTime()
      );
  }, [
    timeFilter,
    selectedRegion,
    selectedDistrict,
    selectedBranch,
    selectedMainCategory,
    selectedServiceType,
  ]);

  return (
    <div className="space-y-6 max-w-full">
      {/* Header */}
      <div className="flex flex-col space-y-2">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-foreground">
            ข้อร้องเรียนลูกค้า
          </h1>
        </div>
        <p className="text-muted-foreground">รายงานข้อร้องเรียนสำคัญจากลูกค้า</p>
      </div>

      {/* ✅ ช่วงเวลาเก็บแบบประเมิน */}
      <TimeRangeFilter value={timeFilter} onChange={setTimeFilter} />

      {/* พื้นที่ให้บริการ + ประเภทบริการ + หมวดหลัก */}
      <Card>
        <CardHeader>
          <CardTitle>ตัวกรองข้อมูล</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* พื้นที่ */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">ภาค</label>
              <Select
                value={selectedRegion}
                onValueChange={(value) => {
                  setSelectedRegion(value);
                  setSelectedDistrict("all");
                  setSelectedBranch("all");
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="เลือกภาค" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทั้งหมด</SelectItem>
                  {regions
                    .filter((r) => r !== "all")
                    .map((region) => (
                      <SelectItem key={region} value={region}>
                        {region}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">เขต</label>
              <Select
                value={selectedDistrict}
                onValueChange={(value) => {
                  setSelectedDistrict(value);
                  setSelectedBranch("all");
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="เลือกเขต" />
                </SelectTrigger>
                <SelectContent>
                  {districts.map((district) => (
                    <SelectItem key={district} value={district}>
                      {district === "all" ? "ทั้งหมด" : district}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">สาขา</label>
              <Select
                value={selectedBranch}
                onValueChange={setSelectedBranch}
              >
                <SelectTrigger>
                  <SelectValue placeholder="เลือกสาขา" />
                </SelectTrigger>
                <SelectContent>
                  {branches.map((branch) => (
                    <SelectItem key={branch} value={branch}>
                      {branch === "all" ? "ทั้งหมด" : branch}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* ประเภทบริการ + หมวดหลัก */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">ประเภทการให้บริการ</label>
              <Select
                value={selectedServiceType}
                onValueChange={setSelectedServiceType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="เลือกประเภทบริการ" />
                </SelectTrigger>
                <SelectContent>
                  {serviceTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">หมวดหมู่หลัก</label>
              <Select
                value={selectedMainCategory}
                onValueChange={setSelectedMainCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder="เลือกหมวดหมู่" />
                </SelectTrigger>
                <SelectContent>
                  {mainCategories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* รายการข้อร้องเรียน */}
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
                    <div className="flex items-start gap-3 mb-3">
                      <span className="text-xl">⚠️</span>
                      <div className="flex-1">
                        <div className="flex flex-wrap gap-4 mb-2 text-sm text-muted-foreground">
                          <span>📅 {complaint.date}</span>
                          <span>🏢 {complaint.branch.branch}</span>
                          <span>🔧 {complaint.serviceType}</span>
                        </div>

                        <p className="text-foreground leading-relaxed mb-3">
                          {complaint.comment}
                        </p>

                        {codes.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-muted-foreground">
                              หมวดหมู่ย่อย (ความคิดเห็น):
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {codes.map((code) => (
                                <Badge key={code} variant="destructive" className="text-xs">
                                  {code} {COMMENT_TAG_LABELS[code] ?? ""}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {filteredComplaints.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <p className="text-lg">ไม่พบข้อร้องเรียนที่ตรงกับเงื่อนไขที่เลือก</p>
                <p className="text-sm mt-2">ลองปรับเปลี่ยนตัวกรองเพื่อดูข้อมูลเพิ่มเติม</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
