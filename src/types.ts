export interface Todo {
  id: string
  text: string
  completed: boolean
  createdAt: Date
  updatedAt: Date
}

export interface ElectronAPI {
  todos: {
    getAll: () => Promise<Todo[]>
    create: (text: string) => Promise<Todo>
    update: (id: string, data: { text?: string; completed?: boolean }) => Promise<Todo>
    delete: (id: string) => Promise<{ success: boolean }>
  }
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}
