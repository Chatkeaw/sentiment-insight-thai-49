// src/components/DashboardPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import { MonthlyOverviewPage } from "@/components/dashboard/MonthlyOverviewPage";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = { onPageChange?: (page: string) => void };
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

function readInitial(): MonthState {
  try {
    const s = localStorage.getItem("dashboard.month");
    if (s) {
      const v = JSON.parse(s) as MonthState;
      if (v && MONTHS.some(m => m.value === v.month) && /^\d{4}$/.test(v.year)) {
        return v;
      }
    }
  } catch {}
  const now = new Date();
  return { month: String(now.getMonth() + 1), year: String(now.getFullYear()) };
}

export default function DashboardPage({ onPageChange }: Props) {
  const init = useMemo(readInitial, []);
  const [month, setMonth] = useState(init.month);
  const [year, setYear]   = useState(init.year);

  // sync ถ้าส่วนอื่นเปลี่ยนเดือน/ปี
  useEffect(() => {
    const handler = (e: any) => {
      const v = e?.detail as MonthState | undefined;
      if (v?.month && v?.year) {
        setMonth(v.month);
        setYear(v.year);
      }
    };
    window.addEventListener("dashboard:month-change", handler as any);
    return () => window.removeEventListener("dashboard:month-change", handler as any);
  }, []);

  // เขียนกลับ localStorage (ไม่ยิง event ซ้ำ)
  useEffect(() => {
    localStorage.setItem("dashboard.month", JSON.stringify({ month, year }));
  }, [month, year]);

  const years = useMemo(() => {
    const y0 = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, i) => String(y0 - i));
  }, []);

  const yearBE   = Number(year) + 543;
  const monthTH  = MONTHS.find(m => m.value === month)?.label ?? "";
  const headerLabel = `${monthTH} ${yearBE}`;

  return (
    <section className="space-y-6 md:space-y-8">
      {/* Header block — เว้นระยะสวยงาม + แยกด้วยเส้นบาง */}
      <div className="flex flex-wrap items-end justify-between gap-3 md:gap-4 pt-1 pb-3 border-b border-border/60">
        <h2 className="text-[22px] md:text-3xl font-bold leading-tight tracking-tight text-foreground">
          สรุปภาพรวมประจำเดือน
          <span className="ml-2 text-muted-foreground">– {headerLabel}</span>
        </h2>

        <div className="flex items-center gap-2 md:gap-3">
          <span className="text-sm text-muted-foreground shrink-0">เลือกเดือน:</span>

          <Select value={month} onValueChange={setMonth}>
            <SelectTrigger className="h-9 w-36 md:w-40">
              <SelectValue placeholder="เดือน" />
            </SelectTrigger>
            <SelectContent>
              {MONTHS.map(m => (
                <SelectItem key={m.value} value={m.value}>
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={year} onValueChange={setYear}>
            <SelectTrigger className="h-9 w-24">
              <SelectValue placeholder="ปี" />
            </SelectTrigger>
            <SelectContent>
              {years.map(y => (
                <SelectItem key={y} value={y}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* เนื้อหา */}
      <MonthlyOverviewPage />
    </section>
  );
}
