import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface SeasonalPrice {
  id: string;
  label: string;
  price_override: number;
  start_date: string;
  end_date: string;
  boat_id: string | null;
  resort_id: string | null;
}

interface ListingOption { id: string; name: string; type: "boat" | "resort"; }

const AdminPricing = () => {
  const [prices, setPrices] = useState<SeasonalPrice[]>([]);
  const [listings, setListings] = useState<ListingOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ label: "", price_override: 0, start_date: "", end_date: "", listing: "" });
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    const [pricesRes, boatsRes, resortsRes] = await Promise.all([
      supabase.from("seasonal_pricing").select("*").order("start_date"),
      supabase.from("boats").select("id, name"),
      supabase.from("resorts").select("id, name"),
    ]);
    setPrices((pricesRes.data as any) ?? []);
    const opts: ListingOption[] = [
      ...(boatsRes.data ?? []).map((b) => ({ id: b.id, name: b.name, type: "boat" as const })),
      ...(resortsRes.data ?? []).map((r) => ({ id: r.id, name: r.name, type: "resort" as const })),
    ];
    setListings(opts);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSave = async () => {
    if (!form.label || !form.price_override || !form.start_date || !form.end_date || !form.listing) {
      toast.error("All fields are required"); return;
    }
    setSaving(true);
    const selected = listings.find((l) => l.id === form.listing);
    const payload = {
      label: form.label,
      price_override: form.price_override,
      start_date: form.start_date,
      end_date: form.end_date,
      boat_id: selected?.type === "boat" ? selected.id : null,
      resort_id: selected?.type === "resort" ? selected.id : null,
    };
    const { error } = await supabase.from("seasonal_pricing").insert(payload);
    if (error) toast.error(error.message); else { toast.success("Seasonal price added"); setOpen(false); fetchData(); }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this pricing rule?")) return;
    const { error } = await supabase.from("seasonal_pricing").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Deleted"); fetchData(); }
  };

  const getListingName = (p: SeasonalPrice) => {
    const id = p.boat_id ?? p.resort_id;
    return listings.find((l) => l.id === id)?.name ?? "—";
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground">Seasonal Pricing</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="hero"><Plus className="h-4 w-4" /> Add Pricing</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader><DialogTitle>Add Seasonal Pricing</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><label className="text-sm font-medium">Label</label><Input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder="e.g. Diwali Special" /></div>
              <div>
                <label className="text-sm font-medium">Listing</label>
                <select className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm mt-1" value={form.listing} onChange={(e) => setForm({ ...form, listing: e.target.value })}>
                  <option value="">Select listing</option>
                  <optgroup label="Boats">{listings.filter((l) => l.type === "boat").map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}</optgroup>
                  <optgroup label="Resorts">{listings.filter((l) => l.type === "resort").map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}</optgroup>
                </select>
              </div>
              <div><label className="text-sm font-medium">Override Price (₹)</label><Input type="number" value={form.price_override} onChange={(e) => setForm({ ...form, price_override: +e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-sm font-medium">Start Date</label><Input type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} /></div>
                <div><label className="text-sm font-medium">End Date</label><Input type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} /></div>
              </div>
              <Button variant="hero" className="w-full" onClick={handleSave} disabled={saving}>{saving ? "Saving…" : "Save"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></div>
      ) : prices.length === 0 ? (
        <p className="text-muted-foreground text-center py-12">No seasonal pricing rules yet.</p>
      ) : (
        <div className="bg-card rounded-xl shadow-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border text-left">
              <th className="p-3 font-medium text-muted-foreground">Label</th>
              <th className="p-3 font-medium text-muted-foreground">Listing</th>
              <th className="p-3 font-medium text-muted-foreground">Price</th>
              <th className="p-3 font-medium text-muted-foreground">Start</th>
              <th className="p-3 font-medium text-muted-foreground">End</th>
              <th className="p-3 font-medium text-muted-foreground">Actions</th>
            </tr></thead>
            <tbody>
              {prices.map((p) => (
                <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="p-3 font-medium text-foreground">{p.label}</td>
                  <td className="p-3 text-foreground">{getListingName(p)}</td>
                  <td className="p-3 text-foreground">₹{Number(p.price_override).toLocaleString("en-IN")}</td>
                  <td className="p-3 text-muted-foreground">{p.start_date}</td>
                  <td className="p-3 text-muted-foreground">{p.end_date}</td>
                  <td className="p-3"><Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(p.id)}><Trash2 className="h-4 w-4" /></Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminPricing;
