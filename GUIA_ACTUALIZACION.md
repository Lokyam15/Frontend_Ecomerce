# 🔧 Guía Práctica: Cómo Actualizar tus Componentes

Esta guía te muestra cómo actualizar tus componentes existentes para conectarlos con el backend.

---

## 📋 CategoryManager - Ejemplo Completo

Así es como deberías actualizar tu `CategoryManager.jsx`:

```jsx
import React, { useState, useEffect } from 'react';
import { categoryService } from '../../services';
import '../admin/ConnectedComponents.css';

export default function CategoryManager() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [formData, setFormData] = useState({
    nombre: '',
    estado: 'activo',
  });

  // Cargar categorías al montar
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await categoryService.getAllCategories();
      setCategories(data.results || data);
    } catch (err) {
      setError('Error al cargar categorías');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingCategory) {
        await categoryService.updateCategory(editingCategory.id, formData);
      } else {
        await categoryService.createCategory(formData);
      }
      await loadCategories();
      resetForm();
    } catch (err) {
      setError('Error al guardar categoría');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar esta categoría?')) return;
    try {
      await categoryService.deleteCategory(id);
      await loadCategories();
    } catch (err) {
      setError('Error al eliminar');
    }
  };

  const resetForm = () => {
    setFormData({ nombre: '', estado: 'activo' });
    setEditingCategory(null);
    setShowForm(false);
  };

  return (
    <div className="admin-module">
      <div className="module-header">
        <h2>Gestión de Categorías</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancelar' : '+ Nueva Categoría'}
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {showForm && (
        <form onSubmit={handleSave} className="form-container">
          <div className="form-group">
            <label>Nombre *</label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({...formData, nombre: e.target.value})}
              required
            />
          </div>
          <button type="submit" className="btn btn-success">Guardar</button>
        </form>
      )}

      {loading ? (
        <div className="loading"><div className="spinner"></div></div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(cat => (
              <tr key={cat.id}>
                <td>{cat.id}</td>
                <td>{cat.nombre}</td>
                <td><span className={`badge badge-${cat.estado === 'activo' ? 'success' : 'danger'}`}>{cat.estado}</span></td>
                <td>
                  <button onClick={() => handleDelete(cat.id)} className="btn btn-sm btn-danger">🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
```

---

## 👥 UserManager - Ejemplo

```jsx
import React, { useState, useEffect } from 'react';
import { userService } from '../../services';

export default function UserManager() {
  const [personas, setPersonas] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPersonas();
  }, []);

  const loadPersonas = async () => {
    setLoading(true);
    try {
      const data = await userService.getAllPersonas({ tipo: 'EMPLEADO' });
      setPersonas(data.results || data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createPersona = async (personaData) => {
    try {
      await userService.createPersona(personaData);
      await loadPersonas();
    } catch (err) {
      console.error(err);
    }
  };

  // ... resto del componente
}
```

---

## 💰 SalesManager - Ejemplo

```jsx
import React, { useState, useEffect } from 'react';
import { salesService, productService, userService } from '../../services';

export default function SalesManager() {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [clients, setClients] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [salesData, productsData, clientsData] = await Promise.all([
        salesService.getAllSales(),
        productService.getAllProducts(),
        userService.getAllPersonas({ tipo: 'CLIENTE' })
      ]);
      
      setSales(salesData.results || salesData);
      setProducts(productsData.results || productsData);
      setClients(clientsData.results || clientsData);
    } catch (err) {
      console.error(err);
    }
  };

  const createSale = async (saleData) => {
    try {
      const newSale = await salesService.createSale({
        persona: saleData.clientId,
        codigo: `VTA-${Date.now()}`,
        estado: 'BORRADOR',
        total: saleData.total,
        detalles: saleData.items.map(item => ({
          producto_variante: item.variantId,
          cantidad: item.quantity,
          precio_unitario: item.price,
          descuento: 0,
        }))
      });
      
      await loadData();
      return newSale;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  // ... resto del componente
}
```

---

## 📦 Inventory - Ejemplo

