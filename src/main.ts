import { app, BrowserWindow, ipcMain } from 'electron'
import * as path from 'node:path'
import { prisma } from './lib/prisma'

if (require('electron-squirrel-startup')) app.quit()

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  })

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:3000')
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, 'renderer/index.html'))
  }
}

app.whenReady().then(createWindow)
app.on('activate', () => BrowserWindow.getAllWindows().length === 0 && createWindow())
app.on('window-all-closed', () => process.platform !== 'darwin' && app.quit())

// IPC handlers
ipcMain.handle('todos:getAll', () => prisma.todo.findMany({ orderBy: { createdAt: 'desc' } }))
ipcMain.handle('todos:create', (_, text: string) => prisma.todo.create({ data: { text } }))
ipcMain.handle('todos:update', (_, id: string, data: any) => prisma.todo.update({ where: { id }, data }))
ipcMain.handle('todos:delete', async (_, id: string) => {
  await prisma.todo.delete({ where: { id } })
  return { success: true }
})
