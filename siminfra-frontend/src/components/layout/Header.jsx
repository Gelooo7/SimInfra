import {
  Menu,
  LogOut
} from 'lucide-react';

export default function Header({
  activeTab,
  onOpenSidebar,
  onLogout,
}) {
  const getTitle = () => {
    if (activeTab === 'usuarios') {
      return 'Usuarios';
    }

    if (activeTab === 'equipos') {
      return 'Equipos';
    }

    if (activeTab === 'perfiles') {
      return 'Perfiles Genéricos';
    }

    return 'Gestión de IPs';
  };

  return (
    <header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem',
        width: '100%'
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}
      >
        <button
          type="button"
          onClick={onOpenSidebar}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.65rem 1rem',
            borderRadius: '8px',
            border: '1px solid #cbd5e1',
            backgroundColor: '#fff',
            cursor: 'pointer',
            color: '#1e293b',
            fontWeight: 'bold',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}
          title="Abrir Menú de Módulos"
        >
          <Menu
            size={20}
            color="#2563eb"
          />

          <span>
            Módulos
          </span>
        </button>

        <div>
          <h1
            style={{
              fontSize: '1.8rem',
              color: '#0f172a',
              margin: 0,
              fontWeight: '800'
            }}
          >
            SimInfra — {getTitle()}
          </h1>

          <p
            style={{
              color: '#64748b',
              marginTop: '0.1rem',
              fontSize: '0.9rem'
            }}
          >
            Panel Administrador de Infraestructura y Redes
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onLogout}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.6rem 1.2rem',
          borderRadius: '8px',
          border: '1px solid #cbd5e1',
          backgroundColor: '#fff',
          cursor: 'pointer',
          color: '#ef4444',
          fontWeight: 'bold'
        }}
      >
        <LogOut size={16} />

        Cerrar Sesión
      </button>
    </header>
  );
}