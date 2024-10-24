import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="home-page font-vintage bg-vintage-bg text-vintage-accent">
      {/* Hero Section */}
      <section 
        className="bg-cover bg-center h-screen flex items-center justify-center text-white" 
        style={{ backgroundImage: "url('https://offloadmedia.feverup.com/cdmxsecreta.com/wp-content/uploads/2023/07/21014525/Lugares-de-ropa-vintage-en-cdmx.jpg')" }}
      >
        <div className="text-center bg-black bg-opacity-50 p-8 rounded-lg"> 
          <h1 className="text-5xl font-bold mb-4">Bienvenido a Vintacci</h1>
          <p className="text-xl mb-6">Ropa vintage de las mejores marcas</p>
          <Link to="/products" className="bg-vintage-highlight hover:bg-vintage-highlight-dark text-white font-bold py-2 px-4 rounded">
            Ver Productos
          </Link>
        </div>
      </section>

      {/* Categories Section */}
      <section className="my-16">
        <h2 className="text-3xl font-bold text-center mb-8">Categorías</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="category-card bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <img src="https://d22fxaf9t8d39k.cloudfront.net/6495fdc16ac9276bdb45d0980794888fbe0df50b90af456100f2a8f92961cdb1188374.jpg" alt="Category 1" className="h-40 w-full object-cover mb-4 rounded-lg" />
            <h3 className="text-xl font-bold">Camperas</h3>
          </div>
          <div className="category-card bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <img src="https://d22fxaf9t8d39k.cloudfront.net/4f72802b2810831d3ec0dbe9f46cf8bf8c4ea0f1a203e36a1061ceb8fa9d7d3c188374.jpg" alt="Category 2" className="h-40 w-full object-cover mb-4 rounded-lg" />
            <h3 className="text-xl font-bold">Hoodies</h3>
          </div>
          <div className="category-card bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdG3ZiPhC_N9zB-kIsxS5lher4ZjGZZanfRNdL9fuOSW_qF3LazuSILxS_DK_ziRQAiYw&usqp=CAU" alt="Category 3" className="h-40 w-full object-cover mb-4 rounded-lg" />
            <h3 className="text-xl font-bold">Jeans</h3>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="my-16">
        <h2 className="text-3xl font-bold text-center mb-8">Productos Destacados</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="product-card bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <img 
                src="https://d22fxaf9t8d39k.cloudfront.net/37c67add3a5dd2e48ad8755491401ffb338e302066d3874c12793b87eb5d0984161191.png" 
                alt="Product 1" 
                className="h-40 w-full object-cover mb-4 rounded-lg" 
            />
            <h3 className="text-xl font-bold">Producto 1</h3>
            <p className="text-gray-700">$49.99</p> {/* Cambiado a un color visible */}
            <button 
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
            >
                Agregar al Carrito
            </button>
          </div>

          <div className="product-card bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <img 
                src="https://d22fxaf9t8d39k.cloudfront.net/37c67add3a5dd2e48ad8755491401ffb338e302066d3874c12793b87eb5d0984161191.png" 
                alt="Product 1" 
                className="h-40 w-full object-cover mb-4 rounded-lg" 
            />
            <h3 className="text-xl font-bold">Producto 1</h3>
            <p className="text-gray-700">$49.99</p> {/* Cambiado a un color visible */}
            <button 
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
            >
                Agregar al Carrito
            </button>
          </div>

          <div className="product-card bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <img 
                src="https://d22fxaf9t8d39k.cloudfront.net/37c67add3a5dd2e48ad8755491401ffb338e302066d3874c12793b87eb5d0984161191.png" 
                alt="Product 1" 
                className="h-40 w-full object-cover mb-4 rounded-lg" 
            />
            <h3 className="text-xl font-bold">Producto 1</h3>
            <p className="text-gray-700">$49.99</p> {/* Cambiado a un color visible */}
            <button 
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
            >
                Agregar al Carrito
            </button>
          </div>

          {/* Repite esto para los otros productos destacados */}
        </div>
      </section>

      {/* About Us Section */}
      <section className="bg-vintage-accent py-12 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Sobre Nosotros</h2>
          <p className="text-lg">En Vintacci nos especializamos en traer las mejores prendas vintage de las marcas más icónicas del mundo. </p>
          <p className="text-lg">Cada pieza es única, cuidadosamente seleccionada para que puedas lucir lo mejor del pasado.</p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
