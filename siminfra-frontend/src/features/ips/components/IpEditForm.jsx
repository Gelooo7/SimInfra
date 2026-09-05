export default function IpEditForm({
  ip,
  onChange,
  usuarios,
  onIpChange,
}) {
  const updateField = (field, value) => {
    onChange({
      ...ip,
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

  return (
    <>
      {/* Dirección IP */}
      <div>
        <label style={labelStyle}>
          Dirección IP * (Solo números y puntos, máx. 15 caracteres)
        </label>

        <input
          type="text"
          required
          maxLength={15}
          value={ip.direccion_ip || ''}
          onChange={(e) =>
            onIpChange(e.target.value)
          }
          style={inputStyle}
        />
      </div>

      {/* Estado */}
      <div>
        <label style={labelStyle}>
          Estado de la IP *
        </label>

        <select
          value={ip.estado || 'LIBRE'}
          onChange={(e) =>
            updateField(
              'estado',
              e.target.value
            )
          }
          style={inputStyle}
        >
          <option value="LIBRE">
            🟢 Libre
          </option>

          <option value="RESERVADA">
            🔴 Reservada
          </option>

          <option value="DUPLICADA">
            🔵 Duplicada
          </option>

          <option value="DESCONOCIDA">
            🟡 Desconocida
          </option>
        </select>
      </div>

      {/* Usuario asignado */}
      <div>
        <label
          style={{
            ...labelStyle,
            color: '#2563eb'
          }}
        >
          Asignado a (Usuario)
        </label>

        <select
          value={ip.usuario || ''}
          onChange={(e) =>
            onChange({
              ...ip,
              usuario: e.target.value || null,
              asignado_otro: ''
            })
          }
          style={inputStyle}
        >
          <option value="">
            Sin Asignar (Ninguno)
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

      {/* Otro dispositivo */}
      {!ip.usuario && (
        <div>
          <label
            style={{
              ...labelStyle,
              color: '#0284c7'
            }}
          >
            Otros (Servidor, CCTV, Impresora, etc.)
          </label>

          <input
            type="text"
            placeholder="Ej: Servidor DB / CCTV Piso 1"
            value={ip.asignado_otro || ''}
            onChange={(e) =>
              updateField(
                'asignado_otro',
                e.target.value
              )
            }
            style={inputStyle}
          />
        </div>
      )}

      {/* Observaciones */}
      <div>
        <label style={labelStyle}>
          Observaciones
        </label>

        <input
          type="text"
          value={ip.observacion || ''}
          onChange={(e) =>
            updateField(
              'observacion',
              e.target.value
            )
          }
          style={inputStyle}
        />
      </div>
    </>
  );
}