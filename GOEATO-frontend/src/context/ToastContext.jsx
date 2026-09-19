import React, { createContext, useContext, useState, useCallback } from 'react';
import { IconAlert, IconCheck, IconClose, IconInfo } from '../components/icons.jsx';

const ToastContext = createContext(null);

let idCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message, type = 'info', duration = 3500) => {
    const id = ++idCounter;
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
    return id;
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="toast-container" aria-live="polite">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            <span className="toast-icon">{toast.type === 'success' && <IconCheck size={16} />}{toast.type === 'error' && <IconClose size={16} />}{toast.type === 'warning' && <IconAlert size={16} />}{toast.type === 'info' && <IconInfo size={16} />}</span>
            <span className="toast-msg">{toast.message}</span>
            <button
              className="toast-close"
              onClick={() => removeToast(toast.id)}
              aria-label="Close notification"
            >
              <IconClose size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    return { addToast: (msg) => console.log('Toast:', msg), removeToast: () => {} };
  }
  return context;
};
