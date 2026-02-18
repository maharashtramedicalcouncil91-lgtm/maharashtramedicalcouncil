import { randomBytes } from 'node:crypto'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { hashSecret } from '../server/lib/security.mjs'

const randomToken = (length) => randomBytes(length).toString('base64url').slice(0, length)

const signupKey = `MMC-KEY-${randomToken(16)}`
const password = `MMC-PASS-${randomToken(18)}`
const authTokenSecret = randomToken(48)

const values = {
  ADMIN_SIGNUP_KEY_HASH: hashSecret(signupKey),
  ADMIN_PASSWORD_HASH: hashSecret(password),
  AUTH_TOKEN_SECRET: authTokenSecret,
}

const envFileContent = [
  `API_PORT=8787`,
  `CLIENT_ORIGIN=http://localhost:5173`,
  `ADMIN_SIGNUP_KEY_HASH=${values.ADMIN_SIGNUP_KEY_HASH}`,
  `ADMIN_PASSWORD_HASH=${values.ADMIN_PASSWORD_HASH}`,
  `AUTH_TOKEN_SECRET=${values.AUTH_TOKEN_SECRET}`,
  `RESEND_API_KEY=`,
  `RESEND_FROM_EMAIL=`,
].join('\n')

const shouldWrite = process.argv.includes('--write')

if (shouldWrite) {
  const envPath = resolve(process.cwd(), '.env')
  writeFileSync(envPath, envFileContent + '\n', 'utf8')
  console.log('Wrote .env with secure hashes and API settings.')
}

console.log('\nAdmin credentials (store safely):')
console.log(`Signup Key: ${signupKey}`)
console.log(`Password: ${password}`)
console.log('\nThese plaintext values are NOT stored in code.')
console.log('Only hashed values are used by the API.')

if (!shouldWrite) {
  console.log('\nRun with --write to create .env automatically:')
  console.log('node scripts/generate-admin-credentials.mjs --write')
}
