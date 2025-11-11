import React, { useState, useEffect } from 'react';
import './AdminStyles.css';
import productService from '../../services/productService';
import categoryService from '../../services/categoryService';

export default function ProductManagerConnected() {
  console.log('🟦 ProductManagerConnected: Componente renderizándose...');
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [activeTab, setActiveTab] = useState('datos'); // 'datos', 'imagenes', 'variantes'

  const [newProduct, setNewProduct] = useState({
    codigo: '',
    nombre: '',
    categoria: '',
    descripcion: '',
    estado: 'activo',
    imagenes: [],
    variantes: []
  });

  // Estado temporal para agregar imágenes - MEJORADO PARA ARCHIVOS
  const [newImage, setNewImage] = useState({
    archivo: null,      // Archivo desde PC
    url: '',           // O URL externa (opcional)
    principal: false,
    preview: '',       // Preview de la imagen
    showUrlInput: false // Para mostrar/ocultar el textarea de URL
  });

  // Estado temporal para agregar variantes - MEJORADO PARA MÚLTIPLES TALLAS
  const [newVariant, setNewVariant] = useState({
    sku: '',
    tallas: [],        // Array de tallas seleccionadas
    color: '',
    precio: '',
    costo: '',
    stock: 0,
    barcode: '',
    estado: 'activo'
  });

  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  // Tallas disponibles
  const tallas = ['S', 'M', 'L', 'XL'];

  // Cargar productos y categorías al montar el componente
  useEffect(() => {
    console.log('ProductManagerConnected montado - cargando datos...');
    loadProducts();
    loadCategories();
  }, []);

  const loadProducts = async () => {
    try {
      console.log('Llamando a productService.getAll()...');
      setLoading(true);
      setError(null);
      const data = await productService.getAll();
      console.log('Productos recibidos:', data);
      
      if (Array.isArray(data)) {
        setProducts(data);
      } else if (data && typeof data === 'object' && Array.isArray(data.results)) {
        setProducts(data.results);
      } else {
        console.warn('Formato de datos inesperado:', data);
        setProducts([]);
      }
    } catch (err) {
      console.error('Error al cargar productos:', err);
      setError('No se pudieron cargar los productos. Verifica que el servidor backend esté corriendo.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      console.log('🔵 Cargando categorías para el selector...');
      const data = await categoryService.getAll();
      console.log('🔵 Categorías recibidas:', data);
      console.log('🔵 Tipo de data:', typeof data, 'Es array?:', Array.isArray(data));
      
      let categoriesArray = [];
      
      if (Array.isArray(data)) {
        categoriesArray = data;
      } else if (data && typeof data === 'object' && Array.isArray(data.results)) {
        // Si viene paginado
        categoriesArray = data.results;
      }
      
      console.log('🔵 Categorías procesadas:', categoriesArray.length, 'categorías encontradas');
      
      // Filtrar solo categorías activas
      const activeCategories = categoriesArray.filter(cat => cat.estado === 'activo');
      console.log('🔵 Categorías activas:', activeCategories.length);
      
      setCategories(activeCategories);
    } catch (err) {
      console.error('❌ Error al cargar categorías:', err);
      console.error('❌ Detalles:', err.response);
      setCategories([]);
    }
  };

  // Funciones para manejar imágenes
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar que sea una imagen
      if (!file.type.startsWith('image/')) {
        setError('Por favor selecciona un archivo de imagen válido');
        return;
      }

      // Crear preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImage({
          ...newImage,
          archivo: file,
          preview: reader.result
        });
      };
      reader.readAsDataURL(file);
      setError(null);
    }
  };

  const handleAddImage = () => {
    // Validar que haya archivo o URL
    if (!newImage.archivo && !newImage.url.trim()) {
      setError('Debes seleccionar una imagen desde tu PC o ingresar una URL');
      return;
    }

    // Si es imagen principal, quitar la principal anterior
    let imagenes = newProduct.imagenes;
    if (newImage.principal) {
      imagenes = imagenes.map(img => ({ ...img, principal: false }));
    }

    setNewProduct({
      ...newProduct,
      imagenes: [...imagenes, { ...newImage, id: Date.now() }]
    });

    // Resetear formulario de imagen
    setNewImage({ archivo: null, url: '', principal: false, preview: '', showUrlInput: false });
    // Limpiar input de archivo
    const fileInput = document.getElementById('imagen-input');
    if (fileInput) fileInput.value = '';
    setError(null);
  };

  const handleRemoveImage = (id) => {
    setNewProduct({
      ...newProduct,
      imagenes: newProduct.imagenes.filter(img => img.id !== id)
    });
  };

  const handleSetPrincipalImage = (id) => {
    setNewProduct({
      ...newProduct,
      imagenes: newProduct.imagenes.map(img => ({
        ...img,
        principal: img.id === id
      }))
    });
  };

  // Funciones para manejar variantes
  const handleToggleTalla = (talla) => {
    const tallasActuales = newVariant.tallas;
    if (tallasActuales.includes(talla)) {
      setNewVariant({
        ...newVariant,
        tallas: tallasActuales.filter(t => t !== talla)
      });
    } else {
      setNewVariant({
        ...newVariant,
        tallas: [...tallasActuales, talla]
      });
    }
  };

  const handleAddVariant = () => {
    // Validaciones
    if (newVariant.tallas.length === 0) {
      setError('⚠️ Debes seleccionar al menos una talla');
      return;
    }
    if (newVariant.color.trim() === '') {
      setError('⚠️ El color es requerido');
      return;
    }
    if (!newVariant.precio || parseFloat(newVariant.precio) <= 0) {
      setError('⚠️ El precio debe ser mayor a 0');
      return;
    }

    // Generar SKU automático basado en: Nombre del Producto + Color + Talla
    const nombreLimpio = newProduct.nombre
      .toUpperCase()
      .replace(/\s+/g, '-')
      .replace(/[^A-Z0-9-]/g, '')
      .substring(0, 15); // Limitar a 15 caracteres
    
    const colorLimpio = newVariant.color
      .toUpperCase()
      .replace(/\s+/g, '-')
      .replace(/[^A-Z0-9-]/g, '');

    // Crear una variante por cada talla seleccionada
    const nuevasVariantes = newVariant.tallas.map(talla => ({
      sku: `${nombreLimpio}-${colorLimpio}-${talla}`, // SKU AUTOMÁTICO
      talla: talla,
      color: newVariant.color,
      precio: newVariant.precio,
      costo: newVariant.costo || '',
      stock: newVariant.stock || 0,
      barcode: newVariant.barcode || '',
      estado: newVariant.estado,
      id: Date.now() + Math.random()
    }));

    setNewProduct({
      ...newProduct,
      variantes: [...newProduct.variantes, ...nuevasVariantes]
    });

    setNewVariant({
      sku: '',
      tallas: [],
      color: '',
      precio: '',
      costo: '',
      stock: 0,
      barcode: '',
      estado: 'activo'
    });
    setError(null);
    setSuccess(`✅ Se agregaron ${nuevasVariantes.length} variante(s) con SKU automático`);
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleRemoveVariant = (id) => {
    setNewProduct({
      ...newProduct,
      variantes: newProduct.variantes.filter(v => v.id !== id)
    });
  };

  const handleAddProduct = async () => {
    if (newProduct.nombre.trim() === '') {
      setError('El nombre del producto es requerido');
      return;
    }

    if (!newProduct.categoria) {
      setError('Debes seleccionar una categoría');
      return;
    }

    try {
      console.log('Guardando producto:', newProduct);
      setLoading(true);
      setError(null);
      setSuccess(null);

      // Preparar datos
      const productData = {
        codigo: newProduct.codigo || null,
        nombre: newProduct.nombre,
        categoria: parseInt(newProduct.categoria),
        descripcion: newProduct.descripcion,
        estado: newProduct.estado
      };

      console.log('Datos a enviar:', productData);

      if (editMode) {
        // Actualizar producto existente
        console.log('Actualizando producto ID:', editId);
        const updated = await productService.update(editId, productData);
        console.log('Producto actualizado:', updated);
        setProducts(products.map(prod => 
          prod.id === editId ? updated : prod
        ));
        setEditMode(false);
        setEditId(null);
        setSuccess('✅ Producto actualizado exitosamente');
      } else {
        // Crear nuevo producto
        console.log('Creando nuevo producto...');
        const created = await productService.create(productData);
        console.log('Producto creado exitosamente:', created);
        
        // Ahora crear las imágenes asociadas
        if (newProduct.imagenes.length > 0) {
          console.log('Creando', newProduct.imagenes.length, 'imágenes...');
          for (const imagen of newProduct.imagenes) {
            try {
              // Si hay archivo, usar FormData
              if (imagen.archivo) {
                const formData = new FormData();
                formData.append('producto', created.id);
                formData.append('imagen', imagen.archivo);
                formData.append('principal', imagen.principal);
                
                console.log('📤 Enviando imagen con FormData...');
                const imagenCreada = await productService.createImage(formData);
                console.log('✅ Imagen creada:', imagenCreada);
              } 
              // Si solo hay URL (opcional)
              else if (imagen.url) {
                console.log('📤 Enviando imagen con URL...');
                const imagenCreada = await productService.createImage({
                  producto: created.id,
                  url: imagen.url,
                  principal: imagen.principal
                });
                console.log('✅ Imagen URL creada:', imagenCreada);
              }
            } catch (imgErr) {
              console.error('❌ Error al crear imagen:', imgErr);
              console.error('❌ Detalles:', imgErr.response?.data);
            }
          }
        }

        // Ahora crear las variantes asociadas
        if (newProduct.variantes.length > 0) {
          console.log('Creando', newProduct.variantes.length, 'variantes...');
          for (const variante of newProduct.variantes) {
            try {
              const varianteCreada = await productService.createVariant({
                producto: created.id,
                sku: variante.sku,
                talla: variante.talla,
                color: variante.color,
                precio: parseFloat(variante.precio),
                costo: parseFloat(variante.costo) || 0,
                stock: parseInt(variante.stock) || 0,
                barcode: variante.barcode || '',
                estado: variante.estado
              });
              console.log('✅ Variante creada:', varianteCreada);
            } catch (varErr) {
              console.error('❌ Error al crear variante:', varErr);
              console.error('❌ Detalles:', varErr.response?.data);
            }
          }
        }
        
        // Recargar el producto completo con sus relaciones (imágenes y variantes)
        console.log('🔄 Recargando producto completo con relaciones...');
        const productoCompleto = await productService.getById(created.id);
        console.log('✅ Producto completo cargado:', productoCompleto);
        
        setProducts([...products, productoCompleto]);
        setSuccess('✅ Producto creado exitosamente con imágenes y variantes');
      }

      // Limpiar formulario
      setNewProduct({
        codigo: '',
        nombre: '',
        categoria: '',
        descripcion: '',
        estado: 'activo',
        imagenes: [],
        variantes: []
      });
      
      setActiveTab('datos');
      
      // Recargar la lista
      setTimeout(() => {
        loadProducts();
        setSuccess(null);
      }, 2000);
      
    } catch (err) {
      console.error('❌ Error al guardar producto:', err);
      console.error('Respuesta del servidor:', err.response?.data);
      
      let errorMsg = 'Error al guardar el producto';
      if (err.response?.data) {
        if (err.response.data.nombre) {
          errorMsg = `Nombre: ${err.response.data.nombre[0]}`;
        } else if (err.response.data.categoria) {
          errorMsg = `Categoría: ${err.response.data.categoria[0]}`;
        } else if (err.response.data.codigo) {
          errorMsg = `Código: ${err.response.data.codigo[0]}`;
        } else if (err.response.data.detail) {
          errorMsg = err.response.data.detail;
        }
      } else if (err.message) {
        errorMsg = err.message;
      }
      
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setNewProduct({
      codigo: product.codigo || '',
      nombre: product.nombre,
      categoria: product.categoria,
      descripcion: product.descripcion || '',
      estado: product.estado,
      imagenes: product.imagenes || [],
      variantes: product.variantes || []
    });
    setEditMode(true);
    setEditId(product.id);
    setError(null);
    setActiveTab('datos');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) return;

    try {
      setLoading(true);
      setError(null);
      await productService.delete(id);
      setProducts(products.filter(prod => prod.id !== id));
      setSuccess('✅ Producto eliminado exitosamente');
      setTimeout(() => setSuccess(null), 2000);
    } catch (err) {
      console.error('Error al eliminar producto:', err);
      setError(err.response?.data?.detail || 'Error al eliminar el producto');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditId(null);
    setNewProduct({
      codigo: '',
      nombre: '',
      categoria: '',
      descripcion: '',
      estado: 'activo',
      imagenes: [],
      variantes: []
    });
    setError(null);
    setActiveTab('datos');
  };

  return (
    <div className="admin-section">
      <h2 style={{ fontSize: '28px', marginBottom: '10px', color: '#1a1a1a' }}>Gestión de Productos</h2>
      <p style={{ color: '#666', marginBottom: '30px' }}>Crea y administra tus productos en 3 simples pasos</p>
      
      {success && (
        <div style={{ 
          padding: '15px 20px',
          marginBottom: '20px',
          backgroundColor: '#d4edda',
          color: '#155724',
          borderRadius: '8px',
          border: '1px solid #c3e6cb',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          animation: 'slideIn 0.3s ease-out'
        }}>
          <span style={{ fontSize: '20px' }}>✅</span>
          <span>{success}</span>
        </div>
      )}
      
      {error && (
        <div style={{ 
          padding: '15px 20px',
          marginBottom: '20px',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          borderRadius: '8px',
          border: '1px solid #f5c6cb',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          animation: 'shake 0.5s'
        }}>
          <span style={{ fontSize: '20px' }}>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {loading && (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            border: '4px solid #e0e0e0',
            borderTop: '4px solid #1565c0',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 15px'
          }}></div>
          <p style={{ color: '#666', margin: 0 }}>Cargando...</p>
        </div>
      )}

      {/* Indicador de Progreso Mejorado */}
      <div style={{ 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '12px',
        position: 'relative'
      }}>
        {/* Línea de progreso */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '10%',
          right: '10%',
          height: '3px',
          backgroundColor: '#e0e0e0',
          zIndex: 0
        }}>
          <div style={{
            height: '100%',
            width: activeTab === 'datos' ? '0%' : activeTab === 'imagenes' ? '50%' : '100%',
            backgroundColor: '#4caf50',
            transition: 'width 0.3s ease'
          }}></div>
        </div>

        {/* Paso 1 */}
        <div 
          onClick={() => setActiveTab('datos')}
          style={{ 
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            cursor: 'pointer',
            position: 'relative',
            zIndex: 1
          }}
        >
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            backgroundColor: newProduct.nombre && newProduct.categoria ? '#4caf50' : activeTab === 'datos' ? '#1565c0' : '#e0e0e0',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            fontWeight: 'bold',
            marginBottom: '10px',
            boxShadow: activeTab === 'datos' ? '0 4px 12px rgba(21, 101, 192, 0.4)' : 'none',
            transition: 'all 0.3s'
          }}>
            {newProduct.nombre && newProduct.categoria ? '✓' : '1'}
          </div>
          <span style={{ 
            fontSize: '14px', 
            fontWeight: activeTab === 'datos' ? 'bold' : 'normal',
            color: activeTab === 'datos' ? '#1565c0' : '#666'
          }}>
            Información Básica
          </span>
        </div>

        {/* Paso 2 */}
        <div 
          onClick={() => setActiveTab('imagenes')}
          style={{ 
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            cursor: 'pointer',
            position: 'relative',
            zIndex: 1
          }}
        >
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            backgroundColor: newProduct.imagenes.length > 0 ? '#4caf50' : activeTab === 'imagenes' ? '#1565c0' : '#e0e0e0',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            fontWeight: 'bold',
            marginBottom: '10px',
            boxShadow: activeTab === 'imagenes' ? '0 4px 12px rgba(21, 101, 192, 0.4)' : 'none',
            transition: 'all 0.3s'
          }}>
            {newProduct.imagenes.length > 0 ? '✓' : '2'}
          </div>
          <span style={{ 
            fontSize: '14px', 
            fontWeight: activeTab === 'imagenes' ? 'bold' : 'normal',
            color: activeTab === 'imagenes' ? '#1565c0' : '#666'
          }}>
            Imágenes ({newProduct.imagenes.length})
          </span>
        </div>

        {/* Paso 3 */}
        <div 
          onClick={() => setActiveTab('variantes')}
          style={{ 
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            cursor: 'pointer',
            position: 'relative',
            zIndex: 1
          }}
        >
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            backgroundColor: newProduct.variantes.length > 0 ? '#4caf50' : activeTab === 'variantes' ? '#1565c0' : '#e0e0e0',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            fontWeight: 'bold',
            marginBottom: '10px',
            boxShadow: activeTab === 'variantes' ? '0 4px 12px rgba(21, 101, 192, 0.4)' : 'none',
            transition: 'all 0.3s'
          }}>
            {newProduct.variantes.length > 0 ? '✓' : '3'}
          </div>
          <span style={{ 
            fontSize: '14px', 
            fontWeight: activeTab === 'variantes' ? 'bold' : 'normal',
            color: activeTab === 'variantes' ? '#1565c0' : '#666'
          }}>
            Variantes ({newProduct.variantes.length})
          </span>
        </div>
      </div>

      {/* Contenido según la pestaña activa */}
      {activeTab === 'datos' && (

      <div className="admin-form" style={{ 
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ marginTop: 0, marginBottom: '25px', color: '#1a1a1a' }}>
          📝 Paso 1: Información del Producto
        </h3>
        
        <div className="form-group">
          <label style={{ 
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '8px',
            color: '#444',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            <span>🏷️</span>
            Código del Producto
            <span style={{ 
              fontSize: '12px', 
              color: '#999',
              fontWeight: 'normal'
            }}>(Opcional)</span>
          </label>
          <input
            type="text"
            value={newProduct.codigo}
            onChange={(e) => setNewProduct({ ...newProduct, codigo: e.target.value })}
            placeholder="Ej: PROD-001, CAM-2024-01"
            style={{
              padding: '12px 15px',
              fontSize: '15px',
              border: '2px solid #e0e0e0',
              borderRadius: '8px',
              transition: 'border-color 0.2s',
              width: '100%'
            }}
            onFocus={(e) => e.target.style.borderColor = '#1565c0'}
            onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
            disabled={loading}
          />
          <small style={{ color: '#666', fontSize: '12px', display: 'block', marginTop: '5px' }}>
            Si no ingresas un código, se generará automáticamente
          </small>
        </div>

        <div className="form-group">
          <label style={{ 
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '8px',
            color: '#444',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            <span>✏️</span>
            Nombre del Producto
            <span style={{ color: '#e74c3c', marginLeft: '4px' }}>*</span>
          </label>
          <input
            type="text"
            value={newProduct.nombre}
            onChange={(e) => setNewProduct({ ...newProduct, nombre: e.target.value })}
            placeholder="Ej: Camisa Casual Azul, Pantalón Deportivo..."
            style={{
              padding: '12px 15px',
              fontSize: '15px',
              border: `2px solid ${!newProduct.nombre ? '#e74c3c' : '#e0e0e0'}`,
              borderRadius: '8px',
              transition: 'border-color 0.2s',
              width: '100%'
            }}
            onFocus={(e) => e.target.style.borderColor = '#1565c0'}
            onBlur={(e) => e.target.style.borderColor = !newProduct.nombre ? '#e74c3c' : '#e0e0e0'}
            disabled={loading}
          />
          {!newProduct.nombre && (
            <small style={{ color: '#e74c3c', fontSize: '12px', display: 'block', marginTop: '5px' }}>
              ⚠️ El nombre es obligatorio
            </small>
          )}
        </div>
        
        <div className="form-group">
          <label style={{ 
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '8px',
            color: '#444',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            <span>📁</span>
            Categoría
            <span style={{ color: '#e74c3c', marginLeft: '4px' }}>*</span>
          </label>
          <select
            value={newProduct.categoria}
            onChange={(e) => setNewProduct({ ...newProduct, categoria: e.target.value })}
            disabled={loading}
            style={{
              padding: '12px 15px',
              fontSize: '15px',
              border: `2px solid ${!newProduct.categoria ? '#e74c3c' : '#e0e0e0'}`,
              borderRadius: '8px',
              transition: 'border-color 0.2s',
              width: '100%',
              cursor: 'pointer'
            }}
          >
            <option value="">-- Selecciona una categoría --</option>
            {categories.length === 0 ? (
              <option value="" disabled>No hay categorías disponibles</option>
            ) : (
              categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.id_padre ? `  ↳ ${cat.nombre}` : `${cat.nombre}`}
                  {cat.nombre_padre ? ` (${cat.nombre_padre})` : ''}
                </option>
              ))
            )}
          </select>
          {!newProduct.categoria && (
            <small style={{ color: '#e74c3c', fontSize: '12px', display: 'block', marginTop: '5px' }}>
              ⚠️ Debes seleccionar una categoría
            </small>
          )}
          {categories.length === 0 && (
            <small style={{ color: '#e74c3c', fontSize: '12px', display: 'block', marginTop: '5px' }}>
              ⚠️ No hay categorías. Crea una primero en "Gestión de Categorías"
            </small>
          )}
        </div>

        <div className="form-group">
          <label style={{ 
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '8px',
            color: '#444',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            <span>📄</span>
            Descripción
            <span style={{ 
              fontSize: '12px', 
              color: '#999',
              fontWeight: 'normal',
              marginLeft: '4px'
            }}>(Opcional)</span>
          </label>
          <textarea
            value={newProduct.descripcion}
            onChange={(e) => setNewProduct({ ...newProduct, descripcion: e.target.value })}
            placeholder="Describe las características, materiales, usos del producto..."
            rows="4"
            disabled={loading}
            style={{
              padding: '12px 15px',
              fontSize: '15px',
              border: '2px solid #e0e0e0',
              borderRadius: '8px',
              transition: 'border-color 0.2s',
              width: '100%',
              fontFamily: 'inherit',
              resize: 'vertical'
            }}
            onFocus={(e) => e.target.style.borderColor = '#1565c0'}
            onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
          />
          <small style={{ color: '#666', fontSize: '12px', display: 'block', marginTop: '5px' }}>
            {newProduct.descripcion.length}/500 caracteres
          </small>
        </div>
        
        <div className="form-group">
          <label style={{ 
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '8px',
            color: '#444',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            <span>🔄</span>
            Estado del Producto
          </label>
          <div style={{ display: 'flex', gap: '15px' }}>
            <label style={{ 
              flex: 1,
              padding: '15px',
              border: `3px solid ${newProduct.estado === 'activo' ? '#4caf50' : '#e0e0e0'}`,
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              backgroundColor: newProduct.estado === 'activo' ? '#f1f8f4' : 'white',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <input
                type="radio"
                name="estado"
                value="activo"
                checked={newProduct.estado === 'activo'}
                onChange={(e) => setNewProduct({ ...newProduct, estado: e.target.value })}
                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
              />
              <div>
                <div style={{ fontWeight: 'bold', color: '#4caf50' }}>✓ Activo</div>
                <small style={{ color: '#666', fontSize: '12px' }}>Visible para clientes</small>
              </div>
            </label>
            
            <label style={{ 
              flex: 1,
              padding: '15px',
              border: `3px solid ${newProduct.estado === 'inactivo' ? '#f44336' : '#e0e0e0'}`,
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              backgroundColor: newProduct.estado === 'inactivo' ? '#fef5f5' : 'white',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <input
                type="radio"
                name="estado"
                value="inactivo"
                checked={newProduct.estado === 'inactivo'}
                onChange={(e) => setNewProduct({ ...newProduct, estado: e.target.value })}
                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
              />
              <div>
                <div style={{ fontWeight: 'bold', color: '#f44336' }}>✗ Inactivo</div>
                <small style={{ color: '#666', fontSize: '12px' }}>Oculto para clientes</small>
              </div>
            </label>
          </div>
        </div>

        {/* Botón de navegación */}
        <div style={{ 
          marginTop: '30px',
          padding: '20px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
              {newProduct.nombre && newProduct.categoria ? '✅ Información completa' : '⚠️ Completa los campos requeridos'}
            </div>
            <small style={{ color: '#666' }}>
              Campos obligatorios: Nombre y Categoría
            </small>
          </div>
          <button
            onClick={() => setActiveTab('imagenes')}
            disabled={!newProduct.nombre || !newProduct.categoria}
            style={{
              padding: '12px 30px',
              backgroundColor: (newProduct.nombre && newProduct.categoria) ? '#1565c0' : '#ccc',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: (newProduct.nombre && newProduct.categoria) ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s'
            }}
          >
            Siguiente: Agregar Imágenes
            <span>→</span>
          </button>
        </div>
      </div>
      )}

      {/* Pestaña de Imágenes */}
      {activeTab === 'imagenes' && (
        <div className="admin-form">
          <h3>📷 Paso 2: Imágenes del Producto</h3>
          <p style={{ color: '#666', marginBottom: '20px' }}>
            Agrega fotos de tu producto. Puedes subir archivos desde tu PC o usar URLs externas.
          </p>

          <div style={{ 
            marginBottom: '30px',
            padding: '25px',
            border: '2px solid #1565c0',
            borderRadius: '12px',
            backgroundColor: '#f0f8ff'
          }}>
            {/* Opción 1: Subir desde PC */}
            <div className="form-group" style={{ marginBottom: '25px' }}>
              <label style={{ 
                fontWeight: 'bold',
                fontSize: '16px',
                display: 'block',
                marginBottom: '12px',
                color: '#1a1a1a'
              }}>
                📁 Cargar desde tu computadora
              </label>
              <input
                id="imagen-input"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ 
                  display: 'block',
                  marginTop: '8px',
                  padding: '12px',
                  border: '2px solid #1565c0',
                  borderRadius: '8px',
                  backgroundColor: 'white',
                  width: '100%',
                  cursor: 'pointer',
                  fontSize: '14px',
                  transition: 'all 0.3s ease'
                }}
              />
              {newImage.preview && (
                <div style={{ 
                  marginTop: '15px',
                  padding: '15px',
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  border: '2px solid #4caf50',
                  animation: 'slideIn 0.3s ease'
                }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '10px', color: '#4caf50' }}>
                    ✓ Vista previa de la imagen:
                  </div>
                  <img 
                    src={newImage.preview} 
                    alt="Preview" 
                    style={{ 
                      maxWidth: '100%',
                      maxHeight: '250px',
                      borderRadius: '8px',
                      display: 'block',
                      margin: '0 auto',
                      objectFit: 'contain',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.15)'
                    }}
                  />
                </div>
              )}
            </div>

            {/* Separador */}
            <div style={{ 
              position: 'relative',
              textAlign: 'center',
              margin: '25px 0'
            }}>
              <div style={{
                position: 'absolute',
                top: '50%',
                left: 0,
                right: 0,
                height: '2px',
                backgroundColor: '#e0e0e0'
              }}></div>
              <span style={{
                position: 'relative',
                backgroundColor: '#f0f8ff',
                padding: '0 15px',
                color: '#666',
                fontWeight: 'bold',
                fontSize: '14px'
              }}>
                O
              </span>
            </div>

            {/* Opción 2: URL externa con botón para mostrar/ocultar */}
            <div className="form-group">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <label style={{ 
                  fontWeight: 'bold',
                  fontSize: '16px',
                  margin: 0,
                  color: '#1a1a1a'
                }}>
                  🌐 URL de imagen externa
                </label>
                <button
                  type="button"
                  onClick={() => setNewImage({ ...newImage, showUrlInput: !newImage.showUrlInput })}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: newImage.showUrlInput ? '#f44336' : '#1565c0',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: 'bold',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                  }}
                >
                  {newImage.showUrlInput ? '✕ Ocultar' : '+ Mostrar'}
                </button>
              </div>
              
              {newImage.showUrlInput && (
                <div style={{ 
                  padding: '15px',
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  border: '2px solid #1565c0',
                  animation: 'slideIn 0.3s ease'
                }}>
                  <textarea
                    placeholder="Pega aquí la URL completa de la imagen&#10;Ejemplo: https://ejemplo.com/producto/imagen.jpg"
                    value={newImage.url}
                    onChange={(e) => setNewImage({ ...newImage, url: e.target.value })}
                    rows="3"
                    style={{ 
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #ccc',
                      borderRadius: '6px',
                      fontFamily: 'monospace',
                      fontSize: '13px',
                      resize: 'vertical',
                      transition: 'border-color 0.3s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#1565c0'}
                    onBlur={(e) => e.target.style.borderColor = '#ccc'}
                  />
                </div>
              )}
            </div>

            {/* Checkbox para imagen principal */}
            <div style={{ 
              marginTop: '20px',
              padding: '15px',
              backgroundColor: '#fff8e1',
              borderRadius: '8px',
              border: '2px solid #ffc107'
            }}>
              <label style={{ 
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '15px',
                cursor: 'pointer',
                margin: 0
              }}>
                <input
                  type="checkbox"
                  checked={newImage.principal}
                  onChange={(e) => setNewImage({ ...newImage, principal: e.target.checked })}
                  style={{ width: '22px', height: '22px', cursor: 'pointer' }}
                />
                <div>
                  <div style={{ fontWeight: 'bold', color: '#f57c00' }}>
                    ⭐ Marcar como Imagen Principal
                  </div>
                  <small style={{ color: '#666' }}>
                    Esta será la primera imagen que verán tus clientes
                  </small>
                </div>
              </label>
            </div>

            <button 
              className="save-button"
              onClick={handleAddImage}
              disabled={!newImage.archivo && !newImage.url.trim()}
              style={{ 
                width: '100%',
                padding: '15px',
                fontSize: '16px',
                fontWeight: 'bold',
                marginTop: '20px',
                opacity: (!newImage.archivo && !newImage.url.trim()) ? 0.5 : 1,
                cursor: (!newImage.archivo && !newImage.url.trim()) ? 'not-allowed' : 'pointer',
              }}
            >
              ➕ Agregar Imagen a la Lista
            </button>
          </div>

          {/* Lista de imágenes agregadas */}
          {newProduct.imagenes.length > 0 ? (
            <div style={{ animation: 'fadeIn 0.5s ease' }}>
              <h4 style={{ marginBottom: '15px' }}>
                🖼️ Imágenes agregadas ({newProduct.imagenes.length})
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '15px' }}>
                {newProduct.imagenes.map((imagen, index) => (
                  <div key={imagen.id || index} style={{ 
                    border: imagen.principal ? '3px solid #1565c0' : '2px solid #e0e0e0', 
                    borderRadius: '8px', 
                    padding: '10px',
                    backgroundColor: imagen.principal ? '#e3f2fd' : 'white',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s ease',
                    position: 'relative'
                  }}>
                    {imagen.principal && (
                      <div style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        backgroundColor: '#1565c0',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        zIndex: 1
                      }}>
                        ⭐ PRINCIPAL
                      </div>
                    )}
                    <img 
                      src={imagen.preview || imagen.url || 'https://via.placeholder.com/150'} 
                      alt={`Imagen ${index + 1}`}
                      style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '5px', marginBottom: '10px' }}
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=Error'; }}
                    />
                    <div style={{ fontSize: '11px', marginBottom: '10px', color: '#666' }}>
                      {imagen.archivo ? `📁 ${imagen.archivo.name}` : `🌐 ${(imagen.url || '').substring(0, 30)}...`}
                    </div>
                    {imagen.principal && (
                      <div style={{ 
                        backgroundColor: '#1565c0', 
                        color: 'white', 
                        padding: '5px 10px', 
                        borderRadius: '5px', 
                        fontSize: '12px', 
                        marginBottom: '8px',
                        textAlign: 'center',
                        fontWeight: 'bold'
                      }}>
                        ⭐ PRINCIPAL
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: '5px' }}>
                      {!imagen.principal && (
                        <button
                          onClick={() => handleSetPrincipalImage(imagen.id)}
                          style={{
                            flex: 1,
                            padding: '8px',
                            backgroundColor: '#1565c0',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: 'bold'
                          }}
                        >
                          Establecer Principal
                        </button>
                      )}
                      <button
                        onClick={() => handleRemoveImage(imagen.id)}
                        style={{
                          flex: imagen.principal ? 1 : 0.4,
                          padding: '8px',
                          backgroundColor: '#d32f2f',
                          color: 'white',
                          border: 'none',
                          borderRadius: '5px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                        title="Eliminar imagen"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px', color: '#999', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
              <p style={{ fontSize: '18px', margin: '10px 0' }}>📷</p>
              <p style={{ margin: 0 }}>No hay imágenes agregadas.<br/>Agrega al menos una imagen para el producto.</p>
            </div>
          )}

          {/* Botones de Navegación */}
          <div style={{ 
            display: 'flex', 
            gap: '15px',
            justifyContent: 'space-between',
            marginTop: '30px',
            padding: '20px 0',
            borderTop: '2px solid #e0e0e0'
          }}>
            <button 
              onClick={() => setActiveTab('datos')}
              style={{
                flex: 1,
                padding: '12px 30px',
                fontSize: '16px',
                fontWeight: 'bold',
                backgroundColor: '#f5f5f5',
                color: '#333',
                border: '2px solid #ddd',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <span>←</span>
              Anterior: Datos del Producto
            </button>
            
            <button 
              onClick={() => setActiveTab('variantes')}
              disabled={newProduct.imagenes.length === 0}
              style={{
                flex: 1,
                padding: '12px 30px',
                fontSize: '16px',
                fontWeight: 'bold',
                backgroundColor: newProduct.imagenes.length > 0 ? '#1565c0' : '#ccc',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: newProduct.imagenes.length > 0 ? 'pointer' : 'not-allowed',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                opacity: newProduct.imagenes.length > 0 ? 1 : 0.5
              }}
            >
              Siguiente: Agregar Variantes
              <span>→</span>
            </button>
          </div>
        </div>
      )}

      {/* Pestaña de Variantes */}
      {activeTab === 'variantes' && (
        <div className="admin-form">
          <h3>🎨 Gestión de Variantes</h3>
          <p style={{ color: '#666', marginBottom: '20px' }}>
            Crea diferentes versiones de tu producto con distintas tallas, colores y precios.
            El SKU se generará automáticamente.
          </p>

          <div style={{ marginBottom: '20px', padding: '20px', border: '2px solid #1565c0', borderRadius: '8px', backgroundColor: '#f0f8ff' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
              {/* Color */}
              <div className="form-group">
                <label style={{ fontWeight: 'bold', fontSize: '15px' }}>🎨 Color *</label>
                <input
                  type="text"
                  placeholder="Ejemplo: Rojo, Azul, Verde"
                  value={newVariant.color}
                  onChange={(e) => setNewVariant({ ...newVariant, color: e.target.value })}
                  style={{ 
                    marginTop: '8px',
                    borderColor: newVariant.color.trim() === '' ? '#f44336' : '#ccc'
                  }}
                />
              </div>

              {/* Preview SKU Automático */}
              {newVariant.color.trim() !== '' && newProduct.nombre.trim() !== '' && (
                <div style={{ 
                  padding: '15px', 
                  backgroundColor: '#e8f5e9', 
                  borderRadius: '8px', 
                  border: '2px solid #4caf50',
                  gridColumn: 'span 2'
                }}>
                  <label style={{ fontWeight: 'bold', color: '#2e7d32', fontSize: '14px' }}>
                    ✨ SKU que se generará automáticamente:
                  </label>
                  <div style={{ 
                    marginTop: '8px', 
                    fontFamily: 'monospace', 
                    fontSize: '16px', 
                    fontWeight: 'bold',
                    color: '#1b5e20'
                  }}>
                    {newProduct.nombre.toUpperCase().replace(/\s+/g, '-').replace(/[^A-Z0-9-]/g, '').substring(0, 15)}-{newVariant.color.toUpperCase().replace(/\s+/g, '-').replace(/[^A-Z0-9-]/g, '')}-[TALLA]
                  </div>
                  <small style={{ color: '#558b2f', display: 'block', marginTop: '5px' }}>
                    Ejemplo: Si seleccionas S, M, L → se crearán 3 SKUs diferentes
                  </small>
                </div>
              )}

              {/* Precio */}
              <div className="form-group">
                <label style={{ fontWeight: 'bold', fontSize: '15px' }}>Precio *</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="99.99"
                  value={newVariant.precio}
                  onChange={(e) => setNewVariant({ ...newVariant, precio: e.target.value })}
                  style={{ marginTop: '8px' }}
                />
              </div>

              {/* Costo */}
              <div className="form-group">
                <label style={{ fontWeight: 'bold', fontSize: '15px' }}>Costo</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="50.00"
                  value={newVariant.costo}
                  onChange={(e) => setNewVariant({ ...newVariant, costo: e.target.value })}
                  style={{ marginTop: '8px' }}
                />
              </div>

              {/* Stock */}
              <div className="form-group">
                <label style={{ fontWeight: 'bold', fontSize: '15px' }}>Stock</label>
                <input
                  type="number"
                  placeholder="100"
                  value={newVariant.stock}
                  onChange={(e) => setNewVariant({ ...newVariant, stock: e.target.value })}
                  style={{ marginTop: '8px' }}
                />
              </div>

              {/* Barcode */}
              <div className="form-group">
                <label style={{ fontWeight: 'bold', fontSize: '15px' }}>Código de Barras</label>
                <input
                  type="text"
                  placeholder="1234567890123"
                  value={newVariant.barcode}
                  onChange={(e) => setNewVariant({ ...newVariant, barcode: e.target.value })}
                  style={{ marginTop: '8px' }}
                />
              </div>
            </div>

            {/* Selección de Tallas - NUEVO */}
            <div className="form-group" style={{ marginTop: '20px' }}>
              <label style={{ fontWeight: 'bold', fontSize: '16px', display: 'block', marginBottom: '12px' }}>
                Tallas * (Selecciona una o más)
              </label>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {tallas.map(talla => (
                  <button
                    key={talla}
                    type="button"
                    onClick={() => handleToggleTalla(talla)}
                    style={{
                      padding: '15px 30px',
                      fontSize: '18px',
                      fontWeight: 'bold',
                      border: '3px solid',
                      borderColor: newVariant.tallas.includes(talla) ? '#1565c0' : '#ccc',
                      backgroundColor: newVariant.tallas.includes(talla) ? '#1565c0' : 'white',
                      color: newVariant.tallas.includes(talla) ? 'white' : '#666',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      minWidth: '80px'
                    }}
                  >
                    {newVariant.tallas.includes(talla) ? '✓ ' : ''}{talla}
                  </button>
                ))}
              </div>
              {newVariant.tallas.length > 0 && (
                <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#e3f2fd', borderRadius: '5px' }}>
                  <strong>Tallas seleccionadas:</strong> {newVariant.tallas.join(', ')}
                  <br/>
                  <small>Se crearán {newVariant.tallas.length} variante(s)</small>
                </div>
              )}
            </div>

            {/* Estado */}
            <div className="form-group" style={{ marginTop: '15px' }}>
              <label style={{ fontWeight: 'bold', fontSize: '15px' }}>Estado</label>
              <select
                value={newVariant.estado}
                onChange={(e) => setNewVariant({ ...newVariant, estado: e.target.value })}
                style={{ marginTop: '8px' }}
              >
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>

            <button 
              className="save-button"
              onClick={handleAddVariant}
              disabled={
                newVariant.tallas.length === 0 ||
                !newVariant.color.trim() || 
                !newVariant.precio ||
                !newProduct.nombre.trim()
              }
              style={{ 
                marginTop: '20px', 
                width: '100%', 
                padding: '15px', 
                fontSize: '16px', 
                fontWeight: 'bold'
              }}
            >
              ➕ Agregar Variante(s) a la Lista
            </button>
          </div>

          {/* Lista de variantes agregadas */}
          {newProduct.variantes.length > 0 ? (
            <div>
              <h4>Variantes agregadas ({newProduct.variantes.length})</h4>
              <div className="table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>SKU</th>
                      <th>Talla</th>
                      <th>Color</th>
                      <th>Precio</th>
                      <th>Costo</th>
                      <th>Stock</th>
                      <th>Barcode</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {newProduct.variantes.map((variante, index) => (
                      <tr key={index}>
                        <td>{variante.sku}</td>
                        <td>{variante.talla || '-'}</td>
                        <td>{variante.color}</td>
                        <td>${parseFloat(variante.precio).toFixed(2)}</td>
                        <td>{variante.costo ? `$${parseFloat(variante.costo).toFixed(2)}` : '-'}</td>
                        <td>{variante.stock || 0}</td>
                        <td>{variante.barcode || '-'}</td>
                        <td>
                          <span style={{ 
                            padding: '3px 8px', 
                            borderRadius: '3px',
                            fontSize: '12px',
                            backgroundColor: variante.estado === 'activo' ? '#4caf50' : '#f44336',
                            color: 'white'
                          }}>
                            {variante.estado}
                          </span>
                        </td>
                        <td>
                          <button 
                            className="delete-button"
                            onClick={() => handleRemoveVariant(index)}
                            style={{ padding: '5px 10px', fontSize: '12px' }}
                          >
                            🗑️ Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '30px', color: '#999' }}>
              No hay variantes agregadas. Agrega al menos una variante para el producto.
            </div>
          )}

          {/* Botones de Navegación y Guardar */}
          <div style={{ 
            display: 'flex', 
            gap: '15px',
            justifyContent: 'space-between',
            marginTop: '30px',
            padding: '20px 0',
            borderTop: '2px solid #e0e0e0'
          }}>
            <button 
              onClick={() => setActiveTab('imagenes')}
              style={{
                flex: 1,
                padding: '12px 30px',
                fontSize: '16px',
                fontWeight: 'bold',
                backgroundColor: '#f5f5f5',
                color: '#333',
                border: '2px solid #ddd',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <span>←</span>
              Anterior: Imágenes del Producto
            </button>
          </div>

          {/* Botón de Guardar/Actualizar - SOLO EN PASO 3 */}
          <div style={{ 
            marginTop: '20px',
            padding: '20px',
            backgroundColor: '#f0f8ff',
            border: '2px solid #1565c0',
            borderRadius: '10px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            <h4 style={{ marginTop: 0, color: '#1565c0', textAlign: 'center' }}>
              🎉 ¡Todo listo para guardar!
            </h4>
            
            {/* Validaciones finales */}
            {(!newProduct.nombre || !newProduct.categoria) && (
              <div style={{ 
                padding: '12px', 
                backgroundColor: '#fff3cd', 
                borderRadius: '5px',
                marginBottom: '15px',
                border: '1px solid #ffc107',
                textAlign: 'center'
              }}>
                <strong>⚠️ Faltan datos básicos:</strong> Complete nombre y categoría en el Paso 1
              </div>
            )}
            
            {newProduct.imagenes.length === 0 && (
              <div style={{ 
                padding: '12px', 
                backgroundColor: '#fff3cd', 
                borderRadius: '5px',
                marginBottom: '15px',
                border: '1px solid #ffc107',
                textAlign: 'center'
              }}>
                <strong>⚠️ Sin imágenes:</strong> Agregue al menos una imagen en el Paso 2
              </div>
            )}
            
            {newProduct.variantes.length === 0 && (
              <div style={{ 
                padding: '12px', 
                backgroundColor: '#fff3cd', 
                borderRadius: '5px',
                marginBottom: '15px',
                border: '1px solid #ffc107',
                textAlign: 'center'
              }}>
                <strong>⚠️ Sin variantes:</strong> Agregue al menos una variante arriba
              </div>
            )}

            {/* Resumen rápido */}
            {newProduct.nombre && newProduct.imagenes.length > 0 && newProduct.variantes.length > 0 && (
              <div style={{ 
                padding: '15px', 
                backgroundColor: '#e8f5e9', 
                borderRadius: '8px',
                marginBottom: '15px',
                border: '2px solid #4caf50',
                textAlign: 'center'
              }}>
                <strong style={{ color: '#2e7d32' }}>✅ Producto completo:</strong><br/>
                <span style={{ fontSize: '14px', color: '#558b2f' }}>
                  {newProduct.nombre} • {newProduct.imagenes.length} imagen(es) • {newProduct.variantes.length} variante(s)
                </span>
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                className="save-button"
                onClick={handleAddProduct}
                disabled={
                  loading || 
                  !newProduct.nombre || 
                  !newProduct.categoria ||
                  newProduct.imagenes.length === 0 ||
                  newProduct.variantes.length === 0
                }
                style={{ 
                  flex: 1,
                  padding: '18px',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  cursor: (newProduct.nombre && newProduct.categoria && newProduct.imagenes.length > 0 && newProduct.variantes.length > 0) 
                    ? 'pointer' 
                    : 'not-allowed',
                  opacity: (newProduct.nombre && newProduct.categoria && newProduct.imagenes.length > 0 && newProduct.variantes.length > 0) 
                    ? 1 
                    : 0.5
                }}
              >
                {loading ? '⏳ Guardando...' : (editMode ? '💾 Actualizar Producto' : '💾 Guardar Producto')}
              </button>
              
              {editMode && (
                <button 
                  className="delete-button"
                  onClick={handleCancelEdit}
                  disabled={loading}
                  style={{ padding: '18px 35px', fontSize: '18px' }}
                >
                  ❌ Cancelar
                </button>
              )}
            </div>

            <div style={{ marginTop: '12px', fontSize: '13px', color: '#666', textAlign: 'center' }}>
              ℹ️ El producto se guardará con todas sus imágenes y variantes en la base de datos
            </div>
          </div>
        </div>
      )}

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Código</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Descripción</th>
              <th>Estado</th>
              <th>Imágenes</th>
              <th>Variantes</th>
              <th>Creado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 && !loading ? (
              <tr>
                <td colSpan="10" style={{ textAlign: 'center', padding: '20px' }}>
                  No hay productos registrados
                </td>
              </tr>
            ) : (
              products.map(product => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>
                    <code style={{ 
                      backgroundColor: '#f0f0f0', 
                      padding: '2px 6px', 
                      borderRadius: '3px',
                      fontSize: '11px'
                    }}>
                      {product.codigo || '-'}
                    </code>
                  </td>
                  <td><strong>{product.nombre}</strong></td>
                  <td>
                    <span style={{ 
                      padding: '4px 8px', 
                      backgroundColor: '#e3f2fd', 
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      {product.categoria_nombre}
                    </span>
                    {product.categoria_padre_nombre && (
                      <small style={{ display: 'block', color: '#666', fontSize: '10px', marginTop: '2px' }}>
                        ↳ {product.categoria_padre_nombre}
                      </small>
                    )}
                  </td>
                  <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {product.descripcion || <span style={{ color: '#999' }}>Sin descripción</span>}
                  </td>
                  <td>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      backgroundColor: product.estado === 'activo' ? '#d4edda' : '#f8d7da',
                      color: product.estado === 'activo' ? '#155724' : '#721c24',
                      fontSize: '12px'
                    }}>
                      {product.estado}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {product.imagenes && product.imagenes.length > 0 ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                        {/* Miniatura de la imagen principal */}
                        {(() => {
                          const imagenPrincipal = product.imagenes.find(img => img.principal) || product.imagenes[0];
                          return imagenPrincipal ? (
                            <img 
                              src={imagenPrincipal.imagen_url || imagenPrincipal.url} 
                              alt={product.nombre}
                              style={{
                                width: '40px',
                                height: '40px',
                                objectFit: 'cover',
                                borderRadius: '4px',
                                border: '2px solid #1565c0'
                              }}
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          ) : null;
                        })()}
                        <span style={{
                          padding: '4px 8px',
                          backgroundColor: '#fff3cd',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: 'bold'
                        }}>
                          📷 {product.imagenes.length}
                        </span>
                      </div>
                    ) : (
                      <span style={{ color: '#999', fontSize: '12px' }}>-</span>
                    )}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {product.variantes && product.variantes.length > 0 ? (
                      <span style={{
                        padding: '4px 8px',
                        backgroundColor: '#e3f2fd',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        🎨 {product.variantes.length}
                      </span>
                    ) : (
                      <span style={{ color: '#999', fontSize: '12px' }}>-</span>
                    )}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {new Date(product.creado_en).toLocaleDateString()}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="edit-button"
                        onClick={() => handleEdit(product)}
                        disabled={loading}
                        title="Editar producto"
                      >
                        ✏️
                      </button>
                      <button 
                        className="delete-button"
                        onClick={() => handleDelete(product.id)}
                        disabled={loading}
                        title="Eliminar producto"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
