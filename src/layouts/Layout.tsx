import { useEffect, useState } from 'react';
import Content from './Content';
import Topbar from './Topbar';
import { Toaster } from '../components/toaster/Toaster';
import './layout.css';
import { TabManager } from './Tabs';

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
  }, []);

  function toggleSidebar(toggle?: boolean) {
    setShowSidebar(toggle || !showSidebar);
  }

  return (
    <>
      <Toaster />
      <div id="app-layout">
        <TabManager>
          <Topbar toggleSidebar={toggleSidebar} />
          {/* <SideBar showSidebar={showSidebar} /> */}
          <Content />
        </TabManager>
      </div>
    </>
  );
}
