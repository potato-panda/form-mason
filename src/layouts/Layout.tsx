import { useEffect, useState } from 'react';
import Content from './Content';
import SideBar from './Sidebar';
import Topbar from './Topbar';
import { useRouteError, isRouteErrorResponse } from 'react-router-dom';
import EventBus from '../events/EventBus';
import { Toaster } from '../components/toaster/Toaster';

export default function Layout() {
  const [showSidebar, setShowSidebar] = useState(true);

  const mql = window.matchMedia('(max-width: 800px)');

  useEffect(() => {
    const onResize = (ev: MediaQueryListEvent) => {
      // if window expands over 800px open sidebar if already open
      if (ev.matches && showSidebar) {
        setShowSidebar(false);
      }
      // if window shrinks under 800px open sidebar or if already open
      else if (!ev.matches && (window.innerWidth >= 800 || showSidebar)) {
        setShowSidebar(true);
      }
    };
    mql.addEventListener('change', onResize);

    return () => {
      mql.removeEventListener('change', onResize);
    };
  }, [showSidebar]);

  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    const { status, statusText, data } = error;

    EventBus.emit('toast', {
      name: 'error',
      header: 'Error' + status + ' ' + statusText,
      message: data.message,
      type: 'error',
      timeout: 5000,
    });
  }

  function toggleSidebar(toggle?: boolean) {
    setShowSidebar(toggle || !showSidebar);
  }

  return (
    <>
      <Toaster />
      <div id="app-layout">
        <Topbar toggleSidebar={toggleSidebar} />
        {/* <SideBar showSidebar={showSidebar} /> */}
        <Content />
      </div>
    </>
  );
}
