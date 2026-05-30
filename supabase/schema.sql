-- Abhayapuri Care Hospital schema and backward-compatible migration.
-- Run this in Supabase SQL Editor. Existing appointments/auth data is not touched.

create extension if not exists pgcrypto;

-- =========================
-- Existing career tables
-- =========================

create table if not exists public.vacancies (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  department text not null,
  type text default 'Full time',
  experience text,
  openings integer default 1,
  location text default 'Abhayapuri, Bongaigaon',
  description text not null,
  requirements text,
  status text default 'open',
  created_at timestamptz default now()
);

create table if not exists public.career_applications (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null,
  qualification text,
  experience text,
  current_city text,
  expected_salary text,
  vacancy_id text,
  vacancy_title text,
  department text,
  cover_note text,
  resume_name text,
  resume_url text,
  resume_path text,
  status text default 'received',
  created_at timestamptz default now()
);

alter table public.career_applications add column if not exists resume_url text;
alter table public.career_applications add column if not exists resume_path text;

-- =========================
-- Doctors
-- =========================

create table if not exists public.doctors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  photo_url text,
  department text not null,
  specialization text not null,
  qualification text,
  experience text,
  consultation_fee numeric(10, 2),
  languages_known text[] default '{}',
  room_number text,
  status text default 'active',
  availability_override text default 'auto',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint doctors_status_check check (status in ('active', 'inactive', 'on_leave', 'retired')),
  constraint doctors_availability_override_check check (availability_override in ('auto', 'available', 'unavailable', 'on_leave'))
);

-- =========================
-- Staff members
-- =========================

create table if not exists public.staff_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  department text not null,
  role text not null,
  phone text,
  email text,
  status text default 'active',
  availability_override text default 'auto',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.staff_members add column if not exists department text;
alter table public.staff_members add column if not exists role text;
alter table public.staff_members add column if not exists phone text;
alter table public.staff_members add column if not exists email text;
alter table public.staff_members add column if not exists status text default 'active';
alter table public.staff_members add column if not exists availability_override text default 'auto';
alter table public.staff_members add column if not exists created_at timestamptz default now();
alter table public.staff_members add column if not exists updated_at timestamptz default now();

-- Legacy columns from the older mixed doctor/staff model. Keep them for migration safety.
alter table public.staff_members add column if not exists member_type text default 'staff';
alter table public.staff_members add column if not exists duty_days text[] default array['monday','tuesday','wednesday','thursday','friday','saturday'];
alter table public.staff_members add column if not exists shift_start time default '09:00';
alter table public.staff_members add column if not exists shift_end time default '17:00';
alter table public.staff_members add column if not exists photo_url text;

-- =========================
-- Duty rosters
-- =========================

create table if not exists public.duty_rosters (
  id uuid primary key default gen_random_uuid(),
  person_type text not null,
  doctor_id uuid references public.doctors(id) on delete cascade,
  staff_id uuid references public.staff_members(id) on delete cascade,
  duty_days text[] not null default '{}',
  shift_start time not null default '09:00',
  shift_end time not null default '17:00',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint duty_rosters_person_type_check check (person_type in ('doctor', 'staff')),
  constraint duty_rosters_person_link_check check (
    (person_type = 'doctor' and doctor_id is not null and staff_id is null)
    or
    (person_type = 'staff' and staff_id is not null and doctor_id is null)
  ),
  constraint duty_rosters_days_check check (
    duty_days <@ array['monday','tuesday','wednesday','thursday','friday','saturday','sunday']::text[]
  )
);

create index if not exists duty_rosters_doctor_id_idx on public.duty_rosters(doctor_id);
create index if not exists duty_rosters_staff_id_idx on public.duty_rosters(staff_id);
create index if not exists duty_rosters_person_type_idx on public.duty_rosters(person_type);

-- =========================
-- Gallery
-- =========================

create table if not exists public.gallery_photos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text default 'Hospital',
  image_url text not null,
  storage_path text,
  created_at timestamptz default now()
);

alter table public.gallery_photos add column if not exists storage_path text;

-- =========================
-- Legacy doctor migration
-- =========================

insert into public.doctors (
  name,
  photo_url,
  department,
  specialization,
  qualification,
  experience,
  consultation_fee,
  languages_known,
  room_number,
  status,
  availability_override,
  created_at,
  updated_at
)
select
  sm.name,
  sm.photo_url,
  coalesce(nullif(sm.department, ''), 'General'),
  coalesce(nullif(sm.role, ''), 'General Practitioner'),
  null,
  null,
  null,
  '{}',
  null,
  coalesce(sm.status, 'active'),
  coalesce(sm.availability_override, 'auto'),
  coalesce(sm.created_at, now()),
  coalesce(sm.updated_at, now())
from public.staff_members sm
where coalesce(sm.member_type, 'staff') = 'doctor'
  and not exists (
    select 1 from public.doctors d where lower(d.name) = lower(sm.name)
  );

