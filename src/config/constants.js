export const APP_CONFIG = {
  name: 'Shopping Store',
  version: '1.0.0',
};

export const USERS = {
  ADMIN: {
    username: 'Superadmin',
    password: 'adminadmin',
    role: 'admin',
  },
  SELLER: {
    username: 'persona1',
    password: 'adminadmin',
    role: 'seller',
    permissions: ['manage_sales', 'view_stock']
  }
};

export const USER_ROLES = {
  ADMIN: 'admin',
  SELLER: 'seller',
};

export const ADMIN_PERMISSIONS = {
  MANAGE_SALES: 'manage_sales',
  MANAGE_STOCK: 'manage_stock',
  MANAGE_USERS: 'manage_users',
  ASSIGN_ROLES: 'assign_roles',
  MANAGE_CATEGORIES: 'manage_categories',
};