import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Search, Ship, Hotel, Star, ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-bg.jpg";
import BoatCard from "@/components/BoatCard";
import ResortCard from "@/components/ResortCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { boats, resorts } from "@/data/listings";

const Index = () => {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
          <img src={heroImage} alt="Beautiful boats on a serene lake at sunset" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-hero" />
          <div className="relative z-10 container mx-auto px-4 text-center space-y-6 animate-fade-up">
            <span className="inline-block bg-primary/20 backdrop-blur-sm text-primary-foreground text-sm font-medium px-4 py-1.5 rounded-full border border-primary-foreground/20">
              ✨ Book Boats & Resorts in One Place
            </span>
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-tight max-w-4xl mx-auto">
              Discover the Magic of the <span className="text-gradient-warm">Lakeside</span>
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto">
              Explore stunning boat rides and handpicked lakeside resorts. Book your perfect getaway in minutes.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button variant="hero" size="xl" asChild>
                <Link to="/boats"><Ship className="h-5 w-5" /> Explore Boats</Link>
              </Button>
              <Button variant="ocean" size="xl" asChild>
                <Link to="/resorts"><Hotel className="h-5 w-5" /> Browse Resorts</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-12 bg-card border-b border-border">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                { label: "Happy Tourists", value: "10,000+" },
                { label: "Boat Rides", value: "50+" },
                { label: "Partner Resorts", value: "25+" },
                { label: "Average Rating", value: "4.8 ⭐" },
              ].map((s) => (
                <div key={s.label}>
                  <p className="font-display text-2xl md:text-3xl font-bold text-foreground">{s.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Boats */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="flex items-end justify-between mb-10">
              <div>
                <span className="text-sm font-semibold text-primary uppercase tracking-wider">Popular Rides</span>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2">Featured Boat Rides</h2>
              </div>
              <Button variant="ghost" asChild className="hidden md:flex">
                <Link to="/boats">View All <ArrowRight className="h-4 w-4" /></Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {boats.map((boat) => (
                <BoatCard key={boat.id} boat={boat} />
              ))}
            </div>
            <div className="mt-8 text-center md:hidden">
              <Button variant="hero" asChild>
                <Link to="/boats">View All Boats <ArrowRight className="h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Featured Resorts */}
        <section className="py-16 md:py-24 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="flex items-end justify-between mb-10">
              <div>
                <span className="text-sm font-semibold text-secondary uppercase tracking-wider">Top Stays</span>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2">Handpicked Resorts</h2>
              </div>
              <Button variant="ghost" asChild className="hidden md:flex">
                <Link to="/resorts">View All <ArrowRight className="h-4 w-4" /></Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resorts.map((resort) => (
                <ResortCard key={resort.id} resort={resort} />
              ))}
            </div>
            <div className="mt-8 text-center md:hidden">
              <Button variant="ocean" asChild>
                <Link to="/resorts">View All Resorts <ArrowRight className="h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">Simple Process</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2 mb-12">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                { step: "1", icon: <Search className="h-8 w-8" />, title: "Browse & Choose", desc: "Explore our curated collection of boats and resorts" },
                { step: "2", icon: <Star className="h-8 w-8" />, title: "Select & Book", desc: "Pick your dates, confirm details, and pay securely" },
                { step: "3", icon: <Ship className="h-8 w-8" />, title: "Enjoy Your Trip", desc: "Get instant confirmation and enjoy your experience" },
              ].map((item) => (
                <div key={item.step} className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-warm flex items-center justify-center text-primary-foreground shadow-lg">
                    {item.icon}
                  </div>
                  <h3 className="font-display text-xl font-semibold text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-24 bg-gradient-warm">
          <div className="container mx-auto px-4 text-center space-y-6">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground">Ready for Your Next Adventure?</h2>
            <p className="text-primary-foreground/80 max-w-xl mx-auto">Book your perfect lakeside escape today. From thrilling boat rides to luxurious resort stays — we've got you covered.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="outline" size="xl" className="bg-primary-foreground text-foreground border-none hover:bg-primary-foreground/90" asChild>
                <Link to="/boats">Explore Boats</Link>
              </Button>
              <Button variant="outline" size="xl" className="bg-transparent text-primary-foreground border-primary-foreground/40 hover:bg-primary-foreground/10" asChild>
                <Link to="/resorts">Find Resorts</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Index;
