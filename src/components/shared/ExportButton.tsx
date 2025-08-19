import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from '@/components/ui/dialog';
import { Download, FileText, FileSpreadsheet, Image, File } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  exportToCSV, 
  exportToExcel, 
  exportChartToPNG, 
  exportToPDF, 
  exportToDOCX,
  convertChartDataForExport, 
  convertFeedbackDataForExport,
  exportAllCharts,
  exportCommentsToExcel,
  withThaiMonthYear
} from '@/utils/exportUtils';

interface ExportButtonProps {
  data: any[] | any;
  type: 'chart' | 'feedback' | 'table';
  filename: string;
  title?: string;
  elementId?: string; // Required for chart/PDF exports
  chartType?: string; // Description of chart type for export
}

export const ExportButton: React.FC<ExportButtonProps> = ({
  data,
  type,
  filename,
  title,
  elementId,
  chartType = 'กราฟ',
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const prepareDataForExport = () => {
    const arrayData = Array.isArray(data) ? data : [data];
    switch (type) {
      case 'chart':
        return convertChartDataForExport(arrayData, chartType);
      case 'feedback':
        return convertFeedbackDataForExport(arrayData);
      default:
        return arrayData;
    }
  };

  const handleExport = async (format: 'csv' | 'excel' | 'png' | 'pdf' | 'docx') => {
    try {
      setIsExporting(true);
      const exportData = prepareDataForExport();

      switch (format) {
        case 'csv':
          exportToCSV(exportData, filename);
          break;
        case 'excel':
          exportToExcel(exportData, filename, 'ข้อมูล');
          break;
        case 'png':
          if (!elementId) {
            throw new Error('Element ID is required for PNG export');
          }
          await exportChartToPNG(elementId, filename);
          break;
        case 'pdf':
          if (!elementId) {
            throw new Error('Element ID is required for PDF export');
          }
          await exportToPDF(elementId, filename, title);
          break;
        case 'docx':
          await exportToDOCX(exportData, filename, title || 'รายงานข้อมูล', type);
          break;
        default:
          throw new Error('Unsupported export format');
      }

      toast({
        title: "ส่งออกข้อมูลสำเร็จ",
        description: `ไฟล์ ${filename}.${format} ถูกดาวน์โหลดแล้ว`,
      });
      
      setIsModalOpen(false);
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถส่งออกข้อมูลได้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const exportOptions = [
    {
      format: 'csv' as const,
      label: 'CSV',
      description: 'ไฟล์ข้อมูลที่แยกด้วยเครื่องหมายจุลภาค',
      icon: FileText,
      available: type !== 'chart' || false,
    },
    {
      format: 'excel' as const,
      label: 'Excel (XLSX)',
      description: 'ไฟล์ Excel สำหรับการวิเคราะห์ข้อมูล',
      icon: FileSpreadsheet,
      available: true,
    },
    {
      format: 'png' as const,
      label: 'PNG',
      description: 'รูปภาพกราฟความละเอียดสูง',
      icon: Image,
      available: type === 'chart' && !!elementId,
    },
    {
      format: 'pdf' as const,
      label: 'PDF',
      description: 'เอกสาร PDF พร้อมกราฟและข้อมูล',
      icon: FileText,
      available: !!elementId,
    },
    {
      format: 'docx' as const,
      label: 'Word (DOCX)',
      description: 'เอกสาร Word สำหรับการแก้ไข',
      icon: File,
      available: true,
    },
  ];

  const availableOptions = exportOptions.filter(option => option.available);

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 hover:bg-primary/10"
        >
          <Download className="w-4 h-4" />
          ส่งออก
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>เลือกรูปแบบไฟล์</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            เลือกรูปแบบไฟล์ที่ต้องการส่งออกข้อมูล
          </p>
          <div className="space-y-2">
            {availableOptions.map((option) => {
              const Icon = option.icon;
              return (
                <Button
                  key={option.format}
                  variant="ghost"
                  className="w-full justify-start p-4 h-auto"
                  onClick={() => handleExport(option.format)}
                  disabled={isExporting}
                >
                  <div className="flex items-start gap-3">
                    <Icon className="w-5 h-5 mt-0.5 text-primary" />
                    <div className="text-left">
                      <div className="font-medium">{option.label}</div>
                      <div className="text-sm text-muted-foreground">
                        {option.description}
                      </div>
                    </div>
                  </div>
                </Button>
              );
            })}
          </div>
          {isExporting && (
            <div className="text-center py-4">
              <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                กำลังส่งออกข้อมูล...
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};