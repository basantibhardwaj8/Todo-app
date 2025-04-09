'use client'

import { useCallback, useRef } from 'react'
import TodoList from '@/components/TodoList'
import TodoEditor from '@/components/TodoEditor'

export default function Home() {
  const todoListRef = useRef<{ fetchTodos: () => void } | null>(null)

  const handleTodoUpdate = useCallback(() => {
    todoListRef.current?.fetchTodos()
  }, [])

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-black text-white p-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center">
            <div className="text-green-500 text-2xl font-bold mr-2">▲</div>
            <h1 className="text-xl font-semibold">TODO</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          <div className="w-[400px]">
            <TodoList ref={todoListRef} />
          </div>
          <div className="flex-1">
            <TodoEditor onUpdate={handleTodoUpdate} />
          </div>
        </div>
      </div>
    </div>
  )
}
