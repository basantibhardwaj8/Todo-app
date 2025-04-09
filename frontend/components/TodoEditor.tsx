'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import useTodoStore from '@/store/todoStore'

interface Props {
  onUpdate?: () => void
}

type TextFormat = 'bold' | 'italic' | 'underline'
type TextAlignment = 'left' | 'center' | 'right'

export default function TodoEditor({ onUpdate }: Props) {
  const { selectedTodo, setSelectedTodo } = useTodoStore()
  const [isLoading, setIsLoading] = useState(false)
  const [form, setForm] = useState({
    title: '',
    description: '',
    format: {
      bold: false,
      italic: false,
      underline: false
    },
    alignment: 'left' as TextAlignment
  })

  useEffect(() => {
    if (selectedTodo) {
      setForm({
        title: selectedTodo.title,
        description: selectedTodo.description,
        format: selectedTodo.format || {
          bold: false,
          italic: false,
          underline: false
        },
        alignment: selectedTodo.alignment || 'left'
      })
    } else {
      setForm({
        title: '',
        description: '',
        format: {
          bold: false,
          italic: false,
          underline: false
        },
        alignment: 'left'
      })
    }
  }, [selectedTodo])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (selectedTodo) {
        await axios.put(`${process.env.NEXT_PUBLIC_API_KEY}/api/todos/${selectedTodo._id}`, form)
      } else {
        await axios.post(`${process.env.NEXT_PUBLIC_API_KEY}/api/todos`, form)
      }

      setForm({
        title: '',
        description: '',
        format: {
          bold: false,
          italic: false,
          underline: false
        },
        alignment: 'left'
      })
      setSelectedTodo(null)
      onUpdate?.()
    } catch (error) {
      console.error('Error saving todo:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedTodo) return

    try {
      setIsLoading(true)
      await axios.delete(`${process.env.NEXT_PUBLIC_API_KEY}/api/todos/${selectedTodo._id}`)
      setSelectedTodo(null)
      onUpdate?.()
    } catch (error) {
      console.error('Error deleting todo:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleFormat = (type: TextFormat) => {
    setForm(prev => ({
      ...prev,
      format: {
        ...prev.format,
        [type]: !prev.format[type]
      }
    }))
  }

  const setAlignment = (alignment: TextAlignment) => {
    setForm(prev => ({
      ...prev,
      alignment
    }))
  }

  const getTextStyle = () => {
    return {
      fontWeight: form.format.bold ? 'bold' : 'normal',
      fontStyle: form.format.italic ? 'italic' : 'normal',
      textDecoration: form.format.underline ? 'underline' : 'none',
      textAlign: form.alignment
    }
  }

  return (
    <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">New Additions</h2>
        {selectedTodo && (
          <button
            onClick={handleDelete}
            disabled={isLoading}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <span className="sr-only">Delete</span>
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-4 border-b pb-4">
        <button
          type="button"
          onClick={() => toggleFormat('bold')}
          className={`p-2 text-sm sm:text-base text-gray-600 hover:text-gray-900 font-medium ${
            form.format.bold ? 'text-black' : ''
          }`}
        >
          B
        </button>
        <button
          type="button"
          onClick={() => toggleFormat('italic')}
          className={`p-2 text-sm sm:text-base text-gray-600 hover:text-gray-900 italic ${
            form.format.italic ? 'text-black' : ''
          }`}
        >
          I
        </button>
        <button
          type="button"
          onClick={() => toggleFormat('underline')}
          className={`p-2 text-sm sm:text-base text-gray-600 hover:text-gray-900 underline ${
            form.format.underline ? 'text-black' : ''
          }`}
        >
          U
        </button>
        <div className="hidden sm:block h-4 w-px bg-gray-300" />
        <div className="flex gap-2 sm:gap-4">
          <button
            type="button"
            onClick={() => setAlignment('left')}
            className={`p-2 text-gray-600 hover:text-gray-900 ${
              form.alignment === 'left' ? 'text-black' : ''
            }`}
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => setAlignment('center')}
            className={`p-2 text-gray-600 hover:text-gray-900 ${
              form.alignment === 'center' ? 'text-black' : ''
            }`}
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => setAlignment('right')}
            className={`p-2 text-gray-600 hover:text-gray-900 ${
              form.alignment === 'right' ? 'text-black' : ''
            }`}
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Title"
          className="w-full px-0 text-base sm:text-lg font-medium placeholder-gray-400 border-0 focus:ring-0"
          required
        />
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="To stay representative of framework & new example apps."
          rows={4}
          className="w-full px-0 text-sm sm:text-base text-gray-600 placeholder-gray-400 border-0 focus:ring-0 resize-none"
          style={getTextStyle()}
          required
        />
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-900 disabled:opacity-50 text-sm sm:text-base"
          >
            {isLoading ? 'Saving...' : selectedTodo ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  )
} 