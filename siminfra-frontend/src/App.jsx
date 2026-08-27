import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, User, Monitor, Key, Edit, Save, X, LogOut, Lock, Laptop, Smartphone, Tablet, Radio, Eye, EyeOff, Trash2, Filter, Plus } from 'lucide-react';

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
  const [newItem, setNewItem] = useState(null); // Estado para la creación de nuevos elementos
  const [selectedUser, setSelectedUser] = useState(null);
  const [showPasswords, setShowPasswords] = useState({});

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
      console.error('Error cargando lista de departamentos:', error);
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

  // Función para inicializar un nuevo ítem según la pestaña
  const handleOpenCreateModal = () => {
    if (tab === 'usuarios') {
      setNewItem({
        nombre_completo: '',
        cargo: '',
        dpto_area: dptosList[0] || '',
        usuario_red: '',
        correo_corp: '',
        ip_asignada: '',
        hostname: '',
        estado: 'ACTIVO'
      });
    } else if (tab === 'equipos') {
      setNewItem({
        tipo: 'NTBK',
        marca: '',
        modelo: '',
        numero_serie: '',
        af: '',
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
    try {
      const endpoint = tab === 'usuarios' ? 'usuarios' : tab === 'equipos' ? 'equipos' : 'perfiles-genericos';
      
      const payload = { ...newItem };

      // Convertir cadenas vacías a null para campos opcionales
      Object.keys(payload).forEach(key => {
        if (payload[key] === '') payload[key] = null;
      });

      await axios.post(`${API_BASE}/${endpoint}/`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setNewItem(null);
      await fetchData();
      fetchDptos();
    } catch (error) {
      console.error('Error creando registro:', error.response?.data || error);
      alert('Error al crear registro: ' + JSON.stringify(error.response?.data || 'Verifica los campos requeridos'));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const endpoint = tab === 'usuarios' ? 'usuarios' : tab === 'equipos' ? 'equipos' : 'perfiles-genericos';
      
      const payload = { ...editingItem };
      delete payload.equipos;
      delete payload.id;

      if (payload.estado) {
        payload.estado = payload.estado.toUpperCase();
      }

      await axios.patch(`${API_BASE}/${endpoint}/${editingItem.id}/`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setEditingItem(null);
      await fetchData();
      fetchDptos();
    } catch (error) {
      console.error('Error guardando cambios:', error.response?.data || error);
      alert('Error al guardar: ' + JSON.stringify(error.response?.data || 'Verifica los datos ingresados'));
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
      } catch (error) {
        console.error('Error al eliminar registro:', error);
      }
    }
  };

  const togglePasswordVisibility = (id) => {
    setShowPasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getBadgeEstadoUsuario = (estado) => {
    switch(estado) {
      case 'LICENCIA':
        return <span style={{ padding: '0.25rem 0.65rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold', backgroundColor: '#fef3c7', color: '#b45309' }}>Licencia Médica</span>;
      case 'BAJA':
        return <span style={{ padding: '0.25rem 0.65rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold', backgroundColor: '#fee2e2', color: '#b91c1c' }}>Dar de Baja</span>;
      default:
        return <span style={{ padding: '0.25rem 0.65rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold', backgroundColor: '#dcfce7', color: '#15803d' }}>Activo</span>;
    }
  };

  const getIconoEquipo = (tipo) => {
    switch(tipo) {
      case 'NTBK': return <Laptop size={18} color="#2563eb" />;
      case 'CEL': return <Smartphone size={18} color="#16a34a" />;
      case 'TBIT': return <Tablet size={18} color="#9333ea" />;
      default: return <Radio size={18} color="#ea580c" />;
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
            <input 
              type="text" 
              required
              value={username} 
              onChange={(e) => setUsername(e.target.value)}
              style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontSize: '0.8rem', color: '#475569', fontWeight: 'bold' }}>Contraseña</label>
            <input 
              type="password" 
              required
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px', boxSizing: 'border-box' }}
            />
          </div>

          <button type="submit" style={{ width: '100%', backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '0.75rem', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
            Ingresar
          </button>
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
          {/* Botón de Creación Nuevo */}
          <button 
            onClick={handleOpenCreateModal} 
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.2rem', borderRadius: '8px', border: 'none', backgroundColor: '#16a34a', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}
          >
            <Plus size={18} /> Agregar {tab === 'usuarios' ? 'Usuario' : tab === 'equipos' ? 'Equipo' : 'Perfil'}
          </button>

          {/* Filtro desplegable por Departamento */}
          {(tab === 'usuarios' || tab === 'perfiles') && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#fff', border: '1px solid #cbd5e1', padding: '0.4rem 0.8rem', borderRadius: '8px' }}>
              <Filter size={16} color="#64748b" />
              <select 
                value={selectedDpto} 
                onChange={(e) => setSelectedDpto(e.target.value)}
                style={{ border: 'none', outline: 'none', backgroundColor: 'transparent', fontSize: '0.85rem', color: '#334155', cursor: 'pointer' }}
              >
                <option value="">Todos los Departamentos</option>
                {dptosList.map((dpto, idx) => (
                  <option key={idx} value={dpto}>{dpto}</option>
                ))}
              </select>
            </div>
          )}

          {/* Buscador General */}
          <div style={{ position: 'relative', width: '300px' }}>
            <input 
              type="text" 
              placeholder="Buscar por nombre, IP, serie, correo..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', boxSizing: 'border-box' }}
            />
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
                  <th style={{ padding: '1rem 1.2rem' }}>Correo Corporativo</th>
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
                style={{ borderBottom: '1px solid #f1f5f9', color: '#334155', cursor: tab === 'usuarios' ? 'pointer' : 'default' }}
                onClick={() => tab === 'usuarios' && setSelectedUser(item)}
              >
                {tab === 'usuarios' && (
                  <>
                    <td style={{ padding: '1rem 1.2rem', fontWeight: '600', color: '#2563eb' }}>{item.nombre_completo}</td>
                    <td style={{ padding: '1rem 1.2rem', fontSize: '0.85rem', color: '#64748b' }}>{item.cargo || 'N/I'}</td>
                    <td style={{ padding: '1rem 1.2rem' }}>{getBadgeEstadoUsuario(item.estado)}</td>
                    <td style={{ padding: '1rem 1.2rem' }}>{item.usuario_red}</td>
                    <td style={{ padding: '1rem 1.2rem' }}>{item.correo_corp}</td>
                    <td style={{ padding: '1rem 1.2rem' }}>{item.dpto_area}</td>
                    <td style={{ padding: '1rem 1.2rem', color: item.ip_asignada ? '#16a34a' : '#94a3b8', fontWeight: 'bold' }}>{item.ip_asignada || 'Sin asignar'}</td>
                    <td style={{ padding: '1rem 1.2rem', textAlign: 'center' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
                        <button 
                          onClick={(e) => { e.stopPropagation(); setEditingItem(item); }} 
                          style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#2563eb' }}
                          title="Editar"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleDelete(item.id, item.nombre_completo); }} 
                          style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#ef4444' }}
                          title="Eliminar"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </>
                )}
                {tab === 'equipos' && (
                  <>
                    <td style={{ padding: '1rem 1.2rem', fontWeight: 'bold' }}>{item.tipo}</td>
                    <td style={{ padding: '1rem 1.2rem' }}>{item.marca} {item.modelo}</td>
                    <td style={{ padding: '1rem 1.2rem', fontFamily: 'monospace' }}>{item.numero_serie}</td>
                    <td style={{ padding: '1rem 1.2rem' }}>{item.af || 'N/I'}</td>
                    <td style={{ padding: '1rem 1.2rem' }}>{item.estado}</td>
                    <td style={{ padding: '1rem 1.2rem', textAlign: 'center' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
                        <button onClick={() => setEditingItem(item)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#2563eb' }} title="Editar">
                          <Edit size={18} />
                        </button>
                        <button onClick={() => handleDelete(item.id, `${item.marca} ${item.modelo}`)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#ef4444' }} title="Eliminar">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </>
                )}
                {tab === 'perfiles' && (
                  <>
                    <td style={{ padding: '1rem 1.2rem', fontWeight: '600' }}>{item.nombre || 'N/I'}</td>
                    <td style={{ padding: '1rem 1.2rem', fontWeight: 'bold' }}>{item.usuario}</td>
                    <td style={{ padding: '1rem 1.2rem', fontFamily: 'monospace' }}>
                      {item.password ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span>{showPasswords[item.id] ? item.password : '••••••••'}</span>
                          <button onClick={() => togglePasswordVisibility(item.id)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#64748b' }}>
                            {showPasswords[item.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      ) : <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Sin contraseña</span>}
                    </td>
                    <td style={{ padding: '1rem 1.2rem' }}>
                      <span style={{ padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold', backgroundColor: item.tipo === 'O365' ? '#dbeafe' : '#fef3c7', color: item.tipo === 'O365' ? '#1e40af' : '#92400e' }}>
                        {item.tipo}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.2rem' }}>{item.correo || <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Sin correo</span>}</td>
                    <td style={{ padding: '1rem 1.2rem' }}>{item.dpto_area || 'N/I'}</td>
                    <td style={{ padding: '1rem 1.2rem', textAlign: 'center' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
                        <button onClick={() => setEditingItem(item)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#2563eb' }} title="Editar">
                          <Edit size={18} />
                        </button>
                        <button onClick={() => handleDelete(item.id, item.usuario)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#ef4444' }} title="Eliminar">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Ficha Detallada Usuario */}
      {selectedUser && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '12px', width: '600px', maxWidth: '95%', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)' }}>
            <div style={{ padding: '1.5rem', backgroundColor: '#0f172a', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <h2 style={{ margin: 0, fontSize: '1.3rem' }}>{selectedUser.nombre_completo}</h2>
                  {getBadgeEstadoUsuario(selectedUser.estado)}
                </div>
                <p style={{ margin: '0.25rem 0 0 0', color: '#94a3b8', fontSize: '0.85rem' }}>{selectedUser.cargo} — {selectedUser.dpto_area}</p>
              </div>
              <button onClick={() => setSelectedUser(null)} style={{ border: 'none', background: 'none', color: '#fff', cursor: 'pointer' }}>
                <X size={22} />
              </button>
            </div>

            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold' }}>Usuario de Red</span>
                  <p style={{ margin: '2px 0 0 0', fontWeight: '600' }}>{selectedUser.usuario_red}</p>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold' }}>IP Asignada</span>
                  <p style={{ margin: '2px 0 0 0', fontWeight: 'bold', color: selectedUser.ip_asignada ? '#16a34a' : '#94a3b8' }}>{selectedUser.ip_asignada || 'Sin IP'}</p>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold' }}>Correo Corporativo</span>
                  <p style={{ margin: '2px 0 0 0', fontSize: '0.85rem' }}>{selectedUser.correo_corp}</p>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold' }}>Hostname</span>
                  <p style={{ margin: '2px 0 0 0', fontSize: '0.85rem' }}>{selectedUser.hostname || 'N/I'}</p>
                </div>
              </div>

              <div>
                <h4 style={{ margin: '0 0 0.75rem 0', color: '#0f172a' }}>Equipos y Activos Asignados ({selectedUser.equipos?.length || 0})</h4>
                {selectedUser.equipos && selectedUser.equipos.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {selectedUser.equipos.map((eq) => (
                      <div key={eq.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: '#fff' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          {getIconoEquipo(eq.tipo)}
                          <div>
                            <p style={{ margin: 0, fontWeight: 'bold', fontSize: '0.85rem' }}>{eq.marca} {eq.modelo}</p>
                            <span style={{ fontSize: '0.75rem', color: '#64748b', fontFamily: 'monospace' }}>Serie: {eq.numero_serie}</span>
                          </div>
                        </div>
                        {eq.af && <span style={{ fontSize: '0.75rem', backgroundColor: '#f1f5f9', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>AF: {eq.af}</span>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: '0.85rem', color: '#94a3b8', fontStyle: 'italic', margin: 0 }}>No tiene equipos vinculados directamente.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Creación */}
      {newItem && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '12px', width: '480px', maxWidth: '90%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, color: '#0f172a' }}>
                Agregar Nuevo {tab === 'usuarios' ? 'Usuario' : tab === 'equipos' ? 'Equipo' : 'Perfil Genérico'}
              </h3>
              <button onClick={() => setNewItem(null)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            
            <form onSubmit={handleCreateSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '70vh', overflowY: 'auto', paddingRight: '0.5rem' }}>
              
              {/* CREACIÓN DE USUARIO */}
              {tab === 'usuarios' && (
                <>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'bold' }}>Nombre Completo *</label>
                    <input 
                      type="text" required
                      value={newItem.nombre_completo} 
                      onChange={(e) => setNewItem({ ...newItem, nombre_completo: e.target.value })}
                      style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'bold' }}>Usuario de Red *</label>
                    <input 
                      type="text" required
                      value={newItem.usuario_red} 
                      onChange={(e) => setNewItem({ ...newItem, usuario_red: e.target.value })}
                      style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'bold' }}>Correo Corporativo *</label>
                    <input 
                      type="email" required
                      value={newItem.correo_corp} 
                      onChange={(e) => setNewItem({ ...newItem, correo_corp: e.target.value })}
                      style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'bold' }}>Departamento / Área *</label>
                    <select 
                      required
                      value={newItem.dpto_area} 
                      onChange={(e) => setNewItem({ ...newItem, dpto_area: e.target.value })}
                      style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px', boxSizing: 'border-box' }}
                    >
                      <option value="">Selecciona un área...</option>
                      {dptosList.map((dpto, idx) => (
                        <option key={idx} value={dpto}>{dpto}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'bold' }}>Cargo</label>
                    <input 
                      type="text" 
                      value={newItem.cargo} 
                      onChange={(e) => setNewItem({ ...newItem, cargo: e.target.value })}
                      style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'bold' }}>IP Asignada</label>
                    <input 
                      type="text" 
                      placeholder="Ej: 192.168.1.50"
                      value={newItem.ip_asignada} 
                      onChange={(e) => setNewItem({ ...newItem, ip_asignada: e.target.value })}
                      style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'bold' }}>Hostname</label>
                    <input 
                      type="text" 
                      value={newItem.hostname} 
                      onChange={(e) => setNewItem({ ...newItem, hostname: e.target.value })}
                      style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px', boxSizing: 'border-box' }}
                    />
                  </div>
                </>
              )}

              {/* CREACIÓN DE EQUIPO */}
              {tab === 'equipos' && (
                <>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'bold' }}>Tipo de Equipo *</label>
                    <select 
                      value={newItem.tipo} 
                      onChange={(e) => setNewItem({ ...newItem, tipo: e.target.value })}
                      style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px', boxSizing: 'border-box' }}
                    >
                      <option value="NTBK">Notebook (NTBK)</option>
                      <option value="CEL">Celular (CEL)</option>
                      <option value="TBIT">Tablet (TBIT)</option>
                      <option value="BAM">BAM / Router (BAM)</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'bold' }}>Marca *</label>
                    <input 
                      type="text" required
                      value={newItem.marca} 
                      onChange={(e) => setNewItem({ ...newItem, marca: e.target.value })}
                      style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'bold' }}>Modelo *</label>
                    <input 
                      type="text" required
                      value={newItem.modelo} 
                      onChange={(e) => setNewItem({ ...newItem, modelo: e.target.value })}
                      style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'bold' }}>N° de Serie *</label>
                    <input 
                      type="text" required
                      value={newItem.numero_serie} 
                      onChange={(e) => setNewItem({ ...newItem, numero_serie: e.target.value })}
                      style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'bold' }}>Activo Fijo (AF)</label>
                    <input 
                      type="text" 
                      value={newItem.af} 
                      onChange={(e) => setNewItem({ ...newItem, af: e.target.value })}
                      style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px', boxSizing: 'border-box' }}
                    />
                  </div>
                </>
              )}

              {/* CREACIÓN DE PERFIL GENÉRICO */}
              {tab === 'perfiles' && (
                <>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'bold' }}>Nombre / Identificador</label>
                    <input 
                      type="text" 
                      value={newItem.nombre} 
                      onChange={(e) => setNewItem({ ...newItem, nombre: e.target.value })}
                      style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'bold' }}>Usuario *</label>
                    <input 
                      type="text" required
                      value={newItem.usuario} 
                      onChange={(e) => setNewItem({ ...newItem, usuario: e.target.value })}
                      style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'bold' }}>Contraseña</label>
                    <input 
                      type="text" 
                      value={newItem.password} 
                      onChange={(e) => setNewItem({ ...newItem, password: e.target.value })}
                      style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'bold' }}>Correo Asignado</label>
                    <input 
                      type="email" 
                      value={newItem.correo} 
                      onChange={(e) => setNewItem({ ...newItem, correo: e.target.value })}
                      style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'bold' }}>Departamento / Área</label>
                    <select 
                      value={newItem.dpto_area} 
                      onChange={(e) => setNewItem({ ...newItem, dpto_area: e.target.value })}
                      style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px', boxSizing: 'border-box' }}
                    >
                      <option value="">Selecciona un área...</option>
                      {dptosList.map((dpto, idx) => (
                        <option key={idx} value={dpto}>{dpto}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'bold' }}>Tipo de Cuenta</label>
                    <select 
                      value={newItem.tipo} 
                      onChange={(e) => setNewItem({ ...newItem, tipo: e.target.value })}
                      style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px', boxSizing: 'border-box' }}
                    >
                      <option value="ONPREMISE">On-Premise</option>
                      <option value="O365">Office 365</option>
                    </select>
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

      {/* Modal de Edición */}
      {editingItem && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '12px', width: '480px', maxWidth: '90%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, color: '#0f172a' }}>Editar Registro</h3>
              <button onClick={() => setEditingItem(null)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '70vh', overflowY: 'auto', paddingRight: '0.5rem' }}>
              
              {/* EDICIÓN PARA USUARIOS */}
              {tab === 'usuarios' && (
                <>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'bold' }}>Estado del Usuario</label>
                    <select 
                      value={editingItem.estado || 'ACTIVO'} 
                      onChange={(e) => setEditingItem({ ...editingItem, estado: e.target.value })}
                      style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px', boxSizing: 'border-box' }}
                    >
                      <option value="ACTIVO">Activo</option>
                      <option value="LICENCIA">Licencia Médica</option>
                      <option value="BAJA">Dar de Baja</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'bold' }}>Nombre Completo</label>
                    <input 
                      type="text" 
                      value={editingItem.nombre_completo || ''} 
                      onChange={(e) => setEditingItem({ ...editingItem, nombre_completo: e.target.value })}
                      style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'bold' }}>Cargo</label>
                    <input 
                      type="text" 
                      value={editingItem.cargo || ''} 
                      onChange={(e) => setEditingItem({ ...editingItem, cargo: e.target.value })}
                      style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'bold' }}>Departamento / Área</label>
                    <select 
                      value={editingItem.dpto_area || ''} 
                      onChange={(e) => setEditingItem({ ...editingItem, dpto_area: e.target.value })}
                      style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px', boxSizing: 'border-box' }}
                    >
                      <option value="">Selecciona un área...</option>
                      {dptosList.map((dpto, idx) => (
                        <option key={idx} value={dpto}>{dpto}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'bold' }}>Usuario de Red</label>
                    <input 
                      type="text" 
                      value={editingItem.usuario_red || ''} 
                      onChange={(e) => setEditingItem({ ...editingItem, usuario_red: e.target.value })}
                      style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'bold' }}>Correo Corporativo</label>
                    <input 
                      type="email" 
                      value={editingItem.correo_corp || ''} 
                      onChange={(e) => setEditingItem({ ...editingItem, correo_corp: e.target.value })}
                      style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'bold' }}>IP Asignada</label>
                    <input 
                      type="text" 
                      value={editingItem.ip_asignada || ''} 
                      onChange={(e) => setEditingItem({ ...editingItem, ip_asignada: e.target.value })}
                      style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'bold' }}>Hostname</label>
                    <input 
                      type="text" 
                      value={editingItem.hostname || ''} 
                      onChange={(e) => setEditingItem({ ...editingItem, hostname: e.target.value })}
                      style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px', boxSizing: 'border-box' }}
                    />
                  </div>
                </>
              )}

              {/* EDICIÓN PARA EQUIPOS */}
              {tab === 'equipos' && (
                <>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'bold' }}>Tipo de Equipo</label>
                    <select 
                      value={editingItem.tipo || 'NTBK'} 
                      onChange={(e) => setEditingItem({ ...editingItem, tipo: e.target.value })}
                      style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px', boxSizing: 'border-box' }}
                    >
                      <option value="NTBK">Notebook (NTBK)</option>
                      <option value="CEL">Celular (CEL)</option>
                      <option value="TBIT">Tablet (TBIT)</option>
                      <option value="BAM">BAM / Router (BAM)</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'bold' }}>Marca</label>
                    <input 
                      type="text" 
                      value={editingItem.marca || ''} 
                      onChange={(e) => setEditingItem({ ...editingItem, marca: e.target.value })}
                      style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'bold' }}>Modelo</label>
                    <input 
                      type="text" 
                      value={editingItem.modelo || ''} 
                      onChange={(e) => setEditingItem({ ...editingItem, modelo: e.target.value })}
                      style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'bold' }}>N° de Serie</label>
                    <input 
                      type="text" 
                      value={editingItem.numero_serie || ''} 
                      onChange={(e) => setEditingItem({ ...editingItem, numero_serie: e.target.value })}
                      style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'bold' }}>Activo Fijo (AF)</label>
                    <input 
                      type="text" 
                      value={editingItem.af || ''} 
                      onChange={(e) => setEditingItem({ ...editingItem, af: e.target.value })}
                      style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'bold' }}>Estado</label>
                    <select 
                      value={editingItem.estado || 'ASIGNADO'} 
                      onChange={(e) => setEditingItem({ ...editingItem, estado: e.target.value })}
                      style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px', boxSizing: 'border-box' }}
                    >
                      <option value="ASIGNADO">Asignado</option>
                      <option value="STOCK">Stock / Disponible</option>
                      <option value="MANTENCION">En Mantención</option>
                      <option value="BAJA">Dado de Baja</option>
                    </select>
                  </div>
                </>
              )}

              {/* EDICIÓN PARA PERFILES GENÉRICOS */}
              {tab === 'perfiles' && (
                <>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'bold' }}>Nombre / Identificador</label>
                    <input 
                      type="text" 
                      value={editingItem.nombre || ''} 
                      onChange={(e) => setEditingItem({ ...editingItem, nombre: e.target.value })}
                      style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'bold' }}>Usuario</label>
                    <input 
                      type="text" 
                      value={editingItem.usuario || ''} 
                      onChange={(e) => setEditingItem({ ...editingItem, usuario: e.target.value })}
                      style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'bold' }}>Contraseña</label>
                    <input 
                      type="text" 
                      value={editingItem.password || ''} 
                      onChange={(e) => setEditingItem({ ...editingItem, password: e.target.value })}
                      style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'bold' }}>Correo Asignado</label>
                    <input 
                      type="email" 
                      value={editingItem.correo || ''} 
                      onChange={(e) => setEditingItem({ ...editingItem, correo: e.target.value })}
                      style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'bold' }}>Departamento / Área</label>
                    <select 
                      value={editingItem.dpto_area || ''} 
                      onChange={(e) => setEditingItem({ ...editingItem, dpto_area: e.target.value })}
                      style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px', boxSizing: 'border-box' }}
                    >
                      <option value="">Selecciona un área...</option>
                      {dptosList.map((dpto, idx) => (
                        <option key={idx} value={dpto}>{dpto}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'bold' }}>Tipo de Cuenta</label>
                    <select 
                      value={editingItem.tipo || 'ONPREMISE'} 
                      onChange={(e) => setEditingItem({ ...editingItem, tipo: e.target.value })}
                      style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px', boxSizing: 'border-box' }}
                    >
                      <option value="ONPREMISE">On-Premise</option>
                      <option value="O365">Office 365</option>
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