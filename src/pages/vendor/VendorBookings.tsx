import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useVendorCheck } from "@/hooks/useVendorCheck";
import VendorLayout from "@/components/vendor/VendorLayout";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface BookingRow {
  id: string;
  booking_type: string;
  status: string;
  payment_status: string;
  total_amount: number;
  service_fee: number;
  guests: number;
  booking_date: string | null;
  check_in: string | null;
  check_out: string | null;
  created_at: string;
  boats: { name: string } | null;
  resorts: { name: string } | null;
}

const VendorBookings = () => {
  const { vendorId } = useVendorCheck();
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "confirmed" | "cancelled">("all");

  const fetchBookings = async () => {
    if (!vendorId) return;
    // Get vendor's boat and resort IDs
    const [boatsRes, resortsRes] = await Promise.all([
      supabase.from("boats").select("id").eq("vendor_id", vendorId),
      supabase.from("resorts").select("id").eq("vendor_id", vendorId),
    ]);
    const boatIds = (boatsRes.data ?? []).map(b => b.id);
    const resortIds = (resortsRes.data ?? []).map(r => r.id);

    const allBookings: BookingRow[] = [];

    if (boatIds.length > 0) {
      const { data } = await supabase
        .from("bookings")
        .select("*, boats(name), resorts(name)")
        .in("boat_id", boatIds)
        .order("created_at", { ascending: false });
      if (data) allBookings.push(...(data as any));
    }
    if (resortIds.length > 0) {
      const { data } = await supabase
        .from("bookings")
        .select("*, boats(name), resorts(name)")
        .in("resort_id", resortIds)
        .order("created_at", { ascending: false });
      if (data) allBookings.push(...(data as any));
    }

    // Deduplicate and sort
    const unique = Array.from(new Map(allBookings.map(b => [b.id, b])).values());
    unique.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    setBookings(unique);
    setLoading(false);
  };

  useEffect(() => { fetchBookings(); }, [vendorId]);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success(`Booking ${status}`); fetchBookings(); }
  };

  const filtered = filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  // Show amount without service fee (vendor doesn't see commission)
  const vendorAmount = (b: BookingRow) => Number(b.total_amount) - Number(b.service_fee);

  return (
    <VendorLayout>
      <h1 className="font-display text-2xl font-bold text-foreground mb-6">Bookings</h1>
      <div className="flex gap-2 mb-4">
        {(["all", "pending", "confirmed", "cancelled"] as const).map((f) => (
          <Button key={f} variant={filter === f ? "default" : "outline"} size="sm" onClick={() => setFilter(f)} className="capitalize">{f}</Button>
        ))}
      </div>
      {loading ? (
        <div className="flex justify-center py-12"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></div>
      ) : filtered.length === 0 ? (
        <p className="text-muted-foreground text-center py-12">No bookings found.</p>
      ) : (
        <div className="bg-card rounded-xl shadow-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border text-left">
              <th className="p-3 font-medium text-muted-foreground">Type</th>
              <th className="p-3 font-medium text-muted-foreground">Listing</th>
              <th className="p-3 font-medium text-muted-foreground">Date</th>
              <th className="p-3 font-medium text-muted-foreground">Guests</th>
              <th className="p-3 font-medium text-muted-foreground">Your Earnings</th>
              <th className="p-3 font-medium text-muted-foreground">Status</th>
              <th className="p-3 font-medium text-muted-foreground">Payment</th>
              <th className="p-3 font-medium text-muted-foreground">Actions</th>
            </tr></thead>
            <tbody>
              {filtered.map((b) => (
                <tr key={b.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="p-3 capitalize text-foreground">{b.booking_type}</td>
                  <td className="p-3 text-foreground">{b.boats?.name ?? b.resorts?.name ?? "—"}</td>
                  <td className="p-3 text-muted-foreground">{b.booking_date ?? b.check_in ?? "—"}</td>
                  <td className="p-3 text-foreground">{b.guests}</td>
                  <td className="p-3 text-foreground font-medium">₹{vendorAmount(b).toLocaleString("en-IN")}</td>
                  <td className="p-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      b.status === "confirmed" ? "bg-green-100 text-green-700" :
                      b.status === "cancelled" ? "bg-red-100 text-red-700" :
                      "bg-yellow-100 text-yellow-700"
                    }`}>{b.status}</span>
                  </td>
                  <td className="p-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${b.payment_status === "paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{b.payment_status}</span>
                  </td>
                  <td className="p-3 flex items-center gap-1">
                    {b.status === "pending" && (
                      <>
                        <Button variant="ghost" size="sm" className="text-green-600" onClick={() => updateStatus(b.id, "confirmed")}>Confirm</Button>
                        <Button variant="ghost" size="sm" className="text-destructive" onClick={() => updateStatus(b.id, "cancelled")}>Cancel</Button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </VendorLayout>
  );
};

export default VendorBookings;
