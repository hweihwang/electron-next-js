'use client'

import { useState } from 'react'
import { Plus, Trash2, Check, Calendar, Target, Loader2 } from 'lucide-react'
import { useTodos } from '../hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function Todo() {
  const { todos, loading, addTodo, deleteTodo, toggleTodo } = useTodos()
  const [newTodo, setNewTodo] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAddTodo = async () => {
    if (!newTodo.trim() || isSubmitting) return
    
    setIsSubmitting(true)
    try {
      await addTodo(newTodo.trim())
      setNewTodo('')
    } catch (error) {
      // Handle error (could show toast notification)
    } finally {
      setIsSubmitting(false)
    }
  }

  const completedCount = todos.filter(todo => todo.completed).length
  const totalCount = todos.length

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-xl mb-4">
            <Target className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Todo App v1.1.0
          </h1>
          <p className="text-muted-foreground text-lg">
            Stay organized with shadcn/ui components
          </p>
        </div>

        {/* Stats Cards */}
        {totalCount > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-secondary-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Tasks</p>
                    <p className="text-xl font-semibold">{totalCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Check className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Completed</p>
                    <p className="text-xl font-semibold">{completedCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Target className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Remaining</p>
                    <p className="text-xl font-semibold">{totalCount - completedCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Add Task */}
        <Card>
          <CardHeader>
            <CardTitle>Add New Task</CardTitle>
            <CardDescription>
              What would you like to accomplish today?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Input
                placeholder="Enter a new task..."
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
                disabled={isSubmitting}
                className="flex-1"
              />
              <Button
                onClick={handleAddTodo}
                disabled={!newTodo.trim() || isSubmitting}
                size="icon"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Content */}
        {loading ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">Loading your tasks...</p>
            </CardContent>
          </Card>
        ) : totalCount > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Your Tasks</CardTitle>
              <CardDescription>
                {completedCount === totalCount && totalCount > 0
                  ? "🎉 All tasks completed! Excellent work!"
                  : `${totalCount - completedCount} tasks remaining`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {todos.map((todo, index) => (
                  <div
                    key={todo.id}
                    className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${
                      todo.completed
                        ? 'bg-muted border-muted'
                        : 'bg-card border-border hover:bg-accent'
                    }`}
                  >
                    <Button
                      onClick={() => toggleTodo(todo.id)}
                      variant="ghost"
                      size="icon"
                      className={`w-6 h-6 rounded-full border-2 ${
                        todo.completed
                          ? 'bg-green-500 border-green-500 text-white'
                          : 'border-muted-foreground/30 hover:border-primary'
                      }`}
                    >
                      {todo.completed && <Check className="h-3 w-3" />}
                    </Button>
                    <span
                      className={`flex-1 ${
                        todo.completed
                          ? 'line-through text-muted-foreground'
                          : 'text-foreground'
                      }`}
                    >
                      {todo.text}
                    </span>
                    <div className="text-xs text-muted-foreground">
                      #{index + 1}
                    </div>
                    <Button
                      onClick={() => deleteTodo(todo.id)}
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-10 h-10 text-secondary-foreground" />
              </div>
              <CardTitle className="mb-2">No tasks yet</CardTitle>
              <CardDescription>
                Start by adding your first task above to get organized!
              </CardDescription>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
