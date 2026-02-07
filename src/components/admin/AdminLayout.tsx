import { Outlet } from 'react-router-dom';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AdminSidebar } from './AdminSidebar';

export function AdminLayout() {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className="flex h-14 items-center border-b px-6">
          <SidebarTrigger />
        </header>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
