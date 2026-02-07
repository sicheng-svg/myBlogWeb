import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, FolderOpen, Tag, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

const navItems = [
  { title: '仪表盘', icon: LayoutDashboard, path: '/admin' },
  { title: '文章管理', icon: FileText, path: '/admin/posts' },
  { title: '分类管理', icon: FolderOpen, path: '/admin/categories' },
  { title: '标签管理', icon: Tag, path: '/admin/tags' },
  { title: '个人设置', icon: Settings, path: '/admin/settings' },
];

export function AdminSidebar() {
  const location = useLocation();
  const { signOut } = useAuth();

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  return (
    <Sidebar>
      <SidebarHeader className="border-b px-6 py-4">
        <Link to="/admin" className="text-lg font-semibold text-gray-900">
          XSC 管理后台
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>内容管理</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild isActive={isActive(item.path)}>
                    <Link to={item.path}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="/" target="_blank">
                <span className="text-sm text-gray-500">查看网站 ↗</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => signOut()}>
              <LogOut className="h-4 w-4" />
              <span>退出登录</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
