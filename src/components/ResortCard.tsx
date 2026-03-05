import type { Resort } from "@/types";
import { Star, MapPin, Wifi, UtensilsCrossed, Car, Waves } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const facilityIcons: Record<string, React.ReactNode> = {
  "Free WiFi": <Wifi className="h-3.5 w-3.5" />,
  "Restaurant": <UtensilsCrossed className="h-3.5 w-3.5" />,
  "Parking": <Car className="h-3.5 w-3.5" />,
  "Spa": <Waves className="h-3.5 w-3.5" />,
};

const ResortCard = ({ resort }: { resort: Resort }) => (
  <div className="group bg-card rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
    <div className="relative overflow-hidden aspect-[4/3]">
      <img src={resort.image} alt={resort.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
      <div className="absolute top-3 right-3 bg-card/90 backdrop-blur-sm rounded-lg px-2.5 py-1 text-xs font-semibold text-foreground">
        ₹{resort.pricePerNight.toLocaleString("en-IN")}/night
      </div>
    </div>
    <div className="p-4 space-y-3">
      <h3 className="font-display text-lg font-semibold text-foreground">{resort.name}</h3>
      <div className="flex items-center gap-1 text-xs">
        <MapPin className="h-3.5 w-3.5 text-primary" />
        <span className="text-muted-foreground">{resort.location}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {resort.facilities.slice(0, 4).map((f) => (
          <span key={f} className="flex items-center gap-1 text-xs bg-muted text-muted-foreground rounded-md px-2 py-1">
            {facilityIcons[f] || null} {f}
          </span>
        ))}
      </div>
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 fill-primary text-primary" />
          <span className="text-sm font-semibold text-foreground">{resort.rating}</span>
          <span className="text-xs text-muted-foreground">({resort.reviews})</span>
        </div>
        <Button variant="ocean" size="sm" asChild>
          <Link to={`/resorts/${resort.id}`}>View Details</Link>
        </Button>
      </div>
    </div>
  </div>
);

export default ResortCard;
