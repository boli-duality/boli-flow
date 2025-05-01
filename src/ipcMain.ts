import { ipcMain } from 'electron'

export function setupIpcMain(options: { port: number }) {
  const config = {
    port: options.port,
  }
  ipcMain.handle('getConfig', () => config)
}
