import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Download, FileText, FileSpreadsheet, Image } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ExportButtonProps {
  data?: any;
  type: 'chart' | 'table' | 'feedback';
  filename?: string;
}

export const ExportButton: React.FC<ExportButtonProps> = ({ 
  data, 
  type, 
  filename = 'export' 
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const exportToCSV = async () => {
    setIsExporting(true);
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "ส่งออกข้อมูลสำเร็จ",
        description: `ไฟล์ ${filename}.csv ถูกดาวน์โหลดแล้ว`,
      });
    } finally {
      setIsExporting(false);
    }
  };

  const exportToExcel = async () => {
    setIsExporting(true);
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "ส่งออกข้อมูลสำเร็จ",
        description: `ไฟล์ ${filename}.xlsx ถูกดาวน์โหลดแล้ว`,
      });
    } finally {
      setIsExporting(false);
    }
  };

  const exportToPNG = async () => {
    setIsExporting(true);
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "ส่งออกรูปภาพสำเร็จ",
        description: `ไฟล์ ${filename}.png ถูกดาวน์โหลดแล้ว`,
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
      <DropdownMenuContent align="end">
        {(type === 'chart' || type === 'table') && (
          <DropdownMenuItem onClick={exportToPNG}>
            <Image className="w-4 h-4 mr-2" />
            ส่งออกเป็นรูปภาพ (PNG)
          </DropdownMenuItem>
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