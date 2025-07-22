import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  todos: {
    getAll: () => ipcRenderer.invoke('todos:getAll'),
    create: (text: string) => ipcRenderer.invoke('todos:create', text),
    update: (id: string, data: any) => ipcRenderer.invoke('todos:update', id, data),
    delete: (id: string) => ipcRenderer.invoke('todos:delete', id),
  }
})
