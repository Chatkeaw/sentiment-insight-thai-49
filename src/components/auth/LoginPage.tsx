import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Shield, Users, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const success = await login({ username, password });
    
    if (!success) {
      setError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
    }
    
    setIsLoading(false);
  };

  const handleDemoLogin = (role: string) => {
    setUsername(role);
    setPassword('password123');
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-pink-50 via-white to-pink-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-primary">
            ระบบจัดการความคิดเห็นลูกค้า
          </h1>
          <p className="text-lg text-muted-foreground">
            Customer Feedback Management System
          </p>
          <p className="text-sm text-muted-foreground">
            ธนาคารออมสิน - ฝ่ายนวัตกรรมสารสนเทศ
          </p>
        </div>

        {/* Login Form */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">เข้าสู่ระบบ</CardTitle>
            <CardDescription>
              กรุณาเข้าสู่ระบบเพื่อใช้งาน Dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">ชื่อผู้ใช้</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="กรอกชื่อผู้ใช้"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">รหัสผ่าน</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="กรอกรหัสผ่าน"
                  required
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                เข้าสู่ระบบ
              </Button>
            </form>

            {/* Demo Accounts */}
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground text-center mb-3">
                บัญชีทดสอบ (รหัสผ่าน: password123)
              </p>
              <div className="grid gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleDemoLogin('hr_user')}
                  className="w-full justify-start"
                  disabled={isLoading}
                >
                  <Users className="mr-2 h-4 w-4" />
                  HR User - สมศรี ใจดี
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleDemoLogin('business_admin')}
                  className="w-full justify-start"
                  disabled={isLoading}
                >
                  <Shield className="mr-2 h-4 w-4" />
                  Business Admin - สมชาย บริหาร
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleDemoLogin('system_admin')}
                  className="w-full justify-start"
                  disabled={isLoading}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  System Admin - สมหมาย เทคโนโลยี
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <div className="text-center text-sm text-muted-foreground">
          <p>ติดต่อสอบถาม: ฝ่ายนวัตกรรมสารสนเทศ</p>
          <p>โทร: 02-XXX-XXXX ต่อ XXXX</p>
        </div>
      </div>
    </div>
  );
};