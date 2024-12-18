import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
// Import the database module

import fs from 'fs'

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false, // Keep this false for security
      enableRemoteModule: false,
      webSecurity: false, // This might be needed to load local files
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false, // Keep this false for security
      enableRemoteModule: false,
      webSecurity: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

ipcMain.handle('read-local-file', async (event, filename) => {
  try {
    // Hardcode the uploads directory path
    const uploadsDir = join(__dirname, '..', '..', 'uploads')

    // Alternative method to get the absolute path
    const fullPath = join(uploadsDir, filename)

    // Verify file exists before reading
    if (!fs.existsSync(fullPath)) {
      console.error('File does not exist:', fullPath)
      return null
    }

    // Read file
    const fileBuffer = fs.readFileSync(fullPath)

    // Determine mime type based on file extension
    const ext = require('path').extname(filename).toLowerCase()
    const mimeType =
      ext === '.png'
        ? 'image/png'
        : ext === '.gif'
          ? 'image/gif'
          : ext === '.webp'
            ? 'image/webp'
            : 'image/jpeg'

    // Convert to base64
    return `data:${mimeType};base64,${fileBuffer.toString('base64')}`
  } catch (error) {
    console.error('Error reading file in main process:', error)
    console.error('Filename:', filename)
    console.error('Full path attempted:', join(__dirname, '..', '..', 'uploads', filename))
    return null
  }
})

ipcMain.on('ping', () => {
  console.log('Received ping from renderer process!')
})
// App lifecycle
app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
