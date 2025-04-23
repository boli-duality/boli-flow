"use strict";
import { app, BrowserWindow } from "electron";
import { resolve } from "path";
console.log("icon", import.meta.resolve("./public/favicon.jpg").toString());
console.log("icon", resolve(import.meta.dirname, "public/favicon.jpg"));
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: resolve(import.meta.dirname, "public/favicon.png")
    // webPreferences: {
    //   preload: join(__dirname, 'preload.js')
    // }
  });
  mainWindow.loadURL("http://localhost:5173");
}
app.whenReady().then(() => {
  createWindow();
  app.on("activate", function() {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
app.on("window-all-closed", function() {
  if (process.platform !== "darwin") app.quit();
});
