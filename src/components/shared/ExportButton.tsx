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

// Fallback libs (เผื่อไม่มี util เดิม)
import html2canvas from "html2canvas";
import * as XLSX from "xlsx";

/** ---------- Safe utils (dynamic import + fallback) ---------- */
type Rows = Array<Array<string | number | null | undefined>>;

const tryImportUtils = async (): Promise<any> => {
  try {
    // dynamic import เพื่อไม่ให้ build พังถ้าไม่มีฟังก์ชันตามชื่อ
    const mod = await import("@/utils/exportUtils");
    return mod || {};
  } catch {
    return {};
  }
};

const toThaiMonthYear = (base: string) => {
  // ถ้ามี util จริง ให้ใช้
  return tryImportUtils().then((U) => {
    if (typeof U.withThaiMonthYear === "function") {
      return U.withThaiMonthYear(base);
    }
    // fallback: ใช้เดือน/ปีปัจจุบัน (พ.ศ.)
    const now = new Date();
    const thMonths = [
      "มกราคม",
      "กุมภาพันธ์",
      "มีนาคม",
      "เมษายน",
      "พฤษภาคม",
      "มิถุนายน",
      "กรกฎาคม",
      "สิงหาคม",
      "กันยายน",
      "ตุลาคม",
      "พฤศจิกายน",
      "ธันวาคม",
    ];
    const label = `${thMonths[now.getMonth()]} ${now.getFullYear() + 543}`;
    return `${base}-${label}`;
  });
};

const download = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

const exportChartPNG_safe = async (elementId: string, filename: string) => {
  const U = await tryImportUtils();
  if (typeof U.exportChartToPNG === "function") {
    return U.exportChartToPNG(elementId, filename);
  }
  // fallback with html2canvas
  const el = document.getElementById(elementId);
  if (!el) return;
  const canvas = await html2canvas(el, { scale: 2, backgroundColor: "#ffffff" });
  const dataUrl = canvas.toDataURL("image/png");
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  a.click();
};

const tableToRows = (table: HTMLTableElement): Rows => {
  const rows: Rows = [];
  const trAll = Array.from(table.querySelectorAll("tr"));
  for (const tr of trAll) {
    const cells = Array.from(tr.children) as Array<HTMLTableCellElement>;
    rows.push(cells.map((c) => c.innerText.trim()));
  }
  return rows;
};

