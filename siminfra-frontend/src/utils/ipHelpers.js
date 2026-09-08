export const sanitizeIpInput = (value) => {
  return value.replace(/[^0-9.]/g, '');
};

export const getAvailableIpsForUser = (
  ipsList = [],
  currentIp
) => {
  return ipsList.filter(
    (ip) =>
      ip.estado === 'LIBRE' ||
      ip.direccion_ip === currentIp
  );
};