```jsx
import React, { useState, useEffect } from 'react';
import { inventoryService } from '../../services';

export default function Inventory() {
  const [movements, setMovements] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      const [movementsData, suppliersData] = await Promise.all([
        inventoryService.getAllMovements(),
        inventoryService.getAllSuppliers()
      ]);
      
      setMovements(movementsData.results || movementsData);
      setSuppliers(suppliersData.results || suppliersData);
    } catch (err) {
      console.error(err);
    }
  };

  const createMovement = async (movementData) => {
    try {
      await inventoryService.createMovement(movementData);
      await loadInventory();
    } catch (err) {
      console.error(err);
    }
  };

  // ... resto del componente
}
```

---

## 🎯 Patrón General para Todos los Componentes

```jsx
import React, { useState, useEffect } from 'react';
import { tuServicio } from '../../services';
import '../admin/ConnectedComponents.css';

export default function TuComponente() {
  // 1. Estados
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({});

  // 2. Cargar datos al montar
  useEffect(() => {
    loadData();
  }, []);

  // 3. Función para cargar datos
  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await tuServicio.getTodos();
      setData(result.results || result);
    } catch (err) {
      setError('Error al cargar datos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 4. Función para guardar
  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await tuServicio.crear(formData);
      await loadData();
      setShowForm(false);
    } catch (err) {
      setError('Error al guardar');
    } finally {
      setLoading(false);
    }
  };

  // 5. Función para eliminar
  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar?')) return;
    try {
      await tuServicio.eliminar(id);
      await loadData();
    } catch (err) {
      setError('Error al eliminar');
    }
  };

  // 6. Render
  return (
    <div className="admin-module">
      {error && <div className="alert alert-error">{error}</div>}
      
      {loading && <div className="loading"><div className="spinner"></div></div>}
      
      {/* Tu UI aquí */}
    </div>
  );
}
```

---

## 🔑 Puntos Clave

### ✅ Siempre importa los estilos
```jsx
import '../admin/ConnectedComponents.css';
```

### ✅ Usa async/await con try/catch
```jsx
try {
  const data = await service.getData();
} catch (err) {
  console.error(err);
}
```

### ✅ Maneja loading y error
```jsx
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
```

### ✅ Recarga datos después de cambios
```jsx
await service.create(data);
await loadData(); // ← Importante
```

### ✅ Maneja respuestas paginadas
```jsx
const result = await service.getAll();
setData(result.results || result); // ← Maneja ambos casos
```

---

## 🚨 Errores Comunes

### ❌ No manejar la respuesta paginada
```jsx
// MAL
setData(data); // Podría ser { results: [...], count: 10 }

// BIEN
setData(data.results || data);
```

### ❌ No recargar después de cambios
```jsx
// MAL
await service.create(data);
setShowForm(false); // ← Sin recargar

// BIEN
await service.create(data);
await loadData(); // ← Recargar
setShowForm(false);
```

### ❌ No manejar errores
```jsx
// MAL
const data = await service.getData();

// BIEN
try {
  const data = await service.getData();
} catch (err) {
  setError('Error al cargar');
}
```

---

## 📝 Checklist de Migración

Para cada componente:

- [ ] Importar el servicio correspondiente
- [ ] Importar los estilos `ConnectedComponents.css`
- [ ] Agregar estados de loading y error
- [ ] Implementar `useEffect` para cargar datos
- [ ] Crear función `loadData()`
- [ ] Actualizar `handleSave` para usar el servicio
- [ ] Actualizar `handleDelete` para usar el servicio
- [ ] Manejar respuestas paginadas
- [ ] Agregar try/catch en todas las llamadas async
- [ ] Probar crear, editar, eliminar

---

## 🎓 Recursos Adicionales

- **Documentación de Servicios**: Ver archivos en `src/services/`
- **Ejemplo Completo**: `src/features/admin/ProductManagerExample.jsx`
- **Estilos**: `src/features/admin/ConnectedComponents.css`
- **API Docs**: http://localhost:8000/api/docs/

---

¡Usa estos ejemplos como base para actualizar todos tus componentes! 🚀
