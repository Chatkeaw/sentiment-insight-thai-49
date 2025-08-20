import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockFeedbackData } from "@/data/mockData";
import { FeedbackEntry } from "@/types/dashboard";

/* ----------------------------- Category maps ----------------------------- */
const HEAD_CATEGORIES = [
  { value: "all", label: "ทั้งหมด" },
  { value: "1", label: "1. พนักงานและบุคลากร" },
  { value: "2", label: "2. ระบบและกระบวนการให้บริการ" },
  { value: "3", label: "3. เทคโนโลยีและดิจิทัล" },
  { value: "4", label: "4. เงื่อนไขและผลิตภัณฑ์" },
  { value: "5", label: "5. สภาพแวดล้อมและสิ่งอำนวยความสะดวก" },
  { value: "6", label: "6. Market Conduct" },
  { value: "7", label: "7. อื่นๆ" },
] as const;

const SUBCATS: Record<string, Array<{ code: string; label: string }>> = {
  "1": [
    { code: "1.1", label: "ความสุภาพและมารยาทของพนักงาน" },
    { code: "1.2", label: "ความเอาใจใส่ในการให้บริการลูกค้า" },
    { code: "1.3", label: "ความสามารถในการตอบคำถามหรือให้คำแนะนำ" },
    { code: "1.4", label: "ความถูกต้องในการให้บริการ" },
    { code: "1.5", label: "ความรวดเร็วในการให้บริการ" },
    { code: "1.6", label: "ความเป็นมืออาชีพและการแก้ไขปัญหาเฉพาะหน้า" },
    { code: "1.7", label: "ความประทับใจในการให้บริการ" },
    { code: "1.8", label: "รปภ, แม่บ้าน" },
  ],
  "2": [
    { code: "2.1", label: "ความพร้อมในการให้บริการ" },
    { code: "2.2", label: "กระบวนการให้บริการ ความเป็นธรรมให้บริการ" },
    { code: "2.3", label: "ระบบเรียกคิวและจัดการคิว" },
    { code: "2.4", label: "ภาระเอกสาร" },
  ],
  "3": [
    { code: "3.1", label: "ระบบ Core ของธนาคาร" },
    { code: "3.2", label: "เครื่องออกบัตรคิว" },
    { code: "3.3", label: "ATM ADM CDM" },
    { code: "3.4", label: "E-KYC Scanner" },
    { code: "3.5", label: "แอพพลิเคชัน MyMo" },
    { code: "3.6", label: "เครื่องปรับสมุด" },
    { code: "3.7", label: "เครื่องนับเงิน" },
  ],
  "4": [
    { code: "4.1", label: "รายละเอียดผลิตภัณฑ์" },
    { code: "4.2", label: "เงื่อนไขอนุมัติ" },
    { code: "4.3", label: "ระยะเวลาอนุมัติ" },
    { code: "4.4", label: "ความยืดหยุ่น" },
    { code: "4.5", label: "ความเรียบง่ายข้อมูล" },
  ],
  "5": [
    { code: "5.1", label: "ความสะอาด" },
    { code: "5.2", label: "พื้นที่และความคับคั่ง" },
    { code: "5.3", label: "อุณหภูมิ" },
    { code: "5.4", label: "โต๊ะรับบริการ" },
    { code: "5.5", label: "จุดรอรับบริการ" },
    { code: "5.6", label: "แสง" },
    { code: "5.7", label: "เสียง" },
    { code: "5.8", label: "ห้องน้ำ" },
    { code: "5.9", label: "ที่จอดรถ" },
    { code: "5.10", label: "ป้าย-สื่อประชาสัมพันธ์" },
    { code: "5.11", label: "สิ่งอำนวยความสะดวกอื่นๆ" },
  ],
  "6": [
    { code: "6.1", label: "ไม่หลอกลวง" },
    { code: "6.2", label: "ไม่เอาเปรียบ" },
    { code: "6.3", label: "ไม่บังคับ" },
    { code: "6.4", label: "ไม่รบกวน" },
  ],
  "7": [{ code: "7.1", label: "ความประทับใจอื่นๆ" }],
};

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
  // conduct
  conductNoDeception: "6.1",
  conductNoAdvantage: "6.2",
  conductNoForcing: "6.3",
  conductNoDisturbance: "6.4",
  // other
  otherImpression: "7.1",
};

const LABEL_BY_CODE = Object.fromEntries(
  Object.values(SUBCATS).flat().map((x) => [x.code, x.label])
);

