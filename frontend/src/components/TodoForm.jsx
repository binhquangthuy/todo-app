import React, { useState, useEffect } from 'react';
import { Plus, Save, X, Calendar, Flag } from 'lucide-react';

export default function TodoForm({ onSubmit, editingTodo, onCancel }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    if (editingTodo) {
      setTitle(editingTodo.title || '');
      setDescription(editingTodo.description || '');
      setPriority(editingTodo.priority || 'MEDIUM');
      setDueDate(editingTodo.dueDate || '');
    } else {
      resetForm();
    }
  }, [editingTodo]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPriority('MEDIUM');
    setDueDate('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      priority,
      dueDate: dueDate || null
    });
    
    if (!editingTodo) {
      resetForm();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="todo-form">
      <h3 className="form-title">
        {editingTodo ? 'Edit Task' : 'Add New Task'}
      </h3>
      
      <div className="form-group">
        <label htmlFor="task-title">Title *</label>
        <input
          id="task-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Design Landing Page"
          required
          maxLength={100}
        />
      </div>

      <div className="form-group">
        <label htmlFor="task-desc">Description</label>
        <textarea
          id="task-desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Brief summary of the task..."
          rows={3}
          maxLength={500}
        />
      </div>

      <div className="form-row">
        <div className="form-group flex-1">
          <label htmlFor="task-priority">
            <Flag size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
            Priority
          </label>
          <select
            id="task-priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>

        <div className="form-group flex-1">
          <label htmlFor="task-due">
            <Calendar size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
            Due Date
          </label>
          <input
            id="task-due"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
      </div>

      <div className="form-actions">
        {editingTodo && (
          <button type="button" onClick={onCancel} className="btn-secondary">
            <X size={16} />
            Cancel
          </button>
        )}
        <button type="submit" className="btn-primary" disabled={!title.trim()}>
          {editingTodo ? (
            <>
              <Save size={16} />
              Save Changes
            </>
          ) : (
            <>
              <Plus size={16} />
              Add Task
            </>
          )}
        </button>
      </div>
    </form>
  );
}
