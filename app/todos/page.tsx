'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

// TypeScript interface for todo items
interface Todo {
  id: number
  task: string
  status: string
  inserted_at?: string
  updated_at?: string
}

export default function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTodos()
  }, [])

  async function fetchTodos() {
    try {
      setLoading(true)
      setError(null)

      console.log('🔍 Fetching todos from Supabase...')
      
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .order('inserted_at', { ascending: false })

      if (error) {
        console.error('❌ Supabase error:', error)
        setError(`Database error: ${error.message}`)
        return
      }

      console.log('✅ Todos fetched successfully:', data)
      setTodos(data || [])

    } catch (err) {
      console.error('❌ Fetch error:', err)
      setError('Failed to fetch todos')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading todos...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md">
            <h2 className="font-bold mb-2">Error Loading Todos</h2>
            <p>{error}</p>
            <button 
              onClick={fetchTodos}
              className="mt-3 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            📝 Supabase Todos
          </h1>
          <p className="text-gray-600">
            Connected to Supabase • {todos.length} todos found
          </p>
        </div>

        {/* Connection Status */}
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          <div className="flex items-center">
            <span className="text-green-500 mr-2">✅</span>
            <span className="font-medium">Supabase Connected Successfully!</span>
          </div>
          <p className="text-sm mt-1">
            URL: {process.env.NEXT_PUBLIC_SUPABASE_URL}
          </p>
        </div>

        {/* Todos List */}
        {todos.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📝</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No todos found</h3>
            <p className="text-gray-600 mb-4">
              The 'todos' table is empty or doesn't exist yet.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
              <p className="text-sm text-blue-800">
                <strong>To add sample data:</strong><br/>
                Go to your Supabase dashboard → Table Editor → Create 'todos' table with columns:
              </p>
              <ul className="text-xs text-blue-700 mt-2 text-left">
                <li>• id (int8, primary key)</li>
                <li>• task (text)</li>
                <li>• status (text)</li>
                <li>• created_at (timestamptz)</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                All Todos ({todos.length})
              </h2>
            </div>
            <ul className="divide-y divide-gray-200">
              {todos.map((todo) => (
                <li key={todo.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {todo.task}
                      </p>
                      {todo.inserted_at && (
                        <p className="text-xs text-gray-500 mt-1">
                          Created: {new Date(todo.inserted_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div className="ml-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        todo.status === 'Completed' 
                          ? 'bg-green-100 text-green-800'
                          : todo.status === 'In Progress'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {todo.status}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Refresh Button */}
        <div className="text-center mt-8">
          <button
            onClick={fetchTodos}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            🔄 Refresh Todos
          </button>
        </div>

        {/* Debug Info */}
        <div className="mt-8 bg-gray-100 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Debug Info</h3>
          <div className="text-xs text-gray-600 space-y-1">
            <p>• Supabase URL: {process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not configured'}</p>
            <p>• Anon Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Configured ✅' : 'Not configured ❌'}</p>
            <p>• Todos Count: {todos.length}</p>
            <p>• Last Fetch: {new Date().toLocaleTimeString()}</p>
          </div>
        </div>
      </div>
    </div>
  )
}