import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Ship, Hotel, Menu, X, User } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isHome ? "bg-foreground/20 backdrop-blur-md" : "bg-card shadow-card"}`}>
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2">
          <Ship className={`h-7 w-7 ${isHome ? "text-primary-foreground" : "text-primary"}`} />
          <span className={`font-display text-xl font-bold ${isHome ? "text-primary-foreground" : "text-foreground"}`}>
            LakeEscape
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/boats" className={`text-sm font-medium transition-colors hover:text-primary ${isHome ? "text-primary-foreground/80 hover:text-primary-foreground" : "text-muted-foreground"}`}>
            <span className="flex items-center gap-1"><Ship className="h-4 w-4" /> Boat Rides</span>
          </Link>
          <Link to="/resorts" className={`text-sm font-medium transition-colors hover:text-primary ${isHome ? "text-primary-foreground/80 hover:text-primary-foreground" : "text-muted-foreground"}`}>
            <span className="flex items-center gap-1"><Hotel className="h-4 w-4" /> Resorts</span>
          </Link>
          <Button variant={isHome ? "hero" : "default"} size="sm" asChild>
            <Link to="/login"><User className="h-4 w-4" /> Login</Link>
          </Button>
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setOpen(!open)} className="md:hidden">
          {open ? <X className={`h-6 w-6 ${isHome ? "text-primary-foreground" : "text-foreground"}`} /> : <Menu className={`h-6 w-6 ${isHome ? "text-primary-foreground" : "text-foreground"}`} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-card border-t border-border p-4 space-y-3 animate-fade-up">
          <Link to="/boats" onClick={() => setOpen(false)} className="block text-sm font-medium text-foreground py-2">🚤 Boat Rides</Link>
          <Link to="/resorts" onClick={() => setOpen(false)} className="block text-sm font-medium text-foreground py-2">🏨 Resorts & Hotels</Link>
          <Button variant="hero" size="sm" className="w-full" asChild>
            <Link to="/login" onClick={() => setOpen(false)}><User className="h-4 w-4" /> Login</Link>
          </Button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
