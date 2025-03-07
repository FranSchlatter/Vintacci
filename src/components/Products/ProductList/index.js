import React, { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, List } from 'lucide-react';
import { setSortBy } from '../../../redux/actions/filterActions';
import Filters from '../Filters';
import GridView from './GridView';
import ListView from './ListView';
import Pagination from './Pagination';

const ProductList = () => {
    const dispatch = useDispatch();
    
    // Estados y selectores
    const { allProducts, loading, error } = useSelector(state => state.products);
    const { activeFilters, sortBy } = useSelector(state => state.filters);
    const [viewMode, setViewMode] = useState('grid');
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(20);

    const processedProducts = allProducts
    
    // Aplicar filtros a los productos
    const filteredProducts = useMemo(() => {
        if (!processedProducts?.length) return [];

        return processedProducts.filter(product => {
            // Filtro por búsqueda
            if (activeFilters.search) {
                const searchTerm = activeFilters.search.toLowerCase();
                const searchMatch = 
                    product.name.toLowerCase().includes(searchTerm)
                if (!searchMatch) return false;
            }

            // Filtro por category
            if (activeFilters.category?.length > 0) {
                const productCategoryIds = product?.AssociatedToCat?.map(category => category.id);
                if (!activeFilters.category.some(categoryId => productCategoryIds.includes(categoryId))) {
                    return false;
                }
            }

            // Filtro por tags
            if (activeFilters.tags?.length > 0) {
                const tagsByType = {};
                product.AssociatedToTag?.forEach(tag => {
                    if (!tagsByType[tag.type]) tagsByType[tag.type] = [];
                    tagsByType[tag.type].push(tag.id);
                });

                const selectedTagsByType = {};
                activeFilters.tags.forEach(tagId => {
                    const tag = allProducts.flatMap(p => p.AssociatedToTag).find(t => t.id === tagId);
                    if (tag) {
                        if (!selectedTagsByType[tag.type]) selectedTagsByType[tag.type] = [];
                        selectedTagsByType[tag.type].push(tagId);
                    }
                });

                const allTypesMatch = Object.keys(selectedTagsByType).every(type =>
                    selectedTagsByType[type].some(tagId => tagsByType[type]?.includes(tagId))
                );

                if (!allTypesMatch) return false;
            }

            // Filtro por rango de precio
            if (activeFilters.priceRange) {
                const minPrice = Number(activeFilters.priceRange.min) || 0;
                const maxPrice = Number(activeFilters.priceRange.max) || Infinity;
                
                // Un producto coincide si alguna de sus variantes está en el rango
                const priceInRange = product.ProductVariants.some(variant => {
                    const price = Number(variant.discountPrice || variant.price);
                    return price >= minPrice && price <= maxPrice;
                });

                if (!priceInRange) return false;
            }

            // Filtro por opciones de variante
            if (activeFilters.variantOptions) {
                for (const [type, selectedOptions] of Object.entries(activeFilters.variantOptions)) {
                    if (selectedOptions.length === 0) continue;

                    // Verificar si alguna variante activa tiene la opción seleccionada
                    const hasMatchingOption = product.activeVariants.some(variant =>
                        variant.ProductOptions.some(option =>
                            option.type === type && selectedOptions.includes(option.id)
                        )
                    );

                    if (!hasMatchingOption) return false;
                }
            }

            return true;
        });
    }, [allProducts, processedProducts, activeFilters]);

    // Ordenar productos
    const sortedProducts = useMemo(() => {
        if (!filteredProducts.length) return [];

        const sorted = [...filteredProducts];
        
        switch (sortBy) {
            case 'price-low':
                return sorted.sort((a, b) => a.price - b.price);
            case 'price-high':
                return sorted.sort((a, b) => b.price - a.price);
            case 'newest':
                return sorted.sort((a, b) => {
                    const dateA = new Date(a.createdAt);
                    const dateB = new Date(b.createdAt);
                    return dateB - dateA;
                });
            default:
                return sorted;
        }
    }, [filteredProducts, sortBy]);

    // Paginación
    const currentProducts = useMemo(() => {
        const indexOfLastProduct = currentPage * productsPerPage;
        const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
        return sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    }, [sortedProducts, currentPage, productsPerPage]);

    // Handlers
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo(0, 0);
    };

    const handleSortChange = (option) => {
        dispatch(setSortBy(option));
        setCurrentPage(1);
    };

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

    return (
        <div className="flex flex-col lg:flex-row gap-8">
            <aside className="lg:w-80 flex-shrink-0">
                <Filters />
            </aside>

            <main className="flex-1">
                <div className="flex justify-between items-center mb-6">
                    <div className="text-sm text-gray-500">
                        {sortedProducts.length} productos encontrados
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <select
                            value={sortBy}
                            onChange={(e) => handleSortChange(e.target.value)}
                            className="border rounded-lg px-3 py-2 text-sm"
                        >
                            <option value="newest">Más recientes</option>
                            <option value="price-low">Menor precio</option>
                            <option value="price-high">Mayor precio</option>
                        </select>

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

                {!sortedProducts.length ? (
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

                        {sortedProducts.length > productsPerPage && (
                            <Pagination
                                currentPage={currentPage}
                                totalProducts={sortedProducts.length}
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