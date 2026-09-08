import React, { useState, useEffect } from 'react';
import apiClient from './api/client';
import { getInitialCreateItem } from './utils/getInitialCreateItem';
import { prepareCreatePayload } from './utils/prepareCreatePayload';
import { prepareUpdatePayload } from './utils/prepareUpdatePayload';
import { validateItem } from './utils/validateItem';
import { createItemByTab } from './services/createItemService';
import { updateItemByTab } from './services/updateItemService';
import { deleteItemByTab } from './services/deleteItemService';
import { getItemsByTab } from './services/getItemService';
import EditModal from './components/common/EditModal';

import {
  buildEquipmentStateFromHostname,
  filterEquiposByCategory,
} from './utils/equipmentHelpers';

import {
  sanitizeIpInput,
  getAvailableIpsForUser,
} from './utils/ipHelpers';

import { useReferenceData } from './hooks/useReferenceData';

import UsuarioEditForm from './features/usuarios/components/UsuarioEditForm';
import EquipoEditForm from './features/equipos/components/EquipoEditForm';
import PerfilEditForm from './features/perfiles/components/PerfilEditForm';
import IpEditForm from './features/ips/components/IpEditForm';

import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import ModuleToolbar from './components/layout/ModuleToolbar';
import CreateModal from './components/common/CreateModal';

import UsuarioCreateForm from './features/usuarios/components/UsuarioCreateForm';
import UsuariosTable from './features/usuarios/components/UsuariosTable';
import UsuarioDetailModal from './features/usuarios/components/UsuarioDetailModal';
import UsuarioHistoryModal from './features/usuarios/components/UsuarioHistoryModal';

import EquipoCreateForm from './features/equipos/components/EquipoCreateForm';
import EquiposTable from './features/equipos/components/EquiposTable';
import EquipoHistoryModal from './features/equipos/components/EquipoHistoryModal';
import { formatEquipmentType } from './utils/formatEquipmentType';

import PerfilCreateForm from './features/perfiles/components/PerfilCreateForm';
import PerfilesTable from './features/perfiles/components/PerfilesTable';

import IpsTable from './features/ips/components/IpsTable';
import IpCreateForm from './features/ips/components/IpCreateForm';

import {
  renderUsuarioStatusBadge,
  renderAccountTypeBadge,
  renderIpStatusBadge,
} from './components/common/badgeRenderers';

import {Lock} from 'lucide-react';


