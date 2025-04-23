import { resolve } from 'node:path'
import Readline from 'node:readline/promises'

import { cac } from 'cac'
import { build } from 'esbuild'
import { execa, ResultPromise } from 'execa'
import { loadConfig } from 'c12'
import { existsSync, rmSync } from 'node:fs'
import { type ChildProcess } from 'node:child_process'

const { config } = await loadConfig({ name: 'flow' })
console.log('config', config)

const cli = cac('flow')
const rl = Readline.createInterface({ input: process.stdin, output: process.stdout })

let app: ChildProcess | undefined
function openApp() {
  if (app) return
  app = execa('electron build/electron/main.js')
  app.stdout?.on('data', data => {
    process.stdout.write(data)
  })
  app.stderr?.on('data', data => {
    process.stderr.write(data)
  })
  app.on('close', () => {
    app = undefined
    rl.question('Press enter key to open the app...').then(openApp)
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
      const execaArr = config.electron.dev.execa
      const childArr: ResultPromise[] = execaArr.map(({ command, options, on = {} }: any) => {
        const child = execa(command, options)
        child.stdout?.on('data', data => {
          process.stdout.write(data)
          on.stdout?.({ openApp })
        })
        child.stderr?.on('data', data => {
          process.stderr.write(data)
          on.stderr?.({ openApp })
        })
        child.on('exit', () => {
          console.log('exit', command)

          on.exit?.({ openApp })
        })
        child.on('close', () => {
          console.log('close', command)
          on.close?.({ openApp })
        })
        return child
      })
      childArr.forEach(child => {
        if (child.stdin) process.stdin.pipe(child.stdin)
      })
    })
  })

cli.help()
cli.parse()
