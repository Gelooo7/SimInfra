import React, { useState } from 'react';
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
} from './utils/ipHelpers';

import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import ModuleToolbar from './components/layout/ModuleToolbar';

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
    selectTab,
    openSidebar,
    closeSidebar,
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
      : data;

  const availableIpsForUser = (currentIp) => {
    return getAvailableIpsForUser(
      ipsList,
      currentIp
    );
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
    <div
      style={{
        padding: '1.5rem 3rem',
        fontFamily: 'system-ui, sans-serif',
        backgroundColor: '#f8fafc',
        minHeight: '100vh',
        boxSizing: 'border-box'
      }}
    >
      <Sidebar
        isOpen={sidebarOpen}
        activeTab={tab}
        activeCount={filteredData.length}
        onClose={closeSidebar}
        onSelectTab={selectTab}
      />

      {/* ENCABEZADO */}
      <Header
        activeTab={tab}
        onOpenSidebar={openSidebar}
        onLogout={logout}
      />

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
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          overflowX: 'auto',
          boxShadow:
            '0 4px 6px -1px rgba(0,0,0,0.05)',
          width: '100%'
        }}
      >
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

          onSelectUser={setSelectedUser}

          onShowUserHistory={
            setHistoryUsuario
          }

          onShowEquipmentHistory={
            setHistoryEquipo
          }

          onShowAnexoHistory={
            setHistoryAnexo
          }

          onEdit={setEditingItem}
          onDelete={handleDelete}
        />
      </div>

      {/* MODALES DE DETALLE / HISTORIAL */}
      <ModuleDetailModals
        selectedUser={selectedUser}

        historyUsuario={
          historyUsuario
        }

        historyEquipo={
          historyEquipo
        }

        historyAnexo={
          historyAnexo
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
        onSubmit={handleCreateSave}
        onClose={() => setNewItem(null)}
        departments={dptosList}
        usuarios={usuariosList}
        availableIps={availableIpsForUser(
          newItem?.ip_seleccionada
        )}
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
        editingItem={editingItem}
        setEditingItem={setEditingItem}
        onSubmit={handleSave}
        onClose={() =>
          setEditingItem(null)
        }
        departments={dptosList}
        usuarios={usuariosList}
        availableIps={availableIpsForUser(
          editingItem?.ip_actual
        )}
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
    </div>
  );
}