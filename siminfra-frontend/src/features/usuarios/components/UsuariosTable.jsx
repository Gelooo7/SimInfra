import {
  Edit,
  Trash2,
  History
} from 'lucide-react';

export default function UsuariosTable({
  usuarios,
  onSelectUser,
  onShowHistory,
  onEdit,
  onDelete,
  renderStatusBadge,
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
            Estado
          </th>

          <th style={{ padding: '1rem 1.2rem' }}>
            Usuario Red
          </th>

          <th style={{ padding: '1rem 1.2rem' }}>
            Hostname
          </th>

          <th style={{ padding: '1rem 1.2rem' }}>
            Correo Corp.
          </th>

          <th style={{ padding: '1rem 1.2rem' }}>
            Celular
          </th>

          <th style={{ padding: '1rem 1.2rem' }}>
            Teléfono / Anexo
          </th>

          <th style={{ padding: '1rem 1.2rem' }}>
            IP Asignada
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
        {usuarios.map((usuario) => (
          <tr
            key={usuario.id}
            onClick={() => onSelectUser(usuario)}
            style={{
              borderBottom: '1px solid #f1f5f9',
              color: '#334155',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f1f5f9';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <td
              style={{
                padding: '1rem 1.2rem',
                fontWeight: '600',
                color: '#2563eb'
              }}
            >
              {usuario.nombre_completo || 'N/I'}
            </td>

            <td style={{ padding: '1rem 1.2rem' }}>
              {usuario.dpto_area || 'N/I'}
            </td>

            <td
              style={{
                padding: '1rem 1.2rem',
                fontSize: '0.85rem',
                color: '#64748b'
              }}
            >
              {usuario.cargo || 'N/I'}
            </td>

            <td style={{ padding: '1rem 1.2rem' }}>
              {renderStatusBadge(usuario.estado)}
            </td>

            <td style={{ padding: '1rem 1.2rem' }}>
              {usuario.usuario_red || 'N/I'}
            </td>

            <td
              style={{
                padding: '1rem 1.2rem',
                fontFamily: 'monospace',
                fontWeight: 'bold'
              }}
            >
              {usuario.hostname || 'N/I'}
            </td>

            <td style={{ padding: '1rem 1.2rem' }}>
              {usuario.correo_corp || 'N/I'}
            </td>

            <td
              style={{
                padding: '1rem 1.2rem',
                fontSize: '0.85rem',
                fontWeight: '500'
              }}
            >
              {usuario.celular || 'N/I'}
            </td>

            <td
              style={{
                padding: '1rem 1.2rem',
                fontSize: '0.85rem'
              }}
            >
              {usuario.telefono || usuario.anexo
                ? `${usuario.telefono || ''} ${
                    usuario.anexo
                      ? `(Anx: ${usuario.anexo})`
                      : ''
                  }`
                : 'N/I'}
            </td>

            <td
              style={{
                padding: '1rem 1.2rem',
                color: usuario.ip_actual
                  ? '#16a34a'
                  : '#94a3b8',
                fontWeight: 'bold'
              }}
            >
              {usuario.ip_actual || 'Sin asignar'}
            </td>

            <td
              style={{
                padding: '1rem 1.2rem',
                textAlign: 'center'
              }}
              onClick={(e) => e.stopPropagation()}
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
                  onClick={() => onShowHistory(usuario)}
                  style={{
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    color: '#d97706'
                  }}
                  title="Ver Historial de Modificaciones"
                >
                  <History size={18} />
                </button>

                <button
                  type="button"
                  onClick={() => onEdit(usuario)}
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
                      usuario.id,
                      usuario.nombre_completo
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