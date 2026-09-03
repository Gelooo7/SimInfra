import apiClient from './client';

export const getIps = async (params = {}) => {
  const response = await apiClient.get('/ips/', {
    params,
  });

  return response.data;
};