
CREATE TABLE public.seasonal_pricing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  boat_id UUID REFERENCES public.boats(id) ON DELETE CASCADE,
  resort_id UUID REFERENCES public.resorts(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  price_override NUMERIC NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.seasonal_pricing ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can do anything with seasonal_pricing"
ON public.seasonal_pricing FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view seasonal_pricing"
ON public.seasonal_pricing FOR SELECT
USING (true);

CREATE TRIGGER update_seasonal_pricing_updated_at
  BEFORE UPDATE ON public.seasonal_pricing
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
