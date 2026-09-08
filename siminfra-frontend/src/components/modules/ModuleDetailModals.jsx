import UsuarioDetailModal from '../../features/usuarios/components/UsuarioDetailModal';
import UsuarioHistoryModal from '../../features/usuarios/components/UsuarioHistoryModal';
import EquipoHistoryModal from '../../features/equipos/components/EquipoHistoryModal';

export default function ModuleDetailModals({
  selectedUser,
  historyUsuario,
  historyEquipo,
  onCloseUser,
  onCloseUserHistory,
  onCloseEquipmentHistory,
  renderUsuarioStatusBadge,
  formatEquipmentType,
}) {
  return (
    <>
      <UsuarioDetailModal
        usuario={selectedUser}
        onClose={onCloseUser}
        renderStatusBadge={renderUsuarioStatusBadge}
        formatEquipmentType={formatEquipmentType}
      />

      <UsuarioHistoryModal
        usuario={historyUsuario}
        onClose={onCloseUserHistory}
      />

      <EquipoHistoryModal
        equipo={historyEquipo}
        onClose={onCloseEquipmentHistory}
      />
    </>
  );
}