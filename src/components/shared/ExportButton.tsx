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

// ===== Utilities สำหรับการส่งออก (มีอยู่แล้วในโปรเจ็กต์) =====
import {
  exportChartToPNG,
  exportToCSV,
  exportToExcel,

  withThaiMonthYear,
  domTableToRows,
  saveTableAsCSV_XLSX,
  extractCommentsFromDOM,
  exportCommentsRowsToXLSX,
} from "@/utils/exportUtils";

type ExportButtonProps = {
  /** ประเภทที่ปุ่มนี้แทน: "chart" | "table" | "feedback" (ผลต่อรายการเมนูเดี่ยว) */
  type: "chart" | "table" | "feedback";
  /** id ของ element ที่จะจับภาพกราฟ หรือ wrapper ที่มี <table> ข้างใน */
  elementId?: string;
  /** ข้อมูลตาราง (ถ้ามี) ใช้ส่งออก CSV/XLSX ตรง ๆ */
  data?: any;
  /** ชื่อไฟล์หลัก (ไม่ต้องใส่นามสกุล) */
  filename?: string;
  /** ข้อความหัวเมนู */
  title?: string;
  /** ประเภทชาร์ต (optional for backward compatibility) */
  chartType?: string;
};

const ExportButton: React.FC<ExportButtonProps> = ({
  type,
  elementId,
  data,
  filename,
  title,
}) => {
  // ---------- Export เฉพาะรายการ ----------
  const handleExportPNG = async () => {
    if (!elementId) return;
    const name = withThaiMonthYear(filename || title || "chart");
    await exportChartToPNG(elementId, `${name}.png`);
  };

  const handleExportCSV = () => {
    const name = withThaiMonthYear(filename || title || "table");

    // มี data → ส่งออกตรง
    if (data && Array.isArray(data) && data.length) {
      exportToCSV(data, `${name}.csv`);
      return;
    }

    // ไม่มี data → หา <table> ภายใน elementId
    if (elementId) {
      const root = document.getElementById(elementId);
      const table = root?.querySelector("table");
      if (table) {
        const rows = domTableToRows(table as HTMLTableElement);
        saveTableAsCSV_XLSX(rows, name);
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
        saveTableAsCSV_XLSX(rows, name);
      }
    }
  };

  // ---------- Export All (ทั้งหน้า) ----------
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
        // ส่งออกทั้ง CSV และ XLSX
        saveTableAsCSV_XLSX(rows, base);
      }

      // 3) Comments → XLSX (รวมไฟล์เดียว)
      const comments = extractCommentsFromDOM();
      if (comments.length) {
        exportCommentsRowsToXLSX(comments, "ความคิดเห็นทั้งหมด");
      }
    } catch (err) {
      console.error("Export All failed:", err);
    }
  };

  // ---------- UI (Dropdown เดิม, เพิ่มเมนู Export All เสมอ) ----------
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 px-2">
          <Download className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>{title || "Export Options"}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {type === "chart" && (
          <DropdownMenuItem onClick={handleExportPNG}>
            Export as PNG
          </DropdownMenuItem>
        )}
        
        {type === "table" && (
          <>
            <DropdownMenuItem onClick={handleExportCSV}>
              Export as CSV
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleExportXLSX}>
              Export as XLSX
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={exportAllCurrentPage}>
          Export All (This Page)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExportButton;
export { ExportButton };
