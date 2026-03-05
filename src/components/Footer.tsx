import { Ship } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="bg-foreground text-background">
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <Link to="/" className="flex items-center gap-2 mb-4">
            <Ship className="h-6 w-6 text-primary" />
            <span className="font-display text-lg font-bold">LakeEscape</span>
          </Link>
          <p className="text-sm opacity-70">Your one-stop destination for boat rides and lakeside resort bookings. Explore, book, and enjoy!</p>
        </div>
        <div>
          <h4 className="font-display font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm opacity-70">
            <li><Link to="/boats" className="hover:opacity-100 transition-opacity">Boat Rides</Link></li>
            <li><Link to="/resorts" className="hover:opacity-100 transition-opacity">Resorts & Hotels</Link></li>
            <li><Link to="/login" className="hover:opacity-100 transition-opacity">My Bookings</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display font-semibold mb-3">Support</h4>
          <ul className="space-y-2 text-sm opacity-70">
            <li>Help Center</li>
            <li>Cancellation Policy</li>
            <li>Terms of Service</li>
            <li>Privacy Policy</li>
          </ul>
        </div>
        <div>
          <h4 className="font-display font-semibold mb-3">Contact</h4>
          <ul className="space-y-2 text-sm opacity-70">
            <li>📧 hello@lakeescape.com</li>
            <li>📞 +91 98765 43210</li>
            <li>📍 Lake District, India</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-background/20 mt-8 pt-6 text-center text-sm opacity-50">
        © 2026 LakeEscape. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
