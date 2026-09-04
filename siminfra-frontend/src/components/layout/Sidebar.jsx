import {
  X,
  User,
  Monitor,
  Key,
  Network
} from 'lucide-react';

export default function Sidebar({
  isOpen,
  activeTab,
  activeCount,
  onClose,
  onSelectTab,
}) {
  return (
    <>
      {/* Fondo oscuro */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.4)',
            zIndex: 1100,
            backdropFilter: 'blur(2px)',
            transition: 'opacity 0.3s'
          }}
        />
      )}

      {/* Panel lateral */}
      <aside
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '280px',
          height: '100vh',
          backgroundColor: '#0f172a',
          color: '#fff',
          zIndex: 1200,
          padding: '1.5rem',
          boxSizing: 'border-box',
          transform: isOpen
            ? 'translateX(0)'
            : 'translateX(-100%)',
          transition:
            'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '4px 0 25px rgba(0,0,0,0.3)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}
      >
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '2rem'
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: '1.25rem',
                  color: '#fff',
                  fontWeight: 'bold'
                }}
              >
                SimInfra
              </h2>

              <p
                style={{
                  margin: 0,
                  fontSize: '0.75rem',
                  color: '#94a3b8'
                }}
              >
                Módulos del Sistema
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              style={{
                border: 'none',
                background: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                padding: '4px'
              }}
            >
              <X size={20} />
            </button>
          </div>

          <nav
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem'
            }}
          >
            <SidebarButton
              active={activeTab === 'usuarios'}
              icon={<User size={18} />}
              label="Usuarios"
              count={
                activeTab === 'usuarios'
                  ? activeCount
                  : ''
              }
              onClick={() =>
                onSelectTab('usuarios')
              }
            />

            <SidebarButton
              active={activeTab === 'equipos'}
              icon={<Monitor size={18} />}
              label="Equipos"
              count={
                activeTab === 'equipos'
                  ? activeCount
                  : ''
              }
              onClick={() =>
                onSelectTab('equipos')
              }
            />

            <SidebarButton
              active={activeTab === 'perfiles'}
              icon={<Key size={18} />}
              label="Perfiles Genéricos"
              count={
                activeTab === 'perfiles'
                  ? activeCount
                  : ''
              }
              onClick={() =>
                onSelectTab('perfiles')
              }
            />

            <SidebarButton
              active={activeTab === 'ips'}
              icon={<Network size={18} />}
              label="Gestión de IPs"
              count={
                activeTab === 'ips'
                  ? activeCount
                  : ''
              }
              onClick={() =>
                onSelectTab('ips')
              }
            />
          </nav>
        </div>

        <div
          style={{
            borderTop: '1px solid #334155',
            paddingTop: '1rem'
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: '0.75rem',
              color: '#64748b',
              textAlign: 'center'
            }}
          >
            SimInfra v2.0 — 2026
          </p>
        </div>
      </aside>
    </>
  );
}

function SidebarButton({
  active,
  icon,
  label,
  count,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.75rem 1rem',
        borderRadius: '8px',
        border: 'none',
        cursor: 'pointer',
        fontWeight: '600',
        fontSize: '0.9rem',
        textAlign: 'left',
        backgroundColor: active
          ? '#2563eb'
          : 'transparent',
        color: active
          ? '#fff'
          : '#cbd5e1'
      }}
    >
      {icon}

      <span>
        {label}
        {count !== '' ? ` (${count})` : ''}
      </span>
    </button>
  );
}