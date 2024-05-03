import { EventBus } from '../src/events/EventBus';
import { afterEach, describe, expect, it, vi } from 'vitest';

describe('EventBus', () => {
  const bus = vi.mocked(new EventBus());
  const eventName = 'test';

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(bus).toBeDefined();
    expect(bus).toBeInstanceOf(EventBus);
    expect(bus.eventListeners).toBeInstanceOf(Array);
  });

  it('should add and remove listeners', () => {
    const addEventListenerSpy = vi.spyOn(bus, 'addEventListener');
    bus.addEventListener(eventName, () => {});
    expect(addEventListenerSpy).toBeCalledTimes(1);
    expect(bus.eventListeners.length).toEqual(1);
    expect(bus.eventListeners[0][0]).toEqual(eventName);

    const removeEventListenerSpy = vi.spyOn(bus, 'removeEventListener');
    bus.removeEventListener(eventName, () => {});
    expect(removeEventListenerSpy).toBeCalledTimes(1);
    expect(bus.eventListeners.length).toEqual(0);
    expect(bus.eventListeners[0]).toBeUndefined();
  });

  it('emit', () => {
    const emitSpy = vi.spyOn(bus, 'emit');
    bus.addEventListener(eventName, () => {});
    bus.emit(eventName, 'test');
    expect(emitSpy).toBeCalledTimes(1);
    expect(emitSpy.mock.calls[0][0]).toEqual(eventName);
  });

  it('once', () => {
    const addEventListenerSpy = vi.spyOn(bus, 'addEventListenerOnce');
    bus.addEventListenerOnce(eventName, () => {});
    expect(addEventListenerSpy).toBeCalledTimes(1);
    expect(bus.onceEventListeners.length).toEqual(1);
    expect(bus.onceEventListeners[0][0]).toEqual(eventName);

    bus.emit(eventName, () => {});
    expect(bus.onceEventListeners.length).toEqual(0);
    expect(bus.onceEventListeners[0]).toBeUndefined();
  });
});
