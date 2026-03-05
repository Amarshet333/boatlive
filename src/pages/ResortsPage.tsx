import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ResortCard from "@/components/ResortCard";
import { resorts } from "@/data/listings";
import { Hotel } from "lucide-react";

const ResortsPage = () => (
  <>
    <Navbar />
    <main className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="mb-10">
          <span className="text-sm font-semibold text-secondary uppercase tracking-wider flex items-center gap-1"><Hotel className="h-4 w-4" /> Resorts & Hotels</span>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2">Stay at the Best Resorts</h1>
          <p className="text-muted-foreground mt-2 max-w-xl">Discover lakeside lodges, mountain retreats, and valley resorts. Find your perfect home away from home.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resorts.map((resort) => (
            <ResortCard key={resort.id} resort={resort} />
          ))}
        </div>
      </div>
    </main>
    <Footer />
  </>
);

export default ResortsPage;
