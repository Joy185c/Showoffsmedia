
-- Role system
CREATE TYPE public.app_role AS ENUM ('admin', 'editor');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Admins can manage roles" ON public.user_roles
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can read own role" ON public.user_roles
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  display_name TEXT,
  email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Auto-create profile" ON public.profiles
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, display_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Site Content (key-value for text content)
CREATE TABLE public.site_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read site content" ON public.site_content FOR SELECT USING (true);
CREATE POLICY "Admins/editors can update site content" ON public.site_content
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

-- Testimonials
CREATE TABLE public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT '',
  quote TEXT NOT NULL DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read testimonials" ON public.testimonials FOR SELECT USING (true);
CREATE POLICY "Admins/editors manage testimonials" ON public.testimonials
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

-- Stats
CREATE TABLE public.stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  value TEXT NOT NULL,
  label TEXT NOT NULL,
  sub TEXT NOT NULL DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read stats" ON public.stats FOR SELECT USING (true);
CREATE POLICY "Admins/editors manage stats" ON public.stats
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

-- Work Categories
CREATE TABLE public.work_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.work_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read work categories" ON public.work_categories FOR SELECT USING (true);
CREATE POLICY "Admins/editors manage work categories" ON public.work_categories
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

-- Work Items
CREATE TABLE public.work_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.work_categories(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.work_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read work items" ON public.work_items FOR SELECT USING (true);
CREATE POLICY "Admins/editors manage work items" ON public.work_items
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

-- Case Studies
CREATE TABLE public.case_studies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  number TEXT NOT NULL DEFAULT '01',
  headline TEXT NOT NULL,
  stat1_value TEXT NOT NULL DEFAULT '',
  stat1_label TEXT NOT NULL DEFAULT '',
  stat2_value TEXT NOT NULL DEFAULT '',
  stat2_label TEXT NOT NULL DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.case_studies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read case studies" ON public.case_studies FOR SELECT USING (true);
CREATE POLICY "Admins/editors manage case studies" ON public.case_studies
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

-- Comparison Features
CREATE TABLE public.comparison_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('us', 'others', 'bonus')),
  text TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.comparison_features ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read comparison" ON public.comparison_features FOR SELECT USING (true);
CREATE POLICY "Admins/editors manage comparison" ON public.comparison_features
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

-- Process Steps
CREATE TABLE public.process_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  num TEXT NOT NULL,
  label TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.process_steps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read process" ON public.process_steps FOR SELECT USING (true);
CREATE POLICY "Admins/editors manage process" ON public.process_steps
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

-- Services
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  icon_name TEXT NOT NULL DEFAULT 'Play',
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read services" ON public.services FOR SELECT USING (true);
CREATE POLICY "Admins/editors manage services" ON public.services
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

-- Client Results
CREATE TABLE public.client_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  niche TEXT NOT NULL DEFAULT '',
  views TEXT NOT NULL DEFAULT '',
  subs TEXT NOT NULL DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.client_results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read client results" ON public.client_results FOR SELECT USING (true);
CREATE POLICY "Admins/editors manage client results" ON public.client_results
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

-- FAQs
CREATE TABLE public.faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read faqs" ON public.faqs FOR SELECT USING (true);
CREATE POLICY "Admins/editors manage faqs" ON public.faqs
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));
