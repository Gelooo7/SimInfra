import { useState } from 'react';

import {
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export default function EquipoHistoryModal({
  equipo,
  onClose,
}) {
  const [expandedHistory, setExpandedHistory] = useState({});

  if (!equipo) {
    return null;
  }

  const renderHistorialDetalle = (observacion) => {
    if (!observacion) {
      return (
        <p
          style={{
            margin: 0,
            color: '#64748b'
          }}
        >
          Sin detalles adicionales.
        </p>
      );
    }

    if (observacion.includes(':::')) {
      const items = observacion.split('||');

      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            marginTop: '0.5rem'
          }}
        >
          {items.map((item, index) => {
            const parts = item.split(':::');

            const campo = parts[0] || 'Campo';
            const anterior = parts[1] || 'N/I';
            const actual = parts[2] || 'N/I';

            return (
              <div
                key={index}
                style={{
                  backgroundColor: '#fff',
                  padding: '0.6rem 0.8rem',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1'
                }}
              >
                <div
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    color: '#1e40af',
                    marginBottom: '4px'
                  }}
                >
                  {campo}
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '1rem',
                    fontSize: '0.8rem'
                  }}
                >
                  <div>
                    <span
                      style={{
                        color: '#94a3b8',
                        fontSize: '0.7rem',
                        textTransform: 'uppercase',
                        fontWeight: 'bold',
                        display: 'block'
                      }}
                    >
                      Anterior
                    </span>

                    <span
                      style={{
                        color: '#b91c1c',
                        fontWeight: '600',
                        wordBreak: 'break-word'
                      }}
                    >
                      {anterior}
                    </span>
                  </div>

                  <div>
                    <span
                      style={{
                        color: '#94a3b8',
                        fontSize: '0.7rem',
                        textTransform: 'uppercase',
                        fontWeight: 'bold',
                        display: 'block'
                      }}
                    >
                      Actual
                    </span>

                    <span
                      style={{
                        color: '#15803d',
                        fontWeight: '600',
                        wordBreak: 'break-word'
                      }}
                    >
                      {actual}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      );
    }

    return (
      <p
        style={{
          margin: '0.5rem 0 0 0',
          fontSize: '0.85rem',
          color: '#334155'
        }}
      >
        {observacion}
      </p>
    );
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
            padding: '1.25rem',
            backgroundColor: '#0f172a',
            color: '#fff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div>
            <h3
              style={{
                margin: 0,
                fontSize: '1.1rem'
              }}
            >
              Historial de Movimientos
            </h3>

            <p
              style={{
                margin: '2px 0 0 0',
                color: '#94a3b8',
                fontSize: '0.8rem'
              }}
            >
              {equipo.marca} {equipo.modelo}
              {' — '}
              Serie: {equipo.numero_serie}
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
            <X size={20} />
          </button>
        </div>

        {/* Historial */}
        <div
          style={{
            padding: '1.5rem',
            maxHeight: '60vh',
            overflowY: 'auto'
          }}
        >
          {equipo.historial &&
          equipo.historial.length > 0 ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}
            >
              {equipo.historial.map((historial, index) => {
                const isExpanded =
                  !!expandedHistory[index];

                return (
                  <div
                    key={index}
                    style={{
                      borderLeft: '3px solid #2563eb',
                      paddingLeft: '1rem',
                      backgroundColor: '#f8fafc',
                      padding: '0.75rem',
                      borderRadius: '0 8px 8px 0'
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '0.25rem'
                      }}
                    >
                      <span
                        style={{
                          fontWeight: 'bold',
                          fontSize: '0.8rem',
                          color: '#1e40af',
                          backgroundColor: '#dbeafe',
                          padding: '0.1rem 0.5rem',
                          borderRadius: '4px'
                        }}
                      >
                        {historial.accion}
                      </span>

                      <span
                        style={{
                          fontSize: '0.75rem',
                          color: '#64748b'
                        }}
                      >
                        {new Date(
                          historial.fecha_movimiento
                        ).toLocaleString()}
                      </span>
                    </div>

                    <div
                      style={{
                        marginTop: '0.5rem'
                      }}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedHistory((prev) => ({
                            ...prev,
                            [index]: !prev[index]
                          }))
                        }
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#2563eb',
                          fontWeight: 'bold',
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: 0
                        }}
                      >
                        {isExpanded ? (
                          <ChevronUp size={16} />
                        ) : (
                          <ChevronDown size={16} />
                        )}

                        {isExpanded
                          ? 'Ocultar detalles'
                          : 'Ver más detalle'}
                      </button>
                    </div>

                    {isExpanded &&
                      renderHistorialDetalle(
                        historial.observacion
                      )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p
              style={{
                textAlign: 'center',
                color: '#94a3b8',
                fontStyle: 'italic',
                margin: '2rem 0'
              }}
            >
              No existen registros de cambios para este equipo.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}