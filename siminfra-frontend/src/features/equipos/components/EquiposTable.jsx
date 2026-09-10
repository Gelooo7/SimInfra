import {
  Edit,
  Trash2,
  History
} from 'lucide-react';

import './EquiposTable.css';

export default function EquiposTable({
  equipos,
  formatEquipmentType,
  onShowHistory,
  onEdit,
  onDelete,
}) {
  const Actions = ({ equipo }) => (
    <div className="equipos-actions">
      <button
        type="button"
        className="equipo-action equipo-action-history"
        onClick={() => onShowHistory(equipo)}
        title="Ver Historial Auditoría"
        aria-label="Ver historial"
      >
        <History size={18} />
      </button>

      <button
        type="button"
        className="equipo-action equipo-action-edit"
        onClick={() => onEdit(equipo)}
        title="Editar"
        aria-label="Editar equipo"
      >
        <Edit size={18} />
      </button>

      <button
        type="button"
        className="equipo-action equipo-action-delete"
        onClick={() =>
          onDelete(
            equipo.id,
            `${equipo.marca || ''} ${equipo.modelo || ''}`
          )
        }
        title="Eliminar"
        aria-label="Eliminar equipo"
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
      <div className="equipos-table-desktop">
        <table className="equipos-table">
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Marca / Modelo</th>
              <th>N° Serie</th>
              <th>Activo Fijo (AF)</th>
              <th>Hostname</th>
              <th>Asignado a</th>
              <th>Fecha Asignación</th>
              <th>Estado</th>
              <th className="equipos-actions-header">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody>
            {equipos.map((equipo) => (
              <tr key={equipo.id}>
                <td className="equipo-type">
                  {formatEquipmentType(equipo.tipo)}
                </td>

                <td>
                  {`${equipo.marca || ''} ${equipo.modelo || ''}`.trim() ||
                    'N/I'}
                </td>

                <td className="equipo-monospace">
                  {equipo.numero_serie || 'N/I'}
                </td>

                <td className="equipo-af">
                  {equipo.af || 'N/I'}
                </td>

                <td className="equipo-hostname">
                  {equipo.hostname || 'N/I'}
                </td>

                <td
                  className={
                    equipo.usuario_nombre
                      ? 'equipo-assigned'
                      : 'equipo-unassigned'
                  }
                >
                  {equipo.usuario_nombre ||
                    'Disponible (Stock)'}
                </td>

                <td className="equipo-date">
                  {equipo.fecha_asignacion || 'N/A'}
                </td>

                <td>
                  {equipo.estado || 'ASIGNADO'}
                </td>

                <td className="equipos-actions-cell">
                  <Actions equipo={equipo} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* =========================
          TARJETAS MÓVIL
      ========================= */}
      <div className="equipos-cards-mobile">
        {equipos.map((equipo) => (
          <article
            key={equipo.id}
            className="equipo-card"
          >
            <div className="equipo-card-header">
              <div className="equipo-card-title">
                <span className="equipo-card-icon">
                  📦
                </span>

                <div>
                  <h3>
                    {`${equipo.marca || ''} ${equipo.modelo || ''}`.trim() ||
                      'Equipo sin marca/modelo'}
                  </h3>

                  <span className="equipo-card-type">
                    {formatEquipmentType(
                      equipo.tipo
                    )}
                  </span>
                </div>
              </div>

              <span
                className={`equipo-card-status ${
                  equipo.usuario_nombre
                    ? 'equipo-card-status-assigned'
                    : 'equipo-card-status-stock'
                }`}
              >
                {equipo.estado ||
                  (equipo.usuario_nombre
                    ? 'ASIGNADO'
                    : 'STOCK')}
              </span>
            </div>

            <div className="equipo-card-grid">
              <MobileField
                label="N° Serie"
                value={
                  equipo.numero_serie || 'N/I'
                }
                monospace
              />

              <MobileField
                label="Activo Fijo"
                value={equipo.af || 'N/I'}
                monospace
              />

              <MobileField
                label="Hostname"
                value={
                  equipo.hostname || 'N/I'
                }
                monospace
              />

              <MobileField
                label="Asignado a"
                value={
                  equipo.usuario_nombre ||
                  'Disponible (Stock)'
                }
                full
              />

              <MobileField
                label="Fecha Asignación"
                value={
                  equipo.fecha_asignacion ||
                  'N/A'
                }
              />

              <MobileField
                label="Estado"
                value={
                  equipo.estado || 'ASIGNADO'
                }
              />
            </div>

            <div className="equipo-card-footer">
              <span className="equipo-card-info">
                Gestión de equipo
              </span>

              <Actions equipo={equipo} />
            </div>
          </article>
        ))}
      </div>

      {equipos.length === 0 && (
        <div className="equipos-empty">
          No existen equipos para mostrar.
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
      className={`equipo-mobile-field ${
        full
          ? 'equipo-mobile-field-full'
          : ''
      }`}
    >
      <span className="equipo-mobile-label">
        {label}
      </span>

      <span
        className={`equipo-mobile-value ${
          monospace
            ? 'equipo-mobile-monospace'
            : ''
        }`}
      >
        {value}
      </span>
    </div>
  );
}