
-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- User roles
CREATE TYPE public.app_role AS ENUM ('admin', 'vendor', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  UNIQUE(user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);

-- Vendors table
CREATE TABLE public.vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  approved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Vendors can view own record" ON public.vendors FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Vendors can insert own record" ON public.vendors FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Vendors can update own record" ON public.vendors FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all vendors" ON public.vendors FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update vendors" ON public.vendors FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_vendors_updated_at BEFORE UPDATE ON public.vendors
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Boats table
CREATE TABLE public.boats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID REFERENCES public.vendors(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  capacity INTEGER NOT NULL,
  duration TEXT NOT NULL,
  location TEXT,
  image_url TEXT,
  features TEXT[] DEFAULT '{}',
  rating NUMERIC DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  approved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.boats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active approved boats" ON public.boats FOR SELECT USING (is_active = true AND approved = true);
CREATE POLICY "Vendors can view own boats" ON public.boats FOR SELECT USING (vendor_id IN (SELECT id FROM public.vendors WHERE user_id = auth.uid()));
CREATE POLICY "Vendors can insert boats" ON public.boats FOR INSERT WITH CHECK (vendor_id IN (SELECT id FROM public.vendors WHERE user_id = auth.uid()));
CREATE POLICY "Vendors can update own boats" ON public.boats FOR UPDATE USING (vendor_id IN (SELECT id FROM public.vendors WHERE user_id = auth.uid()));
CREATE POLICY "Admins can do anything with boats" ON public.boats FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_boats_updated_at BEFORE UPDATE ON public.boats
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Resorts table
CREATE TABLE public.resorts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID REFERENCES public.vendors(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  price_per_night NUMERIC NOT NULL,
  location TEXT,
  image_url TEXT,
  facilities TEXT[] DEFAULT '{}',
  room_types TEXT[] DEFAULT '{}',
  rating NUMERIC DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  approved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.resorts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active approved resorts" ON public.resorts FOR SELECT USING (is_active = true AND approved = true);
CREATE POLICY "Vendors can view own resorts" ON public.resorts FOR SELECT USING (vendor_id IN (SELECT id FROM public.vendors WHERE user_id = auth.uid()));
CREATE POLICY "Vendors can insert resorts" ON public.resorts FOR INSERT WITH CHECK (vendor_id IN (SELECT id FROM public.vendors WHERE user_id = auth.uid()));
CREATE POLICY "Vendors can update own resorts" ON public.resorts FOR UPDATE USING (vendor_id IN (SELECT id FROM public.vendors WHERE user_id = auth.uid()));
CREATE POLICY "Admins can do anything with resorts" ON public.resorts FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_resorts_updated_at BEFORE UPDATE ON public.resorts
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Bookings table
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  booking_type TEXT NOT NULL CHECK (booking_type IN ('boat', 'resort')),
  boat_id UUID REFERENCES public.boats(id) ON DELETE SET NULL,
  resort_id UUID REFERENCES public.resorts(id) ON DELETE SET NULL,
  booking_date DATE,
  booking_time TEXT,
  check_in DATE,
  check_out DATE,
  guests INTEGER NOT NULL DEFAULT 1,
  room_type TEXT,
  total_amount NUMERIC NOT NULL,
  service_fee NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  payment_status TEXT NOT NULL DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid', 'refunded')),
  payment_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own bookings" ON public.bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own bookings" ON public.bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own bookings" ON public.bookings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all bookings" ON public.bookings FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update all bookings" ON public.bookings FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Reviews table
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  boat_id UUID REFERENCES public.boats(id) ON DELETE CASCADE,
  resort_id UUID REFERENCES public.resorts(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Users can create reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reviews" ON public.reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own reviews" ON public.reviews FOR DELETE USING (auth.uid() = user_id);

-- Favorites table
CREATE TABLE public.favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  boat_id UUID REFERENCES public.boats(id) ON DELETE CASCADE,
  resort_id UUID REFERENCES public.resorts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, boat_id),
  UNIQUE(user_id, resort_id)
);
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own favorites" ON public.favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can add favorites" ON public.favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove favorites" ON public.favorites FOR DELETE USING (auth.uid() = user_id);

-- Storage bucket for listing images
INSERT INTO storage.buckets (id, name, public) VALUES ('listing-images', 'listing-images', true);
CREATE POLICY "Anyone can view listing images" ON storage.objects FOR SELECT USING (bucket_id = 'listing-images');
CREATE POLICY "Authenticated users can upload listing images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'listing-images' AND auth.role() = 'authenticated');
