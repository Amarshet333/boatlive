import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useVendorCheck } from "@/hooks/useVendorCheck";
import VendorLayout from "@/components/vendor/VendorLayout";
import { Ship, Hotel, CalendarCheck, CheckCircle2 } from "lucide-react";

const VendorOverview = () => {
  const { vendorId } = useVendorCheck();
  const [stats, setStats] = useState({ boats: 0, resorts: 0, bookings: 0, approved: 0 });

  useEffect(() => {
    if (!vendorId) return;
    const load = async () => {
      const [boatsRes, resortsRes] = await Promise.all([
        supabase.from("boats").select("id, approved").eq("vendor_id", vendorId),
        supabase.from("resorts").select("id, approved").eq("vendor_id", vendorId),
      ]);
      const boats = boatsRes.data ?? [];
      const resorts = resortsRes.data ?? [];
      const allListingIds = [...boats.map(b => b.id), ...resorts.map(r => r.id)];
      
      let bookingsCount = 0;
      if (allListingIds.length > 0) {
        const boatIds = boats.map(b => b.id);
        const resortIds = resorts.map(r => r.id);
        const [boatBookings, resortBookings] = await Promise.all([
          boatIds.length > 0 ? supabase.from("bookings").select("id", { count: "exact" }).in("boat_id", boatIds) : { count: 0 },
          resortIds.length > 0 ? supabase.from("bookings").select("id", { count: "exact" }).in("resort_id", resortIds) : { count: 0 },
        ]);
        bookingsCount = (boatBookings.count ?? 0) + (resortBookings.count ?? 0);
      }

      setStats({
        boats: boats.length,
        resorts: resorts.length,
        bookings: bookingsCount,
        approved: boats.filter(b => b.approved).length + resorts.filter(r => r.approved).length,
      });
    };
    load();
  }, [vendorId]);

  const cards = [
    { label: "My Boats", value: stats.boats, icon: Ship, color: "text-secondary" },
    { label: "My Resorts", value: stats.resorts, icon: Hotel, color: "text-primary" },
    { label: "Total Bookings", value: stats.bookings, icon: CalendarCheck, color: "text-accent" },
    { label: "Approved Listings", value: stats.approved, icon: CheckCircle2, color: "text-accent" },
  ];

  return (
    <VendorLayout>
      <h1 className="font-display text-2xl font-bold text-foreground mb-6">Dashboard Overview</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="bg-card rounded-xl shadow-card p-5 flex items-center gap-4">
            <div className={`h-12 w-12 rounded-lg bg-muted flex items-center justify-center ${c.color}`}>
              <c.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{c.value}</p>
              <p className="text-sm text-muted-foreground">{c.label}</p>
            </div>
          </div>
        ))}
      </div>
    </VendorLayout>
  );
};

export default VendorOverview;
