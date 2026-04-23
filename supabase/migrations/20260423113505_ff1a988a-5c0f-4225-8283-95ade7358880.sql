
-- 1. Enum app_role
CREATE TYPE public.app_role AS ENUM ('admin', 'recruiter', 'candidate');

-- 2. Table user_roles
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 3. Security definer function has_role
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- 4. RLS pour user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert roles"
ON public.user_roles FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update roles"
ON public.user_roles FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete roles"
ON public.user_roles FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 5. Mise à jour du trigger handle_new_user pour attribuer le rôle candidate
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''))
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'candidate')
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN new;
END;
$$;

-- Recréer le trigger pour s'assurer qu'il existe
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. Étendre RLS applications pour recruiter/admin
CREATE POLICY "Recruiters and admins can view all applications"
ON public.applications FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'recruiter') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Recruiters and admins can update all applications"
ON public.applications FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'recruiter') OR public.has_role(auth.uid(), 'admin'));

-- 7. Étendre RLS application_documents pour recruiter/admin
CREATE POLICY "Recruiters and admins can view all documents"
ON public.application_documents FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'recruiter') OR public.has_role(auth.uid(), 'admin'));

-- 8. Étendre RLS profiles pour recruiter/admin
CREATE POLICY "Recruiters and admins can view all profiles"
ON public.profiles FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'recruiter') OR public.has_role(auth.uid(), 'admin'));

-- 9. Storage: recruiters/admins peuvent lire tous les fichiers du bucket applications
CREATE POLICY "Recruiters and admins can read all application files"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'applications'
  AND (public.has_role(auth.uid(), 'recruiter') OR public.has_role(auth.uid(), 'admin'))
);
