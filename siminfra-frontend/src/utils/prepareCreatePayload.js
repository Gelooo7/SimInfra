export const prepareCreatePayload = (tab, item) => {
  const payload = { ...item };

  // Convertir strings vacíos en null
  Object.keys(payload).forEach((key) => {
    if (payload[key] === '') {
      payload[key] = null;
    }
  });

  // Si una IP tiene usuario u otra asignación,
  // automáticamente queda reservada
// IPS
if (tab === 'ips') {
  const tieneAsignacion =
    payload.usuario ||
    (payload.asignado_otro && payload.asignado_otro.trim());

  // Si tiene asignación y está marcada como LIBRE,
  // automáticamente pasa a RESERVADA.
  if (tieneAsignacion && payload.estado === 'LIBRE') {
    payload.estado = 'RESERVADA';
  }

  // Si se elimina la asignación y estaba RESERVADA,
  // automáticamente vuelve a LIBRE.
  if (!tieneAsignacion && payload.estado === 'RESERVADA') {
    payload.estado = 'LIBRE';
  }
}

  // ANEXOS
  if (tab === 'anexos') {
    // El estado es administrado automáticamente
    // por el backend según tenga o no usuario.
    delete payload.estado;

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

  // PCS GENERICOS
if (tab === 'pcs-genericos') {
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
  return payload;
};