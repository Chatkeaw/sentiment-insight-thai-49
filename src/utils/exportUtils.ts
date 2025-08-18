import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, Header, Footer, PageBreak } from 'docx';

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