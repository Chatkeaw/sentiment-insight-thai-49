// pages/ComplaintsPage.tsx
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

/* -------------------------------------------------------------------------- */
/*                             1) CSV (แก้ตรงนี้ได้)                           */
/* -------------------------------------------------------------------------- */
/** วาง CSV ทั้งก้อนของคุณแทนที่ตัวแปรนี้ได้เลย
 *  รูปแบบคอลัมน์: ภาค\tเขต\tหน่วยให้บริการ
 *  (คั่นด้วย tab \t หรือจะใช้เครื่องหมายจุลภาคแล้วเปลี่ยนตัว split ด้านล่างก็ได้)
 */
const CSV_TEXT = `ภาค\tเขต\tหน่วยให้บริการ
ภาค 1\tบางเขน\tบางเขน
ภาค 1\tราชวัตร\tนางเลิ้ง
ภาค 1\tสะพานใหม่\tดอนเมือง
ภาค 1\tห้วยขวาง\tพญาไท
ภาค 10\tนครพนม\tนครพนม
ภาค 10\tสกลนคร\tสกลนคร
ภาค 10\tหนองคาย\tหนองคาย
ภาค 11\tขอนแก่น 1\tขอนแก่น
ภาค 11\tชัยภูมิ\tชัยภูมิ
ภาค 12\tอุบลราชธานี 1\tอุบลราชธานี
ภาค 13\tนครราชสีมา 1\tนครราชสีมา
ภาค 13\tสระแก้ว\tสระแก้ว
ภาค 14\tปทุมธานี 1\tปทุมธานี
ภาค 14\tพระนครศรีอยุธยา 2\tพระนครศรีอยุธยา
ภาค 15\tชลบุรี 1\tชลบุรี
ภาค 15\tระยอง\tระยอง
ภาค 16\tภูเก็ต\tภูเก็ต
ภาค 16\tสุราษฎร์ธานี 1\tสุราษฎร์ธานี
ภาค 17\tนครศรีธรรมราช 1\tนครศรีธรรมราช
ภาค 17\tตรัง\tตรัง
ภาค 18\tสงขลา 2\tหาดใหญ่
ภาค 18\tนราธิวาส\tนราธิวาส
`;

/* parser CSV (tab-separated) -> Array<{region,district,branch}> */
type CsvRow = { region: string; district: string; branch: string };
function parseBranchCSV(txt: string): CsvRow[] {
  if (!txt?.trim()) return [];
  const lines = txt.trim().split(/\r?\n/);
  // ตัดหัวตารางออกถ้าดูเหมือน header
  const startIdx =
    /ภาค\s*[\t,]\s*เขต\s*[\t,]\s*(หน่วยให้บริการ|สาขา)/.test(lines[0]) ? 1 : 0;

  const rows: CsvRow[] = [];
  for (let i = startIdx; i < lines.length; i++) {
    const raw = lines[i].trim();
    if (!raw) continue;
    // รองรับทั้ง tab และ comma
    const parts = raw.split(/\t|,/).map((s) => s.trim());
    if (parts.length < 3) continue;
    rows.push({ region: parts[0], district: parts[1], branch: parts[2] });
  }
  return rows;
}

/** index สำหรับดึงรายการตามลำดับ ภาค -> เขต -> สาขา */
function buildBranchIndex(rows: CsvRow[]) {
  const regionSet = new Set<string>();
  const districtByRegion = new Map<string, Set<string>>();
  const branchByRegionDistrict = new Map<string, Set<string>>();
  const allBranches: CsvRow[] = [];

  rows.forEach((r) => {
    regionSet.add(r.region);
    if (!districtByRegion.has(r.region)) districtByRegion.set(r.region, new Set());
    districtByRegion.get(r.region)!.add(r.district);

    const key = `${r.region}|||${r.district}`;
    if (!branchByRegionDistrict.has(key))
      branchByRegionDistrict.set(key, new Set());
    branchByRegionDistrict.get(key)!.add(r.branch);

    allBranches.push(r);
  });

  const regions = ["ทั้งหมด", ...Array.from(regionSet)];
  const getDistricts = (region: string) => {
    if (region === "ทั้งหมด") return ["ทั้งหมด"];
    return ["ทั้งหมด", ...(districtByRegion.get(region) ? Array.from(districtByRegion.get(region)!) : [])];
  };
  const getBranches = (region: string, district: string) => {
    if (region === "ทั้งหมด" || district === "ทั้งหมด") return ["ทั้งหมด"];
    const key = `${region}|||${district}`;
    return ["ทั้งหมด", ...(branchByRegionDistrict.get(key) ? Array.from(branchByRegionDistrict.get(key)!) : [])];
  };

  return { regions, getDistricts, getBranches, allBranches };
}

