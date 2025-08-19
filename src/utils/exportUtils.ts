import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, Header, Footer, PageBreak } from 'docx';

// Thai month names for filename generation
export const THAI_MONTHS = [
  "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
  "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
];

// Helper to get Thai month and Buddhist Era year
export function getThaiMonthYearLabel(ctx?: { month?: string; year?: string }): string {
  let m = ctx?.month, y = ctx?.year;
  try {
    if (!m || !y) {
      const raw = localStorage.getItem("dashboard.month");
      if (raw) { 
        const v = JSON.parse(raw); 
        m = m ?? v?.month; 
        y = y ?? v?.year; 
      }
    }
  } catch {}
  if (!m || !y) { 
    const now = new Date(); 
    m = String(now.getMonth() + 1); 
    y = String(now.getFullYear()); 
  }
  const idx = Math.max(1, Math.min(12, parseInt(m, 10))) - 1;
  const monthTH = THAI_MONTHS[idx] ?? "";
  const yearBE = Number(y) + 543;
  return `${monthTH} ${yearBE}`;
}

// Helper to create filename with Thai month/year
export function withThaiMonthYear(base: string, ctx?: { month?: string; year?: string }): string {
  const label = getThaiMonthYearLabel(ctx);
  const safe = (s: string) => s.replace(/[\\/:*?"<>|]+/g, "").replace(/\s+/g, "-");
  return `${safe(base)}-${safe(label)}`;
}

export const downloadFile = (content: string | Blob, filename: string, type: string) => {
  const blob = content instanceof Blob ? content : new Blob([content], { type });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  window.URL.revokeObjectURL(url);
};

export const exportToCSV = (data: any[], filename: string) => {
  const csvContent = convertToCSV(data);
  downloadFile(csvContent, `${filename}.csv`, 'text/csv;charset=utf-8;');
};

export const exportToExcel = (data: any[], filename: string, sheetName: string = 'Sheet1') => {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  downloadFile(blob, `${filename}.xlsx`, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
};

export const exportChartToPNG = async (elementId: string, filename: string) => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Element not found');
  }

  const canvas = await html2canvas(element, {
    backgroundColor: '#ffffff',
    scale: 2,
    logging: false,
  });

  canvas.toBlob((blob) => {
    if (blob) {
      downloadFile(blob, `${filename}.png`, 'image/png');
    }
  });
};

export const exportToPDF = async (elementId: string, filename: string, title?: string) => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Element not found');
  }

  const canvas = await html2canvas(element, {
    backgroundColor: '#ffffff',
    scale: 2,
    logging: false,
  });

  const imgWidth = 210;
  const pageHeight = 295;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  let heightLeft = imgHeight;

  const pdf = new jsPDF('p', 'mm', 'a4');
  let position = 0;

  if (title) {
    pdf.setFontSize(16);
    pdf.text(title, 20, 20);
    position = 30;
  }

  // Add export date
  const exportDate = new Date().toLocaleDateString('th-TH');
  pdf.setFontSize(10);
  pdf.text(`ส่งออกข้อมูลเมื่อ: ${exportDate}`, 20, 285);

  pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  while (heightLeft >= 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  pdf.save(`${filename}.pdf`);
};

