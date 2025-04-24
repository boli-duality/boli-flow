import { resolve } from 'node:path'
import { existsSync, rmSync } from 'node:fs'
import { type ChildProcess } from 'node:child_process'

import { cac } from 'cac'
import { build } from 'esbuild'
import { execa } from 'execa'
import { loadConfig } from 'c12'
import treeKill from 'tree-kill'
import inquirer from 'inquirer'

const { config } = await loadConfig({ name: 'flow' })

const cli = cac('flow')

let app: ChildProcess | undefined
function openApp() {
  if (app) return
  app = execa('electron build/electron/main.js', { stdiout: 'inherit', stderr: 'inherit' })
  app.on('close', async () => {
    app = undefined
    const { restart } = await inquirer.prompt({
      type: 'list',
      name: 'restart',
      message: '是否重新打开窗口',
      choices: [
        { name: '重新打开窗口', value: true },
        { name: '关闭进程', value: false },
      ],
    })
    if (restart) openApp()
    else treeKill(process.pid)
  })
}

cli
  .command('[root]')
  .alias('dev')
  .action(async () => {
    const outdir = resolve(process.cwd(), 'build/electron')
    if (existsSync(outdir)) rmSync(outdir, { recursive: true, force: true })
    await build({
      entryPoints: ['src/**/*'],
      outdir,
      packages: 'bundle',
      loader: {
        '.jpg': 'copy',
        '.png': 'copy',
      },
    })

    const execaArr = config.electron.dev.execa
    execaArr.forEach(({ command, options, on = {} }: any) => {
      console.log(command, options)

      const child = execa(command, options)
      child.stdout?.on('data', data => {
        process.stdout.write(data)
        on.stdout?.({ openApp, data: data.toString() })
      })
      child.stderr?.on('data', data => {
        process.stderr.write(data)
        on.stderr?.({ openApp, data: data.toString() })
      })
      child.on('exit', () => {
        console.log('exit', command)
        on.exit?.({ openApp })
      })
      child.on('close', () => {
        console.log('close', command)
        on.close?.({ openApp })
      })
    })
  })

cli.help()
cli.parse()

const exitSignals = ['SIGINT', 'SIGTERM', 'SIGQUIT']
exitSignals.forEach(signal => process.on(signal, () => treeKill(process.pid)))