export default function App() {
const [token, setToken] = useState(
  localStorage.getItem('access_token') || null
);

const [username, setUsername] = useState('');
const [password, setPassword] = useState('');
const [loginError, setLoginError] = useState('');

const [tab, setTab] = useState('usuarios');
const [sidebarOpen, setSidebarOpen] = useState(false);
const [data, setData] = useState([]);
const [search, setSearch] = useState('');
const [selectedDpto, setSelectedDpto] = useState('');
const [selectedCategoriaEquipo, setSelectedCategoriaEquipo] = useState('');
const [selectedEstadoIP, setSelectedEstadoIP] = useState('');

const [editingItem, setEditingItem] = useState(null);
const [newItem, setNewItem] = useState(null);
const [selectedUser, setSelectedUser] = useState(null);
const [historyEquipo, setHistoryEquipo] = useState(null);
const [historyUsuario, setHistoryUsuario] = useState(null);

const [visibleProfilePasswords, setVisibleProfilePasswords] = useState({});

  const {
  dptosList,
  usuariosList,
  ipsList,
  refreshReferenceData,
} = useReferenceData(token);

const handleLogin = async (e) => {
  e.preventDefault();
  setLoginError('');

  try {
    const response = await apiClient.post('/token/', {
      username,
      password
    });

    const accessToken = response.data.access;

    localStorage.setItem('access_token', accessToken);
    setToken(accessToken);
  } catch (error) {
    setLoginError(
      'Credenciales inválidas. Verifica tu usuario y contraseña.'
    );
  }
};
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    setToken(null);
  };

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [tab, search, selectedDpto, selectedEstadoIP, token]);

  const fetchData = async () => {
  try {
    const params = {};

    if (search) {
      params.search = search;
    }

    if (selectedDpto && (tab === 'usuarios' || tab === 'perfiles')) {
      params.dpto_area = selectedDpto;
    }

    if (selectedEstadoIP && tab === 'ips') {
      params.estado = selectedEstadoIP;
    }

const result = await getItemsByTab(tab, params);

setData(result);

  } catch (error) {
    if (error.response && error.response.status === 401) {
      handleLogout();
      return;
    }

    console.error('Error cargando datos:', error);
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

    await fetchData();
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

    // Actualizar según módulo
  await updateItemByTab(tab, editingItem.id, payload);

    setEditingItem(null);

    await fetchData();
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

      await fetchData();
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#0f172a', fontFamily: 'system-ui, sans-serif' }}>
        <form onSubmit={handleLogin} style={{ backgroundColor: '#fff', padding: '2.5rem', borderRadius: '12px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)', width: '360px' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <Lock size={36} color="#2563eb" />
            <h2 style={{ margin: '0.5rem 0 0 0', color: '#1e293b' }}>SimInfra Admin</h2>
            <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Inicia sesión para gestionar el sistema</p>
          </div>
          {loginError && <p style={{ color: '#ef4444', fontSize: '0.85rem', textAlign: 'center' }}>{loginError}</p>}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: '0.8rem', color: '#475569', fontWeight: 'bold' }}>Usuario</label>
            <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px', boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontSize: '0.8rem', color: '#475569', fontWeight: 'bold' }}>Contraseña</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px', boxSizing: 'border-box' }} />
          </div>
          <button type="submit" style={{ width: '100%', backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '0.75rem', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Ingresar</button>
        </form>
      </div>
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
          onLogout={handleLogout}
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
  {tab === 'usuarios' && (
    <UsuariosTable
      usuarios={filteredData}
      onSelectUser={setSelectedUser}
      onShowHistory={setHistoryUsuario}
      onEdit={setEditingItem}
      onDelete={handleDelete}
renderStatusBadge={renderUsuarioStatusBadge}    />
  )}

  {tab === 'equipos' && (
    <EquiposTable
      equipos={filteredData}
      formatEquipmentType={formatEquipmentType}
      onShowHistory={setHistoryEquipo}
      onEdit={setEditingItem}
      onDelete={handleDelete}
    />
  )}

  {tab === 'perfiles' && (
    <PerfilesTable
      perfiles={filteredData}
      visiblePasswords={visibleProfilePasswords}
      setVisiblePasswords={setVisibleProfilePasswords}
      renderAccountTypeBadge={renderAccountTypeBadge}
      onEdit={setEditingItem}
      onDelete={handleDelete}
    />
  )}

  {tab === 'ips' && (
    <IpsTable
      ips={filteredData}
      renderIpStatusBadge={renderIpStatusBadge}
      onEdit={setEditingItem}
      onDelete={handleDelete}
    />
  )}
</div>

<UsuarioDetailModal
  usuario={selectedUser}
  onClose={() => setSelectedUser(null)}
  renderStatusBadge={renderUsuarioStatusBadge}
  formatEquipmentType={formatEquipmentType}
/>

<UsuarioHistoryModal
  usuario={historyUsuario}
  onClose={() => setHistoryUsuario(null)}
/>

<EquipoHistoryModal
  equipo={historyEquipo}
  onClose={() => setHistoryEquipo(null)}
/>

{/* Modal de Creación */}
{newItem && (
  <CreateModal
    title={
      tab === 'usuarios'
        ? 'Nuevo Usuario'
        : tab === 'equipos'
        ? 'Nuevo Equipo'
        : tab === 'perfiles'
        ? 'Nuevo Perfil Genérico'
        : 'Nueva Dirección IP'
    }
    onClose={() => setNewItem(null)}
    onSubmit={handleCreateSave}
  >
    {tab === 'usuarios' && (
      <UsuarioCreateForm
        usuario={newItem}
        onChange={setNewItem}
        departments={dptosList}
        availableIps={availableIpsForUser(
          newItem.ip_seleccionada
        )}
      />
    )}

    {tab === 'equipos' && (
      <EquipoCreateForm
        equipo={newItem}
        onChange={setNewItem}
        usuarios={usuariosList}
        formatEquipmentType={formatEquipmentType}
        onHostnameChange={(value) =>
          handleHostnameEquipoChange(
            value,
            newItem,
            setNewItem
          )
        }
      />
    )}

    {tab === 'perfiles' && (
      <PerfilCreateForm
        perfil={newItem}
        onChange={setNewItem}
        departments={dptosList}
      />
    )}

    {tab === 'ips' && (
      <IpCreateForm
        ip={newItem}
        onChange={setNewItem}
        usuarios={usuariosList}
        onIpChange={(value) =>
          handleIPInputChange(
            value,
            newItem,
            setNewItem
          )
        }
      />
    )}
  </CreateModal>
)}

{/* Modal de Edición */}
{editingItem && (
  <EditModal
    title={
      tab === 'usuarios'
        ? 'Editar Usuario'
        : tab === 'equipos'
        ? 'Editar Equipo'
        : tab === 'perfiles'
        ? 'Editar Perfil Genérico'
        : 'Editar Dirección IP'
    }
    onClose={() => setEditingItem(null)}
    onSubmit={handleSave}
  >
    {tab === 'usuarios' && (
      <UsuarioEditForm
        usuario={editingItem}
        onChange={setEditingItem}
        departments={dptosList}
        availableIps={availableIpsForUser(
          editingItem.ip_actual
        )}
      />
    )}

    {tab === 'equipos' && (
      <EquipoEditForm
        equipo={editingItem}
        onChange={setEditingItem}
        usuarios={usuariosList}
        formatEquipmentType={formatEquipmentType}
        onHostnameChange={(value) =>
          handleHostnameEquipoChange(
            value,
            editingItem,
            setEditingItem
          )
        }
      />
    )}

    {tab === 'perfiles' && (
      <PerfilEditForm
        perfil={editingItem}
        onChange={setEditingItem}
        departments={dptosList}
      />
    )}

    {tab === 'ips' && (
      <IpEditForm
        ip={editingItem}
        onChange={setEditingItem}
        usuarios={usuariosList}
        onIpChange={(value) =>
          handleIPInputChange(
            value,
            editingItem,
            setEditingItem
          )
        }
      />
    )}
  </EditModal>
)}
    </div>
  );
}
