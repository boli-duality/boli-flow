import { resolve } from 'node:path'
import { existsSync, readFileSync, rmSync } from 'node:fs'
import { type ChildProcess } from 'node:child_process'

import { cac } from 'cac'
import { build, context } from 'esbuild'
import { execa } from 'execa'
import { loadConfig } from 'c12'
import treeKill from 'tree-kill'
import inquirer from 'inquirer'
import { copy, copyFile } from 'fs-extra'
import { sync as globSync } from 'fast-glob'
import swc from '@swc/core'

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
const baseExecaOptions = {
  stdout: ['pipe', 'inherit'] as const,
  stderr: ['pipe', 'inherit'] as const,
}

const cli = cac('flow')

let app: ChildProcess | undefined
function openApp(mode = 'development') {
  if (app) return
  app = execa({ ...baseExecaOptions, env: { mode } })`electron build/main.js`
  app.on('close', async () => {
    app = undefined
    inquirer
      .prompt({
        type: 'input',
        name: 'restart',
        message: '按回车键打开窗口...',
      })
      .then(() => openApp(mode))
      .catch(() => {})
  })
}

cli
  .command('[root]')
  .alias('dev')
  .action(async () => {
    const execaArr = config.electron?.dev?.execa
    if (!execaArr) return
    execaArr.forEach(({ command, options, on = {} }: any) => {
      const child = execa({ ...baseExecaOptions, ...options })`${command}`
      if (!on) return
      child.stdout?.on('data', data => {
        on.stdout?.({ openApp, data: data.toString() })
      })
      child.stderr?.on('data', data => {
        on.stderr?.({ openApp, data: data.toString() })
      })
    })

    if (existsSync(outdir)) rmSync(outdir, { recursive: true, force: true })
    context({
      entryPoints: globSync(['src/**/*', '!src/preload/**/*']),
      outdir,
      packages: 'external',
      loader,
    }).then(ctx => ctx.watch())
    context({
      entryPoints: ['src/preload/**/*'],
      outdir: `${outdir}/preload`,
      packages: 'external',
      loader,
      platform: 'node',
      format: 'cjs',
    }).then(ctx => ctx.watch())
    context({
      entryPoints: ['packages/server/src/**/*'],
      outdir: `${outdir}/server`,
      packages: 'external',
      loader,
      plugins: [
        {
          name: 'swc-loader',
          setup(build) {
            build.onLoad({ filter: /\.(ts|tsx)$/ }, args => {
              const code = readFileSync(args.path, 'utf-8')
              const { code: transformed } = swc.transformSync(code, {
                sourceMaps: false,
                module: {
                  type: 'es6',
                  strictMode: true,
                  noInterop: false,
                },
                minify: true,
                exclude: ['.*\\.spec\\.ts$'],
                jsc: {
                  externalHelpers: false,
                  target: 'esnext',
                  parser: {
                    syntax: 'typescript',
                    tsx: true,
                    decorators: true,
                    dynamicImport: true,
                  },
                  transform: {
                    legacyDecorator: true,
                    decoratorMetadata: true,
                    react: {
                      throwIfNamespace: false,
                      useBuiltins: false,
                      pragma: 'React.createElement',
                      pragmaFrag: 'React.Fragment',
                      importSource: 'react',
                    },
                  },
                  keepClassNames: true,
                  paths: {
                    '@/*': ['src/*'],
                  },
                  baseUrl: './',
                },
              })
              return { contents: transformed }
            })
          },
        },
      ],
    }).then(ctx => ctx.watch())
  })

cli.command('build').action(async () => {
  if (existsSync(outdir)) rmSync(outdir, { recursive: true, force: true })
  build({
    entryPoints: ['src/preload/**/*'],
    outdir: `${outdir}/preload`,
    packages: 'bundle',
    loader,
    platform: 'node',
    format: 'cjs',
    minify: true,
  })
  await build({
    entryPoints: globSync(['src/**/*', '!src/preload/**/*']),
    outdir,
    packages: 'bundle',
    loader,
    minify: true,
  })
  await build({
    entryPoints: ['packages/server/src/**/*'],
    outdir: `${outdir}/server`,
    packages: 'external',
    loader,
    plugins: [
      {
        name: 'swc-loader',
        setup(build) {
          build.onLoad({ filter: /\.(ts|tsx)$/ }, args => {
            const code = readFileSync(args.path, 'utf-8')
            const { code: transformed } = swc.transformSync(code, {
              sourceMaps: false,
              module: {
                type: 'es6',
                strictMode: true,
                noInterop: false,
              },
              minify: true,
              exclude: ['.*\\.spec\\.ts$'],
              jsc: {
                externalHelpers: false,
                target: 'esnext',
                parser: {
                  syntax: 'typescript',
                  tsx: true,
                  decorators: true,
                  dynamicImport: true,
                },
                transform: {
                  legacyDecorator: true,
                  decoratorMetadata: true,
                  react: {
                    throwIfNamespace: false,
                    useBuiltins: false,
                    pragma: 'React.createElement',
                    pragmaFrag: 'React.Fragment',
                    importSource: 'react',
                  },
                },
                keepClassNames: true,
                paths: {
                  '@/*': ['src/*'],
                },
                baseUrl: './',
              },
            })
            return { contents: transformed }
          })
        },
      },
    ],
  })
  await Promise.all([
    execa('pnpm build', { cwd: 'packages/renderer', ...baseExecaOptions }).then(() =>
      copy(resolve(process.cwd(), 'packages/renderer/dist'), `${outdir}/renderer`, {
        overwrite: true,
      })
    ),
    copyFile(resolve(process.cwd(), 'package.json'), `${outdir}/package.json`),
  ])

  openApp('production')
})

cli.help()
cli.parse()

const exitSignals = ['SIGINT', 'SIGTERM', 'SIGQUIT', 'SIGKILL', 'SIGHUP']
exitSignals.forEach(signal => process.on(signal, () => treeKill(process.pid, signal)))
