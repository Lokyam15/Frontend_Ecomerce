import api from '../config/api';

/**
 * Servicio para gestión de pedidos (orders)
 */
const orderService = {
  /**
   * Crear un nuevo pedido
   * @param {Object} orderData - Datos del pedido
   * @returns {Promise} Pedido creado
   */
  createOrder: async (orderData) => {
    try {
      const response = await api.post('/sales/orders/', orderData);
      return response.data;
    } catch (error) {
      console.error('Error creando pedido:', error);
      throw error;
    }
  },

  /**
   * Procesar pago del pedido
   * @param {number} orderId - ID del pedido
   * @returns {Promise} Resultado del procesamiento de pago
   */
  processPayment: async (orderId) => {
    try {
      const response = await api.post(`/sales/orders/${orderId}/process_payment/`);
      return response.data;
    } catch (error) {
      console.error('Error procesando pago:', error);
      throw error;
    }
  },

  /**
   * Obtener todos los pedidos del usuario actual
   * @returns {Promise} Lista de pedidos
   */
  getMyOrders: async () => {
    try {
      const response = await api.get('/sales/orders/my_orders/');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo pedidos:', error);
      throw error;
    }
  },

  /**
   * Obtener un pedido por ID
   * @param {number} id - ID del pedido
   * @returns {Promise} Datos del pedido
   */
  getOrderById: async (id) => {
    try {
      const response = await api.get(`/sales/orders/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo pedido:', error);
      throw error;
    }
  },

  /**
   * Obtener seguimiento del pedido
   * @param {number} orderId - ID del pedido
   * @returns {Promise} Timeline y estado del pedido
   */
  trackOrder: async (orderId) => {
    try {
      const response = await api.get(`/sales/orders/${orderId}/track/`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo seguimiento:', error);
      throw error;
    }
  },

  /**
   * Actualizar estado de un pedido
   * @param {number} id - ID del pedido
   * @param {string} status - Nuevo estado
   * @returns {Promise} Pedido actualizado
   */
  updateOrderStatus: async (id, status) => {
    try {
      const response = await api.patch(`/sales/orders/${id}/`, { status });
      return response.data;
    } catch (error) {
      console.error('Error actualizando estado del pedido:', error);
      throw error;
    }
  }
};

export default orderService;
