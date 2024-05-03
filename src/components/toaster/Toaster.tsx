import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import EventBus from '../../events/EventBus';
import { Toast } from './Toast';
import './toaster.css';

export interface ToastData {
  header: string;
  message: any;
  type?: 'ok' | 'error' | 'info' | 'warning';
  timeout?: number;
  onClick?: () => void;
}

export function Toaster() {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  useEffect(() => {
    EventBus.addEventListener('toast', push);
    return () => EventBus.removeEventListener('toast', push);
  }, [toasts]);

  const push = (toast: ToastData) => {
    // queue updates to toasts
    setToasts((toasts) => [...toasts, toast]);
    if (toast.timeout && toast.timeout > 0) {
      setTimeout(() => {
        remove(toast);
      }, toast.timeout);
    }
  };

  const remove = (toast: ToastData) => {
    // queue updates to toasts
    setToasts((toasts) => toasts.filter((t) => t !== toast));
  };

  return createPortal(
    <div className="toaster">
      <div className="toaster-container">
        {toasts.map((toast, i) => (
          <Toast
            toast={toast}
            key={i}
            id={i}
            closeToast={() => remove(toast)}
          />
        ))}
      </div>
    </div>,
    document.body
  );
}
