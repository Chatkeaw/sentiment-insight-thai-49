// src/pages/ComplaintsPage.tsx
import React, { useMemo, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockFeedbackData } from "@/data/mockData";
import { FeedbackEntry, TimeFilter as TimeFilterType } from "@/types/dashboard";

/* -------------------------- ค่าคงที่สำหรับตัวเลือก -------------------------- */

const SERVICE_TYPES = [
  "การฝากเงิน/ถอนเงิน",
  "การซื้อผลิตภัณฑ์",
  "การชำระค่าบริการ/ค่าธรรมเนียม",
  "อื่นๆ",
] as const;

type TimeKind = "monthly" | "trailing" | "custom";

const MONTHS_TH = [
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

const MONTHS_TH_BE: string[] = [
  "มกราคม 67",
  "กุมภาพันธ์ 67",
  "มีนาคม 67",
  "เมษายน 67",
  "พฤษภาคม 67",
  "มิถุนายน 67",
  "กรกฎาคม 67",
  "สิงหาคม 67",
  "กันยายน 67",
  "ตุลาคม 67",
  "พฤศจิกายน 67",
  "ธันวาคม 67",
  "มกราคม 68",
  "กุมภาพันธ์ 68",
  "มีนาคม 68",
  "เมษายน 68",
  "พฤษภาคม 68",
  "มิถุนายน 68",
  "กรกฎาคม 68",
  "สิงหาคม 68",
];

const TRAILING_WINDOWS = [
  { value: "7d", label: "7 วัน", days: 7 },
  { value: "14d", label: "14 วัน", days: 14 },
  { value: "1m", label: "1 เดือน", days: 30 },
  { value: "3m", label: "3 เดือน", days: 90 },
  { value: "6m", label: "6 เดือน", days: 180 },
  { value: "1y", label: "1 ปี", days: 365 },
];

const MAIN_TOPICS = [
  { value: "1", label: "1. พนักงานและบุคลากร" },
  { value: "2", label: "2. ระบบและกระบวนการให้บริการ" },
  { value: "3", label: "3. เทคโนโลยีและดิจิทัล" },
  { value: "4", label: "4. เงื่อนไขและผลิตภัณฑ์" },
  { value: "5", label: "5. สภาพแวดล้อมและสิ่งอำนวยความสะดวก" },
  { value: "6", label: "6. Market Conduct" },
  { value: "7", label: "7. อื่นๆ" },
];

const SUB_TOPIC_MAP: Record<string, Array<{ value: string; label: string }>> = {
  "1": [
    { value: "1.1", label: "1.1 ความสุภาพและมารยาทของพนักงาน" },
    { value: "1.2", label: "1.2 ความเอาใจใส่ในการให้บริการลูกค้า" },
    { value: "1.3", label: "1.3 ความสามารถในการตอบคำถามหรือให้คำแนะนำ" },
    { value: "1.4", label: "1.4 ความถูกต้องในการให้บริการ" },
    { value: "1.5", label: "1.5 ความรวดเร็วในการให้บริการ" },
    { value: "1.6", label: "1.6 ความเป็นมืออาชีพและการแก้ไขปัญหาเฉพาะหน้า" },
    { value: "1.7", label: "1.7 ความประทับใจในการให้บริการ" },
    { value: "1.8", label: "1.8 รปภ, แม่บ้าน" },
  ],
  "2": [
    { value: "2.1", label: "2.1 ความพร้อมในการให้บริการ" },
    { value: "2.2", label: "2.2 กระบวนการให้บริการ ความเป็นธรรมให้บริการ" },
    { value: "2.3", label: "2.3 ระบบเรียกคิวและจัดการคิว" },
    { value: "2.4", label: "2.4 ภาระเอกสาร" },
  ],
  "3": [
    { value: "3.1", label: "3.1 ระบบ Core ของธนาคาร" },
    { value: "3.2", label: "3.2 เครื่องออกบัตรคิว" },
    { value: "3.3", label: "3.3 ATM ADM CDM" },
    { value: "3.4", label: "3.4 E-KYC Scanner" },
    { value: "3.5", label: "3.5 แอพพลิเคชั่น MyMo" },
    { value: "3.6", label: "3.6 เครื่องปรับสมุด" },
    { value: "3.7", label: "3.7 เครื่องนับเงิน" },
  ],
  "4": [
    { value: "4.1", label: "4.1 รายละเอียด ผลิตภัณฑ์" },
    { value: "4.2", label: "4.2 เงื่อนไขอนุมัติ" },
    { value: "4.3", label: "4.3 ระยะเวลาอนุมัติ" },
    { value: "4.4", label: "4.4 ความยืดหยุ่น" },
    { value: "4.5", label: "4.5 ความเรียบง่ายข้อมูล" },
  ],
  "5": [
    { value: "5.1", label: "5.1 ความสะอาด" },
    { value: "5.2", label: "5.2 พื้นที่และความคับคั่ง" },
    { value: "5.3", label: "5.3 อุณหภูมิ" },
    { value: "5.4", label: "5.4 โต๊ะรับบริการ" },
    { value: "5.5", label: "5.5 จุดรอรับบริการ" },
    { value: "5.6", label: "5.6 แสง" },
    { value: "5.7", label: "5.7 เสียง" },
    { value: "5.8", label: "5.8 ห้องน้ำ" },
    { value: "5.9", label: "5.9 ที่จอดรถ" },
    { value: "5.10", label: "5.10 ป้าย-สื่อประชาสัมพันธ์" },
    { value: "5.11", label: "5.11 สิ่งอำนวยความสะดวกอื่นๆ" },
  ],
  "6": [
    { value: "6.1", label: "6.1 ไม่หลอกลวง" },
    { value: "6.2", label: "6.2 ไม่เอาเปรียบ" },
    { value: "6.3", label: "6.3 ไม่บังคับ" },
    { value: "6.4", label: "6.4 ไม่รบกวน" },
  ],
  "7": [{ value: "7.1", label: "7.1 ความประทับใจอื่นๆ" }],
};

/* -------------------------- Utilities -------------------------- */

// mockData.date เป็นสตริง th-TH เช่น "10/1/2568" -> แปลงเป็น Date
function parseThaiDateToDate(s: string): Date | null {
  const parts = s.split("/");
  if (parts.length < 3) return null;
  const d = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10) - 1;
  let y = parseInt(parts[2], 10);
  if (y > 2400) y -= 543; // พ.ศ. -> ค.ศ.
  return new Date(y, m, d);
}

