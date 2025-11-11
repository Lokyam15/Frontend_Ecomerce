import api from '../config/api';

/**
 * Servicio para gestionar productos
 */
const productService = {
  /**
   * Obtener todos los productos
   * @param {Object} params - Parámetros de filtrado y paginación
   * @returns {Promise}
   */
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/catalog/productos/', { params });
      return response.data;
    } catch (error) {
      console.error('Error obteniendo productos:', error);
      throw error;
    }
  },

  /**
   * Obtener un producto por ID
   * @param {number} id - ID del producto
   * @returns {Promise}
   */
  getById: async (id) => {
    try {
      const response = await api.get(`/catalog/productos/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo producto:', error);
      throw error;
    }
  },

  /**
   * Crear un nuevo producto
   * @param {Object} productData - Datos del producto
   * @returns {Promise}
   */
  create: async (productData) => {
    try {
      const response = await api.post('/catalog/productos/', productData);
      return response.data;
    } catch (error) {
      console.error('Error creando producto:', error);
      throw error;
    }
  },

  /**
   * Actualizar un producto existente
   * @param {number} id - ID del producto
   * @param {Object} productData - Datos actualizados del producto
   * @returns {Promise}
   */
  update: async (id, productData) => {
    try {
      const response = await api.put(`/catalog/productos/${id}/`, productData);
      return response.data;
    } catch (error) {
      console.error('Error actualizando producto:', error);
      throw error;
    }
  },

  /**
   * Actualizar parcialmente un producto
   * @param {number} id - ID del producto
   * @param {Object} productData - Datos parciales a actualizar
   * @returns {Promise}
   */
  patch: async (id, productData) => {
    try {
      const response = await api.patch(`/catalog/productos/${id}/`, productData);
      return response.data;
    } catch (error) {
      console.error('Error actualizando producto:', error);
      throw error;
    }
  },

  /**
   * Eliminar un producto
   * @param {number} id - ID del producto
   * @returns {Promise}
   */
  delete: async (id) => {
    try {
      const response = await api.delete(`/catalog/productos/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error eliminando producto:', error);
      throw error;
    }
  },

  /**
   * Obtener variantes de un producto
   * @param {Object} params - Parámetros de filtrado
   * @returns {Promise}
   */
  getProductVariants: async (params = {}) => {
    try {
      const response = await api.get('/catalog/variantes/', { params });
      return response.data;
    } catch (error) {
      console.error('Error obteniendo variantes:', error);
      throw error;
    }
  },

  /**
   * Crear una nueva variante de producto
   * @param {Object} variantData - Datos de la variante
   * @returns {Promise}
   */
  createVariant: async (variantData) => {
    try {
      const response = await api.post('/catalog/variantes/', variantData);
      return response.data;
    } catch (error) {
      console.error('Error creando variante:', error);
      throw error;
    }
  },
  
  // Alias para compatibilidad
  createProductVariant: async (variantData) => {
    return productService.createVariant(variantData);
  },

  /**
   * Actualizar una variante de producto
   * @param {number} id - ID de la variante
   * @param {Object} variantData - Datos actualizados
   * @returns {Promise}
   */
  updateProductVariant: async (id, variantData) => {
    try {
      const response = await api.put(`/catalog/variantes/${id}/`, variantData);
      return response.data;
    } catch (error) {
      console.error('Error actualizando variante:', error);
      throw error;
    }
  },

  /**
   * Eliminar una variante de producto
   * @param {number} id - ID de la variante
   * @returns {Promise}
   */
  deleteProductVariant: async (id) => {
    try {
      const response = await api.delete(`/catalog/variantes/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error eliminando variante:', error);
      throw error;
    }
  },

  /**
   * Obtener imágenes de productos
   * @param {Object} params - Parámetros de filtrado
   * @returns {Promise}
   */
  getProductImages: async (params = {}) => {
    try {
      const response = await api.get('/catalog/imagenes/', { params });
      return response.data;
    } catch (error) {
      console.error('Error obteniendo imágenes:', error);
      throw error;
    }
  },

  /**
   * Agregar una imagen a un producto
   * @param {Object|FormData} imageData - Datos de la imagen (puede ser FormData para archivos)
   * @returns {Promise}
   */
  createImage: async (imageData) => {
    try {
      // Si es FormData, configurar headers apropiados
      const config = {};
      if (imageData instanceof FormData) {
        config.headers = {
          'Content-Type': 'multipart/form-data',
        };
      }
      
      const response = await api.post('/catalog/imagenes/', imageData, config);
      return response.data;
    } catch (error) {
      console.error('Error agregando imagen:', error);
      console.error('Respuesta del servidor:', error.response?.data);
      throw error;
    }
  },
  
  // Alias para compatibilidad
  addProductImage: async (imageData) => {
    return productService.createImage(imageData);
  },

  /**
   * Eliminar una imagen de producto
   * @param {number} id - ID de la imagen
   * @returns {Promise}
   */
  deleteProductImage: async (id) => {
    try {
      const response = await api.delete(`/catalog/imagenes/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error eliminando imagen:', error);
      throw error;
    }
  },
};

export default productService;
