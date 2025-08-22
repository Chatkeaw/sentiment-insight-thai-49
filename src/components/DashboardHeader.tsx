
import React from "react";
import { RefreshCw, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { UserProfile } from "@/components/layout/UserProfile";
import { useAuth } from "@/contexts/AuthContext";

interface DashboardHeaderProps {
  lastUpdate?: string;
  onRefresh?: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  lastUpdate,
  onRefresh
}) => {
  const { state } = useAuth();
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
    <header className="relative bg-white">
      <div className="flex items-center justify-between">
        {/* ด้านซ้าย - หัวข้อ Dashboard */}
        <div className="flex-1">
          <h1 className="text-lg lg:text-xl font-bold text-foreground mb-1">
            Dashboard ข้อเสนอแนะ ข้อร้องเรียน การใช้บริการสาขา (Mockup)
          </h1>
          <h2 className="text-sm lg:text-base text-muted-foreground">
            ระบบติดตามและวิเคราะห์ข้อร้องเรียนลูกค้าธนาคารออมสิน
          </h2>
        </div>

        {/* ด้านขวา - ข้อมูลและปุ่ม */}
        <div className="flex items-center gap-4">
          {/* ข้อมูลอัพเดทล่าสุด */}
          <div className="text-right">
            <p className="text-sm text-muted-foreground">ข้อมูลอัพเดทล่าสุด</p>
            <p className="text-sm font-medium text-foreground">
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
                <DialogTitle className="text-lg">
                  เกี่ยวกับระบบ
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 text-sm">
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

          {/* User Profile */}
          <UserProfile />
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