// แปลง Date เป็นคู่ monthIndex/yearBE2digits สำหรับเทียบ monthly
function toMonthKeyBE(date: Date) {
  const monthName = MONTHS_TH[date.getMonth()];
  const yearBE2 = (date.getFullYear() + 543).toString().slice(-2);
  return `${monthName} ${yearBE2}`;
}

function isSevere(f: FeedbackEntry): boolean {
  const sentiments = Object.values(f.sentiment);
  const hasNegative = sentiments.some((s) => s === -1);
  return hasNegative || f.satisfaction.overall <= 2;
}

/* -------------------------- Page -------------------------- */

export const ComplaintsPage: React.FC<{
  timeFilter?: TimeFilterType["value"];
  onTimeFilterChange?: (v: TimeFilterType["value"]) => void;
}> = () => {
  /* ---------- พื้นที่ให้บริการ ---------- */
  const regions = useMemo(() => {
    const s = new Set(mockFeedbackData.map((f) => f.branch.region));
    return Array.from(s).sort();
  }, []);
  const [region, setRegion] = useState<string>("ทั้งหมด");

  const districts = useMemo(() => {
    const list = mockFeedbackData
      .filter((f) => region === "ทั้งหมด" || f.branch.region === region)
      .map((f) => f.branch.district);
    return ["ทั้งหมด", ...Array.from(new Set(list)).sort()];
  }, [region]);
  const [district, setDistrict] = useState<string>("ทั้งหมด");

  const branches = useMemo(() => {
    const list = mockFeedbackData
      .filter(
        (f) =>
          (region === "ทั้งหมด" || f.branch.region === region) &&
          (district === "ทั้งหมด" || f.branch.district === district)
      )
      .map((f) => f.branch.branch);
    return ["ทั้งหมด", ...Array.from(new Set(list)).sort()];
  }, [region, district]);
  const [branch, setBranch] = useState<string>("ทั้งหมด");

  /* ---------- เวลา ---------- */
  const [timeKind, setTimeKind] = useState<TimeKind>("custom");
  const [monthSelected, setMonthSelected] = useState<string>("");
  const [trailingSelected, setTrailingSelected] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  /* ---------- บริการ + ทัศนคติ ---------- */
  const [serviceType, setServiceType] = useState<string>("ทั้งหมด");
  const [sentiment, setSentiment] = useState<"all" | "positive" | "negative">(
    "all"
  );

  /* ---------- ประเภท/หมวดความเห็น ---------- */
  const [mainTopic, setMainTopic] = useState<string>("");
  const [subTopic, setSubTopic] = useState<string>("");

  const subTopicOptions = useMemo(() => {
    if (!mainTopic) return [];
    return SUB_TOPIC_MAP[mainTopic] ?? [];
  }, [mainTopic]);

  /* ---------- ล้างฟิลเตอร์ ---------- */
  const handleReset = () => {
    setRegion("ทั้งหมด");
    setDistrict("ทั้งหมด");
    setBranch("ทั้งหมด");

    setTimeKind("custom");
    setMonthSelected("");
    setTrailingSelected("");
    setStartDate("");
    setEndDate("");

    setServiceType("ทั้งหมด");
    setSentiment("all");

    setMainTopic("");
    setSubTopic("");
  };

  /* ---------- ตัวกรองเวลา ---------- */
  const applyTimeFilter = (f: FeedbackEntry) => {
    const d = parseThaiDateToDate(f.date);
    if (!d) return true;

    if (timeKind === "monthly") {
      if (!monthSelected) return true;
      return toMonthKeyBE(d) === monthSelected;
    }

    if (timeKind === "trailing") {
      if (!trailingSelected) return true;
      const days =
        TRAILING_WINDOWS.find((w) => w.value === trailingSelected)?.days ?? 0;
      if (!days) return true;
      const since = new Date();
      since.setDate(since.getDate() - days);
      return d >= since;
    }

    // custom
    const s = startDate ? new Date(startDate) : null;
    const e = endDate ? new Date(endDate) : null;
    if (s && d < s) return false;
    if (e) {
      const e2 = new Date(e);
      e2.setHours(23, 59, 59, 999);
      if (d > e2) return false;
    }
    return true;
  };

  /* ---------- ตัวกรองอื่น ๆ + รวบรวมรายการรุนแรง ---------- */
  const severeList = useMemo(() => {
    return mockFeedbackData
      .filter((f) => {
        // พื้นที่
        if (region !== "ทั้งหมด" && f.branch.region !== region) return false;
        if (district !== "ทั้งหมด" && f.branch.district !== district)
          return false;
        if (branch !== "ทั้งหมด" && f.branch.branch !== branch) return false;

        // ประเภทบริการ
        if (serviceType !== "ทั้งหมด" && f.serviceType !== serviceType)
          return false;

        // ทัศนคติ (optional)
        if (sentiment !== "all") {
          const hasPositive = Object.values(f.sentiment).some((s) => s === 1);
          const hasNegative = Object.values(f.sentiment).some((s) => s === -1);
          if (sentiment === "positive" && !hasPositive) return false;
          if (sentiment === "negative" && !hasNegative) return false;
        }

        // เวลา
        if (!applyTimeFilter(f)) return false;

        // รุนแรง
        return isSevere(f);
      })
      .sort((a, b) => {
        const da = parseThaiDateToDate(a.date)?.getTime() ?? 0;
        const db = parseThaiDateToDate(b.date)?.getTime() ?? 0;
        return db - da; // ใหม่ -> เก่า
      });
  }, [
    region,
    district,
    branch,
    serviceType,
    sentiment,
    timeKind,
    monthSelected,
    trailingSelected,
    startDate,
    endDate,
  ]);

  /* -------------------------- UI -------------------------- */

  return (
    <div className="space-y-6">
      {/* ปุ่มล้างตัวกรอง */}
      <div className="flex justify-end">
        <Button variant="secondary" onClick={handleReset}>
          ล้างตัวกรอง
        </Button>
      </div>

      {/* ช่วงเวลาเก็บแบบประเมิน */}
      <Card>
        <CardHeader>
          <CardTitle>ช่วงเวลาเก็บแบบประเมิน</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* ประเภทเวลา */}
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">ประเภท</label>
            <Select
              value={timeKind}
              onValueChange={(v: TimeKind) => {
                setTimeKind(v);
                setMonthSelected("");
                setTrailingSelected("");
                setStartDate("");
                setEndDate("");
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="เลือกประเภทช่วงเวลา" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">ความคิดเห็นรายเดือน</SelectItem>
                <SelectItem value="trailing">ช่วงเวลาย้อนหลัง</SelectItem>
                <SelectItem value="custom">กำหนดเอง</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* ช่องตามประเภทเวลา */}
          {timeKind === "monthly" && (
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm text-muted-foreground">เดือน</label>
              <Select value={monthSelected} onValueChange={setMonthSelected}>
                <SelectTrigger>
                  <SelectValue placeholder="เลือกเดือน" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">เลือกทั้งหมด</SelectItem>
                  {MONTHS_TH_BE.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {timeKind === "trailing" && (
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm text-muted-foreground">
                ช่วงเวลาย้อนหลัง
              </label>
              <Select
                value={trailingSelected}
                onValueChange={setTrailingSelected}
              >
                <SelectTrigger>
                  <SelectValue placeholder="เลือกช่วงเวลา" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">เลือกทั้งหมด</SelectItem>
                  {TRAILING_WINDOWS.map((w) => (
                    <SelectItem key={w.value} value={w.value}>
                      {w.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {timeKind === "custom" && (
            <>
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">เริ่ม</label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">สิ้นสุด</label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* ตัวกรองข้อมูล */}
      <Card>
        <CardHeader>
          <CardTitle>ตัวกรองข้อมูล</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* ภาค */}
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">ภาค</label>
            <Select
              value={region}
              onValueChange={(v) => {
                setRegion(v);
                setDistrict("ทั้งหมด");
                setBranch("ทั้งหมด");
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="เลือกภาค" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ทั้งหมด">ทั้งหมด</SelectItem>
                {regions.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* เขต */}
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">เขต</label>
            <Select
              value={district}
              onValueChange={(v) => {
                setDistrict(v);
                setBranch("ทั้งหมด");
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="เลือกเขต" />
              </SelectTrigger>
              <SelectContent>
                {districts.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* สาขา */}
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">สาขา</label>
            <Select value={branch} onValueChange={setBranch}>
              <SelectTrigger>
                <SelectValue placeholder="เลือกสาขา" />
              </SelectTrigger>
              <SelectContent>
                {branches.map((b) => (
                  <SelectItem key={b} value={b}>
                    {b}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* ประเภทการให้บริการ */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm text-muted-foreground">
              ประเภทการให้บริการ
            </label>
            <Select value={serviceType} onValueChange={setServiceType}>
              <SelectTrigger>
                <SelectValue placeholder="เลือกประเภทการให้บริการ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ทั้งหมด">ทั้งหมด</SelectItem>
                {SERVICE_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* ทัศนคติ */}
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">ทัศนคติ</label>
            <Select
              value={sentiment}
              onValueChange={(v: "all" | "positive" | "negative") =>
                setSentiment(v)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="เลือกทัศนคติ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทั้งหมด</SelectItem>
                <SelectItem value="positive">เชิงบวก</SelectItem>
                <SelectItem value="negative">เชิงลบ</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* ประเภท / หมวดหมู่ ความคิดเห็น */}
      <Card>
        <CardHeader>
          <CardTitle>ประเภท / หมวดหมู่ ความคิดเห็น</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* หัวข้อ */}
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">หัวข้อ</label>
            <Select
              value={mainTopic}
              onValueChange={(v) => {
                setMainTopic(v);
                setSubTopic("");
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="เลือกหัวข้อการประเมิน" />
              </SelectTrigger>
              <SelectContent>
                {MAIN_TOPICS.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* หมวดหมู่ */}
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">หมวดหมู่</label>
            <Select
              disabled={!mainTopic}
              value={subTopic}
              onValueChange={setSubTopic}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={mainTopic ? "เลือกหมวดหมู่" : "เลือกหัวข้อก่อน"}
                />
              </SelectTrigger>
              <SelectContent>
                {subTopicOptions.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* รายการ “ข้อร้องเรียนที่รุนแรง” */}
      <Card>
        <CardHeader>
          <CardTitle>
            รายการข้อร้องเรียนที่รุนแรง ({severeList.length} รายการ)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {severeList.length === 0 ? (
            <div className="py-10 text-center text-muted-foreground">
              ไม่พบรายการที่ตรงกับตัวกรอง
            </div>
          ) : (
            <div className="space-y-3 max-h-[560px] overflow-y-auto pr-2">
              {severeList.map((f) => (
                <div
                  key={f.id}
                  className="rounded-md border p-4 hover:bg-muted/40 transition"
                >
                  <div className="mb-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <span>📅 {f.date} {f.timestamp}</span>
                    <span>🏢 {f.branch.branch} / {f.branch.district} / {f.branch.region}</span>
                    <span>🔧 {f.serviceType}</span>
                    <Badge variant="destructive">รุนแรง</Badge>
                  </div>

                  <div className="text-foreground leading-relaxed">
                    {f.comment}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ComplaintsPage;
