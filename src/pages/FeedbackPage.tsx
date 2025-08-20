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
import { ExportButton } from "@/components/shared/ExportButton";
import { mockFeedbackData } from "@/data/mockData";
import { FeedbackEntry } from "@/types/dashboard";

/* ---------------------------------------------
   Time filter (inline component + helpers)
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

/** แปลง "dd/mm/yyyy (พ.ศ.)" เป็น Date */
function parseThaiDate(dateStr: string): Date {
  // mockData สร้างด้วย toLocaleDateString('th-TH') => ส่วนใหญ่เป็น dd/mm/2568
  const parts = dateStr.split("/");
  if (parts.length === 3) {
    const [dd, mm, yyyy] = parts.map((p) => parseInt(p, 10));
    const year = yyyy > 2400 ? fromBE(yyyy) : yyyy;
    return new Date(year, (mm || 1) - 1, dd || 1);
  }
  // fallback
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
  // custom
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

  // sync outside-in (optional)
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

  // notify parent
  useEffect(() => {
    if (mode === "all") onChange({ mode: "all" });
    if (mode === "monthly") onChange({ mode: "monthly", month, yearBE: year });
    if (mode === "relative") onChange({ mode: "relative", days: relDays });
    if (mode === "custom") onChange({ mode: "custom", start, end });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, month, year, relDays, start, end]);

  // make 12 month options of current BE year
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
        {/* ประเภทเวลา */}
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

          {/* รายเดือน → เดือน */}
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
                    {/* แสดงปี พ.ศ. ปัจจุบันและย้อนหลัง 1 ปี */}
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

          {/* ย้อนหลัง */}
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

          {/* กำหนดเอง */}
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

export const FeedbackPage: React.FC = () => {
  // ===== ตัวกรองหลักอื่น ๆ =====
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("all");
  const [selectedBranch, setSelectedBranch] = useState<string>("all");
  const [selectedMainCategory, setSelectedMainCategory] =
    useState<string>("all");
  const [selectedSubCategory, setSelectedSubCategory] =
    useState<string>("all");
  const [selectedServiceType, setSelectedServiceType] =
    useState<string>("all");
  const [selectedSentiment, setSelectedSentiment] = useState<string>("all");

  // ====== เวลา (ใหม่) ======
  const [timeFilter, setTimeFilter] = useState<TimeFilterValue>({ mode: "all" });

  // location sets
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

  // main/sub categories (ใช้ชุดเดิมจากไฟล์ของคุณ)
  const mainCategories = [
    { value: "all", label: "ทั้งหมด" },
    { value: "staff", label: "พนักงานและบุคลากร" },
    { value: "service", label: "ระบบและกระบวนการให้บริการ" },
    { value: "technology", label: "เทคโนโลยีและดิจิทัล" },
    { value: "products", label: "ผลิตภัณฑ์และบริการทางการเงิน" },
    { value: "environment", label: "สภาพแวดล้อมและสิ่งอำนวยความสะดวก" },
    {
      value: "marketConduct",
      label: "การปฏิบัติตามหลักธรรมาภิบาลทางการตลาด",
    },
    { value: "other", label: "อื่นๆ" },
  ];

  const subCategoryMap: { [key: string]: Array<{ value: string; label: string }> } =
    {
      staff: [
        { value: "staffPoliteness", label: "ความสุภาพ" },
        { value: "staffCare", label: "การดูแลเอาใจใส่" },
        { value: "staffConsultation", label: "การให้คำปรึกษา" },
        { value: "staffAccuracy", label: "ความถูกต้อง" },
        { value: "staffSpeed", label: "ความรวดเร็ว" },
        { value: "staffProfessionalism", label: "ความเป็นมืออาชีพ" },
        { value: "staffImpression", label: "ความประทับใจ" },
        { value: "staffSecurity", label: "ความปลอดภัย" },
      ],
      service: [
        { value: "serviceReadiness", label: "ความพร้อมของบริการ" },
        { value: "serviceProcess", label: "กระบวนการให้บริการ" },
        { value: "serviceQueue", label: "ระบบจัดการคิว" },
        { value: "serviceDocuments", label: "เอกสารและข้อมูล" },
      ],
      technology: [
        { value: "techCore", label: "ระบบ Core ของธนาคาร" },
        { value: "techQueue", label: "ระบบเรียกคิวและจัดการคิว" },
        { value: "techATM", label: "ATM ADM CDM" },
        { value: "techKYC", label: "ระบบ KYC" },
        { value: "techApp", label: "MyMo Application" },
        { value: "techBookUpdate", label: "ระบบปรับปรุงสมุดบัญชี" },
        { value: "techCashCounter", label: "เครื่องนับเงิน" },
      ],
      products: [
        { value: "productDetails", label: "รายละเอียดผลิตภัณฑ์" },
        { value: "productConditions", label: "เงื่อนไขการใช้บริการ" },
        { value: "productApprovalTime", label: "ระยะเวลาอนุมัติ" },
        { value: "productFlexibility", label: "ความยืดหยุ่น" },
        { value: "productSimplicity", label: "ความง่ายในการใช้" },
      ],
      environment: [
        { value: "envCleanliness", label: "ความสะอาด" },
        { value: "envSpace", label: "พื้นที่และความคับคั่ง" },
        { value: "envTemperature", label: "อุณหภูมิ" },
        { value: "envDesk", label: "โต๊ะทำงานและเก้าอี้" },
        { value: "envWaitingArea", label: "พื้นที่นั่งรอ" },
        { value: "envLighting", label: "แสงสว่าง" },
        { value: "envSound", label: "เสียงรบกวน" },
        { value: "envRestroom", label: "ห้องน้ำ" },
        { value: "envParking", label: "ที่จอดรถ" },
        { value: "envSignage", label: "ป้ายบอกทางและสัญลักษณ์" },
        { value: "envOtherFacilities", label: "สิ่งอำนวยความสะดวกอื่นๆ" },
      ],
      marketConduct: [
        { value: "conductNoDeception", label: "ไม่หลอกลวง" },
        { value: "conductNoAdvantage", label: "ไม่เอาเปรียบ" },
        { value: "conductNoForcing", label: "ไม่บังคับ" },
        { value: "conductNoDisturbance", label: "ไม่รบกวน" },
      ],
      other: [{ value: "otherImpression", label: "ความประทับใจโดยรวม" }],
    };

  const subCategories = useMemo(() => {
    if (selectedMainCategory === "all")
      return [{ value: "all", label: "ทั้งหมด" }];
    return [
      { value: "all", label: "ทั้งหมด" },
      ...(subCategoryMap[selectedMainCategory] || []),
    ];
  }, [selectedMainCategory]);

  const serviceTypes = [
    "ทั้งหมด",
    "การฝากเงิน/ถอนเงิน",
    "การซื้อผลิตภัณฑ์",
    "การชำระค่าบริการ/ค่าธรรมเนียม",
    "อื่นๆ",
  ];

  // ===== กรองข้อมูล =====
  const filteredFeedback = useMemo(() => {
    return mockFeedbackData
      .filter((feedback) => {
        // เวลา
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

        // ทัศนคติ (+/-)
        if (selectedSentiment !== "all") {
          const hasPositive = Object.values(feedback.sentiment).some(
            (s) => s === 1
          );
          const hasNegative = Object.values(feedback.sentiment).some(
            (s) => s === -1
          );
          if (selectedSentiment === "positive" && !hasPositive) return false;
          if (selectedSentiment === "negative" && !hasNegative) return false;
        }

        // หมวดหมู่หลัก
        if (selectedMainCategory !== "all") {
          const categoryValue =
            feedback.sentiment[
              selectedMainCategory as keyof typeof feedback.sentiment
            ];
          if (categoryValue === 0) return false;
        }

        // หมวดย่อย
        if (selectedSubCategory !== "all") {
          const detailed = feedback.detailedSentiment;
          if (!detailed || detailed[selectedSubCategory as any] === 0)
            return false;
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
    selectedSubCategory,
    selectedServiceType,
    selectedSentiment,
  ]);

  // helper ui
  const getSentimentColor = (sentiment: number) => {
    if (sentiment === 1) return "bg-green-100";
    if (sentiment === -1) return "bg-red-100";
    return "bg-gray-100";
  };
  const getFeedbackColor = (feedback: FeedbackEntry) => {
    const sentiments = Object.values(feedback.sentiment);
    const hasPositive = sentiments.some((s) => s === 1);
    const hasNegative = sentiments.some((s) => s === -1);
    if (hasPositive && hasNegative) return "bg-yellow-100";
    if (hasPositive) return "bg-green-100";
    if (hasNegative) return "bg-red-100";
    return "bg-gray-100";
  };
  const getDetailedSentiments = (feedback: FeedbackEntry) => {
    const results: Array<{
      category: string;
      subcategory: string;
      sentiment: number;
    }> = [];
    Object.entries(feedback.detailedSentiment).forEach(([key, value]) => {
      if (value !== 0) {
        const mainCat = mainCategories.find((cat) =>
          (subCategoryMap[cat.value] || []).some((sub) => sub.value === key)
        );
        const subCat = (subCategoryMap[mainCat?.value || ""] || []).find(
          (sub) => sub.value === key
        );
        if (mainCat && subCat) {
          results.push({
            category: mainCat.label,
            subcategory: subCat.label,
            sentiment: value,
          });
        }
      }
    });
    return results;
  };

  return (
    <div className="space-y-6 max-w-full">
      {/* หัวข้อ */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-foreground">ความคิดเห็น</h2>
      </div>

      {/* ✅ ช่วงเวลาเก็บแบบประเมิน (ใหม่) */}
      <TimeRangeFilter value={timeFilter} onChange={setTimeFilter} />

      {/* ฟิลเตอร์สถานที่/หมวดหมู่อื่น ๆ */}
      <Card className="chart-container-medium">
        <CardHeader>
          <CardTitle className="card-title">ตัวกรองข้อมูล</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* สถานที่ */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              พื้นที่ให้บริการ
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

          {/* หมวดหมู่/บริการ/ทัศนคติ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                หมวดหมู่ที่ถูกกล่าวถึง
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  value={selectedMainCategory}
                  onValueChange={(value) => {
                    setSelectedMainCategory(value);
                    setSelectedSubCategory("all");
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกหมวดหมู่หลัก" />
                  </SelectTrigger>
                  <SelectContent>
                    {mainCategories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={selectedSubCategory}
                  onValueChange={setSelectedSubCategory}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกหมวดหมู่ย่อย" />
                  </SelectTrigger>
                  <SelectContent>
                    {subCategories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  ประเภทการให้บริการ
                </label>
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
                <label className="text-sm font-medium text-foreground">
                  ทัศนคติของความคิดเห็น
                </label>
                <Select
                  value={selectedSentiment}
                  onValueChange={setSelectedSentiment}
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
          </div>
        </CardContent>
      </Card>

      {/* รายการ */}
      <Card className="chart-container-large">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="card-title">
            รายการความคิดเห็น ({filteredFeedback.length} รายการ)
          </CardTitle>
          <ExportButton
            data={filteredFeedback}
            type="feedback"
            filename="ความคิดเห็นลูกค้า"
            title="รายการความคิดเห็นลูกค้า"
          />
        </CardHeader>
        <CardContent>
          <div className="max-h-96 overflow-y-auto space-y-4">
            {filteredFeedback.map((feedback) => {
              const detailedSentiments = getDetailedSentiments(feedback);
              return (
                <div
                  key={feedback.id}
                  className={`p-4 rounded-lg border ${getFeedbackColor(
                    feedback
                  )}`}
                >
                  <div className="flex flex-wrap gap-4 mb-3 text-sm text-gray-600">
                    <span>
                      <strong>วันที่:</strong> {feedback.date}{" "}
                      {feedback.timestamp}
                    </span>
                    <span>
                      <strong>บริการ:</strong> {feedback.serviceType}
                    </span>
                    <span>
                      <strong>สาขา:</strong> {feedback.branch.branch} /{" "}
                      {feedback.branch.district} / {feedback.branch.region}
                    </span>
                  </div>

                  <div className="mb-3">
                    <p className="text-gray-800 leading-relaxed">
                      {feedback.comment}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-700">
                      หมวดหมู่ที่เกี่ยวข้อง:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {detailedSentiments.map((item, index) => (
                        <Badge
                          key={index}
                          className={`${getSentimentColor(
                            item.sentiment
                          )} text-gray-800 border-0`}
                        >
                          {item.category}: {item.subcategory}
                          {item.sentiment === 1 ? " 👍" : " 👎"}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredFeedback.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                ไม่พบความคิดเห็นที่ตรงกับเงื่อนไขที่เลือก
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
