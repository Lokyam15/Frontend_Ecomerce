import api from '../config/api';

/**
 * Servicio para gestión de grupos (roles) con permisos
 */
const groupService = {
  /**
   * Obtener todos los grupos
   * @returns {Promise} Lista de grupos con permisos
   */
  getAllGroups: async () => {
    try {
      const response = await api.get('/auth/groups/');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo grupos:', error);
      throw error;
    }
  },

  /**
   * Obtener un grupo por ID
   * @param {number} id - ID del grupo
   * @returns {Promise} Datos del grupo
   */
  getGroupById: async (id) => {
    try {
      const response = await api.get(`/auth/groups/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo grupo:', error);
      throw error;
    }
  },

  /**
   * Crear un nuevo grupo con permisos
   * @param {Object} groupData - {name: string, permission_ids: array}
   * @returns {Promise} Grupo creado
   */
  createGroup: async (groupData) => {
    try {
      const response = await api.post('/auth/groups/', groupData);
      return response.data;
    } catch (error) {
      console.error('Error creando grupo:', error);
      throw error;
    }
  },

  /**
   * Actualizar un grupo
   * @param {number} id - ID del grupo
   * @param {Object} groupData - {name: string, permission_ids: array}
   * @returns {Promise} Grupo actualizado
   */
  updateGroup: async (id, groupData) => {
    try {
      const response = await api.put(`/auth/groups/${id}/`, groupData);
      return response.data;
    } catch (error) {
      console.error('Error actualizando grupo:', error);
      throw error;
    }
  },

  /**
   * Eliminar un grupo
   * @param {number} id - ID del grupo
   * @returns {Promise}
   */
  deleteGroup: async (id) => {
    try {
      await api.delete(`/auth/groups/${id}/`);
    } catch (error) {
      console.error('Error eliminando grupo:', error);
      throw error;
    }
  },

  /**
   * Obtener usuarios de un grupo
   * @param {number} groupId - ID del grupo
   * @returns {Promise} Lista de usuarios
   */
  getGroupUsers: async (groupId) => {
    try {
      const response = await api.get(`/auth/groups/${groupId}/users/`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo usuarios del grupo:', error);
      throw error;
    }
  },

  /**
   * Obtener todos los permisos disponibles
   * @returns {Promise} Lista de permisos
   */
  getAllPermissions: async () => {
    try {
      const response = await api.get('/auth/permissions/');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo permisos:', error);
      throw error;
    }
  },

  /**
   * Agregar un permiso a un grupo
   * @param {number} groupId - ID del grupo
   * @param {number} permissionId - ID del permiso
   * @returns {Promise} Grupo actualizado
   */
  addPermissionToGroup: async (groupId, permissionId) => {
    try {
      const response = await api.post(`/auth/groups/${groupId}/add_permission/`, {
        permission_id: permissionId
      });
      return response.data;
    } catch (error) {
      console.error('Error agregando permiso:', error);
      throw error;
    }
  },

  /**
   * Remover un permiso de un grupo
   * @param {number} groupId - ID del grupo
   * @param {number} permissionId - ID del permiso
   * @returns {Promise} Grupo actualizado
   */
  removePermissionFromGroup: async (groupId, permissionId) => {
    try {
      const response = await api.post(`/auth/groups/${groupId}/remove_permission/`, {
        permission_id: permissionId
      });
      return response.data;
    } catch (error) {
      console.error('Error removiendo permiso:', error);
      throw error;
    }
  }
};

export default groupService;
