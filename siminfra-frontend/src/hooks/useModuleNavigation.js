import { useEffect, useState } from 'react';

export const useModuleNavigation = (resetFilters) => {
  const [tab, setTab] = useState('usuarios');

  // Drawer para tablet / móvil
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Estado expandido / contraído en escritorio
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    try {
      const savedValue = localStorage.getItem(
        'portal-infra-ti-chile-sidebar-collapsed'
      );

      return savedValue === 'true';
    } catch {
      return false;
    }
  });

  // Guardar preferencia del sidebar
  useEffect(() => {
    try {
      localStorage.setItem(
        'portal-infra-ti-chile-sidebar-collapsed',
        String(sidebarCollapsed)
      );
    } catch {
      // Si localStorage no está disponible,
      // continuamos sin guardar la preferencia.
    }
  }, [sidebarCollapsed]);

  const selectTab = (selectedTab) => {
    setTab(selectedTab);

    resetFilters?.();

    // Si se está usando como drawer móvil,
    // se cierra al seleccionar un módulo.
    setSidebarOpen(false);
  };

  const openSidebar = () => {
    setSidebarOpen(true);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const toggleSidebarCollapsed = () => {
    setSidebarCollapsed((prev) => !prev);
  };

  return {
    tab,

    sidebarOpen,
    openSidebar,
    closeSidebar,

    sidebarCollapsed,
    toggleSidebarCollapsed,

    selectTab,
  };
};