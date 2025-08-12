import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Trash2, Search, UserPlus } from 'lucide-react';
import { User, USER_ROLES } from '@/types/auth';
import { useToast } from '@/hooks/use-toast';

// Mock users data
const mockUsers: User[] = [
  {
    id: '1',
    username: 'hr_user',
    email: 'hr@bank.com',
    role: 'hr',
    fullName: 'สมศรี ใจดี',
    department: 'ทรัพยากรบุคคล',
    lastLogin: '2024-01-15 14:30:00',
    isActive: true
  },
  {
    id: '2',
    username: 'admin',
    email: 'admin@bank.com',
    role: 'admin',
    fullName: 'สมชาย บริหาร',
    department: 'ฝ่ายบริหาร',
    lastLogin: '2024-01-15 16:45:00',
    isActive: true
  },
  {
    id: '3',
    username: 'hr_assistant',
    email: 'hr.assist@bank.com',
    role: 'hr',
    fullName: 'สมใส ช่วยงาน',
    department: 'ทรัพยากรบุคคล',
    lastLogin: '2024-01-14 17:20:00',
    isActive: false
  }
];

export const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const { toast } = useToast();

  const filteredUsers = users.filter(user =>
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'destructive';
      case 'hr': return 'secondary';
      default: return 'outline';
    }
  };

  const handleCreateUser = () => {
    toast({
      title: "สร้างผู้ใช้ใหม่",
      description: "ระบบจะส่งอีเมลแจ้งข้อมูลการเข้าสู่ระบบให้ผู้ใช้ใหม่",
    });
    setIsCreateDialogOpen(false);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
  };

  const handleDeleteUser = (userId: string) => {
    toast({
      title: "ลบผู้ใช้สำเร็จ",
      description: "ลบข้อมูลผู้ใช้งานออกจากระบบแล้ว",
    });
  };

  const handleToggleUserStatus = (userId: string, isActive: boolean) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, isActive } : user
    ));
    
    toast({
      title: isActive ? "เปิดใช้งานผู้ใช้" : "ปิดใช้งานผู้ใช้",
      description: isActive ? "ผู้ใช้สามารถเข้าสู่ระบบได้แล้ว" : "ผู้ใช้ไม่สามารถเข้าสู่ระบบได้",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">จัดการผู้ใช้งาน</h1>
          <p className="text-muted-foreground">
            จัดการบัญชีผู้ใช้งานและสิทธิ์การเข้าถึงระบบ
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              สร้างผู้ใช้ใหม่
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>สร้างผู้ใช้ใหม่</DialogTitle>
              <DialogDescription>
                กรอกข้อมูลผู้ใช้งานใหม่ ระบบจะส่งข้อมูลการเข้าสู่ระบบทางอีเมล
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullname">ชื่อ-นามสกุล</Label>
                <Input id="fullname" placeholder="กรอกชื่อ-นามสกุล" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">ชื่อผู้ใช้</Label>
                <Input id="username" placeholder="กรอกชื่อผู้ใช้" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">อีเมล</Label>
                <Input id="email" type="email" placeholder="กรอกอีเมล" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">บทบาท</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกบทบาท" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hr">HR User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">หน่วยงาน</Label>
                <Input id="department" placeholder="กรอกหน่วยงาน" />
              </div>
              <Button onClick={handleCreateUser} className="w-full">
                <UserPlus className="mr-2 h-4 w-4" />
                สร้างผู้ใช้
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ผู้ใช้งานทั้งหมด</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ผู้ใช้งานที่เปิดใช้งาน</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {users.filter(u => u.isActive).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">HR Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(u => u.role === 'hr').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(u => u.role === 'admin').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>รายการผู้ใช้งาน</CardTitle>
              <CardDescription>
                จัดการข้อมูลและสิทธิ์ของผู้ใช้งานในระบบ
              </CardDescription>
            </div>
            <div className="relative w-72">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ค้นหาผู้ใช้งาน..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ชื่อ-นามสกุล</TableHead>
                <TableHead>ชื่อผู้ใช้</TableHead>
                <TableHead>อีเมล</TableHead>
                <TableHead>บทบาท</TableHead>
                <TableHead>หน่วยงาน</TableHead>
                <TableHead>เข้าสู่ระบบล่าสุด</TableHead>
                <TableHead>สถานะ</TableHead>
                <TableHead>การจัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.fullName}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={getRoleBadgeVariant(user.role)}>
                      {USER_ROLES[user.role]}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.department}</TableCell>
                  <TableCell>{user.lastLogin}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={user.isActive}
                        onCheckedChange={(checked) => handleToggleUserStatus(user.id, checked)}
                      />
                      <span className={user.isActive ? 'text-emerald-600' : 'text-red-600'}>
                        {user.isActive ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditUser(user)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
