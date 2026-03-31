import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Ship, Hotel, Menu, X, User, Calendar, LogOut, LayoutDashboard, Store } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";
  const { user, signOut } = useAuth();
  const [isVendor, setIsVendor] = useState(false);

  useEffect(() => {
    if (!user) { setIsVendor(false); return; }
    supabase.from("vendors").select("id, approved").eq("user_id", user.id).maybeSingle()
      .then(({ data }) => setIsVendor(!!data?.approved));
  }, [user]);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isHome ? "bg-foreground/20 backdrop-blur-md" : "bg-card shadow-card"}`}>
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2">
          <Ship className={`h-7 w-7 ${isHome ? "text-primary-foreground" : "text-primary"}`} />
          <span className={`font-display text-xl font-bold ${isHome ? "text-primary-foreground" : "text-foreground"}`}>
            LakeEscape
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link to="/boats" className={`text-sm font-medium transition-colors hover:text-primary ${isHome ? "text-primary-foreground/80 hover:text-primary-foreground" : "text-muted-foreground"}`}>
            <span className="flex items-center gap-1"><Ship className="h-4 w-4" /> Boat Rides</span>
          </Link>
          <Link to="/resorts" className={`text-sm font-medium transition-colors hover:text-primary ${isHome ? "text-primary-foreground/80 hover:text-primary-foreground" : "text-muted-foreground"}`}>
            <span className="flex items-center gap-1"><Hotel className="h-4 w-4" /> Resorts</span>
          </Link>
          {user ? (
            <>
              <Link to="/my-bookings" className={`text-sm font-medium transition-colors hover:text-primary ${isHome ? "text-primary-foreground/80 hover:text-primary-foreground" : "text-muted-foreground"}`}>
                <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> My Bookings</span>
              </Link>
              {isVendor ? (
                <Link to="/vendor" className={`text-sm font-medium transition-colors hover:text-primary ${isHome ? "text-primary-foreground/80 hover:text-primary-foreground" : "text-muted-foreground"}`}>
                  <span className="flex items-center gap-1"><LayoutDashboard className="h-4 w-4" /> Vendor Panel</span>
                </Link>
              ) : (
                <Link to="/become-vendor" className={`text-sm font-medium transition-colors hover:text-primary ${isHome ? "text-primary-foreground/80 hover:text-primary-foreground" : "text-muted-foreground"}`}>
                  <span className="flex items-center gap-1"><Store className="h-4 w-4" /> Become a Vendor</span>
                </Link>
              )}
              <Button variant={isHome ? "hero" : "default"} size="sm" onClick={() => signOut()}>
                <LogOut className="h-4 w-4" /> Sign Out
              </Button>
            </>
          ) : (
            <Button variant={isHome ? "hero" : "default"} size="sm" asChild>
              <Link to="/login"><User className="h-4 w-4" /> Login</Link>
            </Button>
          )}
        </div>

        <button onClick={() => setOpen(!open)} className="md:hidden">
          {open ? <X className={`h-6 w-6 ${isHome ? "text-primary-foreground" : "text-foreground"}`} /> : <Menu className={`h-6 w-6 ${isHome ? "text-primary-foreground" : "text-foreground"}`} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-card border-t border-border p-4 space-y-3 animate-fade-up">
          <Link to="/boats" onClick={() => setOpen(false)} className="block text-sm font-medium text-foreground py-2">🚤 Boat Rides</Link>
          <Link to="/resorts" onClick={() => setOpen(false)} className="block text-sm font-medium text-foreground py-2">🏨 Resorts & Hotels</Link>
          {user ? (
            <>
              <Link to="/my-bookings" onClick={() => setOpen(false)} className="block text-sm font-medium text-foreground py-2">📋 My Bookings</Link>
              {isVendor ? (
                <Link to="/vendor" onClick={() => setOpen(false)} className="block text-sm font-medium text-foreground py-2">📊 Vendor Panel</Link>
              ) : (
                <Link to="/become-vendor" onClick={() => setOpen(false)} className="block text-sm font-medium text-foreground py-2">🏪 Become a Vendor</Link>
              )}
              <Button variant="hero" size="sm" className="w-full" onClick={() => { signOut(); setOpen(false); }}>
                <LogOut className="h-4 w-4" /> Sign Out
              </Button>
            </>
          ) : (
            <Button variant="hero" size="sm" className="w-full" asChild>
              <Link to="/login" onClick={() => setOpen(false)}><User className="h-4 w-4" /> Login</Link>
            </Button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
