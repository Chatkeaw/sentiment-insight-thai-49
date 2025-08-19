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
import { ExportButton } from "@/components/shared/ExportButton";
import { mockFeedbackData } from "@/data/mockData";
import { FeedbackEntry } from "@/types/dashboard";

/** date utils */
const parseDateLoose = (s: string): Date | null => {
  if (!s) return null;
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) {
    const d = new Date(s);
    return isNaN(d.getTime()) ? null : d;
  }
  const m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (m) {
    const dd = Number(m[1]);
    const MM = Number(m[2]);
    let yyyy = Number(m[3]);
    if (yyyy > 2400) yyyy -= 543;
    const d = new Date(yyyy, MM - 1, dd);
    return isNaN(d.getTime()) ? null : d;
  }
  return null;
};

const SERVICE_TYPES = [
  "ทั้งหมด",
  "การฝากเงิน/ถอนเงิน",
  "การซื้อผลิตภัณฑ์",
  "การชำระค่าบริการ/ค่าธรรมเนียม",
  "ให้คำปรึกษา/แนะนำ",
  "อื่นๆ",
];

const SUB_SERVICE_TYPES = [
  "หน้าเคาน์เตอร์",
  "Mobile/Internet",
  "ตู้ ATM/ADM",
  "Call Center",
  "อื่นๆ",
];

