import apiClient from './client';

export const getPerfiles = async (params = {}) => {
  const response = await apiClient.get('/perfiles-genericos/', {
    params,
  });

  return response.data;
};