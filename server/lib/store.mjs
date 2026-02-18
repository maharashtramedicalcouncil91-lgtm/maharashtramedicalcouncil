import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defaultSiteContent } from '../../src/data/defaultSiteContent.js'

const dataDir = resolve(process.cwd(), 'server/data')
const dbPath = resolve(dataDir, 'db.json')

const defaultDb = {
  doctors: defaultSiteContent.doctors || [],
}

const ensureDb = () => {
  if (!existsSync(dataDir)) {
    mkdirSync(dataDir, { recursive: true })
  }

  if (!existsSync(dbPath)) {
    writeFileSync(dbPath, JSON.stringify(defaultDb, null, 2), 'utf8')
  }
}

const readDb = () => {
  ensureDb()
  const raw = readFileSync(dbPath, 'utf8')
  try {
    const parsed = JSON.parse(raw)
    return {
      ...defaultDb,
      ...parsed,
      doctors: Array.isArray(parsed?.doctors) ? parsed.doctors : defaultDb.doctors,
    }
  } catch {
    return defaultDb
  }
}

const writeDb = (data) => {
  ensureDb()
  writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8')
}

export const getDoctors = () => readDb().doctors

export const setDoctors = (doctors) => {
  const db = readDb()
  db.doctors = doctors
  writeDb(db)
}
