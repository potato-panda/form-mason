import { FC, ReactNode, createContext, useState } from 'react';

type DispatchEventArgs = (
  ...args: ConstructorParameters<typeof CustomEvent>
) => boolean;
type AddEventListenerArgs = EventTarget['addEventListener'];
type RemoveEventListenerArgs = EventTarget['removeEventListener'];

type ContextState = {
  publish: DispatchEventArgs;
  subscribe: AddEventListenerArgs;
  unsubscribe: RemoveEventListenerArgs;
};

export const Context = createContext<ContextState | null>(null);

export const EventBusServiceProvider: FC<{ children: ReactNode }> = (props) => {
  const [bus] = useState<EventTarget>(new EventTarget());

  const ctxState: ContextState = {
    publish: (...args) => {
      return bus.dispatchEvent(new CustomEvent(...args));
    },
    subscribe(...args): void {
      bus.addEventListener(...args);
    },

    unsubscribe: (...args) => {
      bus.removeEventListener(...args);
    },
  };

  return <Context.Provider value={ctxState}>{props.children}</Context.Provider>;
};
