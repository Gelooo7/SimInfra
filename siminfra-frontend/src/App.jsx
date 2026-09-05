import React, { useState, useEffect } from 'react';
import apiClient from './api/client';
import EditModal from './components/common/EditModal';

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

import PerfilCreateForm from './features/perfiles/components/PerfilCreateForm';
import PerfilesTable from './features/perfiles/components/PerfilesTable';

import IpsTable from './features/ips/components/IpsTable';
import IpCreateForm from './features/ips/components/IpCreateForm';
import {
  getUsuarios,
  createUsuario,
  updateUsuario,
  deleteUsuario,
} from './api/usuariosApi';
import {
  getIps,
  createIp,
  updateIp,
  deleteIp,
} from './api/ipsApi';
import {
  getEquipos,
  createEquipo,
  updateEquipo,
  deleteEquipo,
} from './api/equiposApi';
import {
  getPerfiles,
  createPerfil,
  updatePerfil,
  deletePerfil,
} from './api/perfilesApi';
import {
  Save,
  X,
  Lock,
} from 'lucide-react';


export default function App() {
  const [token, setToken] = useState(localStorage.getItem('access_token') || null);
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
  const [dptosList, setDptosList] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [newItem, setNewItem] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [historyEquipo, setHistoryEquipo] = useState(null);
  const [historyUsuario, setHistoryUsuario] = useState(null);
  const [usuariosList, setUsuariosList] = useState([]);
  const [ipsList, setIpsList] = useState([]);

  const [visibleProfilePasswords, setVisibleProfilePasswords] = useState({});

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
      fetchDptos();
      fetchUsuariosList();
      fetchIpsList();
    }
  }, [token]);

const fetchDptos = async () => {
  try {
    const usuarios = await getUsuarios();

    const unique = Array.from(
      new Set(
        usuarios
          .map((usuario) => usuario.dpto_area)
          .filter(Boolean)
      )
    );

    setDptosList(unique.sort());
  } catch (error) {
    console.error('Error cargando departamentos:', error);
  }
};

const fetchUsuariosList = async () => {
  try {
    const usuarios = await getUsuarios();
    setUsuariosList(usuarios);
  } catch (error) {
    console.error('Error cargando usuarios:', error);
  }
};

const fetchIpsList = async () => {
  try {
    const ips = await getIps();
    setIpsList(ips);
  } catch (error) {
    console.error('Error cargando IPs:', error);
  }
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

    let result = [];

    switch (tab) {
      case 'usuarios':
        result = await getUsuarios(params);
        break;

      case 'equipos':
        result = await getEquipos(params);
        break;

      case 'perfiles':
        result = await getPerfiles(params);
        break;

      case 'ips':
        result = await getIps(params);
        break;

      default:
        result = [];
    }

    setData(result);

  } catch (error) {
    if (error.response && error.response.status === 401) {
      handleLogout();
      return;
    }

    console.error('Error cargando datos:', error);
  }
};

  const formatTipoEquipo = (tipo) => {
    if (!tipo) return 'N/I';
    const t = tipo.toUpperCase();
    if (t === 'NTBK' || t === 'NOTEBOOK') return 'Notebook';
    if (t === 'CEL' || t === 'CELULAR') return 'Celular';
    if (t === 'TBIT' || t === 'TABLET') return 'Tablet';
    if (t === 'MAC') return 'Mac';
    if (t === 'BAM' || t === 'BAM / ROUTER') return 'BAM / Router';
    return tipo;
  };

  const handleHostnameEquipoChange = (hostnameVal, targetState, setTargetState) => {
    const matchUser = usuariosList.find(u => u.hostname && u.hostname.trim().toLowerCase() === hostnameVal.trim().toLowerCase());
    
    if (matchUser) {
      setTargetState({
        ...targetState,
        hostname: hostnameVal,
        usuario: matchUser.id,
        estado: 'ASIGNADO'
      });
    } else {
      setTargetState({ ...targetState, hostname: hostnameVal });
    }
  };

  const handleIPInputChange = (val, targetState, setTargetState) => {
    const cleaned = val.replace(/[^0-9.]/g, '');
    setTargetState({ ...targetState, direccion_ip: cleaned });
  };

  const validateFieldsAndDuplicates = (item) => {
    if (tab === 'ips') {
      if (!item.direccion_ip || !/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(item.direccion_ip.trim())) {
        alert('Por favor ingrese una dirección IP válida (ejemplo: 192.168.1.50).');
        return false;
      }
      const dupIP = data.find(i => i.id !== item.id && i.direccion_ip.trim() === item.direccion_ip.trim());
      if (dupIP) { alert(`Error: La dirección IP "${item.direccion_ip}" ya existe en el sistema.`); return false; }
    }

    if (item.af) {
      if (item.af.length > 12 || !/^\d+$/.test(item.af)) {
        alert('El Activo Fijo (AF) debe ser numérico y tener máximo 12 dígitos.');
        return false;
      }
    }

    if (tab === 'usuarios') {
      const dupNombre = data.find(u => u.id !== item.id && u.nombre_completo.trim().toLowerCase() === (item.nombre_completo || '').trim().toLowerCase());
      if (dupNombre) { alert(`Error: Ya existe un usuario llamado "${item.nombre_completo}".`); return false; }

      const dupRed = data.find(u => u.id !== item.id && u.usuario_red.trim().toLowerCase() === (item.usuario_red || '').trim().toLowerCase());
      if (dupRed) { alert(`Error: El usuario de red "${item.usuario_red}" ya existe.`); return false; }
    }

    if (tab === 'equipos') {
      const dupSerie = data.find(e => e.id !== item.id && e.numero_serie.trim().toLowerCase() === (item.numero_serie || '').trim().toLowerCase());
      if (dupSerie) { alert(`Error: El número de serie "${item.numero_serie}" ya está registrado.`); return false; }

      if (item.af) {
        const dupAF = data.find(e => e.id !== item.id && e.af === item.af);
        if (dupAF) { alert(`Error: El Activo Fijo (AF) "${item.af}" ya pertenece a otro equipo.`); return false; }
      }
    }

    return true;
  };

  const handleOpenCreateModal = () => {
    if (tab === 'usuarios') {
  setNewItem({
    estado: 'ACTIVO',
    nombre_completo: '',
    hostname: '',
    cargo: '',
    dpto_area: dptosList[0] || '',
    usuario_red: '',
    correo_corp: '',
    gmail: '',
    password_gmail: '',
    password_simi: '',
    celular: '',
    telefono: '',
    anexo: '',
    ip_seleccionada: null
  });
    } else if (tab === 'equipos') {
      setNewItem({
        tipo: 'Notebook',
        marca: '',
        modelo: '',
        numero_serie: '',
        hostname: '',
        af: '',
        usuario: '',
        fecha_asignacion: '',
        numero_telefono: '',
        imei: '',
        pin: '',
        icloud_cuenta: '',
        icloud_password: '',
        estado: 'ASIGNADO'
      });
    } else if (tab === 'perfiles') {
      setNewItem({
        nombre: '',
        usuario: '',
        password: '',
        correo: '',
        dpto_area: dptosList[0] || '',
        tipo: 'On Premise',
        estado: 'ACTIVO'
      });
    } else {
      setNewItem({
        direccion_ip: '',
        estado: 'LIBRE',
        observacion: '',
        usuario: '',
        asignado_otro: ''
      });
    }
  };

