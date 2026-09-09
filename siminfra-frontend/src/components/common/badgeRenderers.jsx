const baseBadgeStyle = {
  padding: '0.3rem 0.75rem',
  borderRadius: '12px',
  fontSize: '0.75rem',
  fontWeight: 'bold',
  whiteSpace: 'nowrap',
  display: 'inline-block',
};

export const renderUsuarioStatusBadge = (estado) => {
  switch (estado) {
    case 'LICENCIA':
      return (
        <span
          style={{
            ...baseBadgeStyle,
            backgroundColor: '#fef3c7',
            color: '#b45309',
          }}
        >
          Licencia Médica
        </span>
      );

    case 'BAJA':
      return (
        <span
          style={{
            ...baseBadgeStyle,
            backgroundColor: '#fee2e2',
            color: '#b91c1c',
          }}
        >
          Dar de Baja
        </span>
      );

    default:
      return (
        <span
          style={{
            ...baseBadgeStyle,
            backgroundColor: '#dcfce7',
            color: '#15803d',
          }}
        >
          Activo
        </span>
      );
  }
};

export const renderAccountTypeBadge = (tipo) => {
  if (tipo === 'O365') {
    return (
      <span
        style={{
          ...baseBadgeStyle,
          backgroundColor: '#dbeafe',
          color: '#1d4ed8',
        }}
      >
        O365
      </span>
    );
  }

  return (
    <span
      style={{
        ...baseBadgeStyle,
        backgroundColor: '#f1f5f9',
        color: '#475569',
        border: '1px solid #cbd5e1',
      }}
    >
      On Premise
    </span>
  );
};

export const renderIpStatusBadge = (estado) => {
  switch (estado) {
    case 'LIBRE':
      return (
        <span
          style={{
            ...baseBadgeStyle,
            backgroundColor: '#dcfce7',
            color: '#15803d',
          }}
        >
          🟢 Libre
        </span>
      );

    case 'RESERVADA':
      return (
        <span
          style={{
            ...baseBadgeStyle,
            backgroundColor: '#fee2e2',
            color: '#b91c1c',
          }}
        >
          🔴 Reservada
        </span>
      );

    case 'DUPLICADA':
      return (
        <span
          style={{
            ...baseBadgeStyle,
            backgroundColor: '#dbeafe',
            color: '#1d4ed8',
          }}
        >
          🔵 Duplicada
        </span>
      );

    case 'DESCONOCIDA':
      return (
        <span
          style={{
            ...baseBadgeStyle,
            backgroundColor: '#fef3c7',
            color: '#b45309',
          }}
        >
          🟡 Desconocida
        </span>
      );

    default:
      return (
        <span
          style={{
            ...baseBadgeStyle,
            backgroundColor: '#f1f5f9',
            color: '#475569',
          }}
        >
          ⚪ Asignada
        </span>
      );
  }
};
export const renderAnexoStatusBadge = (estado) => {
  switch (estado) {
    case 'DISPONIBLE':
      return (
        <span
          style={{
            ...baseBadgeStyle,
            backgroundColor: '#dcfce7',
            color: '#15803d',
          }}
        >
          🟢 Disponible
        </span>
      );

    case 'ASIGNADO':
      return (
        <span
          style={{
            ...baseBadgeStyle,
            backgroundColor: '#ffc1c1',
            color: '#d81d1d',
          }}
        >
          🔴 Asignado
        </span>
      );

    default:
      return (
        <span
          style={{
            ...baseBadgeStyle,
            backgroundColor: '#f1f5f9',
            color: '#475569',
          }}
        >
          ⚪ Sin estado
        </span>
      );
  }
};