insert into public.duty_rosters (person_type, doctor_id, duty_days, shift_start, shift_end)
select
  'doctor',
  d.id,
  case
    when sm.duty_days is null then array['monday','tuesday','wednesday','thursday','friday','saturday']
    else array(
      select case lower(day)
        when '1' then 'monday'
        when '2' then 'tuesday'
        when '3' then 'wednesday'
        when '4' then 'thursday'
        when '5' then 'friday'
        when '6' then 'saturday'
        when '0' then 'sunday'
        else lower(day)
      end
      from unnest(sm.duty_days) as day
    )
  end,
  coalesce(sm.shift_start, '09:00'::time),
  coalesce(sm.shift_end, '17:00'::time)
from public.staff_members sm
join public.doctors d on lower(d.name) = lower(sm.name)
where coalesce(sm.member_type, 'staff') = 'doctor'
  and not exists (
    select 1 from public.duty_rosters r where r.person_type = 'doctor' and r.doctor_id = d.id
  );

-- Backfill duty rosters for restored default doctors inserted directly into public.doctors.
insert into public.duty_rosters (person_type, doctor_id, duty_days, shift_start, shift_end)
select
  'doctor',
  d.id,
  source_rosters.duty_days,
  source_rosters.shift_start::time,
  source_rosters.shift_end::time
from (
  values
    ('Dr. Ahmed', 'Cardiology', 'Cardiology (Heart)', array['monday','wednesday','friday']::text[], '10:00', '14:00'),
    ('Dr. Fatima', 'Pediatrics', 'Pediatrics (Child)', array['monday','tuesday','wednesday','thursday','friday','saturday']::text[], '09:30', '13:30'),
    ('Dr. Robert', 'Neurology', 'Neurology (Brain)', array['monday','tuesday','wednesday','thursday','friday']::text[], '11:00', '15:00'),
    ('Dr. Verma', 'Oncology', 'Oncology (Cancer)', array['monday','wednesday','friday']::text[], '10:30', '14:30'),
    ('Dr. Khan', 'Dentistry', 'Dentistry (Teeth)', array['monday','tuesday','wednesday','thursday','friday','saturday']::text[], '10:00', '16:00'),
    ('Dr. Ray', 'Dermatology', 'Dermatology (Hair & Skin)', array['tuesday','thursday','saturday']::text[], '12:00', '16:00'),
    ('Dr. Parbin', 'Endocrinology', 'Endocrinology (Diabetes)', array['monday','wednesday','friday']::text[], '09:00', '13:00'),
    ('Dr. Baruah', 'Surgery', 'General Surgery', array['tuesday','thursday','saturday']::text[], '11:00', '15:00'),
    ('Dr. Priya', 'Gastroenterology', 'Gastroenterologist', array['monday','tuesday','wednesday','thursday','friday']::text[], '10:00', '14:00'),
    ('Dr. Devi', 'Gynecology', 'Gynecologist', array['monday','wednesday','friday']::text[], '09:00', '13:00'),
    ('Dr. Barman', 'Ophthalmology', 'Ophthalmologist', array['tuesday','thursday','saturday']::text[], '11:00', '15:00'),
    ('Dr. Choudhury', 'ENT', 'ENT Specialist', array['monday','wednesday','friday']::text[], '10:00', '14:00')
) as source_rosters (name, department, specialization, duty_days, shift_start, shift_end)
join public.doctors d
  on lower(d.name) = lower(source_rosters.name)
  and lower(d.department) = lower(source_rosters.department)
  and lower(d.specialization) = lower(source_rosters.specialization)
where not exists (
  select 1
  from public.duty_rosters existing
  where existing.person_type = 'doctor'
    and existing.doctor_id = d.id
);

insert into public.duty_rosters (person_type, staff_id, duty_days, shift_start, shift_end)
select
  'staff',
  sm.id,
  case
    when sm.duty_days is null then array['monday','tuesday','wednesday','thursday','friday','saturday']
    else array(
      select case lower(day)
        when '1' then 'monday'
        when '2' then 'tuesday'
        when '3' then 'wednesday'
        when '4' then 'thursday'
        when '5' then 'friday'
        when '6' then 'saturday'
        when '0' then 'sunday'
        else lower(day)
      end
      from unnest(sm.duty_days) as day
    )
  end,
  coalesce(sm.shift_start, '09:00'::time),
  coalesce(sm.shift_end, '17:00'::time)
from public.staff_members sm
where coalesce(sm.member_type, 'staff') <> 'doctor'
  and not exists (
    select 1 from public.duty_rosters r where r.person_type = 'staff' and r.staff_id = sm.id
  );

-- =========================
-- RLS policies
-- =========================

alter table public.vacancies enable row level security;
alter table public.career_applications enable row level security;
alter table public.doctors enable row level security;
alter table public.staff_members enable row level security;
alter table public.duty_rosters enable row level security;
alter table public.gallery_photos enable row level security;

