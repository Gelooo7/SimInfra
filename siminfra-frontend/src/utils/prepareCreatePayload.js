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
  return payload;
};