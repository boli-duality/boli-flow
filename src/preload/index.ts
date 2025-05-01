import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('BF', {
  getConfig: () => ipcRenderer.invoke('getConfig'),
})
