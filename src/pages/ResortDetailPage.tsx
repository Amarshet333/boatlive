import { useParams, Link } from "react-router-dom";
import { resorts } from "@/data/listings";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Star, MapPin, ArrowLeft, Calendar } from "lucide-react";
import { useState } from "react";

const ResortDetailPage = () => {
  const { id } = useParams();
  const resort = resorts.find((r) => r.id === id);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [roomType, setRoomType] = useState("");

  if (!resort) {
    return (
      <>
        <Navbar />
        <main className="pt-24 pb-16 container mx-auto px-4 text-center">
          <h1 className="font-display text-2xl font-bold text-foreground">Resort not found</h1>
          <Button variant="ocean" className="mt-4" asChild><Link to="/resorts">Back to Resorts</Link></Button>
        </main>
        <Footer />
      </>
    );
  }

  const nights = checkIn && checkOut ? Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000)) : 1;
  const subtotal = resort.pricePerNight * nights;
  const serviceFee = Math.round(subtotal * 0.08);

  return (
    <>
      <Navbar />
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          <Link to="/resorts" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4" /> Back to Resorts
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-xl overflow-hidden aspect-video">
                <img src={resort.image} alt={resort.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <h1 className="font-display text-3xl font-bold text-foreground">{resort.name}</h1>
                <div className="flex items-center gap-4 mt-2">
                  <span className="flex items-center gap-1 text-sm"><Star className="h-4 w-4 fill-primary text-primary" />{resort.rating} ({resort.reviews} reviews)</span>
                  <span className="flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="h-4 w-4" />{resort.location}</span>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed">{resort.description}</p>
              <div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-3">Facilities</h3>
                <div className="flex flex-wrap gap-2">
                  {resort.facilities.map((f) => (
                    <span key={f} className="bg-muted text-muted-foreground text-sm px-3 py-1.5 rounded-lg">{f}</span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-3">Room Types</h3>
                <div className="space-y-2">
                  {resort.roomTypes.map((r) => (
                    <div key={r} className="flex items-center justify-between bg-muted/50 rounded-lg p-3">
                      <span className="text-sm font-medium text-foreground">{r}</span>
                      <span className="text-sm text-muted-foreground">Available</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-card rounded-xl shadow-card p-6 space-y-5 sticky top-24">
                <div className="flex items-baseline justify-between">
                  <span className="font-display text-2xl font-bold text-foreground">₹{resort.pricePerNight.toLocaleString("en-IN")}</span>
                  <span className="text-sm text-muted-foreground">per night</span>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-1">Check-in</label>
                    <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-1">Check-out</label>
                    <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-1">Room Type</label>
                    <select value={roomType} onChange={(e) => setRoomType(e.target.value)} className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm">
                      <option value="">Select room</option>
                      {resort.roomTypes.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="border-t border-border pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">₹{resort.pricePerNight.toLocaleString("en-IN")} × {nights} night{nights > 1 ? "s" : ""}</span>
                    <span className="text-foreground font-medium">₹{subtotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Service fee</span>
                    <span className="text-foreground font-medium">₹{serviceFee.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold border-t border-border pt-2">
                    <span className="text-foreground">Total</span>
                    <span className="text-foreground">₹{(subtotal + serviceFee).toLocaleString("en-IN")}</span>
                  </div>
                </div>
                <Button variant="ocean" size="lg" className="w-full">
                  <Calendar className="h-4 w-4" /> Reserve Now
                </Button>
                <p className="text-xs text-center text-muted-foreground">Free cancellation within 24 hours</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ResortDetailPage;
