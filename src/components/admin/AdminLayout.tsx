import { Navigate } from "react-router-dom";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import { AdminSidebar } from "./AdminSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin, loading } = useAdminCheck();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAdmin) return <Navigate to="/" replace />;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-muted/30">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center border-b border-border bg-card px-4 gap-3 shrink-0">
            <SidebarTrigger />
            <span className="font-display text-lg font-bold text-foreground">Admin Dashboard</span>
          </header>
          <main className="flex-1 p-4 md:p-6 overflow-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
