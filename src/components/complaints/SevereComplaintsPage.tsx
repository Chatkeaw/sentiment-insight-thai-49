import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarDays, Filter, RotateCcw } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface FilterProps {
  filters: {
    period_type: string;
    month?: number;
    year?: number;
    days_back?: number;
    date_from?: string;
    date_to?: string;
    region?: string;
    area?: string;
    branch?: string;
    service_type_list: string[];
    category_list: string[];
  };
  onFiltersChange: (filters: any) => void;
  onApplyFilters: () => void;
  onResetFilters: () => void;
}

const regions = ["ภาคกลาง", "ภาคเหนือ", "ภาคใต้", "ภาคตะวันออกเฉียงเหนือ"];
const areas = {
  "ภาคกลาง": ["กรุงเทพเหนือ", "กรุงเทพใต้", "กรุงเทพตะวันออก", "ปริมณฑล"],
  "ภาคเหนือ": ["เชียงใหม่", "เชียงราย", "ลำปาง"],
  "ภาคใต้": ["สงขลา", "ภูเก็ต", "สุราษฎร์ธานี"],
  "ภาคตะวันออกเฉียงเหนือ": ["ขอนแก่น", "อุดรธานี", "นครราชสีมา"]
};

const branches = {
  "กรุงเทพเหนือ": ["สาขางามวงศ์วาน", "สาขาลาดพร้าว", "สาขาจตุจักร"],
  "กรุงเทพใต้": ["สาขาสีลม", "สาขาบางนา", "สาขาสาทร"],
  "กรุงเทพตะวันออก": ["สาขาอ่อนนุช", "สาขาเอกมัย"],
  "ปริมณฑล": ["สาขาราชพฤกษ์", "สาขาเซ็นทรัลพลาซา"]
};

const serviceTypes = [
  "การชำระค่าบริการ/ค่าธรรมเนียม",
  "บัตรเดบิต/บัตรเอทีเอ็ม",
  "การฝากเงิน/ถอนเงิน",
  "บริการธนาคารออนไลน์",
  "สินเชื่อ/สมัครผลิตภัณฑ์"
];

const categories = [
  "พนักงานและบุคลากร: การแก้ไขปัญหา",
  "พนักงานและบุคลากร: การตอบสนองบริการ",
  "เทคโนโลยีและดิจิทัล: ATM",
  "เทคโนโลยีและดิจิทัล: แอปพลิเคชัน",
  "สภาพแวดล้อมและสิ่งอำนวยความสะดวก: อุณหภูมิร้อน",
  "สภาพแวดล้อมและสิ่งอำนวยความสะดวก: ความสะอาด"
];

