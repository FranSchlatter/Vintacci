import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Search, Download } from 'lucide-react';
import { toast } from 'react-toastify';
import { 
    fetchProducts, 
    addProduct, 
    updateProduct, 
    deleteProduct 
} from '../../redux/actions/productActions';
import { fetchCategories } from '../../redux/actions/categoryActions';
import { fetchOptions } from '../../redux/actions/productOptionActions';
import { fetchTags } from '../../redux/actions/tagActions';
import { filterProducts, sortProducts } from '../../utils/filterUtils';
import ProductModal from './Modals/ProductModal';
import ConfirmModal from './Modals/ConfirmModal';
import FilterPanel from './FilterPanel';
import ProductRow from '../common/ProductRow';

const AdminProductPanel = () => {
    const dispatch = useDispatch();

    // Selectors con loading states
    const { 
        allProducts: products, 
        loading: productsLoading,
        error: productsError 
    } = useSelector((state) => state.products);
    
    const categories = useSelector((state) => state.categories.categories);
    const productOptions = useSelector((state) => state.productOptions.options);
    const tags = useSelector((state) => state.tags.tags);

    // Estados locales
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeFilters, setActiveFilters] = useState({
        category: '',
        brand: '',
        status: '',
        tags: [],
        options: {
            color: [],
            size: [],
        },
        price: {
            min: 0,
            max: 999999,
        },
    });
    const [sortConfig, setSortConfig] = useState({
        key: 'created_at',
        direction: 'desc',
    });

    // Cargar datos iniciales
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                await Promise.all([
                    dispatch(fetchProducts()),
                    dispatch(fetchCategories()),
                    dispatch(fetchOptions()),
                    dispatch(fetchTags())
                ]);
            } catch (error) {
                toast.error('Error al cargar los datos iniciales');
            }
        };

        loadInitialData();
    }, [dispatch]);

    // Handlers de filtros
    const handleFilterChange = (filterType, value, checked = null) => {
        setActiveFilters((prev) => {
            if (filterType === 'price') {
                return {
                    ...prev,
                    price: value,
                };
            }

            if (filterType.startsWith('options.')) {
                const [, optionType] = filterType.split('.');
                const currentOptions = [...prev.options[optionType]];

                if (checked === true) {
                    currentOptions.push(value);
                } else if (checked === false) {
                    const index = currentOptions.indexOf(value);
                    if (index > -1) currentOptions.splice(index, 1);
                }

                return {
                    ...prev,
                    options: {
                        ...prev.options,
                        [optionType]: currentOptions,
                    },
                };
            }

            if (Array.isArray(prev[filterType])) {
                if (checked === true) {
                    return {
                        ...prev,
                        [filterType]: [...prev[filterType], value],
                    };
                } else if (checked === false) {
                    return {
                        ...prev,
                        [filterType]: prev[filterType].filter((v) => v !== value),
                    };
                }
            }

            return {
                ...prev,
                [filterType]: value,
            };
        });
    };

    const handleRemoveFilter = (filterType, value = null) => {
        setActiveFilters((prev) => {
            if (filterType === 'price') {
                return {
                    ...prev,
                    price: { min: 0, max: 999999 },
                };
            }

            if (filterType.startsWith('options.')) {
                const [, optionType] = filterType.split('.');
                return {
                    ...prev,
                    options: {
                        ...prev.options,
                        [optionType]: value ? prev.options[optionType].filter((v) => v !== value) : [],
                    },
                };
            }

            if (Array.isArray(prev[filterType])) {
                return {
                    ...prev,
                    [filterType]: value ? prev[filterType].filter((v) => v !== value) : [],
                };
            }

            return {
                ...prev,
                [filterType]: '',
            };
        });
    };

    const handleSort = (key) => {
        setSortConfig((prev) => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
        }));
    };

    // Handlers CRUD
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
            setIsSubmitting(true);
            await dispatch(deleteProduct(selectedProduct.id));
            toast.success('Producto eliminado correctamente');
            setIsConfirmModalOpen(false);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error al eliminar el producto');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSaveProduct = async (productData) => {
        try {
            setIsSubmitting(true);

            if (!productData.variants?.length) {
                toast.error('El producto debe tener al menos una variante');
                return;
            }

            if (selectedProduct) {
                await dispatch(updateProduct(selectedProduct.id, productData));
                toast.success('Producto actualizado correctamente');
            } else {
                await dispatch(addProduct(productData));
                toast.success('Producto agregado correctamente');
            }

            setIsModalOpen(false);
            setSelectedProduct(null);
        } catch (error) {
            console.error('Error:', error);
            toast.error(error.response?.data?.message || 'Error al guardar el producto');
            throw error;
        } finally {
            setIsSubmitting(false);
        }
    };

    // Filtrado y ordenamiento
    const filteredProducts = filterProducts(products, activeFilters)?.filter((product) => {
        const searchTermLower = searchTerm.toLowerCase();
        return (
            product.name.toLowerCase().includes(searchTermLower) ||
            product.description.toLowerCase().includes(searchTermLower) ||
            product.brand.toLowerCase().includes(searchTermLower)
        );
    });

    const sortedProducts = sortProducts(filteredProducts, sortConfig);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                    Gestión de Productos
                </h2>
                <button
                    onClick={() => handleAddEdit()}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    disabled={isSubmitting}
                >
                    <Plus className="h-5 w-5 mr-2" />
                    Agregar Producto
                </button>
            </div>

            {/* Barra de herramientas */}
            <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
                <div className="relative flex-1 max-w-lg">
                    <input
                        type="text"
                        placeholder="Buscar productos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                </div>

                <button 
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                    title="Exportar productos"
                >
                    <Download size={20} />
                </button>
            </div>

            {/* Contenido principal */}
            <div className="flex gap-6">
                {/* Panel de filtros */}
                <div className="w-64 flex-shrink-0">
                    <FilterPanel
                        categories={categories}
                        productOptions={productOptions}
                        tags={tags}
                        activeFilters={activeFilters}
                        onFilterChange={handleFilterChange}
                        onRemoveFilter={handleRemoveFilter}
                    />
                </div>

                {/* Lista de productos */}
                <div className="flex-1">
                    {productsError ? (
                        <div className="text-center py-8 bg-red-50 rounded-lg">
                            <p className="text-red-600">{productsError}</p>
                        </div>
                    ) : productsLoading ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500">Cargando productos...</p>
                        </div>
                    ) : sortedProducts.length === 0 ? (
                        <div className="text-center py-8 bg-gray-50 rounded-lg">
                            <p className="text-gray-500">No se encontraron productos</p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr>
                                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Imagen
                                    </th>
                                    <th 
                                        className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort('name')}
                                    >
                                        Nombre {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                    </th>
                                    <th 
                                        className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort('category')}
                                    >
                                        Categoría {sortConfig.key === 'category' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                    </th>
                                    <th 
                                        className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort('brand')}
                                    >
                                        Marca {sortConfig.key === 'brand' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                    </th>
                                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tags
                                    </th>
                                    <th 
                                        className="px-6 py-3 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort('variants')}
                                    >
                                        Variantes {sortConfig.key === 'variants' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                    </th>
                                    <th 
                                        className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort('status')}
                                    >
                                        Estado {sortConfig.key === 'status' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                    </th>
                                    <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {sortedProducts.map((product) => (
                                        <ProductRow
                                            key={product.id}
                                            product={product}
                                            onEdit={handleAddEdit}
                                            onDelete={handleDelete}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Modales */}
            <ProductModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedProduct(null);
                }}
                onSave={handleSaveProduct}
                product={selectedProduct}
                categories={categories}
                productOptions={productOptions}
                tags={tags}
            />

            <ConfirmModal
                isOpen={isConfirmModalOpen}
                onClose={() => {
                    setIsConfirmModalOpen(false);
                    setSelectedProduct(null);
                }}
                onConfirm={confirmDelete}
                title="Eliminar Producto"
                message="¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer."
                isSubmitting={isSubmitting}
            />
        </div>
    );
};

export default AdminProductPanel;