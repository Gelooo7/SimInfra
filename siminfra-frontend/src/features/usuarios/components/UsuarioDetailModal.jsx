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

  /*
    El teléfono corporativo NO se toma desde Usuario.celular.

    Se obtiene automáticamente desde los equipos
    de tipo Celular asignados al usuario.
  */
  const celularesAsignados = (usuario.equipos || []).filter(
    (equipo) =>
      formatEquipmentType(equipo.tipo) === 'Celular'
  );

  const numerosCelular = celularesAsignados
    .map((equipo) => equipo.numero_telefono)
    .filter(Boolean);

  const celularCorporativo =
    numerosCelular.length > 0
      ? numerosCelular.join(' / ')
      : null;

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
        'Error copiando al portapapeles:',
        error
      );
    }
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.7rem',
    fontWeight: 'bold',
    color: '#64748b',
    textTransform: 'uppercase',
    marginBottom: '3px'
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
          width: '760px',
          maxWidth: '95%',
          maxHeight: '90vh',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow:
            '0 20px 25px -5px rgba(0,0,0,0.25)'
        }}
      >
        {/* ENCABEZADO */}
        <div
          style={{
            backgroundColor: '#0f172a',
            color: '#fff',
            padding: '1.25rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start'
          }}
        >
          <div>
            <div
              style={{
                marginBottom: '0.5rem'
              }}
            >
              {renderStatusBadge(usuario.estado)}
            </div>

            <p
              style={{
                margin: 0,
                color: '#94a3b8',
                fontSize: '0.8rem',
                textTransform: 'uppercase'
              }}
            >
              {usuario.cargo || 'Sin cargo'}
              {' — '}
              {usuario.dpto_area || 'Sin área'}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#fff',
              cursor: 'pointer'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* CONTENIDO */}
        <div
          style={{
            padding: '1.5rem',
            maxHeight: '72vh',
            overflowY: 'auto'
          }}
        >
          {/* DATOS GENERALES */}
          <div
            style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              padding: '1rem',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem'
            }}
          >
            <div>
              <span style={labelStyle}>
                Usuario de Red
              </span>

              <strong
                style={{
                  color: '#475569'
                }}
              >
                {usuario.usuario_red || 'N/I'}
              </strong>
            </div>

            <div>
              <span style={labelStyle}>
                Hostname
              </span>

              <strong
                style={{
                  color: '#0284c7'
                }}
              >
                {usuario.hostname || 'Sin hostname'}
              </strong>
            </div>

            <div>
              <span style={labelStyle}>
                IP Asignada
              </span>

              <strong
                style={{
                  color: usuario.ip_actual
                    ? '#16a34a'
                    : '#94a3b8'
                }}
              >
                {usuario.ip_actual || 'Sin IP'}
              </strong>
            </div>

            <div>
              <span style={labelStyle}>
                Correo Corp.
              </span>

              <span
                style={{
                  color: '#475569',
                  fontSize: '0.85rem',
                  wordBreak: 'break-word'
                }}
              >
                {usuario.correo_corp || 'Sin correo'}
              </span>
            </div>

            {/* CELULAR AUTOMÁTICO DESDE EQUIPOS */}
            <div>
              <span style={labelStyle}>
                Celular Corporativo
              </span>

              <strong
                style={{
                  color: celularCorporativo
                    ? '#2563eb'
                    : '#94a3b8'
                }}
              >
                {celularCorporativo ||
                  'Sin celular asignado'}
              </strong>
            </div>

            <div>
              <span style={labelStyle}>
                Teléfono Fijo / Anexo
              </span>

              <span
                style={{
                  color: '#475569',
                  fontSize: '0.85rem'
                }}
              >
                {usuario.telefono
                  ? `${usuario.telefono}${
                      usuario.anexo
                        ? ` (Anx: ${usuario.anexo})`
                        : ''
                    }`
                  : usuario.anexo
                  ? `Anexo ${usuario.anexo}`
                  : 'Sin teléfono'}
              </span>
            </div>

            {/* GMAIL */}
            <div
              style={{
                gridColumn: '1 / -1',
                border: '1px solid #cbd5e1',
                backgroundColor: '#fff',
                borderRadius: '6px',
                padding: '0.75rem'
              }}
            >
              <span style={labelStyle}>
                Gmail & Contraseña
              </span>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '1rem'
                }}
              >
                <span
                  style={{
                    fontSize: '0.85rem',
                    color: '#475569'
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
                      backgroundColor: '#f1f5f9',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '4px'
                    }}
                  >
                    {showPassGmail
                      ? usuario.password_gmail ||
                        'Sin Contraseña'
                      : usuario.password_gmail
                      ? '••••••••'
                      : 'Sin Contraseña'}
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
                        {showPassGmail ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
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
                        {copiedGmail ? (
                          <Check size={16} />
                        ) : (
                          <Copy size={16} />
                        )}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* SIMI */}
            <div
              style={{
                gridColumn: '1 / -1',
                border: '1px solid #cbd5e1',
                backgroundColor: '#fff',
                borderRadius: '6px',
                padding: '0.75rem'
              }}
            >
              <span style={labelStyle}>
                Contraseña Simi
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
                    backgroundColor: '#f1f5f9',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '4px'
                  }}
                >
                  {showPassSimi
                    ? usuario.password_simi ||
                      'Sin Contraseña'
                    : usuario.password_simi
                    ? '••••••••'
                    : 'Sin Contraseña'}
                </span>

                {usuario.password_simi && (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        setShowPassSimi(!showPassSimi)
                      }
                      style={{
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        color: '#64748b'
                      }}
                      title="Mostrar / Ocultar"
                    >
                      {showPassSimi ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
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
                      {copiedSimi ? (
                        <Check size={16} />
                      ) : (
                        <Copy size={16} />
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* EQUIPOS */}
          <div
            style={{
              marginTop: '1.25rem'
            }}
          >
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
                {usuario.equipos.map((equipo) => {
                  const tipoEquipo =
                    formatEquipmentType(
                      equipo.tipo
                    );

                  return (
                    <div
                      key={equipo.id}
                      style={{
                        backgroundColor: '#f1f5f9',
                        padding: '0.75rem 0.8rem',
                        borderRadius: '6px',
                        fontSize: '0.85rem'
                      }}
                    >
                      {/* CABECERA EQUIPO */}
                      <div
                        style={{
                          display: 'flex',
                          justifyContent:
                            'space-between',
                          alignItems: 'center',
                          gap: '1rem'
                        }}
                      >
                        <div>
                          <strong>
                            [{tipoEquipo}]{' '}
                            {equipo.marca}{' '}
                            {equipo.modelo}
                          </strong>

                          <span
                            style={{
                              color: '#64748b',
                              marginLeft: '8px',
                              fontFamily:
                                'monospace'
                            }}
                          >
                            S/N:{' '}
                            {equipo.numero_serie}
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

                      {/* CELULAR
                          El número NO se repite aquí.
                          Ya aparece arriba como
                          Celular Corporativo.
                      */}
                      {tipoEquipo === 'Celular' && (
                        <div
                          style={{
                            marginTop: '0.6rem',
                            paddingTop: '0.6rem',
                            borderTop:
                              '1px solid #cbd5e1',
                            display: 'grid',
                            gridTemplateColumns:
                              '1fr 1fr',
                            gap: '1rem'
                          }}
                        >
                          <div>
                            <span
                              style={labelStyle}
                            >
                              IMEI
                            </span>

                            <span>
                              {equipo.imei || 'N/I'}
                            </span>
                          </div>

                          <div>
                            <span
                              style={labelStyle}
                            >
                              PIN
                            </span>

                            <span>
                              {equipo.pin || 'N/I'}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* MAC */}
                      {tipoEquipo === 'Mac' && (
                        <div
                          style={{
                            marginTop: '0.6rem',
                            paddingTop: '0.6rem',
                            borderTop:
                              '1px solid #cbd5e1'
                          }}
                        >
                          <span style={labelStyle}>
                            Cuenta iCloud
                          </span>

                          <span>
                            {equipo.icloud_cuenta ||
                              'N/I'}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
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