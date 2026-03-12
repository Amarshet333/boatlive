import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { IndianRupee, TrendingUp, CreditCard, CalendarCheck } from "lucide-react";

interface PaymentRow {
  id: string;
  total_amount: number;
  service_fee: number;
  payment_status: string;
  status: string;
  booking_type: string;
  created_at: string;
  boats: { name: string } | null;
  resorts: { name: string } | null;
}

const AdminRevenue = () => {
  const [payments, setPayments] = useState<PaymentRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("bookings")
        .select("id, total_amount, service_fee, payment_status, status, booking_type, created_at, boats(name), resorts(name)")
        .order("created_at", { ascending: false });
      setPayments((data as any) ?? []);
      setLoading(false);
    };
    fetch();
  }, []);

  const totalRevenue = payments.reduce((s, p) => s + Number(p.total_amount), 0);
  const totalFees = payments.reduce((s, p) => s + Number(p.service_fee), 0);
  const paidCount = payments.filter((p) => p.payment_status === "paid").length;

  const cards = [
    { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString("en-IN")}`, icon: IndianRupee },
    { label: "Service Fees", value: `₹${totalFees.toLocaleString("en-IN")}`, icon: TrendingUp },
    { label: "Paid Bookings", value: paidCount, icon: CreditCard },
    { label: "Total Transactions", value: payments.length, icon: CalendarCheck },
  ];

  return (
    <AdminLayout>
      <h1 className="font-display text-2xl font-bold text-foreground mb-6">Revenue & Payments</h1>
      {loading ? (
        <div className="flex justify-center py-12"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {cards.map((c) => (
              <div key={c.label} className="bg-card rounded-xl shadow-card p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-primary"><c.icon className="h-6 w-6" /></div>
                <div>
                  <p className="text-sm text-muted-foreground">{c.label}</p>
                  <p className="text-xl font-bold text-foreground">{c.value}</p>
                </div>
              </div>
            ))}
          </div>

          <h2 className="font-display text-lg font-semibold text-foreground mb-3">Payment History</h2>
          {payments.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No payments yet.</p>
          ) : (
            <div className="bg-card rounded-xl shadow-card overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border text-left">
                  <th className="p-3 font-medium text-muted-foreground">Date</th>
                  <th className="p-3 font-medium text-muted-foreground">Listing</th>
                  <th className="p-3 font-medium text-muted-foreground">Type</th>
                  <th className="p-3 font-medium text-muted-foreground">Amount</th>
                  <th className="p-3 font-medium text-muted-foreground">Fee</th>
                  <th className="p-3 font-medium text-muted-foreground">Payment</th>
                  <th className="p-3 font-medium text-muted-foreground">Booking</th>
                </tr></thead>
                <tbody>
                  {payments.map((p) => (
                    <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                      <td className="p-3 text-muted-foreground">{new Date(p.created_at).toLocaleDateString("en-IN")}</td>
                      <td className="p-3 text-foreground">{p.boats?.name ?? p.resorts?.name ?? "—"}</td>
                      <td className="p-3 capitalize text-foreground">{p.booking_type}</td>
                      <td className="p-3 font-medium text-foreground">₹{Number(p.total_amount).toLocaleString("en-IN")}</td>
                      <td className="p-3 text-muted-foreground">₹{Number(p.service_fee).toLocaleString("en-IN")}</td>
                      <td className="p-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${p.payment_status === "paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{p.payment_status}</span>
                      </td>
                      <td className="p-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${p.status === "confirmed" ? "bg-green-100 text-green-700" : p.status === "cancelled" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>{p.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </AdminLayout>
  );
};

export default AdminRevenue;
