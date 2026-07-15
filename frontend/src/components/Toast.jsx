import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  if (!toast) return null;

  const isSuccess = toast.type === 'success';

  return (
    <div className={`toast-notification ${toast.type}`}>
      <div className="toast-icon">
        {isSuccess ? (
          <CheckCircle2 size={18} className="icon-success" />
        ) : (
          <AlertCircle size={18} className="icon-error" />
        )}
      </div>
      <div className="toast-message">{toast.message}</div>
      <button onClick={onClose} className="toast-close-btn" aria-label="Close Notification">
        <X size={14} />
      </button>
    </div>
  );
}
