'use client'

import { useState, useEffect } from 'react'
import { Todo } from '../../types'

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)

  const loadTodos = async () => {
    const fetchedTodos = await window.electronAPI.todos.getAll()
    setTodos(fetchedTodos)
    setLoading(false)
  }

  const addTodo = async (text: string) => {
    const newTodo = await window.electronAPI.todos.create(text)
    setTodos(prev => [newTodo, ...prev])
    return newTodo
  }

  const updateTodo = async (id: string, data: any) => {
    const updatedTodo = await window.electronAPI.todos.update(id, data)
    setTodos(prev => prev.map(todo => todo.id === id ? updatedTodo : todo))
    return updatedTodo
  }

  const deleteTodo = async (id: string) => {
    await window.electronAPI.todos.delete(id)
    setTodos(prev => prev.filter(todo => todo.id !== id))
  }

  const toggleTodo = async (id: string) => {
    const todo = todos.find(t => t.id === id)
    if (todo) await updateTodo(id, { completed: !todo.completed })
  }

  useEffect(() => { loadTodos() }, [])

  return { todos, loading, addTodo, deleteTodo, toggleTodo }
}
