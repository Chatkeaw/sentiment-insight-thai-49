
import React from 'react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User, LogOut, Settings, Activity } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { USER_ROLES } from '@/types/auth';

export const UserProfile: React.FC = () => {
  const { state, logout } = useAuth();

  if (!state.user) return null;

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'destructive';
      case 'hr': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-auto px-3">
          <Avatar className="h-8 w-8 mr-2">
            <AvatarFallback className="bg-primary/10">
              {getInitials(state.user.fullName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start text-sm">
            <span className="font-medium">{state.user.fullName}</span>
            <Badge variant={getRoleBadgeVariant(state.user.role)} className="text-xs">
              {USER_ROLES[state.user.role]}
            </Badge>
          </div>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-64" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-2">
            <p className="text-sm font-medium leading-none">{state.user.fullName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {state.user.email}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {state.user.department}
            </p>
            <Badge variant={getRoleBadgeVariant(state.user.role)} className="w-fit">
              {USER_ROLES[state.user.role]}
            </Badge>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem>
          <User className="mr-2 h-4 w-4" />
          <span>โปรไฟล์</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem>
          <Activity className="mr-2 h-4 w-4" />
          <span>ประวัติการใช้งาน</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          <span>การตั้งค่า</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={logout} className="text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          <span>ออกจากระบบ</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
