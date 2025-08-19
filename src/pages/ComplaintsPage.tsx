import React from "react";
import { RefreshCw, Info, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UserProfile } from "@/components/layout/UserProfile";
import { useAuth } from "@/contexts/AuthContext";

interface DashboardHeaderProps {
  lastUpdate?: string;
  onRefresh?: () => void;
  // Allow optional passthrough props used by Index.tsx without affecting behavior
  timeFilter?: "1day" | "1week" | "1month" | "3months" | "6months" | "1year";
  onTimeFilterChange?: (value: "1day" | "1week" | "1month" | "3months" | "6months" | "1year") => void;
}

/** ===== helpers ภายในไฟล์เดียว เพื่อกันปัญหา import/deps ===== */
type Row = Array<string | number | null | undefined>;
type Rows = Row[];

const withThaiMonthYear = (base: string) => {
  const now = new Date();
  const thMonths = [
    "มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน",
    "กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม",
  ];
  return `${base}-${thMonths[now.getMonth()]} ${now.getFullYear() + 543}`;
};

const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

const saveRowsAsCSV = (rows: Rows, base: string) => {
  const name = withThaiMonthYear(base);
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
  downloadBlob(new Blob([csv], { type: "text/csv;charset=utf-8" }), `${name}.csv`);
};

const saveRowsAsXLSX = async (rows: Rows, base: string) => {
  const name = withThaiMonthYear(base);
  const XLSX: any = await import("xlsx");
  const ws = XLSX.utils.aoa_to_sheet(rows as any);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  downloadBlob(new Blob([wbout], { type: "application/octet-stream" }), `${name}.xlsx`);
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

const exportChartPNG = async (elementId: string, base: string) => {
  try {
    const { default: html2canvas } = await import("html2canvas");
    const el = document.getElementById(elementId);
    if (!el) return;
    const canvas = await html2canvas(el, { scale: 2, backgroundColor: "#ffffff" });
    const dataUrl = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `${withThaiMonthYear(base)}.png`;
    a.click();
  } catch (e) {
    // ไม่มี html2canvas → ข้ามกราฟไป แต่ยัง export อย่างอื่นได้
    console.warn("Skip charts (html2canvas not available).", e);
  }
};

const extractComments = (): Rows => {
  const header = [
    "วันที่","สาขา","เขต","ภาค","ประเภทบริการ","ความคิดเห็น","คะแนนความพึงพอใจรวม",
  ];
  const items = Array.from(
    document.querySelectorAll<HTMLElement>(
      "[data-comment-item], .comment-item, .feedback-item"
    )
  );
  if (!items.length) return [header];

  const get = (el: HTMLElement, sel: string) =>
    el.querySelector(sel)?.textContent?.trim() || "";

  const rows: Rows = [header];
  for (const el of items) {
    rows.push([
      get(el, "[data-date], .date"),
      get(el, "[data-branch], .branch"),
      get(el, "[data-district], .district"),
      get(el, "[data-region], .region"),
      get(el, "[data-service], .service"),
      get(el, "[data-comment], .comment, .content"),
      get(el, "[data-score], .score"),
    ]);
  }
  return rows;
};

const exportAllThisPage = async () => {
  // 1) กราฟ → PNG
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
    await exportChartPNG(id, base);
  }

  // 2) ตาราง → CSV + XLSX
  const holders = Array.from(document.querySelectorAll<HTMLElement>("[data-export-table]"));
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
    saveRowsAsCSV(rows, base);
    await saveRowsAsXLSX(rows, base);
  }

  // 3) ความคิดเห็น → XLSX (รวมไฟล์เดียว)
  const comments = extractComments();
  if (comments.length > 1) {
    await saveRowsAsXLSX(comments, "ความคิดเห็นทั้งหมด");
  }
};
/** ===== end helpers ===== */

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  lastUpdate,
  onRefresh,
}) => {
  const { state } = useAuth();
  const getCurrentDateTime = () => {
    const now = new Date();
    const day = now.getDate().toString().padStart(2, "0");
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const year = now.getFullYear();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  };

  return (
    <header className="relative bg-white">
      <div className="flex items-center justify-between">
        {/* ซ้าย */}
        <div className="flex-1">
          <h1 className="text-header-main font-bold text-foreground mb-1">
            Dashboard ข้อเสนอแนะ ข้อร้องเรียน การใช้บริการสาขา (Mockup)
          </h1>
          <h2 className="text-header-sub text-muted-foreground">
            ระบบติดตามและวิเคราะห์ข้อร้องเรียนลูกค้าธนาคารออมสิน
          </h2>
        </div>

        {/* ขวา */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm text-muted-foreground">ข้อมูลอัพเดทล่าสุด</p>
            <p className="text-body font-medium text-foreground">
              {lastUpdate || getCurrentDateTime()}
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            className="h-9 w-9 p-0 border-primary/20 hover:bg-primary/5"
            aria-label="รีเฟรชข้อมูล"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>

          {/* ปุ่ม Export All (เพิ่มแค่ปุ่มเดียว ไม่แตะ UI อื่น) */}
          <Button
            variant="outline"
            size="sm"
            onClick={exportAllThisPage}
            className="h-9 w-9 p-0 border-primary/20 hover:bg-primary/5"
            aria-label="ส่งออกข้อมูลหน้านี้"
            title="Export All (This Page)"
          >
            <Download className="w-4 h-4" />
          </Button>

          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-9 w-9 p-0 border-primary/20 hover:bg-primary/5"
                aria-label="เกี่ยวกับ"
              >
                <Info className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-header-sub">
                  เกี่ยวกับระบบ
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 text-body">
                <div>
                  <h3 className="font-semibold mb-2">Customer Feedback Management System</h3>
                  <p className="text-muted-foreground">Version 2.1.0</p>
                  <p className="text-muted-foreground">สร้างเมื่อ: มกราคม 2025</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">ผู้ใช้งานปัจจุบัน</h3>
                  <p className="text-muted-foreground">{state.user?.fullName}</p>
                  <p className="text-muted-foreground">{state.user?.department}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">หน่วยงานผู้พัฒนา</h3>
                  <p className="text-muted-foreground">ฝ่ายนวัตกรรมสารสนเทศ</p>
                  <p className="text-muted-foreground">ธนาคารออมสิน</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">ติดต่อกลับ</h3>
                  <p className="text-muted-foreground">โทร: 02-xxx-xxxx</p>
                  <p className="text-muted-foreground">อีเมล: innovation@gsb.or.th</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <UserProfile />
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
