import { createUsuario } from '../api/usuariosApi';
import { createEquipo } from '../api/equiposApi';
import { createPerfil } from '../api/perfilesApi';
import { createIp } from '../api/ipsApi';

export const createItemByTab = async (tab, payload) => {
  switch (tab) {
    case 'usuarios':
      return await createUsuario(payload);

    case 'equipos':
      return await createEquipo(payload);

    case 'perfiles':
      return await createPerfil(payload);

    case 'ips':
      return await createIp(payload);

    default:
      throw new Error(`Módulo de creación no soportado: ${tab}`);
  }
};