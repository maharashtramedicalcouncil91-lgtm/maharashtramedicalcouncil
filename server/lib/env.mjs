import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const parseEnvContent = (content) => {
  const lines = content.split(/\r?\n/)
  const output = {}

  for (const rawLine of lines) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) {
      continue
    }

    const eqIndex = line.indexOf('=')
    if (eqIndex === -1) {
      continue
    }

    const key = line.slice(0, eqIndex).trim()
    const value = line.slice(eqIndex + 1).trim().replace(/^['"]|['"]$/g, '')
    output[key] = value
  }

  return output
}

export const loadEnv = () => {
  const envPath = resolve(process.cwd(), '.env')
  const loaded = {}

  if (existsSync(envPath)) {
    const content = readFileSync(envPath, 'utf8')
    Object.assign(loaded, parseEnvContent(content))
  }

  Object.keys(loaded).forEach((key) => {
    if (!process.env[key]) {
      process.env[key] = loaded[key]
    }
  })
}