export const exportToDOCX = async (data: any[], filename: string, title: string, type: 'chart' | 'feedback' | 'table' = 'feedback') => {
  const exportDate = new Date().toLocaleDateString('th-TH');
  
  let children: any[] = [
    new Paragraph({
      text: title,
      heading: HeadingLevel.HEADING_1,
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: `ส่งออกข้อมูลเมื่อ: ${exportDate}`,
          size: 20,
        }),
      ],
    }),
    new Paragraph({ text: "" }), // Empty line
  ];

  if (type === 'feedback') {
    // Add feedback data as table
    const tableRows = [
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("วันที่")] }),
          new TableCell({ children: [new Paragraph("สาขา")] }),
          new TableCell({ children: [new Paragraph("ประเภทบริการ")] }),
          new TableCell({ children: [new Paragraph("ความคิดเห็น")] }),
          new TableCell({ children: [new Paragraph("คะแนนรวม")] }),
        ],
      }),
    ];

    data.forEach((item: any) => {
      tableRows.push(
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph(item['วันที่'] || '')] }),
            new TableCell({ children: [new Paragraph(item['สาขา'] || '')] }),
            new TableCell({ children: [new Paragraph(item['ประเภทบริการ'] || '')] }),
            new TableCell({ children: [new Paragraph(item['ความคิดเห็น'] || '')] }),
            new TableCell({ children: [new Paragraph(item['คะแนนความพึงพอใจรวม']?.toString() || '')] }),
          ],
        })
      );
    });

    children.push(
      new Table({
        rows: tableRows,
      })
    );
  } else {
    // Add chart data as simple text
    data.forEach((item: any) => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${item['รายการ'] || item.name}: ${item['ค่า'] || item.value} ${item['เปอร์เซ็นต์'] || ''}`,
              size: 24,
            }),
          ],
        })
      );
    });
  }

  const doc = new Document({
    sections: [
      {
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "รายงานข้อมูลลูกค้า",
                    size: 20,
                  }),
                ],
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: `หน้า {PAGE_NUM} จาก {TOTAL_PAGES} | ส่งออกเมื่อ ${exportDate}`,
                    size: 18,
                  }),
                ],
              }),
            ],
          }),
        },
        children,
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  });
  
  downloadFile(blob, `${filename}.docx`, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
};

const convertToCSV = (data: any[]): string => {
  if (!data.length) return '';

  const headers = Object.keys(data[0]);
  const csvRows = [];

  // Add headers
  csvRows.push(headers.join(','));

  // Add data rows
  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header];
      const escaped = ('' + value).replace(/"/g, '\\"');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(','));
  }

  return csvRows.join('\n');
};

// Chart data conversion utilities
export const convertChartDataForExport = (chartData: any[], chartType: string) => {
  return chartData.map((item, index) => ({
    'รายการ': item.name || item.label || `รายการ ${index + 1}`,
    'ค่า': item.value || item.count || 0,
    'เปอร์เซ็นต์': item.percentage ? `${item.percentage}%` : '',
    'ประเภทกราฟ': chartType,
    ...item
  }));
};

export const convertFeedbackDataForExport = (feedbackData: any[]) => {
  return feedbackData.map(item => ({
    'วันที่': item.date || item.timestamp,
    'สาขา': item.branch?.branch || '',
    'เขต': item.branch?.district || '',
    'ภาค': item.branch?.region || '',
    'ประเภทบริการ': item.serviceType || '',
    'ความคิดเห็น': item.comment || '',
    'คะแนนความพึงพอใจรวม': item.satisfaction?.overall || '',
    'ความเอาใจใส่': item.satisfaction?.care || '',
    'การให้คำปรึกษา': item.satisfaction?.consultation || '',
    'ความรวดเร็ว': item.satisfaction?.speed || '',
    'ความถูกต้อง': item.satisfaction?.accuracy || '',
    'อุปกรณ์เครื่องมือ': item.satisfaction?.equipment || '',
    'สภาพแวดล้อม': item.satisfaction?.environment || ''
  }));
};

// Color management for complaint categories
export const getComplaintCategoryColor = (category: string, index: number, isMarketConduct: boolean = false): string => {
  if (isMarketConduct || category === 'Market Conduct' || category.includes('Market') || category.includes('ธรรมาภิบาล')) {
    return '#DC2626'; // Deep red for Market Conduct (highest priority)
  }
  
  // Red gradient colors for other categories (sorted by complaint count)
  const redShades = ['#EF4444', '#F87171', '#FCA5A5', '#FECACA', '#FEE2E2', '#FEF2F2'];
  return redShades[index] || '#FEF2F2';
};

// Sort complaint data with Market Conduct first, then by complaint count
export const sortComplaintData = (data: any[], complaintKey: string = 'negative') => {
  return data.sort((a, b) => {
    // Market Conduct always comes first
    const aIsMarketConduct = a.name?.includes('Market') || a.name?.includes('ธรรมาภิบาล') || a.category === 'marketConduct';
    const bIsMarketConduct = b.name?.includes('Market') || b.name?.includes('ธรรมาภิบาล') || b.category === 'marketConduct';
    
    if (aIsMarketConduct && !bIsMarketConduct) return -1;
    if (!aIsMarketConduct && bIsMarketConduct) return 1;
    
    // Sort others by complaint count (descending)
    const aCount = a[complaintKey] || a.value || 0;
    const bCount = b[complaintKey] || b.value || 0;
    return bCount - aCount;
  });
};

// Helper to extract table data from DOM
export function domTableToRows(table: HTMLTableElement) {
  const headers: string[] = [];
  const rows: string[][] = [];
  
  // Extract headers
  const ths = table.querySelectorAll("thead th");
  if (ths.length) {
    ths.forEach(th => headers.push((th as HTMLElement).innerText.trim()));
  } else {
    const first = table.querySelector("tr");
    if (first) {
      first.querySelectorAll("th,td").forEach(c => 
        headers.push((c as HTMLElement).innerText.trim())
      );
    }
  }
  
  // Extract rows
  table.querySelectorAll("tbody tr").forEach(tr => {
    const r: string[] = [];
    tr.querySelectorAll("td").forEach(td => 
      r.push((td as HTMLElement).innerText.trim())
    );
    if (r.length) rows.push(r);
  });
  
  return { headers, rows };
}

// Save table data as CSV and XLSX
export function saveTableAsCSV_XLSX(tab: { headers: string[]; rows: string[][] }, baseName: string) {
  // CSV
  const csv = [
    tab.headers.join(","),
    ...tab.rows.map(r => 
      r.map(c => `"${(c ?? "").replace(/"/g, '""')}"`).join(",")
    )
  ].join("\n");
  const csvBlob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  downloadFile(csvBlob, `${withThaiMonthYear(baseName)}.csv`, "text/csv");
  
  // XLSX
  const ws = XLSX.utils.aoa_to_sheet([tab.headers, ...tab.rows]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Table");
  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const xlsxBlob = new Blob([wbout], { type: "application/octet-stream" });
  downloadFile(xlsxBlob, `${withThaiMonthYear(baseName)}.xlsx`, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
}

// Extract comments from DOM
export function extractCommentsFromDOM() {
  const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-comment-item]"));
  const rows = nodes.map(n => {
    const get = (k: string) => n.dataset[k] ?? "";
    const tags = get("tags");
    return {
      Date: get("date"),
      Region: get("region"),
      District: get("district"),
      Branch: get("branch"),
      Topic: get("topic"),
      Category: get("category"),
      Sentiment: get("sentiment"),
      Rating: get("rating"),
      Comment: get("text") || n.innerText.trim(),
      Source: get("source"),
      Tags: tags
    };
  });
  
  // Fallback to window.__COMMENTS__ if exists and DOM empty
  // @ts-ignore
  if (!rows.length && Array.isArray(window.__COMMENTS__)) {
    // @ts-ignore
    return window.__COMMENTS__.map((c: any) => ({
      Date: c.date ?? "",
      Region: c.region ?? "",
      District: c.district ?? "",
      Branch: c.branch ?? "",
      Topic: c.topic ?? "",
      Category: c.category ?? "",
      Sentiment: c.sentiment ?? "",
      Rating: c.rating ?? "",
      Comment: c.text ?? c.comment ?? "",
      Source: c.source ?? "",
      Tags: Array.isArray(c.tags) ? c.tags.join(",") : (c.tags ?? "")
    }));
  }
  return rows;
}

