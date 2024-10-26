// src/pages/ProductsPage.js
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../redux/actions/productActions';
import ProductList from '../components/ProductList';
import FilterPanel from '../components/Filters/FilterPanel';
import SearchAndSort from '../components/Filters/SearchAndSort';
import ActiveFilters from '../components/Filters/ActiveFilters';

const ProductsPage = () => {
    const dispatch = useDispatch();
    const products = useSelector((state) => state.products.allProducts);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [activeFilters, setActiveFilters] = useState({
        category: [],
        brand: [],
        style: [],
        era: [],
        size: [],
        sex: [],
        color: [],
        material: [],
        priceRange: { min: 0, max: 999999 }
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('newest');

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    useEffect(() => {
        applyFilters();
    }, [products, activeFilters, searchQuery, sortBy]);

    const applyFilters = () => {
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
            } else if (filterValues.length > 0) {
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
                // 'newest' - asumiendo que tienes un campo createdAt
                result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }

        setFilteredProducts(result);
    };

    const handleFilterChange = (filterType, value, isChecked) => {
        setActiveFilters(prev => ({
            ...prev,
            [filterType]: isChecked
                ? [...prev[filterType], value]
                : prev[filterType].filter(v => v !== value)
        }));
    };

    const handlePriceRangeChange = (min, max) => {
        setActiveFilters(prev => ({
            ...prev,
            priceRange: { min, max }
        }));
    };

    const handleSearchChange = (query) => {
        setSearchQuery(query);
    };

    const handleSortChange = (value) => {
        setSortBy(value);
    };

    const removeFilter = (filterType, value) => {
        if (filterType === 'priceRange') {
            setActiveFilters(prev => ({
                ...prev,
                priceRange: { min: 0, max: 999999 }
            }));
        } else {
            setActiveFilters(prev => ({
                ...prev,
                [filterType]: prev[filterType].filter(v => v !== value)
            }));
        }
    };

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
                            onRemoveFilter={removeFilter}
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

// dispatch > función es enviar acciones para modificar el estado global.
// useSelector es un hook que permite acceder al estado.

// Uso de useSelector:
// Cuando usas useSelector en tu componente (por ejemplo, en ProductsPage), estás extrayendo datos específicos del "store".
// En el código const products = useSelector((state) => state.products.allProducts);, lo que haces es acceder a:
// state: El estado global del store.
// state.products: La parte del estado relacionada con los productos, que se obtiene del productReducer.
// state.products.products: Finalmente, accedes al array de productos almacenados en la propiedad products de products.
// const products = useSelector((myState) => myState.products.products); 
// Al usar este hook, el componente se volverá a renderizar automáticamente cada vez que la parte del estado que estamos seleccionando cambie.

// useEffect y fetchProducts:
// useEffect es un hook que permite manejar efectos secundarios en componentes funcionales. En este caso, se utiliza para realizar una acción (fetch de productos) cuando el componente se monta.
// fetchProducts es una acción que se supone que realiza una solicitud a una API para obtener la lista de productos. Esta función será asíncrona y posiblemente devolverá una acción con el tipo correspondiente y los datos obtenidos, que luego será manejada por un reducer para actualizar el estado en Redux.
// El arreglo de dependencias [dispatch] asegura que useEffect solo se ejecute una vez al montar el componente, porque dispatch no cambia, previniendo llamadas innecesarias a la API.



