import React, {
  useEffect,
  useRef,
  useState
} from 'react';
import './App.css';

import UserDepartmentCards
  from './features/usuarios/components/UserDepartmentCards';

import IpSegmentCards
  from './features/ips/components/IpSegmentCards';

import { getInitialCreateItem } from './utils/getInitialCreateItem';
import { useModuleCrud } from './hooks/useModuleCrud';

import LoginPage from './features/auth/components/LoginPage';
import ModuleCreateModal from './components/modules/ModuleCreateModal';
import ModuleEditModal from './components/modules/ModuleEditModal';
import ModuleTable from './components/modules/ModuleTable';
import ModuleDetailModals from './components/modules/ModuleDetailModals';

import { useModuleModals } from './hooks/useModuleModals';
import { useAuth } from './hooks/useAuth';
import { useReferenceData } from './hooks/useReferenceData';
import { useModuleData } from './hooks/useModuleData';
import { useModuleFilters } from './hooks/useModuleFilters';
import { useModuleNavigation } from './hooks/useModuleNavigation';

import {
  buildEquipmentStateFromHostname,
  filterEquiposByCategory,
} from './utils/equipmentHelpers';

import {
  sanitizeIpInput,
  getAvailableIpsForUser,
  filterIpsBySegment,
  IP_SEGMENTS,
} from './utils/ipHelpers';

import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import ModuleToolbar from './components/layout/ModuleToolbar';
import EquipmentCategoryCards
  from './features/equipos/components/EquipmentCategoryCards';

import { formatEquipmentType } from './utils/formatEquipmentType';

import {
  renderUsuarioStatusBadge,
  renderAccountTypeBadge,
  renderIpStatusBadge,
  renderAnexoStatusBadge,
} from './components/common/badgeRenderers';

