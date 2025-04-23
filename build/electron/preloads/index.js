"use strict";
import { contextBridge, ipcRenderer } from "electron";
contextBridge.exposeInMainWorld(
  "electron",
  {
    sendMsg: (msg) => ipcRenderer.invoke("msg", msg),
    onReplyMsg: (cb) => ipcRenderer.on("reply-msg", (e, msg) => {
      cb(msg);
    })
  }
);
