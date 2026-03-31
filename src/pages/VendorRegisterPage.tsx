import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Store, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

const vendorSchema = z.object({
  business_name: z.string().trim().min(2, "Business name must be at least 2 characters").max(100),
  email: z.string().trim().email("Invalid email"),
  phone: z.string().trim().min(10, "Phone must be at least 10 digits").max(15),
  description: z.string().trim().max(500).optional(),
});

const VendorRegisterPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ business_name: "", email: "", phone: "", description: "" });
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async () => {
    if (!user) { toast.error("Please login first"); navigate("/login"); return; }

    const result = vendorSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((i) => { fieldErrors[i.path[0] as string] = i.message; });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setSaving(true);

    // Check if already applied
    const { data: existing } = await supabase.from("vendors").select("id").eq("user_id", user.id).maybeSingle();
    if (existing) { toast.info("You have already applied as a vendor"); setSaving(false); return; }

    const { error } = await supabase.from("vendors").insert({
      user_id: user.id,
      business_name: result.data.business_name,
      email: result.data.email,
      phone: result.data.phone,
    });
    setSaving(false);

    if (error) {
      toast.error("Application failed: " + error.message);
    } else {
      setSubmitted(true);
      toast.success("Application submitted!");
    }
  };

  if (submitted) {
    return (
      <>
        <Navbar />
        <main className="pt-24 pb-16 container mx-auto px-4 max-w-md text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto">
            <CheckCircle className="h-8 w-8 text-accent" />
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground">Application Submitted!</h1>
          <p className="text-muted-foreground">Your vendor application is under review. You'll get access to the Vendor Dashboard once approved by our team.</p>
          <Button variant="hero" onClick={() => navigate("/")}>Back to Home</Button>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-lg">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Store className="h-7 w-7 text-primary" />
            </div>
            <h1 className="font-display text-3xl font-bold text-foreground">Become a Vendor</h1>
            <p className="text-muted-foreground mt-2">List your boats or resorts and reach thousands of tourists visiting Honnavar, Murdeshwar & Gokarna.</p>
          </div>

          <div className="bg-card rounded-xl shadow-card p-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground block mb-1">Business Name *</label>
              <Input value={form.business_name} onChange={(e) => setForm({ ...form, business_name: e.target.value })} placeholder="e.g. Shree Boats Honnavar" />
              {errors.business_name && <p className="text-xs text-destructive mt-1">{errors.business_name}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-1">Email *</label>
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="your@email.com" />
              {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-1">Phone *</label>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="9876543210" />
              {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-1">About Your Business</label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Tell us about your boats or resorts..." rows={3} />
            </div>
            <Button variant="hero" size="lg" className="w-full" onClick={handleSubmit} disabled={saving}>
              {saving ? "Submitting…" : "Submit Application"}
            </Button>
            <p className="text-xs text-center text-muted-foreground">Your application will be reviewed by our team. Approval usually takes 24-48 hours.</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default VendorRegisterPage;
