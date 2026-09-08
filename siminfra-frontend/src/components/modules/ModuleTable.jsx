import UsuariosTable from '../../features/usuarios/components/UsuariosTable';
import EquiposTable from '../../features/equipos/components/EquiposTable';
import PerfilesTable from '../../features/perfiles/components/PerfilesTable';
import IpsTable from '../../features/ips/components/IpsTable';

export default function ModuleTable({
  tab,
  data,
  formatEquipmentType,
  visibleProfilePasswords,
  setVisibleProfilePasswords,
  renderUsuarioStatusBadge,
  renderAccountTypeBadge,
  renderIpStatusBadge,
  onSelectUser,
  onShowUserHistory,
  onShowEquipmentHistory,
  onEdit,
  onDelete,
}) {
  if (tab === 'usuarios') {
    return (
      <UsuariosTable
        usuarios={data}
        onSelectUser={onSelectUser}
        onShowHistory={onShowUserHistory}
        onEdit={onEdit}
        onDelete={onDelete}
        renderStatusBadge={renderUsuarioStatusBadge}
      />
    );
  }

  if (tab === 'equipos') {
    return (
      <EquiposTable
        equipos={data}
        formatEquipmentType={formatEquipmentType}
        onShowHistory={onShowEquipmentHistory}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );
  }

  if (tab === 'perfiles') {
    return (
      <PerfilesTable
        perfiles={data}
        visiblePasswords={visibleProfilePasswords}
        setVisiblePasswords={setVisibleProfilePasswords}
        renderAccountTypeBadge={renderAccountTypeBadge}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );
  }

  if (tab === 'ips') {
    return (
      <IpsTable
        ips={data}
        renderIpStatusBadge={renderIpStatusBadge}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );
  }

  return null;
}