export function SevereComplaintsFilter({ filters, onFiltersChange, onApplyFilters, onResetFilters }: FilterProps) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
  const months = [
    "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
    "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
  ];

  return (
    <Card className="border-severe/20 shadow-[var(--shadow-card)]">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-severe">
          <Filter className="h-5 w-5" />
          ตัวกรองข้อมูล - ข้อร้องเรียนรุนแรง
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Period Selection */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">ช่วงเวลา</Label>
          <Select value={filters.period_type} onValueChange={(value) => onFiltersChange({ ...filters, period_type: value })}>
            <SelectTrigger>
              <CalendarDays className="h-4 w-4 mr-2" />
              <SelectValue placeholder="เลือกช่วงเวลา" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="รายเดือน">รายเดือน</SelectItem>
              <SelectItem value="เวลาย้อนหลัง">เวลาย้อนหลัง</SelectItem>
              <SelectItem value="กำหนดเอง">กำหนดเอง</SelectItem>
            </SelectContent>
          </Select>
          
          {filters.period_type === "รายเดือน" && (
            <div className="grid grid-cols-2 gap-3">
              <Select value={filters.month?.toString()} onValueChange={(value) => onFiltersChange({ ...filters, month: parseInt(value) })}>
                <SelectTrigger>
                  <SelectValue placeholder="เลือกเดือน" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month, index) => (
                    <SelectItem key={index} value={(index + 1).toString()}>{month}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filters.year?.toString()} onValueChange={(value) => onFiltersChange({ ...filters, year: parseInt(value) })}>
                <SelectTrigger>
                  <SelectValue placeholder="เลือกปี" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>{year + 543}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          {filters.period_type === "เวลาย้อนหลัง" && (
            <Select value={filters.days_back?.toString()} onValueChange={(value) => onFiltersChange({ ...filters, days_back: parseInt(value) })}>
              <SelectTrigger>
                <SelectValue placeholder="เลือกจำนวนวัน" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">7 วันที่ผ่านมา</SelectItem>
                <SelectItem value="30">30 วันที่ผ่านมา</SelectItem>
                <SelectItem value="90">90 วันที่ผ่านมา</SelectItem>
              </SelectContent>
            </Select>
          )}
          
          {filters.period_type === "กำหนดเอง" && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground">วันที่เริ่มต้น</Label>
                <Input
                  type="date"
                  value={filters.date_from || ""}
                  onChange={(e) => onFiltersChange({ ...filters, date_from: e.target.value })}
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">วันที่สิ้นสุด</Label>
                <Input
                  type="date"
                  value={filters.date_to || ""}
                  onChange={(e) => onFiltersChange({ ...filters, date_to: e.target.value })}
                />
              </div>
            </div>
          )}
        </div>

        {/* Location Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <Label className="text-sm font-medium">ภาค</Label>
            <Select value={filters.region || ""} onValueChange={(value) => onFiltersChange({ ...filters, region: value, area: "", branch: "" })}>
              <SelectTrigger>
                <SelectValue placeholder="เลือกภาค" />
              </SelectTrigger>
              <SelectContent>
                {regions.map((region) => (
                  <SelectItem key={region} value={region}>{region}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label className="text-sm font-medium">เขต</Label>
            <Select 
              value={filters.area || ""} 
              onValueChange={(value) => onFiltersChange({ ...filters, area: value, branch: "" })}
              disabled={!filters.region}
            >
              <SelectTrigger>
                <SelectValue placeholder="เลือกเขต" />
              </SelectTrigger>
              <SelectContent>
                {filters.region && areas[filters.region as keyof typeof areas]?.map((area) => (
                  <SelectItem key={area} value={area}>{area}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label className="text-sm font-medium">สาขา</Label>
            <Select 
              value={filters.branch || ""} 
              onValueChange={(value) => onFiltersChange({ ...filters, branch: value })}
              disabled={!filters.area}
            >
              <SelectTrigger>
                <SelectValue placeholder="เลือกสาขา" />
              </SelectTrigger>
              <SelectContent>
                {filters.area && branches[filters.area as keyof typeof branches]?.map((branch) => (
                  <SelectItem key={branch} value={branch}>{branch}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Service Types */}
        <div>
          <Label className="text-sm font-medium mb-3 block">ประเภทการให้บริการ</Label>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {serviceTypes.map((service) => (
              <div key={service} className="flex items-center space-x-2">
                <Checkbox
                  id={service}
                  checked={filters.service_type_list.includes(service)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      onFiltersChange({ ...filters, service_type_list: [...filters.service_type_list, service] });
                    } else {
                      onFiltersChange({ ...filters, service_type_list: filters.service_type_list.filter(s => s !== service) });
                    }
                  }}
                />
                <Label htmlFor={service} className="text-sm">{service}</Label>
              </div>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div>
          <Label className="text-sm font-medium mb-3 block">หมวดหมู่ปัญหา</Label>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {categories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={category}
                  checked={filters.category_list.includes(category)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      onFiltersChange({ ...filters, category_list: [...filters.category_list, category] });
                    } else {
                      onFiltersChange({ ...filters, category_list: filters.category_list.filter(c => c !== category) });
                    }
                  }}
                />
                <Label htmlFor={category} className="text-sm">{category}</Label>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t">
          <Button onClick={onApplyFilters} className="flex-1 bg-severe hover:bg-severe/90">
            ใช้ตัวกรอง
          </Button>
          <Button onClick={onResetFilters} variant="outline" className="flex items-center gap-2">
            <RotateCcw className="h-4 w-4" />
            รีเซ็ต
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}