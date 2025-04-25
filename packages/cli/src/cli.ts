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
const outdir = resolve(process.cwd(), 'build')
const loader = {
  '.jpg': 'copy',
  '.png': 'copy',
  '.svg': 'copy',
  '.ttf': 'copy',
  '.woff': 'copy',
  '.woff2': 'copy',
  '.eot': 'copy',
  '.html': 'copy',
  '.ico': 'copy',
} as const

const cli = cac('flow')

let app: ChildProcess | undefined
function openApp() {
  if (app) return
  app = execa('electron build/main.js', { stdiout: 'inherit', stderr: 'inherit' })
  app.on('close', async () => {
    app = undefined
    const { restart } = await inquirer.prompt({
      type: 'list',
      name: 'restart',
      message: '操作',
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
    if (existsSync(outdir)) rmSync(outdir, { recursive: true, force: true })
    await build({
      entryPoints: ['src/**/*'],
      outdir,
      packages: 'bundle',
      loader,
    })

    const execaArr = config.electron?.dev?.execa
    if (!execaArr) return
    execaArr.forEach(({ command, options, on = {} }: any) => {
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

cli.command('build').action(async () => {
  // execa('pnpm build', { cwd: 'packages/renderer', stdiout: 'inherit', stderr: 'inherit' }).then(
  //   () => {}
  // )
  // execa('pnpm build', { cwd: 'packages/server', stdiout: 'inherit', stderr: 'inherit' }).then(
  //   () => {}
  // )
  if (existsSync(outdir)) rmSync(outdir, { recursive: true, force: true })
  await build({
    entryPoints: ['src/**/*'],
    outdir,
    packages: 'bundle',
    loader,
  })
  openApp()
})

cli.help()
cli.parse()

const exitSignals = ['SIGINT', 'SIGTERM', 'SIGQUIT', 'SIGKILL', 'SIGHUP']
exitSignals.forEach(signal => process.on(signal, () => treeKill(process.pid)))
