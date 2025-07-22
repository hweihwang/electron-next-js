import { app, BrowserWindow, ipcMain, session } from 'electron'
import { autoUpdater } from 'electron-updater'
import * as path from 'node:path'
import { prisma } from './lib/prisma'

if (require('electron-squirrel-startup')) app.quit()

// Initialize database schema
const initializeDatabase = async () => {
  try {
    // This will create the tables if they don't exist
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS Todo (
        id TEXT PRIMARY KEY,
        text TEXT NOT NULL,
        completed BOOLEAN DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `
  } catch (error) {
    console.error('Database initialization failed:', error)
  }
}

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false, // Allow loading local files
      allowRunningInsecureContent: true,
    },
  })

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:3000')
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, 'renderer/index.html'))
  }
}

app.whenReady().then(async () => {
  // Set CSP to allow local resources
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': ['default-src \'self\' \'unsafe-inline\' \'unsafe-eval\' data: file:']
      }
    })
  })
  
  await initializeDatabase()
  createWindow()
  
  // Check for updates (only in production)
  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'production') {
    autoUpdater.checkForUpdatesAndNotify()
  }
})
app.on('activate', () => BrowserWindow.getAllWindows().length === 0 && createWindow())
app.on('window-all-closed', () => process.platform !== 'darwin' && app.quit())

// Simple ID generator
const generateId = () => Math.random().toString(36).substring(2) + Date.now().toString(36)

// IPC handlers
ipcMain.handle('todos:getAll', () => prisma.todo.findMany({ orderBy: { createdAt: 'desc' } }))
ipcMain.handle('todos:create', (_, text: string) => prisma.todo.create({ data: { id: generateId(), text } }))
ipcMain.handle('todos:update', (_, id: string, data: any) => prisma.todo.update({ where: { id }, data }))
ipcMain.handle('todos:delete', async (_, id: string) => {
  await prisma.todo.delete({ where: { id } })
  return { success: true }
})