const handleCreateSave = async (e) => {
  e.preventDefault();

  if (!validateFieldsAndDuplicates(newItem)) return;

  try {
    const payload = { ...newItem };

    // Convertir strings vacíos en null
    Object.keys(payload).forEach((key) => {
      if (payload[key] === '') {
        payload[key] = null;
      }
    });

    // IP asignada o reservada
    if (tab === 'ips') {
      if (payload.usuario || payload.asignado_otro) {
        payload.estado = 'RESERVADA';
      }
    }

    // Crear según módulo
    if (tab === 'usuarios') {
      await createUsuario(payload);

    } else if (tab === 'equipos') {
      await createEquipo(payload);

    } else if (tab === 'ips') {
      await createIp(payload);

    } else if (tab === 'perfiles') {
      await createPerfil(payload);
    }

    setNewItem(null);

    await fetchData();
    fetchDptos();
    fetchUsuariosList();
    fetchIpsList();

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

  if (!validateFieldsAndDuplicates(editingItem)) return;

  try {
    const payload = { ...editingItem };

    // Campos que no deben enviarse al backend
    delete payload.equipos;
    delete payload.historial;
    delete payload.id;
    delete payload.usuario_nombre;
    delete payload.ip_actual;

    // USUARIOS
    if (tab === 'usuarios') {
      delete payload.ip_asignada;

      if (payload.ip_seleccionada === '') {
        payload.ip_seleccionada = null;
      }
    }

    // EQUIPOS - Normalizar tipos antiguos
    if (tab === 'equipos' && payload.tipo) {
      payload.tipo = formatTipoEquipo(payload.tipo);
    }

    // EQUIPOS - Coherencia entre usuario y estado
    if (tab === 'equipos') {
      if (!payload.usuario) {
        payload.estado = 'STOCK';
        payload.fecha_asignacion = null;

      } else if (payload.estado === 'STOCK') {
        payload.estado = 'ASIGNADO';
      }
    }

    // Normalizar estados
    if (payload.estado && tab !== 'ips') {
      payload.estado = payload.estado.toUpperCase();
    }

    // IPS
    if (tab === 'ips') {
      if (
        payload.usuario ||
        (payload.asignado_otro && payload.asignado_otro.trim())
      ) {
        payload.estado = 'RESERVADA';

      } else if (
        !payload.usuario &&
        !payload.asignado_otro &&
        payload.estado === 'RESERVADA'
      ) {
        payload.estado = 'LIBRE';
      }
    }

    // Actualizar según módulo
    if (tab === 'usuarios') {
      await updateUsuario(
        editingItem.id,
        payload
      );

    } else if (tab === 'equipos') {
      await updateEquipo(
        editingItem.id,
        payload
      );

    } else if (tab === 'ips') {
      await updateIp(
        editingItem.id,
        payload
      );

    } else if (tab === 'perfiles') {
      await updatePerfil(
        editingItem.id,
        payload
      );
    }

    setEditingItem(null);

    await fetchData();
    fetchDptos();
    fetchUsuariosList();
    fetchIpsList();

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

      if (tab === 'usuarios') {
        await deleteUsuario(id);

      } else if (tab === 'equipos') {
        await deleteEquipo(id);

      } else if (tab === 'ips') {
        await deleteIp(id);

      } else if (tab === 'perfiles') {
        await deletePerfil(id);
      }

      await fetchData();
      fetchUsuariosList();
      fetchIpsList();

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

  const getBadgeEstadoUsuario = (estado) => {
    switch(estado) {
      case 'LICENCIA':
        return <span style={{ padding: '0.3rem 0.75rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold', backgroundColor: '#fef3c7', color: '#b45309', whiteSpace: 'nowrap', display: 'inline-block' }}>Licencia Médica</span>;
      case 'BAJA':
        return <span style={{ padding: '0.3rem 0.75rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold', backgroundColor: '#fee2e2', color: '#b91c1c', whiteSpace: 'nowrap', display: 'inline-block' }}>Dar de Baja</span>;
      default:
        return <span style={{ padding: '0.3rem 0.75rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold', backgroundColor: '#dcfce7', color: '#15803d', whiteSpace: 'nowrap', display: 'inline-block' }}>Activo</span>;
    }
  };

  const getBadgeTipoCuenta = (tipo) => {
    if (tipo === 'O365') {
      return <span style={{ padding: '0.3rem 0.75rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold', backgroundColor: '#dbeafe', color: '#1d4ed8', whiteSpace: 'nowrap', display: 'inline-block' }}>O365</span>;
    }
    return <span style={{ padding: '0.3rem 0.75rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold', backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', whiteSpace: 'nowrap', display: 'inline-block' }}>On Premise</span>;
  };

  // CAMBIO 2: INTERCAMBIO DE COLORES (RESERVADA -> ROJO, DESCONOCIDA -> AMARILLO)
  const getBadgeEstadoIP = (estado) => {
    switch(estado) {
      case 'LIBRE':
        return <span style={{ padding: '0.3rem 0.75rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold', backgroundColor: '#dcfce7', color: '#15803d', whiteSpace: 'nowrap', display: 'inline-block' }}>🟢 Libre</span>;
      case 'RESERVADA':
        return <span style={{ padding: '0.3rem 0.75rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold', backgroundColor: '#fee2e2', color: '#b91c1c', whiteSpace: 'nowrap', display: 'inline-block' }}>🔴 Reservada</span>;
      case 'DUPLICADA':
        return <span style={{ padding: '0.3rem 0.75rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold', backgroundColor: '#dbeafe', color: '#1d4ed8', whiteSpace: 'nowrap', display: 'inline-block' }}>🔵 Duplicada</span>;
      case 'DESCONOCIDA':
        return <span style={{ padding: '0.3rem 0.75rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold', backgroundColor: '#fef3c7', color: '#b45309', whiteSpace: 'nowrap', display: 'inline-block' }}>🟡 Desconocida</span>;
      default:
        return <span style={{ padding: '0.3rem 0.75rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold', backgroundColor: '#f1f5f9', color: '#475569', whiteSpace: 'nowrap', display: 'inline-block' }}>⚪ Asignada</span>;
    }
  };

  const filteredData = data.filter(item => {
    if (tab === 'equipos' && selectedCategoriaEquipo) {
      const tipoFormatted = formatTipoEquipo(item.tipo).toLowerCase();
      const selFormatted = formatTipoEquipo(selectedCategoriaEquipo).toLowerCase();
      return tipoFormatted === selFormatted;
    }
    return true;
  });

  const availableIpsForUser = (currentIp) => {
    return ipsList.filter(ip => ip.estado === 'LIBRE' || ip.direccion_ip === currentIp);
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
      renderStatusBadge={getBadgeEstadoUsuario}
    />
  )}

  {tab === 'equipos' && (
    <EquiposTable
      equipos={filteredData}
      formatEquipmentType={formatTipoEquipo}
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
      renderAccountTypeBadge={getBadgeTipoCuenta}
      onEdit={setEditingItem}
      onDelete={handleDelete}
    />
  )}

  {tab === 'ips' && (
    <IpsTable
      ips={filteredData}
      renderIpStatusBadge={getBadgeEstadoIP}
      onEdit={setEditingItem}
      onDelete={handleDelete}
    />
  )}
</div>

<UsuarioDetailModal
  usuario={selectedUser}
  onClose={() => setSelectedUser(null)}
  renderStatusBadge={getBadgeEstadoUsuario}
  formatEquipmentType={formatTipoEquipo}
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
        formatEquipmentType={formatTipoEquipo}
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
        formatEquipmentType={formatTipoEquipo}
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