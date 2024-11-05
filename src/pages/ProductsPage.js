// src/pages/ProductsPage.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../redux/actions/productActions';
import { 
    updateFilter, 
    updatePriceRange, 
    removeFilter, 
    setSearchQuery,
    setSortBy
} from '../redux/actions/filterActions';
import ProductList from '../components/ProductList';
import FilterPanel from '../components/Filters/FilterPanel';
import SearchAndSort from '../components/Filters/SearchAndSort';
import ActiveFilters from '../components/Filters/ActiveFilters';

const ProductsPage = () => {
    const dispatch = useDispatch();
    
    // Selectors
    const products = useSelector((state) => state.products.allProducts);
    const activeFilters = useSelector((state) => state.filters.activeFilters);
    const searchQuery = useSelector((state) => state.filters.searchQuery);
    const sortBy = useSelector((state) => state.filters.sortBy);

    // Cargar productos cuando el componente se monta
    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    // Función para aplicar filtros
    const getFilteredProducts = () => {
        if (!products) return [];
        
        let result = [...products];

        // Aplicar búsqueda
        if (searchQuery) {
            result = result.filter(product =>
                product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Aplicar filtros (OR dentro de cada categoría, AND entre categorías)
        Object.entries(activeFilters).forEach(([filterType, filterValues]) => {
            if (filterType === 'priceRange') {
                result = result.filter(product =>
                    product.price >= filterValues.min && product.price <= filterValues.max
                );
            } else if (filterValues && filterValues.length > 0) {
                result = result.filter(product =>
                    filterValues.includes(product[filterType])
                );
            }
        });

        // Aplicar ordenamiento
        switch (sortBy) {
            case 'price-asc':
                result.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                result.sort((a, b) => b.price - a.price);
                break;
            case 'name-asc':
                result.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name-desc':
                result.sort((a, b) => b.name.localeCompare(a.name));
                break;
            default:
                result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        }

        return result;
    };

    // Handlers para los filtros
    const handleFilterChange = (filterType, value, isChecked) => {
        dispatch(updateFilter(filterType, value, isChecked));
    };

    const handlePriceRangeChange = (min, max) => {
        dispatch(updatePriceRange(min, max));
    };

    const handleSearchChange = (query) => {
        dispatch(setSearchQuery(query));
    };

    const handleSortChange = (value) => {
        dispatch(setSortBy(value));
    };

    const handleRemoveFilter = (filterType, value) => {
        dispatch(removeFilter(filterType, value));
    };

    // Obtener productos filtrados
    const filteredProducts = getFilteredProducts();

    return (
        <div className="vintage-bg min-h-screen py-10">
            <div className="container mx-auto px-6 font-vintage">
                <h1 className="text-4xl font-bold text-center mb-10 text-vintage-accent">
                    Nuestros Productos
                </h1>
                <div className="flex gap-6">
                    {/* Panel de filtros (1/4 del ancho) */}
                    <div className="w-1/4">
                        <FilterPanel
                            products={products}
                            activeFilters={activeFilters}
                            onFilterChange={handleFilterChange}
                            onPriceRangeChange={handlePriceRangeChange}
                        />
                    </div>
                    
                    {/* Contenido principal (3/4 del ancho) */}
                    <div className="w-3/4">
                        {/* Barra de búsqueda y ordenamiento */}
                        <SearchAndSort
                            searchQuery={searchQuery}
                            sortBy={sortBy}
                            onSearchChange={handleSearchChange}
                            onSortChange={handleSortChange}
                        />
                        
                        {/* Filtros activos y contador de resultados */}
                        <ActiveFilters
                            activeFilters={activeFilters}
                            totalProducts={filteredProducts.length}
                            onRemoveFilter={handleRemoveFilter}
                        />
                        
                        {/* Lista de productos */}
                        <ProductList products={filteredProducts} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductsPage;