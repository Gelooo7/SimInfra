import { useState } from 'react';

import {
  Eye,
  EyeOff,
  Copy,
  Check,
  Edit,
  Trash2
} from 'lucide-react';

import './PerfilesTable.css';

export default function PerfilesTable({
  perfiles,
  visiblePasswords,
  setVisiblePasswords,
  renderAccountTypeBadge,
  onEdit,
  onDelete,
}) {
  const [copiedPasswords, setCopiedPasswords] =
    useState({});

  const togglePassword = (id) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const copyPassword = async (perfil) => {
    if (!perfil.password) return;

    try {
      await navigator.clipboard.writeText(
        perfil.password
      );

      setCopiedPasswords((prev) => ({
        ...prev,
        [perfil.id]: true,
      }));

      setTimeout(() => {
        setCopiedPasswords((prev) => ({
          ...prev,
          [perfil.id]: false,
        }));
      }, 1800);
    } catch (error) {
      console.error(
        'Error copiando contraseña:',
        error
      );
    }
  };

  if (!perfiles || perfiles.length === 0) {
    return (
      <div className="perfiles-empty">
        No existen perfiles para mostrar.
      </div>
    );
  }

  return (
    <div className="perfiles-table-wrapper">
      <table className="perfiles-table">
        <thead>
          <tr>
            <th className="perfil-col-nombre">
              Nombre / Perfil
            </th>

            <th className="perfil-col-usuario">
              Usuario
            </th>

            <th className="perfil-col-password">
              Contraseña
            </th>

            <th className="perfil-col-tipo">
              Tipo Cuenta
            </th>

            <th className="perfil-col-correo">
              Correo Asignado
            </th>

            <th className="perfil-col-area">
              Área
            </th>

            <th className="perfil-col-observaciones">
              Observaciones
            </th>

            <th className="perfiles-actions-header">
              Acciones
            </th>
          </tr>
        </thead>

        <tbody>
          {perfiles.map((perfil) => {
            const passwordVisible =
              Boolean(
                visiblePasswords?.[perfil.id]
              );

            const passwordCopied =
              Boolean(
                copiedPasswords?.[perfil.id]
              );

            return (
              <tr key={perfil.id}>
                {/* NOMBRE */}
                <td className="perfil-col-nombre perfil-nombre">
                  {perfil.nombre || 'N/I'}
                </td>

                {/* USUARIO */}
                <td className="perfil-col-usuario perfil-usuario">
                  {perfil.usuario || 'N/I'}
                </td>

                {/* CONTRASEÑA */}
                <td className="perfil-col-password">
                  {perfil.password ? (
                    <div className="perfil-password">
                      <span className="perfil-password-value">
                        {passwordVisible
                          ? perfil.password
                          : '••••••••'}
                      </span>

                      <button
                        type="button"
                        className="perfil-password-action"
                        onClick={() =>
                          togglePassword(
                            perfil.id
                          )
                        }
                        title={
                          passwordVisible
                            ? 'Ocultar contraseña'
                            : 'Mostrar contraseña'
                        }
                        aria-label={
                          passwordVisible
                            ? 'Ocultar contraseña'
                            : 'Mostrar contraseña'
                        }
                      >
                        {passwordVisible ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>

                      <button
                        type="button"
                        className={`perfil-password-action ${passwordCopied
                          ? 'is-copied'
                          : ''
                          }`}
                        onClick={() =>
                          copyPassword(perfil)
                        }
                        title="Copiar contraseña"
                        aria-label="Copiar contraseña"
                      >
                        {passwordCopied ? (
                          <Check size={16} />
                        ) : (
                          <Copy size={16} />
                        )}
                      </button>
                    </div>
                  ) : (
                    <span className="perfil-no-password">
                      Sin contraseña
                    </span>
                  )}
                </td>

                {/* TIPO */}
                <td className="perfil-col-tipo">
                  {renderAccountTypeBadge(
                    perfil.tipo
                  )}
                </td>

                {/* CORREO */}
                <td className="perfil-col-correo perfil-correo">
                  {perfil.correo || 'N/I'}
                </td>

                {/* ÁREA */}
                <td className="perfil-col-area">
                  {perfil.dpto_area || 'N/I'}
                </td>

                {/* OBSERVACIONES */}
                <td className="perfil-col-observaciones">
                  {perfil.observaciones || 'Sin observaciones'}
                </td>

                {/* ACCIONES */}
                <td className="perfiles-actions-cell">
                  <div className="perfiles-actions">
                    <button
                      type="button"
                      className="perfil-action perfil-action-edit"
                      onClick={() =>
                        onEdit(perfil)
                      }
                      title="Editar perfil"
                      aria-label="Editar perfil"
                    >
                      <Edit size={17} />
                    </button>

                    <button
                      type="button"
                      className="perfil-action perfil-action-delete"
                      onClick={() =>
                        onDelete(
                          perfil.id,
                          perfil.nombre ||
                          perfil.usuario
                        )
                      }
                      title="Eliminar perfil"
                      aria-label="Eliminar perfil"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}