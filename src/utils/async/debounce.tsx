export default function debounce(
  ...[callback, delay]: Parameters<(typeof global)['setTimeout']>
) {
  let timeoutId: any;

  return function (...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback(...args), delay);
  };
}
