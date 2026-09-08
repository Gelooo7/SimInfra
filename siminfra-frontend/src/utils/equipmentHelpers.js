export const buildEquipmentStateFromHostname = (
  hostnameValue,
  currentState,
  usuariosList = []
) => {
  const normalizedHostname = hostnameValue.trim().toLowerCase();

  const matchingUser = usuariosList.find(
    (usuario) =>
      usuario.hostname &&
      usuario.hostname.trim().toLowerCase() === normalizedHostname
  );

  if (matchingUser) {
    return {
      ...currentState,
      hostname: hostnameValue,
      usuario: matchingUser.id,
      estado: 'ASIGNADO',
    };
  }

  return {
    ...currentState,
    hostname: hostnameValue,
  };
};

export const filterEquiposByCategory = (
  data = [],
  selectedCategory,
  formatEquipmentType
) => {
  if (!selectedCategory) {
    return data;
  }

  const selectedType = formatEquipmentType(
    selectedCategory
  ).toLowerCase();

  return data.filter((item) => {
    const itemType = formatEquipmentType(
      item.tipo
    ).toLowerCase();

    return itemType === selectedType;
  });
};