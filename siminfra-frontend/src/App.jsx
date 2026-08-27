import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, User, Monitor, Key, Edit, Save, X, LogOut, Lock, Laptop, Smartphone, Tablet, Radio, Eye, EyeOff, Trash2, Filter, Plus, History, Calendar, ChevronDown, ChevronUp } from 'lucide-react';

const API_BASE = 'http://127.0.0.1:8000/api';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('access_token') || null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [tab, setTab] = useState('usuarios');
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedDpto, setSelectedDpto] = useState('');
  const [dptosList, setDptosList] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [newItem, setNewItem] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [historyEquipo, setHistoryEquipo] = useState(null);
  const [historyUsuario, setHistoryUsuario] = useState(null);
  const [expandedHistory, setExpandedHistory] = useState({}); // <--- Estado para expandir/contraer detalles del historial
  const [showUserPassGmail, setShowUserPassGmail] = useState(false);
  const [showUserPassSimi, setShowUserPassSimi] = useState(false);
  const [usuariosList, setUsuariosList] = useState([]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      const response = await axios.post(`${API_BASE}/token/`, { username, password });
      const accessToken = response.data.access;
      localStorage.setItem('access_token', accessToken);
      setToken(accessToken);
    } catch (error) {
      setLoginError('Credenciales inválidas. Verifica tu usuario y contraseña.');
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
    }
  }, [token]);

  const fetchDptos = async () => {
    try {
      const response = await axios.get(`${API_BASE}/usuarios/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const unique = Array.from(new Set(response.data.map(u => u.dpto_area).filter(Boolean)));
      setDptosList(unique.sort());
    } catch (error) {
      console.error('Error cargando departamentos:', error);
    }
  };

  const fetchUsuariosList = async () => {
    try {
      const response = await axios.get(`${API_BASE}/usuarios/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsuariosList(response.data);
    } catch (error) {
      console.error('Error cargando usuarios:', error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [tab, search, selectedDpto, token]);

  const fetchData = async () => {
    try {
      const endpoint = tab === 'usuarios' ? 'usuarios' : tab === 'equipos' ? 'equipos' : 'perfiles-genericos';
      let params = new URLSearchParams();
      
      if (search) params.append('search', search);
      if (selectedDpto && (tab === 'usuarios' || tab === 'perfiles')) {
        params.append('dpto_area', selectedDpto);
      }

      const response = await axios.get(`${API_BASE}/${endpoint}/?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setData(response.data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        handleLogout();
      }
    }
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

  const validateFieldsAndDuplicates = (item) => {
    if (item.ip_asignada && /[^\d.]/.test(item.ip_asignada)) {
      alert('La dirección IP sólo puede contener números y puntos.');
      return false;
    }
    if (item.af) {
      if (item.af.length > 12 || !/^\d+$/.test(item.af)) {
        alert('El Activo Fijo (AF) debe ser estrictamente numérico y tener máximo 12 dígitos.');
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
        telefono: '',
        anexo: '',
        ip_asignada: ''
      });
    } else if (tab === 'equipos') {
      setNewItem({
        tipo: 'NTBK',
        marca: '',
        modelo: '',
        numero_serie: '',
        hostname: '',
        af: '',
        usuario: '',
        fecha_asignacion: '',
        numero_telefono: '',
        estado: 'ASIGNADO'
      });
    } else {
      setNewItem({
        nombre: '',
        usuario: '',
        password: '',
        correo: '',
        dpto_area: dptosList[0] || '',
        tipo: 'ONPREMISE',
        estado: 'ACTIVO'
      });
    }
  };

  const handleCreateSave = async (e) => {
    e.preventDefault();
    if (!validateFieldsAndDuplicates(newItem)) return;

    try {
      const endpoint = tab === 'usuarios' ? 'usuarios' : tab === 'equipos' ? 'equipos' : 'perfiles-genericos';
      const payload = { ...newItem };

      Object.keys(payload).forEach(key => { if (payload[key] === '') payload[key] = null; });

      await axios.post(`${API_BASE}/${endpoint}/`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setNewItem(null);
      await fetchData();
      fetchDptos();
      fetchUsuariosList();
    } catch (error) {
      console.error('Error al guardar:', error.response?.data || error);
      alert('Error al guardar: ' + JSON.stringify(error.response?.data || 'Verifique los datos'));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validateFieldsAndDuplicates(editingItem)) return;

    try {
      const endpoint = tab === 'usuarios' ? 'usuarios' : tab === 'equipos' ? 'equipos' : 'perfiles-genericos';
      const payload = { ...editingItem };
      delete payload.equipos;
      delete payload.historial;
      delete payload.id;

      if (payload.estado) payload.estado = payload.estado.toUpperCase();

      await axios.patch(`${API_BASE}/${endpoint}/${editingItem.id}/`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setEditingItem(null);
      await fetchData();
      fetchDptos();
      fetchUsuariosList();
    } catch (error) {
      console.error('Error guardando cambios:', error.response?.data || error);
      alert('Error al guardar: ' + JSON.stringify(error.response?.data || 'Verifique los datos'));
    }
  };

  const handleDelete = async (id, nombre) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar permanentemente a "${nombre}"?`)) {
      try {
        const endpoint = tab === 'usuarios' ? 'usuarios' : tab === 'equipos' ? 'equipos' : 'perfiles-genericos';
        await axios.delete(`${API_BASE}/${endpoint}/${id}/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchData();
        fetchUsuariosList();
      } catch (error) {
        console.error('Error al eliminar registro:', error);
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
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', width: '100%' }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: '#0f172a', margin: 0, fontWeight: '800' }}>SimInfra — Gestión de Infraestructura</h1>
          <p style={{ color: '#64748b', marginTop: '0.25rem' }}>Panel Administrador de Usuarios, Activos e IP</p>
        </div>
        <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#fff', cursor: 'pointer', color: '#ef4444', fontWeight: 'bold' }}>
          <LogOut size={16} /> Cerrar Sesión
        </button>
      </header>

      {/* Navegación y Filtros */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', gap: '1rem', width: '100%', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={() => { setTab('usuarios'); setSelectedDpto(''); }} style={{ padding: '0.7rem 1.5rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold', backgroundColor: tab === 'usuarios' ? '#2563eb' : '#e2e8f0', color: tab === 'usuarios' ? '#fff' : '#475569' }}>
            <User size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} /> Usuarios ({tab === 'usuarios' ? data.length : ''})
          </button>
          <button onClick={() => { setTab('equipos'); setSelectedDpto(''); }} style={{ padding: '0.7rem 1.5rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold', backgroundColor: tab === 'equipos' ? '#2563eb' : '#e2e8f0', color: tab === 'equipos' ? '#fff' : '#475569' }}>
            <Monitor size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} /> Equipos ({tab === 'equipos' ? data.length : ''})
          </button>
          <button onClick={() => { setTab('perfiles'); setSelectedDpto(''); }} style={{ padding: '0.7rem 1.5rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold', backgroundColor: tab === 'perfiles' ? '#2563eb' : '#e2e8f0', color: tab === 'perfiles' ? '#fff' : '#475569' }}>
            <Key size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} /> Perfiles Genéricos ({tab === 'perfiles' ? data.length : ''})
          </button>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button onClick={handleOpenCreateModal} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.2rem', borderRadius: '8px', border: 'none', backgroundColor: '#16a34a', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>
            <Plus size={18} /> Agregar {tab === 'usuarios' ? 'Usuario' : tab === 'equipos' ? 'Equipo' : 'Perfil'}
          </button>

          {(tab === 'usuarios' || tab === 'perfiles') && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#fff', border: '1px solid #cbd5e1', padding: '0.4rem 0.8rem', borderRadius: '8px' }}>
              <Filter size={16} color="#64748b" />
              <select value={selectedDpto} onChange={(e) => setSelectedDpto(e.target.value)} style={{ border: 'none', outline: 'none', backgroundColor: 'transparent', fontSize: '0.85rem', color: '#334155', cursor: 'pointer' }}>
                <option value="">Todos los Departamentos</option>
                {dptosList.map((dpto, idx) => (<option key={idx} value={dpto}>{dpto}</option>))}
              </select>
            </div>
          )}

          <div style={{ position: 'relative', width: '300px' }}>
            <input type="text" placeholder="Buscar por nombre, IP, hostname, AF..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', boxSizing: 'border-box' }} />
          </div>
        </div>
      </div>

      {/* Tabla Principal */}
      <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflowX: 'auto', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', width: '100%' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.95rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '2px solid #e2e8f0', color: '#475569' }}>
              {tab === 'usuarios' && (
                <>
                  <th style={{ padding: '1rem 1.2rem' }}>Nombre Completo</th>
                  <th style={{ padding: '1rem 1.2rem' }}>Cargo</th>
                  <th style={{ padding: '1rem 1.2rem' }}>Estado</th>
                  <th style={{ padding: '1rem 1.2rem' }}>Usuario Red</th>
                  <th style={{ padding: '1rem 1.2rem' }}>Hostname</th>
                  <th style={{ padding: '1rem 1.2rem' }}>Correo Corp.</th>
                  <th style={{ padding: '1rem 1.2rem' }}>Teléfono / Anexo</th>
                  <th style={{ padding: '1rem 1.2rem' }}>Departamento / Área</th>
                  <th style={{ padding: '1rem 1.2rem' }}>IP Asignada</th>
                  <th style={{ padding: '1rem 1.2rem', textAlign: 'center' }}>Acciones</th>
                </>
              )}
              {tab === 'equipos' && (
                <>
                  <th style={{ padding: '1rem 1.2rem' }}>Tipo</th>
                  <th style={{ padding: '1rem 1.2rem' }}>Marca / Modelo</th>
                  <th style={{ padding: '1rem 1.2rem' }}>N° Serie</th>
                  <th style={{ padding: '1rem 1.2rem' }}>Activo Fijo (AF)</th>
                  <th style={{ padding: '1rem 1.2rem' }}>Hostname</th>
                  <th style={{ padding: '1rem 1.2rem' }}>Asignado a</th>
                  <th style={{ padding: '1rem 1.2rem' }}>Fecha Asignación</th>
                  <th style={{ padding: '1rem 1.2rem' }}>Estado</th>
                  <th style={{ padding: '1rem 1.2rem', textAlign: 'center' }}>Acciones</th>
                </>
              )}
              {tab === 'perfiles' && (
                <>
                  <th style={{ padding: '1rem 1.2rem' }}>Nombre / Perfil</th>
                  <th style={{ padding: '1rem 1.2rem' }}>Usuario</th>
                  <th style={{ padding: '1rem 1.2rem' }}>Contraseña</th>
                  <th style={{ padding: '1rem 1.2rem' }}>Tipo Cuenta</th>
                  <th style={{ padding: '1rem 1.2rem' }}>Correo Asignado</th>
                  <th style={{ padding: '1rem 1.2rem' }}>Área</th>
                  <th style={{ padding: '1rem 1.2rem', textAlign: 'center' }}>Acciones</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr 
                key={item.id} 
                onClick={() => tab === 'usuarios' && setSelectedUser(item)}
                style={{ 
                  borderBottom: '1px solid #f1f5f9', 
                  color: '#334155', 
                  cursor: tab === 'usuarios' ? 'pointer' : 'default'
                }}
                onMouseEnter={(e) => { if (tab === 'usuarios') e.currentTarget.style.backgroundColor = '#f1f5f9'; }}
                onMouseLeave={(e) => { if (tab === 'usuarios') e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                {tab === 'usuarios' && (
                  <>
                    <td style={{ padding: '1rem 1.2rem', fontWeight: '600', color: '#2563eb' }}>{item.nombre_completo || 'N/I'}</td>
                    <td style={{ padding: '1rem 1.2rem', fontSize: '0.85rem', color: '#64748b' }}>{item.cargo || 'N/I'}</td>
                    <td style={{ padding: '1rem 1.2rem' }}>{getBadgeEstadoUsuario(item.estado)}</td>
                    <td style={{ padding: '1rem 1.2rem' }}>{item.usuario_red || 'N/I'}</td>
                    <td style={{ padding: '1rem 1.2rem', fontFamily: 'monospace', fontWeight: 'bold' }}>{item.hostname || 'N/I'}</td>
                    <td style={{ padding: '1rem 1.2rem' }}>{item.correo_corp || 'N/I'}</td>
                    <td style={{ padding: '1rem 1.2rem', fontSize: '0.85rem' }}>{item.telefono || item.anexo ? `${item.telefono || ''} ${item.anexo ? `(Anx: ${item.anexo})` : ''}` : 'N/I'}</td>
                    <td style={{ padding: '1rem 1.2rem' }}>{item.dpto_area || 'N/I'}</td>
                    <td style={{ padding: '1rem 1.2rem', color: item.ip_asignada ? '#16a34a' : '#94a3b8', fontWeight: 'bold' }}>{item.ip_asignada || 'Sin asignar'}</td>
                    <td style={{ padding: '1rem 1.2rem', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.6rem' }}>
                        <button onClick={() => setHistoryUsuario(item)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#d97706' }} title="Ver Historial de Modificaciones"><History size={18} /></button>
                        <button onClick={() => setEditingItem(item)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#2563eb' }} title="Editar"><Edit size={18} /></button>
                        <button onClick={() => handleDelete(item.id, item.nombre_completo)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#ef4444' }} title="Eliminar"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </>
                )}
                {tab === 'equipos' && (
                  <>
                    <td style={{ padding: '1rem 1.2rem', fontWeight: 'bold' }}>{item.tipo || 'N/I'}</td>
                    <td style={{ padding: '1rem 1.2rem' }}>{item.marca || ''} {item.modelo || ''}</td>
                    <td style={{ padding: '1rem 1.2rem', fontFamily: 'monospace' }}>{item.numero_serie || 'N/I'}</td>
                    <td style={{ padding: '1rem 1.2rem', fontFamily: 'monospace', fontWeight: 'bold' }}>{item.af || 'N/I'}</td>
                    <td style={{ padding: '1rem 1.2rem', fontFamily: 'monospace', fontWeight: 'bold', color: '#0284c7' }}>{item.hostname || 'N/I'}</td>
                    <td style={{ padding: '1rem 1.2rem', fontWeight: 'bold', color: item.usuario_red ? '#2563eb' : '#94a3b8' }}>
                      {item.usuario_red ? `${item.usuario_nombre} (${item.usuario_red})` : 'Disponible (Stock)'}
                    </td>
                    <td style={{ padding: '1rem 1.2rem', fontSize: '0.85rem' }}>{item.fecha_asignacion || 'N/A'}</td>
                    <td style={{ padding: '1rem 1.2rem' }}>{item.estado || 'ASIGNADO'}</td>
                    <td style={{ padding: '1rem 1.2rem', textAlign: 'center' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.6rem' }}>
                        <button onClick={() => setHistoryEquipo(item)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#d97706' }} title="Ver Historial Auditoría"><History size={18} /></button>
                        <button onClick={() => setEditingItem(item)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#2563eb' }} title="Editar"><Edit size={18} /></button>
                        <button onClick={() => handleDelete(item.id, `${item.marca || ''} ${item.modelo || ''}`)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#ef4444' }} title="Eliminar"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </>
                )}
                {tab === 'perfiles' && (
                  <>
                    <td style={{ padding: '1rem 1.2rem', fontWeight: '600' }}>{item.nombre || 'N/I'}</td>
                    <td style={{ padding: '1rem 1.2rem', fontWeight: 'bold' }}>{item.usuario || 'N/I'}</td>
                    <td style={{ padding: '1rem 1.2rem', fontFamily: 'monospace' }}>{item.password || '••••••••'}</td>
                    <td style={{ padding: '1rem 1.2rem' }}>{item.tipo}</td>
                    <td style={{ padding: '1rem 1.2rem' }}>{item.correo || 'N/I'}</td>
                    <td style={{ padding: '1rem 1.2rem' }}>{item.dpto_area || 'N/I'}</td>
                    <td style={{ padding: '1rem 1.2rem', textAlign: 'center' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
                        <button onClick={() => setEditingItem(item)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#2563eb' }} title="Editar"><Edit size={18} /></button>
                        <button onClick={() => handleDelete(item.id, item.usuario)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#ef4444' }} title="Eliminar"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Ficha Detallada de Usuario */}
      {selectedUser && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '12px', width: '600px', maxWidth: '95%', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)' }}>
            <div style={{ padding: '1.5rem', backgroundColor: '#0f172a', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <h2 style={{ margin: 0, fontSize: '1.3rem' }}>{selectedUser.nombre_completo}</h2>
                  {getBadgeEstadoUsuario(selectedUser.estado)}
                </div>
                <p style={{ margin: '0.25rem 0 0 0', color: '#94a3b8', fontSize: '0.85rem' }}>{selectedUser.cargo || 'Sin cargo'} — {selectedUser.dpto_area}</p>
              </div>
              <button onClick={() => { setSelectedUser(null); setShowUserPassGmail(false); setShowUserPassSimi(false); }} style={{ border: 'none', background: 'none', color: '#fff', cursor: 'pointer' }}><X size={22} /></button>
            </div>

            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', maxHeight: '75vh', overflowY: 'auto' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold' }}>Usuario de Red</span>
                  <p style={{ margin: '2px 0 0 0', fontWeight: '600' }}>{selectedUser.usuario_red}</p>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold' }}>Hostname</span>
                  <p style={{ margin: '2px 0 0 0', fontWeight: 'bold', color: '#0284c7' }}>{selectedUser.hostname || 'N/I'}</p>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold' }}>IP Asignada</span>
                  <p style={{ margin: '2px 0 0 0', fontWeight: 'bold', color: selectedUser.ip_asignada ? '#16a34a' : '#94a3b8' }}>{selectedUser.ip_asignada || 'Sin IP'}</p>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold' }}>Correo Corp.</span>
                  <p style={{ margin: '2px 0 0 0', fontSize: '0.85rem' }}>{selectedUser.correo_corp}</p>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold' }}>Gmail</span>
                  <p style={{ margin: '2px 0 0 0', fontSize: '0.85rem' }}>{selectedUser.gmail || 'Sin Gmail'}</p>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold' }}>Contraseña Gmail</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '2px' }}>
                    <span style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{showUserPassGmail ? (selectedUser.password_gmail || 'Sin Contraseña') : (selectedUser.password_gmail ? '••••••••' : 'Sin Contraseña')}</span>
                    {selectedUser.password_gmail && (
                      <button onClick={() => setShowUserPassGmail(!showUserPassGmail)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#64748b', padding: 0 }}>
                        {showUserPassGmail ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    )}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold' }}>Contraseña Simi</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '2px' }}>
                    <span style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{showUserPassSimi ? (selectedUser.password_simi || 'Sin Contraseña') : (selectedUser.password_simi ? '••••••••' : 'Sin Contraseña')}</span>
                    {selectedUser.password_simi && (
                      <button onClick={() => setShowUserPassSimi(!showUserPassSimi)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#64748b', padding: 0 }}>
                        {showUserPassSimi ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    )}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold' }}>Teléfono / Anexo</span>
                  <p style={{ margin: '2px 0 0 0', fontSize: '0.85rem' }}>{selectedUser.telefono || 'Sin teléfono'} {selectedUser.anexo ? `(Anx: ${selectedUser.anexo})` : ''}</p>
                </div>
              </div>

              {/* Equipos Asignados */}
              <div>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#1e293b', fontSize: '0.9rem', fontWeight: 'bold' }}>Equipos Asignados</h4>
                {selectedUser.equipos && selectedUser.equipos.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {selectedUser.equipos.map((eq) => (
                      <div key={eq.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f1f5f9', padding: '0.6rem 0.8rem', borderRadius: '6px', fontSize: '0.85rem' }}>
                        <div>
                          <strong>[{eq.tipo}] {eq.marca} {eq.modelo}</strong>
                          <span style={{ color: '#64748b', marginLeft: '8px', fontFamily: 'monospace' }}>S/N: {eq.numero_serie}</span>
                        </div>
                        <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#0284c7' }}>AF: {eq.af || 'N/I'}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: '0.85rem', color: '#94a3b8', fontStyle: 'italic', margin: 0 }}>Sin equipos vinculados actualmente.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Historial Independiente para Usuario (Con Ver Más / Ver Menos) */}
      {historyUsuario && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '12px', width: '650px', maxWidth: '95%', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)' }}>
            <div style={{ padding: '1.25rem', backgroundColor: '#0f172a', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Historial de Modificaciones</h3>
                <p style={{ margin: '2px 0 0 0', color: '#94a3b8', fontSize: '0.8rem' }}>{historyUsuario.nombre_completo} — Red: {historyUsuario.usuario_red}</p>
              </div>
              <button onClick={() => setHistoryUsuario(null)} style={{ border: 'none', background: 'none', color: '#fff', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            <div style={{ padding: '1.5rem', maxHeight: '60vh', overflowY: 'auto' }}>
              {historyUsuario.historial && historyUsuario.historial.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {historyUsuario.historial.map((h, i) => {
                    const isExpanded = !!expandedHistory[i];
                    return (
                      <div key={i} style={{ borderLeft: '3px solid #2563eb', paddingLeft: '1rem', backgroundColor: '#f8fafc', padding: '0.75rem', borderRadius: '0 8px 8px 0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                          <span style={{ fontWeight: 'bold', fontSize: '0.8rem', color: '#1e40af', backgroundColor: '#dbeafe', padding: '0.1rem 0.5rem', borderRadius: '4px' }}>{h.accion}</span>
                          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{new Date(h.fecha_movimiento).toLocaleString()}</span>
                        </div>
                        
                        <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <button 
                            onClick={() => setExpandedHistory(prev => ({ ...prev, [i]: !prev[i] }))} 
                            style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: 'bold', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', padding: 0 }}
                          >
                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            {isExpanded ? 'Ocultar detalles' : 'Ver más detalle'}
                          </button>
                        </div>

                        {isExpanded && (
                          <div style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid #e2e8f0', fontSize: '0.85rem', color: '#334155' }}>
                            <strong>Modificaciones:</strong> {h.observacion}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p style={{ textAlign: 'center', color: '#94a3b8', fontStyle: 'italic', margin: '2rem 0' }}>No existen registros de modificaciones para este usuario.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal Historial de Auditoría de Equipo (Con Ver Más / Ver Menos) */}
      {historyEquipo && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '12px', width: '650px', maxWidth: '95%', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)' }}>
            <div style={{ padding: '1.25rem', backgroundColor: '#0f172a', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Historial de Movimientos</h3>
                <p style={{ margin: '2px 0 0 0', color: '#94a3b8', fontSize: '0.8rem' }}>{historyEquipo.marca} {historyEquipo.modelo} — Serie: {historyEquipo.numero_serie}</p>
              </div>
              <button onClick={() => setHistoryEquipo(null)} style={{ border: 'none', background: 'none', color: '#fff', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            <div style={{ padding: '1.5rem', maxHeight: '60vh', overflowY: 'auto' }}>
              {historyEquipo.historial && historyEquipo.historial.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {historyEquipo.historial.map((h, i) => {
                    const isExpanded = !!expandedHistory[`eq_${i}`];
                    return (
                      <div key={i} style={{ borderLeft: '3px solid #2563eb', paddingLeft: '1rem', backgroundColor: '#f8fafc', padding: '0.75rem', borderRadius: '0 8px 8px 0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                          <span style={{ fontWeight: 'bold', fontSize: '0.8rem', color: '#1e40af', backgroundColor: '#dbeafe', padding: '0.1rem 0.5rem', borderRadius: '4px' }}>{h.accion}</span>
                          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{new Date(h.fecha_movimiento).toLocaleString()}</span>
                        </div>

                        <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <button 
                            onClick={() => setExpandedHistory(prev => ({ ...prev, [`eq_${i}`]: !prev[`eq_${i}`] }))} 
                            style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: 'bold', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', padding: 0 }}
                          >
                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            {isExpanded ? 'Ocultar detalles' : 'Ver más detalle'}
                          </button>
                        </div>

                        {isExpanded && (
                          <div style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid #e2e8f0', fontSize: '0.85rem', color: '#334155' }}>
                            <strong>Detalles:</strong> {h.observacion}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p style={{ textAlign: 'center', color: '#94a3b8', fontStyle: 'italic', margin: '2rem 0' }}>No existen registros de cambios para este equipo.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de Creación COMPLETO */}
      {newItem && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '12px', width: '500px', maxWidth: '90%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, color: '#0f172a' }}>Agregar Nuevo {tab === 'usuarios' ? 'Usuario' : tab === 'equipos' ? 'Equipo' : 'Perfil'}</h3>
              <button onClick={() => setNewItem(null)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            
            <form onSubmit={handleCreateSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '70vh', overflowY: 'auto', paddingRight: '0.5rem' }}>
              {tab === 'usuarios' && (
                <>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'bold' }}>Estado del Usuario</label>
                    <select value={newItem.estado || 'ACTIVO'} onChange={(e) => setNewItem({ ...newItem, estado: e.target.value })} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px', boxSizing: 'border-box' }}>
                      <option value="ACTIVO">Activo</option>
                      <option value="LICENCIA">Licencia Médica</option>
                      <option value="BAJA">Dar de Baja</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'bold' }}>Nombre Completo *</label>
                    <input type="text" required value={newItem.nombre_completo} onChange={(e) => setNewItem({ ...newItem, nombre_completo: e.target.value })} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#0284c7', fontWeight: 'bold' }}>Hostname</label>
                    <input type="text" placeholder="Ej: LAPTOP-FIN-01" value={newItem.hostname} onChange={(e) => setNewItem({ ...newItem, hostname: e.target.value })} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'bold' }}>Cargo</label>
                    <input type="text" value={newItem.cargo} onChange={(e) => setNewItem({ ...newItem, cargo: e.target.value })} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'bold' }}>Departamento / Área *</label>
                    <select required value={newItem.dpto_area} onChange={(e) => setNewItem({ ...newItem, dpto_area: e.target.value })} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px', boxSizing: 'border-box' }}>
                      <option value="">Selecciona un área...</option>
                      {dptosList.map((dpto, idx) => (<option key={idx} value={dpto}>{dpto}</option>))}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'bold' }}>Usuario de Red *</label>
                    <input type="text" required value={newItem.usuario_red} onChange={(e) => setNewItem({ ...newItem, usuario_red: e.target.value })} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'bold' }}>Correo Corp. *</label>
                    <input type="email" required value={newItem.correo_corp} onChange={(e) => setNewItem({ ...newItem, correo_corp: e.target.value })} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'bold' }}>Gmail</label>
                    <input type="email" value={newItem.gmail} onChange={(e) => setNewItem({ ...newItem, gmail: e.target.value })} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px', boxSizing: 'border-box' }} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    <div>
                      <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'bold' }}>Contraseña Gmail</label>
                      <input type="text" value={newItem.password_gmail} onChange={(e) => setNewItem({ ...newItem, password_gmail: e.target.value })} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px', boxSizing: 'border-box' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'bold' }}>Contraseña Simi</label>
                      <input type="text" value={newItem.password_simi} onChange={(e) => setNewItem({ ...newItem, password_simi: e.target.value })} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px', boxSizing: 'border-box' }} />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    <div>
                      <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'bold' }}>Teléfono</label>
                      <input type="text" value={newItem.telefono} onChange={(e) => setNewItem({ ...newItem, telefono: e.target.value })} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px', boxSizing: 'border-box' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'bold' }}>Anexo</label>
                      <input type="text" value={newItem.anexo} onChange={(e) => setNewItem({ ...newItem, anexo: e.target.value })} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px', boxSizing: 'border-box' }} />
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'bold' }}>IP Asignada (Solo números y puntos)</label>
                    <input type="text" placeholder="Ej: 192.168.1.50" value={newItem.ip_asignada} onChange={(e) => setNewItem({ ...newItem, ip_asignada: e.target.value })} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px', boxSizing: 'border-box' }} />
                  </div>
                </>
              )}

              {tab === 'equipos' && (
                <>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'bold' }}>Tipo de Equipo *</label>
                    <select value={newItem.tipo} onChange={(e) => setNewItem({ ...newItem, tipo: e.target.value })} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px', boxSizing: 'border-box' }}>
                      <option value="NTBK">Notebook (NTBK)</option>
                      <option value="CEL">Celular (CEL)</option>
                      <option value="TBIT">Tablet (TBIT)</option>
                      <option value="BAM">BAM / Router (BAM)</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'bold' }}>Marca *</label>
                    <input type="text" required value={newItem.marca} onChange={(e) => setNewItem({ ...newItem, marca: e.target.value })} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'bold' }}>Modelo *</label>
                    <input type="text" required value={newItem.modelo} onChange={(e) => setNewItem({ ...newItem, modelo: e.target.value })} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'bold' }}>N° de Serie *</label>
                    <input type="text" required value={newItem.numero_serie} onChange={(e) => setNewItem({ ...newItem, numero_serie: e.target.value })} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#0284c7', fontWeight: 'bold' }}>Hostname (Autocompleta usuario asignado)</label>
                    <input type="text" value={newItem.hostname} onChange={(e) => handleHostnameEquipoChange(e.target.value, newItem, setNewItem)} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'bold' }}>Activo Fijo (AF - Máx 12 dígitos)</label>
                    <input type="text" maxLength={12} value={newItem.af} onChange={(e) => setNewItem({ ...newItem, af: e.target.value })} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#2563eb', fontWeight: 'bold' }}>Asignar a Usuario</label>
                    <select value={newItem.usuario || ''} onChange={(e) => setNewItem({ ...newItem, usuario: e.target.value || null })} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px', boxSizing: 'border-box' }}>
                      <option value="">Sin Asignar (Stock)</option>
                      {usuariosList.map((usr) => (<option key={usr.id} value={usr.id}>{usr.nombre_completo} ({usr.usuario_red})</option>))}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'bold' }}>Fecha de Asignación</label>
                    <input type="date" value={newItem.fecha_asignacion || ''} onChange={(e) => setNewItem({ ...newItem, fecha_asignacion: e.target.value })} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px', boxSizing: 'border-box' }} />
                  </div>
                </>
              )}

              <button type="submit" style={{ backgroundColor: '#16a34a', color: '#fff', border: 'none', padding: '0.75rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', marginTop: '1rem' }}>
                <Save size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} /> Guardar Nuevo Registro
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Edición COMPLETO */}
      {editingItem && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '12px', width: '500px', maxWidth: '90%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, color: '#0f172a' }}>Editar Registro</h3>
              <button onClick={() => setEditingItem(null)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '70vh', overflowY: 'auto', paddingRight: '0.5rem' }}>
              {tab === 'usuarios' && (
                <>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'bold' }}>Estado del Usuario</label>
                    <select value={editingItem.estado || 'ACTIVO'} onChange={(e) => setEditingItem({ ...editingItem, estado: e.target.value })} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px', boxSizing: 'border-box' }}>
                      <option value="ACTIVO">Activo</option>
                      <option value="LICENCIA">Licencia Médica</option>
                      <option value="BAJA">Dar de Baja</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'bold' }}>Nombre Completo</label>
                    <input type="text" value={editingItem.nombre_completo || ''} onChange={(e) => setEditingItem({ ...editingItem, nombre_completo: e.target.value })} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#0284c7', fontWeight: 'bold' }}>Hostname</label>
                    <input type="text" value={editingItem.hostname || ''} onChange={(e) => setEditingItem({ ...editingItem, hostname: e.target.value })} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'bold' }}>Cargo</label>
                    <input type="text" value={editingItem.cargo || ''} onChange={(e) => setEditingItem({ ...editingItem, cargo: e.target.value })} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'bold' }}>Departamento / Área</label>
                    <select value={editingItem.dpto_area || ''} onChange={(e) => setEditingItem({ ...editingItem, dpto_area: e.target.value })} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px', boxSizing: 'border-box' }}>
                      <option value="">Selecciona un área...</option>
                      {dptosList.map((dpto, idx) => (<option key={idx} value={dpto}>{dpto}</option>))}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'bold' }}>Usuario de Red</label>
                    <input type="text" value={editingItem.usuario_red || ''} onChange={(e) => setEditingItem({ ...editingItem, usuario_red: e.target.value })} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'bold' }}>Correo Corp.</label>
                    <input type="email" value={editingItem.correo_corp || ''} onChange={(e) => setEditingItem({ ...editingItem, correo_corp: e.target.value })} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'bold' }}>Gmail</label>
                    <input type="email" value={editingItem.gmail || ''} onChange={(e) => setEditingItem({ ...editingItem, gmail: e.target.value })} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px', boxSizing: 'border-box' }} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    <div>
                      <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'bold' }}>Contraseña Gmail</label>
                      <input type="text" value={editingItem.password_gmail || ''} onChange={(e) => setEditingItem({ ...editingItem, password_gmail: e.target.value })} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px', boxSizing: 'border-box' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'bold' }}>Contraseña Simi</label>
                      <input type="text" value={editingItem.password_simi || ''} onChange={(e) => setEditingItem({ ...editingItem, password_simi: e.target.value })} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px', boxSizing: 'border-box' }} />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    <div>
                      <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'bold' }}>Teléfono</label>
                      <input type="text" value={editingItem.telefono || ''} onChange={(e) => setEditingItem({ ...editingItem, telefono: e.target.value })} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px', boxSizing: 'border-box' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'bold' }}>Anexo</label>
                      <input type="text" value={editingItem.anexo || ''} onChange={(e) => setEditingItem({ ...editingItem, anexo: e.target.value })} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px', boxSizing: 'border-box' }} />
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'bold' }}>IP Asignada (Solo números y puntos)</label>
                    <input type="text" value={editingItem.ip_asignada || ''} onChange={(e) => setEditingItem({ ...editingItem, ip_asignada: e.target.value })} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px', boxSizing: 'border-box' }} />
                  </div>
                </>
              )}

              {tab === 'equipos' && (
                <>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'bold' }}>Tipo de Equipo</label>
                    <select value={editingItem.tipo || 'NTBK'} onChange={(e) => setEditingItem({ ...editingItem, tipo: e.target.value })} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px', boxSizing: 'border-box' }}>
                      <option value="NTBK">Notebook (NTBK)</option>
                      <option value="CEL">Celular (CEL)</option>
                      <option value="TBIT">Tablet (TBIT)</option>
                      <option value="BAM">BAM / Router (BAM)</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'bold' }}>Marca</label>
                    <input type="text" value={editingItem.marca || ''} onChange={(e) => setEditingItem({ ...editingItem, marca: e.target.value })} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'bold' }}>Modelo</label>
                    <input type="text" value={editingItem.modelo || ''} onChange={(e) => setEditingItem({ ...editingItem, modelo: e.target.value })} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'bold' }}>N° de Serie</label>
                    <input type="text" value={editingItem.numero_serie || ''} onChange={(e) => setEditingItem({ ...editingItem, numero_serie: e.target.value })} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#0284c7', fontWeight: 'bold' }}>Hostname</label>
                    <input type="text" value={editingItem.hostname || ''} onChange={(e) => handleHostnameEquipoChange(e.target.value, editingItem, setEditingItem)} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'bold' }}>Activo Fijo (AF)</label>
                    <input type="text" maxLength={12} value={editingItem.af || ''} onChange={(e) => setEditingItem({ ...editingItem, af: e.target.value })} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#2563eb', fontWeight: 'bold' }}>Asignar a Usuario</label>
                    <select value={editingItem.usuario || ''} onChange={(e) => setEditingItem({ ...editingItem, usuario: e.target.value || null })} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px', boxSizing: 'border-box' }}>
                      <option value="">Sin Asignar (Stock)</option>
                      {usuariosList.map((usr) => (<option key={usr.id} value={usr.id}>{usr.nombre_completo} ({usr.usuario_red})</option>))}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'bold' }}>Fecha de Asignación</label>
                    <input type="date" value={editingItem.fecha_asignacion || ''} onChange={(e) => setEditingItem({ ...editingItem, fecha_asignacion: e.target.value })} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'bold' }}>Estado</label>
                    <select value={editingItem.estado || 'ASIGNADO'} onChange={(e) => setEditingItem({ ...editingItem, estado: e.target.value })} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px', boxSizing: 'border-box' }}>
                      <option value="ASIGNADO">Asignado</option>
                      <option value="STOCK">Stock / Disponible</option>
                      <option value="MANTENCION">En Mantención</option>
                      <option value="BAJA">Dado de Baja</option>
                    </select>
                  </div>
                </>
              )}

              <button type="submit" style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '0.75rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', marginTop: '1rem' }}>
                <Save size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} /> Guardar Cambios
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}