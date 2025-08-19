// src/components/GlobalFilters.tsx
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface GlobalFiltersProps {
  onFiltersChange?: (filters: any) => void;
}

type MonthState = { month: string; year: string };

const MONTHS = [
  { value: "1", label: "มกราคม" },
  { value: "2", label: "กุมภาพันธ์" },
  { value: "3", label: "มีนาคม" },
  { value: "4", label: "เมษายน" },
  { value: "5", label: "พฤษภาคม" },
  { value: "6", label: "มิถุนายน" },
  { value: "7", label: "กรกฎาคม" },
  { value: "8", label: "สิงหาคม" },
  { value: "9", label: "กันยายน" },
  { value: "10", label: "ตุลาคม" },
  { value: "11", label: "พฤศจิกายน" },
  { value: "12", label: "ธันวาคม" },
];

function getInitial(): MonthState {
  // ใช้ค่าที่เคยเลือกไว้ก่อน (ถ้ามี)
  try {
    const saved = localStorage.getItem("dashboard.month");
    if (saved) {
      const v = JSON.parse(saved) as MonthState;
      if (v && MONTHS.some(m => m.value === v.month) && /^\d{4}$/.test(v.year)) {
        return v;
      }
    }
  } catch {}
  // ไม่งั้นใช้เดือน/ปีปัจจุบัน
  const now = new Date();
  return { month: String(now.getMonth() + 1), year: String(now.getFullYear()) };
}

const GlobalFilters: React.FC<GlobalFiltersProps> = ({ onFiltersChange }) => {
  const init = React.useMemo(getInitial, []);
  const [month, setMonth] = React.useState(init.month);
  const [year, setYear] = React.useState(init.year);

  const years = React.useMemo(() => {
    const y0 = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, i) => String(y0 - i));
  }, []);

  const yearBE = Number(year) + 543;

  // บันทึก + broadcast + แจ้ง parent ทุกครั้งที่มีการเปลี่ยน
  React.useEffect(() => {
    const state = { month, year };
    localStorage.setItem("dashboard.month", JSON.stringify(state));
    window.dispatchEvent(new CustomEvent("dashboard:month-change", { detail: state }));
    onFiltersChange?.({
      month,
      year,
      value: `${year}-${month.padStart(2, "0")}`, // เผื่อเอาไป query ข้อมูล
    });
  }, [month, year]); // eslint-disable-line

  return (
    <div className="w-full flex items-center justify-end gap-2">
      <span className="text-sm text-muted-foreground">เลือกเดือน:</span>

      <Select value={month} onValueChange={setMonth}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="เลือกเดือน" />
        </SelectTrigger>
        <SelectContent>
          {MONTHS.map((m) => (
            <SelectItem key={m.value} value={m.value}>
              {m.label} {yearBE}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={year} onValueChange={setYear}>
        <SelectTrigger className="w-24">
          <SelectValue placeholder="ปี" />
        </SelectTrigger>
        <SelectContent>
          {years.map((y) => (
            <SelectItem key={y} value={y}>
              {y}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default GlobalFilters;
