// scripts/fix-dts.mjs
// After tsdown build, create stable index.d.ts / index.d.cts entry points
// that re-export from the hashed files rolldown-plugin-dts generates.
import { readdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const distDir = new URL('../dist', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')

const files = await readdir(distDir)

const dts = files.find(f => f.match(/^index-.+\.d\.ts$/) && !f.endsWith('.map'))
const dcts = files.find(f => f.match(/^index-.+\.d\.cts$/) && !f.endsWith('.map'))

if (!dts) {
  console.error('[fix-dts] Could not find hashed .d.ts file in dist/')
  process.exit(1)
}
if (!dcts) {
  console.error('[fix-dts] Could not find hashed .d.cts file in dist/')
  process.exit(1)
}

await writeFile(join(distDir, 'index.d.ts'), `export * from './${dts.replace(/\.ts$/, '')}'\n`)
await writeFile(join(distDir, 'index.d.cts'), `export * from './${dcts.replace(/\.cts$/, '')}'\n`)

console.log(`[fix-dts] Created index.d.ts -> ${dts}`)
console.log(`[fix-dts] Created index.d.cts -> ${dcts}`)
