// Modules to control application life and create native browser window
import { app, BrowserWindow } from 'electron'
import { join } from 'node:path'
import { getPort } from 'get-port-please'
import { setupIpcMain } from './ipcMain.js'

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true'

const PROD = app.isPackaged || process.env.mode == 'production'

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
// 配置
const port = await getPort(5290)
process.env.PORT = port.toString()
setupIpcMain({ port })
// 启动后端服务器
const SERVER_MAIN = './server/main.js'
await import(SERVER_MAIN)

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: join(import.meta.dirname, 'public/favicon.ico'),
    webPreferences: {
      preload: join(import.meta.dirname, 'preload/index.js'),
    },
  })

  // const menu = Menu.buildFromTemplate([
  //   {
  //     label: app.name,
  //     submenu: [
  //       {
  //         click: () => mainWindow.webContents.send('update-counter', 1),
  //         label: 'Increment',
  //       },
  //       {
  //         click: () => mainWindow.webContents.send('update-counter', -1),
  //         label: 'Decrement',
  //       },
  //     ],
  //   },
  // ])

  // Menu.setApplicationMenu(menu)

  // and load the index.html of the app.
  // mainWindow.loadFile('index.html')
  if (PROD) mainWindow.loadFile('renderer/index.html')
  else mainWindow.loadURL('http://localhost:5173')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length == 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})
