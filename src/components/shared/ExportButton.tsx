// src/components/shared/ExportButton.tsx
import * as React from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// ===== utils: ใช้เฉพาะฟังก์ชันส่งออก (ไม่แตะ UI อื่น) =====
import {
  // เดี่ยวตามชนิด
  exportChartToPNG,
  exportToCSV,
  exportToExcel,

  // ใช้กับ Export All
  withThaiMonthYear,
  domTableToRows,
  saveTableAsCSV_XLSX,
  extractCommentsFromDOM,
  exportCommentsRowsToXLSX,
} from "@/utils/exportUtils";

type ExportButtonProps = {
  /** chart | table */
  type: "chart" | "table";
  /** id ของ element ที่ใช้จับภาพกราฟ หรือ wrapper ที่มี <table> ข้างใน */
  elementId?: string;
  /** ข้อมูล table (ถ้ามี) สำหรับ export CSV/XLSX แบบตรง ๆ */
  data?: any[];
  /** ชื่อไฟล์หลัก (ไม่ต้องใส่นามสกุล) */
  filename?: string;
  /** ชื่อที่จะแสดง (optional) */
  title?: string;
  /** ประเภทกราฟ (optional) */
  chartType?: string;
  /** ปิด/เปิด Export All (defaults true) */
  showExportAll?: boolean;
};

export const ExportButton: React.FC<ExportButtonProps> = ({
  type,
  elementId,
  data,
  filename,
  title,
  showExportAll = true,
}) => {
  // ------- เดี่ยวตามชนิด -------
  const handleExportPNG = async () => {
    if (!elementId) return;
    const name = withThaiMonthYear(filename || title || "chart");
    await exportChartToPNG(elementId, `${name}.png`);
  };

  const handleExportCSV = () => {
    const name = withThaiMonthYear(filename || title || "table");
    // ถ้ามี data → ส่งออกตรง ๆ
    if (data && Array.isArray(data) && data.length) {
      exportToCSV(data, `${name}.csv`);
      return;
    }
    // ถ้าไม่มี data → หา <table> ใน elementId แล้วแปลง
    if (elementId) {
      const root = document.getElementById(elementId);
      const table = root?.querySelector("table");
      if (table) {
        const rows = domTableToRows(table as HTMLTableElement);
        saveTableAsCSV_XLSX(rows, name, { only: "csv" });
      }
    }
  };

  const handleExportXLSX = () => {
    const name = withThaiMonthYear(filename || title || "table");
    if (data && Array.isArray(data) && data.length) {
      exportToExcel(data, `${name}.xlsx`);
      return;
    }
    if (elementId) {
      const root = document.getElementById(elementId);
      const table = root?.querySelector("table");
      if (table) {
        const rows = domTableToRows(table as HTMLTableElement);
        saveTableAsCSV_XLSX(rows, name, { only: "xlsx" });
      }
    }
  };

  // ------- Export All (ทั้งหน้า) -------
  const exportAllCurrentPage = async () => {
    try {
      // 1) Charts → PNG
      const chartNodes = Array.from(
        document.querySelectorAll<HTMLElement>("[data-export-chart], .recharts-wrapper")
      );
      let cIdx = 1;
      for (const node of chartNodes) {
        const base =
          node.dataset.exportChart ||
          node.getAttribute("aria-label") ||
          node.id ||
          `Chart-${cIdx++}`;
        let id = node.id;
        if (!id) {
          id = `__exp_chart_${Date.now()}_${Math.random().toString(36).slice(2)}`;
          node.id = id;
        }
        await exportChartToPNG(id, `${withThaiMonthYear(base)}.png`);
      }

      // 2) Tables → CSV + XLSX
      const holders = Array.from(
        document.querySelectorAll<HTMLElement>("[data-export-table]")
      );
      const tables = new Set<HTMLTableElement>([
        ...holders.flatMap((h) => Array.from(h.querySelectorAll("table"))),
        ...Array.from(document.querySelectorAll("table")), // fallback
      ]);
      let tIdx = 1;
      for (const tb of tables) {
        const base =
          (tb.closest("[data-export-table]") as HTMLElement | null)?.getAttribute(
            "data-export-name"
          ) ||
          tb.getAttribute("aria-label") ||
          `Table-${tIdx++}`;
        const rows = domTableToRows(tb);
        // บันทึกทั้ง CSV + XLSX
        saveTableAsCSV_XLSX(rows, base);
      }

      // 3) Comments → XLSX (รวมเป็นไฟล์เดียว)
      const comments = extractCommentsFromDOM();
      if (comments.length) {
        exportCommentsRowsToXLSX(comments, "ความคิดเห็นทั้งหมด");
      }
    } catch (e) {
      console.error("Export All failed:", e);
    }
  };

  // ------- UI: ใช้ dropdown เดิม ไม่เปลี่ยน layout -------
  // ใช้สไตล์เดียวกับโปรเจกต์ (shadcn/ui)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 px-2">
          <Download className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>{title || "Export"}</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {type === "chart" && (
          <DropdownMenuItem onClick={handleExportPNG}>
            บันทึกกราฟเป็น PNG
          </DropdownMenuItem>
        )}

        {type === "table" && (
          <>
            <DropdownMenuItem onClick={handleExportCSV}>
              ส่งออกตารางเป็น CSV
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleExportXLSX}>
              ส่งออกตารางเป็น Excel (XLSX)
            </DropdownMenuItem>
          </>
        )}

        {showExportAll && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={exportAllCurrentPage}>
              Export All (This Page)
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExportButton;
