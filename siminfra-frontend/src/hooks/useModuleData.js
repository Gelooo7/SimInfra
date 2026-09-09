import { useCallback, useEffect, useState } from 'react';
import { getItemsByTab } from '../services/getItemService';

export const useModuleData = ({
  token,
  tab,
  search,
  selectedDpto,
  selectedEstadoIP,
  selectedEstadoAnexo,
  onUnauthorized,
}) => {
  const [data, setData] = useState([]);

  const refreshData = useCallback(async () => {
    if (!token) {
      setData([]);
      return;
    }

    try {
      const params = {};

      if (search) {
        params.search = search;
      }

      if (
        selectedDpto &&
        (tab === 'usuarios' || tab === 'perfiles')
      ) {
        params.dpto_area = selectedDpto;
      }

      if (
        selectedEstadoIP &&
        tab === 'ips'
      ) {
        params.estado = selectedEstadoIP;
      }

      if (
        selectedEstadoAnexo &&
        tab === 'anexos'
      ) {
        params.estado = selectedEstadoAnexo;
      }

      const result = await getItemsByTab(
        tab,
        params
      );

      setData(result);

    } catch (error) {
      if (error.response?.status === 401) {
        onUnauthorized?.();
        return;
      }

      console.error(
        'Error cargando datos:',
        error.response?.data || error
      );
    }
  }, [
    token,
    tab,
    search,
    selectedDpto,
    selectedEstadoIP,
    selectedEstadoAnexo,
    onUnauthorized,
  ]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  return {
    data,
    refreshData,
  };
};