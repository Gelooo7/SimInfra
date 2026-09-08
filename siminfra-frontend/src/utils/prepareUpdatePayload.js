export const prepareUpdatePayload = (tab, item, formatTipoEquipo) => {
  const payload = { ...item };

  // Campos que no deben enviarse al backend
  delete payload.equipos;
  delete payload.historial;
  delete payload.id;
  delete payload.usuario_nombre;
  delete payload.ip_actual;

  // USUARIOS
  if (tab === 'usuarios') {
    delete payload.ip_asignada;

    if (payload.ip_seleccionada === '') {
      payload.ip_seleccionada = null;
    }
  }

  // EQUIPOS - Normalizar tipos antiguos
  if (tab === 'equipos' && payload.tipo) {
    payload.tipo = formatTipoEquipo(payload.tipo);
  }

  // EQUIPOS - Coherencia usuario / estado
  if (tab === 'equipos') {
    if (!payload.usuario) {
      payload.estado = 'STOCK';
      payload.fecha_asignacion = null;

    } else if (payload.estado === 'STOCK') {
      payload.estado = 'ASIGNADO';
    }
  }

  // Normalizar estados
  if (payload.estado && tab !== 'ips') {
    payload.estado = payload.estado.toUpperCase();
  }

  // IPS
  if (tab === 'ips') {
    if (
      payload.usuario ||
      (payload.asignado_otro && payload.asignado_otro.trim())
    ) {
      payload.estado = 'RESERVADA';

    } else if (
      !payload.usuario &&
      !payload.asignado_otro &&
      payload.estado === 'RESERVADA'
    ) {
      payload.estado = 'LIBRE';
    }
  }

  return payload;
};