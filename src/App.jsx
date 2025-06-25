import React, { useState, useEffect } from 'react'
import { Plus, Check, Trash2, Edit3, Sun, Moon } from 'lucide-react'
import './App.css'

function App() {
  const [todos, setTodos] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editingText, setEditingText] = useState('')
  const [darkMode, setDarkMode] = useState(false)

  // Load todos from localStorage on component mount
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos')
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos))
    }
    
    const savedDarkMode = localStorage.getItem('darkMode')
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode))
    }
  }, [])

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  // Save dark mode preference
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
    if (darkMode) {
      document.body.classList.add('dark')
    } else {
      document.body.classList.remove('dark')
    }
  }, [darkMode])

  const addTodo = () => {
    if (inputValue.trim() !== '') {
      const newTodo = {
        id: Date.now(),
        text: inputValue.trim(),
        completed: false,
        createdAt: new Date().toISOString()
      }
      setTodos([newTodo, ...todos])
      setInputValue('')
    }
  }

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const startEditing = (id, text) => {
    setEditingId(id)
    setEditingText(text)
  }

  const saveEdit = () => {
    if (editingText.trim() !== '') {
      setTodos(todos.map(todo =>
        todo.id === editingId ? { ...todo, text: editingText.trim() } : todo
      ))
    }
    setEditingId(null)
    setEditingText('')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditingText('')
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTodo()
    }
  }

  const handleEditKeyPress = (e) => {
    if (e.key === 'Enter') {
      saveEdit()
    } else if (e.key === 'Escape') {
      cancelEdit()
    }
  }

  const completedCount = todos.filter(todo => todo.completed).length
  const totalCount = todos.length

  return (
    <div className={`app ${darkMode ? 'dark' : ''}`}>
      <div className="container">
        <header className="header">
          <h1 className="title">
            📝 TODO
            <span className="subtitle">美しいタスク管理</span>
          </h1>
          <button 
            className="theme-toggle"
            onClick={() => setDarkMode(!darkMode)}
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </header>

        <div className="stats">
          <span className="stat">
            完了: {completedCount}/{totalCount}
          </span>
          {totalCount > 0 && (
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${(completedCount / totalCount) * 100}%` }}
              />
            </div>
          )}
        </div>

        <div className="input-section">
          <div className="input-group">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="新しいタスクを追加..."
              className="todo-input"
            />
            <button 
              onClick={addTodo}
              className="add-button"
              disabled={!inputValue.trim()}
            >
              <Plus size={20} />
            </button>
          </div>
        </div>

        <div className="todos-section">
          {todos.length === 0 ? (
            <div className="empty-state">
              <p>まだタスクがありません</p>
              <p className="empty-subtitle">上記のフィールドから新しいタスクを追加してください</p>
            </div>
          ) : (
            <ul className="todos-list">
              {todos.map(todo => (
                <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className="check-button"
                    aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
                  >
                    {todo.completed && <Check size={16} />}
                  </button>
                  
                  {editingId === todo.id ? (
                    <input
                      type="text"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      onKeyPress={handleEditKeyPress}
                      onBlur={saveEdit}
                      className="edit-input"
                      autoFocus
                    />
                  ) : (
                    <span 
                      className="todo-text"
                      onClick={() => !todo.completed && startEditing(todo.id, todo.text)}
                    >
                      {todo.text}
                    </span>
                  )}
                  
                  <div className="todo-actions">
                    {!todo.completed && editingId !== todo.id && (
                      <button
                        onClick={() => startEditing(todo.id, todo.text)}
                        className="action-button edit-button"
                        aria-label="Edit todo"
                      >
                        <Edit3 size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="action-button delete-button"
                      aria-label="Delete todo"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

export default App