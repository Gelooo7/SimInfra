export default function EquipoEditForm({
  equipo,
  onChange,
  usuarios,
  formatEquipmentType,
  onHostnameChange,
}) {
  const updateField = (field, value) => {
    onChange({
      ...equipo,
      [field]: value
    });
  };

  const inputStyle = {
    width: '100%',
    padding: '0.6rem',
    borderRadius: '6px',
    border: '1px solid #cbd5e1',
    marginTop: '4px',
    boxSizing: 'border-box'
  };

  const labelStyle = {
    fontSize: '0.8rem',
    color: '#64748b',
    fontWeight: 'bold'
  };

  const tipoActual = formatEquipmentType(equipo.tipo);

  return (
    <>
      {/* Tipo */}
      <div>
        <label style={labelStyle}>
          Tipo de Equipo
        </label>

        <select
          value={tipoActual}
          onChange={(e) =>
            updateField('tipo', e.target.value)
          }
          style={inputStyle}
        >
          <option value="Notebook">Notebook</option>
          <option value="Celular">Celular</option>
          <option value="Tablet">Tablet</option>
          <option value="Mac">Mac</option>
          <option value="BAM / Router">BAM / Router</option>
        </select>
      </div>

      {/* Marca */}
      <div>
        <label style={labelStyle}>
          Marca
        </label>

        <input
          type="text"
          value={equipo.marca || ''}
          onChange={(e) =>
            updateField('marca', e.target.value)
          }
          style={inputStyle}
        />
      </div>

      {/* Modelo */}
      <div>
        <label style={labelStyle}>
          Modelo
        </label>

        <input
          type="text"
          value={equipo.modelo || ''}
          onChange={(e) =>
            updateField('modelo', e.target.value)
          }
          style={inputStyle}
        />
      </div>

      {/* Serie */}
      <div>
        <label style={labelStyle}>
          N° de Serie
        </label>

        <input
          type="text"
          value={equipo.numero_serie || ''}
          onChange={(e) =>
            updateField(
              'numero_serie',
              e.target.value
            )
          }
          style={inputStyle}
        />
      </div>

      {/* Celular */}
      {tipoActual === 'Celular' && (
        <div
          style={{
            backgroundColor: '#f0fdf4',
            padding: '0.8rem',
            borderRadius: '8px',
            border: '1px solid #bbf7d0',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}
        >
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 'bold',
              color: '#166534',
              textTransform: 'uppercase'
            }}
          >
            Detalles de Celular
          </span>

          <div>
            <label
              style={{
                ...labelStyle,
                color: '#166534'
              }}
            >
              Número de Teléfono
            </label>

            <input
              type="text"
              value={equipo.numero_telefono || ''}
              onChange={(e) =>
                updateField(
                  'numero_telefono',
                  e.target.value
                )
              }
              style={inputStyle}
            />
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.5rem'
            }}
          >
            <div>
              <label
                style={{
                  ...labelStyle,
                  color: '#166534'
                }}
              >
                IMEI
              </label>

              <input
                type="text"
                value={equipo.imei || ''}
                onChange={(e) =>
                  updateField(
                    'imei',
                    e.target.value
                  )
                }
                style={inputStyle}
              />
            </div>

            <div>
              <label
                style={{
                  ...labelStyle,
                  color: '#166534'
                }}
              >
                PIN
              </label>

              <input
                type="text"
                value={equipo.pin || ''}
                onChange={(e) =>
                  updateField(
                    'pin',
                    e.target.value
                  )
                }
                style={inputStyle}
              />
            </div>
          </div>
        </div>
      )}

      {/* Mac */}
      {tipoActual === 'Mac' && (
        <div
          style={{
            backgroundColor: '#eff6ff',
            padding: '0.8rem',
            borderRadius: '8px',
            border: '1px solid #bfdbfe',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}
        >
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 'bold',
              color: '#1e40af',
              textTransform: 'uppercase'
            }}
          >
            Detalles de iCloud (Mac)
          </span>

          <div>
            <label
              style={{
                ...labelStyle,
                color: '#1e40af'
              }}
            >
              Cuenta iCloud
            </label>

            <input
              type="email"
              value={equipo.icloud_cuenta || ''}
              onChange={(e) =>
                updateField(
                  'icloud_cuenta',
                  e.target.value
                )
              }
              style={inputStyle}
            />
          </div>

          <div>
            <label
              style={{
                ...labelStyle,
                color: '#1e40af'
              }}
            >
              Contraseña iCloud
            </label>

            <input
              type="text"
              value={equipo.icloud_password || ''}
              onChange={(e) =>
                updateField(
                  'icloud_password',
                  e.target.value
                )
              }
              style={inputStyle}
            />
          </div>
        </div>
      )}

      {/* Hostname */}
      <div>
        <label
          style={{
            ...labelStyle,
            color: '#0284c7'
          }}
        >
          Hostname
        </label>

        <input
          type="text"
          value={equipo.hostname || ''}
          onChange={(e) =>
            onHostnameChange(e.target.value)
          }
          style={inputStyle}
        />
      </div>

      {/* AF */}
      <div>
        <label style={labelStyle}>
          Activo Fijo (AF)
        </label>

        <input
          type="text"
          maxLength={12}
          value={equipo.af || ''}
          onChange={(e) =>
            updateField('af', e.target.value)
          }
          style={inputStyle}
        />
      </div>

      {/* Usuario */}
      <div>
        <label
          style={{
            ...labelStyle,
            color: '#2563eb'
          }}
        >
          Asignar a Usuario
        </label>

        <select
          value={equipo.usuario || ''}
          onChange={(e) =>
            updateField(
              'usuario',
              e.target.value || null
            )
          }
          style={inputStyle}
        >
          <option value="">
            Sin Asignar (Stock)
          </option>

          {usuarios.map((usuario) => (
            <option
              key={usuario.id}
              value={usuario.id}
            >
              {usuario.nombre_completo}
              {' '}
              ({usuario.usuario_red})
            </option>
          ))}
        </select>
      </div>

      {/* Fecha */}
      <div>
        <label style={labelStyle}>
          Fecha de Asignación
        </label>

        <input
          type="date"
          value={equipo.fecha_asignacion || ''}
          onChange={(e) =>
            updateField(
              'fecha_asignacion',
              e.target.value
            )
          }
          style={inputStyle}
        />
      </div>

      {/* Estado */}
      <div>
        <label style={labelStyle}>
          Estado
        </label>

        <select
          value={equipo.estado || 'ASIGNADO'}
          onChange={(e) =>
            updateField(
              'estado',
              e.target.value
            )
          }
          style={inputStyle}
        >
          <option value="ASIGNADO">
            Asignado
          </option>

          <option value="STOCK">
            Stock / Disponible
          </option>

          <option value="MANTENCION">
            En Mantención
          </option>

          <option value="BAJA">
            Dado de Baja
          </option>
        </select>
      </div>
    </>
  );
}