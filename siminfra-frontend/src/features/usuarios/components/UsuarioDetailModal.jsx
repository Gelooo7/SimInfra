import { useState } from 'react';

import {
  X,
  Eye,
  EyeOff,
  Copy,
  Check
} from 'lucide-react';

export default function UsuarioDetailModal({
  usuario,
  onClose,
  renderStatusBadge,
  formatEquipmentType,
}) {
  const [showPassGmail, setShowPassGmail] = useState(false);
  const [showPassSimi, setShowPassSimi] = useState(false);

  const [copiedGmail, setCopiedGmail] = useState(false);
  const [copiedSimi, setCopiedSimi] = useState(false);

  if (!usuario) {
    return null;
  }

  const copyToClipboard = async (text, type) => {
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);

      if (type === 'gmail') {
        setCopiedGmail(true);

        setTimeout(() => {
          setCopiedGmail(false);
        }, 2000);
      }

      if (type === 'simi') {
        setCopiedSimi(true);

        setTimeout(() => {
          setCopiedSimi(false);
        }, 2000);
      }

    } catch (error) {
      console.error(
        'Error copiando contraseña:',
        error
      );
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}
    >
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: '12px',
          width: '650px',
          maxWidth: '95%',
          overflow: 'hidden',
          boxShadow:
            '0 20px 25px -5px rgba(0, 0, 0, 0.2)'
        }}
      >
        {/* Encabezado */}
        <div
          style={{
            padding: '1.5rem',
            backgroundColor: '#0f172a',
            color: '#fff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start'
          }}
        >
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontSize: '1.3rem'
                }}
              >
                {usuario.nombre_completo}
              </h2>

              {renderStatusBadge(usuario.estado)}
            </div>

            <p
              style={{
                margin: '0.25rem 0 0 0',
                color: '#94a3b8',
                fontSize: '0.85rem'
              }}
            >
              {usuario.cargo || 'Sin cargo'}
              {' — '}
              {usuario.dpto_area}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              border: 'none',
              background: 'none',
              color: '#fff',
              cursor: 'pointer'
            }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Contenido */}
        <div
          style={{
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            maxHeight: '75vh',
            overflowY: 'auto'
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem',
              backgroundColor: '#f8fafc',
              padding: '1rem',
              borderRadius: '8px',
              border: '1px solid #e2e8f0'
            }}
          >
            {/* Usuario Red */}
            <div>
              <span
                style={{
                  fontSize: '0.75rem',
                  color: '#64748b',
                  textTransform: 'uppercase',
                  fontWeight: 'bold'
                }}
              >
                Usuario de Red
              </span>

              <p
                style={{
                  margin: '2px 0 0 0',
                  fontWeight: '600'
                }}
              >
                {usuario.usuario_red || 'N/I'}
              </p>
            </div>

            {/* Hostname */}
            <div>
              <span
                style={{
                  fontSize: '0.75rem',
                  color: '#64748b',
                  textTransform: 'uppercase',
                  fontWeight: 'bold'
                }}
              >
                Hostname
              </span>

              <p
                style={{
                  margin: '2px 0 0 0',
                  fontWeight: 'bold',
                  color: '#0284c7'
                }}
              >
                {usuario.hostname || 'N/I'}
              </p>
            </div>

            {/* IP */}
            <div>
              <span
                style={{
                  fontSize: '0.75rem',
                  color: '#64748b',
                  textTransform: 'uppercase',
                  fontWeight: 'bold'
                }}
              >
                IP Asignada
              </span>

              <p
                style={{
                  margin: '2px 0 0 0',
                  fontWeight: 'bold',
                  color: usuario.ip_actual
                    ? '#16a34a'
                    : '#94a3b8'
                }}
              >
                {usuario.ip_actual || 'Sin IP'}
              </p>
            </div>

            {/* Correo */}
            <div>
              <span
                style={{
                  fontSize: '0.75rem',
                  color: '#64748b',
                  textTransform: 'uppercase',
                  fontWeight: 'bold'
                }}
              >
                Correo Corp.
              </span>

              <p
                style={{
                  margin: '2px 0 0 0',
                  fontSize: '0.85rem'
                }}
              >
                {usuario.correo_corp || 'N/I'}
              </p>
            </div>

            {/* Celular */}
            <div>
              <span
                style={{
                  fontSize: '0.75rem',
                  color: '#64748b',
                  textTransform: 'uppercase',
                  fontWeight: 'bold'
                }}
              >
                Celular
              </span>

              <p
                style={{
                  margin: '2px 0 0 0',
                  fontSize: '0.85rem',
                  fontWeight: '500'
                }}
              >
                {usuario.celular || 'N/I'}
              </p>
            </div>

            {/* Teléfono */}
            <div>
              <span
                style={{
                  fontSize: '0.75rem',
                  color: '#64748b',
                  textTransform: 'uppercase',
                  fontWeight: 'bold'
                }}
              >
                Teléfono Fijo / Anexo
              </span>

              <p
                style={{
                  margin: '2px 0 0 0',
                  fontSize: '0.85rem'
                }}
              >
                {usuario.telefono || 'Sin teléfono'}

                {usuario.anexo
                  ? ` (Anx: ${usuario.anexo})`
                  : ''}
              </p>
            </div>

            {/* Gmail */}
            <div
              style={{
                gridColumn: 'span 2',
                backgroundColor: '#fff',
                padding: '0.75rem',
                borderRadius: '6px',
                border: '1px solid #cbd5e1'
              }}
            >
              <span
                style={{
                  fontSize: '0.75rem',
                  color: '#64748b',
                  textTransform: 'uppercase',
                  fontWeight: 'bold',
                  display: 'block'
                }}
              >
                Gmail & Contraseña
              </span>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '4px'
                }}
              >
                <span
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: '500'
                  }}
                >
                  {usuario.gmail || 'Sin Gmail'}
                </span>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'monospace',
                      fontWeight: 'bold',
                      fontSize: '0.9rem',
                      backgroundColor: '#f1f5f9',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '4px'
                    }}
                  >
                    {showPassGmail
                      ? (
                        usuario.password_gmail ||
                        'Sin Contraseña'
                      )
                      : (
                        usuario.password_gmail
                          ? '••••••••'
                          : 'Sin Contraseña'
                      )}
                  </span>

                  {usuario.password_gmail && (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          setShowPassGmail(
                            !showPassGmail
                          )
                        }
                        style={{
                          border: 'none',
                          background: 'none',
                          cursor: 'pointer',
                          color: '#64748b'
                        }}
                        title="Mostrar / Ocultar"
                      >
                        {showPassGmail
                          ? <EyeOff size={16} />
                          : <Eye size={16} />}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          copyToClipboard(
                            usuario.password_gmail,
                            'gmail'
                          )
                        }
                        style={{
                          border: 'none',
                          background: 'none',
                          cursor: 'pointer',
                          color: copiedGmail
                            ? '#16a34a'
                            : '#64748b'
                        }}
                        title="Copiar Contraseña"
                      >
                        {copiedGmail
                          ? <Check size={16} />
                          : <Copy size={16} />}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* SIMI */}
            <div
              style={{
                gridColumn: 'span 2',
                backgroundColor: '#fff',
                padding: '0.75rem',
                borderRadius: '6px',
                border: '1px solid #cbd5e1'
              }}
            >
              <span
                style={{
                  fontSize: '0.75rem',
                  color: '#64748b',
                  textTransform: 'uppercase',
                  fontWeight: 'bold',
                  display: 'block'
                }}
              >
                Contraseña SIMI
              </span>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '4px'
                }}
              >
                <span
                  style={{
                    fontFamily: 'monospace',
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                    backgroundColor: '#f1f5f9',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '4px'
                  }}
                >
                  {showPassSimi
                    ? (
                      usuario.password_simi ||
                      'Sin Contraseña'
                    )
                    : (
                      usuario.password_simi
                        ? '••••••••'
                        : 'Sin Contraseña'
                    )}
                </span>

                {usuario.password_simi && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setShowPassSimi(
                          !showPassSimi
                        )
                      }
                      style={{
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        color: '#64748b'
                      }}
                      title="Mostrar / Ocultar"
                    >
                      {showPassSimi
                        ? <EyeOff size={16} />
                        : <Eye size={16} />}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        copyToClipboard(
                          usuario.password_simi,
                          'simi'
                        )
                      }
                      style={{
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        color: copiedSimi
                          ? '#16a34a'
                          : '#64748b'
                      }}
                      title="Copiar Contraseña"
                    >
                      {copiedSimi
                        ? <Check size={16} />
                        : <Copy size={16} />}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Equipos asignados */}
          <div>
            <h4
              style={{
                margin: '0 0 0.5rem 0',
                color: '#1e293b',
                fontSize: '0.9rem',
                fontWeight: 'bold'
              }}
            >
              Equipos Asignados
            </h4>

            {usuario.equipos &&
            usuario.equipos.length > 0 ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}
              >
                {usuario.equipos.map((equipo) => (
                  <div
                    key={equipo.id}
                    style={{
                      display: 'flex',
                      justifyContent:
                        'space-between',
                      alignItems: 'center',
                      backgroundColor: '#f1f5f9',
                      padding: '0.6rem 0.8rem',
                      borderRadius: '6px',
                      fontSize: '0.85rem'
                    }}
                  >
                    <div>
                      <strong>
                        [
                        {formatEquipmentType(
                          equipo.tipo
                        )}
                        ]{' '}
                        {equipo.marca}{' '}
                        {equipo.modelo}
                      </strong>

                      <span
                        style={{
                          color: '#64748b',
                          marginLeft: '8px',
                          fontFamily: 'monospace'
                        }}
                      >
                        S/N: {equipo.numero_serie}
                      </span>
                    </div>

                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        color: '#0284c7'
                      }}
                    >
                      AF: {equipo.af || 'N/I'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p
                style={{
                  fontSize: '0.85rem',
                  color: '#94a3b8',
                  fontStyle: 'italic',
                  margin: 0
                }}
              >
                Sin equipos vinculados actualmente.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}