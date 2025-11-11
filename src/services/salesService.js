import api from '../config/api';

/**
 * Servicio para gestionar ventas
 */
const salesService = {
  /**
   * Obtener todas las ventas
   * @param {Object} params - Parámetros de filtrado (estado, fecha, etc.)
   * @returns {Promise}
   */
  getAllSales: async (params = {}) => {
    try {
      const response = await api.get('/sales/ventas/', { params });
      return response.data;
    } catch (error) {
      console.error('Error obteniendo ventas:', error);
      throw error;
    }
  },

  /**
   * Obtener una venta por ID
   * @param {number} id - ID de la venta
   * @returns {Promise}
   */
  getSaleById: async (id) => {
    try {
      const response = await api.get(`/sales/ventas/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo venta:', error);
      throw error;
    }
  },

  /**
   * Crear una nueva venta
   * @param {Object} saleData - Datos de la venta
   * @returns {Promise}
   */
  createSale: async (saleData) => {
    try {
      const response = await api.post('/sales/ventas/', saleData);
      return response.data;
    } catch (error) {
      console.error('Error creando venta:', error);
      throw error;
    }
  },

  /**
   * Actualizar una venta existente
   * @param {number} id - ID de la venta
   * @param {Object} saleData - Datos actualizados de la venta
   * @returns {Promise}
   */
  updateSale: async (id, saleData) => {
    try {
      const response = await api.put(`/sales/ventas/${id}/`, saleData);
      return response.data;
    } catch (error) {
      console.error('Error actualizando venta:', error);
      throw error;
    }
  },

  /**
   * Actualizar parcialmente una venta
   * @param {number} id - ID de la venta
   * @param {Object} saleData - Datos parciales a actualizar
   * @returns {Promise}
   */
  patchSale: async (id, saleData) => {
    try {
      const response = await api.patch(`/sales/ventas/${id}/`, saleData);
      return response.data;
    } catch (error) {
      console.error('Error actualizando venta:', error);
      throw error;
    }
  },

  /**
   * Eliminar una venta
   * @param {number} id - ID de la venta
   * @returns {Promise}
   */
  deleteSale: async (id) => {
    try {
      const response = await api.delete(`/sales/ventas/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error eliminando venta:', error);
      throw error;
    }
  },

  /**
   * Obtener todos los pagos
   * @param {Object} params - Parámetros de filtrado
   * @returns {Promise}
   */
  getAllPayments: async (params = {}) => {
    try {
      const response = await api.get('/sales/pagos/', { params });
      return response.data;
    } catch (error) {
      console.error('Error obteniendo pagos:', error);
      throw error;
    }
  },

  /**
   * Obtener un pago por ID
   * @param {number} id - ID del pago
   * @returns {Promise}
   */
  getPaymentById: async (id) => {
    try {
      const response = await api.get(`/sales/pagos/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo pago:', error);
      throw error;
    }
  },

  /**
   * Crear un nuevo pago
   * @param {Object} paymentData - Datos del pago
   * @returns {Promise}
   */
  createPayment: async (paymentData) => {
    try {
      const response = await api.post('/sales/pagos/', paymentData);
      return response.data;
    } catch (error) {
      console.error('Error creando pago:', error);
      throw error;
    }
  },

  /**
   * Actualizar un pago
   * @param {number} id - ID del pago
   * @param {Object} paymentData - Datos actualizados del pago
   * @returns {Promise}
   */
  updatePayment: async (id, paymentData) => {
    try {
      const response = await api.put(`/sales/pagos/${id}/`, paymentData);
      return response.data;
    } catch (error) {
      console.error('Error actualizando pago:', error);
      throw error;
    }
  },

  /**
   * Eliminar un pago
   * @param {number} id - ID del pago
   * @returns {Promise}
   */
  deletePayment: async (id) => {
    try {
      const response = await api.delete(`/sales/pagos/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error eliminando pago:', error);
      throw error;
    }
  },
};

export default salesService;
