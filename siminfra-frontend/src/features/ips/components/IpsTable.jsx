import {
  Edit,
  Trash2
} from 'lucide-react';

export default function IpsTable({
  ips,
  renderIpStatusBadge,
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
            Dirección IP
          </th>

          <th style={{ padding: '1rem 1.2rem' }}>
            Estado
          </th>

          <th style={{ padding: '1rem 1.2rem' }}>
            Asignado a
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
        {ips.map((ip) => (
          <tr
            key={ip.id}
            style={{
              borderBottom: '1px solid #f1f5f9',
              color: '#334155'
            }}
          >
            <td
              style={{
                padding: '1rem 1.2rem',
                fontFamily: 'monospace',
                fontWeight: 'bold',
                color: '#0284c7'
              }}
            >
              {ip.direccion_ip}
            </td>

            <td style={{ padding: '1rem 1.2rem' }}>
              {renderIpStatusBadge(ip.estado)}
            </td>

            <td
              style={{
                padding: '1rem 1.2rem',
                fontWeight: 'bold',
                color:
                  ip.usuario_nombre || ip.asignado_otro
                    ? '#2563eb'
                    : '#94a3b8'
              }}
            >
              {ip.usuario_nombre ||
                ip.asignado_otro ||
                'Sin asignar'}
            </td>

            <td
              style={{
                padding: '1rem 1.2rem',
                fontSize: '0.85rem'
              }}
            >
              {ip.observacion || 'Sin observaciones'}
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
                  gap: '0.75rem'
                }}
              >
                <button
                  type="button"
                  onClick={() => onEdit(ip)}
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
                      ip.id,
                      ip.direccion_ip
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