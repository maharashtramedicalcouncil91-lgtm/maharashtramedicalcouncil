import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const inputPathArg = process.argv[2]

if (!inputPathArg) {
  console.error('Usage: node scripts/import-colleges-from-csv.mjs <path-to-csv>')
  process.exit(1)
}

const inputPath = resolve(process.cwd(), inputPathArg)
const outputPath = resolve(process.cwd(), 'src/data/indianMedicalColleges.js')

const csv = readFileSync(inputPath, 'utf8')
const lines = csv.split(/\r?\n/).filter(Boolean)

if (lines.length < 2) {
  console.error('CSV appears empty.')
  process.exit(1)
}

const header = lines[0].split(',').map((h) => h.trim().toLowerCase())
const nameIndex = header.findIndex((h) =>
  ['college', 'college name', 'name and address of medical college / medical institution', 'name'].includes(h),
)

if (nameIndex === -1) {
  console.error('Could not find a college name column in CSV header.')
  process.exit(1)
}

const extractCsvCells = (line) => {
  const cells = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i]
    if (ch === '"' && line[i + 1] === '"') {
      current += '"'
      i += 1
      continue
    }
    if (ch === '"') {
      inQuotes = !inQuotes
      continue
    }
    if (ch === ',' && !inQuotes) {
      cells.push(current.trim())
      current = ''
      continue
    }
    current += ch
  }
  cells.push(current.trim())
  return cells
}

const colleges = new Set()

for (let i = 1; i < lines.length; i += 1) {
  const row = extractCsvCells(lines[i])
  const name = String(row[nameIndex] || '').trim()
  if (!name) {
    continue
  }
  colleges.add(name.replace(/\s+/g, ' '))
}

const sorted = Array.from(colleges).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }))

const output = `export const indianMedicalColleges = ${JSON.stringify(sorted, null, 2)}\n`
writeFileSync(outputPath, output, 'utf8')

console.log(`Imported ${sorted.length} colleges into ${outputPath}`)
