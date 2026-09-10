import { useState } from 'react';

import {
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Copy,
  Check
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
  const [copiedPasswords, setCopiedPasswords] = useState({});

  const togglePassword = (id) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [id]: !prev[id]
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
        [perfil.id]: true
      }));

      setTimeout(() => {
        setCopiedPasswords((prev) => ({
          ...prev,
          [perfil.id]: false
        }));
      }, 2000);
    } catch (error) {
      console.error(
        'Error copiando contraseña:',
        error
      );
    }
  };

  const PasswordField = ({ perfil }) => {
    if (!perfil.password) {
      return (
        <span className="perfil-password-empty">
          Sin contraseña
        </span>
      );
    }

    const visible =
      !!visiblePasswords[perfil.id];

    const copied =
      !!copiedPasswords[perfil.id];

    return (
      <div className="perfil-password-container">
        <span className="perfil-password-value">
          {visible
            ? perfil.password
            : '••••••••'}
        </span>

        {/* MOSTRAR / OCULTAR */}
        <button
          type="button"
          className="perfil-password-button"
          onClick={() =>
            togglePassword(perfil.id)
          }
          title={
            visible
              ? 'Ocultar contraseña'
              : 'Mostrar contraseña'
          }
          aria-label={
            visible
              ? 'Ocultar contraseña'
              : 'Mostrar contraseña'
          }
        >
          {visible ? (
            <EyeOff size={16} />
          ) : (
            <Eye size={16} />
          )}
        </button>

        {/* COPIAR */}
        <button
          type="button"
          className={`perfil-password-button ${
            copied
              ? 'perfil-password-copied'
              : ''
          }`}
          onClick={() =>
            copyPassword(perfil)
          }
          title="Copiar contraseña"
          aria-label="Copiar contraseña"
        >
          {copied ? (
            <Check size={16} />
          ) : (
            <Copy size={16} />
          )}
        </button>
      </div>
    );
  };

  const Actions = ({ perfil }) => (
    <div className="perfiles-actions">
      <button
        type="button"
        className="perfil-action perfil-action-edit"
        onClick={() =>
          onEdit(perfil)
        }
        title="Editar"
        aria-label="Editar perfil"
      >
        <Edit size={18} />
      </button>

      <button
        type="button"
        className="perfil-action perfil-action-delete"
        onClick={() =>
          onDelete(
            perfil.id,
            perfil.usuario
          )
        }
        title="Eliminar"
        aria-label="Eliminar perfil"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );

  return (
    <>
      {/* TABLA DESKTOP */}
      <div className="perfiles-table-desktop">
        <table className="perfiles-table">
          <thead>
            <tr>
              <th>Nombre / Perfil</th>
              <th>Usuario</th>
              <th>Contraseña</th>
              <th>Tipo Cuenta</th>
              <th>Correo Asignado</th>
              <th>Área</th>

              <th className="perfiles-actions-header">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody>
            {perfiles.map((perfil) => (
              <tr key={perfil.id}>
                <td className="perfil-name">
                  {perfil.nombre || 'N/I'}
                </td>

                <td className="perfil-user">
                  {perfil.usuario || 'N/I'}
                </td>

                <td>
                  <PasswordField
                    perfil={perfil}
                  />
                </td>

                <td>
                  {renderAccountTypeBadge(
                    perfil.tipo
                  )}
                </td>

                <td>
                  {perfil.correo || 'N/I'}
                </td>

                <td>
                  {perfil.dpto_area || 'N/I'}
                </td>

                <td className="perfiles-actions-cell">
                  <Actions perfil={perfil} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* TARJETAS MÓVIL */}
      <div className="perfiles-cards-mobile">
        {perfiles.map((perfil) => (
          <article
            key={perfil.id}
            className="perfil-card"
          >
            <div className="perfil-card-header">
              <div className="perfil-card-title">
                <span className="perfil-card-icon">
                  📧
                </span>

                <div>
                  <h3>
                    {perfil.nombre ||
                      'Perfil sin nombre'}
                  </h3>

                  <span className="perfil-card-user">
                    {perfil.usuario ||
                      'Usuario no informado'}
                  </span>
                </div>
              </div>

              <div className="perfil-card-type">
                {renderAccountTypeBadge(
                  perfil.tipo
                )}
              </div>
            </div>

            <div className="perfil-card-password">
              <span className="perfil-mobile-label">
                Contraseña
              </span>

              <PasswordField
                perfil={perfil}
              />
            </div>

            <div className="perfil-card-grid">
              <MobileField
                label="Correo Asignado"
                value={
                  perfil.correo || 'N/I'
                }
                full
              />

              <MobileField
                label="Departamento / Área"
                value={
                  perfil.dpto_area || 'N/I'
                }
                full
              />
            </div>

            <div className="perfil-card-footer">
              <span className="perfil-card-info">
                Gestión de perfil
              </span>

              <Actions perfil={perfil} />
            </div>
          </article>
        ))}
      </div>

      {perfiles.length === 0 && (
        <div className="perfiles-empty">
          No existen perfiles para mostrar.
        </div>
      )}
    </>
  );
}

function MobileField({
  label,
  value,
  full = false,
}) {
  return (
    <div
      className={`perfil-mobile-field ${
        full
          ? 'perfil-mobile-field-full'
          : ''
      }`}
    >
      <span className="perfil-mobile-label">
        {label}
      </span>

      <span className="perfil-mobile-value">
        {value}
      </span>
    </div>
  );
}