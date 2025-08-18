import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Download, FileText, FileSpreadsheet, Image, FileDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  exportToCSV as exportCSV, 
  exportToExcel as exportExcel, 
  exportChartToPNG, 
  exportToPDF,
  convertChartDataForExport,
  convertFeedbackDataForExport 
} from '@/utils/exportUtils';

interface ExportButtonProps {
  data?: any;
  type: 'chart' | 'table' | 'feedback';
  filename?: string;
  elementId?: string;
  chartType?: string;
  title?: string;
}

export const ExportButton: React.FC<ExportButtonProps> = ({ 
  data, 
  type, 
  filename = 'export',
  elementId,
  chartType = 'กราฟ',
  title
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const prepareDataForExport = () => {
    if (!data) return [];
    
    if (type === 'feedback') {
      return convertFeedbackDataForExport(data);
    } else if (type === 'chart') {
      return convertChartDataForExport(data, chartType);
    }
    
    return Array.isArray(data) ? data : [data];
  };

  const exportToCSV = async () => {
    setIsExporting(true);
    try {
      const exportData = prepareDataForExport();
      await exportCSV(exportData, filename);
      
      toast({
        title: "ส่งออกข้อมูลสำเร็จ",
        description: `ไฟล์ ${filename}.csv ถูกดาวน์โหลดแล้ว`,
      });
    } catch (error) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถส่งออกข้อมูลได้",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  const exportToExcel = async () => {
    setIsExporting(true);
    try {
      const exportData = prepareDataForExport();
      await exportExcel(exportData, filename, 'ข้อมูล');
      
      toast({
        title: "ส่งออกข้อมูลสำเร็จ",
        description: `ไฟล์ ${filename}.xlsx ถูกดาวน์โหลดแล้ว`,
      });
    } catch (error) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถส่งออกข้อมูลได้",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  const exportToPNG = async () => {
    if (!elementId) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่พบองค์ประกอบที่จะส่งออก",
        variant: "destructive"
      });
      return;
    }

    setIsExporting(true);
    try {
      await exportChartToPNG(elementId, filename);
      
      toast({
        title: "ส่งออกรูปภาพสำเร็จ",
        description: `ไฟล์ ${filename}.png ถูกดาวน์โหลดแล้ว`,
      });
    } catch (error) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถส่งออกรูปภาพได้",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  const exportToPDFFile = async () => {
    if (!elementId) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่พบองค์ประกอบที่จะส่งออก",
        variant: "destructive"
      });
      return;
    }

    setIsExporting(true);
    try {
      await exportToPDF(elementId, filename, title);
      
      toast({
        title: "ส่งออก PDF สำเร็จ",
        description: `ไฟล์ ${filename}.pdf ถูกดาวน์โหลดแล้ว`,
      });
    } catch (error) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถส่งออก PDF ได้",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          disabled={isExporting}
          className="gap-2"
        >
          <Download className="w-4 h-4" />
          {isExporting ? 'กำลังส่งออก...' : 'ส่งออก'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {(type === 'chart' || type === 'table') && elementId && (
          <>
            <DropdownMenuItem onClick={exportToPNG}>
              <Image className="w-4 h-4 mr-2" />
              ส่งออกเป็นรูปภาพ (PNG)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={exportToPDFFile}>
              <FileDown className="w-4 h-4 mr-2" />
              ส่งออกเป็น PDF
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuItem onClick={exportToCSV}>
          <FileText className="w-4 h-4 mr-2" />
          ส่งออกเป็น CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToExcel}>
          <FileSpreadsheet className="w-4 h-4 mr-2" />
          ส่งออกเป็น Excel
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};