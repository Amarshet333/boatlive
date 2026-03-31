import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Star, Users, Clock, MapPin, ArrowLeft, Calendar, Shield } from "lucide-react";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";

type Boat = Tables<"boats">;

const TIME_SLOTS = ["6:00 AM", "8:00 AM", "10:00 AM", "12:00 PM", "2:00 PM", "4:00 PM", "6:00 PM"];

const BoatDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [boat, setBoat] = useState<Boat | null>(null);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [guests, setGuests] = useState(2);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    const fetchBoat = async () => {
      if (!id) return;
      const { data } = await supabase.from("boats").select("*").eq("id", id).maybeSingle();
      setBoat(data);
      setLoading(false);
    };
    fetchBoat();
  }, [id]);

  // Fetch already-booked time slots for selected date
  useEffect(() => {
    if (!date || !id) { setBookedSlots([]); return; }
    const fetchSlots = async () => {
      const { data } = await supabase
        .from("bookings")
        .select("booking_time")
        .eq("boat_id", id)
        .eq("booking_date", date)
        .in("status", ["pending", "confirmed"]);
      setBookedSlots((data ?? []).map((b) => b.booking_time).filter(Boolean) as string[]);
    };
    fetchSlots();
  }, [date, id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="pt-24 pb-16 flex justify-center"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></main>
        <Footer />
      </>
    );
  }

  if (!boat) {
    return (
      <>
        <Navbar />
        <main className="pt-24 pb-16 container mx-auto px-4 text-center">
          <h1 className="font-display text-2xl font-bold text-foreground">Boat not found</h1>
          <Button variant="hero" className="mt-4" asChild><Link to="/boats">Back to Boats</Link></Button>
        </main>
        <Footer />
      </>
    );
  }

  const price = Number(boat.price);
  const serviceFee = Math.round(price * 0.05);
  const total = price + serviceFee;

  const handleBook = async () => {
    if (!user) { toast.error("Please login to book"); navigate("/login"); return; }
    if (!date) { toast.error("Please select a date"); return; }
    if (!time) { toast.error("Please select a time slot"); return; }

    setBooking(true);
    const { error } = await supabase.from("bookings").insert({
      user_id: user.id,
      boat_id: boat.id,
      booking_type: "boat",
      booking_date: date,
      booking_time: time,
      guests,
      total_amount: total,
      service_fee: serviceFee,
    });
    setBooking(false);

    if (error) {
      toast.error("Booking failed: " + error.message);
    } else {
      toast.success("Boat booked successfully! Check My Bookings for details.");
      navigate("/my-bookings");
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <>
      <Navbar />
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          <Link to="/boats" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4" /> Back to Boats
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left - Details */}
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-xl overflow-hidden aspect-video">
                <img src={boat.image_url || "/placeholder.svg"} alt={boat.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <h1 className="font-display text-3xl font-bold text-foreground">{boat.name}</h1>
                <div className="flex items-center gap-4 mt-2">
                  <span className="flex items-center gap-1 text-sm"><Star className="h-4 w-4 fill-primary text-primary" />{boat.rating ?? 0} ({boat.reviews_count ?? 0} reviews)</span>
                  <span className="flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="h-4 w-4" />{boat.location}</span>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed">{boat.description}</p>
              {boat.features && boat.features.length > 0 && (
                <div>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-3">What's Included</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {boat.features.map((f) => (
                      <div key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Shield className="h-4 w-4 text-accent" /> {f}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right - Booking Card */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-xl shadow-card p-6 space-y-5 sticky top-24">
                <div className="flex items-baseline justify-between">
                  <span className="font-display text-2xl font-bold text-foreground">₹{price.toLocaleString("en-IN")}</span>
                  <span className="text-sm text-muted-foreground">per ride</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><Users className="h-4 w-4" />Up to {boat.capacity}</span>
                  <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{boat.duration}</span>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-1">Date</label>
                    <input type="date" min={today} value={date} onChange={(e) => { setDate(e.target.value); setTime(""); }} className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-1">Time Slot</label>
                    {!date ? (
                      <p className="text-xs text-muted-foreground">Select a date first</p>
                    ) : (
                      <div className="grid grid-cols-3 gap-2">
                        {TIME_SLOTS.map((slot) => {
                          const isBooked = bookedSlots.includes(slot);
                          const isSelected = time === slot;
                          return (
                            <button
                              key={slot}
                              disabled={isBooked}
                              onClick={() => setTime(slot)}
                              className={`px-2 py-2 rounded-lg text-xs font-medium border transition-colors ${
                                isBooked
                                  ? "bg-muted text-muted-foreground border-border cursor-not-allowed line-through"
                                  : isSelected
                                  ? "bg-primary text-primary-foreground border-primary"
                                  : "bg-background text-foreground border-input hover:border-primary"
                              }`}
                            >
                              {slot}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-1">Guests</label>
                    <select value={guests} onChange={(e) => setGuests(Number(e.target.value))} className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm">
                      {Array.from({ length: boat.capacity }, (_, i) => i + 1).map((n) => (
                        <option key={n} value={n}>{n} {n === 1 ? "guest" : "guests"}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="border-t border-border pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Ride fare</span>
                    <span className="text-foreground font-medium">₹{price.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Service fee</span>
                    <span className="text-foreground font-medium">₹{serviceFee.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold border-t border-border pt-2">
                    <span className="text-foreground">Total</span>
                    <span className="text-foreground">₹{total.toLocaleString("en-IN")}</span>
                  </div>
                </div>
                <Button variant="hero" size="lg" className="w-full" onClick={handleBook} disabled={booking}>
                  <Calendar className="h-4 w-4" /> {booking ? "Booking…" : "Book Now"}
                </Button>
                <p className="text-xs text-center text-muted-foreground">No charge until confirmed • Free cancellation</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default BoatDetailPage;
