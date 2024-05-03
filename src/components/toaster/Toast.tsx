import { ToastData } from './Toaster';
import './toaster.css';

export function Toast({
  toast: { header, type, message, onClick },
  closeToast,
  id,
}: {
  id: number;
  toast: ToastData;
  closeToast: () => void;
}) {
  const labelledby = `alert${id}Header`;
  const describedby = `alert${id}Message`;
  return (
    <div
      role="alert"
      aria-labelledby={labelledby}
      aria-describedby={describedby}
      className={`toast ${type}`}
      onClick={() => onClick && onClick()}
      style={{ cursor: onClick ? 'pointer' : '' }}
    >
      <div className="toast-header">
        <strong id={labelledby}>{header}</strong>
        <button
          type="button"
          role="button"
          className="toast-close"
          onClick={closeToast}
        >
          &#10006;
        </button>
      </div>
      <div id={describedby} className="toast-body">
        {message}
      </div>
    </div>
  );
}
