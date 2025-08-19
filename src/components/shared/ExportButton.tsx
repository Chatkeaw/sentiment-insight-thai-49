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
  type: "chart" | "table";
  elementId?: string;   // id ของกราฟหรือ wrapper ที่มี <table>
  data?: any[];         // ส่ง data โดยตรงกรณี table
  filename?: string;
  title?: string;
  showExportAll?: boolean; // เปิดเมนู Export All
};

export const ExportButton: React.FC<ExportButtonProps> = ({
  type,
  elementId,
  data,
  filename,
  title,
  showExportAll = true,
}) => {
  const handleExportPNG = async () => {
    if (!elementId) return;
    const name = withThaiMonthYear(filename || title || "chart");
    await exportChartToPNG(elementId, `${name}.png`);
  };

  const handleExportCSV = () => {
    const name = withThaiMonthYear(filename || title || "table");
    if (data?.length) {
      exportToCSV(data, `${name}.csv`);
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

  const handleExportXLSX = () => {
    const name = withThaiMonthYear(filename || title || "table");
    if (data?.length) {
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

  // ===== Export All: กราฟ(PNG) + ตาราง(CSV+XLSX) + คอมเมนต์(XLSX) =====
  const exportAllCurrentPage = async () => {
    try {
      // Charts
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

      // Tables
      const holders = Array.from(
        document.querySelectorAll<HTMLElement>("[data-export-table]")
      );
      const tables = new Set<HTMLTableElement>([
        ...holders.flatMap((h) => Array.from(h.querySelectorAll("table"))),
        ...Array.from(document.querySelectorAll("table")),
      ]);
      let tIdx = 1;
      for (const tb of tables) {
        const base =
          (tb.closest("[data-export-table]") as HTMLElement | null)
            ?.getAttribute("data-export-name") ||
          tb.getAttribute("aria-label") ||
          `Table-${tIdx++}`;
        const rows = domTableToRows(tb);
        saveTableAsCSV_XLSX(rows, base); // บันทึกทั้ง CSV + XLSX
      }

      // Comments
      const comments = extractCommentsFromDOM();
      if (comments.length) {
        exportCommentsRowsToXLSX(comments, "ความคิดเห็นทั้งหมด");
      }
    } catch (e) {
      console.error("Export All failed:", e);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 px-2" aria-label="Export">
          <Download className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>{title || "Export"}</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {type === "chart" && (
          <DropdownMenuItem onClick={handleExportPNG}>บันทึกกราฟเป็น PNG</DropdownMenuItem>
        )}

        {type === "table" && (
          <>
            <DropdownMenuItem onClick={handleExportCSV}>ส่งออกตารางเป็น CSV</DropdownMenuItem>
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
