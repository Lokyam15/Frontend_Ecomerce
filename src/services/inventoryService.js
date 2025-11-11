import api from '../config/api';

/**
 * Servicio para gestionar inventario
 */
const inventoryService = {
  /**
   * Obtener todos los movimientos de inventario
   * @param {Object} params - Parámetros de filtrado
   * @returns {Promise}
   */
  getAllMovements: async (params = {}) => {
    try {
      const response = await api.get('/inventory/movimientos/', { params });
      return response.data;
    } catch (error) {
      console.error('Error obteniendo movimientos:', error);
      throw error;
    }
  },

  /**
   * Crear un nuevo movimiento de inventario
   * @param {Object} movementData - Datos del movimiento
   * @returns {Promise}
   */
  createMovement: async (movementData) => {
    try {
      const response = await api.post('/inventory/movimientos/', movementData);
      return response.data;
    } catch (error) {
      console.error('Error creando movimiento:', error);
      throw error;
    }
  },

  /**
   * Obtener todos los proveedores
   * @param {Object} params - Parámetros de filtrado
   * @returns {Promise}
   */
  getAllSuppliers: async (params = {}) => {
    try {
      const response = await api.get('/inventory/proveedores/', { params });
      return response.data;
    } catch (error) {
      console.error('Error obteniendo proveedores:', error);
      throw error;
    }
  },

  /**
   * Obtener un proveedor por ID
   * @param {number} id - ID del proveedor
   * @returns {Promise}
   */
  getSupplierById: async (id) => {
    try {
      const response = await api.get(`/inventory/proveedores/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo proveedor:', error);
      throw error;
    }
  },

  /**
   * Crear un nuevo proveedor
   * @param {Object} supplierData - Datos del proveedor
   * @returns {Promise}
   */
  createSupplier: async (supplierData) => {
    try {
      const response = await api.post('/inventory/proveedores/', supplierData);
      return response.data;
    } catch (error) {
      console.error('Error creando proveedor:', error);
      throw error;
    }
  },

  /**
   * Actualizar un proveedor
   * @param {number} id - ID del proveedor
   * @param {Object} supplierData - Datos actualizados
   * @returns {Promise}
   */
  updateSupplier: async (id, supplierData) => {
    try {
      const response = await api.put(`/inventory/proveedores/${id}/`, supplierData);
      return response.data;
    } catch (error) {
      console.error('Error actualizando proveedor:', error);
      throw error;
    }
  },

  /**
   * Eliminar un proveedor
   * @param {number} id - ID del proveedor
   * @returns {Promise}
   */
  deleteSupplier: async (id) => {
    try {
      const response = await api.delete(`/inventory/proveedores/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error eliminando proveedor:', error);
      throw error;
    }
  },

  /**
   * Obtener todas las notas de ingreso
   * @param {Object} params - Parámetros de filtrado
   * @returns {Promise}
   */
  getAllInboundNotes: async (params = {}) => {
    try {
      const response = await api.get('/inventory/notas-ingreso/', { params });
      return response.data;
    } catch (error) {
      console.error('Error obteniendo notas de ingreso:', error);
      throw error;
    }
  },

  /**
   * Obtener una nota de ingreso por ID
   * @param {number} id - ID de la nota de ingreso
   * @returns {Promise}
   */
  getInboundNoteById: async (id) => {
    try {
      const response = await api.get(`/inventory/notas-ingreso/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo nota de ingreso:', error);
      throw error;
    }
  },

  /**
   * Crear una nueva nota de ingreso
   * @param {Object} noteData - Datos de la nota de ingreso
   * @returns {Promise}
   */
  createInboundNote: async (noteData) => {
    try {
      const response = await api.post('/inventory/notas-ingreso/', noteData);
      return response.data;
    } catch (error) {
      console.error('Error creando nota de ingreso:', error);
      throw error;
    }
  },

  /**
   * Actualizar una nota de ingreso
   * @param {number} id - ID de la nota de ingreso
   * @param {Object} noteData - Datos actualizados
   * @returns {Promise}
   */
  updateInboundNote: async (id, noteData) => {
    try {
      const response = await api.put(`/inventory/notas-ingreso/${id}/`, noteData);
      return response.data;
    } catch (error) {
      console.error('Error actualizando nota de ingreso:', error);
      throw error;
    }
  },

  /**
   * Eliminar una nota de ingreso
   * @param {number} id - ID de la nota de ingreso
   * @returns {Promise}
   */
  deleteInboundNote: async (id) => {
    try {
      const response = await api.delete(`/inventory/notas-ingreso/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error eliminando nota de ingreso:', error);
      throw error;
    }
  },
};

export default inventoryService;
