import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electron', {
  port: () => ipcRenderer.invoke('port'),
})
