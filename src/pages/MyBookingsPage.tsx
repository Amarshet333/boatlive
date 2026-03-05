import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { User, Calendar, LogOut, Ship, Hotel } from "lucide-react";
import { toast } from "sonner";

const MyBookingsPage = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const { data: bookings, isLoading } = useQuery({
    queryKey: ["bookings", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*, boats(name, image_url), resorts(name, image_url)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user!.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out");
    navigate("/");
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  const upcoming = bookings?.filter((b) => b.status === "pending" || b.status === "confirmed") || [];
  const completed = bookings?.filter((b) => b.status === "completed") || [];
  const cancelled = bookings?.filter((b) => b.status === "cancelled") || [];

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Profile header */}
          <div className="bg-card rounded-xl shadow-card p-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-warm flex items-center justify-center text-primary-foreground">
                <User className="h-7 w-7" />
              </div>
              <div>
                <h1 className="font-display text-xl font-bold text-foreground">{profile?.full_name || "Traveler"}</h1>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4" /> Sign Out
            </Button>
          </div>

          {/* Bookings */}
          <h2 className="font-display text-2xl font-bold text-foreground mb-6">My Bookings</h2>

          {isLoading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : bookings?.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto" />
              <p className="text-muted-foreground">No bookings yet. Start exploring!</p>
              <div className="flex justify-center gap-3">
                <Button variant="hero" asChild><a href="/boats"><Ship className="h-4 w-4" /> Boats</a></Button>
                <Button variant="ocean" asChild><a href="/resorts"><Hotel className="h-4 w-4" /> Resorts</a></Button>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {[
                { title: "Upcoming", items: upcoming, color: "text-primary" },
                { title: "Completed", items: completed, color: "text-accent" },
                { title: "Cancelled", items: cancelled, color: "text-destructive" },
              ].map(({ title, items, color }) =>
                items.length > 0 ? (
                  <div key={title}>
                    <h3 className={`font-display text-lg font-semibold ${color} mb-3`}>{title} ({items.length})</h3>
                    <div className="grid gap-4">
                      {items.map((b) => (
                        <div key={b.id} className="bg-card rounded-lg shadow-card p-4 flex flex-col sm:flex-row gap-4 items-start">
                          <div className="flex-1">
                            <p className="font-semibold text-foreground">
                              {b.booking_type === "boat" ? b.boats?.name : b.resorts?.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {b.booking_type === "boat"
                                ? `${b.booking_date} at ${b.booking_time} • ${b.guests} guests`
                                : `${b.check_in} → ${b.check_out} • ${b.room_type}`}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">Booking #{b.id.slice(0, 8)}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-display font-bold text-foreground">₹{Number(b.total_amount).toLocaleString("en-IN")}</p>
                            <span className={`text-xs font-medium ${b.payment_status === "paid" ? "text-accent" : "text-primary"}`}>
                              {b.payment_status.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default MyBookingsPage;
