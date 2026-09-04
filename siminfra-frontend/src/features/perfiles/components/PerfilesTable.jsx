import {
  Edit,
  Trash2,
  Eye,
  EyeOff
} from 'lucide-react';

export default function PerfilesTable({
  perfiles,
  visiblePasswords,
  setVisiblePasswords,
  renderAccountTypeBadge,
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
            Nombre / Perfil
          </th>

          <th style={{ padding: '1rem 1.2rem' }}>
            Usuario
          </th>

          <th style={{ padding: '1rem 1.2rem' }}>
            Contraseña
          </th>

          <th style={{ padding: '1rem 1.2rem' }}>
            Tipo Cuenta
          </th>

          <th style={{ padding: '1rem 1.2rem' }}>
            Correo Asignado
          </th>

          <th style={{ padding: '1rem 1.2rem' }}>
            Área
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
        {perfiles.map((perfil) => (
          <tr
            key={perfil.id}
            style={{
              borderBottom: '1px solid #f1f5f9',
              color: '#334155'
            }}
          >
            <td
              style={{
                padding: '1rem 1.2rem',
                fontWeight: '600'
              }}
            >
              {perfil.nombre || 'N/I'}
            </td>

            <td
              style={{
                padding: '1rem 1.2rem',
                fontWeight: 'bold'
              }}
            >
              {perfil.usuario || 'N/I'}
            </td>

            <td
              style={{
                padding: '1rem 1.2rem',
                fontFamily: 'monospace'
              }}
            >
              {perfil.password ? (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <span
                    style={{
                      fontWeight: 'bold'
                    }}
                  >
                    {visiblePasswords[perfil.id]
                      ? perfil.password
                      : '••••••••'}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      setVisiblePasswords((prev) => ({
                        ...prev,
                        [perfil.id]: !prev[perfil.id]
                      }))
                    }
                    style={{
                      border: 'none',
                      background: 'none',
                      cursor: 'pointer',
                      color: '#64748b',
                      padding: 0,
                      display: 'flex',
                      alignItems: 'center'
                    }}
                    title={
                      visiblePasswords[perfil.id]
                        ? 'Ocultar contraseña'
                        : 'Mostrar contraseña'
                    }
                  >
                    {visiblePasswords[perfil.id] ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
              ) : (
                <span
                  style={{
                    color: '#94a3b8',
                    fontFamily: 'system-ui, sans-serif',
                    fontStyle: 'italic'
                  }}
                >
                  Sin contraseña
                </span>
              )}
            </td>

            <td style={{ padding: '1rem 1.2rem' }}>
              {renderAccountTypeBadge(perfil.tipo)}
            </td>

            <td style={{ padding: '1rem 1.2rem' }}>
              {perfil.correo || 'N/I'}
            </td>

            <td style={{ padding: '1rem 1.2rem' }}>
              {perfil.dpto_area || 'N/I'}
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
                  onClick={() => onEdit(perfil)}
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
                      perfil.id,
                      perfil.usuario
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