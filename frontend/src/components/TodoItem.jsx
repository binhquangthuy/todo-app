import React from 'react';
import { Trash2, Edit2, Calendar, AlertCircle } from 'lucide-react';

export default function TodoItem({ todo, onToggle, onDelete, onEdit }) {
  const isOverdue = () => {
    if (!todo.dueDate || todo.completed) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(todo.dueDate);
    return due < today;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''} priority-${todo.priority.toLowerCase()}`}>
      <div className="todo-item-main">
        <label className="checkbox-container">
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => onToggle(todo.id)}
            aria-label="Toggle task completion"
          />
          <span className="checkmark"></span>
        </label>

        <div className="todo-item-content">
          <h4 className="todo-item-title">{todo.title}</h4>
          {todo.description && (
            <p className="todo-item-desc">{todo.description}</p>
          )}
          
          <div className="todo-item-meta">
            <span className={`priority-tag ${todo.priority.toLowerCase()}`}>
              {todo.priority}
            </span>
            
            {todo.dueDate && (
              <span className={`due-date-tag ${isOverdue() ? 'overdue' : ''}`}>
                {isOverdue() ? <AlertCircle size={12} /> : <Calendar size={12} />}
                <span>{isOverdue() ? 'Overdue: ' : ''}{formatDate(todo.dueDate)}</span>
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="todo-item-actions">
        <button 
          onClick={() => onEdit(todo)} 
          className="action-btn edit-btn"
          title="Edit Task"
        >
          <Edit2 size={16} />
        </button>
        <button 
          onClick={() => onDelete(todo.id)} 
          className="action-btn delete-btn"
          title="Delete Task"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
