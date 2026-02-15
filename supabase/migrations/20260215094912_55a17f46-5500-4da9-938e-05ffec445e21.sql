
-- Create storage bucket for videos
INSERT INTO storage.buckets (id, name, public) VALUES ('videos', 'videos', true);

-- Allow anyone to view videos
CREATE POLICY "Anyone can view videos" ON storage.objects FOR SELECT USING (bucket_id = 'videos');

-- Allow authenticated admins/editors to upload videos
CREATE POLICY "Admins can upload videos" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'videos' AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
);

-- Allow authenticated admins/editors to update videos
CREATE POLICY "Admins can update videos" ON storage.objects FOR UPDATE USING (
  bucket_id = 'videos' AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
);

-- Allow authenticated admins/editors to delete videos
CREATE POLICY "Admins can delete videos" ON storage.objects FOR DELETE USING (
  bucket_id = 'videos' AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
);

-- Add video_url to case_studies
ALTER TABLE public.case_studies ADD COLUMN video_url text DEFAULT '';

-- Add video_url to work_items
ALTER TABLE public.work_items ADD COLUMN video_url text DEFAULT '';

-- Add video_url to testimonials
ALTER TABLE public.testimonials ADD COLUMN video_url text DEFAULT '';

-- Add hero_video_url to site_content (we'll use a key-value entry instead)
INSERT INTO public.site_content (key, value) VALUES ('hero_video_url', '') ON CONFLICT DO NOTHING;
