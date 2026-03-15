
-- Allow vendors to view bookings on their listings
CREATE POLICY "Vendors can view bookings on own listings"
ON public.bookings
FOR SELECT
TO authenticated
USING (
  boat_id IN (SELECT id FROM public.boats WHERE vendor_id IN (SELECT id FROM public.vendors WHERE user_id = auth.uid()))
  OR
  resort_id IN (SELECT id FROM public.resorts WHERE vendor_id IN (SELECT id FROM public.vendors WHERE user_id = auth.uid()))
);

-- Allow vendors to update booking status on their listings
CREATE POLICY "Vendors can update bookings on own listings"
ON public.bookings
FOR UPDATE
TO authenticated
USING (
  boat_id IN (SELECT id FROM public.boats WHERE vendor_id IN (SELECT id FROM public.vendors WHERE user_id = auth.uid()))
  OR
  resort_id IN (SELECT id FROM public.resorts WHERE vendor_id IN (SELECT id FROM public.vendors WHERE user_id = auth.uid()))
);
