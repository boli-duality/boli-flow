import { resolve } from 'node:path'
import Readline from 'node:readline/promises'

import { cac } from 'cac'
import { build } from 'esbuild'
import { execa, type Options as ExecaOptions } from 'execa'
import { loadConfig, watchConfig } from 'c12'
import { existsSync, rmSync } from 'node:fs'
import { type ChildProcess } from 'node:child_process'

const { config } = await loadConfig({ name: 'flow' })
console.log('config', config)

const cli = cac('flow')
const rl = Readline.createInterface({ input: process.stdin, output: process.stdout })

const renderer = resolve(process.cwd(), 'packages/renderer')
const server = resolve(process.cwd(), 'packages/server')

const children: any[] = []
function exeLong(file: string | URL, args?: readonly string[], options?: ExecaOptions) {
  const child = execa(file, args, options)
  children.push(child)
  return child
}

function reopenElectron(electron: ChildProcess) {
  electron.on('exit', () => {
    rl.question('Press enter key to open the app...').then(() => {
      reopenElectron(exeLong('electron', ['build/electron/main.js'], { stdout: 'inherit' }))
    })
  })
}

cli
  .command('[root]')
  .alias('dev')
  .action(() => {
    const outdir = resolve(process.cwd(), 'build/electron')
    if (existsSync(outdir)) rmSync(outdir, { recursive: true, force: true })

    build({
      entryPoints: ['src/**/*'],
      outdir,
      packages: 'bundle',
      loader: {
        '.jpg': 'copy',
        '.png': 'copy',
      },
    }).then(async () => {
      const vite = exeLong('npx', ['vite', 'dev'], {
        cwd: renderer,
        stderr: 'inherit',
      })
      let electron: ChildProcess
      vite.stdout?.on('data', (data) => {
        process.stdout.write(data)
        if(electron) return
        electron = exeLong('electron', ['build/electron/main.js'], {
          stdout: 'inherit',
          stderr: 'inherit',
        })
        reopenElectron(electron)
      })
      const nest = exeLong('npx', ['nest', 'start', '--watch'], {
        cwd: server,
        stdio: ['ignore', 'inherit', 'inherit'],
      })
    })
  })

cli.help()
cli.parse()

const handleTerminationSignal = (signal: string) => {
  process.on(signal, () => {
    children.forEach((child) => {
      if (!child.killed) child.kill(signal)
    })
  })
}

// handleTerminationSignal('SIGINT')
// handleTerminationSignal('SIGTERM')
// handleTerminationSignal('exit')
