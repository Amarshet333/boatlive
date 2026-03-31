import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ResortCard from "@/components/ResortCard";
import { supabase } from "@/integrations/supabase/client";
import { Hotel } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Resort = Tables<"resorts">;

const ResortsPage = () => {
  const [resorts, setResorts] = useState<Resort[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("resorts").select("*").eq("is_active", true).eq("approved", true).order("created_at", { ascending: false }).then(({ data }) => { setResorts(data ?? []); setLoading(false); });
  }, []);

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-10">
            <span className="text-sm font-semibold text-secondary uppercase tracking-wider flex items-center gap-1"><Hotel className="h-4 w-4" /> Resorts & Hotels</span>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2">Stay at the Best Resorts</h1>
            <p className="text-muted-foreground mt-2 max-w-xl">Discover lakeside lodges, mountain retreats, and valley resorts. Find your perfect home away from home.</p>
          </div>
          {loading ? (
            <div className="flex justify-center py-12"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></div>
          ) : resorts.length === 0 ? (
            <p className="text-muted-foreground text-center py-12">No resorts available right now.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resorts.map((resort) => (
                <ResortCard key={resort.id} resort={resort} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ResortsPage;
