import { useState } from 'react';

export const useModuleFilters = () => {
  const [search, setSearch] = useState('');
  const [selectedDpto, setSelectedDpto] = useState('');
  const [selectedCategoriaEquipo, setSelectedCategoriaEquipo] = useState('');
  const [selectedEstadoIP, setSelectedEstadoIP] = useState('');

  const resetFilters = () => {
    setSearch('');
    setSelectedDpto('');
    setSelectedCategoriaEquipo('');
    setSelectedEstadoIP('');
  };

  return {
    search,
    setSearch,

    selectedDpto,
    setSelectedDpto,

    selectedCategoriaEquipo,
    setSelectedCategoriaEquipo,

    selectedEstadoIP,
    setSelectedEstadoIP,

    resetFilters,
  };
};