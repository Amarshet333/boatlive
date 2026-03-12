import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";

type Resort = Tables<"resorts">;

const emptyResort = {
  name: "", price_per_night: 0, description: "", location: "",
  facilities: [] as string[], room_types: [] as string[],
  is_active: true, approved: true,
};

const AdminResorts = () => {
  const [resorts, setResorts] = useState<Resort[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Resort | null>(null);
  const [form, setForm] = useState(emptyResort);
  const [facilitiesStr, setFacilitiesStr] = useState("");
  const [roomTypesStr, setRoomTypesStr] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchResorts = async () => {
    const { data } = await supabase.from("resorts").select("*").order("created_at", { ascending: false });
    setResorts(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchResorts(); }, []);

  const openNew = () => {
    setEditing(null); setForm(emptyResort); setFacilitiesStr(""); setRoomTypesStr(""); setImageFile(null); setOpen(true);
  };

  const openEdit = (r: Resort) => {
    setEditing(r);
    setForm({
      name: r.name, price_per_night: Number(r.price_per_night), description: r.description ?? "",
      location: r.location ?? "", facilities: r.facilities ?? [], room_types: r.room_types ?? [],
      is_active: r.is_active, approved: r.approved,
    });
    setFacilitiesStr((r.facilities ?? []).join(", "));
    setRoomTypesStr((r.room_types ?? []).join(", "));
    setImageFile(null); setOpen(true);
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const ext = file.name.split(".").pop();
    const path = `resorts/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("listing-images").upload(path, file);
    if (error) { toast.error("Image upload failed"); return null; }
    const { data } = supabase.storage.from("listing-images").getPublicUrl(path);
    return data.publicUrl;
  };

  const handleSave = async () => {
    if (!form.name || !form.price_per_night) { toast.error("Name and price are required"); return; }
    setSaving(true);
    let image_url = editing?.image_url ?? null;
    if (imageFile) { const url = await uploadImage(imageFile); if (url) image_url = url; }
    const payload = {
      name: form.name, price_per_night: form.price_per_night, description: form.description,
      location: form.location,
      facilities: facilitiesStr.split(",").map((f) => f.trim()).filter(Boolean),
      room_types: roomTypesStr.split(",").map((f) => f.trim()).filter(Boolean),
      is_active: form.is_active, approved: form.approved, image_url,
    };
    if (editing) {
      const { error } = await supabase.from("resorts").update(payload).eq("id", editing.id);
      if (error) toast.error(error.message); else toast.success("Resort updated");
    } else {
      const { error } = await supabase.from("resorts").insert(payload);
      if (error) toast.error(error.message); else toast.success("Resort added");
    }
    setSaving(false); setOpen(false); fetchResorts();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this resort?")) return;
    const { error } = await supabase.from("resorts").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Deleted"); fetchResorts(); }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground">Manage Resorts</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="hero" onClick={openNew}><Plus className="h-4 w-4" /> Add Resort</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editing ? "Edit Resort" : "Add New Resort"}</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><label className="text-sm font-medium">Name</label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div><label className="text-sm font-medium">Price per Night (₹)</label><Input type="number" value={form.price_per_night} onChange={(e) => setForm({ ...form, price_per_night: +e.target.value })} /></div>
              <div><label className="text-sm font-medium">Location</label><Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></div>
              <div><label className="text-sm font-medium">Description</label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
              <div><label className="text-sm font-medium">Facilities (comma separated)</label><Input value={facilitiesStr} onChange={(e) => setFacilitiesStr(e.target.value)} /></div>
              <div><label className="text-sm font-medium">Room Types (comma separated)</label><Input value={roomTypesStr} onChange={(e) => setRoomTypesStr(e.target.value)} /></div>
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
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-sm"><Switch checked={form.is_active} onCheckedChange={(v) => setForm({ ...form, is_active: v })} /> Active</label>
                <label className="flex items-center gap-2 text-sm"><Switch checked={form.approved} onCheckedChange={(v) => setForm({ ...form, approved: v })} /> Approved</label>
              </div>
              <Button variant="hero" className="w-full" onClick={handleSave} disabled={saving}>{saving ? "Saving…" : "Save Resort"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></div>
      ) : resorts.length === 0 ? (
        <p className="text-muted-foreground text-center py-12">No resorts yet. Add your first resort!</p>
      ) : (
        <div className="bg-card rounded-xl shadow-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border text-left">
              <th className="p-3 font-medium text-muted-foreground">Image</th>
              <th className="p-3 font-medium text-muted-foreground">Name</th>
              <th className="p-3 font-medium text-muted-foreground">Price/Night</th>
              <th className="p-3 font-medium text-muted-foreground">Location</th>
              <th className="p-3 font-medium text-muted-foreground">Status</th>
              <th className="p-3 font-medium text-muted-foreground">Actions</th>
            </tr></thead>
            <tbody>
              {resorts.map((r) => (
                <tr key={r.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="p-3">{r.image_url ? <img src={r.image_url} className="h-10 w-14 rounded object-cover" /> : <div className="h-10 w-14 bg-muted rounded" />}</td>
                  <td className="p-3 font-medium text-foreground">{r.name}</td>
                  <td className="p-3 text-foreground">₹{Number(r.price_per_night).toLocaleString("en-IN")}</td>
                  <td className="p-3 text-muted-foreground">{r.location}</td>
                  <td className="p-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${r.approved && r.is_active ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                      {r.approved && r.is_active ? "Live" : "Draft"}
                    </span>
                  </td>
                  <td className="p-3 flex items-center gap-1">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(r)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(r.id)}><Trash2 className="h-4 w-4" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminResorts;
