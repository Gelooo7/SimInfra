import {
  Edit,
  Trash2,
  History
} from 'lucide-react';

import './UsuariosTable.css';

export default function UsuariosTable({
  usuarios,
  onSelectUser,
  onShowHistory,
  onEdit,
  onDelete,
  renderStatusBadge,
}) {
  const Actions = ({ usuario }) => (
    <div className="usuarios-actions">
      <button
        type="button"
        className="usuario-action usuario-action-history"
        onClick={(e) => {
          e.stopPropagation();
          onShowHistory(usuario);
        }}
        title="Ver Historial de Modificaciones"
        aria-label="Ver historial"
      >
        <History size={18} />
      </button>

      <button
        type="button"
        className="usuario-action usuario-action-edit"
        onClick={(e) => {
          e.stopPropagation();
          onEdit(usuario);
        }}
        title="Editar"
        aria-label="Editar usuario"
      >
        <Edit size={18} />
      </button>

      <button
        type="button"
        className="usuario-action usuario-action-delete"
        onClick={(e) => {
          e.stopPropagation();

          onDelete(
            usuario.id,
            usuario.nombre_completo
          );
        }}
        title="Eliminar"
        aria-label="Eliminar usuario"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );

  if (usuarios.length === 0) {
    return (
      <div className="usuarios-empty">
        No existen usuarios para mostrar.
      </div>
    );
  }

  return (
    <div className="usuarios-table-desktop">
      <table className="usuarios-table">
        <thead>
          <tr>
            <th>Nombre Completo</th>
            <th>Cargo</th>
            <th>Estado</th>
            <th>Usuario Red</th>
            <th>Hostname</th>
            <th>Correo Corp.</th>
            <th className="usuario-col-celular">
              Celular
            </th>

            <th className="usuarios-actions-header">
              Acciones
            </th>
          </tr>
        </thead>

        <tbody>
          {usuarios.map((usuario) => (
            <tr
              key={usuario.id}
              onClick={() => onSelectUser(usuario)}
            >
              <td className="usuario-name">
                {usuario.nombre_completo || 'N/I'}
              </td>

              <td className="usuario-secondary">
                {usuario.cargo || 'N/I'}
              </td>

              <td>
                {renderStatusBadge(usuario.estado)}
              </td>

              <td className="usuario-red">
                {usuario.usuario_red || 'N/I'}
              </td>

              <td className="usuario-hostname">
                {usuario.hostname || 'N/I'}
              </td>

              <td className="usuario-correo">
                {usuario.correo_corp || 'N/I'}
              </td>

              <td className="usuario-col-celular">
                {usuario.celular || 'N/I'}
              </td>

              <td className="usuarios-actions-cell">
                <Actions usuario={usuario} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}