const saveRowsAsCSV = (rows: Rows, filenameNoExt: string) => {
  const csv = rows
    .map((r) =>
      r
        .map((v) => {
          if (v == null) return "";
          const s = String(v).replace(/"/g, '""');
          return /[",\n]/.test(s) ? `"${s}"` : s;
        })
        .join(",")
    )
    .join("\n");
  download(new Blob([csv], { type: "text/csv;charset=utf-8" }), `${filenameNoExt}.csv`);
};

const saveRowsAsXLSX = (rows: Rows, filenameNoExt: string) => {
  const ws = XLSX.utils.aoa_to_sheet(rows as any);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  download(new Blob([wbout], { type: "application/octet-stream" }), `${filenameNoExt}.xlsx`);
};

const saveRowsCSV_XLSX_safe = async (
  rows: Rows,
  base: string,
  opts?: { only?: "csv" | "xlsx" }
) => {
  const U = await tryImportUtils();
  const name = await toThaiMonthYear(base);

  if (typeof U.saveTableAsCSV_XLSX === "function") {
    return U.saveTableAsCSV_XLSX(rows, name, opts);
  }
  if (opts?.only === "csv") return saveRowsAsCSV(rows, name);
  if (opts?.only === "xlsx") return saveRowsAsXLSX(rows, name);

  // default ทั้งสองแบบ
  saveRowsAsCSV(rows, name);
  saveRowsAsXLSX(rows, name);
};

const exportToCSV_safe = async (data: any[], filenameNoExt: string) => {
  const U = await tryImportUtils();
  const name = await toThaiMonthYear(filenameNoExt);
  if (typeof U.exportToCSV === "function") return U.exportToCSV(data, `${name}.csv`);

  const rows: Rows = [];
  if (data.length && typeof data[0] === "object") {
    const headers = Object.keys(data[0]);
    rows.push(headers);
    for (const row of data) rows.push(headers.map((h) => row[h]));
  }
  saveRowsAsCSV(rows, name);
};

const exportToExcel_safe = async (data: any[], filenameNoExt: string) => {
  const U = await tryImportUtils();
  const name = await toThaiMonthYear(filenameNoExt);
  if (typeof U.exportToExcel === "function") return U.exportToExcel(data, `${name}.xlsx`);

  const rows: Rows = [];
  if (data.length && typeof data[0] === "object") {
    const headers = Object.keys(data[0]);
    rows.push(headers);
    for (const row of data) rows.push(headers.map((h) => row[h]));
  }
  saveRowsAsXLSX(rows, name);
};

const extractComments_safe = async (): Promise<Rows> => {
  const U = await tryImportUtils();
  if (typeof U.extractCommentsFromDOM === "function") {
    return U.extractCommentsFromDOM();
  }
  // fallback selector
  const items = Array.from(
    document.querySelectorAll<HTMLElement>("[data-comment-item], .comment-item, .feedback-item")
  );
  const header = [
    "วันที่",
    "สาขา",
    "เขต",
    "ภาค",
    "ประเภทบริการ",
    "ความคิดเห็น",
    "คะแนนความพึงพอใจรวม",
  ];
  const rows: Rows = [header];
  for (const el of items) {
    const get = (sel: string) => el.querySelector(sel)?.textContent?.trim() || "";
    rows.push([
      get("[data-date], .date"),
      get("[data-branch], .branch"),
      get("[data-district], .district"),
      get("[data-region], .region"),
      get("[data-service], .service"),
      get("[data-comment], .comment, .content"),
      get("[data-score], .score"),
    ]);
  }
  return rows;
};

const exportCommentsXLSX_safe = async (rows: Rows, filenameNoExt: string) => {
  const U = await tryImportUtils();
  const name = await toThaiMonthYear(filenameNoExt);
  if (typeof U.exportCommentsRowsToXLSX === "function") {
    return U.exportCommentsRowsToXLSX(rows, name);
  }
  saveRowsAsXLSX(rows, name);
};

/** ---------- Props ---------- */
type ExportButtonProps = {
  type: "chart" | "table" | "feedback";
  elementId?: string;
  data?: any;
  filename?: string;
  title?: string;
  chartType?: string;
};

/** ---------- Component ---------- */
const ExportButton: React.FC<ExportButtonProps> = ({
  type,
  elementId,
  data,
  filename,
  title,
}) => {
  // เดี่ยวตามชนิด
  const onPNG = async () => {
    if (!elementId) return;
    const name = await toThaiMonthYear(filename || title || "chart");
    await exportChartPNG_safe(elementId, `${name}.png`);
  };

  const onCSV = async () => {
    const base = filename || title || "table";
    // มี data → ส่งออกตรง
    if (data && Array.isArray(data) && data.length) {
      return exportToCSV_safe(data, base);
    }
    // ไม่มี data → หา table จาก elementId
    if (elementId) {
      const root = document.getElementById(elementId);
      const table = root?.querySelector("table");
      if (table) {
        const rows = tableToRows(table as HTMLTableElement);
        return saveRowsCSV_XLSX_safe(rows, base, { only: "csv" });
      }
    }
  };

  const onXLSX = async () => {
    const base = filename || title || "table";
    if (data && Array.isArray(data) && data.length) {
      return exportToExcel_safe(data, base);
    }
    if (elementId) {
      const root = document.getElementById(elementId);
      const table = root?.querySelector("table");
      if (table) {
        const rows = tableToRows(table as HTMLTableElement);
        return saveRowsCSV_XLSX_safe(rows, base, { only: "xlsx" });
      }
    }
  };

  // Export All
  const onExportAll = async () => {
    try {
      // charts
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
        const name = await toThaiMonthYear(base);
        await exportChartPNG_safe(id, `${name}.png`);
      }

      // tables
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
          (tb.closest("[data-export-table]") as HTMLElement | null)?.getAttribute(
            "data-export-name"
          ) ||
          tb.getAttribute("aria-label") ||
          `Table-${tIdx++}`;
        const rows = tableToRows(tb);
        await saveRowsCSV_XLSX_safe(rows, base);
      }

      // comments
      const comments = await extractComments_safe();
      if (comments.length > 1) {
        await exportCommentsXLSX_safe(comments, "ความคิดเห็นทั้งหมด");
      }
    } catch (e) {
      console.error("Export All failed:", e);
    }
  };

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

        {type === "chart" && elementId && (
          <DropdownMenuItem onClick={onPNG}>บันทึกกราฟเป็น PNG</DropdownMenuItem>
        )}

        {type === "table" && (
          <>
            <DropdownMenuItem onClick={onCSV}>ส่งออกตารางเป็น CSV</DropdownMenuItem>
            <DropdownMenuItem onClick={onXLSX}>
              ส่งออกตารางเป็น Excel (XLSX)
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onExportAll}>Export All (This Page)</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExportButton;
export { ExportButton };
