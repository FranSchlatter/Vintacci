import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, List } from 'lucide-react';
import { setSortBy } from '../../../redux/actions/filterActions';
import { fetchProducts } from '../../../redux/actions/productActions';
import Filters from '../Filters';
import GridView from './GridView';
import ListView from './ListView';
import Pagination from './Pagination';

const ProductList = () => {
    const dispatch = useDispatch();

    // Selectores de Redux
    const { allProducts, loading, error } = useSelector(state => state.products);
    const { activeFilters, sortBy } = useSelector(state => state.filters);

    // Estados locales
    const [viewMode, setViewMode] = useState('grid');
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(20);

    // Fetch productos cuando cambian filtros, sort o página
    useEffect(() => {
        dispatch(fetchProducts({
            page: currentPage,
            limit: productsPerPage,
            categoryIds: activeFilters.category,
            tagIds: activeFilters.tags,
            name: activeFilters.search,
            sortBy
        }));
    }, [dispatch, activeFilters, sortBy, currentPage, productsPerPage]);

    // Handlers
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo(0, 0);
    };

    const handleSortChange = (option) => {
        dispatch(setSortBy(option));
        setCurrentPage(1); // Reiniciar a la primera página al cambiar el orden
    };

    // Productos y total
    const currentProducts = allProducts.products || [];
    const totalProducts = allProducts.totalItems || 0;

    // Render cargando
    if (loading) {
        return (
            <div className="flex flex-col lg:flex-row gap-8">
                <aside className="lg:w-64 flex-shrink-0">
                    <Filters />
                </aside>
                <main className="flex-1">
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-blue-600" />
                    </div>
                </main>
            </div>
        );
    }

    // Render error
    if (error) {
        return (
            <div className="flex flex-col lg:flex-row gap-8">
                <aside className="lg:w-64 flex-shrink-0">
                    <Filters />
                </aside>
                <main className="flex-1">
                    <div className="text-center py-12 text-red-600">
                        {error}
                    </div>
                </main>
            </div>
        );
    }

    // Render final
    return (
        <div className="flex flex-col lg:flex-row gap-8">
            {/* Filtros */}
            <aside className="lg:w-80 flex-shrink-0">
                <Filters />
            </aside>

            {/* Productos */}
            <main className="flex-1">
                <div className="flex justify-between items-center mb-6">
                    <div className="text-sm text-gray-500">
                        {totalProducts} productos encontrados
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Orden */}
                        <select
                            value={sortBy}
                            onChange={(e) => handleSortChange(e.target.value)}
                            className="border rounded-lg px-3 py-2 text-sm"
                        >
                            <option value="newest">Más recientes</option>
                            <option value="price-low">Menor precio</option>
                            <option value="price-high">Mayor precio</option>
                        </select>

                        {/* Vista grid/list */}
                        <div className="flex items-center gap-2 border rounded-lg p-1">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-1 rounded ${viewMode === 'grid' ? 'bg-gray-100' : ''}`}
                            >
                                <Grid className="h-5 w-5" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-1 rounded ${viewMode === 'list' ? 'bg-gray-100' : ''}`}
                            >
                                <List className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Lista de productos */}
                {!currentProducts.length ? (
                    <div className="text-center py-12 text-gray-500">
                        No se encontraron productos que coincidan con los filtros seleccionados
                    </div>
                ) : (
                    <>
                        {viewMode === 'grid' ? (
                            <GridView products={currentProducts} />
                        ) : (
                            <ListView products={currentProducts} />
                        )}

                        {/* Paginación */}
                        {totalProducts > productsPerPage && (
                            <Pagination
                                currentPage={currentPage}
                                totalProducts={totalProducts}
                                productsPerPage={productsPerPage}
                                onPageChange={handlePageChange}
                            />
                        )}
                    </>
                )}
            </main>
        </div>
    );
};

export default ProductList;