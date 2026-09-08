import { getUsuarios } from '../api/usuariosApi';
import { getEquipos } from '../api/equiposApi';
import { getPerfiles } from '../api/perfilesApi';
import { getIps } from '../api/ipsApi';

export const getItemsByTab = async (tab, params = {}) => {
  switch (tab) {
    case 'usuarios':
      return await getUsuarios(params);

    case 'equipos':
      return await getEquipos(params);

    case 'perfiles':
      return await getPerfiles(params);

    case 'ips':
      return await getIps(params);

    default:
      return [];
  }
};