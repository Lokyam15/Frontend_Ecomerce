import api from '../config/api';

/**
 * Servicio de autenticación para interactuar con el backend
 */
const authService = {
  /**
   * Iniciar sesión con email y password
   * @param {string} email - Email del usuario
   * @param {string} password - Contraseña
   * @returns {Promise} Datos del usuario y tokens
   */
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login/', {
        email,
        password,
      });

      // Guardar tokens en localStorage
      const { access, refresh } = response.data;
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);

      // Obtener información del usuario
      const userInfo = await authService.getUserInfo();
      
      return userInfo;
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  },

  /**
   * Obtener información del usuario autenticado
   * @returns {Promise} Datos del usuario
   */
  getUserInfo: async () => {
    try {
      const response = await api.get('/auth/user-info/');
      const userData = response.data;
      
      // Guardar información del usuario en localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      
      return userData;
    } catch (error) {
      console.error('Error obteniendo información del usuario:', error);
      throw error;
    }
  },

  /**
   * Cerrar sesión
   */
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  },

  /**
   * Verificar si el usuario está autenticado
   * @returns {boolean}
   */
  isAuthenticated: () => {
    const token = localStorage.getItem('access_token');
    return !!token;
  },

  /**
   * Obtener usuario desde localStorage
   * @returns {Object|null}
   */
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  /**
   * Refrescar el token de acceso
   * @returns {Promise}
   */
  refreshToken: async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await api.post('/auth/refresh/', {
        refresh: refreshToken,
      });

      const { access } = response.data;
      localStorage.setItem('access_token', access);
      
      return access;
    } catch (error) {
      console.error('Error refrescando token:', error);
      authService.logout();
      throw error;
    }
  },

  /**
   * Registrar un nuevo usuario
   * @param {Object} userData - Datos del nuevo usuario
   * @returns {Promise} Usuario creado
   */
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register/', userData);
      return response.data;
    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    }
  },
};

export default authService;
