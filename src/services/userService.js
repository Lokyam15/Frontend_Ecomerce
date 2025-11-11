import api from '../config/api';

/**
 * Servicio para gestionar usuarios y personas
 */
const userService = {
  /**
   * Obtener todas las personas
   * @param {Object} params - Parámetros de filtrado (tipo, estado)
   * @returns {Promise}
   */
  getAllPersonas: async (params = {}) => {
    try {
      const response = await api.get('/people/personas/', { params });
      return response.data;
    } catch (error) {
      console.error('Error obteniendo personas:', error);
      throw error;
    }
  },

  /**
   * Obtener una persona por ID
   * @param {number} id - ID de la persona
   * @returns {Promise}
   */
  getPersonaById: async (id) => {
    try {
      const response = await api.get(`/people/personas/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo persona:', error);
      throw error;
    }
  },

  /**
   * Crear una nueva persona
   * @param {Object} personaData - Datos de la persona
   * @returns {Promise}
   */
  createPersona: async (personaData) => {
    try {
      const response = await api.post('/people/personas/', personaData);
      return response.data;
    } catch (error) {
      console.error('Error creando persona:', error);
      throw error;
    }
  },

  /**
   * Actualizar una persona existente
   * @param {number} id - ID de la persona
   * @param {Object} personaData - Datos actualizados
   * @returns {Promise}
   */
  updatePersona: async (id, personaData) => {
    try {
      const response = await api.put(`/people/personas/${id}/`, personaData);
      return response.data;
    } catch (error) {
      console.error('Error actualizando persona:', error);
      throw error;
    }
  },

  /**
   * Actualizar parcialmente una persona
   * @param {number} id - ID de la persona
   * @param {Object} personaData - Datos parciales a actualizar
   * @returns {Promise}
   */
  patchPersona: async (id, personaData) => {
    try {
      const response = await api.patch(`/people/personas/${id}/`, personaData);
      return response.data;
    } catch (error) {
      console.error('Error actualizando persona:', error);
      throw error;
    }
  },

  /**
   * Eliminar una persona
   * @param {number} id - ID de la persona
   * @returns {Promise}
   */
  deletePersona: async (id) => {
    try {
      const response = await api.delete(`/people/personas/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error eliminando persona:', error);
      throw error;
    }
  },

  /**
   * Obtener direcciones de una persona
   * @param {Object} params - Parámetros de filtrado
   * @returns {Promise}
   */
  getAddresses: async (params = {}) => {
    try {
      const response = await api.get('/people/direcciones/', { params });
      return response.data;
    } catch (error) {
      console.error('Error obteniendo direcciones:', error);
      throw error;
    }
  },

  /**
   * Crear una nueva dirección
   * @param {Object} addressData - Datos de la dirección
   * @returns {Promise}
   */
  createAddress: async (addressData) => {
    try {
      const response = await api.post('/people/direcciones/', addressData);
      return response.data;
    } catch (error) {
      console.error('Error creando dirección:', error);
      throw error;
    }
  },

  /**
   * Actualizar una dirección
   * @param {number} id - ID de la dirección
   * @param {Object} addressData - Datos actualizados
   * @returns {Promise}
   */
  updateAddress: async (id, addressData) => {
    try {
      const response = await api.put(`/people/direcciones/${id}/`, addressData);
      return response.data;
    } catch (error) {
      console.error('Error actualizando dirección:', error);
      throw error;
    }
  },

  /**
   * Eliminar una dirección
   * @param {number} id - ID de la dirección
   * @returns {Promise}
   */
  deleteAddress: async (id) => {
    try {
      const response = await api.delete(`/people/direcciones/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error eliminando dirección:', error);
      throw error;
    }
  },

  // ==================== GESTIÓN DE USUARIOS DE AUTENTICACIÓN ====================
  
  /**
   * Obtener todos los usuarios del sistema
   * @param {Object} params - Parámetros de filtrado (role, is_active, search)
   * @returns {Promise}
   */
  getAllUsers: async (params = {}) => {
    try {
      const response = await api.get('/auth/users/', { params });
      return response.data;
    } catch (error) {
      console.error('Error obteniendo usuarios:', error);
      throw error;
    }
  },

  /**
   * Obtener un usuario por ID
   * @param {number} id - ID del usuario
   * @returns {Promise}
   */
  getUserById: async (id) => {
    try {
      const response = await api.get(`/auth/users/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo usuario:', error);
      throw error;
    }
  },

  /**
   * Crear un nuevo usuario
   * @param {Object} userData - Datos del usuario (username, email, password, first_name, last_name, is_staff, is_superuser, persona)
   * @returns {Promise}
   */
  createUser: async (userData) => {
    try {
      const response = await api.post('/auth/users/', userData);
      return response.data;
    } catch (error) {
      console.error('Error creando usuario:', error);
      throw error;
    }
  },

  /**
   * Actualizar un usuario existente
   * @param {number} id - ID del usuario
   * @param {Object} userData - Datos actualizados del usuario
   * @returns {Promise}
   */
  updateUser: async (id, userData) => {
    try {
      const response = await api.put(`/auth/users/${id}/`, userData);
      return response.data;
    } catch (error) {
      console.error('Error actualizando usuario:', error);
      throw error;
    }
  },

  /**
   * Actualizar parcialmente un usuario
   * @param {number} id - ID del usuario
   * @param {Object} userData - Datos parciales a actualizar
   * @returns {Promise}
   */
  patchUser: async (id, userData) => {
    try {
      const response = await api.patch(`/auth/users/${id}/`, userData);
      return response.data;
    } catch (error) {
      console.error('Error actualizando usuario:', error);
      throw error;
    }
  },

  /**
   * Eliminar un usuario
   * @param {number} id - ID del usuario
   * @returns {Promise}
   */
  deleteUser: async (id) => {
    try {
      const response = await api.delete(`/auth/users/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error eliminando usuario:', error);
      throw error;
    }
  },
};

export default userService;