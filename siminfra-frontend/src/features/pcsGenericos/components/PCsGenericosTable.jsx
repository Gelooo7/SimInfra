import { useState } from 'react';

import {
  Edit,
  Trash2,
  History,
  Eye,
  EyeOff,
  Copy,
  Check
} from 'lucide-react';

export default function PCsGenericosTable({
  pcs,
  onShowHistory,
  onEdit,
  onDelete,
}) {
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [copiedPasswords, setCopiedPasswords] = useState({});

  const togglePassword = (id) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const copyPassword = async (pc) => {
    if (!pc.password) {
      return;
    }

    try {
      await navigator.clipboard.writeText(pc.password);

      setCopiedPasswords((prev) => ({
        ...prev,
        [pc.id]: true
      }));

      setTimeout(() => {
        setCopiedPasswords((prev) => ({
          ...prev,
          [pc.id]: false
        }));
      }, 2000);
    } catch (error) {
      console.error(
        'Error copiando contraseña:',
        error
      );
    }
  };

  const cellStyle = {
    padding: '1rem 1.2rem',
    whiteSpace: 'nowrap'
  };

  return (
    <table
      style={{
        width: '100%',
        borderCollapse: 'collapse',
        textAlign: 'left',
        fontSize: '0.9rem'
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
          <th style={cellStyle}>
            Usuario Local
          </th>

          <th style={cellStyle}>
            Contraseña
          </th>

          <th style={cellStyle}>
            Hostname
          </th>

          <th style={cellStyle}>
            Departamento / Área
          </th>

          <th style={cellStyle}>
            Marca
          </th>

          <th style={cellStyle}>
            Modelo
          </th>

          <th style={cellStyle}>
            N.º de Serie
          </th>

          <th style={cellStyle}>
            Activo Fijo
          </th>

          <th style={cellStyle}>
            RAM
          </th>

          <th style={cellStyle}>
            Almacenamiento
          </th>

          <th style={cellStyle}>
            Observaciones
          </th>

          <th
            style={{
              ...cellStyle,
              textAlign: 'center'
            }}
          >
            Acciones
          </th>
        </tr>
      </thead>

      <tbody>
        {pcs.map((pc) => {
          const passwordVisible =
            !!visiblePasswords[pc.id];

          const passwordCopied =
            !!copiedPasswords[pc.id];

          return (
            <tr
              key={pc.id}
              style={{
                borderBottom: '1px solid #f1f5f9',
                color: '#334155'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  '#f8fafc';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor =
                  'transparent';
              }}
            >
              {/* USUARIO LOCAL */}
              <td
                style={{
                  ...cellStyle,
                  fontWeight: '600',
                  color: '#2563eb'
                }}
              >
                {pc.usuario_local || 'N/I'}
              </td>

              {/* CONTRASEÑA */}
              <td style={cellStyle}>
                {pc.password ? (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem'
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'monospace',
                        fontWeight: 'bold',
                        backgroundColor: '#f1f5f9',
                        padding: '0.2rem 0.45rem',
                        borderRadius: '4px'
                      }}
                    >
                      {passwordVisible
                        ? pc.password
                        : '••••••••'}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        togglePassword(pc.id)
                      }
                      title={
                        passwordVisible
                          ? 'Ocultar contraseña'
                          : 'Mostrar contraseña'
                      }
                      style={{
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        color: '#64748b',
                        padding: '2px',
                        display: 'flex'
                      }}
                    >
                      {passwordVisible ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        copyPassword(pc)
                      }
                      title="Copiar contraseña"
                      style={{
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        color: passwordCopied
                          ? '#16a34a'
                          : '#64748b',
                        padding: '2px',
                        display: 'flex'
                      }}
                    >
                      {passwordCopied ? (
                        <Check size={16} />
                      ) : (
                        <Copy size={16} />
                      )}
                    </button>
                  </div>
                ) : (
                  <span
                    style={{
                      color: '#94a3b8'
                    }}
                  >
                    Sin contraseña
                  </span>
                )}
              </td>

              {/* HOSTNAME */}
              <td
                style={{
                  ...cellStyle,
                  fontFamily: 'monospace',
                  fontWeight: 'bold',
                  color: '#0284c7'
                }}
              >
                {pc.hostname || 'N/I'}
              </td>

              {/* DEPARTAMENTO */}
              <td style={cellStyle}>
                {pc.dpto_area || 'N/I'}
              </td>

              {/* MARCA */}
              <td style={cellStyle}>
                {pc.marca || 'N/I'}
              </td>

              {/* MODELO */}
              <td style={cellStyle}>
                {pc.modelo || 'N/I'}
              </td>

              {/* SERIE */}
              <td
                style={{
                  ...cellStyle,
                  fontFamily: 'monospace'
                }}
              >
                {pc.numero_serie || 'N/I'}
              </td>

              {/* ACTIVO FIJO */}
              <td
                style={{
                  ...cellStyle,
                  fontWeight: '600'
                }}
              >
                {pc.activo_fijo || 'N/I'}
              </td>

              {/* RAM */}
              <td style={cellStyle}>
                {pc.ram || 'N/I'}
              </td>

              {/* ALMACENAMIENTO */}
              <td style={cellStyle}>
                {pc.almacenamiento || 'N/I'}
              </td>

              {/* OBSERVACIONES */}
              <td
                style={{
                  ...cellStyle,
                  whiteSpace: 'normal',
                  minWidth: '180px',
                  color: '#64748b'
                }}
              >
                {pc.observaciones || 'Sin observaciones'}
              </td>

              {/* ACCIONES */}
              <td
                style={{
                  ...cellStyle,
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
                    onClick={() =>
                      onShowHistory(pc)
                    }
                    style={{
                      border: 'none',
                      background: 'none',
                      cursor: 'pointer',
                      color: '#d97706'
                    }}
                    title="Ver Historial"
                  >
                    <History size={18} />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      onEdit(pc)
                    }
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
                        pc.id,
                        pc.hostname
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
          );
        })}
      </tbody>
    </table>
  );
}