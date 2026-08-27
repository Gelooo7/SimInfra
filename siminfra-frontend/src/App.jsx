import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, User, Monitor, Key, Edit, Save, X, LogOut, Lock } from 'lucide-react';

const API_BASE = 'http://127.0.0.1:8000/api';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('access_token') || null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [tab, setTab] = useState('usuarios');
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [editingItem, setEditingItem] = useState(null);

  // Manejo de inicio de sesión
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

  // Cargar datos utilizando el Token JWT
  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [tab, search, token]);

  const fetchData = async () => {
    try {
      const endpoint = tab === 'usuarios' ? 'usuarios' : tab === 'equipos' ? 'equipos' : 'perfiles-genericos';
      const response = await axios.get(`${API_BASE}/${endpoint}/?search=${search}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(response.data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        handleLogout();
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const endpoint = tab === 'usuarios' ? 'usuarios' : tab === 'equipos' ? 'equipos' : 'perfiles-genericos';
      await axios.patch(`${API_BASE}/${endpoint}/${editingItem.id}/`, editingItem, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEditingItem(null);
      fetchData();
    } catch (error) {
      console.error('Error guardando cambios:', error);
    }
  };

  // Vista de Login si no hay Token
  if (!token) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#f1f5f9', fontFamily: 'system-ui, sans-serif' }}>
        <form onSubmit={handleLogin} style={{ backgroundColor: '#fff', padding: '2.5rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', width: '360px' }}>
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

  // Vista Principal de la App (Protegida)
  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', color: '#1e293b', margin: 0 }}>SimInfra — Gestión de Infraestructura</h1>
          <p style={{ color: '#64748b', marginTop: '0.25rem' }}>Panel Administrador de Usuarios y Activos</p>
        </div>
        <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#fff', cursor: 'pointer', color: '#ef4444', fontWeight: 'bold' }}>
          <LogOut size={16} /> Cerrar Sesión
        </button>
      </header>

      {/* Navegación y Filtros */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={() => setTab('usuarios')} style={{ padding: '0.6rem 1.2rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold', backgroundColor: tab === 'usuarios' ? '#2563eb' : '#e2e8f0', color: tab === 'usuarios' ? '#fff' : '#475569' }}>
            <User size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} /> Usuarios ({tab === 'usuarios' ? data.length : ''})
          </button>
          <button onClick={() => setTab('equipos')} style={{ padding: '0.6rem 1.2rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold', backgroundColor: tab === 'equipos' ? '#2563eb' : '#e2e8f0', color: tab === 'equipos' ? '#fff' : '#475569' }}>
            <Monitor size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} /> Equipos ({tab === 'equipos' ? data.length : ''})
          </button>
          <button onClick={() => setTab('perfiles')} style={{ padding: '0.6rem 1.2rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold', backgroundColor: tab === 'perfiles' ? '#2563eb' : '#e2e8f0', color: tab === 'perfiles' ? '#fff' : '#475569' }}>
            <Key size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} /> Perfiles Genéricos ({tab === 'perfiles' ? data.length : ''})
          </button>
        </div>

        <div style={{ position: 'relative', width: '300px' }}>
          <input 
            type="text" 
            placeholder="Buscar por nombre, IP, serie..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
          />
        </div>
      </div>

      {/* Tabla de Registros */}
      <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflowX: 'auto', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
              {tab === 'usuarios' && (
                <>
                  <th style={{ padding: '1rem' }}>Nombre</th>
                  <th style={{ padding: '1rem' }}>Usuario Red</th>
                  <th style={{ padding: '1rem' }}>Correo</th>
                  <th style={{ padding: '1rem' }}>Área</th>
                  <th style={{ padding: '1rem' }}>IP Asignada</th>
                  <th style={{ padding: '1rem' }}>Acciones</th>
                </>
              )}
              {tab === 'equipos' && (
                <>
                  <th style={{ padding: '1rem' }}>Tipo</th>
                  <th style={{ padding: '1rem' }}>Marca / Modelo</th>
                  <th style={{ padding: '1rem' }}>N° Serie</th>
                  <th style={{ padding: '1rem' }}>Estado</th>
                  <th style={{ padding: '1rem' }}>Acciones</th>
                </>
              )}
              {tab === 'perfiles' && (
                <>
                  <th style={{ padding: '1rem' }}>Nombre</th>
                  <th style={{ padding: '1rem' }}>Usuario</th>
                  <th style={{ padding: '1rem' }}>Tipo</th>
                  <th style={{ padding: '1rem' }}>Correo</th>
                  <th style={{ padding: '1rem' }}>Acciones</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9', color: '#334155' }}>
                {tab === 'usuarios' && (
                  <>
                    <td style={{ padding: '1rem', fontWeight: '600' }}>{item.nombre_completo}</td>
                    <td style={{ padding: '1rem' }}>{item.usuario_red}</td>
                    <td style={{ padding: '1rem' }}>{item.correo_corp}</td>
                    <td style={{ padding: '1rem' }}>{item.dpto_area}</td>
                    <td style={{ padding: '1rem', color: item.ip_asignada ? '#16a34a' : '#94a3b8', fontWeight: 'bold' }}>{item.ip_asignada || 'Sin asignar'}</td>
                    <td style={{ padding: '1rem' }}>
                      <button onClick={() => setEditingItem(item)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#2563eb' }}>
                        <Edit size={18} />
                      </button>
                    </td>
                  </>
                )}
                {tab === 'equipos' && (
                  <>
                    <td style={{ padding: '1rem', fontWeight: 'bold' }}>{item.tipo}</td>
                    <td style={{ padding: '1rem' }}>{item.marca} {item.modelo}</td>
                    <td style={{ padding: '1rem', fontFamily: 'monospace' }}>{item.numero_serie}</td>
                    <td style={{ padding: '1rem' }}>{item.estado}</td>
                    <td style={{ padding: '1rem' }}>
                      <button onClick={() => setEditingItem(item)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#2563eb' }}>
                        <Edit size={18} />
                      </button>
                    </td>
                  </>
                )}
                {tab === 'perfiles' && (
                  <>
                    <td style={{ padding: '1rem', fontWeight: '600' }}>{item.nombre}</td>
                    <td style={{ padding: '1rem' }}>{item.usuario}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.8rem', backgroundColor: item.tipo === 'O365' ? '#dbeafe' : '#fef3c7', color: item.tipo === 'O365' ? '#1e40af' : '#92400e' }}>
                        {item.tipo}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>{item.correo || 'N/I'}</td>
                    <td style={{ padding: '1rem' }}>
                      <button onClick={() => setEditingItem(item)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#2563eb' }}>
                        <Edit size={18} />
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de Edición */}
      {editingItem && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '12px', width: '400px', maxWidth: '90%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0 }}>Editar Registro</h3>
              <button onClick={() => setEditingItem(null)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {tab === 'usuarios' && (
                <>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#64748b' }}>IP Asignada</label>
                    <input 
                      type="text" 
                      value={editingItem.ip_asignada || ''} 
                      onChange={(e) => setEditingItem({ ...editingItem, ip_asignada: e.target.value })}
                      style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#64748b' }}>Correo</label>
                    <input 
                      type="email" 
                      value={editingItem.correo_corp || ''} 
                      onChange={(e) => setEditingItem({ ...editingItem, correo_corp: e.target.value })}
                      style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px', boxSizing: 'border-box' }}
                    />
                  </div>
                </>
              )}

              {tab === 'perfiles' && (
                <>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#64748b' }}>Tipo de Cuenta</label>
                    <select 
                      value={editingItem.tipo} 
                      onChange={(e) => setEditingItem({ ...editingItem, tipo: e.target.value })}
                      style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px', boxSizing: 'border-box' }}
                    >
                      <option value="ONPREMISE">On-Premise</option>
                      <option value="O365">Office 365</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#64748b' }}>Correo</label>
                    <input 
                      type="email" 
                      value={editingItem.correo || ''} 
                      onChange={(e) => setEditingItem({ ...editingItem, correo: e.target.value })}
                      style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px', boxSizing: 'border-box' }}
                    />
                  </div>
                </>
              )}

              <button type="submit" style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '0.7rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', marginTop: '1rem' }}>
                <Save size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} /> Guardar Cambios
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}