create table if not exists public.doctors (
  registration_id text primary key,
  email text not null unique,
  name text not null,
  degree text not null,
  photo text,
  father_name text,
  nationality text,
  dob date,
  valid_upto date,
  specialization text,
  phone text,
  practice_address text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.doctors add column if not exists father_name text;
alter table public.doctors add column if not exists nationality text;
alter table public.doctors add column if not exists dob date;
alter table public.doctors add column if not exists valid_upto date;
alter table public.doctors add column if not exists ug_university text;
alter table public.doctors add column if not exists pg_university text;
alter table public.doctors add column if not exists specialization text;
alter table public.doctors add column if not exists phone text;
alter table public.doctors add column if not exists practice_address text;
alter table public.doctors add column if not exists created_at timestamptz not null default now();
alter table public.doctors add column if not exists updated_at timestamptz not null default now();

create or replace function public.set_doctors_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_doctors_updated_at on public.doctors;

create trigger trg_doctors_updated_at
before update on public.doctors
for each row execute procedure public.set_doctors_updated_at();
