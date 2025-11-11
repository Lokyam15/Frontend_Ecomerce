/**
 * Punto de entrada centralizado para todos los servicios
 */

import authService from './authService';
import productService from './productService';
import categoryService from './categoryService';
import userService from './userService';
import inventoryService from './inventoryService';
import salesService from './salesService';

export {
  authService,
  productService,
  categoryService,
  userService,
  inventoryService,
  salesService,
};

// Export por defecto con todos los servicios
export default {
  auth: authService,
  products: productService,
  categories: categoryService,
  users: userService,
  inventory: inventoryService,
  sales: salesService,
};
