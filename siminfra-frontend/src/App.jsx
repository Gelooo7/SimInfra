import React, { useState } from 'react';
import { getInitialCreateItem } from './utils/getInitialCreateItem';
import { prepareCreatePayload } from './utils/prepareCreatePayload';
import { prepareUpdatePayload } from './utils/prepareUpdatePayload';
import { validateItem } from './utils/validateItem';
import { createItemByTab } from './services/createItemService';
import { updateItemByTab } from './services/updateItemService';
import { deleteItemByTab } from './services/deleteItemService';

import LoginPage from './features/auth/components/LoginPage';
import ModuleCreateModal from './components/modules/ModuleCreateModal';
import ModuleEditModal from './components/modules/ModuleEditModal';
import ModuleTable from './components/modules/ModuleTable';
import ModuleDetailModals from './components/modules/ModuleDetailModals';

import { useModuleModals } from './hooks/useModuleModals';
import { useAuth } from './hooks/useAuth';
import { useReferenceData } from './hooks/useReferenceData';
import { useModuleData } from './hooks/useModuleData';

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

const [tab, setTab] = useState('usuarios');
const [sidebarOpen, setSidebarOpen] = useState(false);
const [search, setSearch] = useState('');
const [selectedDpto, setSelectedDpto] = useState('');
const [selectedCategoriaEquipo, setSelectedCategoriaEquipo] = useState('');
const [selectedEstadoIP, setSelectedEstadoIP] = useState('');

const [visibleProfilePasswords, setVisibleProfilePasswords] = useState({});

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
  onUnauthorized: logout,
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
  setNewItem(getInitialCreateItem(tab, dptosList));
};

const handleCreateSave = async (e) => {
  e.preventDefault();

const validation = validateItem(tab, newItem, data);

if (!validation.valid) {
  alert(validation.message);
  return;
}

  try {
    const payload = prepareCreatePayload(tab, newItem);

    await createItemByTab(tab, payload);

    setNewItem(null);

    await refreshData();
    await refreshReferenceData();

  } catch (error) {
    console.error(
      'Error al guardar:',
      error.response?.data || error
    );

    alert(
      'Error al guardar: ' +
      JSON.stringify(
        error.response?.data || 'Verifique los datos'
      )
    );
  }
};

const handleSave = async (e) => {
  e.preventDefault();

  const validation = validateItem(
    tab,
    editingItem,
    data
  );

  if (!validation.valid) {
    alert(validation.message);
    return;
  }

  try {
    const payload = prepareUpdatePayload(
      tab,
      editingItem,
      formatEquipmentType
    );


    await updateItemByTab(
      tab,
      editingItem.id,
      payload
    );

    setEditingItem(null);

    await refreshData();
    await refreshReferenceData();

  } catch (error) {
    console.error(
      'Error guardando cambios:',
      error.response?.data || error
    );

    alert(
      'Error al guardar: ' +
      JSON.stringify(
        error.response?.data || 'Verifique los datos'
      )
    );
  }
};

const handleDelete = async (id, nombre) => {
  if (
    window.confirm(
      `¿Estás seguro de que deseas eliminar permanentemente a "${nombre}"?`
    )
  ) {
    try {

    await deleteItemByTab(tab, id);

      await refreshData();
      await refreshReferenceData();

    } catch (error) {
      console.error(
        'Error al eliminar registro:',
        error.response?.data || error
      );

      alert(
        'Error al eliminar: ' +
        JSON.stringify(
          error.response?.data ||
          'No se pudo eliminar el registro'
        )
      );
    }
  }
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

  const handleSelectTab = (selectedTab) => {
    setTab(selectedTab);
    setSelectedDpto('');
    setSelectedCategoriaEquipo('');
    setSelectedEstadoIP('');
    setSidebarOpen(false);
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
    <div style={{ padding: '1.5rem 3rem', fontFamily: 'system-ui, sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh', boxSizing: 'border-box' }}>

      <Sidebar
        isOpen={sidebarOpen}
        activeTab={tab}
        activeCount={filteredData.length}
        onClose={() => setSidebarOpen(false)}
        onSelectTab={handleSelectTab}
      />
      
      {/* ENCABEZADO */}
        <Header
          activeTab={tab}
          onOpenSidebar={() => setSidebarOpen(true)}
          onLogout={logout}
        />

      {/* FILTROS Y ACCIONES SUPERIORES */}
      <ModuleToolbar
        activeTab={tab}
        departments={dptosList}
        selectedDepartment={selectedDpto}
        onDepartmentChange={setSelectedDpto}
        selectedEquipmentCategory={selectedCategoriaEquipo}
        onEquipmentCategoryChange={setSelectedCategoriaEquipo}
        selectedIpStatus={selectedEstadoIP}
        onIpStatusChange={setSelectedEstadoIP}
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
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
    width: '100%'
  }}
>
<ModuleTable
  tab={tab}
  data={filteredData}
  formatEquipmentType={formatEquipmentType}
  visibleProfilePasswords={visibleProfilePasswords}
  setVisibleProfilePasswords={setVisibleProfilePasswords}
  renderUsuarioStatusBadge={renderUsuarioStatusBadge}
  renderAccountTypeBadge={renderAccountTypeBadge}
  renderIpStatusBadge={renderIpStatusBadge}
  onSelectUser={setSelectedUser}
  onShowUserHistory={setHistoryUsuario}
  onShowEquipmentHistory={setHistoryEquipo}
  onEdit={setEditingItem}
  onDelete={handleDelete}
/>
</div>

<ModuleDetailModals
  selectedUser={selectedUser}
  historyUsuario={historyUsuario}
  historyEquipo={historyEquipo}
  onCloseUser={() => setSelectedUser(null)}
  onCloseUserHistory={() => setHistoryUsuario(null)}
  onCloseEquipmentHistory={() => setHistoryEquipo(null)}
  renderUsuarioStatusBadge={renderUsuarioStatusBadge}
  formatEquipmentType={formatEquipmentType}
/>

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
  formatEquipmentType={formatEquipmentType}
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

<ModuleEditModal
  tab={tab}
  editingItem={editingItem}
  setEditingItem={setEditingItem}
  onSubmit={handleSave}
  onClose={() => setEditingItem(null)}
  departments={dptosList}
  usuarios={usuariosList}
  availableIps={availableIpsForUser(
    editingItem?.ip_actual
  )}
  formatEquipmentType={formatEquipmentType}
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