/* -------------------------------------------------------------------------- */
/*                      2) Mapping mock feedback -> CSV                       */
/* -------------------------------------------------------------------------- */
/** เลือก CSV ให้ feedback ใช้ เพื่อให้ตัวกรองทำงานกับข้อมูล CSV ได้จริง
 *   - ถ้าชื่อสาขาใน mock ตรงกับ CSV จะจับคู่ตรง ๆ
 *   - ถ้าไม่ตรง จะวนแจกสาขาจาก CSV ตามลำดับ (เพื่อให้มีข้อมูลให้กรอง)
 */
function attachCsvBranchToFeedback(feedback: FeedbackEntry[], csv: CsvRow[]) {
  if (!csv.length) return feedback;
  // map ชื่อสาขา -> แถว CSV (อย่างง่าย)
  const mapByBranch = new Map<string, CsvRow>();
  csv.forEach((r) => mapByBranch.set(r.branch, r));

  return feedback.map((f, i) => {
    const found = mapByBranch.get(f.branch.branch);
    const pick = found ?? csv[i % csv.length];
    return {
      ...f,
      branch: {
        branch: pick.branch,
        district: pick.district,
        region: pick.region,
      },
    };
  });
}

/* -------------------------------------------------------------------------- */
/*                       (คงของเดิม) หมวด/แท็ก ข้อร้องเรียน                  */
/* -------------------------------------------------------------------------- */
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
  staffPoliteness: "1.1",
  staffCare: "1.2",
  staffConsultation: "1.3",
  staffAccuracy: "1.4",
  staffSpeed: "1.5",
  staffProfessionalism: "1.6",
  staffImpression: "1.7",
  staffSecurity: "1.8",
  serviceReadiness: "2.1",
  serviceProcess: "2.2",
  serviceQueue: "2.3",
  serviceDocuments: "2.4",
  techCore: "3.1",
  techQueue: "3.2",
  techATM: "3.3",
  techKYC: "3.4",
  techApp: "3.5",
  techBookUpdate: "3.6",
  techCashCounter: "3.7",
  productDetails: "4.1",
  productConditions: "4.2",
  productApprovalTime: "4.3",
  productFlexibility: "4.4",
  productSimplicity: "4.5",
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
  conductNoDeception: "6.1",
  conductNoAdvantage: "6.2",
  conductNoForcing: "6.3",
  conductNoDisturbance: "6.4",
  otherImpression: "7.1",
};

const LABEL_BY_CODE = Object.fromEntries(
  Object.values(SUBCATS).flat().map((x) => [x.code, x.label])
);

