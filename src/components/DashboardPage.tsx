// src/components/DashboardPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import { MonthlyOverviewPage } from "@/components/dashboard/MonthlyOverviewPage";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

// helpers สำหรับ export (เพิ่มไว้ใน exportUtils ตามที่ทำไปก่อนหน้า)
import {
  withThaiMonthYear,
  domTableToRows,
  saveTableAsCSV_XLSX,
  extractCommentsFromDOM,
  exportCommentsRowsToXLSX,
  // ฟังก์ชันแคปเจอร์กราฟเป็น PNG
  exportChartToPNG,
} from "@/utils/exportUtils";

type Props = { onPageChange?: (page: string) => void };
type MonthState = { month: string; year: string };

const MONTHS = [
  { value: "1", label: "มกราคม" }, { value: "2", label: "กุมภาพันธ์" },
  { value: "3", label: "มีนาคม" },  { value: "4", label: "เมษายน" },
  { value: "5", label: "พฤษภาคม" }, { value: "6", label: "มิถุนายน" },
  { value: "7", label: "กรกฎาคม" },  { value: "8", label: "สิงหาคม" },
  { value: "9", label: "กันยายน" },  { value: "10", label: "ตุลาคม" },
  { value: "11", label: "พฤศจิกายน" },{ value: "12", label: "ธันวาคม" },
];

function readInitial(): MonthState {
  try {
    const s = localStorage.getItem("dashboard.month");
    if (s) {
      const v = JSON.parse(s) as MonthState;
      if (v && MONTHS.some(m => m.value === v.month) && /^\d{4}$/.test(v.year)) return v;
    }
  } catch {}
  const now = new Date();
  return { month: String(now.getMonth() + 1), year: String(now.getFullYear()) };
}

export default function DashboardPage({ onPageChange }: Props) {
  const init = useMemo(readInitial, []);
  const [month, setMonth] = useState(init.month);
  const [year, setYear] = useState(init.year);

  useEffect(() => {
    const handler = (e: any) => {
      const v = e?.detail as MonthState | undefined;
      if (v?.month && v?.year) { setMonth(v.month); setYear(v.year); }
    };
    window.addEventListener("dashboard:month-change", handler as any);
    return () => window.removeEventListener("dashboard:month-change", handler as any);
  }, []);

  useEffect(() => {
    localStorage.setItem("dashboard.month", JSON.stringify({ month, year }));
  }, [month, year]);

  const years = useMemo(() => {
    const y0 = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, i) => String(y0 - i));
  }, []);

  const yearBE = Number(year) + 543;
  const monthTH = MONTHS.find(m => m.value === month)?.label ?? "";
  const headerLabel = `${monthTH} ${yearBE}`;

  // -------- Export All: ทุกกราฟ + ทุกตาราง + ทุกคอมเมนต์ บน "หน้านี้" --------
  const exportAllThisPage = async () => {
    // 1) Charts → PNG
    const chartNodes = Array.from(
      document.querySelectorAll<HTMLElement>("[data-export-chart], .recharts-wrapper")
    );
    let chartIndex = 1;
    for (const node of chartNodes) {
      // ชื่อกราฟสวย ๆ
      const baseName =
        node.dataset.exportChart ||
        node.getAttribute("aria-label") ||
        node.id ||
        `Chart-${chartIndex++}`;
      // ให้มี id เสมอเพื่อใช้กับ html2canvas
      let id = node.id;
      if (!id) {
        id = `__exp_chart_${Date.now()}_${Math.random().toString(36).slice(2)}`;
        node.id = id;
      }
      await exportChartToPNG(id, `${withThaiMonthYear(baseName)}.png`);
    }

    // 2) Tables → CSV + XLSX
    // - ค้นหาคอนเทนเนอร์ที่กำหนดชื่อ กับ table บนหน้า
    const containers = Array.from(
      document.querySelectorAll<HTMLElement>("[data-export-table]")
    );
    const rawTables = new Set<HTMLTableElement>([
      ...containers.flatMap(c => Array.from(c.querySelectorAll("table"))),
      ...Array.from(document.querySelectorAll("table")),
    ]);
    let tableIndex = 1;
    for (const table of rawTables) {
      const holder = table.closest("[data-export-table]") as HTMLElement | null;
      const baseName =
        holder?.getAttribute("data-export-name") ||
        table.getAttribute("aria-label") ||
        `Table-${tableIndex++}`;
      const tab = domTableToRows(table);
      saveTableAsCSV_XLSX(tab, baseName);
    }

    // 3) Comments → XLSX (รวมแผ่นเดียว)
    const comments = extractCommentsFromDOM();
    if (comments.length) {
      exportCommentsRowsToXLSX(comments, "ความคิดเห็นทั้งหมด");
    }
  };

  return (
    <section className="space-y-6 md:space-y-8">
      {/* Header block */}
      <div className="flex flex-wrap items-end justify-between gap-3 md:gap-4 pt-1 pb-3 border-b border-border/60">
        <h2 className="text-[22px] md:text-3xl font-bold leading-tight tracking-tight text-foreground">
          สรุปภาพรวมประจำเดือน <span className="ml-2 text-muted-foreground">– {headerLabel}</span>
        </h2>

        <div className="flex items-center gap-2 md:gap-3">
          {/* ปุ่ม Export All ชัด ๆ ตรงนี้ */}
          <Button
            variant="outline"
            className="h-9 px-3"
            onClick={exportAllThisPage}
            title="ดาวน์โหลดทุกกราฟ ทุกตาราง และคอมเมนต์ในหน้านี้"
          >
            <Download className="w-4 h-4 mr-2" />
            Export All
          </Button>

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
