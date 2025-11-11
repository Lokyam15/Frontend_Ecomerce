import api from '../config/api';

/**
 * Servicio para gestionar categorías
 */
const categoryService = {
  /**
   * Obtener todas las categorías
   * @param {Object} params - Parámetros de filtrado y paginación
   * @returns {Promise}
   */
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/catalog/categorias/', { params });
      return response.data;
    } catch (error) {
      console.error('Error obteniendo categorías:', error);
      throw error;
    }
  },

  /**
   * Obtener una categoría por ID
   * @param {number} id - ID de la categoría
   * @returns {Promise}
   */
  getById: async (id) => {
    try {
      const response = await api.get(`/catalog/categorias/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo categoría:', error);
      throw error;
    }
  },

  /**
   * Crear una nueva categoría
   * @param {Object} categoryData - Datos de la categoría
   * @returns {Promise}
   */
  create: async (categoryData) => {
    try {
      const response = await api.post('/catalog/categorias/', categoryData);
      return response.data;
    } catch (error) {
      console.error('Error creando categoría:', error);
      throw error;
    }
  },

  /**
   * Actualizar una categoría existente
   * @param {number} id - ID de la categoría
   * @param {Object} categoryData - Datos actualizados de la categoría
   * @returns {Promise}
   */
  update: async (id, categoryData) => {
    try {
      const response = await api.put(`/catalog/categorias/${id}/`, categoryData);
      return response.data;
    } catch (error) {
      console.error('Error actualizando categoría:', error);
      throw error;
    }
  },

  /**
   * Actualizar parcialmente una categoría
   * @param {number} id - ID de la categoría
   * @param {Object} categoryData - Datos parciales a actualizar
   * @returns {Promise}
   */
  patch: async (id, categoryData) => {
    try {
      const response = await api.patch(`/catalog/categorias/${id}/`, categoryData);
      return response.data;
    } catch (error) {
      console.error('Error actualizando categoría:', error);
      throw error;
    }
  },

  /**
   * Eliminar una categoría
   * @param {number} id - ID de la categoría
   * @returns {Promise}
   */
  delete: async (id) => {
    try {
      const response = await api.delete(`/catalog/categorias/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error eliminando categoría:', error);
      throw error;
    }
  },
};

export default categoryService;
