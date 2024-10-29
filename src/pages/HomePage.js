// src/pages/Homepage.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setActiveFilters } from '../redux/actions/filterActions';

const Homepage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const mainCategories = [
    {
      title: 'Buzos',
      description: 'Clásicos y vintage',
      image: 'https://i.pinimg.com/736x/cd/ae/52/cdae52da096f882cb289c0d722c21ecf.jpg'
    },
    {
      title: 'Camperas',
      description: 'Estilo retro',
      image: 'https://dcdn.mitiendanube.com/stores/004/538/129/products/5be21f59-abd3-4fdc-93e6-1868d13d7b0b-059c63dc44e27f08e317164230983693-1024-1024.jpg'
    },
    {
      title: 'Camisetas',
      description: 'Diseños únicos',
      image: 'https://http2.mlstatic.com/D_954777-MLA79820582713_102024-O.jpg'
    },
    {
      title: 'Pantalones',
      description: 'Cortes clásicos',
      image: 'https://i.pinimg.com/736x/84/19/4e/84194ef7ebde4901ea2cafa64f9f3a5d.jpg'
    }
  ];

  const featuredCollections = [
    {
      title: 'Colección Verano',
      description: 'Revive la época dorada',
      filterType: 'era',
      filterValue: 'Verano'
    },
    {
      title: 'Deportivo Vintage',
      description: 'Estilo retro deportivo',
      filterType: 'style',
      filterValue: 'Deportivo'
    },
    {
      title: 'Urban Classic',
      description: 'Lo mejor del estilo urbano',
      filterType: 'style',
      filterValue: 'Urbano'
    }
  ];

  const handleCategoryClick = (category) => {
    const newFilters = {
      category: [category],
      brand: [],
      style: [],
      era: [],
      size: [],
      sex: [],
      color: [],
      material: [],
      priceRange: { min: 0, max: 999999 }
    };

    dispatch(setActiveFilters(newFilters));
    navigate('/products');
  };

  const handleCollectionClick = (filterType, filterValue) => {
    const newFilters = {
      category: [],
      brand: [],
      style: [],
      era: [],
      size: [],
      sex: [],
      color: [],
      material: [],
      priceRange: { min: 0, max: 999999 }
    };

    // Asignar el valor del filtro al tipo correspondiente
    newFilters[filterType] = [filterValue];

    dispatch(setActiveFilters(newFilters));
    navigate('/products');
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[70vh] bg-gray-900">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative container mx-auto h-full flex flex-col items-center justify-center text-white text-center px-4">
          <h1 className="text-5xl font-bold mb-6">Vintacci</h1>
          <p className="text-xl mb-8 max-w-2xl">
            Descubre nuestra colección única de ropa vintage. Donde el estilo del pasado 
            se encuentra con la moda contemporánea.
          </p>
          <Link
            to="/products"
            className="bg-white text-gray-900 hover:bg-gray-100 font-bold py-3 px-8 rounded-full 
                     transition duration-300 ease-in-out transform hover:scale-105"
          >
            Explorar Colección
          </Link>
        </div>
      </div>

      {/* Categorías Principales */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Categorías Principales</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {mainCategories.map((category) => (
              <div
                key={category.title}
                onClick={() => handleCategoryClick(category.title)}
                className="group cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-lg shadow-lg">
                  <img
                    src={category.image}
                    alt={category.title}
                    className="w-full h-64 object-cover transition duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent">
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-xl font-bold text-white mb-2">{category.title}</h3>
                      <p className="text-gray-200">{category.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Colecciones Destacadas */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Colecciones Destacadas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredCollections.map((collection) => (
              <div
                key={collection.title}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow 
                         duration-300 cursor-pointer p-6 text-center"
              >
                <h3 className="text-xl font-bold mb-3">{collection.title}</h3>
                <p className="text-gray-600 mb-4">{collection.description}</p>
                <button 
                  onClick={() => handleCollectionClick(collection.filterType, collection.filterValue)}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Ver colección →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Únete a Nuestra Comunidad</h2>
          <p className="mb-8 text-gray-300">
            Recibe las últimas novedades y ofertas exclusivas
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Tu correo electrónico"
              className="flex-1 px-4 py-2 rounded-l-lg text-gray-900"
            />
            <button className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-r-lg font-medium">
              Suscribirse
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;