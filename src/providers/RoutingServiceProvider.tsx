import { FC, ReactNode, createContext, useState } from 'react';
import { RoutePath, Routes } from '../router/Routes';

type ContextState = {
  navigate: (path: string) => void;
  path: RoutePath;
};

export const Context = createContext<ContextState | null>(null);

const ROOT_PATH: RoutePath = '/';

export const RoutingServiceProvider: FC<{ children: ReactNode }> = (props) => {
  const [route, setRoute] = useState<RoutePath>(ROOT_PATH);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  // useEffect(() => {
  window.addEventListener('popstate', () => {
    function updateRoute() {
      const { pathname } = window.location;
      let path = pathname;
      if (!Routes[pathname]) {
        path = ROOT_PATH.toString();
      }
      setRoute(path);
    }

    window.addEventListener('popstate', updateRoute);

    () => {
      window.removeEventListener('popstate', updateRoute);
    };
  });
  // });

  return (
    <Context.Provider value={{ navigate, path: route }}>
      {props.children}
    </Context.Provider>
  );
};
