import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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