// src/components/Admin/AdminProductPanel.js
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Plus, Search, Filter, Grid, List, Download, Upload, 
  Edit, Trash2, EyeIcon
} from 'lucide-react';
import { toast } from 'react-toastify';
import { fetchProducts, addProduct, updateProduct, deleteProduct } from '../../redux/actions/productActions';
import ProductModal from './Modals/ProductModal';
import ConfirmModal from './Modals/ConfirmModal';
import { filterConfig } from '../../config/filterConfig';

const AdminProductPanel = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.allProducts);
  
  // Estados locales
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [viewMode, setViewMode] = useState('table'); // 'table' o 'grid'
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    category: '',
    brand: '',
    style: '',
    era: '',
    sex: ''
  });
  const [sortConfig, setSortConfig] = useState({
    key: 'created_at',
    direction: 'desc'
  });

  // Cargar productos
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Funciones de filtrado y ordenamiento
  const filteredProducts = products
    ?.filter(product => {
      const matchesSearch = 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilters = Object.entries(activeFilters).every(([key, value]) => 
        !value || product[key] === value
      );

      return matchesSearch && matchesFilters;
    })
    .sort((a, b) => {
      if (sortConfig.direction === 'asc') {
        return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
      }
      return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
    });

  // Handlers
  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleAddEdit = (product = null) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = (product) => {
    setSelectedProduct(product);
    setIsConfirmModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await dispatch(deleteProduct(selectedProduct.id));
      toast.success('Producto eliminado correctamente');
      setIsConfirmModalOpen(false);
    } catch (error) {
      toast.error('Error al eliminar el producto');
    }
  };

  const handleSaveProduct = async (productData) => {
    try {
      if (selectedProduct) {
        await dispatch(updateProduct(selectedProduct.id, productData));
        toast.success('Producto actualizado correctamente');
      } else {
        await dispatch(addProduct(productData));
        toast.success('Producto agregado correctamente');
      }
      setIsModalOpen(false);
    } catch (error) {
      toast.error('Error al guardar el producto');
    }
  };

  // Renders condicionales
  const renderTableView = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Imagen
            </th>
            <th 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('name')}
            >
              Nombre
            </th>
            <th 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('price')}
            >
              Precio
            </th>
            <th 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('stock')}
            >
              Stock
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Categoría
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredProducts.map((product) => (
            <tr key={product.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <img 
                  src={product.image_url} 
                  alt={product.name} 
                  className="h-16 w-16 object-cover rounded"
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{product.name}</div>
                <div className="text-sm text-gray-500">{product.serial_number}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">${product.price}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  product.stock > 10 ? 'bg-green-100 text-green-800' : 
                  product.stock > 0 ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-red-100 text-red-800'
                }`}>
                  {product.stock}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {product.category}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  onClick={() => handleAddEdit(product)}
                  className="text-indigo-600 hover:text-indigo-900 mr-3"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => handleDelete(product)}
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredProducts.map((product) => (
        <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
          <img 
            src={product.image_url} 
            alt={product.name} 
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
            <p className="text-sm text-gray-500 mt-1">{product.description}</p>
            <div className="mt-2 flex justify-between items-center">
              <span className="text-lg font-bold text-gray-900">${product.price}</span>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                product.stock > 10 ? 'bg-green-100 text-green-800' : 
                product.stock > 0 ? 'bg-yellow-100 text-yellow-800' : 
                'bg-red-100 text-red-800'
              }`}>
                Stock: {product.stock}
              </span>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => handleAddEdit(product)}
                className="text-indigo-600 hover:text-indigo-900"
              >
                <Edit size={18} />
              </button>
              <button
                onClick={() => handleDelete(product)}
                className="text-red-600 hover:text-red-900"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Gestión de Productos</h2>
        <button
          onClick={() => handleAddEdit()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <Plus size={20} className="mr-2" />
          Agregar Producto
        </button>
      </div>

      {/* Barra de herramientas */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-lg shadow-sm">
        {/* Búsqueda */}
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>

        {/* Filtros y Vista */}
        <div className="flex items-center space-x-4">
          {/* Selector de vista */}
          <div className="flex items-center space-x-2 border rounded-lg p-1">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded ${viewMode === 'table' ? 'bg-gray-100' : ''}`}
            >
              <List size={20} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-gray-100' : ''}`}
            >
              <Grid size={20} />
            </button>
          </div>

          {/* Exportar/Importar */}
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <Download size={20} />
          </button>
        </div>
      </div>

      {/* Filtros activos */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(activeFilters).map(([key, value]) => 
          value && (
            <span 
              key={key}
              className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full flex items-center"
            >
              {key}: {value}
              <button
                onClick={() => setActiveFilters(prev => ({ ...prev, [key]: '' }))}
                className="ml-2"
              >
                ×
              </button>
            </span>
          )
        )}
      </div>

      {/* Lista de productos */}
      <div className="bg-white rounded-lg shadow">
        {viewMode === 'table' ? renderTableView() : renderGridView()}
      </div>

      {/* Modales */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProduct}
        product={selectedProduct}
      />

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={confirmDelete}
        title="Eliminar Producto"
        message="¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer."
      />
    </div>
  );
};

export default AdminProductPanel;