import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BoatCard from "@/components/BoatCard";
import { supabase } from "@/integrations/supabase/client";
import { Ship } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Boat = Tables<"boats">;

const BoatsPage = () => {
  const [boats, setBoats] = useState<Boat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("boats")
        .select("*")
        .eq("is_active", true)
        .eq("approved", true)
        .order("created_at", { ascending: false });
      setBoats(data ?? []);
      setLoading(false);
    };
    fetch();
  }, []);

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-10">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider flex items-center gap-1"><Ship className="h-4 w-4" /> Boat Rides</span>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2">Explore All Boat Rides</h1>
            <p className="text-muted-foreground mt-2 max-w-xl">Choose from traditional shikaras, luxury speedboats, and heritage cruises. Find the perfect ride for your group.</p>
          </div>
          {loading ? (
            <div className="flex justify-center py-12"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></div>
          ) : boats.length === 0 ? (
            <p className="text-muted-foreground text-center py-12">No boats available right now. Check back soon!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {boats.map((boat) => (
                <BoatCard key={boat.id} boat={boat} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default BoatsPage;
