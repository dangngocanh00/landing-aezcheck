import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'))
const expected = pkg.packageManager.split('@')[1]
if (process.versions.node.split('.')[0] !== '24') throw new Error(`Node 24.x required; found ${process.version}`)
const corepack = process.platform === 'win32' ? 'corepack.cmd' : 'corepack'
const actual = execFileSync(corepack, ['pnpm', '--version'], { encoding: 'utf8', shell: process.platform === 'win32' }).trim()
console.log(`Build toolchain: Node ${process.version}; pnpm ${actual}; expected ${pkg.packageManager}`)
if (actual !== expected) throw new Error(`Expected pnpm ${expected}, found ${actual}`)
