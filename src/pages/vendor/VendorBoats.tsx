import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useVendorCheck } from "@/hooks/useVendorCheck";
import VendorLayout from "@/components/vendor/VendorLayout";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Upload } from "lucide-react";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";

type Boat = Tables<"boats">;

const emptyBoat = {
  name: "", price: 0, capacity: 2, duration: "1 hour", description: "",
  location: "", features: [] as string[], is_active: true,
};

const VendorBoats = () => {
  const { vendorId } = useVendorCheck();
  const [boats, setBoats] = useState<Boat[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Boat | null>(null);
  const [form, setForm] = useState(emptyBoat);
  const [featuresStr, setFeaturesStr] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchBoats = async () => {
    if (!vendorId) return;
    const { data } = await supabase.from("boats").select("*").eq("vendor_id", vendorId).order("created_at", { ascending: false });
    setBoats(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchBoats(); }, [vendorId]);

  const openNew = () => {
    setEditing(null);
    setForm(emptyBoat);
    setFeaturesStr("");
    setImageFile(null);
    setOpen(true);
  };

  const openEdit = (b: Boat) => {
    setEditing(b);
    setForm({
      name: b.name, price: Number(b.price), capacity: b.capacity,
      duration: b.duration, description: b.description ?? "",
      location: b.location ?? "", features: b.features ?? [],
      is_active: b.is_active,
    });
    setFeaturesStr((b.features ?? []).join(", "));
    setImageFile(null);
    setOpen(true);
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const ext = file.name.split(".").pop();
    const path = `boats/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("listing-images").upload(path, file);
    if (error) { toast.error("Image upload failed"); return null; }
    const { data } = supabase.storage.from("listing-images").getPublicUrl(path);
    return data.publicUrl;
  };

  const handleSave = async () => {
    if (!form.name || !form.price || !vendorId) { toast.error("Name and price are required"); return; }
    setSaving(true);
    let image_url = editing?.image_url ?? null;
    if (imageFile) {
      const url = await uploadImage(imageFile);
      if (url) image_url = url;
    }
    const payload = {
      name: form.name, price: form.price, capacity: form.capacity,
      duration: form.duration, description: form.description,
      location: form.location, features: featuresStr.split(",").map((f) => f.trim()).filter(Boolean),
      is_active: form.is_active, image_url, vendor_id: vendorId,
    };
    if (editing) {
      const { error } = await supabase.from("boats").update(payload).eq("id", editing.id);
      if (error) toast.error(error.message); else toast.success("Boat updated");
    } else {
      const { error } = await supabase.from("boats").insert(payload);
      if (error) toast.error(error.message); else toast.success("Boat submitted for approval");
    }
    setSaving(false);
    setOpen(false);
    fetchBoats();
  };

  return (
    <VendorLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground">My Boats</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="hero" onClick={openNew}><Plus className="h-4 w-4" /> Add Boat</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editing ? "Edit Boat" : "Add New Boat"}</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><label className="text-sm font-medium">Name</label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-sm font-medium">Price (₹)</label><Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: +e.target.value })} /></div>
                <div><label className="text-sm font-medium">Capacity</label><Input type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: +e.target.value })} /></div>
              </div>
              <div><label className="text-sm font-medium">Duration</label><Input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} /></div>
              <div><label className="text-sm font-medium">Location</label><Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></div>
              <div><label className="text-sm font-medium">Description</label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
              <div><label className="text-sm font-medium">Features (comma separated)</label><Input value={featuresStr} onChange={(e) => setFeaturesStr(e.target.value)} placeholder="Life Jackets, Guide, Photography" /></div>
              <div>
                <label className="text-sm font-medium">Image</label>
                <div className="mt-1 flex items-center gap-3">
                  <label className="flex items-center gap-2 px-3 py-2 rounded-lg border border-input cursor-pointer hover:bg-muted text-sm">
                    <Upload className="h-4 w-4" /> {imageFile ? imageFile.name : "Choose file"}
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} />
                  </label>
                  {editing?.image_url && !imageFile && <img src={editing.image_url} className="h-10 w-10 rounded object-cover" />}
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm"><Switch checked={form.is_active} onCheckedChange={(v) => setForm({ ...form, is_active: v })} /> Active</label>
              <Button variant="hero" className="w-full" onClick={handleSave} disabled={saving}>{saving ? "Saving…" : "Save Boat"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></div>
      ) : boats.length === 0 ? (
        <p className="text-muted-foreground text-center py-12">No boats yet. Add your first boat!</p>
      ) : (
        <div className="bg-card rounded-xl shadow-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="p-3 font-medium text-muted-foreground">Image</th>
                <th className="p-3 font-medium text-muted-foreground">Name</th>
                <th className="p-3 font-medium text-muted-foreground">Price</th>
                <th className="p-3 font-medium text-muted-foreground">Capacity</th>
                <th className="p-3 font-medium text-muted-foreground">Approval</th>
                <th className="p-3 font-medium text-muted-foreground">Status</th>
                <th className="p-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {boats.map((b) => (
                <tr key={b.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="p-3">{b.image_url ? <img src={b.image_url} className="h-10 w-14 rounded object-cover" /> : <div className="h-10 w-14 bg-muted rounded" />}</td>
                  <td className="p-3 font-medium text-foreground">{b.name}</td>
                  <td className="p-3 text-foreground">₹{Number(b.price).toLocaleString("en-IN")}</td>
                  <td className="p-3 text-foreground">{b.capacity}</td>
                  <td className="p-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${b.approved ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                      {b.approved ? "Approved" : "Pending"}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${b.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {b.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-3">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(b)}><Pencil className="h-4 w-4" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </VendorLayout>
  );
};

export default VendorBoats;
