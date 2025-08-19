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
import TimeFilter from "@/components/TimeFilter";
import { ExportButton } from "@/components/shared/ExportButton";
import { TimeFilter as TimeFilterType, FeedbackEntry } from "@/types/dashboard";
import { mockFeedbackData } from "@/data/mockData";
import { Calendar, Search, RotateCcw } from "lucide-react";

/* ------------------------- page props ------------------------- */
interface FeedbackPageProps {
  timeFilter: TimeFilterType["value"];
  onTimeFilterChange: (value: TimeFilterType["value"]) => void;
}

/* ---------------------- helper: label map --------------------- */
const mainCategories = [
  { value: "all", label: "ทั้งหมด" },
  { value: "staff", label: "พนักงานและบุคลากร" },
  { value: "service", label: "ระบบและกระบวนการให้บริการ" },
  { value: "technology", label: "เทคโนโลยีและดิจิทัล" },
  { value: "products", label: "ผลิตภัณฑ์และบริการทางการเงิน" },
  { value: "environment", label: "สภาพแวดล้อมและสิ่งอำนวยความสะดวก" },
  { value: "marketConduct", label: "การปฏิบัติตามหลักธรรมาภิบาลทางการตลาด" },
  { value: "other", label: "อื่นๆ" },
];

const subCategoryMap: Record<string, Array<{ value: string; label: string }>> = {
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
    { value: "techQueue", label: "ระบบเรียกคิว" },
    { value: "techATM", label: "ATM / ADM / CDM" },
    { value: "techKYC", label: "ระบบ KYC" },
    { value: "techApp", label: "แอป MyMo" },
    { value: "techBookUpdate", label: "ระบบปรับสมุดบัญชี" },
    { value: "techCashCounter", label: "เครื่องนับเงิน" },
  ],
  products: [
    { value: "productDetails", label: "รายละเอียดผลิตภัณฑ์" },
    { value: "productConditions", label: "เงื่อนไข" },
    { value: "productApprovalTime", label: "ระยะเวลาอนุมัติ" },
    { value: "productFlexibility", label: "ความยืดหยุ่น" },
    { value: "productSimplicity", label: "ความง่ายในการใช้" },
  ],
  environment: [
    { value: "envCleanliness", label: "ความสะอาด" },
    { value: "envSpace", label: "พื้นที่/ความคับคั่ง" },
    { value: "envTemperature", label: "อุณหภูมิ" },
    { value: "envDesk", label: "โต๊ะ/เก้าอี้" },
    { value: "envWaitingArea", label: "พื้นที่นั่งรอ" },
    { value: "envLighting", label: "แสงสว่าง" },
    { value: "envSound", label: "เสียง" },
    { value: "envRestroom", label: "ห้องน้ำ" },
    { value: "envParking", label: "ที่จอดรถ" },
    { value: "envSignage", label: "ป้าย/สัญลักษณ์" },
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

const serviceTypes = [
  "ทั้งหมด",
  "การฝากเงิน/ถอนเงิน",
  "การซื้อผลิตภัณฑ์",
  "การชำระค่าบริการ/ค่าธรรมเนียม",
  "อื่นๆ",
];

const periodTypes = [
  { value: "monthly", label: "รายเดือน" },
  { value: "quarterly", label: "รายไตรมาส" },
  { value: "custom", label: "กำหนดเอง" },
];

/* ---------------------------- page ---------------------------- */
export const FeedbackPage: React.FC<FeedbackPageProps> = ({
  timeFilter,
  onTimeFilterChange,
}) => {
  // location
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedDistrict, setSelectedDistrict] = useState("all");
  const [selectedBranch, setSelectedBranch] = useState("all");

  // category
  const [selectedMainCategory, setSelectedMainCategory] = useState("all");
  const [selectedSubCategory, setSelectedSubCategory] = useState("all");

  // service / sentiment
  const [selectedServiceType, setSelectedServiceType] = useState("all");
  const [selectedSentiment, setSelectedSentiment] = useState("all");

  // period
  const [periodType, setPeriodType] = useState<"monthly" | "quarterly" | "custom">("monthly");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");

  // load/save filters (ช่วยให้ปุ่ม “ค้นหา” มีผลชัดเจน)
  useEffect(() => {
    const saved = localStorage.getItem("feedback.filters");
    if (saved) {
      try {
        const f = JSON.parse(saved);
        setSelectedRegion(f.selectedRegion ?? "all");
        setSelectedDistrict(f.selectedDistrict ?? "all");
        setSelectedBranch(f.selectedBranch ?? "all");
        setSelectedMainCategory(f.selectedMainCategory ?? "all");
        setSelectedSubCategory(f.selectedSubCategory ?? "all");
        setSelectedServiceType(f.selectedServiceType ?? "all");
        setSelectedSentiment(f.selectedSentiment ?? "all");
        setPeriodType(f.periodType ?? "monthly");
        setFromDate(f.fromDate ?? "");
        setToDate(f.toDate ?? "");
      } catch {}
    }
  }, []);

  const handleApply = () => {
    const payload = {
      selectedRegion,
      selectedDistrict,
      selectedBranch,
      selectedMainCategory,
      selectedSubCategory,
      selectedServiceType,
      selectedSentiment,
      periodType,
      fromDate,
      toDate,
    };
    localStorage.setItem("feedback.filters", JSON.stringify(payload));
  };

  const handleReset = () => {
    setSelectedRegion("all");
    setSelectedDistrict("all");
    setSelectedBranch("all");
    setSelectedMainCategory("all");
    setSelectedSubCategory("all");
    setSelectedServiceType("all");
    setSelectedSentiment("all");
    setPeriodType("monthly");
    setFromDate("");
    setToDate("");
    localStorage.removeItem("feedback.filters");
  };

  // options
  const regions = useMemo(() => {
    const unique = Array.from(new Set(mockFeedbackData.map((f) => f.branch.region))).sort();
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
              (selectedRegion === "all" || f.branch.region === selectedRegion) &&
              f.branch.district === selectedDistrict
          )
          .map((f) => f.branch.branch)
      )
    ).sort();
    return ["all", ...unique];
  }, [selectedRegion, selectedDistrict]);

  const subCategories = useMemo(() => {
    if (selectedMainCategory === "all")
      return [{ value: "all", label: "ทั้งหมด" }];
    return [{ value: "all", label: "ทั้งหมด" }, ...(subCategoryMap[selectedMainCategory] || [])];
  }, [selectedMainCategory]);

  // data filter
  const filteredFeedback = useMemo(() => {
    return mockFeedbackData
      .filter((feedback) => {
        if (selectedRegion !== "all" && feedback.branch.region !== selectedRegion) return false;
        if (selectedDistrict !== "all" && feedback.branch.district !== selectedDistrict) return false;
        if (selectedBranch !== "all" && feedback.branch.branch !== selectedBranch) return false;

        if (selectedServiceType !== "all" && selectedServiceType !== "ทั้งหมด" &&
            feedback.serviceType !== selectedServiceType) return false;

        if (selectedSentiment !== "all") {
          const values = Object.values(feedback.sentiment);
          const hasPos = values.some((v) => v === 1);
          const hasNeg = values.some((v) => v === -1);
          if (selectedSentiment === "positive" && !hasPos) return false;
          if (selectedSentiment === "negative" && !hasNeg) return false;
        }

        if (selectedMainCategory !== "all") {
          const v = feedback.sentiment[selectedMainCategory as keyof typeof feedback.sentiment];
          if (v === 0) return false;
        }

        // periodType == 'custom' → กรองตามวันที่ (mock format: YYYY-MM-DD)
        if (periodType === "custom" && (fromDate || toDate)) {
          const d = new Date(feedback.date).getTime();
          if (fromDate && d < new Date(fromDate).getTime()) return false;
          if (toDate && d > new Date(toDate).getTime()) return false;
        }

        return true;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [
    selectedRegion,
    selectedDistrict,
    selectedBranch,
    selectedMainCategory,
    selectedServiceType,
    selectedSentiment,
    periodType,
    fromDate,
    toDate,
  ]);

  const getSentimentColor = (s: number) =>
    s === 1 ? "bg-green-100" : s === -1 ? "bg-red-100" : "bg-gray-100";
  const getFeedbackColor = (f: FeedbackEntry) => {
    const arr = Object.values(f.sentiment);
    const pos = arr.some((v) => v === 1);
    const neg = arr.some((v) => v === -1);
    if (pos && neg) return "bg-yellow-100";
    if (pos) return "bg-green-100";
    if (neg) return "bg-red-100";
    return "bg-gray-100";
  };
  const getDetailedSentiments = (f: FeedbackEntry) => {
    const list: Array<{ category: string; subcategory: string; sentiment: number }> = [];
    Object.entries(f.detailedSentiment).forEach(([k, v]) => {
      if (v !== 0) {
        const mc = mainCategories.find((c) => subCategoryMap[c.value]?.some((s) => s.value === k));
        const sc = subCategoryMap[mc?.value || ""]?.find((s) => s.value === k);
        if (mc && sc) list.push({ category: mc.label, subcategory: sc.label, sentiment: v });
      }
    });
    return list;
  };

  return (
    <div className="space-y-6 max-w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">ความคิดเห็น</h2>
        <TimeFilter value={timeFilter} onChange={onTimeFilterChange} />
      </div>

      {/* FILTERS – layout ให้ใกล้แบบอ้างอิง */}
      <Card className="border-0 shadow-none">
        <CardHeader className="p-0 mb-2">
          <CardTitle className="text-lg font-semibold">ตัวกรองความคิดเห็น</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="rounded-xl border bg-gradient-to-b from-pink-50 to-white p-4 md:p-5">
            {/* action buttons */}
            <div className="flex justify-end gap-2 mb-3">
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm text-rose-700 bg-white hover:bg-rose-50"
              >
                <RotateCcw className="h-4 w-4" />
                ล้างตัวกรอง
              </button>
              <button
                onClick={handleApply}
                className="rounded-md bg-rose-500 px-4 py-2 text-sm font-medium text-white hover:bg-rose-600"
              >
                ค้นหา
              </button>
            </div>

            {/* พื้นที่ให้บริการ */}
            <div className="space-y-2">
              <div className="text-sm font-medium text-foreground">พื้นที่ให้บริการ</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* ภาค */}
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Select
                    value={selectedRegion}
                    onValueChange={(v) => {
                      setSelectedRegion(v);
                      setSelectedDistrict("all");
                      setSelectedBranch("all");
                    }}
                  >
                    <SelectTrigger className="pl-9">
                      <SelectValue placeholder="เลือกภาค" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">ทั้งหมด</SelectItem>
                      {regions.filter((r) => r !== "all").map((r) => (
                        <SelectItem key={r} value={r}>
                          {r}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* เขต */}
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Select
                    value={selectedDistrict}
                    onValueChange={(v) => {
                      setSelectedDistrict(v);
                      setSelectedBranch("all");
                    }}
                  >
                    <SelectTrigger className="pl-9">
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

                {/* สาขา */}
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                    <SelectTrigger className="pl-9">
                      <SelectValue placeholder="เลือกสาขา" />
                    </SelectTrigger>
                    <SelectContent>
                      {branches.map((b) => (
                        <SelectItem key={b} value={b}>
                          {b === "all" ? "ทั้งหมด" : b}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* ช่วงเวลาเก็บแบบประเมิน */}
            <div className="mt-5 space-y-2">
              <div className="text-sm font-medium text-foreground">ช่วงเวลาเก็บแบบประเมิน</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Select
                    value={periodType}
                    onValueChange={(v: "monthly" | "quarterly" | "custom") => setPeriodType(v)}
                  >
                    <SelectTrigger className="pl-9">
                      <SelectValue placeholder="เลือกประเภทช่วงเวลา" />
                    </SelectTrigger>
                    <SelectContent>
                      {periodTypes.map((p) => (
                        <SelectItem key={p.value} value={p.value}>
                          {p.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    disabled={periodType !== "custom"}
                    className="w-full rounded-md border bg-white px-9 py-2 text-sm outline-none disabled:bg-gray-50"
                    placeholder="ตั้งแต่"
                  />
                </div>

                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    disabled={periodType !== "custom"}
                    className="w-full rounded-md border bg-white px-9 py-2 text-sm outline-none disabled:bg-gray-50"
                    placeholder="ถึง"
                  />
                </div>
              </div>
            </div>

            {/* ประเภทการให้บริการ + ทัศนคติ */}
            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-2">
                <div className="text-sm font-medium text-foreground">ประเภทการให้บริการ</div>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Select value={selectedServiceType} onValueChange={setSelectedServiceType}>
                    <SelectTrigger className="pl-9">
                      <SelectValue placeholder="เลือกประเภทบริการ" />
                    </SelectTrigger>
                    <SelectContent>
                      {serviceTypes.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium text-foreground">ทัศนคติ</div>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Select value={selectedSentiment} onValueChange={setSelectedSentiment}>
                    <SelectTrigger className="pl-9">
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

            {/* ประเภท / หมวดหมู่ ความคิดเห็น */}
            <div className="mt-5 space-y-2">
              <div className="text-sm font-medium text-foreground">
                ประเภท / หมวดหมู่ ความคิดเห็น
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Select
                    value={selectedMainCategory}
                    onValueChange={(v) => {
                      setSelectedMainCategory(v);
                      setSelectedSubCategory("all");
                    }}
                  >
                    <SelectTrigger className="pl-9">
                      <SelectValue placeholder="เลือกหมวดหมู่หลัก" />
                    </SelectTrigger>
                    <SelectContent>
                      {mainCategories.map((c) => (
                        <SelectItem key={c.value} value={c.value}>
                          {c.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Select value={selectedSubCategory} onValueChange={setSelectedSubCategory}>
                    <SelectTrigger className="pl-9">
                      <SelectValue placeholder="เลือกหมวดหมู่ย่อย" />
                    </SelectTrigger>
                    <SelectContent>
                      {subCategories.map((c) => (
                        <SelectItem key={c.value} value={c.value}>
                          {c.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* LIST */}
      <Card>
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
            {filteredFeedback.map((fb) => {
              const details = getDetailedSentiments(fb);
              return (
                <div key={fb.id} className={`p-4 rounded-lg border ${getFeedbackColor(fb)}`}>
                  <div className="mb-2 flex flex-wrap gap-4 text-sm text-gray-600">
                    <span><b>วันที่:</b> {fb.date} {fb.timestamp}</span>
                    <span><b>บริการ:</b> {fb.serviceType}</span>
                    <span><b>สาขา:</b> {fb.branch.branch} / {fb.branch.district} / {fb.branch.region}</span>
                  </div>
                  <p className="mb-3 text-gray-800">{fb.comment}</p>
                  {details.length > 0 && (
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-gray-700">หมวดหมู่ที่เกี่ยวข้อง:</div>
                      <div className="flex flex-wrap gap-2">
                        {details.map((it, i) => (
                          <Badge key={i} className={`${getSentimentColor(it.sentiment)} text-gray-800 border-0`}>
                            {it.category}: {it.subcategory} {it.sentiment === 1 ? "👍" : "👎"}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            {filteredFeedback.length === 0 && (
              <div className="py-10 text-center text-muted-foreground">
                ไม่พบความคิดเห็นที่ตรงกับเงื่อนไขที่เลือก
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