function pickTagCodes(f: FeedbackEntry): string[] {
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
  /* ---------- ใช้ CSV ทำ index + ผูก CSV ให้กับ mockFeedbackData ---------- */
  const csvRows = useMemo(() => parseBranchCSV(CSV_TEXT), []);
  const idx = useMemo(() => buildBranchIndex(csvRows), [csvRows]);
  const data = useMemo(
    () => attachCsvBranchToFeedback(mockFeedbackData, csvRows),
    [csvRows]
  );

  /* ---------------------------- header dropdowns ---------------------------- */
  // ภาค
  const regions = idx.regions;
  const [region, setRegion] = useState<string>("ทั้งหมด");

  // เขต (ขึ้นกับภาค)
  const districts = useMemo(() => idx.getDistricts(region), [idx, region]);
  const [district, setDistrict] = useState<string>("ทั้งหมด");

  // สาขา (ขึ้นกับภาค + เขต)
  const branches = useMemo(
    () => idx.getBranches(region, district),
    [idx, region, district]
  );
  const [branch, setBranch] = useState<string>("ทั้งหมด");

  // เวลา
  const [timeType, setTimeType] = useState<TimeType>("all");
  const [monthKey, setMonthKey] = useState<string>("");
  const [backKey, setBackKey] = useState<string>("1m");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // ประเภท/ทัศนคติ
  const [serviceType, setServiceType] = useState("ทั้งหมด");
  const [sentiment, setSentiment] = useState<"all" | "positive" | "negative">(
    "all"
  );

  // หมวด
  const [headCat, setHeadCat] =
    useState<(typeof HEAD_CATEGORIES)[number]["value"]>("all");
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
      const th = d.toLocaleDateString("th-TH", { year: "2-digit", month: "long" });
      list.push({ key, label: th });
    }
    return list;
  }, []);

  function parseDate(s: string): Date | null {
    if (!s) return null;
    if (s.includes("-")) return new Date(s);
    if (s.includes("/")) {
      const [dd, mm, yyyy] = s.split("/");
      return new Date(parseInt(yyyy, 10), parseInt(mm, 10) - 1, parseInt(dd, 10));
    }
    return new Date(s);
  }

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

  /* ------------------------------- filtering ------------------------------- */
  const filtered = useMemo(() => {
    return data
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
      .sort(
        (a, b) =>
          (parseDate(b.date)?.getTime() ?? 0) -
          (parseDate(a.date)?.getTime() ?? 0)
      );
  }, [
    data,
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
      <div>
        <h1 className="text-3xl font-bold text-foreground">ข้อร้องเรียนลูกค้า</h1>
        <p className="text-muted-foreground">ระบบสรุปข้อร้องเรียนสำคัญจากลูกค้า</p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-xl">ตัวกรองการแสดงผล</CardTitle>
          <Button variant="outline" onClick={resetAll}>
            ล้างตัวกรอง
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* พื้นที่ให้บริการ */}
          <section>
            <div className="mb-3 text-lg font-semibold">พื้นที่</div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {/* Region */}
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">ภาค</label>
                <Select
                  key={`region-${region}`}
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
                    {regions.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* District */}
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">เขต</label>
                <Select
                  key={`district-${region}-${district}`}
                  value={district}
                  onValueChange={(v) => {
                    setDistrict(v);
                    setBranch("ทั้งหมด");
                  }}
                  disabled={region === "ทั้งหมด"}
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

              {/* Branch */}
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">สาขา</label>
                <Select
                  key={`branch-${region}-${district}-${branch}`}
                  value={branch}
                  onValueChange={setBranch}
                  disabled={region === "ทั้งหมด" || district === "ทั้งหมด"}
                >
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
            </div>
          </section>

          {/* ช่วงเวลาการประเมิน */}
          <section>
            <div className="mb-3 text-lg font-semibold">ช่วงเวลาการประเมิน</div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">ประเภท</label>
                <Select value={timeType} onValueChange={(v: TimeType) => setTimeType(v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกประเภทเวลา" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">ทั้งหมด</SelectItem>
                    <SelectItem value="monthly">รายเดือน</SelectItem>
                    <SelectItem value="back">ช่วงเวลาย้อนหลัง</SelectItem>
                    <SelectItem value="custom">กำหนดเอง</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {timeType === "monthly" && (
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">เดือน</label>
                  <Select value={monthKey} onValueChange={setMonthKey}>
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกเดือน" />
                    </SelectTrigger>
                    <SelectContent>
                      {monthOptions.map((m) => (
                        <SelectItem key={m.key} value={m.key}>
                          {m.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {timeType === "back" && (
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">ย้อนหลัง</label>
                  <Select value={backKey} onValueChange={setBackKey}>
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกช่วงเวลา" />
                    </SelectTrigger>
                    <SelectContent>
                      {backRanges.map((r) => (
                        <SelectItem key={r.value} value={r.value}>
                          {r.label}
                        </SelectItem>
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
            <div className="mb-3 text-lg font-semibold">
              ประเภทการให้บริการ และทัศนคติ
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">บริการ</label>
                <Select value={serviceType} onValueChange={setServiceType}>
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกประเภทบริการ" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceTypeOptions.map((x) => (
                      <SelectItem key={x} value={x}>
                        {x}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">ทัศนคติ</label>
                <Select
                  value={sentiment}
                  onValueChange={(v: any) => setSentiment(v)}
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
            </div>
          </section>

          {/* ประเภท / หมวดหมู่ ความคิดเห็น */}
          <section>
            <div className="mb-3 text-lg font-semibold">
              ประเภท / หมวดหมู่ ความคิดเห็น
            </div>
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
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกหัวข้อการประเมิน" />
                  </SelectTrigger>
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
          ผลการค้นหา{" "}
          <span className="text-muted-foreground">({filtered.length} รายการ)</span>
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
                severe ? "border-red-200 bg-rose-50" : "border-border bg-background"
              }
            >
              <CardContent className="p-4">
                <div className="mb-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  <span>
                    <strong>รหัส:</strong> {f.id}
                  </span>
                  <span>
                    <strong>วันที่:</strong> {f.date} {f.timestamp}
                  </span>
                  <span>
                    <strong>พื้นที่:</strong> {f.branch.region} / {f.branch.district} /{" "}
                    {f.branch.branch}
                  </span>
                  <span>
                    <strong>บริการ:</strong> {f.serviceType}
                  </span>
                </div>

                <p className="mb-3 leading-relaxed text-foreground">{f.comment}</p>

                {codes.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {codes.map((c) => (
                      <Badge
                        key={c}
                        variant={severe ? "destructive" : "secondary"}
                        className="text-xs"
                      >
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