export default function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const {
    token,
    loginError,
    login,
    logout,
  } = useAuth();

  const [
    visibleProfilePasswords,
    setVisibleProfilePasswords
  ] = useState({});

  const [
    selectedIpSegment,
    setSelectedIpSegment
  ] = useState('');

  const {
    search,
    setSearch,

    selectedDpto,
    setSelectedDpto,

    selectedCategoriaEquipo,
    setSelectedCategoriaEquipo,

    selectedEstadoIP,
    setSelectedEstadoIP,

    selectedEstadoAnexo,
    setSelectedEstadoAnexo,

    resetFilters,
  } = useModuleFilters();

  const {
    tab,

    sidebarOpen,
    openSidebar,
    closeSidebar,

    sidebarCollapsed,
    toggleSidebarCollapsed,

    selectTab,
  } = useModuleNavigation(resetFilters);

  const {
    editingItem,
    setEditingItem,

    newItem,
    setNewItem,

    selectedUser,
    setSelectedUser,

    historyEquipo,
    setHistoryEquipo,

    historyUsuario,
    setHistoryUsuario,

    historyAnexo,
    setHistoryAnexo,

    historyPCGenerico,
    setHistoryPCGenerico,
  } = useModuleModals();

  const {
    dptosList,
    usuariosList,
    ipsList,
    refreshReferenceData,
  } = useReferenceData(token);

  const {
    data,
    refreshData,
  } = useModuleData({
    token,
    tab,
    search,
    selectedDpto,
    selectedEstadoIP,
    selectedEstadoAnexo,
    onUnauthorized: logout,
  });

  const refreshAllData = async () => {
    await Promise.all([
      refreshData(),
      refreshReferenceData(),
    ]);
  };

  const {
    handleCreateSave,
    handleSave,
    handleDelete,
  } = useModuleCrud({
    tab,
    data,
    newItem,
    editingItem,
    setNewItem,
    setEditingItem,
    refreshAllData,
  });

  const handleLogin = async (e) => {
    e.preventDefault();

    const success = await login(
      username,
      password
    );

    if (success) {
      setPassword('');
    }
  };

  const handleHostnameEquipoChange = (
    hostnameValue,
    targetState,
    setTargetState
  ) => {
    const nextState = buildEquipmentStateFromHostname(
      hostnameValue,
      targetState,
      usuariosList
    );

    setTargetState(nextState);
  };

  const handleIPInputChange = (
    value,
    targetState,
    setTargetState
  ) => {
    setTargetState({
      ...targetState,
      direccion_ip: sanitizeIpInput(value),
    });
  };

  const handleOpenCreateModal = () => {
    setNewItem(
      getInitialCreateItem(
        tab,
        dptosList
      )
    );
  };

  const filteredData =
    tab === 'equipos'
      ? filterEquiposByCategory(
        data,
        selectedCategoriaEquipo,
        formatEquipmentType
      )
      : tab === 'ips'
        ? filterIpsBySegment(
          data,
          selectedIpSegment
        )
        : data;

  const equipmentResultsRef = useRef(null);
  const userResultsRef = useRef(null);
  const ipResultsRef = useRef(null);

  const getDepartmentDisplayLabel = (department) => {
    if (!department) {
      return '';
    }

    const normalizedDepartment =
      department.trim().toLowerCase();

    if (
      normalizedDepartment === 'infraestructura ti' ||
      normalizedDepartment === 'ti'
    ) {
      return 'TECNOLOGÍA';
    }

    return department;
  };

  const selectedDepartmentLabel =
    getDepartmentDisplayLabel(selectedDpto);

  useEffect(() => {
    if (
      tab === 'usuarios' &&
      selectedDpto &&
      userResultsRef.current
    ) {
      const timeout = setTimeout(() => {
        userResultsRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 100);

      return () => clearTimeout(timeout);
    }
  }, [tab, selectedDpto]);

  const selectedEquipmentLabel =
    selectedCategoriaEquipo === 'PERIFERICOS'
      ? 'Periféricos'
      : selectedCategoriaEquipo;

  const selectedIpSegmentData =
    IP_SEGMENTS.find(
      (segment) =>
        segment.id === selectedIpSegment
    );

  const selectedIpSegmentLabel =
    selectedIpSegmentData?.label || '';

  /* =========================
     SCROLL RESULTADOS EQUIPOS
  ========================= */

  useEffect(() => {
    if (
      tab === 'equipos' &&
      selectedCategoriaEquipo &&
      equipmentResultsRef.current
    ) {
      const timeout = setTimeout(() => {
        equipmentResultsRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 100);

      return () => clearTimeout(timeout);
    }
  }, [tab, selectedCategoriaEquipo]);


  /* =========================
     SCROLL RESULTADOS IPS
  ========================= */

  useEffect(() => {
    if (
      tab === 'ips' &&
      selectedIpSegment &&
      ipResultsRef.current
    ) {
      const timeout = setTimeout(() => {
        ipResultsRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 100);

      return () => clearTimeout(timeout);
    }
  }, [tab, selectedIpSegment]);


  /* =========================
     IPS DISPONIBLES USUARIO
  ========================= */

  const availableIpsForUser = (currentIp) => {
    return getAvailableIpsForUser(
      ipsList,
      currentIp
    );
  };

  const handleSelectTab = (selectedTab) => {
    setSelectedIpSegment('');
    selectTab(selectedTab);
  };

  if (!token) {
    return (
      <LoginPage
        username={username}
        password={password}
        loginError={loginError}
        onUsernameChange={setUsername}
        onPasswordChange={setPassword}
        onSubmit={handleLogin}
      />
    );
  }

  return (
    <div className="app-shell">
      {/* SIDEBAR */}
      <Sidebar
        isOpen={sidebarOpen}
        collapsed={sidebarCollapsed}
        activeTab={tab}
        activeCount={filteredData.length}
        onClose={closeSidebar}
        onToggleCollapse={toggleSidebarCollapsed}
        onSelectTab={handleSelectTab}
      />

      {/* CONTENIDO PRINCIPAL */}
      <main
        className={`app-main ${sidebarCollapsed
          ? 'app-main-sidebar-collapsed'
          : ''
          }`}
      >
        {/* ENCABEZADO */}
        <Header
          activeTab={tab}
          onOpenSidebar={openSidebar}
          onLogout={logout}
        />

        {/* FILTROS Y ACCIONES */}
        {/* CATEGORÍAS DE EQUIPOS */}
        {tab === 'equipos' && (
          <EquipmentCategoryCards
            equipos={data}
            selectedCategory={selectedCategoriaEquipo}
            onSelectCategory={setSelectedCategoriaEquipo}
            formatEquipmentType={formatEquipmentType}
          />
        )}

        {/* ÁREAS DE USUARIOS */}
        {tab === 'usuarios' && (
          <UserDepartmentCards
            usuarios={usuariosList}
            selectedDepartment={selectedDpto}
            onSelectDepartment={setSelectedDpto}
          />
        )}

        {/* SEGMENTOS DE IP */}
        {tab === 'ips' && (
          <IpSegmentCards
            ips={ipsList}
            selectedSegment={selectedIpSegment}
            onSelectSegment={setSelectedIpSegment}
          />
        )}

        {/* RESULTADOS DEL MÓDULO */}
        {(
          (tab === 'equipos' && selectedCategoriaEquipo) ||
          (tab === 'usuarios' && selectedDpto) ||
          (tab === 'ips' && selectedIpSegment) ||
          (
            tab !== 'equipos' &&
            tab !== 'usuarios' &&
            tab !== 'ips'
          )
        ) && (
            <>
              {/* ENCABEZADO DEL RESULTADO DE EQUIPOS */}
              {tab === 'equipos' && (
                <div
                  ref={equipmentResultsRef}
                  className="equipment-results-header"
                >
                  <div>
                    <span className="equipment-results-eyebrow">
                      Categoría seleccionada
                    </span>

                    <h2>
                      {selectedEquipmentLabel}
                    </h2>
                  </div>

                  <div className="equipment-results-count">
                    <strong>
                      {filteredData.length}
                    </strong>

                    <span>
                      {filteredData.length === 1
                        ? ' equipo'
                        : ' equipos'}
                    </span>
                  </div>
                </div>
              )}

              {/* ENCABEZADO DEL RESULTADO DE USUARIOS */}
              {tab === 'usuarios' && (
                <div
                  ref={userResultsRef}
                  className="equipment-results-header"
                >
                  <div>
                    <span className="equipment-results-eyebrow">
                      Departamento / Área seleccionada
                    </span>

                    <h2>
                      {selectedDepartmentLabel}
                    </h2>
                  </div>

                  <div className="equipment-results-count">
                    <strong>
                      {filteredData.length}
                    </strong>

                    <span>
                      {filteredData.length === 1
                        ? ' usuario'
                        : ' usuarios'}
                    </span>
                  </div>
                </div>
              )}

              {/* ENCABEZADO DEL RESULTADO DE IPS */}
              {tab === 'ips' && (
                <div
                  ref={ipResultsRef}
                  className="equipment-results-header"
                >
                  <div>
                    <span className="equipment-results-eyebrow">
                      Segmento seleccionado
                    </span>

                    <h2>
                      {selectedIpSegmentLabel}
                    </h2>
                  </div>

                  <div className="equipment-results-count">
                    <strong>
                      {filteredData.length}
                    </strong>

                    <span>
                      {filteredData.length === 1
                        ? ' IP'
                        : ' IPs'}
                    </span>
                  </div>
                </div>
              )}
              {/* FILTROS Y ACCIONES */}
              <ModuleToolbar
                activeTab={tab}
                departments={dptosList}

                selectedDepartment={selectedDpto}
                onDepartmentChange={setSelectedDpto}

                selectedEquipmentCategory={
                  selectedCategoriaEquipo
                }
                onEquipmentCategoryChange={
                  setSelectedCategoriaEquipo
                }

                selectedIpStatus={selectedEstadoIP}
                onIpStatusChange={setSelectedEstadoIP}

                selectedAnexoStatus={
                  selectedEstadoAnexo
                }
                onAnexoStatusChange={
                  setSelectedEstadoAnexo
                }

                search={search}
                onSearchChange={setSearch}
                onCreate={handleOpenCreateModal}
              />

              {/* TABLA PRINCIPAL */}
              <div className="app-table-container">
                <ModuleTable
                  tab={tab}
                  data={filteredData}

                  formatEquipmentType={
                    formatEquipmentType
                  }

                  visibleProfilePasswords={
                    visibleProfilePasswords
                  }

                  setVisibleProfilePasswords={
                    setVisibleProfilePasswords
                  }

                  renderUsuarioStatusBadge={
                    renderUsuarioStatusBadge
                  }

                  renderAccountTypeBadge={
                    renderAccountTypeBadge
                  }

                  renderIpStatusBadge={
                    renderIpStatusBadge
                  }

                  renderAnexoStatusBadge={
                    renderAnexoStatusBadge
                  }

                  onSelectUser={
                    setSelectedUser
                  }

                  onShowUserHistory={
                    setHistoryUsuario
                  }

                  onShowEquipmentHistory={
                    setHistoryEquipo
                  }

                  onShowAnexoHistory={
                    setHistoryAnexo
                  }

                  onShowPCGenericoHistory={
                    setHistoryPCGenerico
                  }

                  onEdit={
                    setEditingItem
                  }

                  onDelete={
                    handleDelete
                  }
                />
              </div>
            </>
          )}

        {/* MODALES DE DETALLE / HISTORIAL */}
        <ModuleDetailModals
          selectedUser={
            selectedUser
          }

          historyUsuario={
            historyUsuario
          }

          historyEquipo={
            historyEquipo
          }

          historyAnexo={
            historyAnexo
          }

          historyPCGenerico={
            historyPCGenerico
          }

          onCloseUser={() =>
            setSelectedUser(null)
          }

          onCloseUserHistory={() =>
            setHistoryUsuario(null)
          }

          onCloseEquipmentHistory={() =>
            setHistoryEquipo(null)
          }

          onCloseAnexoHistory={() =>
            setHistoryAnexo(null)
          }

          onClosePCGenericoHistory={() =>
            setHistoryPCGenerico(null)
          }

          renderUsuarioStatusBadge={
            renderUsuarioStatusBadge
          }

          formatEquipmentType={
            formatEquipmentType
          }
        />

        {/* CREAR */}
        <ModuleCreateModal
          tab={tab}
          newItem={newItem}
          setNewItem={setNewItem}

          onSubmit={
            handleCreateSave
          }

          onClose={() =>
            setNewItem(null)
          }

          departments={
            dptosList
          }

          usuarios={
            usuariosList
          }

          availableIps={
            availableIpsForUser(
              newItem?.ip_seleccionada
            )
          }

          formatEquipmentType={
            formatEquipmentType
          }

          onHostnameChange={(value) =>
            handleHostnameEquipoChange(
              value,
              newItem,
              setNewItem
            )
          }

          onIpChange={(value) =>
            handleIPInputChange(
              value,
              newItem,
              setNewItem
            )
          }
        />

        {/* EDITAR */}
        <ModuleEditModal
          tab={tab}

          editingItem={
            editingItem
          }

          setEditingItem={
            setEditingItem
          }

          onSubmit={
            handleSave
          }

          onClose={() =>
            setEditingItem(null)
          }

          departments={
            dptosList
          }

          usuarios={
            usuariosList
          }

          availableIps={
            availableIpsForUser(
              editingItem?.ip_actual
            )
          }

          formatEquipmentType={
            formatEquipmentType
          }

          onHostnameChange={(value) =>
            handleHostnameEquipoChange(
              value,
              editingItem,
              setEditingItem
            )
          }

          onIpChange={(value) =>
            handleIPInputChange(
              value,
              editingItem,
              setEditingItem
            )
          }
        />
      </main>
    </div>
  );
}