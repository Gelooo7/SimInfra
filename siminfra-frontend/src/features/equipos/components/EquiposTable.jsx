import {
  Edit,
  Trash2,
  History
} from 'lucide-react';

export default function EquiposTable({
  equipos,
  formatEquipmentType,
  onShowHistory,
  onEdit,
  onDelete,
}) {
  return (
    <table
      style={{
        width: '100%',
        borderCollapse: 'collapse',
        textAlign: 'left',
        fontSize: '0.95rem'
      }}
    >
      <thead>
        <tr
          style={{
            backgroundColor: '#f1f5f9',
            borderBottom: '2px solid #e2e8f0',
            color: '#475569'
          }}
        >
          <th style={{ padding: '1rem 1.2rem' }}>
            Tipo
          </th>

          <th style={{ padding: '1rem 1.2rem' }}>
            Marca / Modelo
          </th>

          <th style={{ padding: '1rem 1.2rem' }}>
            N° Serie
          </th>

          <th style={{ padding: '1rem 1.2rem' }}>
            Activo Fijo (AF)
          </th>

          <th style={{ padding: '1rem 1.2rem' }}>
            Hostname
          </th>

          <th style={{ padding: '1rem 1.2rem' }}>
            Asignado a
          </th>

          <th style={{ padding: '1rem 1.2rem' }}>
            Fecha Asignación
          </th>

          <th style={{ padding: '1rem 1.2rem' }}>
            Estado
          </th>

          <th
            style={{
              padding: '1rem 1.2rem',
              textAlign: 'center'
            }}
          >
            Acciones
          </th>
        </tr>
      </thead>

      <tbody>
        {equipos.map((equipo) => (
          <tr
            key={equipo.id}
            style={{
              borderBottom: '1px solid #f1f5f9',
              color: '#334155'
            }}
          >
            <td
              style={{
                padding: '1rem 1.2rem',
                fontWeight: 'bold'
              }}
            >
              {formatEquipmentType(equipo.tipo)}
            </td>

            <td style={{ padding: '1rem 1.2rem' }}>
              {equipo.marca || ''} {equipo.modelo || ''}
            </td>

            <td
              style={{
                padding: '1rem 1.2rem',
                fontFamily: 'monospace'
              }}
            >
              {equipo.numero_serie || 'N/I'}
            </td>

            <td
              style={{
                padding: '1rem 1.2rem',
                fontFamily: 'monospace',
                fontWeight: 'bold'
              }}
            >
              {equipo.af || 'N/I'}
            </td>

            <td
              style={{
                padding: '1rem 1.2rem',
                fontFamily: 'monospace',
                fontWeight: 'bold',
                color: '#0284c7'
              }}
            >
              {equipo.hostname || 'N/I'}
            </td>

            <td
              style={{
                padding: '1rem 1.2rem',
                fontWeight: 'bold',
                color: equipo.usuario_nombre
                  ? '#2563eb'
                  : '#94a3b8'
              }}
            >
              {equipo.usuario_nombre || 'Disponible (Stock)'}
            </td>

            <td
              style={{
                padding: '1rem 1.2rem',
                fontSize: '0.85rem'
              }}
            >
              {equipo.fecha_asignacion || 'N/A'}
            </td>

            <td style={{ padding: '1rem 1.2rem' }}>
              {equipo.estado || 'ASIGNADO'}
            </td>

            <td
              style={{
                padding: '1rem 1.2rem',
                textAlign: 'center'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '0.6rem'
                }}
              >
                <button
                  type="button"
                  onClick={() => onShowHistory(equipo)}
                  style={{
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    color: '#d97706'
                  }}
                  title="Ver Historial Auditoría"
                >
                  <History size={18} />
                </button>

                <button
                  type="button"
                  onClick={() => onEdit(equipo)}
                  style={{
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    color: '#2563eb'
                  }}
                  title="Editar"
                >
                  <Edit size={18} />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    onDelete(
                      equipo.id,
                      `${equipo.marca || ''} ${equipo.modelo || ''}`
                    )
                  }
                  style={{
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    color: '#ef4444'
                  }}
                  title="Eliminar"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}