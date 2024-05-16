import { createContext, useEffect, useState } from 'react';

interface Tab {
  path: string;
  name: string;
  key: string;
}

// Tab Session carries stateful data
interface TabSession extends Tab {
  data: any;
}

export const Context = createContext<{
  getTab: (path: string) => Tab | undefined;
  getTabByKey: (key: string) => Tab | undefined;
  getTabs: () => Tab[];
  setTabs: React.Dispatch<React.SetStateAction<Tab[]>>;
  openTab: (path: string, name: string, data?: any) => Tab;
  closeTab: (uuid: string) => void;
  getTabSessions: () => TabSession[];
  setTabSessions: React.Dispatch<React.SetStateAction<TabSession[]>>;
  pushTabSession: (session: TabSession) => void;
  deleteTabSession: (uuid: string) => void;
}>(null!);

export function TabManager({ children }: { children: React.ReactNode }) {
  const [tabs, setTabs] = useState<Tab[]>(
    JSON.parse(localStorage.getItem('tabs') ?? JSON.stringify([]))
  );

  const [tabSessions, setTabSessions] = useState<TabSession[]>(
    JSON.parse(sessionStorage.getItem('tabSessions') ?? JSON.stringify([]))
  );

  useEffect(() => {
    localStorage.setItem('tabs', JSON.stringify(tabs));
    sessionStorage.setItem('tabSessions', JSON.stringify(tabSessions));
    return () => {};
  }, [tabs]);

  useEffect(() => {
    sessionStorage.setItem('tabSessions', JSON.stringify(tabSessions));
    return () => {};
  }, [tabSessions]);

  const getTabs = () => tabs;

  const getTab = (path: string) => tabs.find((t) => t.path === path);

  const getTabByKey = (key: string) => tabs.find((t) => t.key === key);

  const openTab = (path: string, name: string, data: any = {}) => {
    const tabs = getTabs();

    const key = crypto.randomUUID();
    const tab: Tab = { path, name, key };

    const updatedTabs = [...tabs, tab];
    setTabs(() => updatedTabs);

    pushTabSession({ path, key, name, data });

    return tab;
  };

  const closeTab = (uuid: string) => {
    const tabs = getTabs();
    const newTabs = tabs.filter((t) => t.key !== uuid);
    setTabs(() => newTabs);
  };

  const getTabSessions = () => tabSessions;

  const pushTabSession = (session: TabSession) => {
    const sessions = getTabSessions();
    const existingSession = sessions.find((s) => s.key === session.key);
    if (existingSession) {
      const newSessions = sessions.filter((s) => s.key !== session.key);
      newSessions.push(session);
      setTabSessions(() => newSessions);
      return;
    }
    const newSessions = [...sessions, session];
    setTabSessions(() => newSessions);
  };

  const deleteTabSession = (uuid: string) => {
    const sessions = getTabSessions();
    const newSessions = sessions.filter((s) => s.key !== uuid);
    setTabSessions(() => newSessions);
  };

  const value = {
    getTab,
    getTabByKey,
    getTabs,
    setTabs,
    openTab,
    closeTab,
    getTabSessions,
    setTabSessions,
    pushTabSession,
    deleteTabSession,
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
}
