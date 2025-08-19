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
import { TimeFilter as TimeFilterType, FeedbackEntry } from "@/types/dashboard";
import { mockFeedbackData } from "@/data/mockData";
import { Calendar, Search, RotateCcw } from "lucide-react";

/* ---------------- props ---------------- */
interface ComplaintsPageProps {
  timeFilter: TimeFilterType["value"];
  onTimeFilterChange: (value: TimeFilterType["value"]) => void;
}

/* --------- map main category to code prefix 1.–5. --------- */
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

/* --------- derive tag codes from feedback --------- */
function pickTagCodes(feedback: FeedbackEntry): string[] {
  const tags = (feedback as any).commentTags as string[] | undefined;
  if (Array.isArray(tags) && tags.length) return Array.from(new Set(tags));
  const detailed = (feedback as any).detailedSentiment as Record<string, number> | undefined;
  if (!detailed) return [];
  const mapLegacy: Record<string, string> = {
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
  };
  const list: string[] = [];
  Object.entries(detailed).forEach(([k, v]) => {
    if (v === -1 && mapLegacy[k]) list.push(mapLegacy[k]);
  });
  return Array.from(new Set(list));
}

/* ---------------------- component ---------------------- */
export const ComplaintsPage: React.FC<ComplaintsPageProps> = ({
  timeFilter,
  onTimeFilterChange,
}) => {
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedDistrict, setSelectedDistrict] = useState("all");
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [selectedMainCategory, setSelectedMainCategory] = useState("all");
  const [selectedServiceType, setSelectedServiceType] = useState("all");

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // remember filters
  useEffect(() => {
    const saved = localStorage.getItem("complaints.filters");
    if (saved) {
      try {
        const f = JSON.parse(saved);
        setSelectedRegion(f.selectedRegion ?? "all");
        setSelectedDistrict(f.selectedDistrict ?? "all");
        setSelectedBranch(f.selectedBranch ?? "all");
        setSelectedMainCategory(f.selectedMainCategory ?? "all");
        setSelectedServiceType(f.selectedServiceType ?? "all");
        setFromDate(f.fromDate ?? "");
        setToDate(f.toDate ?? "");
      } catch {}
    }
  }, []);
  const handleApply = () => {
    localStorage.setItem(
      "complaints.filters",
      JSON.stringify({
        selectedRegion,
        selectedDistrict,
        selectedBranch,
        selectedMainCategory,
        selectedServiceType,
        fromDate,
        toDate,
      })
    );
  };
  const handleReset = () => {
    setSelectedRegion("all");
    setSelectedDistrict("all");
    setSelectedBranch("all");
    setSelectedMainCategory("all");
    setSelectedServiceType("all");
    setFromDate("");
    setToDate("");
    localStorage.removeItem("complaints.filters");
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

  // filter data
  const filteredComplaints = useMemo(() => {
    const prefix = MAIN_CATEGORY_PREFIX[selectedMainCategory] ?? null;
    return mockFeedbackData
      .filter((f) => {
        if (selectedRegion !== "all" && f.branch.region !== selectedRegion) return false;
        if (selectedDistrict !== "all" && f.branch.district !== selectedDistrict) return false;
        if (selectedBranch !== "all" && f.branch.branch !== selectedBranch) return false;
        if (selectedServiceType !== "all" && selectedServiceType !== "ทั้งหมด" &&
            f.serviceType !== selectedServiceType) return false;
        if (fromDate && new Date(f.date).getTime() < new Date(fromDate).getTime()) return false;
        if (toDate && new Date(f.date).getTime() > new Date(toDate).getTime()) return false;

        if (prefix) {
          const codes = pickTagCodes(f);
          if (!codes.some((c) => c.startsWith(prefix))) return false;
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
    fromDate,
    toDate,
  ]);

  const serviceTypes = [
    "ทั้งหมด",
    "การฝากเงิน/ถอนเงิน",
    "การซื้อผลิตภัณฑ์",
    "การชำระค่าบริการ/ค่าธรรมเนียม",
    "อื่นๆ",
  ];
  const categoryChoices = [
    { value: "all", label: "ทั้งหมด" },
    { value: "staff", label: "พนักงานและบุคลากร" },
    { value: "service", label: "ระบบและกระบวนการให้บริการ" },
    { value: "technology", label: "เทคโนโลยีและดิจิทัล" },
    { value: "products", label: "เงื่อนไขและผลิตภัณฑ์" },
    { value: "environment", label: "สภาพแวดล้อมและสิ่งอำนวยความสะดวก" },
    { value: "marketConduct", label: "การปฏิบัติตลาด" },
    { value: "other", label: "อื่นๆ" },
  ];

  return (
    <div className="space-y-6 max-w-full">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">ข้อร้องเรียนลูกค้า</h1>
        <TimeFilter value={timeFilter} onChange={onTimeFilterChange} />
      </div>

      {/* FILTERS */}
      <Card className="border-0 shadow-none">
        <CardHeader className="p-0 mb-2">
          <CardTitle className="text-lg font-semibold">ตัวกรองการแสดงผล</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="rounded-xl border bg-gradient-to-b from-pink-50 to-white p-4 md:p-5">
            {/* actions */}
            <div className="mb-3 flex justify-end gap-2">
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

            {/* ช่วงเวลา */}
            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-2">
                <div className="text-sm font-medium text-foreground">ตั้งแต่</div>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="w-full rounded-md border bg-white px-9 py-2 text-sm outline-none"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium text-foreground">ถึง</div>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="w-full rounded-md border bg-white px-9 py-2 text-sm outline-none"
                  />
                </div>
              </div>
            </div>

            {/* ประเภทบริการ + หมวดหลัก */}
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
                <div className="text-sm font-medium text-foreground">หมวดหมู่</div>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Select value={selectedMainCategory} onValueChange={setSelectedMainCategory}>
                    <SelectTrigger className="pl-9">
                      <SelectValue placeholder="เลือกหมวดหมู่" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryChoices.map((c) => (
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
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📋 รายการข้อร้องเรียน ({filteredComplaints.length} รายการ)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {filteredComplaints.map((c) => {
              const codes = pickTagCodes(c);
              return (
                <Card key={c.id} className="border-l-4 border-l-destructive">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <span className="text-xl">⚠️</span>
                      <div className="flex-1">
                        <div className="mb-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <span>📅 {c.date}</span>
                          <span>🏢 {c.branch.branch}</span>
                          <span>🔧 {c.serviceType}</span>
                        </div>
                        <p className="mb-3 text-foreground">{c.comment}</p>
                        {codes.length > 0 && (
                          <div className="space-y-2">
                            <div className="text-sm font-medium text-muted-foreground">
                              หมวดหมู่ย่อย (ความคิดเห็น):
                            </div>
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
              <div className="py-10 text-center text-muted-foreground">
                ไม่พบข้อร้องเรียนที่ตรงกับเงื่อนไขที่เลือก
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
