import { createItemByTab } from '../services/createItemService';
import { updateItemByTab } from '../services/updateItemService';
import { deleteItemByTab } from '../services/deleteItemService';

import { prepareCreatePayload } from '../utils/prepareCreatePayload';
import { prepareUpdatePayload } from '../utils/prepareUpdatePayload';
import { validateItem } from '../utils/validateItem';
import { formatEquipmentType } from '../utils/formatEquipmentType';

export const useModuleCrud = ({
  tab,
  data,
  newItem,
  editingItem,
  setNewItem,
  setEditingItem,
  refreshAllData,
}) => {
  const handleCreateSave = async (e) => {
    e.preventDefault();

    const validation = validateItem(
      tab,
      newItem,
      data
    );

    if (!validation.valid) {
      alert(validation.message);
      return;
    }

    try {
      const payload = prepareCreatePayload(
        tab,
        newItem
      );

      await createItemByTab(tab, payload);

      setNewItem(null);

      try {
        await refreshAllData();
      } catch (refreshError) {
        console.error(
          'Registro creado, pero ocurrió un error actualizando los datos:',
          refreshError
        );
      }
    } catch (error) {
      console.error(
        'Error al guardar:',
        error.response?.data || error
      );

      alert(
        'Error al guardar: ' +
          JSON.stringify(
            error.response?.data ||
              'Verifique los datos'
          )
      );
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const validation = validateItem(
      tab,
      editingItem,
      data
    );

    if (!validation.valid) {
      alert(validation.message);
      return;
    }

    try {
      const payload = prepareUpdatePayload(
        tab,
        editingItem,
        formatEquipmentType
      );

      await updateItemByTab(
        tab,
        editingItem.id,
        payload
      );

      setEditingItem(null);

      try {
        await refreshAllData();
      } catch (refreshError) {
        console.error(
          'Registro actualizado, pero ocurrió un error actualizando los datos:',
          refreshError
        );
      }
    } catch (error) {
      console.error(
        'Error guardando cambios:',
        error.response?.data || error
      );

      alert(
        'Error al guardar: ' +
          JSON.stringify(
            error.response?.data ||
              'Verifique los datos'
          )
      );
    }
  };

  const handleDelete = async (id, nombre) => {
    const confirmed = window.confirm(
      `¿Estás seguro de que deseas eliminar permanentemente "${nombre}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteItemByTab(tab, id);

      try {
        await refreshAllData();
      } catch (refreshError) {
        console.error(
          'Registro eliminado, pero ocurrió un error actualizando los datos:',
          refreshError
        );
      }
    } catch (error) {
      console.error(
        'Error al eliminar registro:',
        error.response?.data || error
      );

      alert(
        'Error al eliminar: ' +
          JSON.stringify(
            error.response?.data ||
              'No se pudo eliminar el registro'
          )
      );
    }
  };

  return {
    handleCreateSave,
    handleSave,
    handleDelete,
  };
};