drop policy if exists "Public can read open vacancies" on public.vacancies;
create policy "Public can read open vacancies"
on public.vacancies for select
using (status = 'open');

drop policy if exists "Authenticated admins manage vacancies" on public.vacancies;
create policy "Authenticated admins manage vacancies"
on public.vacancies for all
to authenticated
using (true)
with check (true);

drop policy if exists "Public can submit career applications" on public.career_applications;
create policy "Public can submit career applications"
on public.career_applications for insert
with check (true);

drop policy if exists "Authenticated admins read applications" on public.career_applications;
create policy "Authenticated admins read applications"
on public.career_applications for select
to authenticated
using (true);

drop policy if exists "Authenticated admins update applications" on public.career_applications;
create policy "Authenticated admins update applications"
on public.career_applications for update
to authenticated
using (true)
with check (true);

drop policy if exists "Public can read active doctors" on public.doctors;
create policy "Public can read active doctors"
on public.doctors for select
using (status = 'active');

drop policy if exists "Authenticated admins manage doctors" on public.doctors;
create policy "Authenticated admins manage doctors"
on public.doctors for all
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated admins manage staff" on public.staff_members;
create policy "Authenticated admins manage staff"
on public.staff_members for all
to authenticated
using (true)
with check (true);

drop policy if exists "Public can read doctor duty rosters" on public.duty_rosters;
create policy "Public can read doctor duty rosters"
on public.duty_rosters for select
using (
  person_type = 'doctor'
  and exists (
    select 1 from public.doctors
    where doctors.id = duty_rosters.doctor_id
    and doctors.status = 'active'
  )
);

drop policy if exists "Authenticated admins manage duty rosters" on public.duty_rosters;
create policy "Authenticated admins manage duty rosters"
on public.duty_rosters for all
to authenticated
using (true)
with check (true);

drop policy if exists "Public can read gallery photos" on public.gallery_photos;
create policy "Public can read gallery photos"
on public.gallery_photos for select
using (true);

drop policy if exists "Authenticated admins manage gallery photos" on public.gallery_photos;
create policy "Authenticated admins manage gallery photos"
on public.gallery_photos for all
to authenticated
using (true)
with check (true);

-- =========================
-- Storage bucket setup
-- =========================

insert into storage.buckets (id, name, public)
values
  ('doctor-photos', 'doctor-photos', true),
  ('gallery-photos', 'gallery-photos', true),
  ('career-resumes', 'career-resumes', false)
on conflict (id) do nothing;

drop policy if exists "Public can read doctor photos" on storage.objects;
create policy "Public can read doctor photos"
on storage.objects for select
using (bucket_id = 'doctor-photos');

drop policy if exists "Authenticated admins manage doctor photos" on storage.objects;
create policy "Authenticated admins manage doctor photos"
on storage.objects for all
to authenticated
using (bucket_id = 'doctor-photos')
with check (bucket_id = 'doctor-photos');

drop policy if exists "Public can read gallery photos storage" on storage.objects;
create policy "Public can read gallery photos storage"
on storage.objects for select
using (bucket_id = 'gallery-photos');

drop policy if exists "Authenticated admins manage gallery photos storage" on storage.objects;
create policy "Authenticated admins manage gallery photos storage"
on storage.objects for all
to authenticated
using (bucket_id = 'gallery-photos')
with check (bucket_id = 'gallery-photos');

drop policy if exists "Public can upload career resumes" on storage.objects;
create policy "Public can upload career resumes"
on storage.objects for insert
with check (bucket_id = 'career-resumes');

drop policy if exists "Authenticated admins read career resumes" on storage.objects;
create policy "Authenticated admins read career resumes"
on storage.objects for select
to authenticated
using (bucket_id = 'career-resumes');

-- =========================
-- Default seed data
-- =========================

insert into public.vacancies (title, department, type, experience, openings, location, description, requirements, status)
values
  ('Resident Doctor - Emergency', 'Emergency', 'Full time', '1+ year', 2, 'Abhayapuri, Bongaigaon', 'Support emergency triage, OPD review, ward rounds, case notes, and coordination with specialist doctors.', 'MBBS registration, emergency duty readiness, clear patient communication.', 'open'),
  ('Staff Nurse - Ward & OPD', 'Nursing', 'Rotational shift', '0-2 years', 4, 'Abhayapuri, Bongaigaon', 'Manage patient monitoring, medicine timing, dressing support, documentation, and family guidance.', 'GNM/B.Sc Nursing, valid registration preferred, calm bedside manner.', 'open'),
  ('Radiology Technician', 'Diagnostic Lab', 'Full time', '1-3 years', 1, 'Abhayapuri, Bongaigaon', 'Handle X-ray workflow, patient positioning, equipment care, and safety protocols.', 'Radiology diploma, X-ray machine handling experience, radiation safety knowledge.', 'open')
on conflict do nothing;
