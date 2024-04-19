import { useEffect, useState } from 'react';
import Content from './Content';
import SideBar from './Sidebar';
import Topbar from './Topbar';

export default function Layout() {
  const [showSidebar, setShowSidebar] = useState(true);

  const mql = window.matchMedia('(max-width: 800px)');

  useEffect(() => {
    mql.addEventListener('change', (ev) => {
      // if window expands over 800px open sidebar if already open
      if (ev.matches && showSidebar) {
        setShowSidebar(false);
      }
      // if window shrinks under 800px open sidebar or if already open
      else if (!ev.matches && (window.innerWidth >= 800 || showSidebar)) {
        setShowSidebar(true);
      }
    });
  }, [showSidebar]);

  function toggleSidebar(toggle?: boolean) {
    setShowSidebar(toggle || !showSidebar);
  }

  return (
    <>
      <div id="app-layout">
        <Topbar toggleSidebar={toggleSidebar} />
        <SideBar showSidebar={showSidebar} />
        <Content />
      </div>
    </>
  );
}