/* ------------------------------ Helper utils ----------------------------- */
function pickTagCodes(f: FeedbackEntry): string[] {
  // ถ้าในอนาคตมีฟิลด์ commentTags ให้ใช้ก่อน
  const detailed = (f as any).detailedSentiment as
    | Record<string, number>
    | undefined;
  if (!detailed) return [];
  const codes: string[] = [];
  for (const [k, v] of Object.entries(detailed)) {
    if (v === -1 && LEGACY_KEY_TO_CODE[k]) codes.push(LEGACY_KEY_TO_CODE[k]);
  }
  return Array.from(new Set(codes));
}

const serviceTypeOptions = [
  "ทั้งหมด",
  "การฝากเงิน/ถอนเงิน",
  "การซื้อผลิตภัณฑ์",
  "การชำระค่าบริการ/ค่าธรรมเนียม",
  "อื่นๆ",
];

type TimeType = "all" | "monthly" | "back" | "custom";
const backRanges = [
  { value: "7d", label: "7 วัน", ms: 7 * 24 * 60 * 60 * 1000 },
  { value: "14d", label: "14 วัน", ms: 14 * 24 * 60 * 60 * 1000 },
  { value: "1m", label: "1 เดือน", ms: 30 * 24 * 60 * 60 * 1000 },
  { value: "3m", label: "3 เดือน", ms: 90 * 24 * 60 * 60 * 1000 },
  { value: "6m", label: "6 เดือน", ms: 180 * 24 * 60 * 60 * 1000 },
  { value: "1y", label: "1 ปี", ms: 365 * 24 * 60 * 60 * 1000 },
];

