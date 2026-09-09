export const validateItem = (tab, item, data = []) => {
  // IPS
  if (tab === 'ips') {
    if (
      !item.direccion_ip ||
      !/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(
        item.direccion_ip.trim()
      )
    ) {
      return {
        valid: false,
        message:
          'Por favor ingrese una dirección IP válida (ejemplo: 192.168.1.50).',
      };
    }

    const dupIP = data.find(
      (ip) =>
        ip.id !== item.id &&
        ip.direccion_ip?.trim() ===
          item.direccion_ip.trim()
    );

    if (dupIP) {
      return {
        valid: false,
        message: `Error: La dirección IP "${item.direccion_ip}" ya existe en el sistema.`,
      };
    }
  }

  // ANEXOS
  if (tab === 'anexos') {
    const numeroAnexo =
      (item.numero_anexo || '').trim();

    if (!numeroAnexo) {
      return {
        valid: false,
        message:
          'Debe ingresar un número de anexo.',
      };
    }

    if (!/^\d+$/.test(numeroAnexo)) {
      return {
        valid: false,
        message:
          'El número de anexo debe contener solo números.',
      };
    }

    if (numeroAnexo.length > 10) {
      return {
        valid: false,
        message:
          'El número de anexo puede tener como máximo 10 dígitos.',
      };
    }

    const dupAnexo = data.find(
      (anexo) =>
        anexo.id !== item.id &&
        anexo.numero_anexo?.trim() === numeroAnexo
    );

    if (dupAnexo) {
      return {
        valid: false,
        message:
          `Error: El anexo "${numeroAnexo}" ya existe en el sistema.`,
      };
    }

    if (item.usuario) {
      const dupUsuario = data.find(
        (anexo) =>
          anexo.id !== item.id &&
          Number(anexo.usuario) ===
            Number(item.usuario)
      );

      if (dupUsuario) {
        return {
          valid: false,
          message:
            `Error: Este usuario ya tiene asignado el anexo "${dupUsuario.numero_anexo}".`,
        };
      }
    }
  }

  // ACTIVO FIJO
  if (item.af) {
    if (
      item.af.length > 12 ||
      !/^\d+$/.test(item.af)
    ) {
      return {
        valid: false,
        message:
          'El Activo Fijo (AF) debe ser numérico y tener máximo 12 dígitos.',
      };
    }
  }

  // USUARIOS
  if (tab === 'usuarios') {
    const dupNombre = data.find(
      (usuario) =>
        usuario.id !== item.id &&
        usuario.nombre_completo
          ?.trim()
          .toLowerCase() ===
          (item.nombre_completo || '')
            .trim()
            .toLowerCase()
    );

    if (dupNombre) {
      return {
        valid: false,
        message:
          `Error: Ya existe un usuario llamado "${item.nombre_completo}".`,
      };
    }

    const dupRed = data.find(
      (usuario) =>
        usuario.id !== item.id &&
        usuario.usuario_red
          ?.trim()
          .toLowerCase() ===
          (item.usuario_red || '')
            .trim()
            .toLowerCase()
    );

    if (dupRed) {
      return {
        valid: false,
        message:
          `Error: El usuario de red "${item.usuario_red}" ya existe.`,
      };
    }
  }

  // EQUIPOS
  if (tab === 'equipos') {
    const dupSerie = data.find(
      (equipo) =>
        equipo.id !== item.id &&
        equipo.numero_serie
          ?.trim()
          .toLowerCase() ===
          (item.numero_serie || '')
            .trim()
            .toLowerCase()
    );

    if (dupSerie) {
      return {
        valid: false,
        message:
          `Error: El número de serie "${item.numero_serie}" ya está registrado.`,
      };
    }

    if (item.af) {
      const dupAF = data.find(
        (equipo) =>
          equipo.id !== item.id &&
          equipo.af === item.af
      );

      if (dupAF) {
        return {
          valid: false,
          message:
            `Error: El Activo Fijo (AF) "${item.af}" ya pertenece a otro equipo.`,
        };
      }
    }
  }

  return {
    valid: true,
    message: '',
  };
};