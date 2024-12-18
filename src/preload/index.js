import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import path from 'path'
import fs from 'fs'

const categoryDB = require('../../database/CategoryManager')
const translationDB = require('../../database/KeyTranslation')
const exportFiles = require('../../database/ExportZip')
const _utilities = require('../../database/utilities')
const settings = require('../../database/SettingsManager')
const translationViewData = require('../../database/TranslationView')

console.log('preload running')
// Custom APIs for renderer

const api = {}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('myAPI', {
      electron: electronAPI,
      api,
      // Add a method to read local files via IPC
      readLocalFile: (filename) => ipcRenderer.invoke('read-local-file', filename),

      // Debug method to log file paths
      debugFilePath: (filename) => {
        console.log('Current directory:', process.cwd())
        console.log('Filename:', filename)
        console.log('Attempted full path:', path.join(__dirname, '..', '..', 'uploads', filename))
      },
      sqlite: { categoryDB },
      kettranslation: { translationDB },
      downloadzip: { exportFiles },
      utilitie: { _utilities },
      settings,
      translationView: { translationViewData },
      fileOperations: {
        openFile: () => ipcRenderer.invoke('dialog:openFile'),
        saveFile: () => ipcRenderer.invoke('dialog:saveFile'),
        openExcelFile: () => ipcRenderer.invoke('dialog:openExcelFile'),
        openLLSFile: () => ipcRenderer.invoke('dialog:openLLSFile')
      },
      windowOperations: {
        openWindow: (windowName) => ipcRenderer.send('open-window', windowName),
        openWindowQs: (windowName, qs) => ipcRenderer.send('open-window-qs', windowName, qs)
      }
    })
  } catch (error) {
    console.error(error)
  }
} else {
  window.myAPI = {
    // Add a method to read local files via IPC
    readLocalFile: (filename) => ipcRenderer.invoke('read-local-file', filename),

    // Debug method to log file paths
    debugFilePath: (filename) => {
      console.log('Current directory:', process.cwd())
      console.log('Filename:', filename)
      console.log('Attempted full path:', path.join(__dirname, '..', '..', 'uploads', filename))
    },
    electron: electronAPI,
    api,
    fileReader: fileReader,
    sqlite: { categoryDB },
    kettranslation: { translationDB },
    downloadzip: { exportFiles },
    utilitie: { _utilities },
    settings,
    translationView: { translationViewData },
    fileOperations: {
      openFile: () => ipcRenderer.invoke('dialog:openFile'),
      saveFile: () => ipcRenderer.invoke('dialog:saveFile'),
      openExcelFile: () => ipcRenderer.invoke('dialog:openExcelFile'),
      openLLSFile: () => ipcRenderer.invoke('dialog:openLLSFile')
    },
    windowOperations: {
      openWindow: (windowName) => ipcRenderer.send('open-window', windowName),
      openWindowQs: (windowName, qs) => ipcRenderer.send('open-window-qs', windowName, qs)
    }
  }
}
