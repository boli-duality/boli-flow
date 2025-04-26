export default {
  electron: {
    dev: {
      execa: [
        {
          command: 'pnpm dev',
          options: { cwd: 'packages/renderer', verbose: 'full' },
          on: {
            stdout: ({ openApp, data }) => {
              if (data.includes('ready')) openApp()
            },
          },
        },
        {
          command: 'pnpm start:dev',
          options: { cwd: 'packages/server', verbose: 'full' },
        },
      ],
    },
  },
}
