export default function debounce(fn: Function, delay?: number) {
  let timeoutId: any;

  return function (...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}
