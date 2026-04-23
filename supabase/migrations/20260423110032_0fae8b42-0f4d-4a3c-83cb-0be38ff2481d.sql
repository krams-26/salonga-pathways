-- Profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles for select to authenticated using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert to authenticated with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update to authenticated using (auth.uid() = id);

-- Applications
create table public.applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  job_id text not null,
  job_title text not null,
  full_name text not null,
  email text not null,
  phone text,
  nationality text,
  motivation text,
  status text not null default 'submitted',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.applications enable row level security;

create policy "applications_select_own" on public.applications for select to authenticated using (auth.uid() = user_id);
create policy "applications_insert_own" on public.applications for insert to authenticated with check (auth.uid() = user_id);
create policy "applications_update_own" on public.applications for update to authenticated using (auth.uid() = user_id);
create policy "applications_delete_own" on public.applications for delete to authenticated using (auth.uid() = user_id);

create index applications_user_idx on public.applications(user_id);
create index applications_job_idx on public.applications(job_id);

-- Documents
create table public.application_documents (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.applications(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  doc_type text not null check (doc_type in ('cv','cover_letter','diploma','other')),
  file_name text not null,
  storage_path text not null,
  size_bytes bigint,
  created_at timestamptz not null default now()
);
alter table public.application_documents enable row level security;

create policy "docs_select_own" on public.application_documents for select to authenticated using (auth.uid() = user_id);
create policy "docs_insert_own" on public.application_documents for insert to authenticated with check (auth.uid() = user_id);
create policy "docs_delete_own" on public.application_documents for delete to authenticated using (auth.uid() = user_id);

-- updated_at trigger
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger profiles_set_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger applications_set_updated_at before update on public.applications
  for each row execute function public.set_updated_at();

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Storage bucket (private)
insert into storage.buckets (id, name, public) values ('applications', 'applications', false)
  on conflict (id) do nothing;

create policy "app_files_select_own" on storage.objects for select to authenticated
  using (bucket_id = 'applications' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "app_files_insert_own" on storage.objects for insert to authenticated
  with check (bucket_id = 'applications' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "app_files_delete_own" on storage.objects for delete to authenticated
  using (bucket_id = 'applications' and auth.uid()::text = (storage.foldername(name))[1]);