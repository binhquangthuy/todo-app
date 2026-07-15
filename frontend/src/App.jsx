import React, { useState, useEffect } from 'react';
import { Search, Loader2, Sparkles, Filter, CheckSquare } from 'lucide-react';
import Stats from './components/Stats';
import TodoForm from './components/TodoForm';
import TodoItem from './components/TodoItem';
import Toast from './components/Toast';

export default function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTodo, setEditingTodo] = useState(null);
  
  // Filtering & Searching State
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Feedback notification
  const [toast, setToast] = useState(null);
  
  // Custom delete confirmation state
  const [deleteConfirmTodoId, setDeleteConfirmTodoId] = useState(null);

  // Fetch todos on mount
  useEffect(() => {
    fetchTodos();
  }, []);

  const showNotification = (message, type = 'success') => {
    setToast({ message, type });
  };

  const fetchTodos = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/v1/todos');
      if (!response.ok) {
        throw new Error('Failed to retrieve tasks. Please verify backend connection.');
      }
      const data = await response.json();
      setTodos(data);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error connecting to the backend.');
      showNotification(err.message || 'Error connecting to server', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitTodo = async (todoData) => {
    try {
      if (editingTodo) {
        // Edit Mode
        const response = await fetch(`/api/v1/todos/${editingTodo.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(todoData),
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.message || 'Failed to update task.');
        }

        const updated = await response.json();
        setTodos(prev => prev.map(t => t.id === updated.id ? updated : t));
        showNotification('Task updated successfully!');
        setEditingTodo(null);
      } else {
        // Add Mode
        const response = await fetch('/api/v1/todos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(todoData),
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.message || 'Failed to create task.');
        }

        const created = await response.json();
        setTodos(prev => [created, ...prev]);
        showNotification('Task created successfully!');
      }
    } catch (err) {
      console.error(err);
      showNotification(err.message, 'error');
    }
  };

  const handleToggleTodo = async (id) => {
    try {
      const response = await fetch(`/api/v1/todos/${id}/toggle`, {
        method: 'PATCH',
      });

      if (!response.ok) {
        throw new Error('Failed to toggle status.');
      }

      const updated = await response.json();
      setTodos(prev => prev.map(t => t.id === updated.id ? updated : t));
      
      if (updated.completed) {
        showNotification('Task completed! Keep it up! 🎉');
      } else {
        showNotification('Task marked as active.');
      }
    } catch (err) {
      console.error(err);
      showNotification(err.message, 'error');
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      const response = await fetch(`/api/v1/todos/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete task.');
      }

      setTodos(prev => prev.filter(t => t.id !== id));
      showNotification('Task deleted successfully.');
      
      // If we were editing this specific todo, cancel edit
      if (editingTodo && editingTodo.id === id) {
        setEditingTodo(null);
      }
    } catch (err) {
      console.error(err);
      showNotification(err.message, 'error');
    }
  };

  // Filter logic
  const filteredTodos = todos.filter(todo => {
    const matchesStatus = 
      statusFilter === 'ALL' || 
      (statusFilter === 'ACTIVE' && !todo.completed) || 
      (statusFilter === 'COMPLETED' && todo.completed);
      
    const matchesPriority = 
      priorityFilter === 'ALL' || 
      todo.priority === priorityFilter;

    const matchesSearch = 
      todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (todo.description && todo.description.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesStatus && matchesPriority && matchesSearch;
  });

  return (
    <div className="app-layout">
      {/* Background radial glow */}
      <div className="bg-glow-1"></div>
      <div className="bg-glow-2"></div>

      <header className="app-header">
        <div className="header-logo">
          <CheckSquare className="logo-icon" size={28} />
          <h1>PriorityTask<span>Hub</span></h1>
          <Sparkles className="sparkle-icon" size={16} />
        </div>
        <p className="header-tagline">Streamline your day, prioritize your life</p>
      </header>

      <main className="app-main-content">
        <Stats todos={todos} />

        <div className="app-grid-columns">
          {/* Left Column: Task Lists & Filters */}
          <div className="tasks-section-wrapper">
            <div className="filter-search-container">
              {/* Search Bar */}
              <div className="search-bar-wrapper">
                <Search size={18} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search tasks by title or content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>

              {/* Advanced Filter Buttons */}
              <div className="filters-row">
                <div className="filter-group">
                  <span className="filter-label">
                    <Filter size={12} /> Status:
                  </span>
                  <div className="filter-buttons">
                    <button 
                      onClick={() => setStatusFilter('ALL')} 
                      className={`filter-btn ${statusFilter === 'ALL' ? 'active' : ''}`}
                    >
                      All
                    </button>
                    <button 
                      onClick={() => setStatusFilter('ACTIVE')} 
                      className={`filter-btn ${statusFilter === 'ACTIVE' ? 'active' : ''}`}
                    >
                      Active
                    </button>
                    <button 
                      onClick={() => setStatusFilter('COMPLETED')} 
                      className={`filter-btn ${statusFilter === 'COMPLETED' ? 'active' : ''}`}
                    >
                      Completed
                    </button>
                  </div>
                </div>

                <div className="filter-group">
                  <span className="filter-label">
                    <Filter size={12} /> Priority:
                  </span>
                  <div className="filter-buttons">
                    <button 
                      onClick={() => setPriorityFilter('ALL')} 
                      className={`filter-btn ${priorityFilter === 'ALL' ? 'active' : ''}`}
                    >
                      All
                    </button>
                    <button 
                      onClick={() => setPriorityFilter('HIGH')} 
                      className={`filter-btn ${priorityFilter === 'HIGH' ? 'active' : ''} red`}
                    >
                      High
                    </button>
                    <button 
                      onClick={() => setPriorityFilter('MEDIUM')} 
                      className={`filter-btn ${priorityFilter === 'MEDIUM' ? 'active' : ''} orange`}
                    >
                      Medium
                    </button>
                    <button 
                      onClick={() => setPriorityFilter('LOW')} 
                      className={`filter-btn ${priorityFilter === 'LOW' ? 'active' : ''} blue`}
                    >
                      Low
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Tasks Container */}
            <div className="tasks-list-container">
              {loading ? (
                <div className="loading-state">
                  <Loader2 className="spinner" size={32} />
                  <p>Fetching your task board...</p>
                </div>
              ) : error ? (
                <div className="error-state">
                  <p className="error-message">{error}</p>
                  <button onClick={fetchTodos} className="btn-primary">
                    Try Again
                  </button>
                </div>
              ) : filteredTodos.length === 0 ? (
                <div className="empty-state">
                  <p>No tasks match your selected criteria.</p>
                  <p className="empty-subtext">Add a new task or modify filters to get started.</p>
                </div>
              ) : (
                <div className="todo-items-grid">
                  {filteredTodos.map(todo => (
                    <TodoItem
                      key={todo.id}
                      todo={todo}
                      onToggle={handleToggleTodo}
                      onDelete={setDeleteConfirmTodoId}
                      onEdit={setEditingTodo}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Form (Create/Edit) */}
          <div className="form-section-wrapper">
            <div className="sticky-form-container">
              <TodoForm
                onSubmit={handleSubmitTodo}
                editingTodo={editingTodo}
                onCancel={() => setEditingTodo(null)}
              />
            </div>
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <p>&copy; {new Date().getFullYear()} PriorityTaskHub. Built with Spring Boot, React, and PostgreSQL.</p>
      </footer>

      {/* Action result notification banner */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Custom Confirmation Modal */}
      {deleteConfirmTodoId && (
        <div className="modal-overlay" id="delete-confirmation-modal">
          <div className="modal-content">
            <h3>Delete Task?</h3>
            <p>Are you sure you want to delete this task? This action cannot be undone.</p>
            <div className="modal-actions">
              <button 
                onClick={() => setDeleteConfirmTodoId(null)} 
                className="btn-secondary"
                id="cancel-delete-btn"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  handleDeleteTodo(deleteConfirmTodoId);
                  setDeleteConfirmTodoId(null);
                }} 
                className="btn-primary btn-danger"
                id="confirm-delete-btn"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
