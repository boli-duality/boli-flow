export default {
  electron: {
    dev: {
      execa: [
        {
          command: 'pnpm dev',
          options: { cwd: 'packages/renderer' },
          // on: {
          //   stdout: ({ openApp }) => {
          //     openApp()
          //   },
          // },
        },
        // {
        //   command: 'pnpm start:dev',
        //   options: { cwd: 'packages/server', stdio: ['ignore', 'inherit', 'inherit'] },
        // },
      ],
    },
  },
}
