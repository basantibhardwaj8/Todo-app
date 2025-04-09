// 'use client'

// import React from 'react'
// import { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
// import axios from 'axios'
// import { format } from 'date-fns'
// import  useTodoStore from '@/store/todoStore'
// import { Todo } from '../store/todoStore'

// const TodoList = forwardRef<{ fetchTodos: () => void }, {}>(function TodoList(_, ref) {
//   const [todos, setTodos] = useState<Todo[]>([])
//   const [page, setPage] = useState(1)
//   const [totalPages, setTotalPages] = useState(1)
//   const [isLoading, setIsLoading] = useState(false)
//   const { selectedTodo, setSelectedTodo } = useTodoStore()

//   const fetchTodos = async () => {
//     try {
//       setIsLoading(true)
//       const response = await axios.get(`http://localhost:5001/api/todos?page=${page}&limit=10`)
//       setTodos(response.data.todos)
//       setTotalPages(response.data.totalPages)
//     } catch (error) {
//       console.error('Error fetching todos:', error)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   useImperativeHandle(ref, () => ({
//     fetchTodos
//   }))

//   useEffect(() => {
//     fetchTodos()
//   }, [page])

//   return (
//     <div>
//       {/* Search Bar */}
//       <div className="inline-block items-center bg-black text-white rounded-lg mb-4 px-3 py-2">
//         <span className="text-gray-400 mr-2">TODO</span>
//         {/* <input
//           type="text"
//           placeholder="Search..."
//           className="bg-transparent text-white placeholder-gray-400 focus:outline-none flex-1"
//         /> */}
//       </div>

//       {/* Todo List */}
//       <div className="space-y-3">
//         {todos.map((todo) => (
//           <div
//             key={todo._id}
//             onClick={() => setSelectedTodo(todo)}
//             className={`p-4 rounded-lg cursor-pointer transition-colors ${
//               selectedTodo?._id === todo._id
//                 ? 'border-2 border-black bg-white'
//                 : 'border border-gray-200 bg-white hover:border-gray-300'
//             }`}
//           >
//             <div className="flex flex-col">
//               <div className="flex justify-between items-start mb-2">
//                 <h3 className="font-medium text-gray-900">{todo.title}</h3>
//                 <span className="text-xs text-gray-400">
//                   {format(new Date(todo.createdAt), 'MMM d, yyyy')}
//                 </span>
//               </div>
//               <p className="text-sm text-gray-500 line-clamp-2">{todo.description}</p>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Pagination */}
//       {totalPages > 1 && (
//         <div className="flex justify-between items-center mt-4">
//           <button
//             onClick={() => setPage((p) => Math.max(1, p - 1))}
//             disabled={page === 1}
//             className="text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50"
//           >
//             ← Previous
//           </button>
//           <span className="text-sm text-gray-600">
//             Page {page} of {totalPages}
//           </span>
//           <button
//             onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
//             disabled={page === totalPages}
//             className="text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50"
//           >
//             Next →
//           </button>
//         </div>
//       )}
//     </div>
//   )
// })

// export default TodoList 

'use client'

import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import axios from 'axios'
import { format } from 'date-fns'
import useTodoStore from '@/store/todoStore'
import { Todo } from '../store/todoStore'
import TodoComponent from './TodoComponent'

const TodoList = forwardRef<{ fetchTodos: () => void }, {}>(function TodoList(_, ref) {
  const [todos, setTodos] = useState<Todo[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const { selectedTodo, setSelectedTodo } = useTodoStore()

  const fetchTodos = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_KEY}/api/todos?page=${page}&limit=10`)
      setTodos(response.data.todos)
      setTotalPages(response.data.totalPages)
    } catch (error) {
      console.error('Error fetching todos:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdate = async (id: string, updatedTodo: Partial<Todo>) => {
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_KEY}/api/todos/${id}`, updatedTodo)
      fetchTodos()
    } catch (error) {
      console.error('Error updating todo:', error)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_KEY}/api/todos/${id}`)
      fetchTodos()
    } catch (error) {
      console.error('Error deleting todo:', error)
    }
  }

  useImperativeHandle(ref, () => ({
    fetchTodos,
  }))

  useEffect(() => {
    fetchTodos()
  }, [page])

  return (
    <div>
      {/* Header */}
      <div className="inline-block items-center bg-black text-white rounded-lg mb-4 px-3 py-2">
        <span className="text-gray-400 mr-2">TODO</span>
      </div>

      {/* Todo List */}
      <div className="space-y-3">
        {todos.map((todo) => (
          <div
            key={todo._id}
            onClick={() => setSelectedTodo(todo)}
          >
            <TodoComponent
              todo={todo}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50"
          >
            ← Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  )
})

export default TodoList