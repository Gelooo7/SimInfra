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
  if (tab === 'ips') {
    if (payload.usuario || payload.asignado_otro) {
      payload.estado = 'RESERVADA';
    }
  }

  return payload;
};