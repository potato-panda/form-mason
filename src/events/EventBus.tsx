type EventListener = [
  name: string | symbol,
  listener: (...args: any[]) => void,
];

type EventDispatcher = [name: string, ...args: any[]];

export class EventBus {
  eventListeners: EventListener[] = [];
  onceEventListeners: EventListener[] = [];

  emit(...[name, args]: EventDispatcher) {
    for (const [, [key, value]] of this.eventListeners.entries()) {
      if (key === name && typeof value === 'function') {
        value(args);
      }
    }
    for (const [index, [key, value]] of this.onceEventListeners.entries()) {
      if (key === name) {
        if (typeof value === 'function') {
          value(args);
        }
        if (value.toString() === args.toString()) {
          this.onceEventListeners.splice(index, 1);
        }
      }
    }
  }
  addEventListener(...[name, ...args]: EventListener) {
    return this.eventListeners.push([name, ...args]);
  }
  addEventListenerOnce(...[name, ...args]: EventListener) {
    this.onceEventListeners.push([name, ...args]);
  }
  removeEventListener(...[name, args]: EventListener) {
    for (const [index, [key, value]] of this.eventListeners.entries())
      if (key === name && value.toString() === args.toString()) {
        this.eventListeners.splice(index, 1);
      }
    for (const [index, [key, value]] of this.onceEventListeners.entries())
      if (key === name && value.toString() === args.toString()) {
        this.onceEventListeners.splice(index, 1);
      }
  }
}

export default new EventBus();
