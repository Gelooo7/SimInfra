import { useState } from 'react';

export const useModuleNavigation = (resetFilters) => {
  const [tab, setTab] = useState('usuarios');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const selectTab = (selectedTab) => {
    setTab(selectedTab);

    if (resetFilters) {
      resetFilters();
    }

    setSidebarOpen(false);
  };

  const openSidebar = () => {
    setSidebarOpen(true);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return {
    tab,
    sidebarOpen,
    selectTab,
    openSidebar,
    closeSidebar,
  };
};