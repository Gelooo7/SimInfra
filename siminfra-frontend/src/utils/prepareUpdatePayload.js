export const prepareUpdatePayload = (tab, item, formatTipoEquipo) => {
  const payload = { ...item };

  // Campos generales que no deben enviarse al backend
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

  // ANEXOS
  if (tab === 'anexos') {
    // Estos datos provienen del usuario relacionado
    // y son solamente de lectura.
    delete payload.departamento;
    delete payload.cargo;
    delete payload.correo;

    // El backend controla el estado automáticamente.
    delete payload.estado;

    // Fechas administradas por Django.
    delete payload.fecha_creacion;
    delete payload.fecha_actualizacion;

    // Sin usuario = anexo disponible.
    if (!payload.usuario) {
      payload.usuario = null;
    }

    if (payload.numero_anexo) {
      payload.numero_anexo =
        payload.numero_anexo.trim();
    }

    if (payload.exterior) {
      payload.exterior =
        payload.exterior.trim();
    }

    if (payload.observaciones) {
      payload.observaciones =
        payload.observaciones.trim();
    }
  }

  // Normalizar estados.
  // No se aplica a IPs ni Anexos.
  if (
    payload.estado &&
    tab !== 'ips' &&
    tab !== 'anexos'
  ) {
    payload.estado = payload.estado.toUpperCase();
  }

  // PCS GENERICOS
if (tab === 'pcs-genericos') {
  // Fechas administradas por Django
  delete payload.fecha_creacion;
  delete payload.fecha_actualizacion;

  if (payload.usuario_local) {
    payload.usuario_local =
      payload.usuario_local.trim();
  }

  if (payload.hostname) {
    payload.hostname =
      payload.hostname.trim();
  }

  if (payload.dpto_area) {
    payload.dpto_area =
      payload.dpto_area.trim();
  }

  if (payload.marca) {
    payload.marca =
      payload.marca.trim();
  }

  if (payload.modelo) {
    payload.modelo =
      payload.modelo.trim();
  }

  if (payload.numero_serie) {
    payload.numero_serie =
      payload.numero_serie.trim();
  }

  if (payload.activo_fijo) {
    payload.activo_fijo =
      payload.activo_fijo.trim();
  }

  if (payload.ram) {
    payload.ram =
      payload.ram.trim();
  }

  if (payload.almacenamiento) {
    payload.almacenamiento =
      payload.almacenamiento.trim();
  }

  if (payload.observaciones) {
    payload.observaciones =
      payload.observaciones.trim();
  }
}

  // IPS
  if (tab === 'ips') {
    const tieneAsignacion = Boolean(
      payload.usuario ||
      (
        payload.asignado_otro &&
        payload.asignado_otro.trim()
      )
    );

    // Solo automatizamos LIBRE y RESERVADA.
    // DUPLICADA y DESCONOCIDA se respetan.
    if (
      payload.estado === 'LIBRE' &&
      tieneAsignacion
    ) {
      payload.estado = 'RESERVADA';
    }

    if (
      payload.estado === 'RESERVADA' &&
      !tieneAsignacion
    ) {
      payload.estado = 'LIBRE';
    }
  }

  return payload;
};