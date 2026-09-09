import { updateUsuario } from '../api/usuariosApi';
import { updateEquipo } from '../api/equiposApi';
import { updatePerfil } from '../api/perfilesApi';
import { updateIp } from '../api/ipsApi';
import { updateAnexo } from '../api/anexosApi';

export const updateItemByTab = async (tab, id, payload) => {
  switch (tab) {
    case 'usuarios':
      return await updateUsuario(id, payload);

    case 'equipos':
      return await updateEquipo(id, payload);

    case 'perfiles':
      return await updatePerfil(id, payload);

    case 'ips':
      return await updateIp(id, payload);

    case 'anexos':
      return await updateAnexo(id, payload);
    default:
      throw new Error(`Módulo de edición no soportado: ${tab}`);
  }
};