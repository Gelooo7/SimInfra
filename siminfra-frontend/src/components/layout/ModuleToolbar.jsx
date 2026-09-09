import {
  Filter,
  Plus
} from 'lucide-react';

export default function ModuleToolbar({
  activeTab,
  departments,
  selectedDepartment,
  onDepartmentChange,
  selectedEquipmentCategory,
  onEquipmentCategoryChange,
  selectedIpStatus,
  onIpStatusChange,
  selectedAnexoStatus,
  onAnexoStatusChange,
  search,
  onSearchChange,
  onCreate,
}) {
  const getCreateLabel = () => {
    switch (activeTab) {
      case 'usuarios':
        return 'Usuario';

      case 'equipos':
        return 'Equipo';

      case 'perfiles':
        return 'Perfil';

      case 'ips':
        return 'IP';

      case 'anexos':
        return 'Anexo';

      default:
        return 'Registro';
    }
  };

  const getSearchPlaceholder = () => {
    switch (activeTab) {
      case 'usuarios':
        return 'Buscar por nombre, usuario, correo, hostname...';

      case 'equipos':
        return 'Buscar por marca, modelo, serie, hostname, AF...';

      case 'perfiles':
        return 'Buscar por nombre, usuario o correo...';

      case 'ips':
        return 'Buscar por IP, usuario u observación...';

      case 'anexos':
        return 'Buscar por anexo, usuario, departamento, cargo...';

      default:
        return 'Buscar...';
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem',
        gap: '1rem',
        width: '100%',
        flexWrap: 'wrap'
      }}
    >
      <div />

      <div
        style={{
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}
      >
        {/* Botón agregar */}
        <button
          type="button"
          onClick={onCreate}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.65rem 1.2rem',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: '#16a34a',
            color: '#fff',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          <Plus size={18} />
          Agregar {getCreateLabel()}
        </button>

        {/* Filtro Departamento */}
        {(activeTab === 'usuarios' ||
          activeTab === 'perfiles') && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: '#fff',
              border: '1px solid #cbd5e1',
              padding: '0.4rem 0.8rem',
              borderRadius: '8px'
            }}
          >
            <Filter
              size={16}
              color="#64748b"
            />

            <select
              value={selectedDepartment}
              onChange={(e) =>
                onDepartmentChange(e.target.value)
              }
              style={{
                border: 'none',
                outline: 'none',
                backgroundColor: 'transparent',
                fontSize: '0.85rem',
                color: '#334155',
                cursor: 'pointer'
              }}
            >
              <option value="">
                Todos los Departamentos
              </option>

              {departments.map((department, index) => (
                <option
                  key={index}
                  value={department}
                >
                  {department}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Filtro Equipos */}
        {activeTab === 'equipos' && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: '#fff',
              border: '1px solid #cbd5e1',
              padding: '0.4rem 0.8rem',
              borderRadius: '8px'
            }}
          >
            <Filter
              size={16}
              color="#64748b"
            />

            <select
              value={selectedEquipmentCategory}
              onChange={(e) =>
                onEquipmentCategoryChange(e.target.value)
              }
              style={{
                border: 'none',
                outline: 'none',
                backgroundColor: 'transparent',
                fontSize: '0.85rem',
                color: '#334155',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              <option value="">
                Todas las Categorías
              </option>

              <option value="Notebook">
                Notebook
              </option>

              <option value="Celular">
                Celular
              </option>

              <option value="Tablet">
                Tablet
              </option>

              <option value="Mac">
                Mac
              </option>

              <option value="BAM / Router">
                BAM / Router
              </option>
            </select>
          </div>
        )}

        {/* Filtro IP */}
        {activeTab === 'ips' && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: '#fff',
              border: '1px solid #cbd5e1',
              padding: '0.4rem 0.8rem',
              borderRadius: '8px'
            }}
          >
            <Filter
              size={16}
              color="#64748b"
            />

            <select
              value={selectedIpStatus}
              onChange={(e) =>
                onIpStatusChange(e.target.value)
              }
              style={{
                border: 'none',
                outline: 'none',
                backgroundColor: 'transparent',
                fontSize: '0.85rem',
                color: '#334155',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              <option value="">
                Todos los Estados
              </option>

              <option value="LIBRE">
                🟢 Libre
              </option>

              <option value="RESERVADA">
                🔴 Reservada
              </option>

              <option value="DUPLICADA">
                🔵 Duplicada
              </option>

              <option value="DESCONOCIDA">
                🟡 Desconocida
              </option>
            </select>
          </div>
        )}

        {/* Filtro Anexos */}
        {activeTab === 'anexos' && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: '#fff',
              border: '1px solid #cbd5e1',
              padding: '0.4rem 0.8rem',
              borderRadius: '8px'
            }}
          >
            <Filter
              size={16}
              color="#64748b"
            />

            <select
              value={selectedAnexoStatus}
              onChange={(e) =>
                onAnexoStatusChange(e.target.value)
              }
              style={{
                border: 'none',
                outline: 'none',
                backgroundColor: 'transparent',
                fontSize: '0.85rem',
                color: '#334155',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              <option value="">
                Todos los Estados
              </option>

              <option value="DISPONIBLE">
                🟢 Disponible
              </option>

              <option value="ASIGNADO">
                🔵 Asignado
              </option>
            </select>
          </div>
        )}

        {/* Buscador */}
        <div
          style={{
            position: 'relative',
            width: '300px'
          }}
        >
          <input
            type="text"
            placeholder={getSearchPlaceholder()}
            value={search}
            onChange={(e) =>
              onSearchChange(e.target.value)
            }
            style={{
              width: '100%',
              padding: '0.7rem 1rem',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>
      </div>
    </div>
  );
}