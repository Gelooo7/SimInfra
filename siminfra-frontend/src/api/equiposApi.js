import apiClient from './client';

export const getEquipos = async (params = {}) => {
  const response = await apiClient.get('/equipos/', {
    params,
  });

  return response.data;
};