import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/**
 * หน้า “ความคิดเห็นของลูกค้า”
 * - ใช้ตัวกรองรูปแบบเดียวกับหน้า “ข้อร้องเรียน”
 */

type Filters = {
  region: string;
  district: string;
  branch: string;
  startDate: string;
  endDate: string;
  serviceType: string;
  subServiceType: string;
  majorCategory: string;
  minorCategory: string;
  keyword: string;
};

const REGIONS = Array.from({ length: 18 }, (_, i) => `ภาค ${i + 1}`);
const DISTRICTS = (r: string) => (r ? Array.from({ length: 5 }, (_, i) => `${r} เขต ${i + 1}`) : []);
const SERVICE_TYPES = [
  "การฝากเงิน/ถอนเงิน",
  "การซื้อผลิตภัณฑ์",
  "การชำระค่าบริการ/ค่าธรรมเนียม",
  "ให้คำปรึกษา/แนะนำ",
  "อื่นๆ",
];
const SUB_SERVICE_TYPES = [
  "หน้าเคาน์เตอร์", "Mobile/Internet", "ตู้ ATM/ADM", "Call Center", "อื่นๆ",
];
const MAJOR = [
  "พนักงานและบุคลากร",
  "เทคโนโลยีและดิจิทัล",
  "ระบบ/กระบวนการให้บริการ",
  "เงื่อนไขและผลิตภัณฑ์",
  "สภาพแวดล้อม/สิ่งอำนวยความสะดวก",
  "อื่นๆ",
];
const MINOR = [
  "ความสุภาพและมารยาท", "เอาใจใส่/แก้ปัญหา", "ความรวดเร็ว", "ข้อมูล/การสื่อสาร",
  "E-KYC/Scanner", "Core Banking", "เสียง/กลิ่น/พื้นที่", "อื่นๆ",
];

export const FeedbackPage: React.FC = () => {
  const [filters, setFilters] = useState<Filters>({
    region: "",
    district: "",
    branch: "",
    startDate: "",
    endDate: "",
    serviceType: "",
    subServiceType: "",
    majorCategory: "",
    minorCategory: "",
    keyword: "",
  });

  const districts = useMemo(() => DISTRICTS(filters.region), [filters.region]);

  const onClear = () =>
    setFilters({
      region: "",
      district: "",
      branch: "",
      startDate: "",
      endDate: "",
      serviceType: "",
      subServiceType: "",
      majorCategory: "",
      minorCategory: "",
      keyword: "",
    });

  const onSearch = () => {
    console.log("Apply Feedback filters ->", filters);
  };

  return (
    <div className="space-y-6">
      {/* ตัวกรองข้อมูล */}
      <Card className="border-pink-100">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-bold">ตัวกรองการแสดงผล</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onClear}>
              ล้างตัวกรอง
            </Button>
            <Button onClick={onSearch} className="bg-primary text-white">
              ค้นหา
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* แถว 1 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-sm mb-1">ภาค</div>
              <Select
                value={filters.region}
                onValueChange={(v) =>
                  setFilters((s) => ({ ...s, region: v, district: "" }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="เลือกภาค" />
                </SelectTrigger>
                <SelectContent>
                  {REGIONS.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <div className="text-sm mb-1">เขต</div>
              <Select
                value={filters.district}
                onValueChange={(v) => setFilters((s) => ({ ...s, district: v }))}
                disabled={!filters.region}
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
            <div>
              <div className="text-sm mb-1">สาขา</div>
              <Input
                placeholder="พิมพ์ชื่อ/รหัสสาขา"
                value={filters.branch}
                onChange={(e) =>
                  setFilters((s) => ({ ...s, branch: e.target.value }))
                }
              />
            </div>
          </div>

          {/* แถว 2 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-sm mb-1">ช่วงเวลาการประเมิน (เริ่ม)</div>
              <Input
                type="date"
                value={filters.startDate}
                onChange={(e) =>
                  setFilters((s) => ({ ...s, startDate: e.target.value }))
                }
              />
            </div>
            <div>
              <div className="text-sm mb-1">ช่วงเวลาการประเมิน (สิ้นสุด)</div>
              <Input
                type="date"
                value={filters.endDate}
                onChange={(e) =>
                  setFilters((s) => ({ ...s, endDate: e.target.value }))
                }
              />
            </div>
            <div>
              <div className="text-sm mb-1">คำค้นหา</div>
              <Input
                placeholder="พิมพ์คำค้นหา"
                value={filters.keyword}
                onChange={(e) =>
                  setFilters((s) => ({ ...s, keyword: e.target.value }))
                }
              />
            </div>
          </div>

          {/* แถว 3 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-sm mb-1">ประเภทการให้บริการ</div>
              <Select
                value={filters.serviceType}
                onValueChange={(v) =>
                  setFilters((s) => ({ ...s, serviceType: v }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="เลือกประเภทการให้บริการ" />
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
              <div className="text-sm mb-1">ช่องทาง/รูปแบบการใช้บริการ</div>
              <Select
                value={filters.subServiceType}
                onValueChange={(v) =>
                  setFilters((s) => ({ ...s, subServiceType: v }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="เลือกช่องทาง" />
                </SelectTrigger>
                <SelectContent>
                  {SUB_SERVICE_TYPES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* แถว 4 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-sm mb-1">หมวดหมู่หลัก</div>
              <Select
                value={filters.majorCategory}
                onValueChange={(v) =>
                  setFilters((s) => ({ ...s, majorCategory: v }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="เลือกหมวดหมู่หลัก" />
                </SelectTrigger>
                <SelectContent>
                  {MAJOR.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <div className="text-sm mb-1">หมวดหมู่ย่อย</div>
              <Select
                value={filters.minorCategory}
                onValueChange={(v) =>
                  setFilters((s) => ({ ...s, minorCategory: v }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="เลือกหมวดหมู่ย่อย" />
                </SelectTrigger>
                <SelectContent>
                  {MINOR.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* เนื้อหาแสดงผล (เดโม่) */}
      <Card>
        <CardHeader>
          <CardTitle>รายการความคิดเห็น (ตัวอย่าง)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            ตัวกรองที่ใช้: {JSON.stringify(filters)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeedbackPage;
