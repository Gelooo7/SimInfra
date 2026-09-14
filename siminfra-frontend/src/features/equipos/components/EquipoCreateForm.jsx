import {
  equipmentUsesHostname,
  equipmentUsesMobileLine,
  normalizeEquipmentFieldsByType,
} from '../../../utils/equipmentHelpers';

export default function EquipoCreateForm({
  equipo,
  onChange,
  usuarios,
  formatEquipmentType,
  onHostnameChange,
}) {
  const updateField = (field, value) => {
    onChange({
      ...equipo,
      [field]: value,
    });
  };

  const inputStyle = {
    width: '100%',
    padding: '0.6rem',
    borderRadius: '6px',
    border: '1px solid #cbd5e1',
    marginTop: '4px',
    boxSizing: 'border-box',
  };

  const labelStyle = {
    fontSize: '0.8rem',
    color: '#64748b',
    fontWeight: 'bold',
  };

  const tipoActual = formatEquipmentType(
    equipo.tipo
  );

  const usaHostname =
    equipmentUsesHostname(tipoActual);

  const usaLineaMovil =
    equipmentUsesMobileLine(tipoActual);

  const esCelular =
    tipoActual === 'Celular';

  const esMac =
    tipoActual === 'Mac';

  const handleTipoChange = (nuevoTipo) => {
    const nuevoEstado =
      normalizeEquipmentFieldsByType(
        equipo,
        nuevoTipo
      );

    onChange(nuevoEstado);
  };

  return (
    <>
      {/* =========================
          TIPO
      ========================= */}

      <div>
        <label style={labelStyle}>
          Tipo de Equipo *
        </label>

        <select
          value={tipoActual}
          onChange={(e) =>
            handleTipoChange(e.target.value)
          }
          style={inputStyle}
        >
          <optgroup label="Equipos principales">
            <option value="Notebook">
              Notebook
            </option>

            <option value="Celular">
              Celular
            </option>

            <option value="Tablet">
              Tablet
            </option>

            <option value="Mac">
              Mac
            </option>

            <option value="BAM / Router">
              BAM / Router
            </option>
          </optgroup>

          <optgroup label="Periféricos">
            <option value="Monitor">
              Monitor
            </option>

            <option value="Adaptador">
              Adaptador
            </option>

            <option value="Audífonos">
              Audífonos
            </option>

            <option value="Teclado">
              Teclado
            </option>

            <option value="Mouse">
              Mouse
            </option>

            <option value="Docking">
              Docking
            </option>

            <option value="Otro Periférico">
              Otro Periférico
            </option>
          </optgroup>
        </select>
      </div>

      {/* =========================
          MARCA
      ========================= */}

      <div>
        <label style={labelStyle}>
          Marca *
        </label>

        <input
          type="text"
          required
          value={equipo.marca || ''}
          onChange={(e) =>
            updateField(
              'marca',
              e.target.value
            )
          }
          style={inputStyle}
        />
      </div>

      {/* =========================
          MODELO
      ========================= */}

      <div>
        <label style={labelStyle}>
          Modelo *
        </label>

        <input
          type="text"
          required
          value={equipo.modelo || ''}
          onChange={(e) =>
            updateField(
              'modelo',
              e.target.value
            )
          }
          style={inputStyle}
        />
      </div>

      {/* =========================
          NÚMERO DE SERIE
      ========================= */}

      <div>
        <label style={labelStyle}>
          N° de Serie
        </label>

        <input
          type="text"
          value={
            equipo.numero_serie || ''
          }
          onChange={(e) =>
            updateField(
              'numero_serie',
              e.target.value
            )
          }
          placeholder="Opcional"
          style={inputStyle}
        />
      </div>

      {/* =========================
          CELULAR
      ========================= */}

      {esCelular && (
        <div
          style={{
            backgroundColor: '#f0fdf4',
            padding: '0.8rem',
            borderRadius: '8px',
            border: '1px solid #bbf7d0',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
          }}
        >
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 'bold',
              color: '#166534',
              textTransform: 'uppercase',
            }}
          >
            Detalles de Celular
          </span>

          {/* SIM */}

          <div>
            <label
              style={{
                ...labelStyle,
                color: '#166534',
              }}
            >
              SIM / N° Celular
            </label>

            <input
              type="text"
              value={
                equipo.numero_telefono ||
                ''
              }
              onChange={(e) =>
                updateField(
                  'numero_telefono',
                  e.target.value
                )
              }
              placeholder="+56 9 1234 5678"
              style={inputStyle}
            />
          </div>

          {/* IMEI / PIN */}

          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                '1fr 1fr',
              gap: '0.5rem',
            }}
          >
            <div>
              <label
                style={{
                  ...labelStyle,
                  color: '#166534',
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
                  color: '#166534',
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

      {/* =========================
          TABLET / BAM
          LÍNEA MÓVIL
      ========================= */}

      {usaLineaMovil && !esCelular && (
        <div
          style={{
            backgroundColor: '#f0fdf4',
            padding: '0.8rem',
            borderRadius: '8px',
            border: '1px solid #bbf7d0',
          }}
        >
          <label
            style={{
              ...labelStyle,
              color: '#166534',
            }}
          >
            SIM / N° Celular
          </label>

          <input
            type="text"
            value={
              equipo.numero_telefono || ''
            }
            onChange={(e) =>
              updateField(
                'numero_telefono',
                e.target.value
              )
            }
            placeholder="Opcional"
            style={inputStyle}
          />
        </div>
      )}

      {/* =========================
          ICLOUD MAC
      ========================= */}

      {esMac && (
        <div
          style={{
            backgroundColor: '#eff6ff',
            padding: '0.8rem',
            borderRadius: '8px',
            border: '1px solid #bfdbfe',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
          }}
        >
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 'bold',
              color: '#1e40af',
              textTransform: 'uppercase',
            }}
          >
            Detalles de iCloud (Mac)
          </span>

          <div>
            <label
              style={{
                ...labelStyle,
                color: '#1e40af',
              }}
            >
              Cuenta iCloud
            </label>

            <input
              type="email"
              value={
                equipo.icloud_cuenta || ''
              }
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
                color: '#1e40af',
              }}
            >
              Contraseña iCloud
            </label>

            <input
              type="text"
              value={
                equipo.icloud_password ||
                ''
              }
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

      {/* =========================
          HOSTNAME
          SOLO NOTEBOOK / MAC
      ========================= */}

      {usaHostname && (
        <div>
          <label
            style={{
              ...labelStyle,
              color: '#0284c7',
            }}
          >
            Hostname
            {' '}
            (Autocompleta usuario asignado)
          </label>

          <input
            type="text"
            value={equipo.hostname || ''}
            onChange={(e) =>
              onHostnameChange(
                e.target.value
              )
            }
            placeholder="Ej: CL-NB-001"
            style={inputStyle}
          />
        </div>
      )}

      {/* =========================
          ACTIVO FIJO
      ========================= */}

      <div>
        <label style={labelStyle}>
          Activo Fijo
          {' '}
          (AF - Máx. 12 caracteres)
        </label>

        <input
          type="text"
          maxLength={12}
          value={equipo.af || ''}
          onChange={(e) =>
            updateField(
              'af',
              e.target.value
            )
          }
          placeholder="Ej: 123456 o SIN AF"
          style={inputStyle}
        />
      </div>

      {/* =========================
          ACCESORIOS
      ========================= */}

      <div>
        <label style={labelStyle}>
          Accesorios incluidos
        </label>

        <textarea
          rows={3}
          maxLength={255}
          value={equipo.accesorios || ''}
          onChange={(e) =>
            updateField(
              'accesorios',
              e.target.value
            )
          }
          placeholder="Ej: Cargador, bolso, mouse inalámbrico"
          style={{
            ...inputStyle,
            resize: 'vertical',
            fontFamily: 'inherit'
          }}
        />
      </div>

      {/* =========================
          USUARIO
      ========================= */}

      <div>
        <label
          style={{
            ...labelStyle,
            color: '#2563eb',
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

      {/* =========================
          FECHA
      ========================= */}

      <div>
        <label style={labelStyle}>
          Fecha de Asignación
        </label>

        <input
          type="date"
          value={
            equipo.fecha_asignacion || ''
          }
          onChange={(e) =>
            updateField(
              'fecha_asignacion',
              e.target.value
            )
          }
          style={inputStyle}
        />
      </div>
    </>
  );
}