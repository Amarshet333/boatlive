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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Helmet>
            <title>LakeEscape – Book Boat Rides & Lakeside Resorts</title>
            <meta name="description" content="Book boat rides and lakeside resorts at India's most scenic lake destinations. Shikara rides, speedboats, luxury resorts — all in one place." />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="canonical" href="https://lakeescape.com" />
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
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
