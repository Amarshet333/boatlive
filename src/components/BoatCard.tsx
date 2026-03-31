import { Star, Users, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import type { Tables } from "@/integrations/supabase/types";

type Boat = Tables<"boats">;

const BoatCard = ({ boat }: { boat: Boat }) => (
  <div className="group bg-card rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
    <div className="relative overflow-hidden aspect-[4/3]">
      <img
        src={boat.image_url || "/placeholder.svg"}
        alt={boat.name}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
      />
      <div className="absolute top-3 right-3 bg-card/90 backdrop-blur-sm rounded-lg px-2.5 py-1 text-xs font-semibold text-foreground">
        ₹{Number(boat.price).toLocaleString("en-IN")}
      </div>
    </div>
    <div className="p-4 space-y-3">
      <h3 className="font-display text-lg font-semibold text-foreground">{boat.name}</h3>
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{boat.capacity} people</span>
        <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{boat.duration}</span>
      </div>
      <div className="flex items-center gap-1 text-xs">
        <MapPin className="h-3.5 w-3.5 text-primary" />
        <span className="text-muted-foreground">{boat.location || "Location TBD"}</span>
      </div>
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 fill-primary text-primary" />
          <span className="text-sm font-semibold text-foreground">{boat.rating ?? 0}</span>
          <span className="text-xs text-muted-foreground">({boat.reviews_count ?? 0})</span>
        </div>
        <Button variant="hero" size="sm" asChild>
          <Link to={`/boats/${boat.id}`}>Book Now</Link>
        </Button>
      </div>
    </div>
  </div>
);

export default BoatCard;
