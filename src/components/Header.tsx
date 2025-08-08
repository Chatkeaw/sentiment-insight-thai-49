
import React, { useState } from 'react';
import { RefreshCw, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export const Header: React.FC = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const currentDate = new Date().toLocaleDateString('th-TH');
  const currentTime = new Date().toLocaleTimeString('th-TH');

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate refresh delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
    window.location.reload();
  };

  return (
    <header className="border-b border-border/50 bg-white/80 backdrop-blur-sm">
      <div className="flex items-center justify-between p-6">
        {/* Left: Title */}
        <div className="flex-1">
          <h1 className="text-header-main font-bold text-foreground mb-1">
            Dashboard ข้อเสนอแนะ ข้อร้องเรียน การใช้บริการสาขา (Mockup)
          </h1>
          <div className="inline-block bg-pink-deep px-4 py-1 rounded-full">
            <p className="text-header-sub font-semibold text-white">
              ระบบติดตามและวิเคราะห์ข้อร้องเรียนลูกค้าธนาคารออมสิน
            </p>
          </div>
        </div>

        {/* Right: Functions */}
        <div className="flex items-center gap-4">
          {/* Last Updated */}
          <div className="text-right">
            <p className="text-body text-muted-foreground">ข้อมูลอัพเดทล่าสุด</p>
            <p className="text-body font-medium text-foreground">
              {currentDate} {currentTime}
            </p>
          </div>

          {/* Refresh Button */}
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            variant="outline"
            size="icon"
            className="border-pink-medium/30 hover:bg-pink-light/20 text-pink-deep"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>

          {/* About Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon" className="border-pink-medium/30 hover:bg-pink-light/20 text-pink-deep">
                <Info className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>เกี่ยวกับระบบ</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 text-body">
                <div>
                  <p className="font-medium">เวอร์ชัน:</p>
                  <p className="text-muted-foreground">Dashboard v1.0.0</p>
                </div>
                <div>
                  <p className="font-medium">ฝ่ายผู้พัฒนา:</p>
                  <p className="text-muted-foreground">ฝ่ายนวัตกรรมสารสนเทศ</p>
                </div>
                <div>
                  <p className="font-medium">ติดต่อสอบถาม:</p>
                  <p className="text-muted-foreground">โทร: 02-XXX-XXXX</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </header>
  );
};
