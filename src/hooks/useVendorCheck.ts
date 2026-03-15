import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useVendorCheck = () => {
  const { user, loading: authLoading } = useAuth();
  const [isVendor, setIsVendor] = useState(false);
  const [vendorId, setVendorId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setIsVendor(false);
      setVendorId(null);
      setLoading(false);
      return;
    }

    const check = async () => {
      const { data } = await supabase
        .from("vendors")
        .select("id, approved")
        .eq("user_id", user.id)
        .maybeSingle();
      
      if (data && data.approved) {
        setIsVendor(true);
        setVendorId(data.id);
      } else {
        setIsVendor(false);
        setVendorId(null);
      }
      setLoading(false);
    };
    check();
  }, [user, authLoading]);

  return { isVendor, vendorId, loading: loading || authLoading, user };
};
