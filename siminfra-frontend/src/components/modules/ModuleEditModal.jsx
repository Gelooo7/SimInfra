import EditModal from '../common/EditModal';

import UsuarioEditForm from '../../features/usuarios/components/UsuarioEditForm';
import EquipoEditForm from '../../features/equipos/components/EquipoEditForm';
import PerfilEditForm from '../../features/perfiles/components/PerfilEditForm';
import IpEditForm from '../../features/ips/components/IpEditForm';

const getEditTitle = (tab) => {
  switch (tab) {
    case 'usuarios':
      return 'Editar Usuario';

    case 'equipos':
      return 'Editar Equipo';

    case 'perfiles':
      return 'Editar Perfil Genérico';

    case 'ips':
      return 'Editar Dirección IP';

    default:
      return 'Editar Registro';
  }
};

export default function ModuleEditModal({
  tab,
  editingItem,
  setEditingItem,
  onSubmit,
  onClose,
  departments,
  usuarios,
  availableIps,
  formatEquipmentType,
  onHostnameChange,
  onIpChange,
}) {
  if (!editingItem) return null;

  return (
    <EditModal
      title={getEditTitle(tab)}
      onClose={onClose}
      onSubmit={onSubmit}
    >
      {tab === 'usuarios' && (
        <UsuarioEditForm
          usuario={editingItem}
          onChange={setEditingItem}
          departments={departments}
          availableIps={availableIps}
        />
      )}

      {tab === 'equipos' && (
        <EquipoEditForm
          equipo={editingItem}
          onChange={setEditingItem}
          usuarios={usuarios}
          formatEquipmentType={formatEquipmentType}
          onHostnameChange={onHostnameChange}
        />
      )}

      {tab === 'perfiles' && (
        <PerfilEditForm
          perfil={editingItem}
          onChange={setEditingItem}
          departments={departments}
        />
      )}

      {tab === 'ips' && (
        <IpEditForm
          ip={editingItem}
          onChange={setEditingItem}
          usuarios={usuarios}
          onIpChange={onIpChange}
        />
      )}
    </EditModal>
  );
}