/* --------------------------------- Page ---------------------------------- */
export default function ComplaintsPage() {
  /* ---------------------------- header dropdowns ---------------------------- */
  // พื้นที่
  const regions = useMemo(() => {
    const set = new Set(mockFeedbackData.map((f) => f.branch.region));
    return ["ทั้งหมด", ...Array.from(set).sort()];
  }, []);
  const [region, setRegion] = useState("ทั้งหมด");

  const districts = useMemo(() => {
    const data = mockFeedbackData.filter(
      (f) => region === "ทั้งหมด" || f.branch.region === region
    );
    const set = new Set(data.map((f) => f.branch.district));
    return ["ทั้งหมด", ...Array.from(set).sort()];
  }, [region]);
  const [district, setDistrict] = useState("ทั้งหมด");

  const branches = useMemo(() => {
    const data = mockFeedbackData.filter(
      (f) =>
        (region === "ทั้งหมด" || f.branch.region === region) &&
        (district === "ทั้งหมด" || f.branch.district === district)
    );
    const set = new Set(data.map((f) => f.branch.branch));
    return ["ทั้งหมด", ...Array.from(set).sort()];
  }, [region, district]);
  const [branch, setBranch] = useState("ทั้งหมด");

  // เวลา
  const [timeType, setTimeType] = useState<TimeType>("all");
  const [monthKey, setMonthKey] = useState<string>(""); // YYYY-MM
  const [backKey, setBackKey] = useState<string>("1m");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // ประเภท/ทัศนคติ
  const [serviceType, setServiceType] = useState("ทั้งหมด");
  const [sentiment, setSentiment] = useState<"all" | "positive" | "negative">(
    "all"
  );

  // หมวด
  const [headCat, setHeadCat] = useState<(typeof HEAD_CATEGORIES)[number]["value"]>("all");
  const subcatList = useMemo(
    () => (headCat === "all" ? [] : SUBCATS[headCat] ?? []),
    [headCat]
  );
  const [subCat, setSubCat] = useState<string>("all");

  /* --------------------------------- time --------------------------------- */
  const monthOptions = useMemo(() => {
    const today = new Date();
    const list: { key: string; label: string }[] = [];
    for (let i = 0; i < 18; i++) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      // แสดงแบบไทยสั้น ๆ เช่น ม.ค. 68
      const th = d.toLocaleDateString("th-TH", {
        year: "2-digit",
        month: "long",
      });
      list.push({ key, label: th });
    }
    return list;
  }, []);

  function inTimeRange(dateStr: string): boolean {
    if (timeType === "all") return true;
    const d = parseDate(dateStr);
    if (!d) return true;

    if (timeType === "monthly" && monthKey) {
      const [y, m] = monthKey.split("-").map((x) => parseInt(x, 10));
      const start = new Date(y, m - 1, 1).getTime();
      const end = new Date(y, m, 0, 23, 59, 59, 999).getTime();
      return d.getTime() >= start && d.getTime() <= end;
    }

    if (timeType === "back") {
      const item = backRanges.find((x) => x.value === backKey) ?? backRanges[2];
      const start = Date.now() - item.ms;
      return d.getTime() >= start;
    }

    if (timeType === "custom" && startDate && endDate) {
      const s = parseDate(startDate)?.getTime() ?? 0;
      const e = parseDate(endDate)?.getTime() ?? Date.now();
      return d.getTime() >= s && d.getTime() <= e;
    }

    return true;
  }

  function parseDate(s: string): Date | null {
    // รองรับทั้ง dd/mm/yyyy (th-TH) และ yyyy-mm-dd จาก input date
    if (!s) return null;
    if (s.includes("-")) {
      return new Date(s);
    }
    if (s.includes("/")) {
      const [dd, mm, yyyy] = s.split("/");
      return new Date(parseInt(yyyy, 10), parseInt(mm, 10) - 1, parseInt(dd, 10));
    }
    return new Date(s);
  }

  /* ------------------------------- filtering ------------------------------- */
  const filtered = useMemo(() => {
    return mockFeedbackData
      .filter((f) => {
        if (region !== "ทั้งหมด" && f.branch.region !== region) return false;
        if (district !== "ทั้งหมด" && f.branch.district !== district) return false;
        if (branch !== "ทั้งหมด" && f.branch.branch !== branch) return false;

        if (serviceType !== "ทั้งหมด" && f.serviceType !== serviceType) return false;

        if (sentiment !== "all") {
          const list = Object.values(f.sentiment);
          const hasPos = list.some((v) => v === 1);
          const hasNeg = list.some((v) => v === -1);
          if (sentiment === "positive" && !hasPos) return false;
          if (sentiment === "negative" && !hasNeg) return false;
        }

        if (!inTimeRange(f.date)) return false;

        if (headCat !== "all") {
          const codes = pickTagCodes(f);
          if (!codes.some((c) => c.startsWith(headCat + "."))) return false;
          if (subCat !== "all" && !codes.includes(subCat)) return false;
        }

        return true;
      })
      .sort((a, b) => (parseDate(b.date)?.getTime() ?? 0) - (parseDate(a.date)?.getTime() ?? 0));
  }, [
    region,
    district,
    branch,
    serviceType,
    sentiment,
    timeType,
    monthKey,
    backKey,
    startDate,
    endDate,
    headCat,
    subCat,
  ]);

  function resetAll() {
    setRegion("ทั้งหมด");
    setDistrict("ทั้งหมด");
    setBranch("ทั้งหมด");
    setTimeType("all");
    setMonthKey("");
    setBackKey("1m");
    setStartDate("");
    setEndDate("");
    setServiceType("ทั้งหมด");
    setSentiment("all");
    setHeadCat("all");
    setSubCat("all");
  }

  /* --------------------------------- UI ---------------------------------- */
  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">ข้อร้องเรียนลูกค้า</h1>
        <p className="text-muted-foreground">
          ระบบสรุปข้อร้องเรียนสำคัญจากลูกค้า
        </p>
      </div>

      {/* Filters box */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-xl">ตัวกรองการแสดงผล</CardTitle>
          <div className="space-x-2">
            <Button variant="outline" onClick={resetAll}>ล้างตัวกรอง</Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* พื้นที่ให้บริการ */}
          <section>
            <div className="mb-3 text-lg font-semibold">พื้นที่ให้บริการ</div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {/* Region */}
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">ภาค</label>
                <Select value={region} onValueChange={(v) => { setRegion(v); setDistrict("ทั้งหมด"); setBranch("ทั้งหมด"); }}>
                  <SelectTrigger><SelectValue placeholder="เลือกภาค" /></SelectTrigger>
                  <SelectContent>
                    {regions.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              {/* District */}
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">เขต</label>
                <Select value={district} onValueChange={(v) => { setDistrict(v); setBranch("ทั้งหมด"); }}>
                  <SelectTrigger><SelectValue placeholder="เลือกเขต" /></SelectTrigger>
                  <SelectContent>
                    {districts.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              {/* Branch */}
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">สาขา</label>
                <Select value={branch} onValueChange={setBranch}>
                  <SelectTrigger><SelectValue placeholder="เลือกสาขา" /></SelectTrigger>
                  <SelectContent>
                    {branches.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>

          {/* ช่วงเวลาเก็บแบบประเมิน */}
          <section>
            <div className="mb-3 text-lg font-semibold">ช่วงเวลาการประเมิน</div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">ประเภท</label>
                <Select value={timeType} onValueChange={(v: TimeType) => setTimeType(v)}>
                  <SelectTrigger><SelectValue placeholder="เลือกประเภทเวลา" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">ทั้งหมด</SelectItem>
                    <SelectItem value="monthly">รายเดือน</SelectItem>
                    <SelectItem value="back">ช่วงเวลาย้อนหลัง</SelectItem>
                    <SelectItem value="custom">กำหนดเอง</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* monthly / back / custom controls */}
              {timeType === "monthly" && (
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">เดือน</label>
                  <Select value={monthKey} onValueChange={setMonthKey}>
                    <SelectTrigger><SelectValue placeholder="เลือกเดือน" /></SelectTrigger>
                    <SelectContent>
                      {monthOptions.map((m) => (
                        <SelectItem key={m.key} value={m.key}>{m.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {timeType === "back" && (
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">ย้อนหลัง</label>
                  <Select value={backKey} onValueChange={setBackKey}>
                    <SelectTrigger><SelectValue placeholder="เลือกช่วงเวลา" /></SelectTrigger>
                    <SelectContent>
                      {backRanges.map((r) => (
                        <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {timeType === "custom" && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">เริ่ม</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">สิ้นสุด</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    />
                  </div>
                </>
              )}
            </div>
          </section>

          {/* ประเภทการให้บริการและทัศนคติ */}
          <section>
            <div className="mb-3 text-lg font-semibold">ประเภทการให้บริการ และทัศนคติ</div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">บริการ</label>
                <Select value={serviceType} onValueChange={setServiceType}>
                  <SelectTrigger><SelectValue placeholder="เลือกประเภทบริการ" /></SelectTrigger>
                  <SelectContent>
                    {serviceTypeOptions.map((x) => (
                      <SelectItem key={x} value={x}>{x}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">ทัศนคติ</label>
                <Select value={sentiment} onValueChange={(v: any) => setSentiment(v)}>
                  <SelectTrigger><SelectValue placeholder="เลือกทัศนคติ" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">ทั้งหมด</SelectItem>
                    <SelectItem value="positive">เชิงบวก</SelectItem>
                    <SelectItem value="negative">เชิงลบ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>

          {/* ประเภท / หมวดหมู่ ความคิดเห็น */}
          <section>
            <div className="mb-3 text-lg font-semibold">ประเภท / หมวดหมู่ ความคิดเห็น</div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">หัวข้อ</label>
                <Select
                  value={headCat}
                  onValueChange={(v: any) => {
                    setHeadCat(v);
                    setSubCat("all");
                  }}
                >
                  <SelectTrigger><SelectValue placeholder="เลือกหัวข้อการประเมิน" /></SelectTrigger>
                  <SelectContent>
                    {HEAD_CATEGORIES.map((c) => (
                      <SelectItem key={c.value} value={c.value as string}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">หมวดหมู่</label>
                <Select
                  value={subCat}
                  onValueChange={setSubCat}
                  disabled={headCat === "all"}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกหมวดย่อย" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">ทั้งหมด</SelectItem>
                    {subcatList.map((x) => (
                      <SelectItem key={x.code} value={x.code}>
                        {x.code} {x.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          ผลการค้นหา <span className="text-muted-foreground">({filtered.length} รายการ)</span>
        </h2>
      </div>

      <div className="space-y-4">
        {filtered.map((f) => {
          const codes = pickTagCodes(f);
          const severe =
            Object.values(f.sentiment).some((v) => v === -1) ||
            f.satisfaction.overall <= 2;

          return (
            <Card
              key={f.id}
              className={
                severe
                  ? "border-red-200 bg-rose-50"
                  : "border-border bg-background"
              }
            >
              <CardContent className="p-4">
                {/* Header line */}
                <div className="mb-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  <span><strong>รหัส:</strong> {f.id}</span>
                  <span><strong>วันที่:</strong> {f.date} {f.timestamp}</span>
                  <span>
                    <strong>พื้นที่:</strong> {f.branch.region} / {f.branch.district} / {f.branch.branch}
                  </span>
                  <span><strong>บริการ:</strong> {f.serviceType}</span>
                </div>

                {/* Comment */}
                <p className="mb-3 text-foreground leading-relaxed">{f.comment}</p>

                {/* Subtopics */}
                {codes.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {codes.map((c) => (
                      <Badge key={c} variant={severe ? "destructive" : "secondary"} className="text-xs">
                        {c} {LABEL_BY_CODE[c] ?? ""}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}

        {filtered.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              ไม่พบข้อมูลที่ตรงกับตัวกรอง
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
