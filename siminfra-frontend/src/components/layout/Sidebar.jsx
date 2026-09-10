import {
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

import './Sidebar.css';

const modules = [
  {
    id: 'usuarios',
    icon: '👤',
    label: 'Usuarios',
  },
  {
    id: 'equipos',
    icon: '📦',
    label: 'Equipos',
  },
  {
    id: 'pcs-genericos',
    icon: '🖥️',
    label: 'PCs Genéricos',
  },
  {
    id: 'perfiles',
    icon: '📧',
    label: 'Perfiles Genéricos',
  },
  {
    id: 'ips',
    icon: '🌐',
    label: 'Gestión de IPs',
  },
  {
    id: 'anexos',
    icon: '☎️',
    label: 'Anexos',
  },
];

export default function Sidebar({
  isOpen,
  collapsed,
  activeTab,
  activeCount,
  onClose,
  onToggleCollapse,
  onSelectTab,
}) {
  return (
    <>
      {/* Overlay móvil */}
      <div
        className={`sidebar-overlay ${isOpen ? 'sidebar-overlay-open' : ''
          }`}
        onClick={onClose}
      />

      <aside
        className={[
          'sidebar',
          collapsed ? 'sidebar-collapsed' : '',
          isOpen ? 'sidebar-mobile-open' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {/* CABECERA */}
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="sidebar-logo">
              <img
                src="/branding/dr-simi-logo.png"
                alt="Farmacias Dr. Simi"
              />
            </div>

            {!collapsed && (
              <div className="sidebar-brand-text">
                <h2>TI Chile</h2>
                <span>Infraestructura</span>
              </div>
            )}
          </div>

          {/* Contraer escritorio */}
          <button
            type="button"
            className="sidebar-collapse-button"
            onClick={onToggleCollapse}
            title={
              collapsed
                ? 'Expandir menú'
                : 'Contraer menú'
            }
          >
            {collapsed ? (
              <ChevronRight size={18} />
            ) : (
              <ChevronLeft size={18} />
            )}
          </button>

          {/* Cerrar móvil */}
          <button
            type="button"
            className="sidebar-mobile-close"
            onClick={onClose}
            title="Cerrar menú"
          >
            <X size={20} />
          </button>
        </div>

        {/* NAVEGACIÓN */}
        <nav className="sidebar-nav">
          {modules.map((module) => {
            const active =
              activeTab === module.id;

            return (
              <button
                key={module.id}
                type="button"
                className={`sidebar-module-button ${active
                  ? 'sidebar-module-active'
                  : ''
                  }`}
                onClick={() =>
                  onSelectTab(module.id)
                }
                title={
                  collapsed
                    ? module.label
                    : undefined
                }
              >
                <span className="sidebar-module-icon">
                  {module.icon}
                </span>

                <span className="sidebar-module-content">
                  <span className="sidebar-module-label">
                    {module.label}
                  </span>

                  {active &&
                    activeCount !== undefined && (
                      <span className="sidebar-module-count">
                        {activeCount}
                      </span>
                    )}
                </span>
              </button>
            );
          })}
        </nav>

        {/* FOOTER */}
        <div className="sidebar-footer">
          {collapsed ? (
            <span
              className="sidebar-footer-mini"
              title="Farmacias Dr. Simi"
            >
              TI
            </span>
          ) : (
            <>
              <strong>
                Farmacias Dr. Simi
              </strong>

              <span>
                Infraestructura TI
              </span>
            </>
          )}
        </div>
      </aside>
    </>
  );
}