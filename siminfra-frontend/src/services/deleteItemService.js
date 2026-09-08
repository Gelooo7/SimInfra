import { deleteUsuario } from '../api/usuariosApi';
import { deleteEquipo } from '../api/equiposApi';
import { deletePerfil } from '../api/perfilesApi';
import { deleteIp } from '../api/ipsApi';

export const deleteItemByTab = async (tab, id) => {
  switch (tab) {
    case 'usuarios':
      return await deleteUsuario(id);

    case 'equipos':
      return await deleteEquipo(id);

    case 'perfiles':
      return await deletePerfil(id);

    case 'ips':
      return await deleteIp(id);

    default:
      throw new Error(`Módulo de eliminación no soportado: ${tab}`);
  }
};