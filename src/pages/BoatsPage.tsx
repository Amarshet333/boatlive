import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BoatCard from "@/components/BoatCard";
import { boats } from "@/data/listings";
import { Ship } from "lucide-react";

const BoatsPage = () => (
  <>
    <Navbar />
    <main className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="mb-10">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider flex items-center gap-1"><Ship className="h-4 w-4" /> Boat Rides</span>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2">Explore All Boat Rides</h1>
          <p className="text-muted-foreground mt-2 max-w-xl">Choose from traditional shikaras, luxury speedboats, and heritage cruises. Find the perfect ride for your group.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {boats.map((boat) => (
            <BoatCard key={boat.id} boat={boat} />
          ))}
        </div>
      </div>
    </main>
    <Footer />
  </>
);

export default BoatsPage;
