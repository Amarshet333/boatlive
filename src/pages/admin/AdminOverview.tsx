import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Ship, Hotel, CalendarCheck, IndianRupee } from "lucide-react";

interface Stats {
  boats: number;
  resorts: number;
  bookings: number;
  revenue: number;
}

const AdminOverview = () => {
  const [stats, setStats] = useState<Stats>({ boats: 0, resorts: 0, bookings: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const [boatsRes, resortsRes, bookingsRes] = await Promise.all([
        supabase.from("boats").select("id", { count: "exact", head: true }),
        supabase.from("resorts").select("id", { count: "exact", head: true }),
        supabase.from("bookings").select("total_amount"),
      ]);
      const revenue = (bookingsRes.data ?? []).reduce((s, b) => s + Number(b.total_amount), 0);
      setStats({
        boats: boatsRes.count ?? 0,
        resorts: resortsRes.count ?? 0,
        bookings: (bookingsRes.data ?? []).length,
        revenue,
      });
      setLoading(false);
    };
    fetch();
  }, []);

  const cards = [
    { label: "Total Boats", value: stats.boats, icon: Ship, color: "text-primary" },
    { label: "Total Resorts", value: stats.resorts, icon: Hotel, color: "text-secondary" },
    { label: "Total Bookings", value: stats.bookings, icon: CalendarCheck, color: "text-accent" },
    { label: "Total Revenue", value: `₹${stats.revenue.toLocaleString("en-IN")}`, icon: IndianRupee, color: "text-primary" },
  ];

  return (
    <AdminLayout>
      <h1 className="font-display text-2xl font-bold text-foreground mb-6">Dashboard Overview</h1>
      {loading ? (
        <div className="flex justify-center py-12"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((c) => (
            <div key={c.label} className="bg-card rounded-xl shadow-card p-5 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl bg-muted flex items-center justify-center ${c.color}`}>
                <c.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{c.label}</p>
                <p className="text-xl font-bold text-foreground">{c.value}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminOverview;
