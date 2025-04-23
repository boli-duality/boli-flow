export default {
  electron: {
    dev: {
      scripts: ['cd packages/renderer && pnpm run dev', 'cd packages/server && pnpm run start:dev'],
    },
  },
}
