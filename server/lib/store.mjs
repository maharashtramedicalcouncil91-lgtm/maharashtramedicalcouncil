import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const dataDir = resolve(process.cwd(), 'server/data')
const dbPath = resolve(dataDir, 'db.json')

const defaultDoctors = [
  {
    photo: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=500&q=80',
    registrationId: 'MMC-2024-0001',
    email: 'doctor.demo@mmc.in',
    name: 'Dr. Asha Kulkarni',
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

const readDb = () => {
  try {
    ensureDb()
    const raw = readFileSync(dbPath, 'utf8')
    const parsed = JSON.parse(raw)
    memoryDb = {
      ...defaultDb,
      ...parsed,
      doctors: Array.isArray(parsed?.doctors) ? parsed.doctors : defaultDb.doctors,
    }
    return memoryDb
  } catch {
    return {
      ...memoryDb,
      doctors: Array.isArray(memoryDb?.doctors) ? memoryDb.doctors : defaultDb.doctors,
    }
  }
}

const writeDb = (data) => {
  const nextData = {
    ...defaultDb,
    ...data,
    doctors: Array.isArray(data?.doctors) ? data.doctors : defaultDb.doctors,
  }

  memoryDb = nextData

  try {
    ensureDb()
    writeFileSync(dbPath, JSON.stringify(nextData, null, 2), 'utf8')
  } catch {
    // Vercel serverless filesystem may be read-only in /var/task.
    // Keep runtime behavior consistent by storing data in memory for this invocation.
  }
}

export const getDoctors = () => readDb().doctors

export const setDoctors = (doctors) => {
  const db = readDb()
  db.doctors = doctors
  writeDb(db)
}
