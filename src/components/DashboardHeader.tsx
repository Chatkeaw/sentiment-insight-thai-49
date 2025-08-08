import React from "react";
import { RefreshCw, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface DashboardHeaderProps {
  lastUpdate?: string;
  onRefresh?: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  lastUpdate,
  onRefresh
}) => {
  const getCurrentDateTime = () => {
    const now = new Date();
    const day = now.getDate().toString().padStart(2, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const year = now.getFullYear();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  };

  return (
    <header className="sticky top-0 z-50 w-full h-24 bg-white/95 backdrop-blur-sm border-b border-border/30 shadow-sm">
      <div className="container mx-auto px-6 h-full flex items-center justify-between">
        {/* ด้านซ้าย - หัวข้อ Dashboard */}
        <div className="flex-1">
          <h1 className="text-header-main text-foreground leading-tight">
            Dashboard ข้อเสนอแนะ ข้อร้องเรียน การใช้บริการสาขา (Mockup)
          </h1>
          <h2 className="text-header-sub text-muted-foreground mt-1">
            ระบบติดตามและวิเคราะห์ข้อร้องเรียนลูกค้าธนาคารออมสิน
          </h2>
        </div>

        {/* ด้านขวา - ข้อมูลและปุ่ม */}
        <div className="flex items-center gap-4">
          {/* ข้อมูลอัพเดทล่าสุด */}
          <div className="text-right">
            <p className="text-sm text-muted-foreground">ข้อมูลอัพเดทล่าสุด</p>
            <p className="text-body font-medium text-foreground">
              {lastUpdate || getCurrentDateTime()}
            </p>
          </div>

          {/* ปุ่มรีเฟรช */}
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            className="h-9 w-9 p-0 border-primary/20 hover:bg-primary/5"
            aria-label="รีเฟรชข้อมูล"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>

          {/* ปุ่ม About */}
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
                  เกี่ยวกับ Dashboard
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 text-body">
                <div>
                  <h3 className="font-semibold mb-2">Version</h3>
                  <p className="text-muted-foreground">Dashboard v1.0.0</p>
                  <p className="text-muted-foreground">สร้างเมื่อ: มกราคม 2025</p>
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
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;