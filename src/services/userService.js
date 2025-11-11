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
};

export default userService;
