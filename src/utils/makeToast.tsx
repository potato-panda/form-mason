import { ToastData } from '../components/toaster/Toaster';
import EventBus from '../events/EventBus';

export function makeToast({
  type = 'info',
  header,
  message,
  timeout,
}: ToastData) {
  EventBus.emit('toast', {
    type,
    header,
    message,
    timeout,
  });
}
