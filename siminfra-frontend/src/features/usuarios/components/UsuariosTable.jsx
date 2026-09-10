import {
  Edit,
  Trash2,
  History
} from 'lucide-react';

import './UsuariosTable.css';

export default function UsuariosTable({
  usuarios,
  onSelectUser,
  onShowHistory,
  onEdit,
  onDelete,
  renderStatusBadge,
}) {
  const Actions = ({ usuario }) => (
    <div className="usuarios-actions">
      <button
        type="button"
        className="usuario-action usuario-action-history"
        onClick={(e) => {
          e.stopPropagation();
          onShowHistory(usuario);
        }}
        title="Ver Historial de Modificaciones"
        aria-label="Ver historial"
      >
        <History size={18} />
      </button>

      <button
        type="button"
        className="usuario-action usuario-action-edit"
        onClick={(e) => {
          e.stopPropagation();
          onEdit(usuario);
        }}
        title="Editar"
        aria-label="Editar usuario"
      >
        <Edit size={18} />
      </button>

      <button
        type="button"
        className="usuario-action usuario-action-delete"
        onClick={(e) => {
          e.stopPropagation();

          onDelete(
            usuario.id,
            usuario.nombre_completo
          );
        }}
        title="Eliminar"
        aria-label="Eliminar usuario"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );

  return (
    <>
      {/* =========================
          TABLA DESKTOP
      ========================= */}
      <div className="usuarios-table-desktop">
        <table className="usuarios-table">
          <thead>
            <tr>
              <th>Nombre Completo</th>
              <th>Departamento / Área</th>
              <th>Cargo</th>
              <th>Estado</th>
              <th>Usuario Red</th>
              <th>Hostname</th>
              <th>Correo Corp.</th>
              <th>Celular</th>
              <th>Anexo</th>
              <th>Exterior</th>
              <th>IP Asignada</th>
              <th className="usuarios-actions-header">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody>
            {usuarios.map((usuario) => (
              <tr
                key={usuario.id}
                onClick={() =>
                  onSelectUser(usuario)
                }
              >
                <td className="usuario-name">
                  {usuario.nombre_completo || 'N/I'}
                </td>

                <td>
                  {usuario.dpto_area || 'N/I'}
                </td>

                <td className="usuario-secondary">
                  {usuario.cargo || 'N/I'}
                </td>

                <td>
                  {renderStatusBadge(
                    usuario.estado
                  )}
                </td>

                <td>
                  {usuario.usuario_red || 'N/I'}
                </td>

                <td className="usuario-hostname">
                  {usuario.hostname || 'N/I'}
                </td>

                <td>
                  {usuario.correo_corp || 'N/I'}
                </td>

                <td>
                  {usuario.celular || 'N/I'}
                </td>

                <td
                  className={
                    usuario.anexo_actual
                      ? 'usuario-assigned'
                      : 'usuario-unassigned'
                  }
                >
                  {usuario.anexo_actual
                    ?.numero_anexo ||
                    'Sin asignar'}
                </td>

                <td
                  className={
                    usuario.anexo_actual?.exterior
                      ? ''
                      : 'usuario-unassigned'
                  }
                >
                  {usuario.anexo_actual
                    ?.exterior || 'N/I'}
                </td>

                <td
                  className={
                    usuario.ip_actual
                      ? 'usuario-ip-assigned'
                      : 'usuario-unassigned'
                  }
                >
                  {usuario.ip_actual ||
                    'Sin asignar'}
                </td>

                <td className="usuarios-actions-cell">
                  <Actions usuario={usuario} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* =========================
          TARJETAS MÓVIL
      ========================= */}
      <div className="usuarios-cards-mobile">
        {usuarios.map((usuario) => (
          <article
            key={usuario.id}
            className="usuario-card"
            onClick={() =>
              onSelectUser(usuario)
            }
          >
            <div className="usuario-card-header">
              <div className="usuario-card-title">
                <span className="usuario-card-avatar">
                  👤
                </span>

                <div>
                  <h3>
                    {usuario.nombre_completo ||
                      'Sin nombre'}
                  </h3>

                  <span className="usuario-card-subtitle">
                    {usuario.cargo ||
                      'Cargo no informado'}
                  </span>
                </div>
              </div>

              <div className="usuario-card-status">
                {renderStatusBadge(
                  usuario.estado
                )}
              </div>
            </div>

            <div className="usuario-card-grid">
              <MobileField
                label="Departamento / Área"
                value={
                  usuario.dpto_area || 'N/I'
                }
              />

              <MobileField
                label="Usuario Red"
                value={
                  usuario.usuario_red || 'N/I'
                }
              />

              <MobileField
                label="Hostname"
                value={
                  usuario.hostname || 'N/I'
                }
                monospace
              />

              <MobileField
                label="Correo"
                value={
                  usuario.correo_corp || 'N/I'
                }
                full
              />

              <MobileField
                label="Celular"
                value={
                  usuario.celular || 'N/I'
                }
              />

              <MobileField
                label="Anexo"
                value={
                  usuario.anexo_actual
                    ?.numero_anexo ||
                  'Sin asignar'
                }
              />

              <MobileField
                label="Exterior"
                value={
                  usuario.anexo_actual
                    ?.exterior || 'N/I'
                }
              />

              <MobileField
                label="IP Asignada"
                value={
                  usuario.ip_actual ||
                  'Sin asignar'
                }
                monospace
              />
            </div>

            <div
              className="usuario-card-footer"
              onClick={(e) =>
                e.stopPropagation()
              }
            >
              <span className="usuario-card-hint">
                Toca la tarjeta para ver detalle
              </span>

              <Actions usuario={usuario} />
            </div>
          </article>
        ))}
      </div>

      {usuarios.length === 0 && (
        <div className="usuarios-empty">
          No existen usuarios para mostrar.
        </div>
      )}
    </>
  );
}

function MobileField({
  label,
  value,
  monospace = false,
  full = false,
}) {
  return (
    <div
      className={`usuario-mobile-field ${
        full
          ? 'usuario-mobile-field-full'
          : ''
      }`}
    >
      <span className="usuario-mobile-label">
        {label}
      </span>

      <span
        className={`usuario-mobile-value ${
          monospace
            ? 'usuario-mobile-monospace'
            : ''
        }`}
      >
        {value}
      </span>
    </div>
  );
}