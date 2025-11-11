# Guía de Configuración y Conexión Frontend-Backend

## 🔧 Configuración Completada

### Backend (Django)
✅ Autenticación JWT configurada
✅ Endpoint `/api/v1/auth/login/` para login
✅ Endpoint `/api/v1/auth/user-info/` para obtener datos del usuario
✅ Endpoint `/api/v1/auth/refresh/` para refrescar tokens
✅ CORS habilitado para desarrollo

### Frontend (React + Vite)
✅ Axios instalado
✅ Configuración de API en `src/config/api.js`
✅ Servicio de autenticación en `src/services/authService.js`
✅ Servicios para todas las entidades:
  - `productService.js` - Gestión de productos
  - `categoryService.js` - Gestión de categorías
  - `userService.js` - Gestión de usuarios/personas
  - `inventoryService.js` - Gestión de inventario
  - `salesService.js` - Gestión de ventas
✅ LoginPanel conectado al backend
✅ Persistencia de sesión con localStorage

---

## 🚀 Pasos para Ejecutar el Proyecto

### 1. Iniciar el Backend (Django)

```powershell
# Ir a la carpeta del backend
cd c:\Users\lokya\Desktop\vscode\examen2\boutique-main

# Activar entorno virtual (si tienes uno)
# .\venv\Scripts\Activate.ps1

# Instalar dependencias (si no están instaladas)
pip install -r requirements.txt

# Ejecutar migraciones
python manage.py migrate

# Crear un superusuario (si no existe)
python manage.py createsuperuser

# Iniciar el servidor
python manage.py runserver
```

El backend estará disponible en: `http://localhost:8000`

### 2. Iniciar el Frontend (React + Vite)

```powershell
# En otra terminal, ir a la carpeta del frontend
cd c:\Users\lokya\Desktop\vscode\examen2\Frontend

# Instalar dependencias (ya está hecho, pero por si acaso)
npm install

# Iniciar el servidor de desarrollo
npm run dev
```

El frontend estará disponible en: `http://localhost:5173`

---

## 👤 Credenciales de Prueba

Para probar el login, necesitas usar un usuario creado en Django. Por ejemplo:

### Superusuario (Administrador)
- **Username**: El que creaste con `createsuperuser`
- **Password**: Tu contraseña

### Crear Usuarios de Prueba (opcional)

```python
# En el shell de Django: python manage.py shell
from django.contrib.auth.models import User

# Crear vendedor
seller = User.objects.create_user(
    username='vendedor',
    password='vendedor123',
    email='vendedor@boutique.com',
    is_staff=True,
    first_name='Juan',
    last_name='Pérez'
)

# Crear cliente
customer = User.objects.create_user(
    username='cliente',
    password='cliente123',
    email='cliente@boutique.com',
    first_name='María',
    last_name='García'
)
```

---

## 🔑 Roles y Permisos

El sistema determina automáticamente el rol según:

- **Superusuario (`is_superuser=True`)**: Rol `admin` con todos los permisos
- **Staff (`is_staff=True`)**: Rol `seller` con permisos limitados
- **Usuario normal**: Rol `customer` sin permisos administrativos

---

## 📝 Uso de los Servicios en el Frontend

### Ejemplo: Login

```javascript
import authService from './services/authService';

// Login
try {
  const userData = await authService.login('username', 'password');
  console.log('Usuario autenticado:', userData);
} catch (error) {
  console.error('Error en login:', error);
}

// Logout
authService.logout();

// Verificar si está autenticado
const isAuth = authService.isAuthenticated();

// Obtener usuario actual
const user = authService.getCurrentUser();
```

### Ejemplo: Obtener Productos

```javascript
import { productService } from './services';

// Obtener todos los productos
const products = await productService.getAllProducts();

// Filtrar productos por categoría
const filtered = await productService.getAllProducts({ 
  categoria: 1, 
  estado: 'activo' 
});

// Crear un producto
const newProduct = await productService.createProduct({
  nombre: 'Nueva Polera',
  categoria: 1,
  descripcion: 'Descripción del producto',
  estado: 'activo'
});
```

### Ejemplo: Crear una Venta

```javascript
import { salesService } from './services';

const saleData = {
  persona: 1,
  direccion: 1,
  codigo: 'VTA-001',
  estado: 'BORRADOR',
  total: 150.00,
  detalles: [
    {
      producto_variante: 1,
      cantidad: 2,
      precio_unitario: 75.00,
      descuento: 0,
    }
  ]
};

const sale = await salesService.createSale(saleData);
```

---

## 🛠️ Configuración de API

La URL base de la API está configurada en `src/config/api.js`:

```javascript
export const API_BASE_URL = 'http://localhost:8000/api/v1';
```

Si cambias el puerto del backend, actualiza esta URL.

---

## 🔐 Manejo de Tokens JWT

Los tokens se manejan automáticamente:

1. Al hacer login, los tokens se guardan en `localStorage`
2. Cada petición incluye el token de acceso en el header `Authorization`
3. Si el token expira, se intenta refrescar automáticamente
4. Si el refresh falla, se limpia la sesión y redirige al login

---

## 📋 Endpoints Disponibles

### Autenticación
- `POST /api/v1/auth/login/` - Login
- `POST /api/v1/auth/refresh/` - Refrescar token
- `GET /api/v1/auth/user-info/` - Información del usuario

### Catálogo
- `/api/v1/catalog/categorias/` - Categorías
- `/api/v1/catalog/productos/` - Productos
- `/api/v1/catalog/variantes/` - Variantes de productos
- `/api/v1/catalog/imagenes/` - Imágenes de productos

### Personas
- `/api/v1/people/personas/` - Personas (clientes, empleados)
- `/api/v1/people/direcciones/` - Direcciones

### Inventario
- `/api/v1/inventory/movimientos/` - Movimientos de inventario
- `/api/v1/inventory/proveedores/` - Proveedores
- `/api/v1/inventory/notas-ingreso/` - Notas de ingreso

### Ventas
- `/api/v1/sales/ventas/` - Ventas
- `/api/v1/sales/pagos/` - Pagos

---

## 🐛 Solución de Problemas

### Error: "No se pudo conectar con el servidor"
- Verifica que el backend esté ejecutándose en `http://localhost:8000`
- Verifica que CORS esté habilitado en `boutique/settings.py`

### Error: "Usuario o contraseña incorrectos"
- Verifica que el usuario exista en Django
- Usa las credenciales correctas

### Error de Token
- Limpia el localStorage: `localStorage.clear()`
- Vuelve a iniciar sesión

---

## 📚 Documentación de la API

Django REST Framework proporciona documentación automática:

- **Swagger UI**: `http://localhost:8000/api/docs/`
- **Schema JSON**: `http://localhost:8000/api/schema/`

---

## ✅ Próximos Pasos

1. Actualizar los componentes administrativos para usar los servicios
2. Implementar manejo de errores en los componentes
3. Agregar loaders/spinners durante las peticiones
4. Implementar paginación en las listas
5. Agregar validaciones en los formularios

---

## 📞 Soporte

Si tienes problemas, verifica:
1. Consola del navegador (F12) para errores de JavaScript
2. Terminal del backend para errores de Django
3. Network tab en DevTools para ver las peticiones HTTP
