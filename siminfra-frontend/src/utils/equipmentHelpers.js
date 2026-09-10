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

  const peripheralTypes = [
    'monitor',
    'adaptador',
    'audífonos',
    'teclado',
    'mouse',
    'docking',
    'otro periférico',
  ];

  // Categoría agrupadora de periféricos
  if (selectedCategory === 'PERIFERICOS') {
    return data.filter((item) => {
      const itemType = formatEquipmentType(
        item.tipo
      ).toLowerCase();

      return peripheralTypes.includes(itemType);
    });
  }

  // Categorías normales
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