const MAIN = [
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

const SUB_MAP: Record<string, Array<{ value: string; label: string }>> = {
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

export const FeedbackPage: React.FC = () => {
  // location
  const [region, setRegion] = useState("all");
  const [district, setDistrict] = useState("all");
  const [branchQuery, setBranchQuery] = useState("");
  // date range
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  // service + channel
  const [serviceType, setServiceType] = useState("all");
  const [channel, setChannel] = useState("");
  // categories + sentiment
  const [mainCat, setMainCat] = useState("all");
  const [subCat, setSubCat] = useState("all");
  const [sentiment, setSentiment] = useState("all");

  // unique location lists
  const regions = useMemo(() => {
    const u = Array.from(new Set(mockFeedbackData.map((f) => f.branch.region))).sort();
    return ["all", ...u];
  }, []);
  const districts = useMemo(() => {
    if (region === "all") return ["all"];
    const u = Array.from(
      new Set(
        mockFeedbackData
          .filter((f) => f.branch.region === region)
          .map((f) => f.branch.district)
      )
    ).sort();
    return ["all", ...u];
  }, [region]);

  const subCategories = useMemo(() => {
    if (mainCat === "all") return [{ value: "all", label: "ทั้งหมด" }];
    return [{ value: "all", label: "ทั้งหมด" }, ...(SUB_MAP[mainCat] || [])];
  }, [mainCat]);

  // filtering
  const filtered = useMemo(() => {
    const sd = parseDateLoose(startDate);
    const ed = parseDateLoose(endDate);
    const edEnd =
      ed != null ? new Date(ed.getFullYear(), ed.getMonth(), ed.getDate(), 23, 59, 59) : null;

    return mockFeedbackData
      .filter((fb) => {
        // location
        if (region !== "all" && fb.branch.region !== region) return false;
        if (district !== "all" && fb.branch.district !== district) return false;
        if (
          branchQuery &&
          !`${fb.branch.branch}`.toLowerCase().includes(branchQuery.toLowerCase())
        )
          return false;

        // date range
        const d = parseDateLoose(fb.date) || parseDateLoose(fb.timestamp || "");
        if (sd && (!d || d < sd)) return false;
        if (edEnd && (!d || d > edEnd)) return false;

        // service type
        if (serviceType !== "all" && serviceType !== "ทั้งหมด" && fb.serviceType !== serviceType)
          return false;

        // channel (demo)
        const ch = (fb as any).serviceChannel as string | undefined;
        if (channel && ch && ch !== channel) return false;

        // sentiment
        if (sentiment !== "all") {
          const vals = Object.values(fb.sentiment);
          const hasPos = vals.some((v) => v === 1);
          const hasNeg = vals.some((v) => v === -1);
          if (sentiment === "positive" && !hasPos) return false;
          if (sentiment === "negative" && !hasNeg) return false;
        }

        // category (demo: ใช้ค่าหมวดหลักจาก sentiment summary)
        if (mainCat !== "all") {
          if (!fb.sentiment || !fb.sentiment[mainCat as keyof typeof fb.sentiment]) return false;
        }
        // subCat (demo): ตรวจ detailedSentiment ถ้ามี
        if (subCat !== "all") {
          const ds = fb.detailedSentiment || {};
          if (!(subCat in ds) || ds[subCat as keyof typeof ds] === 0) return false;
        }

        return true;
      })
      .sort(
        (a, b) =>
          (parseDateLoose(b.date)?.getTime() || 0) -
          (parseDateLoose(a.date)?.getTime() || 0)
      );
  }, [
    region,
    district,
    branchQuery,
    startDate,
    endDate,
    serviceType,
    channel,
    sentiment,
    mainCat,
    subCat,
  ]);

  const getSentimentColor = (v: number) =>
    v === 1 ? "bg-green-100" : v === -1 ? "bg-red-100" : "bg-gray-100";

  const getFeedbackColor = (fb: FeedbackEntry) => {
    const vals = Object.values(fb.sentiment);
    const hasPos = vals.some((s) => s === 1);
    const hasNeg = vals.some((s) => s === -1);
    if (hasPos && hasNeg) return "bg-yellow-100";
    if (hasPos) return "bg-green-100";
    if (hasNeg) return "bg-red-100";
    return "bg-gray-100";
  };

  const detailedList = (fb: FeedbackEntry) => {
    const out: Array<{ label: string; sentiment: number }> = [];
    Object.entries(fb.detailedSentiment || {}).forEach(([k, v]) => {
      if (v !== 0) {
        const main = MAIN.find((m) => (SUB_MAP[m.value] || []).some((s) => s.value === k));
        const sub = (SUB_MAP[main?.value || ""] || []).find((s) => s.value === k);
        if (main && sub) out.push({ label: `${main.label}: ${sub.label}`, sentiment: v });
      }
    });
    return out;
  };

  const onClear = () => {
    setRegion("all");
    setDistrict("all");
    setBranchQuery("");
    setStartDate("");
    setEndDate("");
    setServiceType("all");
    setChannel("");
    setMainCat("all");
    setSubCat("all");
    setSentiment("all");
  };

  const onSearch = () => {
    console.log("Apply Feedback filters", {
      region,
      district,
      branchQuery,
      startDate,
      endDate,
      serviceType,
      channel,
      mainCat,
      subCat,
      sentiment,
    });
  };

  return (
    <div className="space-y-6 max-w-full">
      <div className="flex flex-col space-y-1">
        <h2 className="text-2xl font-semibold text-foreground">ความคิดเห็นของลูกค้า</h2>
        <p className="text-muted-foreground">สรุปและกรองความคิดเห็นตามเงื่อนไข</p>
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
                value={region}
                onValueChange={(v) => {
                  setRegion(v);
                  setDistrict("all");
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
                value={district}
                onValueChange={(v) => setDistrict(v)}
                disabled={region === "all"}
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
              <Select value={channel} onValueChange={(v) => setChannel(v)}>
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

          {/* แถว 3: ประเภทบริการ + หมวดหมู่หลัก/ย่อย + ทัศนคติ */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-sm mb-1">ประเภทการให้บริการ</div>
              <Select value={serviceType} onValueChange={(v) => setServiceType(v)}>
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
                value={mainCat}
                onValueChange={(v) => {
                  setMainCat(v);
                  setSubCat("all");
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="เลือกหมวดหมู่หลัก" />
                </SelectTrigger>
                <SelectContent>
                  {MAIN.map((m) => (
                    <SelectItem key={m.value} value={m.value}>
                      {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <div className="text-sm mb-1">หมวดหมู่ย่อย</div>
              <Select value={subCat} onValueChange={(v) => setSubCat(v)}>
                <SelectTrigger>
                  <SelectValue placeholder="เลือกหมวดหมู่ย่อย" />
                </SelectTrigger>
                <SelectContent>
                  {subCategories.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-sm mb-1">ทัศนคติของความคิดเห็น</div>
              <Select value={sentiment} onValueChange={(v) => setSentiment(v)}>
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
        </CardContent>
      </Card>

      {/* Feedback List */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="card-title">
            รายการความคิดเห็น ({filtered.length} รายการ)
          </CardTitle>
          <ExportButton
            data={filtered}
            type="feedback"
            filename="ความคิดเห็นลูกค้า"
            title="รายการความคิดเห็นลูกค้า"
          />
        </CardHeader>
        <CardContent>
          <div className="max-h-96 overflow-y-auto space-y-4">
            {filtered.map((fb) => {
              const details = detailedList(fb);
              return (
                <div
                  key={fb.id}
                  className={`p-4 rounded-lg border ${getFeedbackColor(fb)}`}
                >
                  <div className="flex flex-wrap gap-4 mb-3 text-sm text-gray-600">
                    <span>
                      <strong>วันที่:</strong> {fb.date} {fb.timestamp}
                    </span>
                    <span>
                      <strong>บริการ:</strong> {fb.serviceType}
                    </span>
                    <span>
                      <strong>สาขา:</strong> {fb.branch.branch} / {fb.branch.district} /{" "}
                      {fb.branch.region}
                    </span>
                  </div>

                  <div className="mb-3">
                    <p className="text-gray-800 leading-relaxed">{fb.comment}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-700">หมวดหมู่ที่เกี่ยวข้อง:</div>
                    <div className="flex flex-wrap gap-2">
                      {details.map((it, i) => (
                        <Badge key={`${i}-${it.label}`} className={`${getSentimentColor(it.sentiment)} text-gray-800 border-0`}>
                          {it.label} {it.sentiment === 1 ? "👍" : "👎"}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
            {filtered.length === 0 && (
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

export default FeedbackPage;
