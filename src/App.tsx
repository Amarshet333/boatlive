import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import BoatsPage from "./pages/BoatsPage";
import ResortsPage from "./pages/ResortsPage";
import BoatDetailPage from "./pages/BoatDetailPage";
import ResortDetailPage from "./pages/ResortDetailPage";
import LoginPage from "./pages/LoginPage";
import MyBookingsPage from "./pages/MyBookingsPage";
import AdminOverview from "./pages/admin/AdminOverview";
import AdminBoats from "./pages/admin/AdminBoats";
import AdminResorts from "./pages/admin/AdminResorts";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminRevenue from "./pages/admin/AdminRevenue";
import AdminPricing from "./pages/admin/AdminPricing";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Helmet>
            <title>CoastalEscape – Book Boat Rides & Resorts in Honnavar, Murdeshwar & Gokarna</title>
            <meta name="description" content="Book boat rides and beachside resorts in Honnavar, Murdeshwar & Gokarna. Speedboats, island hopping, coastal cruises & luxury resorts — all in one place." />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="canonical" href="https://boatlive.lovable.app" />
          </Helmet>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/boats" element={<BoatsPage />} />
              <Route path="/boats/:id" element={<BoatDetailPage />} />
              <Route path="/resorts" element={<ResortsPage />} />
              <Route path="/resorts/:id" element={<ResortDetailPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/my-bookings" element={<MyBookingsPage />} />
              <Route path="/admin" element={<AdminOverview />} />
              <Route path="/admin/boats" element={<AdminBoats />} />
              <Route path="/admin/resorts" element={<AdminResorts />} />
              <Route path="/admin/bookings" element={<AdminBookings />} />
              <Route path="/admin/revenue" element={<AdminRevenue />} />
              <Route path="/admin/pricing" element={<AdminPricing />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