// Export comments to XLSX
export function exportCommentsRowsToXLSX(rows: any[], baseName: string) {
  const headers = ["Date", "Region", "District", "Branch", "Topic", "Category", "Sentiment", "Rating", "Comment", "Source", "Tags"];
  const aoa = [headers, ...rows.map(r => headers.map(h => r[h] ?? ""))];
  const ws = XLSX.utils.aoa_to_sheet(aoa);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Comments");
  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const blob = new Blob([wbout], { type: "application/octet-stream" });
  downloadFile(blob, `${withThaiMonthYear(baseName)}.xlsx`, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
}

// Helper to ensure element has an ID for canvas capture
export function ensureTempId(element: HTMLElement): string {
  if (element.id) return element.id;
  const tempId = `temp-export-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  element.id = tempId;
  return tempId;
}

// Export all content on current page
export async function exportAllCurrentPage() {
  try {
    // 1. Export Charts
    const chartNodes = Array.from(document.querySelectorAll<HTMLElement>("[data-export-chart], .recharts-wrapper"));
    for (const node of chartNodes) {
      const name = node.dataset.exportChart || node.id || node.getAttribute("aria-label") || "Chart";
      const elementId = ensureTempId(node);
      await exportChartToPNG(elementId, withThaiMonthYear(name));
    }

    // 2. Export Tables
    const tableContainers = Array.from(document.querySelectorAll<HTMLElement>("[data-export-table]"));
    const tables = new Set<HTMLTableElement>([
      ...tableContainers.flatMap(c => Array.from(c.querySelectorAll("table"))),
      ...Array.from(document.querySelectorAll("table"))
    ]);
    
    for (const table of tables) {
      const baseName = (table.closest("[data-export-table]")?.getAttribute("data-export-name")) || 
                       table.getAttribute("aria-label") || "Table";
      const tab = domTableToRows(table);
      if (tab.headers.length && tab.rows.length) {
        saveTableAsCSV_XLSX(tab, baseName);
      }
    }

    // 3. Export Comments
    const rows = extractCommentsFromDOM();
    if (rows.length) {
      exportCommentsRowsToXLSX(rows, "ความคิดเห็นทั้งหมด");
    }

    return { 
      charts: chartNodes.length, 
      tables: tables.size, 
      comments: rows.length 
    };
  } catch (error) {
    console.error('Export all error:', error);
    throw error;
  }
}