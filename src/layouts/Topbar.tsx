import { useContext } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Context } from './Tabs';

export default function TopBar({}: { toggleSidebar: () => void }) {
  const tabs = useContext(Context);
  const location = useLocation();

  const tabClassName = (
    {
      isActive,
    }: {
      isActive: boolean;
      isPending: boolean;
      isTransitioning: boolean;
    },
    tabKey?: string
  ): string => {
    const key = location.state?.['key'];

    const active = isActive && (tabKey ? key === tabKey : true) ? 'active' : '';
    return ['tab-label', active].join(' ');
  };

  return (
    <>
      <div id="app-topbar" className="align-content-center">
        {/* <button type="button" onClick={() => toggleSidebar()}>
          Toggle Sidebar
        </button> */}
        <span></span>
        <div className="tab-bar">
          <div className="tab">
            <NavLink id="forms-list" className={tabClassName} to="/">
              Forms
            </NavLink>
          </div>
          <Tabs />
          <div className="tab">
            <NavLink id="add-tab" className={tabClassName} to="/form/edit">
              <span>&#43;</span>
            </NavLink>
          </div>
        </div>
      </div>
    </>
  );

  function Tabs() {
    const navigate = useNavigate();
    return tabs.getTabs().map((tab, i, arr) => {
      const onClose = () => {
        tabs.closeTab(tab.key);
        if (i > 0) {
          const prevTab = arr[i - 1];
          navigate(prevTab.path, {
            state: {
              key: prevTab.key,
            },
          });
        } else {
          navigate('/');
        }
      };

      return (
        <div className="tab" key={tab.key}>
          <NavLink
            id={tab.key}
            className={(props) => tabClassName(props, tab.key)}
            to={tab.path}
            state={{ key: tab.key }}
          >
            {tab.name}
          </NavLink>
          <div className="tab-close" onClick={onClose}>
            X
          </div>
        </div>
      );
    });
  }
}
