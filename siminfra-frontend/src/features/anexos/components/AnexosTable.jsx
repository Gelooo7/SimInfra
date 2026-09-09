import {
  Edit,
  Trash2,
  History
} from 'lucide-react';

export default function AnexosTable({
  anexos,
  renderAnexoStatusBadge,
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
            Nombre Completo
          </th>

          <th style={{ padding: '1rem 1.2rem' }}>
            Departamento / Área
          </th>

          <th style={{ padding: '1rem 1.2rem' }}>
            Cargo
          </th>

          <th style={{ padding: '1rem 1.2rem' }}>
            Anexo
          </th>

          <th style={{ padding: '1rem 1.2rem' }}>
            Exterior
          </th>

          <th style={{ padding: '1rem 1.2rem' }}>
            Correo
          </th>

          <th style={{ padding: '1rem 1.2rem' }}>
            Estado
          </th>

          <th style={{ padding: '1rem 1.2rem' }}>
            Observaciones
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
        {anexos.map((anexo) => (
          <tr
            key={anexo.id}
            style={{
              borderBottom: '1px solid #f1f5f9',
              color: '#334155'
            }}
          >
            {/* Nombre */}
            <td
              style={{
                padding: '1rem 1.2rem',
                fontWeight: 'bold'
              }}
            >
              {anexo.usuario_nombre || 'Sin asignar'}
            </td>

            {/* Departamento */}
            <td style={{ padding: '1rem 1.2rem' }}>
              {anexo.departamento || '—'}
            </td>

            {/* Cargo */}
            <td style={{ padding: '1rem 1.2rem' }}>
              {anexo.cargo || '—'}
            </td>

            {/* Anexo */}
            <td
              style={{
                padding: '1rem 1.2rem',
                fontFamily: 'monospace',
                fontWeight: 'bold',
                color: '#0284c7'
              }}
            >
              {anexo.numero_anexo}
            </td>

            {/* Exterior */}
            <td
              style={{
                padding: '1rem 1.2rem',
                fontFamily: 'monospace'
              }}
            >
              {anexo.exterior || '—'}
            </td>

            {/* Correo */}
            <td style={{ padding: '1rem 1.2rem' }}>
              {anexo.correo || '—'}
            </td>

            {/* Estado */}
            <td style={{ padding: '1rem 1.2rem' }}>
              {renderAnexoStatusBadge(
                anexo.estado
              )}
            </td>

            {/* Observaciones */}
            <td
              style={{
                padding: '1rem 1.2rem',
                fontSize: '0.85rem'
              }}
            >
              {anexo.observaciones ||
                'Sin observaciones'}
            </td>

            {/* Acciones */}
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
                  gap: '0.75rem'
                }}
              >
                <button
                  type="button"
                  onClick={() =>
                    onShowHistory(anexo)
                  }
                  style={{
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    color: '#64748b'
                  }}
                  title="Ver historial"
                >
                  <History size={18} />
                </button>

                <button
                  type="button"
                  onClick={() => onEdit(anexo)}
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
                      anexo.id,
                      anexo.numero_anexo
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