import React from 'react';
import { Award, CheckCircle, ClipboardList, TrendingUp } from 'lucide-react';

export default function Stats({ todos }) {
  const total = todos.length;
  const completed = todos.filter(t => t.completed).length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Custom greeting message based on progress
  let greeting = "Start your day by organizing tasks!";
  if (percentage === 100 && total > 0) {
    greeting = "Outstanding! You've crushed all your tasks! 🎉";
  } else if (percentage >= 75) {
    greeting = "Almost there! Keep the momentum going! 💪";
  } else if (percentage >= 50) {
    greeting = "Halfway done! You are doing great! ⚡";
  } else if (percentage > 0) {
    greeting = "Good start! Keep ticking those items off! 🚀";
  }

  return (
    <div className="stats-container">
      <div className="stats-header">
        <div>
          <h3>Overview</h3>
          <p className="greeting-text">{greeting}</p>
        </div>
        <div className="progress-badge">
          <TrendingUp size={16} />
          <span>{percentage}% Completed</span>
        </div>
      </div>

      <div className="stats-progress-track">
        <div 
          className="stats-progress-bar" 
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="stats-grid">
        <div className="stats-card">
          <div className="stats-card-icon blue">
            <ClipboardList size={18} />
          </div>
          <div className="stats-card-info">
            <span className="stats-value">{total}</span>
            <span className="stats-label">Total Tasks</span>
          </div>
        </div>

        <div className="stats-card">
          <div className="stats-card-icon green">
            <CheckCircle size={18} />
          </div>
          <div className="stats-card-info">
            <span className="stats-value">{completed}</span>
            <span className="stats-label">Completed</span>
          </div>
        </div>

        <div className="stats-card">
          <div className="stats-card-icon orange">
            <Award size={18} />
          </div>
          <div className="stats-card-info">
            <span className="stats-value">{total - completed}</span>
            <span className="stats-label">Pending</span>
          </div>
        </div>
      </div>
    </div>
  );
}
