import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { tmpdir } from 'node:os'
import { loadEnv } from './env.mjs'

loadEnv()

const defaultDataDir =
  process.env.NODE_ENV === 'production' ? resolve(tmpdir(), 'mmc-api-data') : resolve(process.cwd(), 'server/data')
const dataDir = resolve(process.env.DATA_DIR || defaultDataDir)
const dbPath = resolve(dataDir, 'db.json')

const SUPABASE_URL = String(process.env.SUPABASE_URL || '').trim().replace(/\/+$/, '')
const SUPABASE_SERVICE_ROLE_KEY = String(process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim()
const USE_SUPABASE = !!SUPABASE_URL && !!SUPABASE_SERVICE_ROLE_KEY

const defaultDoctors = [
  {
    photo: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=500&q=80',
    registrationId: 'MMC-2024-0001',
    email: 'doctor.demo@mmc.in',
    name: 'Dr. Asha Kulkarni',
    fatherName: '',
    nationality: 'Indian',
    dob: '',
    validUpto: '',
    ugUniversity: '',
    pgUniversity: '',
    degree: 'MBBS, MD',
    specialization: 'General Medicine',
    phone: '9876543210',
    practiceAddress: 'Mumbai, Maharashtra',
  },
]

const defaultDb = {
  doctors: defaultDoctors,
}

const ensureDb = () => {
  if (!existsSync(dataDir)) {
    mkdirSync(dataDir, { recursive: true })
  }

  if (!existsSync(dbPath)) {
    writeFileSync(dbPath, JSON.stringify(defaultDb, null, 2), 'utf8')
  }
}

let memoryDb = { ...defaultDb }

const normalizeDoctor = (doctor = {}) => ({
  photo: String(doctor.photo || ''),
  registrationId: String(doctor.registrationId || ''),
  email: String(doctor.email || ''),
  name: String(doctor.name || ''),
  fatherName: String(doctor.fatherName || ''),
  nationality: String(doctor.nationality || ''),
  dob: String(doctor.dob || ''),
  validUpto: String(doctor.validUpto || ''),
  ugUniversity: String(doctor.ugUniversity || ''),
  pgUniversity: String(doctor.pgUniversity || ''),
  degree: String(doctor.degree || ''),
  specialization: String(doctor.specialization || ''),
  phone: String(doctor.phone || ''),
  practiceAddress: String(doctor.practiceAddress || ''),
})

const normalizeDoctors = (doctors) => (Array.isArray(doctors) ? doctors.map(normalizeDoctor) : defaultDoctors.map(normalizeDoctor))

const readDb = () => {
  try {
    ensureDb()
    const raw = readFileSync(dbPath, 'utf8')
    const parsed = JSON.parse(raw)
    memoryDb = {
      ...defaultDb,
      ...parsed,
      doctors: normalizeDoctors(parsed?.doctors),
    }
    return memoryDb
  } catch {
    return {
      ...memoryDb,
      doctors: normalizeDoctors(memoryDb?.doctors),
    }
  }
}

const writeDb = (data) => {
  const nextData = {
    ...defaultDb,
    ...data,
    doctors: normalizeDoctors(data?.doctors),
  }

  memoryDb = nextData

  try {
    ensureDb()
    writeFileSync(dbPath, JSON.stringify(nextData, null, 2), 'utf8')
  } catch {
    // Read-only file systems can happen on serverless runtimes.
  }
}

const mapSupabaseRowToDoctor = (row = {}) =>
  normalizeDoctor({
    photo: row.photo,
    registrationId: row.registration_id,
    email: row.email,
    name: row.name,
    fatherName: row.father_name,
    nationality: row.nationality,
    dob: row.dob,
    validUpto: row.valid_upto,
    ugUniversity: row.ug_university,
    pgUniversity: row.pg_university,
    degree: row.degree,
    specialization: row.specialization,
    phone: row.phone,
    practiceAddress: row.practice_address,
  })

const mapDoctorToSupabaseRow = (doctor = {}) => {
  const normalized = normalizeDoctor(doctor)
  return {
    photo: normalized.photo || null,
    registration_id: normalized.registrationId,
    email: normalized.email.toLowerCase(),
    name: normalized.name,
    father_name: normalized.fatherName || null,
    nationality: normalized.nationality || null,
    dob: normalized.dob || null,
    valid_upto: normalized.validUpto || null,
    ug_university: normalized.ugUniversity || null,
    pg_university: normalized.pgUniversity || null,
    degree: normalized.degree,
    specialization: normalized.specialization || null,
    phone: normalized.phone || null,
    practice_address: normalized.practiceAddress || null,
  }
}

const supabaseHeaders = {
  apikey: SUPABASE_SERVICE_ROLE_KEY,
  Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
  'Content-Type': 'application/json',
}

const supabaseRequest = async ({ path, method = 'GET', body, prefer }) => {
  const headers = {
    ...supabaseHeaders,
  }
  if (prefer) {
    headers.Prefer = prefer
  }

  const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  let payload = null
  const raw = await response.text()
  try {
    payload = raw ? JSON.parse(raw) : null
  } catch {
    payload = raw
  }

  if (!response.ok) {
    const message =
      payload?.message || payload?.error_description || payload?.hint || (typeof payload === 'string' && payload) || 'Database request failed.'
    throw new Error(message)
  }

  return payload
}

const ensureSupabaseTable = async () => {
  const query = `
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
  ug_university text,
  pg_university text,
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
`

  await fetch(`${SUPABASE_URL}/rest/v1/rpc/execute_sql`, {
    method: 'POST',
    headers: supabaseHeaders,
    body: JSON.stringify({ query }),
  }).catch(() => {
    // Some Supabase projects don't expose execute_sql RPC.
    // In that case table must be created manually using the SQL in docs.
  })
}

let supabaseInitPromise = null
const ensureSupabaseReady = async () => {
  if (!USE_SUPABASE) {
    return
  }
  if (!supabaseInitPromise) {
    supabaseInitPromise = ensureSupabaseTable()
  }
  await supabaseInitPromise
}

const getDoctorsFromSupabase = async () => {
  await ensureSupabaseReady()
  const rows = await supabaseRequest({
    path: 'doctors?select=registration_id,email,name,degree,photo,father_name,nationality,dob,valid_upto,ug_university,pg_university,specialization,phone,practice_address&order=created_at.asc',
  })
  return Array.isArray(rows) ? rows.map(mapSupabaseRowToDoctor) : []
}

const setDoctorsInSupabase = async (doctors) => {
  await ensureSupabaseReady()
  await supabaseRequest({
    method: 'DELETE',
    path: 'doctors?registration_id=neq.__never__',
  })

  const payload = normalizeDoctors(doctors).map(mapDoctorToSupabaseRow)
  if (payload.length) {
    await supabaseRequest({
      method: 'POST',
      path: 'doctors',
      body: payload,
      prefer: 'resolution=merge-duplicates',
    })
  }
}

export const getStorageHealth = () => {
  if (USE_SUPABASE) {
    return { ok: true, mode: 'supabase' }
  }

  if (process.env.NODE_ENV === 'production') {
    return {
      ok: false,
      mode: 'local-file',
      message:
        'Permanent database is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY for persistent storage.',
    }
  }

  return { ok: true, mode: 'local-file' }
}

export const getDoctors = async () => {
  if (USE_SUPABASE) {
    return getDoctorsFromSupabase()
  }
  return normalizeDoctors(readDb().doctors)
}

export const setDoctors = async (doctors) => {
  if (USE_SUPABASE) {
    await setDoctorsInSupabase(doctors)
    return
  }

  const db = readDb()
  db.doctors = normalizeDoctors(doctors)
  writeDb(db)
}
